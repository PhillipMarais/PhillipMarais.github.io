import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { prefersReducedMotion } from '../../core/motion';
import { LegacyScreen } from './legacy-screen';
import { ModernScreen } from './modern-screen';

const clamp = (n: number) => Math.min(100, Math.max(0, n));

@Component({
  selector: 'app-migration-slider',
  imports: [LegacyScreen, ModernScreen],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './migration-slider.html',
  styleUrl: './migration-slider.css',
})
export class MigrationSlider {
  /** Divider position from the left edge, 0 to 100. */
  protected readonly pos = signal(50);
  protected readonly dragging = signal(false);
  protected readonly rounded = computed(() => Math.round(this.pos()));
  protected readonly valueText = computed(
    () => `AngularJS 1.8.2 on the left ${this.rounded()}%, Angular 19 on the right ${100 - this.rounded()}%`,
  );

  private readonly frame = viewChild.required<ElementRef<HTMLElement>>('frame');
  private readonly handle = viewChild.required<ElementRef<HTMLElement>>('handle');
  private readonly reducedMotion = prefersReducedMotion();
  private nudge?: Animation;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      if (this.reducedMotion()) return;
      const frame = this.frame().nativeElement;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          this.nudge = frame.animate([{ '--p': 50 }, { '--p': 36 }, { '--p': 62 }, { '--p': 50 }], {
            duration: 1800,
            delay: 500,
            easing: 'ease-in-out',
          });
        },
        { threshold: 0.6 },
      );
      observer.observe(frame);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected onPointerDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    this.stopNudge();
    this.frame().nativeElement.setPointerCapture(event.pointerId);
    this.dragging.set(true);
    this.handle().nativeElement.focus({ preventScroll: true });
    // Touch waits for a horizontal move so a tap or vertical scroll doesn't jump the divider.
    if (event.pointerType === 'mouse') this.moveTo(event.clientX);
  }

  protected onPointerMove(event: PointerEvent): void {
    if (this.dragging()) this.moveTo(event.clientX);
  }

  protected onPointerUp(event: PointerEvent): void {
    this.dragging.set(false);
    this.frame().nativeElement.releasePointerCapture?.(event.pointerId);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const steps: Record<string, number> = {
      ArrowLeft: -5,
      ArrowDown: -5,
      ArrowRight: 5,
      ArrowUp: 5,
      PageDown: -20,
      PageUp: 20,
    };
    let next: number | undefined;
    if (event.key in steps) next = this.pos() + steps[event.key];
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    if (next === undefined) return;
    event.preventDefault();
    this.stopNudge();
    this.pos.set(clamp(next));
  }

  private moveTo(clientX: number): void {
    const rect = this.frame().nativeElement.getBoundingClientRect();
    this.pos.set(clamp(((clientX - rect.left) / rect.width) * 100));
  }

  private stopNudge(): void {
    this.nudge?.cancel();
    this.nudge = undefined;
  }
}
