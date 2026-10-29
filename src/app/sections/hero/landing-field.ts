import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  output,
  viewChild,
} from '@angular/core';

/** Time between pulses from the logo. */
const PULSE_EVERY_MS = 4200;
/** First pulse waits for the logo to finish assembling. */
const FIRST_PULSE_MS = 2600;
/** How fast a pulse ring grows (px per ms) and how long it lives. */
const PULSE_SPEED = 0.55;
const PULSE_LIFE_MS = 2200;
/** Width of the ring band that pushes particles. */
const PULSE_BAND = 46;
const REPEL_RADIUS = 80;

interface Pulse {
  x: number;
  y: number;
  start: number;
}

/**
 * Sparse particles behind the landing. The logo sends out pulses: an expanding ring that nudges
 * and lights up the dots it passes. Dots don't drift on their own, so once a pulse has passed and
 * everything has settled the loop stops completely until the next pulse.
 */
@Component({
  selector: 'app-landing-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas aria-hidden="true"></canvas>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      display: block;
      pointer-events: none;
    }
    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  `,
})
export class LandingField {
  /** Element the pulses come from (the logo). */
  readonly origin = input.required<HTMLElement>();
  /** Fires as each pulse leaves the logo, so the logo can glow in time with it. */
  readonly pulsed = output<void>();

  private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly doc = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  private ctx: CanvasRenderingContext2D | null = null;
  private width = 0;
  private height = 0;
  private count = 0;
  private hx = new Float32Array(0);
  private hy = new Float32Array(0);
  private x = new Float32Array(0);
  private y = new Float32Array(0);
  private vx = new Float32Array(0);
  private vy = new Float32Array(0);
  private size = new Float32Array(0);
  private alpha = new Float32Array(0);
  /** Extra brightness from a recent pulse; fades out. */
  private glow = new Float32Array(0);
  private tone = new Uint8Array(0);

  private pulses: Pulse[] = [];
  private colors = ['#ff6a13', '#a8a39c'];
  private additive = false;
  private pointer = { x: 0, y: 0, inside: false };
  private inView = false;
  private reduced = false;
  private frame = 0;
  private pulseTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const win = this.doc.defaultView!;
      this.ctx = this.canvasRef().nativeElement.getContext('2d');
      if (!this.ctx) return;
      const reducedQuery = win.matchMedia('(prefers-reduced-motion: reduce)');
      this.reduced = reducedQuery.matches;
      this.readColors();

      const resize = new ResizeObserver(() => this.resize());
      resize.observe(this.host);

      const visible = new IntersectionObserver(([entry]) => {
        this.inView = entry.isIntersecting;
        this.schedulePulse(this.pulses.length ? PULSE_EVERY_MS : FIRST_PULSE_MS);
      });
      visible.observe(this.host);

      // The canvas ignores the pointer (so text stays selectable); listen on the landing itself
      const area = this.host.parentElement ?? this.host;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || this.reduced) return;
        const rect = this.host.getBoundingClientRect();
        this.pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top, inside: true };
        this.start();
      };
      const onLeave = () => (this.pointer.inside = false);
      area.addEventListener('pointermove', onMove, { passive: true });
      area.addEventListener('pointerleave', onLeave);

      const themeQuery = win.matchMedia('(prefers-color-scheme: dark)');
      const onTheme = () => {
        this.readColors();
        this.draw(performance.now());
      };
      const themeAttr = new MutationObserver(onTheme);
      themeAttr.observe(this.doc.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      themeQuery.addEventListener('change', onTheme);
      const onReduced = () => (this.reduced = reducedQuery.matches);
      reducedQuery.addEventListener('change', onReduced);
      const onVisibility = () => this.schedulePulse(PULSE_EVERY_MS);
      this.doc.addEventListener('visibilitychange', onVisibility);

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(this.frame);
        clearTimeout(this.pulseTimer);
        resize.disconnect();
        visible.disconnect();
        themeAttr.disconnect();
        themeQuery.removeEventListener('change', onTheme);
        reducedQuery.removeEventListener('change', onReduced);
        area.removeEventListener('pointermove', onMove);
        area.removeEventListener('pointerleave', onLeave);
        this.doc.removeEventListener('visibilitychange', onVisibility);
      });
    });
  }

  private resize(): void {
    const rect = this.host.getBoundingClientRect();
    if (!rect.width || !rect.height || !this.ctx) return;
    this.width = rect.width;
    this.height = rect.height;
    const canvas = this.canvasRef().nativeElement;
    const dpr = Math.min(this.doc.defaultView?.devicePixelRatio ?? 1, 1.5);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cores = navigator.hardwareConcurrency ?? 4;
    const n = Math.round(Math.min(240, Math.max(60, (rect.width * rect.height) / 7000)) * (cores <= 4 ? 0.6 : 1));
    this.allocate(n);
    this.draw(performance.now());
  }

  private allocate(n: number): void {
    this.count = n;
    this.hx = new Float32Array(n);
    this.hy = new Float32Array(n);
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.size = new Float32Array(n);
    this.alpha = new Float32Array(n);
    this.glow = new Float32Array(n);
    this.tone = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      this.hx[i] = this.x[i] = Math.random() * this.width;
      this.hy[i] = this.y[i] = Math.random() * this.height;
      this.tone[i] = Math.random() < 0.55 ? 0 : 1;
      this.size[i] = 1 + Math.random() * 1.4;
      this.alpha[i] = 0.18 + Math.random() * 0.35;
    }
  }

  private schedulePulse(delay: number): void {
    clearTimeout(this.pulseTimer);
    if (this.reduced || !this.inView || this.doc.hidden) return;
    this.pulseTimer = setTimeout(() => this.firePulse(), delay);
  }

  private firePulse(): void {
    const logo = this.origin().getBoundingClientRect();
    const field = this.host.getBoundingClientRect();
    this.pulses.push({
      x: logo.left + logo.width / 2 - field.left,
      y: logo.top + logo.height / 2 - field.top,
      start: performance.now(),
    });
    this.pulsed.emit();
    this.start();
    this.schedulePulse(PULSE_EVERY_MS);
  }

  private start(): void {
    if (this.frame || this.reduced || !this.inView || this.doc.hidden) return;
    this.frame = requestAnimationFrame((now) => this.tick(now));
  }

  private tick(now: number): void {
    this.frame = 0;
    this.pulses = this.pulses.filter((p) => now - p.start < PULSE_LIFE_MS);
    const r2 = REPEL_RADIUS * REPEL_RADIUS;
    let energy = 0;

    for (let i = 0; i < this.count; i++) {
      let ax = (this.hx[i] - this.x[i]) * 0.03;
      let ay = (this.hy[i] - this.y[i]) * 0.03;

      for (const p of this.pulses) {
        const age = this.age(p, now);
        const radius = age * PULSE_SPEED;
        const dx = this.x[i] - p.x;
        const dy = this.y[i] - p.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const gap = Math.abs(d - radius);
        if (gap < PULSE_BAND) {
          const k = (1 - gap / PULSE_BAND) * (1 - age / PULSE_LIFE_MS);
          ax += (dx / d) * k * 1.6;
          ay += (dy / d) * k * 1.6;
          if (k > this.glow[i]) this.glow[i] = k;
        }
      }

      if (this.pointer.inside) {
        const dx = this.x[i] - this.pointer.x;
        const dy = this.y[i] - this.pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d / REPEL_RADIUS) * 2;
          ax += (dx / d) * force;
          ay += (dy / d) * force;
        }
      }

      this.vx[i] = (this.vx[i] + ax) * 0.86;
      this.vy[i] = (this.vy[i] + ay) * 0.86;
      this.x[i] += this.vx[i];
      this.y[i] += this.vy[i];
      this.glow[i] *= 0.95;
      energy += Math.abs(this.vx[i]) + Math.abs(this.vy[i]) + this.glow[i];
    }

    this.draw(now);
    if (this.pulses.length || energy / this.count > 0.01) this.start();
  }

  private draw(now: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.globalCompositeOperation = this.additive ? 'lighter' : 'source-over';

    // Pulse rings: faint, fading as they grow
    ctx.strokeStyle = this.colors[0];
    ctx.lineWidth = 1.5;
    for (const p of this.pulses) {
      const age = this.age(p, now);
      ctx.globalAlpha = (1 - age / PULSE_LIFE_MS) * 0.22;
      ctx.beginPath();
      ctx.arc(p.x, p.y, age * PULSE_SPEED, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let tone = 0; tone < 2; tone++) {
      ctx.fillStyle = this.colors[tone];
      for (let i = 0; i < this.count; i++) {
        if (this.tone[i] !== tone) continue;
        const s = this.size[i] * (1 + this.glow[i] * 0.8);
        ctx.globalAlpha = Math.min(1, this.alpha[i] + this.glow[i] * 0.7);
        ctx.fillRect(this.x[i] - s / 2, this.y[i] - s / 2, s, s);
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Milliseconds since a pulse started. A frame's timestamp is when the frame began, which can be
   * slightly before the pulse was created; clamp so the ring never gets a negative radius
   * (canvas arc() throws on that, which would stop the loop).
   */
  private age(p: Pulse, now: number): number {
    return Math.max(0, now - p.start);
  }

  private readColors(): void {
    const styles = getComputedStyle(this.host);
    this.colors = [
      styles.getPropertyValue('--brand').trim() || '#ff6a13',
      styles.getPropertyValue('--ink-soft').trim() || '#a8a39c',
    ];
    this.additive = getComputedStyle(this.doc.documentElement).colorScheme.includes('dark');
  }
}
