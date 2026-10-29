import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LOGO_PIECES, LOGO_VIEWBOX } from './logo';

/** Flat PM mark for small sizes (header). Inherits the theme's ink and brand colours. */
@Component({
  selector: 'app-logo-mark',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg [attr.viewBox]="viewBox" aria-hidden="true" focusable="false">
      @for (piece of pieces; track piece.id) {
        <path [attr.d]="piece.d" [class.brand]="piece.tone === 'brand'" />
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
    path {
      fill: var(--ink);
    }
    path.brand {
      fill: var(--brand);
    }
  `,
})
export class LogoMark {
  protected readonly viewBox = LOGO_VIEWBOX;
  protected readonly pieces = LOGO_PIECES;
}
