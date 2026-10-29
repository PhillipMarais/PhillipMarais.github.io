import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, DOCUMENT, inject, signal } from '@angular/core';
import { LogoMark } from '../brand/logo-mark';

/**
 * Pinned header. At the very top of the page the landing already shows the logo, so the header
 * stays hidden and fades in as you scroll. That's a CSS scroll-driven animation (no script);
 * browsers without support simply show it all the time.
 *
 * Shows where you are: the link for the section crossing the middle of the screen is highlighted
 * (IntersectionObserver, so no scroll listener), and a thin line fills as you scroll (pure CSS).
 */
@Component({
  selector: 'app-site-header',
  imports: [LogoMark],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="skip" href="#main">Skip to content</a>
    <header class="site-bar">
      <div class="wrap bar">
        <a class="mark" href="#top" aria-label="Phillip Marais, back to top">
          <app-logo-mark />
        </a>
        <nav aria-label="Sections">
          <ul>
            @for (link of links; track link.id) {
              <li>
                <a
                  [href]="'#' + link.id"
                  [class.current]="active() === link.id"
                  [attr.aria-current]="active() === link.id ? 'true' : null"
                  >{{ link.label }}</a
                >
              </li>
            }
            <li>
              <a class="cv" href="Phillip-Marais-CV.pdf" download="Phillip-Marais-CV.pdf">
                CV
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M12 5v12M7 12l5 5 5-5" /></svg>
                <span class="visually-hidden">(PDF download)</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <span class="progress" aria-hidden="true"></span>
    </header>
  `,
  styles: `
    .skip {
      position: fixed;
      left: var(--gutter);
      top: -4rem;
      z-index: 40;
      padding: 0.6rem 1rem;
      background: var(--brand);
      color: var(--brand-ink);
      border-radius: var(--radius);
    }
    .skip:focus {
      top: 0.75rem;
    }
    .site-bar {
      position: fixed;
      inset: 0 0 auto;
      z-index: 20;
      background: var(--paper);
      border-bottom: 1px solid var(--rule);
    }
    @supports (animation-timeline: scroll()) {
      .site-bar {
        animation: reveal linear both;
        animation-timeline: scroll(root);
        animation-range: 0 140px;
      }
      /* Keyboard users can always reach it */
      .site-bar:focus-within {
        animation: none;
      }
    }
    /* Fades in; visibility keeps the invisible bar from catching clicks at the very top */
    @keyframes reveal {
      from {
        opacity: 0;
        visibility: hidden;
      }
    }
    .bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.25rem 1.5rem;
      min-height: 4.5rem;
      padding-block: 0.6rem;
      /* Room for the pinned theme toggle */
      padding-right: calc(var(--gutter) + 3.5rem);
    }
    .mark {
      display: block;
      width: 4.5rem;
      padding-block: 0.25rem;
    }
    nav {
      flex-basis: 100%;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      gap: 0 1.1rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    nav a {
      display: inline-block;
      padding-block: 0.3rem;
      color: var(--ink-soft);
      font-size: var(--step--1);
      text-decoration: none;
    }
    nav a {
      position: relative;
      transition: color 0.25s;
    }
    nav a:hover {
      color: var(--ink);
    }
    /* Orange underline that grows in under the current section's link */
    nav a::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: var(--brand);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.35s var(--ease-out);
    }
    nav a:hover::after {
      transform: scaleX(0.4);
    }
    nav a.current {
      color: var(--ink);
      font-weight: 500;
    }
    nav a.current::after {
      transform: scaleX(1);
    }
    /* CV download: a small outlined pill so it reads as an action, not a section */
    nav a.cv {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.2rem 0.7rem;
      color: var(--ink);
      border: 1px solid var(--brand);
      border-radius: 999px;
      transition:
        background-color 0.2s,
        color 0.2s;
    }
    nav a.cv::after {
      display: none;
    }
    nav a.cv:hover {
      color: var(--brand-ink);
      background: var(--brand);
    }
    nav a.cv svg {
      fill: none;
      stroke: currentColor;
      stroke-width: 2.2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    /* Scroll progress along the bottom edge of the header */
    .progress {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -1px;
      height: 2px;
      background: var(--brand);
      transform: scaleX(0);
      transform-origin: left;
    }
    @supports (animation-timeline: scroll()) {
      .progress {
        animation: progress linear both;
        animation-timeline: scroll(root);
      }
    }
    @keyframes progress {
      to {
        transform: scaleX(1);
      }
    }
    @media (min-width: 40rem) {
      nav {
        flex-basis: auto;
        margin-left: auto;
      }
    }
  `,
})
export class SiteHeader {
  /** Id of the section crossing the middle of the screen, or null on the landing. */
  protected readonly active = signal<string | null>(null);

  constructor() {
    const doc = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      // A thin band around the middle of the viewport: whichever section overlaps it is "current".
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) this.active.set(entry.target.id);
            else if (this.active() === entry.target.id) this.active.set(null);
          }
        },
        { rootMargin: '-45% 0px -54% 0px' },
      );
      for (const link of this.links) {
        const section = doc.getElementById(link.id);
        if (section) observer.observe(section);
      }
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected readonly links = [
    { id: 'about', label: 'About' },
    { id: 'career', label: 'Career' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];
}
