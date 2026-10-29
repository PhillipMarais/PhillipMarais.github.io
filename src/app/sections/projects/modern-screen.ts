import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Fictional "after" screen in a current Angular style. Decorative only. */
@Component({
  selector: 'app-modern-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="screen">
      <aside class="rail">
        <span class="logo"></span>
        <span class="nav on"></span>
        <span class="nav"></span>
        <span class="nav"></span>
      </aside>
      <div class="main">
        <div class="top">
          <strong>Leads</strong>
          <span class="search">Search leads…</span>
          <span class="cta">New lead</span>
        </div>
        <div class="chips">
          <span class="chip on">All <i>24</i></span>
          <span class="chip">New <i>9</i></span>
          <span class="chip">Contacted <i>11</i></span>
          <span class="chip">Won <i>4</i></span>
        </div>
        <div class="split">
          <ul class="list">
            @for (lead of leads; track lead.name; let first = $first) {
              <li [class.selected]="first">
                <span class="avatar">{{ lead.initials }}</span>
                <span class="who">
                  <b>{{ lead.name }}</b>
                  <small>{{ lead.enquiry }}</small>
                </span>
                <span class="pill" [attr.data-status]="lead.status">{{ lead.status }}</span>
              </li>
            }
          </ul>
          <div class="detail">
            <b>Anika van Wyk</b>
            <small>Hatchback enquiry · via website</small>
            <div class="bar"><span></span></div>
            <ol>
              <li>Lead created</li>
              <li>Assigned to sales</li>
              <li class="next">Call back today</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .screen {
      display: flex;
      height: 100%;
      background: #f7f8fa;
      color: #1b2430;
      font: 12px/1.4 'IBM Plex Sans', system-ui, sans-serif;
      overflow: hidden;
    }
    .rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      width: 44px;
      flex: none;
      padding-top: 12px;
      background: #13263a;
    }
    .logo {
      width: 20px;
      height: 20px;
      border-radius: 6px;
      background: #e08a5a;
    }
    .nav {
      width: 18px;
      height: 18px;
      border-radius: 5px;
      background: #3a5068;
    }
    .nav.on {
      background: #7fa9d1;
    }
    .main {
      flex: 1;
      min-width: 0;
      padding: 12px 14px;
    }
    .top {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .top strong {
      font-size: 15px;
    }
    .search {
      flex: 1;
      min-width: 0;
      padding: 5px 10px;
      color: #8592a3;
      background: #fff;
      border: 1px solid #e1e5eb;
      border-radius: 999px;
      white-space: nowrap;
      overflow: hidden;
    }
    .cta {
      padding: 5px 10px;
      color: #fff;
      background: #1f4e79;
      border-radius: 6px;
      white-space: nowrap;
    }
    .chips {
      display: flex;
      gap: 6px;
      margin: 12px 0;
      flex-wrap: wrap;
    }
    .chip {
      padding: 3px 9px;
      background: #fff;
      border: 1px solid #e1e5eb;
      border-radius: 999px;
    }
    .chip.on {
      color: #fff;
      background: #13263a;
      border-color: #13263a;
    }
    .chip i {
      font-style: normal;
      opacity: 0.65;
    }
    .split {
      display: grid;
      grid-template-columns: 1fr;
      gap: 12px;
    }
    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      background: #fff;
      border: 1px solid #e8ebf0;
      border-radius: 10px;
      overflow: hidden;
    }
    .list li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-bottom: 1px solid #f0f2f5;
    }
    .list li.selected {
      background: #eef4fa;
      box-shadow: inset 3px 0 #1f4e79;
    }
    .avatar {
      display: grid;
      place-items: center;
      width: 26px;
      height: 26px;
      flex: none;
      font-size: 10px;
      font-weight: 600;
      color: #1f4e79;
      background: #dce8f3;
      border-radius: 50%;
    }
    .who {
      display: flex;
      flex-direction: column;
      min-width: 0;
      flex: 1;
    }
    .who b,
    .who small {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .who small,
    .detail small {
      color: #6b7787;
    }
    .pill {
      padding: 2px 8px;
      font-size: 10px;
      font-weight: 600;
      border-radius: 999px;
      background: #e6f0fa;
      color: #1f4e79;
    }
    .pill[data-status='Won'] {
      background: #e3f4ea;
      color: #1d6b3d;
    }
    .pill[data-status='Contacted'] {
      background: #fbefe6;
      color: #8a3d15;
    }
    .detail {
      display: none;
      flex-direction: column;
      gap: 2px;
      padding: 12px;
      background: #fff;
      border: 1px solid #e8ebf0;
      border-radius: 10px;
    }
    .bar {
      height: 6px;
      margin: 10px 0;
      background: #eef1f5;
      border-radius: 999px;
    }
    .bar span {
      display: block;
      width: 66%;
      height: 100%;
      background: #1f4e79;
      border-radius: inherit;
    }
    ol {
      margin: 0;
      padding-left: 16px;
      color: #44505f;
    }
    ol .next {
      color: #a84b1c;
      font-weight: 600;
    }
    @container (min-width: 600px) {
      .split {
        grid-template-columns: 1.4fr 1fr;
      }
      .detail {
        display: flex;
      }
    }
    @container (max-width: 420px) {
      .rail {
        display: none;
      }
    }
  `,
})
export class ModernScreen {
  protected readonly leads = [
    { initials: 'AW', name: 'Anika van Wyk', enquiry: 'Hatchback enquiry', status: 'New' },
    { initials: 'SN', name: 'Sipho Ndlovu', enquiry: 'Test drive', status: 'Contacted' },
    { initials: 'LM', name: 'Lerato Mokoena', enquiry: 'Finance quote', status: 'New' },
    { initials: 'JP', name: 'Johan Pretorius', enquiry: 'Trade-in', status: 'Won' },
    { initials: 'MD', name: 'Megan Daniels', enquiry: 'Service booking', status: 'Contacted' },
  ];
}
