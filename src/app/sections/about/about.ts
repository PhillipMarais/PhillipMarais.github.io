import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="section" aria-labelledby="about-title">
      <div class="wrap">
        <div class="section-head reveal">
          <span class="section-num" aria-hidden="true">01</span>
          <h2 id="about-title" class="section-title">About</h2>
        </div>
        <div class="grid">
          <figure class="portrait reveal-left">
            <img
              src="images/phillip-headshot.webp"
              alt="Portrait of Phillip Marais"
              width="600"
              height="800"
              loading="lazy"
              decoding="async"
            />
          </figure>
          <div class="text reveal-right">
            <p class="lead">
              I build customer-facing web and mobile apps with Angular, Ionic and .NET (C#), and have worked in
              telecommunications and automotive since 2022.
            </p>
            <p>
              I have a passion for problem solving that I learned from a young age on the family farm. I enjoy
              developing and strive to keep improving my skill set.
            </p>
            <p>I prefer the front end, but I've worked full stack my whole career.</p>
            <p>I studied BSc Computer Science at Stellenbosch University from 2018 to 2022, on a rugby bursary.</p>
            <p>Outside work, I enjoy the gym, long walks, gaming and time on the family farm.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .grid {
      display: grid;
      gap: var(--space-l);
      align-items: start;
    }
    .portrait {
      position: relative;
      width: min(100%, 16rem);
      margin: 0;
      aspect-ratio: 3 / 4;
      overflow: hidden;
      background:
        radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--brand) 28%, transparent), transparent 65%),
        var(--paper-raised);
      border-bottom: 3px solid var(--brand);
      /* Top-right corner cut at the logo's 40° angle */
      clip-path: polygon(0 0, 78% 0, 100% 14%, 100% 100%, 0 100%);
    }
    .portrait img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
    }
    .text {
      display: grid;
      gap: 1rem;
      max-width: var(--measure);
    }
    .lead {
      font-weight: 500;
      font-size: var(--step-1);
      line-height: 1.4;
    }
    @media (min-width: 46rem) {
      .grid {
        grid-template-columns: 16rem 1fr;
        align-items: center;
      }
    }
  `,
})
export class About {}
