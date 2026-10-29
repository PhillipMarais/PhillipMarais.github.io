import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LogoMark } from '../brand/logo-mark';

@Component({
  selector: 'app-site-footer',
  imports: [LogoMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="wrap bar">
        <app-logo-mark class="mark" />
        <p class="copy">© {{ year }} Phillip Marais</p>
        <a class="top" href="#top">
          Back to top
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
        </a>
      </div>
    </footer>
  `,
  styles: `
    .footer {
      border-top: 1px solid var(--rule);
    }
    .bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.75rem 1.5rem;
      /* Extra room at the bottom so the floating chat button never covers the links */
      padding-block: 1.75rem calc(5.5rem + env(safe-area-inset-bottom, 0px));
    }
    .mark {
      width: 3.75rem;
    }
    .copy {
      font-size: var(--step--1);
      color: var(--ink-soft);
    }
    .top {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-left: auto;
      font-size: var(--step--1);
      color: var(--ink-soft);
      text-decoration: none;
    }
    .top:hover {
      color: var(--accent);
    }
    .top svg {
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      transition: transform 0.3s var(--ease-out);
    }
    .top:hover svg {
      transform: translateY(-3px);
    }
    @media (min-width: 40rem) {
      .bar {
        padding-block-end: 1.75rem;
      }
    }
  `,
})
export class SiteFooter {
  protected readonly year = new Date().getFullYear();
}
