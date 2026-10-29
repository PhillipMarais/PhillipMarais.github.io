import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';

/** Soft glows spread evenly along the recent path, so they always overlap into one smear. */
const TRAIL = 28;
/** How many recent frames of movement the smear covers (longer = longer trail). */
const HISTORY_FRAMES = 16;
/** How quickly the ring catches up with the pointer each frame (0–1). */
const RING_EASE = 0.2;
const INTERACTIVE = 'a, button, [role="slider"], [role="tab"], summary, label, input, textarea, select';

/**
 * Orange dot + soft ring + short trail that follow the mouse. Only for a fine pointer that can
 * hover (mouse/trackpad) and when reduced motion is off. Per-frame work writes transforms straight
 * to the DOM (no change detection), and the animation loop stops as soon as the pointer settles.
 */
@Component({
  selector: 'app-custom-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (enabled()) {
      <div class="cursor" [class.hidden]="hidden()" [class.hovering]="hovering()" [class.pressed]="pressed()" aria-hidden="true">
        @for (i of trail; track i) {
          <span #trailDot class="trail" [style.--i]="i"></span>
        }
        <span #ring class="ring"><span class="ring-shape"></span></span>
        <span #dot class="dot"></span>
      </div>
    }
  `,
  styles: `
    .cursor {
      position: fixed;
      inset: 0;
      z-index: 9999;
      pointer-events: none;
      transition: opacity 0.2s;
    }
    .cursor.hidden {
      opacity: 0;
    }
    .dot,
    .ring,
    .trail {
      position: fixed;
      top: 0;
      left: 0;
      will-change: transform;
    }
    .dot {
      width: 6px;
      height: 6px;
      margin: -3px 0 0 -3px;
      background: var(--brand);
      border-radius: 50%;
    }
    .ring {
      width: 34px;
      height: 34px;
      margin: -17px 0 0 -17px;
    }
    .ring-shape {
      display: block;
      width: 100%;
      height: 100%;
      border: 1.5px solid color-mix(in srgb, var(--brand) 65%, transparent);
      border-radius: 50%;
      transition:
        transform 0.25s var(--ease-out),
        background-color 0.25s,
        border-color 0.25s;
    }
    .hovering .ring-shape {
      transform: scale(1.45);
      background: color-mix(in srgb, var(--brand) 10%, transparent);
      border-color: var(--brand);
    }
    .pressed .ring-shape {
      transform: scale(0.8);
    }
/* Trail: soft glows with feathered edges (a gradient, not a blur filter, so it's cheap to draw).
       They overlap frame to frame, reading as one fading motion blur rather than separate dots. */
    .trail {
      width: 28px;
      height: 28px;
      margin: -14px 0 0 -14px;
      /* Wide, flat core so neighbouring glows overlap into one smear even on quick flicks */
      background: radial-gradient(
        circle,
        color-mix(in srgb, var(--brand) 45%, transparent) 0%,
        color-mix(in srgb, var(--brand) 35%, transparent) 40%,
        transparent 70%
      );
      border-radius: 50%;
      opacity: calc(0.22 - var(--i) * 0.0075);
    }
  `,
})
export class CustomCursor {
  protected readonly enabled = signal(false);
  protected readonly hidden = signal(true);
  protected readonly hovering = signal(false);
  protected readonly pressed = signal(false);
  protected readonly trail = Array.from({ length: TRAIL }, (_, i) => i);

  private readonly dot = viewChild<ElementRef<HTMLElement>>('dot');
  private readonly ring = viewChild<ElementRef<HTMLElement>>('ring');
  private readonly trailDots = viewChildren<ElementRef<HTMLElement>>('trailDot');

  private target = { x: -100, y: -100 };
  private ringPos = { x: -100, y: -100 };
  /** Recent pointer positions, newest first; the trail dots sit on every other one. */
  private history: { x: number; y: number }[] = [];
  private frame = 0;

  constructor() {
    const doc = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const win = doc.defaultView;
      if (!win) return;
      const supported = win.matchMedia('(hover: hover) and (pointer: fine)');
      const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        this.target = { x: e.clientX, y: e.clientY };
        if (this.hidden()) {
          // First move (or re-entry): snap everything to the pointer so nothing flies in from a corner
          this.ringPos = { ...this.target };
          this.history = [];
          this.hidden.set(false);
        }
        this.place(this.dot(), this.target.x, this.target.y);
        this.start();
      };
      const onOver = (e: PointerEvent) => this.hovering.set(!!(e.target as Element | null)?.closest?.(INTERACTIVE));
      const onLeave = (e: PointerEvent) => !e.relatedTarget && this.hidden.set(true);
      const onDown = () => this.pressed.set(true);
      const onUp = () => this.pressed.set(false);

      const listeners: [string, EventListener][] = [
        ['pointermove', onMove as EventListener],
        ['pointerover', onOver as EventListener],
        ['pointerout', onLeave as EventListener],
        ['pointerdown', onDown],
        ['pointerup', onUp],
      ];

      const apply = () => {
        const on = supported.matches && !reduced.matches;
        this.enabled.set(on);
        doc.documentElement.classList.toggle('custom-cursor', on);
        for (const [type, fn] of listeners) {
          if (on) doc.addEventListener(type, fn, { passive: true });
          else doc.removeEventListener(type, fn);
        }
        if (!on) cancelAnimationFrame(this.frame);
      };

      apply();
      supported.addEventListener('change', apply);
      reduced.addEventListener('change', apply);
      destroyRef.onDestroy(() => {
        cancelAnimationFrame(this.frame);
        supported.removeEventListener('change', apply);
        reduced.removeEventListener('change', apply);
        for (const [type, fn] of listeners) doc.removeEventListener(type, fn);
        doc.documentElement.classList.remove('custom-cursor');
      });
    });
  }

  private start(): void {
    if (!this.frame) this.frame = requestAnimationFrame(() => this.tick());
  }

  private tick(): void {
    this.frame = 0;
    const { x, y } = this.target;
    this.ringPos.x += (x - this.ringPos.x) * RING_EASE;
    this.ringPos.y += (y - this.ringPos.y) * RING_EASE;
    this.place(this.ring(), this.ringPos.x, this.ringPos.y);

    this.history.unshift({ x, y });
    this.history.length = Math.min(this.history.length, HISTORY_FRAMES + 1);
    this.layTrail();

    // Keep animating until the ring has caught up and the trail has collapsed onto the pointer
    const ringSettled = Math.abs(x - this.ringPos.x) < 0.2 && Math.abs(y - this.ringPos.y) < 0.2;
    const trailSettled = this.history.every((p) => p.x === x && p.y === y);
    if (!ringSettled || !trailSettled || this.history.length < HISTORY_FRAMES + 1) this.start();
  }

  /** Spreads the glows at equal distances along the recent path (newest to oldest), tapering to the tail. */
  private layTrail(): void {
    const dots = this.trailDots();
    const path = this.history;
    const lengths = [0];
    for (let i = 1; i < path.length; i++) {
      lengths.push(lengths[i - 1] + Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y));
    }
    const total = lengths[lengths.length - 1];
    let seg = 1;
    for (let k = 0; k < dots.length; k++) {
      const d = ((k + 1) / dots.length) * total;
      while (seg < path.length - 1 && lengths[seg] < d) seg++;
      const a = path[seg - 1] ?? path[0];
      const b = path[seg] ?? a;
      const span = lengths[seg] - lengths[seg - 1] || 1;
      const t = Math.min(1, Math.max(0, (d - lengths[seg - 1]) / span));
      this.place(dots[k], a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 1 - k / (TRAIL + 8));
    }
  }

  private place(el: ElementRef<HTMLElement> | undefined, x: number, y: number, scale = 1): void {
    if (el) el.nativeElement.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }
}
