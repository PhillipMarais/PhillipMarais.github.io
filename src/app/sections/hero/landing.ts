import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LandingField } from './landing-field';
import { LogoIntro } from './logo-intro';

@Component({
  selector: 'app-landing',
  imports: [LogoIntro, LandingField],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="landing" aria-labelledby="hero-title">
      <!-- Sparse particles + logo pulses; the code loads once the page is idle -->
      @defer (on idle) {
        <app-landing-field [origin]="logo.element" (pulsed)="logo.pulse()" />
      }
      <div class="wrap inner">
        <app-logo-intro #logo class="logo" />
        <div class="intro">
          <h1 id="hero-title" class="name">Phillip <span class="accent">Marais</span></h1>
          <span class="rule" aria-hidden="true"></span>
          <p class="role">Front-end-focused full-stack developer · Angular · TypeScript · .NET</p>
          <p class="where">Somerset West, South Africa · UTC+2</p>
        </div>
        <a class="cue" href="#about">
          Scroll
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
        </a>
      </div>
    </section>
  `,
  styles: `
    .landing {
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(ellipse 60% 50% at 50% 38%, var(--landing-halo), transparent 70%),
        var(--paper);
    }
    .inner {
      position: relative;
      display: grid;
      justify-items: center;
      align-content: center;
      gap: clamp(1.5rem, 4vh, 3rem);
      min-height: 100svh;
      padding-block: var(--space-l);
      text-align: center;
    }
    .logo {
      width: min(82vw, 36rem);
    }
    .intro {
      display: grid;
      gap: 0.6rem;
      animation: rise 0.9s var(--ease-out) 1.3s both;
    }
    .name {
      font-size: var(--step-3);
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      /* Optical centring: letter-spacing leaves a trailing gap */
      margin-right: -0.18em;
    }
    .accent {
      color: var(--accent);
    }
    /* Thin rule with an orange dash, borrowed from the logo lockup */
    .rule {
      justify-self: center;
      width: min(80%, 22rem);
      height: 4px;
      background:
        linear-gradient(var(--brand), var(--brand)) center / 2.25rem 4px no-repeat,
        linear-gradient(
            90deg,
            transparent,
            var(--ink-soft) 20%,
            var(--ink-soft) calc(50% - 1.6rem),
            transparent calc(50% - 1.6rem),
            transparent calc(50% + 1.6rem),
            var(--ink-soft) calc(50% + 1.6rem),
            var(--ink-soft) 80%,
            transparent
          )
          center / 100% 1px no-repeat;
      opacity: 0.9;
    }
    .role {
      max-width: 36ch;
      font-size: var(--step-1);
      line-height: 1.35;
      color: var(--ink-soft);
    }
    .where {
      font-family: var(--font-mono);
      font-size: var(--step--1);
      color: var(--ink-soft);
    }
    .cue {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
      padding: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-decoration: none;
      color: var(--ink-soft);
      animation: rise 0.9s var(--ease-out) 1.8s both;
    }
    .cue:hover {
      color: var(--accent);
    }
    .cue svg {
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      animation: nudge 1.2s ease-in-out 2.8s 3;
    }
    @keyframes rise {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
    }
    @keyframes nudge {
      50% {
        transform: translateY(5px);
      }
    }
  `,
})
export class Landing {}
