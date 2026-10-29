import { afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';

interface ContactLink {
  id: 'email' | 'linkedin' | 'github' | 'cv';
  label: string;
  handle: string;
  href: string;
  external: boolean;
  /** File name to save as, for downloads. */
  download?: string;
}

const EMAIL = 'Phillipmar27@gmail.com';
export const CV_HREF = 'Phillip-Marais-CV.pdf';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  protected readonly email = EMAIL;
  protected readonly links: ContactLink[] = [
    { id: 'email', label: 'Email', handle: EMAIL, href: `mailto:${EMAIL}`, external: false },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      handle: 'phillip-m-92b2a7136',
      href: 'https://www.linkedin.com/in/phillip-m-92b2a7136/',
      external: true,
    },
    { id: 'github', label: 'GitHub', handle: 'PhillipMarais', href: 'https://github.com/PhillipMarais', external: true },
    { id: 'cv', label: 'CV', handle: 'Download PDF', href: CV_HREF, external: false, download: 'Phillip-Marais-CV.pdf' },
  ];

  protected readonly copied = signal(false);
  /** Phillip's local time; only shown after hydration so the prerendered page never shows a stale time. */
  protected readonly localTime = signal<string | null>(null);

  private copyTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroyRef = inject(DestroyRef);
    afterNextRender(() => {
      const format = new Intl.DateTimeFormat('en-ZA', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Africa/Johannesburg',
      });
      const update = () => this.localTime.set(format.format(new Date()));
      update();
      const clock = setInterval(update, 30_000);
      destroyRef.onDestroy(() => {
        clearInterval(clock);
        clearTimeout(this.copyTimer);
      });
    });
  }

  protected async copyEmail(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.email);
      this.copied.set(true);
      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => this.copied.set(false), 2200);
    } catch {
      // Clipboard can be blocked; the address is visible and selectable anyway
    }
  }
}
