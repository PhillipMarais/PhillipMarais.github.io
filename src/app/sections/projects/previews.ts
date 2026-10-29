import { ChangeDetectionStrategy, Component } from '@angular/core';

/* Small decorative previews for the project cards. Made-up data; screen readers skip them. */

@Component({
  selector: 'app-stock-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mock" aria-hidden="true">
      <div class="bar"><span class="search">Search stock…</span><span class="btn">Add vehicle</span></div>
      <div class="table">
        <div class="row head"><span>Vehicle</span><span>Year</span><span>Price ▾</span></div>
        @for (row of rows; track row.name) {
          <div class="row">
            <span><i class="thumb"></i>{{ row.name }}</span><span>{{ row.year }}</span><span>{{ row.price }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .mock {
      display: grid;
      gap: 0.6rem;
      font-size: 0.78rem;
    }
    .bar {
      display: flex;
      gap: 0.5rem;
    }
    .search {
      flex: 1;
      padding: 0.35rem 0.7rem;
      color: var(--ink-soft);
      border: 1px solid var(--rule);
      border-radius: 999px;
    }
    .btn {
      padding: 0.35rem 0.7rem;
      color: var(--brand-ink);
      background: var(--brand);
      border-radius: 6px;
      white-space: nowrap;
    }
    .table {
      border: 1px solid var(--rule);
      border-radius: 8px;
      overflow: hidden;
    }
    .row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.7rem;
      border-top: 1px solid var(--rule);
    }
    .row.head {
      border-top: 0;
      color: var(--ink-soft);
      font-family: var(--font-mono);
      font-size: 0.7rem;
    }
    .thumb {
      display: inline-block;
      width: 1.6rem;
      height: 1.1rem;
      margin-right: 0.5rem;
      vertical-align: middle;
      background: color-mix(in srgb, var(--brand) 25%, var(--rule));
      border-radius: 3px;
    }
    /* When the card comes forward: the stock rows slide in one after another */
    :host-context(.card[data-pos='active']) .row:not(.head) {
      animation: row-in 0.5s var(--ease-out) both;
    }
    :host-context(.card[data-pos='active']) .row:nth-child(2) {
      animation-delay: 0.45s;
    }
    :host-context(.card[data-pos='active']) .row:nth-child(3) {
      animation-delay: 0.55s;
    }
    :host-context(.card[data-pos='active']) .row:nth-child(4) {
      animation-delay: 0.65s;
    }
    @keyframes row-in {
      from {
        opacity: 0;
        transform: translateX(-12px);
      }
    }
  `,
})
export class StockPreview {
  protected readonly rows = [
    { name: 'Hatchback', year: '2021', price: 'R 189 900' },
    { name: 'Double cab', year: '2019', price: 'R 349 000' },
    { name: 'Sedan', year: '2022', price: 'R 274 500' },
  ];
}

@Component({
  selector: 'app-quote-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mock" aria-hidden="true">
      @for (c of customers; track c.name) {
        <div class="row">
          <span class="flag">{{ c.code }}</span>
          <span class="who"><b>{{ c.name }}</b><small>{{ c.nationality }}</small></span>
          <span class="quotes">{{ c.quotes }} quotes</span>
        </div>
      }
      <p class="store"><span>store</span><span>effects</span><span>entity</span></p>
    </div>
  `,
  styles: `
    .mock {
      display: grid;
      gap: 0.45rem;
      font-size: 0.78rem;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.5rem 0.7rem;
      border: 1px solid var(--rule);
      border-radius: 8px;
    }
    .flag {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 1.4rem;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      background: color-mix(in srgb, var(--brand) 18%, var(--paper-raised));
      border-radius: 4px;
    }
    .who {
      display: grid;
      flex: 1;
      min-width: 0;
    }
    .who small,
    .quotes {
      color: var(--ink-soft);
    }
    .store {
      display: flex;
      gap: 0.4rem;
      font-family: var(--font-mono);
      font-size: 0.68rem;
    }
    .store span {
      padding: 0.15rem 0.5rem;
      border: 1px dashed var(--rule);
      border-radius: 999px;
    }
    /* When the card comes forward: customers slide in, then the NgRx pieces pop */
    :host-context(.card[data-pos='active']) .row {
      animation: row-in 0.5s var(--ease-out) both;
    }
    :host-context(.card[data-pos='active']) .row:nth-child(1) {
      animation-delay: 0.45s;
    }
    :host-context(.card[data-pos='active']) .row:nth-child(2) {
      animation-delay: 0.55s;
    }
    :host-context(.card[data-pos='active']) .row:nth-child(3) {
      animation-delay: 0.65s;
    }
    :host-context(.card[data-pos='active']) .store span {
      animation: pop 0.4s var(--ease-out) both;
    }
    :host-context(.card[data-pos='active']) .store span:nth-child(1) {
      animation-delay: 0.85s;
    }
    :host-context(.card[data-pos='active']) .store span:nth-child(2) {
      animation-delay: 0.95s;
    }
    :host-context(.card[data-pos='active']) .store span:nth-child(3) {
      animation-delay: 1.05s;
    }
    @keyframes row-in {
      from {
        opacity: 0;
        transform: translateX(-12px);
      }
    }
    @keyframes pop {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
    }
  `,
})
export class QuotePreview {
  protected readonly customers = [
    { code: 'ZA', name: 'Customer A', nationality: 'South African', quotes: 3 },
    { code: 'NA', name: 'Customer B', nationality: 'Namibian', quotes: 1 },
    { code: 'BW', name: 'Customer C', nationality: 'Motswana', quotes: 2 },
  ];
}

@Component({
  selector: 'app-tower-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="map" viewBox="0 0 320 170" aria-hidden="true">
      @for (link of links; track $index) {
        <line [attr.x1]="link[0].x" [attr.y1]="link[0].y" [attr.x2]="link[1].x" [attr.y2]="link[1].y" [attr.stroke]="link[2]" />
      }
      @for (t of towers; track $index) {
        <circle [attr.cx]="t.x" [attr.cy]="t.y" r="6" [attr.fill]="t.c" [style.--i]="$index" />
      }
    </svg>
    <p class="caption">Towers sharing a frequency, kept far apart. Try the live demo to watch it run step by step.</p>
  `,
  styles: `
    .map {
      width: 100%;
      height: auto;
      border: 1px solid var(--rule);
      border-radius: 8px;
    }
    line {
      stroke-width: 1.5;
      stroke-dasharray: 4 4;
      opacity: 0.7;
    }
    .caption {
      margin-top: 0.4rem;
      font-size: 0.75rem;
      color: var(--ink-soft);
    }
    /* When the card comes forward: towers pop onto the map, then the frequency links fade in */
    circle {
      transform-box: fill-box;
      transform-origin: center;
    }
    :host-context(.card[data-pos='active']) circle {
      animation: tower-pop 0.45s var(--ease-out) both;
      animation-delay: calc(0.4s + var(--i) * 50ms);
    }
    :host-context(.card[data-pos='active']) line {
      animation: link-in 0.6s ease-out 1.1s both;
    }
    @keyframes tower-pop {
      from {
        opacity: 0;
        transform: scale(0);
      }
    }
    @keyframes link-in {
      from {
        opacity: 0;
      }
    }
  `,
})
export class TowerPreview {
  private readonly palette = ['#ff6a13', '#3b82f6', '#16a34a', '#a855f7', '#e11d48', '#0891b2'];
  protected readonly towers = [
    [30, 30, 0], [290, 140, 0], [70, 60, 1], [250, 30, 1], [110, 120, 2], [280, 70, 2],
    [150, 40, 3], [60, 150, 3], [200, 140, 4], [40, 95, 4], [180, 85, 5], [300, 20, 5],
  ].map(([x, y, f]) => ({ x, y, c: this.palette[f] }));
  protected readonly links = [0, 2, 4, 6, 8, 10].map(
    (i) => [this.towers[i], this.towers[i + 1], this.towers[i].c] as const,
  );
}
