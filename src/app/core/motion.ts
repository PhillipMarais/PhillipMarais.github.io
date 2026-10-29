import { DOCUMENT, inject, signal, Signal } from '@angular/core';

/** Tracks `prefers-reduced-motion`. Reads as `true` on the server so nothing animates before hydration. */
export function prefersReducedMotion(): Signal<boolean> {
  const win = inject(DOCUMENT).defaultView;
  const query = win?.matchMedia?.('(prefers-reduced-motion: reduce)');
  const reduced = signal(query ? query.matches : true);
  query?.addEventListener('change', (e) => reduced.set(e.matches));
  return reduced.asReadonly();
}
