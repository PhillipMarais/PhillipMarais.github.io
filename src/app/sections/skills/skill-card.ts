import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { Skill } from './skills-data';

/**
 * Content of the "where I've used it" card. A component (not a shared ng-template) so it can be
 * rendered in two places — beside the chips and inline on phones — and still hydrate cleanly.
 */
@Component({
  selector: 'app-skill-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Keyed on the skill so the content re-animates when it changes -->
    @for (d of [detail()]; track d.skill.name) {
      <div class="detail-inner">
        <p class="detail-group">{{ d.group }}</p>
        <h3 class="detail-name">{{ d.skill.name }}</h3>
        @if (d.skill.evidence.length) {
          <p class="detail-label">Where I've used it</p>
          <ol class="evidence">
            @for (e of d.skill.evidence; track $index; let i = $index) {
              <li [style.--i]="i">
                <span class="where">{{ e.where }}</span>
                <span class="what">{{ e.what }}</span>
              </li>
            }
          </ol>
        } @else {
          <p class="none">No write-up for this one yet. Ask me about it in the chat.</p>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .detail-inner {
      display: grid;
      gap: 0.4rem;
      animation: swap-in 0.4s var(--ease-out);
    }
    .detail-group {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--accent);
    }
    .detail-name {
      font-size: var(--step-2);
    }
    .detail-label {
      margin-top: 0.75rem;
      font-size: var(--step--1);
      color: var(--ink-soft);
    }
    .evidence {
      display: grid;
      gap: 0.6rem;
      margin: 0.25rem 0 0;
      padding: 0;
      list-style: none;
    }
    .evidence li {
      display: grid;
      gap: 0.1rem;
      padding: 0.7rem 0.9rem;
      border-left: 2px solid var(--brand);
      background: color-mix(in srgb, var(--brand) 5%, transparent);
      border-radius: 0 6px 6px 0;
      animation: swap-in 0.45s var(--ease-out) both;
      animation-delay: calc(var(--i) * 70ms + 80ms);
    }
    .where {
      font-weight: 600;
      font-size: 0.92rem;
    }
    .what {
      color: var(--ink-soft);
      font-size: 0.92rem;
    }
    .none {
      margin-top: 0.75rem;
      color: var(--ink-soft);
    }
    @keyframes swap-in {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
    }
  `,
})
export class SkillCard {
  readonly detail = input.required<{ group: string; skill: Skill }>();
}
