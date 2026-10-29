import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from '../core/theme';

/** Light/dark switch, pinned to the top-right corner so it's always within reach while scrolling. */
@Component({
  selector: 'app-theme-toggle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Both icons render; global CSS shows the one for the active theme so prerendered HTML always matches -->
    <button type="button" class="toggle" (click)="theme.toggle()" aria-label="Dark theme" [attr.aria-pressed]="isDark()">
      <svg class="theme-sun" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
      <svg class="theme-moon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
      </svg>
    </button>
  `,
  styles: `
    .toggle {
      position: fixed;
      top: 0.85rem;
      /* Far right edge of the window, matching the chat button below */
      right: calc(1rem + env(safe-area-inset-right, 0px));
      z-index: 30;
      display: grid;
      place-items: center;
      width: 2.75rem;
      height: 2.75rem;
      color: var(--ink);
      background: var(--paper);
      border: 1px solid var(--rule);
      border-radius: 50%;
      box-shadow: 0 4px 14px -8px var(--shadow);
      cursor: pointer;
    }
    .toggle:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    svg {
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
  protected readonly isDark = computed(() => this.theme.theme() === 'dark');
}
