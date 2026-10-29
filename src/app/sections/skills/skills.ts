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
import { SkillCard } from './skill-card';
import { Skill, SKILL_GROUPS } from './skills-data';

/** How long each randomly picked skill stays up before the next one. */
const CYCLE_MS = 3500;

@Component({
  selector: 'app-skills',
  imports: [SkillCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  protected readonly groups = SKILL_GROUPS;
  protected readonly cycleMs = CYCLE_MS;
  /** Skill shown in the detail card. Set by the random cycle, by mouse hover, or by tap/click/focus. */
  protected readonly selected = signal(SKILL_GROUPS[0].skills[0].name);

  protected readonly detail = computed(() => {
    for (const group of this.groups) {
      const skill = group.skills.find((s) => s.name === this.selected());
      if (skill) return { group: group.title, skill };
    }
    return { group: this.groups[0].title, skill: this.groups[0].skills[0] };
  });

  protected readonly hovering = signal(false);
  protected readonly focusWithin = signal(false);
  private readonly enhanced = signal(false);
  private readonly inView = signal(false);
  private readonly pageHidden = signal(false);
  /** Auto-cycling only beside the sticky side card; on phones it would keep shifting the chip list. */
  private readonly wide = signal(false);
  private readonly reducedMotion = prefersReducedMotion();

  protected readonly autoplay = computed(() => this.enhanced() && this.wide() && !this.reducedMotion());
  protected readonly running = computed(
    () => this.autoplay() && this.inView() && !this.hovering() && !this.focusWithin() && !this.pageHidden(),
  );

  /** Shuffled "deck" of skills with examples: each comes up once before any repeats. */
  private deck: string[] = [];

  constructor() {
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const doc = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      this.enhanced.set(true);
      const wideQuery = doc.defaultView!.matchMedia('(min-width: 60rem)');
      const onWide = () => this.wide.set(wideQuery.matches);
      onWide();
      wideQuery.addEventListener('change', onWide);
      const observer = new IntersectionObserver(([entry]) => this.inView.set(entry.isIntersecting), {
        threshold: 0.15,
      });
      observer.observe(host);
      const onVisibility = () => this.pageHidden.set(doc.hidden);
      doc.addEventListener('visibilitychange', onVisibility);
      destroyRef.onDestroy(() => {
        observer.disconnect();
        wideQuery.removeEventListener('change', onWide);
        doc.removeEventListener('visibilitychange', onVisibility);
      });
    });
  }

  protected select(skill: Skill): void {
    this.selected.set(skill.name);
  }

  /**
   * Mouse hover previews a skill. Touch is left to the tap: on phones the card opens inline and
   * shifts the chips, so a touch "hover" would land on a different chip than the one tapped.
   */
  protected onPointerEnter(event: PointerEvent, skill: Skill): void {
    if (event.pointerType === 'mouse') this.select(skill);
  }

  /** Picks the next skill at random (from the shuffled deck), never the one already showing. */
  protected next(): void {
    if (!this.deck.length) this.deck = this.shuffle();
    let pick = this.deck.pop()!;
    if (pick === this.selected()) {
      if (!this.deck.length) this.deck = this.shuffle();
      pick = this.deck.pop()!;
    }
    this.selected.set(pick);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!next || !(event.currentTarget as HTMLElement).contains(next)) this.focusWithin.set(false);
  }

  protected pad(index: number): string {
    return String(index + 1).padStart(2, '0');
  }

  private shuffle(): string[] {
    const names = this.groups.flatMap((g) => g.skills.filter((s) => s.evidence.length).map((s) => s.name));
    for (let i = names.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [names[i], names[j]] = [names[j], names[i]];
    }
    return names;
  }
}
