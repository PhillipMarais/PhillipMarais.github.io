import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { prefersReducedMotion } from '../core/motion';
import { CHAT_GREETING, CHAT_TOPICS, ChatLink, ChatTopic } from './chat-data';

interface Message {
  id: number;
  from: 'me' | 'visitor';
  paragraphs: string[];
  links?: ChatLink[];
}

/** Pause before an answer appears, so it reads like a reply rather than a page swap. */
const TYPING_MS = 900;

/**
 * "Ask me" chat window. A native <dialog> (focus stays inside, Esc closes, background is inert)
 * with pre-written answers. Loaded lazily, after the page is idle.
 */
@Component({
  selector: 'app-chat-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-panel.html',
  styleUrl: './chat-panel.css',
})
export class ChatPanel {
  readonly open = input.required<boolean>();
  readonly closed = output<void>();

  protected readonly messages = signal<Message[]>([{ id: 0, from: 'me', paragraphs: CHAT_GREETING }]);
  protected readonly typing = signal(false);
  private readonly asked = signal<ReadonlySet<string>>(new Set());
  protected readonly remaining = computed(() => CHAT_TOPICS.filter((t) => !this.asked().has(t.id)));

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly log = viewChild.required<ElementRef<HTMLElement>>('log');
  private readonly reducedMotion = prefersReducedMotion();
  private nextId = 1;
  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    effect(() => {
      const dialog = this.dialog().nativeElement;
      if (this.open() && !dialog.open) dialog.showModal();
      else if (!this.open() && dialog.open) dialog.close();
    });
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected ask(topic: ChatTopic): void {
    if (this.typing()) return;
    this.asked.update((s) => new Set(s).add(topic.id));
    this.push({ from: 'visitor', paragraphs: [topic.question] });
    const reply = () => {
      this.typing.set(false);
      this.push({ from: 'me', paragraphs: topic.answer, links: topic.links });
    };
    if (this.reducedMotion()) {
      reply();
      return;
    }
    this.typing.set(true);
    this.scrollToEnd();
    this.timer = setTimeout(reply, TYPING_MS);
  }

  protected startOver(): void {
    clearTimeout(this.timer);
    this.typing.set(false);
    this.asked.set(new Set());
    this.messages.set([{ id: 0, from: 'me', paragraphs: CHAT_GREETING }]);
  }

  protected close(): void {
    this.dialog().nativeElement.close();
  }

  /** Clicks on the dimmed backdrop land on the <dialog> itself; close on those. */
  protected onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) this.close();
  }

  protected onClosed(): void {
    this.closed.emit();
  }

  /** In-page links (like #projects) close the chat so the section is visible. */
  protected onLinkClick(link: ChatLink): void {
    if (link.href.startsWith('#')) this.close();
  }

  protected isExternal(link: ChatLink): boolean {
    return link.href.startsWith('http');
  }

  private push(message: Omit<Message, 'id'>): void {
    this.messages.update((list) => [...list, { ...message, id: this.nextId++ }]);
    this.scrollToEnd();
  }

  private scrollToEnd(): void {
    requestAnimationFrame(() => {
      const el = this.log().nativeElement;
      el.scrollTo({ top: el.scrollHeight, behavior: this.reducedMotion() ? 'auto' : 'smooth' });
    });
  }
}
