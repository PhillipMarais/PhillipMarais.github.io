import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatLauncher } from './chat/chat-launcher';
import { CustomCursor } from './layout/custom-cursor';
import { SiteFooter } from './layout/site-footer';
import { Contact } from './sections/contact/contact';
import { Skills } from './sections/skills/skills';
import { SiteHeader } from './layout/site-header';
import { ThemeToggle } from './layout/theme-toggle';
import { About } from './sections/about/about';
import { Career } from './sections/career/career';
import { Landing } from './sections/hero/landing';
import { Projects } from './sections/projects/projects';

@Component({
  selector: 'app-root',
  imports: [
    SiteHeader,
    ThemeToggle,
    Landing,
    About,
    Career,
    Projects,
    Skills,
    Contact,
    SiteFooter,
    ChatLauncher,
    CustomCursor,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div id="top"></div>
    <app-site-header />
    <app-theme-toggle />
    <main id="main" tabindex="-1">
      <app-landing />
      <app-about />
      <!--
        Incremental hydration: these sections are prerendered (content and SEO intact), but their
        JavaScript only downloads and runs when they scroll near the viewport.
      -->
      @defer (hydrate on viewport) {
        <app-career />
      }
      @defer (hydrate on viewport) {
        <app-projects />
      }
      @defer (hydrate on viewport) {
        <app-skills />
      }
      @defer (hydrate on viewport) {
        <app-contact />
      }
    </main>
    <app-site-footer />
    <app-chat-launcher />
    <app-custom-cursor />
  `,
  styles: `
    main:focus {
      outline: none;
    }
  `,
})
export class App {}
