import { DOCUMENT, inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

/** Light/dark theme. Starts from a saved choice (applied pre-paint in index.html) or the OS setting. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc = inject(DOCUMENT);
  private readonly win = this.doc.defaultView;
  readonly theme = signal<Theme>(this.initial());

  toggle(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    this.doc.documentElement.setAttribute('data-theme', next);
    try {
      this.win?.localStorage.setItem('theme', next);
    } catch {
      // Storage can be blocked; the choice still applies for this visit.
    }
  }

  private initial(): Theme {
    const saved = this.doc.documentElement.getAttribute('data-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return this.win?.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
