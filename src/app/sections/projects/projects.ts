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
import { MigrationSlider } from './migration-slider';
import { QuotePreview, StockPreview, TowerPreview } from './previews';
import { CustomerAppPreview, DataPreview, ExportsPreview, TeamsPreview, WhatsAppPreview } from './work-previews';

type ProjectKind =
  | 'rewrite'
  | 'whatsapp'
  | 'customer-app'
  | 'teams'
  | 'exports'
  | 'data'
  | 'stock'
  | 'quote'
  | 'tower';

/** Shown on CMS Systems work cards: there's no public repo, and the previews are invented. */
const WORK_NOTE = 'Work project at CMS Systems. The preview is my own mock-up with made-up data.';

interface Project {
  id: string;
  kind: ProjectKind;
  title: string;
  summary: string;
  tech: string[];
  repo?: string;
  /** Live, runnable version of the project. */
  demo?: string;
  note?: string;
}

/** How long each project stays up before the showcase moves on. */
const AUTOPLAY_MS = 8000;

// TODO: "CMS Systems website redesign" stays out until Phillip says so.
const PROJECTS: Project[] = [
  {
    id: 'rewrite',
    kind: 'rewrite',
    title: 'Lead management rewrite',
    summary:
      'Rewrote the lead management system front end from AngularJS 1.8.2 to Angular 19, designed and built independently over 4 months.',
    tech: ['Angular 19', 'AngularJS 1.8.2', 'TypeScript'],
    note: 'Work project at CMS Systems. The screens are my own mock-ups with made-up data.',
  },
  // TODO: Phillip to confirm the WhatsApp provider's name ("RED"?) before naming it here.
  {
    id: 'whatsapp',
    kind: 'whatsapp',
    title: 'Workshop WhatsApp messaging',
    summary:
      'Added WhatsApp messaging to the workshop system through a third-party integration. Utility template messages send customers details, like when their car is ready for collection, with uploaded photos, and SignalR updates the UI with new messages in real time.',
    tech: ['TypeScript', 'SignalR', 'WhatsApp templates'],
    note: WORK_NOTE,
  },
  {
    id: 'customer-app',
    kind: 'customer-app',
    title: 'Customer workshop app',
    summary:
      'Created a mobile app with TypeScript and Ionic for customers whose car is in for a service. They open it from a link and verify with a one-time PIN, then see which station their car is at and communicate with their service advisor.',
    tech: ['TypeScript', 'Ionic', 'OTP verification'],
    note: WORK_NOTE,
  },
  {
    id: 'teams',
    kind: 'teams',
    title: 'Sales teams and goals',
    summary:
      'Added a section to the sales module where dealers create teams and set goals for them, with a view that shows where team members are falling behind, and role assignment for who can create and edit teams.',
    tech: ['JavaScript', 'Role-based access'],
    note: WORK_NOTE,
  },
  {
    id: 'exports',
    kind: 'exports',
    title: 'Table data exports',
    summary:
      'Added multiple exports for table data. Each export is uploaded to S3 and sent to the UI as a pre-signed URL.',
    tech: ['AWS S3', 'AWS SDK', 'Pre-signed URLs'],
    note: WORK_NOTE,
  },
  {
    id: 'data',
    kind: 'data',
    title: 'Database and performance work',
    summary:
      'Added new tables and columns for most of these projects and, with the help of Claude, improved their performance. For the dashboards I used Claude to help write Dapper queries that act as stored procedures. I also fixed many bugs, some by using SQL to find the root cause.',
    tech: ['SQL', 'Dapper', 'Claude'],
    note: WORK_NOTE,
  },
  {
    id: 'stock',
    kind: 'stock',
    title: 'Stock Management App',
    summary:
      'Vehicle stock management with Firebase sign-in, a searchable and sortable stock table, vehicle records with accessories, and image uploads.',
    tech: ['Angular', 'Angular Material', 'PrimeNG', 'ASP.NET Core Web API', 'Entity Framework Core', 'SQL Server'],
    repo: 'https://github.com/PhillipMarais/Stock-Management-App',
  },
  {
    id: 'quote',
    kind: 'quote',
    title: 'Customer and quote manager',
    summary:
      'Angular 19 with NgRx (store, effects, entity), route guards, and customer records enriched from public country and nationality APIs.',
    tech: ['Angular 19', 'NgRx', 'TypeScript'],
    repo: 'https://github.com/PhillipMarais/Genasys-Assessment',
    demo: 'https://phillipmarais.github.io/Genasys-Assessment/',
  },
  {
    id: 'tower',
    kind: 'tower',
    title: 'Cell tower frequency assignment',
    summary:
      'Assigns frequencies to cell towers so towers on the same frequency are as far apart as possible, using an algorithm I wrote in Java.',
    tech: ['Java'],
    repo: 'https://github.com/PhillipMarais/Cell-Phone-Tower-Problem',
    demo: 'https://phillipmarais.github.io/Cell-Phone-Tower-Problem/',
  },
];

@Component({
  selector: 'app-projects',
  imports: [
    MigrationSlider,
    WhatsAppPreview,
    CustomerAppPreview,
    TeamsPreview,
    ExportsPreview,
    DataPreview,
    StockPreview,
    QuotePreview,
    TowerPreview,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  protected readonly projects = PROJECTS;
  protected readonly autoplayMs = AUTOPLAY_MS;
  protected readonly active = signal(0);

  /** False until hydration; without JavaScript the cards simply stack. */
  protected readonly enhanced = signal(false);
  protected readonly userPaused = signal(false);
  private readonly hovering = signal(false);
  private readonly focusWithin = signal(false);
  private readonly inView = signal(false);
  private readonly pageHidden = signal(false);
  private readonly reducedMotion = prefersReducedMotion();

  /** Autoplay is offered at all (the progress dash is shown). */
  protected readonly autoplay = computed(() => this.enhanced() && !this.reducedMotion() && !this.userPaused());
  /** The timer is actually ticking right now. */
  protected readonly running = computed(
    () => this.autoplay() && this.inView() && !this.hovering() && !this.focusWithin() && !this.pageHidden(),
  );

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    const destroyRef = inject(DestroyRef);
    const doc = inject(DOCUMENT);
    afterNextRender(() => {
      this.enhanced.set(true);
      const observer = new IntersectionObserver(([entry]) => this.inView.set(entry.isIntersecting), {
        threshold: 0.35,
      });
      observer.observe(this.host.nativeElement);
      const onVisibility = () => this.pageHidden.set(doc.hidden);
      doc.addEventListener('visibilitychange', onVisibility);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        doc.removeEventListener('visibilitychange', onVisibility);
      });
    });
  }

  protected pad(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  protected position(index: number): 'active' | 'prev' | 'next' | 'hidden' {
    const n = this.projects.length;
    const offset = (index - this.active() + n) % n;
    if (offset === 0) return 'active';
    if (offset === 1) return 'next';
    if (offset === n - 1) return 'prev';
    return 'hidden';
  }

  protected select(index: number): void {
    this.active.set((index + this.projects.length) % this.projects.length);
  }

  protected next(): void {
    this.select(this.active() + 1);
  }

  protected previous(): void {
    this.select(this.active() - 1);
  }

  protected togglePause(): void {
    this.userPaused.update((p) => !p);
  }

  protected setHovering(value: boolean): void {
    this.hovering.set(value);
  }

  protected onFocusIn(): void {
    this.focusWithin.set(true);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !(event.currentTarget as HTMLElement).contains(next)) this.focusWithin.set(false);
  }

  /** Arrow keys move between tabs (WAI-ARIA tabs pattern). */
  protected onTabKeydown(event: KeyboardEvent, index: number): void {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let target: number | undefined;
    if (event.key in keys) target = index + keys[event.key];
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = this.projects.length - 1;
    if (target === undefined) return;
    event.preventDefault();
    this.select(target);
    const id = this.projects[this.active()].id;
    this.host.nativeElement.querySelector<HTMLElement>(`#tab-${id}`)?.focus();
  }
}
