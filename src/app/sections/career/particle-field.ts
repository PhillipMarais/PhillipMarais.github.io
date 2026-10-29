import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';

export type FieldShape = 'gauge' | 'tower' | 'cap';

/** Share of particles that drift loose around the shape instead of forming it. */
const AMBIENT = 0.14;
/** Pointer push-away radius in CSS pixels. */
const REPEL_RADIUS = 90;

/**
 * Decorative particle cloud that forms a shape and scatters away from the mouse.
 * One canvas, typed arrays, no per-frame allocation. The loop runs only while particles are moving,
 * the field is on screen and the tab is visible; it stops completely once everything settles.
 * Reduced motion: the shape is drawn already formed, with no movement.
 */
@Component({
  selector: 'app-particle-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: `
    :host {
      display: block;
      position: relative;
    }
    canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  `,
})
export class ParticleField {
  readonly shape = input.required<FieldShape>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly doc = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private ctx: CanvasRenderingContext2D | null = null;
  private ready = false;
  private width = 0;
  private height = 0;
  private count = 0;
  private x = new Float32Array(0);
  private y = new Float32Array(0);
  private vx = new Float32Array(0);
  private vy = new Float32Array(0);
  private tx = new Float32Array(0);
  private ty = new Float32Array(0);
  private size = new Float32Array(0);
  private alpha = new Float32Array(0);
  private delay = new Uint8Array(0);
  /** 0 = brand orange, 1 = ink, 2 = soft ink (ambient). */
  private tone = new Uint8Array(0);

  private colors = ['#ff6a13', '#f2efea', '#a8a39c'];
  private additive = false;
  private pointer = { x: 0, y: 0, inside: false };
  private inView = false;
  private reduced = false;
  private frame = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);

    effect(() => {
      const shape = this.shape();
      if (this.ready) this.morph(shape, true);
    });

    afterNextRender(() => {
      const win = this.doc.defaultView!;
      const canvas = this.canvasRef().nativeElement;
      this.ctx = canvas.getContext('2d');
      if (!this.ctx) return;
      const reducedQuery = win.matchMedia('(prefers-reduced-motion: reduce)');
      this.reduced = reducedQuery.matches;
      this.readColors();

      const resize = new ResizeObserver(() => this.resize());
      resize.observe(this.host);

      const visible = new IntersectionObserver(([entry]) => {
        this.inView = entry.isIntersecting;
        if (this.inView) this.start();
      });
      visible.observe(this.host);

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || this.reduced) return;
        const rect = canvas.getBoundingClientRect();
        this.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true };
        this.start();
      };
      const onLeave = () => {
        this.pointer.inside = false;
        this.start();
      };
      this.host.addEventListener('pointermove', onMove, { passive: true });
      this.host.addEventListener('pointerleave', onLeave);

      // Re-read colours when the theme changes (toggle or OS setting)
      const themeQuery = win.matchMedia('(prefers-color-scheme: dark)');
      const onTheme = () => {
        this.readColors();
        this.draw();
      };
      const themeAttr = new MutationObserver(onTheme);
      themeAttr.observe(this.doc.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      themeQuery.addEventListener('change', onTheme);
      const onReduced = () => (this.reduced = reducedQuery.matches);
      reducedQuery.addEventListener('change', onReduced);
      const onVisibility = () => !this.doc.hidden && this.start();
      this.doc.addEventListener('visibilitychange', onVisibility);

      this.ready = true;
      this.resize();

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(this.frame);
        resize.disconnect();
        visible.disconnect();
        themeAttr.disconnect();
        themeQuery.removeEventListener('change', onTheme);
        reducedQuery.removeEventListener('change', onReduced);
        this.host.removeEventListener('pointermove', onMove);
        this.host.removeEventListener('pointerleave', onLeave);
        this.doc.removeEventListener('visibilitychange', onVisibility);
      });
    });
  }

  private resize(): void {
    const canvas = this.canvasRef().nativeElement;
    const rect = this.host.getBoundingClientRect();
    if (!rect.width || !rect.height || !this.ctx) return;
    this.width = rect.width;
    this.height = rect.height;
    const dpr = Math.min(this.doc.defaultView?.devicePixelRatio ?? 1, 1.5);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fewer particles on small fields and on low-core devices
    const cores = navigator.hardwareConcurrency ?? 4;
    const wanted = Math.round(Math.min(1800, Math.max(500, (rect.width * rect.height) / 140)) * (cores <= 4 ? 0.6 : 1));
    if (wanted !== this.count) this.allocate(wanted);
    this.morph(this.shape(), false);
  }

  private allocate(n: number): void {
    this.count = n;
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.tx = new Float32Array(n);
    this.ty = new Float32Array(n);
    this.size = new Float32Array(n);
    this.alpha = new Float32Array(n);
    this.delay = new Uint8Array(n);
    this.tone = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      this.x[i] = Math.random() * this.width;
      this.y[i] = Math.random() * this.height;
      const ambient = i < n * AMBIENT;
      const r = Math.random();
      this.tone[i] = ambient ? 2 : r < 0.72 ? 0 : 1;
      this.size[i] = ambient ? 0.8 + Math.random() * 0.8 : 1 + Math.random() * 1.6;
      this.alpha[i] = ambient ? 0.25 + Math.random() * 0.3 : 0.45 + Math.random() * 0.55;
    }
  }

  /** Sends every particle to a new spot on the given shape. */
  private morph(shape: FieldShape, scatter: boolean): void {
    if (!this.count) return;
    const points = this.sample(shape);
    if (!points.length) return;
    for (let i = 0; i < this.count; i++) {
      if (i < this.count * AMBIENT) {
        this.tx[i] = Math.random() * this.width;
        this.ty[i] = Math.random() * this.height;
      } else {
        const p = (Math.random() * (points.length / 2)) | 0;
        this.tx[i] = points[p * 2] + (Math.random() - 0.5) * 2.5;
        this.ty[i] = points[p * 2 + 1] + (Math.random() - 0.5) * 2.5;
      }
      if (scatter && !this.reduced) {
        // A small burst outward before they regroup, staggered so the shape assembles in waves
        this.vx[i] += (Math.random() - 0.5) * 9;
        this.vy[i] += (Math.random() - 0.5) * 9;
        this.delay[i] = (Math.random() * 18) | 0;
      }
    }
    if (this.reduced) {
      this.x.set(this.tx);
      this.y.set(this.ty);
      this.draw();
    } else {
      this.start();
    }
  }

  /** Draws the shape off screen and returns a flat [x, y, x, y, ...] list of filled pixels. */
  private sample(shape: FieldShape): number[] {
    const w = Math.round(this.width);
    const h = Math.round(this.height);
    const off = this.doc.createElement('canvas');
    off.width = w;
    off.height = h;
    const o = off.getContext('2d', { willReadFrequently: true });
    if (!o) return [];
    o.strokeStyle = o.fillStyle = '#fff';
    o.lineCap = 'round';
    o.lineJoin = 'round';
    DRAW[shape](o, w, h);
    const data = o.getImageData(0, 0, w, h).data;
    const step = 3;
    const points: number[] = [];
    for (let py = 0; py < h; py += step) {
      for (let px = 0; px < w; px += step) {
        if (data[(py * w + px) * 4 + 3] > 128) points.push(px, py);
      }
    }
    return points;
  }

  private start(): void {
    if (this.frame || this.reduced || !this.inView || this.doc.hidden || !this.ready) return;
    this.frame = requestAnimationFrame(() => this.tick());
  }

  private tick(): void {
    this.frame = 0;
    const { pointer } = this;
    const r2 = REPEL_RADIUS * REPEL_RADIUS;
    let energy = 0;
    let waiting = 0;
    for (let i = 0; i < this.count; i++) {
      if (this.delay[i]) {
        this.delay[i]--;
        waiting++;
        continue;
      }
      let ax = (this.tx[i] - this.x[i]) * 0.022;
      let ay = (this.ty[i] - this.y[i]) * 0.022;
      if (pointer.inside) {
        const dx = this.x[i] - pointer.x;
        const dy = this.y[i] - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d / REPEL_RADIUS) * 2.4;
          ax += (dx / d) * force;
          ay += (dy / d) * force;
        }
      }
      this.vx[i] = (this.vx[i] + ax) * 0.86;
      this.vy[i] = (this.vy[i] + ay) * 0.86;
      this.x[i] += this.vx[i];
      this.y[i] += this.vy[i];
      energy += Math.abs(this.vx[i]) + Math.abs(this.vy[i]);
    }
    this.draw();
    // Stop once the average particle has (nearly) stopped and nobody is still waiting to move
    if (waiting || energy / this.count > 0.02) this.start();
  }

  private draw(): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = this.additive ? 'lighter' : 'source-over';
    for (let tone = 0; tone < 3; tone++) {
      ctx.fillStyle = this.colors[tone];
      for (let i = 0; i < this.count; i++) {
        if (this.tone[i] !== tone) continue;
        const s = this.size[i];
        ctx.globalAlpha = this.alpha[i];
        ctx.fillRect(this.x[i] - s / 2, this.y[i] - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  private readColors(): void {
    const styles = getComputedStyle(this.host);
    const read = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;
    this.colors = [read('--brand', '#ff6a13'), read('--ink', '#141414'), read('--ink-soft', '#57534d')];
    // Light glows add up nicely on a dark page; on a light page they'd wash out
    this.additive = getComputedStyle(this.doc.documentElement).colorScheme.includes('dark');
  }
}

type Draw = (o: CanvasRenderingContext2D, w: number, h: number) => void;

/** Shapes drawn in white on an off-screen canvas; their pixels become the particle targets. */
const DRAW: Record<FieldShape, Draw> = {
  /** Speedometer: outer arc, ticks, inner arc, needle and hub. */
  gauge(o, w, h) {
    const u = Math.min(w, h);
    const cx = w / 2;
    const cy = h * 0.56;
    const R = u * 0.42;
    const from = Math.PI * 0.8;
    const to = Math.PI * 2.2;
    o.lineWidth = u * 0.035;
    o.beginPath();
    o.arc(cx, cy, R, from, to);
    o.stroke();
    for (let k = 0; k <= 24; k++) {
      const a = from + (k * (to - from)) / 24;
      const inner = k % 4 === 0 ? R * 0.66 : R * 0.74;
      o.lineWidth = k % 4 === 0 ? u * 0.024 : u * 0.014;
      o.beginPath();
      o.moveTo(cx + Math.cos(a) * R * 0.86, cy + Math.sin(a) * R * 0.86);
      o.lineTo(cx + Math.cos(a) * inner, cy + Math.sin(a) * inner);
      o.stroke();
    }
    o.lineWidth = u * 0.018;
    o.beginPath();
    o.arc(cx, cy, R * 0.46, Math.PI * 0.85, Math.PI * 2.15);
    o.stroke();
    const needle = Math.PI * 1.88;
    o.lineWidth = u * 0.03;
    o.beginPath();
    o.moveTo(cx, cy);
    o.lineTo(cx + Math.cos(needle) * R * 0.78, cy + Math.sin(needle) * R * 0.78);
    o.stroke();
    o.lineWidth = u * 0.025;
    o.beginPath();
    o.arc(cx, cy, R * 0.11, 0, Math.PI * 2);
    o.stroke();
  },

  /** Lattice cell tower with signal waves either side of the antenna. */
  tower(o, w, h) {
    const u = Math.min(w, h);
    const cx = w / 2;
    const top = h * 0.26;
    const base = h * 0.9;
    const half = u * 0.19;
    const legAt = (t: number) => ({ y: top + (base - top) * t, dx: half * t });
    o.lineWidth = u * 0.026;
    o.beginPath();
    o.moveTo(cx, top);
    o.lineTo(cx - half, base);
    o.moveTo(cx, top);
    o.lineTo(cx + half, base);
    o.stroke();
    o.lineWidth = u * 0.013;
    const levels = [0.25, 0.45, 0.65, 0.85, 1];
    let prev = legAt(0.08);
    for (const t of levels) {
      const p = legAt(t);
      o.beginPath();
      o.moveTo(cx - p.dx, p.y);
      o.lineTo(cx + p.dx, p.y);
      o.moveTo(cx - prev.dx, prev.y);
      o.lineTo(cx + p.dx, p.y);
      o.moveTo(cx + prev.dx, prev.y);
      o.lineTo(cx - p.dx, p.y);
      o.stroke();
      prev = p;
    }
    // Antenna mast and panels
    o.lineWidth = u * 0.02;
    o.beginPath();
    o.moveTo(cx, top);
    o.lineTo(cx, h * 0.12);
    o.stroke();
    o.fillRect(cx - u * 0.05, h * 0.17, u * 0.03, u * 0.08);
    o.fillRect(cx + u * 0.02, h * 0.17, u * 0.03, u * 0.08);
    // Signal waves
    const sy = h * 0.2;
    o.lineWidth = u * 0.018;
    for (const r of [0.12, 0.2, 0.28]) {
      o.beginPath();
      o.arc(cx, sy, u * r, Math.PI * 0.78, Math.PI * 1.22);
      o.stroke();
      o.beginPath();
      o.arc(cx, sy, u * r, -Math.PI * 0.22, Math.PI * 0.22);
      o.stroke();
    }
  },

  /** Graduation cap (mortarboard) with tassel. */
  cap(o, w, h) {
    const u = Math.min(w, h);
    const cx = w / 2;
    const cy = h * 0.42;
    // Skull cap under the board
    o.beginPath();
    o.moveTo(cx - u * 0.22, cy + u * 0.04);
    o.lineTo(cx - u * 0.22, cy + u * 0.22);
    o.quadraticCurveTo(cx, cy + u * 0.32, cx + u * 0.22, cy + u * 0.22);
    o.lineTo(cx + u * 0.22, cy + u * 0.04);
    o.closePath();
    o.fill();
    // Board, with a gap cut around it so it reads separately from the cap
    const board = () => {
      o.beginPath();
      o.moveTo(cx, cy - u * 0.15);
      o.lineTo(cx + u * 0.42, cy);
      o.lineTo(cx, cy + u * 0.15);
      o.lineTo(cx - u * 0.42, cy);
      o.closePath();
    };
    o.globalCompositeOperation = 'destination-out';
    o.lineWidth = u * 0.05;
    board();
    o.stroke();
    o.globalCompositeOperation = 'source-over';
    board();
    o.fill();
    // Tassel
    o.globalCompositeOperation = 'destination-out';
    o.beginPath();
    o.arc(cx, cy, u * 0.035, 0, Math.PI * 2);
    o.fill();
    o.globalCompositeOperation = 'source-over';
    o.lineWidth = u * 0.016;
    o.beginPath();
    o.moveTo(cx, cy);
    o.lineTo(cx + u * 0.3, cy + u * 0.04);
    o.lineTo(cx + u * 0.3, cy + u * 0.3);
    o.stroke();
    o.fillRect(cx + u * 0.28, cy + u * 0.3, u * 0.04, u * 0.08);
  },
};
