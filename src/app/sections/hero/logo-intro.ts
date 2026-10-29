import { ChangeDetectionStrategy, Component, ElementRef, inject } from '@angular/core';
import { LOGO_PIECES, LOGO_VIEWBOX } from '../../brand/logo';

/**
 * The MTS mark, front-facing. The pieces slide in and lock together once on load, then it stays
 * still. Pure CSS: each piece is its own SVG so the browser can move it on the compositor, and only
 * transform and opacity animate.
 */
@Component({
  selector: 'app-logo-intro',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="logo" role="img" aria-label="MTS logo">
      @for (piece of pieces; track piece.id) {
        @if (piece.tone === 'brand') {
          <!-- Pre-blurred copy behind the orange piece; only its opacity animates -->
          <svg class="glow" [attr.viewBox]="viewBox" [style.--from]="piece.from" [style.--delay]="piece.delayMs + 'ms'" aria-hidden="true">
            <path [attr.d]="piece.d" />
          </svg>
        }
        <svg
          class="piece"
          [class.brand]="piece.tone === 'brand'"
          [attr.viewBox]="viewBox"
          [style.--from]="piece.from"
          [style.--delay]="piece.delayMs + 'ms'"
          aria-hidden="true"
        >
          <path [attr.d]="piece.d" />
        </svg>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .logo {
      position: relative;
      aspect-ratio: 470 / 152;
    }
    svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    .piece {
      animation: assemble 1.1s var(--ease-out) var(--delay) both;
    }
    .piece path {
      fill: var(--ink);
    }
    .piece.brand path {
      fill: var(--brand);
    }
    .glow {
      filter: blur(12px);
      opacity: var(--glow-rest);
      animation:
        assemble 1.1s var(--ease-out) var(--delay) both,
        ignite 1.4s ease-out calc(var(--delay) + 0.9s) both;
    }
    .glow path {
      fill: var(--brand);
    }
    @keyframes assemble {
      from {
        transform: var(--from);
        opacity: 0;
      }
      40% {
        opacity: 1;
      }
    }
    @keyframes ignite {
      0% {
        opacity: 0;
      }
      35% {
        opacity: var(--glow-peak);
      }
      100% {
        opacity: var(--glow-rest);
      }
    }
  `,
})
export class LogoIntro {
  protected readonly viewBox = LOGO_VIEWBOX;
  protected readonly pieces = LOGO_PIECES;
  /** Host element, so the landing's particle field knows where pulses start. */
  readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /** A brief glow swell on the orange pieces, timed with each pulse ring. Opacity/transform only. */
  pulse(): void {
    const styles = getComputedStyle(this.element);
    const rest = parseFloat(styles.getPropertyValue('--glow-rest')) || 0;
    const peak = Math.max(parseFloat(styles.getPropertyValue('--glow-peak')) || 0.35, rest + 0.3);
    for (const glow of this.element.querySelectorAll<SVGElement>('.glow')) {
      glow.animate([{ opacity: rest }, { opacity: peak, offset: 0.25 }, { opacity: rest }], {
        duration: 1100,
        easing: 'ease-out',
      });
    }
    this.element.querySelector('.logo')?.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.012)', offset: 0.2 }, { transform: 'scale(1)' }],
      { duration: 900, easing: 'ease-out' },
    );
  }
}
