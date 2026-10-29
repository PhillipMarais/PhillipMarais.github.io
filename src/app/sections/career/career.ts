import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  ElementRef,
  inject,
  signal,
} from '@angular/core';
import { prefersReducedMotion } from '../../core/motion';
// Type-only import kept separate so ParticleField can be split into its own lazy chunk
import type { FieldShape } from './particle-field';
import { ParticleField } from './particle-field';

/** How long each career entry's shape shows before the field moves to the next one. */
const CYCLE_MS = 6000;

interface CareerEntry {
  role: string;
  org: string;
  context: string;
  dates: string;
  /** Machine-readable start for <time>. */
  start: string;
  /** What the particle field forms while this entry is active. */
  shape: FieldShape;
  field: string;
}

@Component({
  selector: 'app-career',
  imports: [ParticleField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="career" class="section" aria-labelledby="career-title">
      <div class="wrap">
        <div class="section-head reveal">
          <span class="section-num" aria-hidden="true">02</span>
          <h2 id="career-title" class="section-title">Career</h2>
        </div>
        <div
          class="layout"
          (pointerenter)="hovering.set(true)"
          (pointerleave)="hovering.set(false)"
          (focusin)="focusWithin.set(true)"
          (focusout)="onFocusOut($event)"
        >
          <!-- TODO: add details per role (expandable) once Phillip confirms what to include -->
          <ol class="timeline">
            @for (entry of entries; track entry.org; let i = $index) {
              <li class="entry reveal-left" [class.active]="active() === i" (pointerenter)="active.set(i)" (focusin)="active.set(i)">
                <span class="marker" aria-hidden="true"></span>
                <p class="dates"><time [attr.datetime]="entry.start">{{ entry.dates }}</time></p>
                <h3 class="role">{{ entry.role }}</h3>
                <p class="org">{{ entry.org }}</p>
                <p class="context">{{ entry.context }}</p>
              </li>
            }
          </ol>
          <div class="field-wrap" aria-hidden="true">
            <!-- The particle code only downloads when the field scrolls into view -->
            @defer (on viewport) {
              <app-particle-field class="field" [shape]="current().shape" />
            } @placeholder {
              <div class="field"></div>
            }
            <p class="field-label">{{ current().field }}</p>
            <span class="track">
              @if (autoplay()) {
                <!-- Re-created per entry so the countdown restarts; when it fills, the next shape shows -->
                @for (key of [active()]; track key) {
                  <span
                    class="fill"
                    [class.running]="running()"
                    [style.animation-duration.ms]="cycleMs"
                    (animationend)="next()"
                  ></span>
                }
              }
            </span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    /* Custom elements default to inline; the in-view observer needs a real block box */
    :host {
      display: block;
    }
    .layout {
      display: grid;
      gap: var(--space-l);
    }
    .timeline {
      position: relative;
      display: grid;
      gap: var(--space-xl);
      max-width: 46rem;
      margin: 0;
      padding: 0 0 0 2.25rem;
      list-style: none;
    }
    /* The rail */
    .timeline::before {
      content: '';
      position: absolute;
      top: 0.6rem;
      bottom: 0.6rem;
      left: 0.55rem;
      width: 2px;
      background: linear-gradient(var(--brand), var(--rule) 60%);
    }
    .entry {
      position: relative;
      display: grid;
      gap: 0.2rem;
      padding-block: 0.5rem;
    }
    /* Marker: a small parallelogram cut at the logo's angle */
    .marker {
      position: absolute;
      top: 0.85rem;
      left: -2.25rem;
      width: 1.3rem;
      height: 0.8rem;
      background: var(--ink-soft);
      clip-path: polygon(0 0, 62% 0, 100% 100%, 38% 100%);
      transition:
        background-color 0.3s,
        transform 0.3s var(--ease-out);
    }
    .entry.active .marker {
      background: var(--brand);
      transform: scale(1.15);
    }
    .dates {
      font-family: var(--font-mono);
      font-size: var(--step--1);
      color: var(--accent);
    }
    .role {
      font-size: var(--step-1);
      transition: color 0.3s;
    }
    .entry:not(.active) .role {
      color: var(--ink-soft);
    }
    .org {
      font-weight: 600;
    }
    .context {
      color: var(--ink-soft);
    }
    /* The particle field: hidden on narrow screens to keep phones calm and light */
    .field-wrap {
      display: none;
    }
    @media (min-width: 56rem) {
      .layout {
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
        align-items: start;
      }
      .field-wrap {
        position: sticky;
        top: 6rem;
        display: grid;
        gap: 0.5rem;
      }
      .field {
        height: min(68vh, 34rem);
      }
      .field-label {
        font-family: var(--font-mono);
        font-size: var(--step--1);
        color: var(--ink-soft);
        text-align: center;
      }
      /* Countdown to the next shape */
      .track {
        position: relative;
        justify-self: center;
        width: 4rem;
        height: 2px;
        overflow: hidden;
        background: var(--rule);
      }
      .fill {
        position: absolute;
        inset: 0;
        background: var(--brand);
        transform-origin: left;
        animation: countdown linear forwards paused;
      }
      .fill.running {
        animation-play-state: running;
      }
    }
    @keyframes countdown {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }
  `,
})
export class Career {
  protected readonly entries: CareerEntry[] = [
    {
      role: 'Software Developer',
      org: 'CMS Systems',
      context: 'Automotive software · hybrid',
      dates: 'Sep 2023 – present',
      start: '2023-09',
      shape: 'gauge',
      field: 'Automotive',
    },
    {
      role: 'Software Engineer',
      org: 'WIM Technologies',
      context: 'Telecommunications · fully remote',
      dates: 'May 2022 – Sep 2023',
      start: '2022-05',
      shape: 'tower',
      field: 'Telecommunications',
    },
    {
      role: 'BSc Computer Science',
      org: 'Stellenbosch University',
      context: 'Studied on a rugby bursary',
      dates: '2018 – 2022',
      start: '2018',
      shape: 'cap',
      field: 'Computer Science',
    },
  ];

  protected readonly cycleMs = CYCLE_MS;
  /** The entry the particle field shows: advances on a timer, or jumps to the one hovered. */
  protected readonly active = signal(0);
  protected readonly current = computed(() => this.entries[this.active()]);

  protected readonly hovering = signal(false);
  protected readonly focusWithin = signal(false);
  private readonly inView = signal(false);
  private readonly pageHidden = signal(false);
  private readonly enhanced = signal(false);
  private readonly reducedMotion = prefersReducedMotion();

  /** Auto-cycling is offered (not with reduced motion; the visitor can still hover entries). */
  protected readonly autoplay = computed(() => this.enhanced() && !this.reducedMotion());
  /** The countdown is ticking: paused while hovered, focused, off screen or in a background tab. */
  protected readonly running = computed(
    () => this.autoplay() && this.inView() && !this.hovering() && !this.focusWithin() && !this.pageHidden(),
  );

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const doc = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.enhanced.set(true);
      const observer = new IntersectionObserver(([entry]) => this.inView.set(entry.isIntersecting), {
        threshold: 0.3,
      });
      observer.observe(host);
      const onVisibility = () => this.pageHidden.set(doc.hidden);
      doc.addEventListener('visibilitychange', onVisibility);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        doc.removeEventListener('visibilitychange', onVisibility);
      });
    });
  }

  protected next(): void {
    this.active.update((i) => (i + 1) % this.entries.length);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !(event.currentTarget as HTMLElement).contains(next)) this.focusWithin.set(false);
  }
}
