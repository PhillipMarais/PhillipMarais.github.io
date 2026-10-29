import { afterNextRender, ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ChatPanel } from './chat-panel';

/**
 * Floating "Ask me" button, pinned bottom-right. It needs JavaScript, so it only appears after
 * hydration. The chat window's code is prefetched once the page is idle and created on first click.
 */
@Component({
  selector: 'app-chat-launcher',
  imports: [ChatPanel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (ready()) {
      <button
        #launch
        type="button"
        class="launch"
        aria-label="Ask me a question"
        aria-haspopup="dialog"
        [attr.aria-expanded]="isOpen()"
        (click)="isOpen.set(true)"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5Z" />
          <path class="dots" d="M8.5 9.5h.01M12 9.5h.01M15.5 9.5h.01" />
        </svg>
      </button>
      @defer (on interaction(launch); prefetch on idle) {
        <app-chat-panel [open]="isOpen()" (closed)="isOpen.set(false)" />
      }
    }
  `,
  styles: `
    .launch {
      position: fixed;
      right: calc(1rem + env(safe-area-inset-right, 0px));
      bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
      z-index: 25;
      display: grid;
      place-items: center;
      width: 3.5rem;
      height: 3.5rem;
      color: var(--brand-ink);
      background: var(--brand);
      border: 0;
      border-radius: 50%;
      box-shadow: 0 12px 28px -10px rgb(255 106 19 / 0.55);
      cursor: pointer;
      animation: arrive 0.6s var(--ease-out) 1.6s both;
      transition: transform 0.2s var(--ease-out);
    }
    .launch:hover {
      transform: translateY(-2px) scale(1.05);
    }
    .launch:focus-visible {
      outline-offset: 4px;
      border-radius: 50%;
    }
    svg path {
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    svg .dots {
      stroke-width: 2.6;
    }
    @keyframes arrive {
      from {
        opacity: 0;
        transform: translateY(1rem);
      }
    }
  `,
})
export class ChatLauncher {
  protected readonly ready = signal(false);
  protected readonly isOpen = signal(false);

  constructor() {
    afterNextRender(() => this.ready.set(true));
  }
}
