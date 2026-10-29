import { ChangeDetectionStrategy, Component } from '@angular/core';

/*
 * Small decorative previews for the CMS Systems work cards. My own mock-ups with made-up data;
 * they don't copy any real screen. Screen readers skip them (the card summary carries the facts).
 */

@Component({
  selector: 'app-whatsapp-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mock" aria-hidden="true">
      <div class="bar">
        <span class="who"><b>Customer</b><small>Vehicle in workshop</small></span>
        <span class="live"><i></i>Live</span>
      </div>
      <div class="thread">
        <div class="msg out">
          <span class="tag">Utility template</span>
          <p>Hi Sam, your vehicle is ready for collection.</p>
          <span class="photos"><i></i><i></i></span>
          <small>Delivered ✓✓</small>
        </div>
        <div class="msg in">
          <p>Great, thanks! I'll come through at 4.</p>
        </div>
      </div>
    </div>
  `,
  styles: `
    .mock {
      display: grid;
      gap: 0.6rem;
      font-size: 0.78rem;
      border: 1px solid var(--rule);
      border-radius: 10px;
      overflow: hidden;
    }
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.55rem 0.8rem;
      border-bottom: 1px solid var(--rule);
    }
    .who {
      display: grid;
    }
    .who small {
      color: var(--ink-soft);
    }
    .live {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--accent);
    }
    .live i {
      width: 0.45rem;
      height: 0.45rem;
      background: var(--brand);
      border-radius: 50%;
    }
    .thread {
      display: grid;
      gap: 0.5rem;
      padding: 0 0.8rem 0.8rem;
    }
    .msg {
      display: grid;
      gap: 0.3rem;
      max-width: 80%;
      padding: 0.5rem 0.7rem;
      border-radius: 10px;
    }
    .msg p {
      margin: 0;
    }
    .out {
      justify-self: end;
      background: color-mix(in srgb, var(--brand) 16%, var(--paper-raised));
      border-radius: 10px 2px 10px 10px;
    }
    .in {
      justify-self: start;
      background: var(--paper);
      border: 1px solid var(--rule);
      border-radius: 2px 10px 10px 10px;
    }
    .tag {
      justify-self: start;
      padding: 0.05rem 0.45rem;
      font-family: var(--font-mono);
      font-size: 0.62rem;
      border: 1px solid var(--rule);
      border-radius: 999px;
    }
    .photos {
      display: flex;
      gap: 0.3rem;
    }
    .photos i {
      width: 3rem;
      height: 2rem;
      background: color-mix(in srgb, var(--ink) 18%, transparent);
      border-radius: 4px;
    }
    .out small {
      justify-self: end;
      color: var(--ink-soft);
      font-size: 0.65rem;
    }
    /* When the card comes forward: the template message arrives, then the reply; the live dot pulses */
    :host-context(.card[data-pos='active']) .out {
      transform-origin: right top;
      animation: bubble-in 0.45s var(--ease-out) 0.5s both;
    }
    :host-context(.card[data-pos='active']) .photos i {
      animation: fade-in 0.4s ease-out 0.85s both;
    }
    :host-context(.card[data-pos='active']) .out small {
      animation: fade-in 0.4s ease-out 1.1s both;
    }
    :host-context(.card[data-pos='active']) .in {
      transform-origin: left top;
      animation: bubble-in 0.45s var(--ease-out) 1.5s both;
    }
    .live i {
      position: relative;
    }
    :host-context(.card[data-pos='active']) .live i::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: var(--brand);
      animation: ping 2s ease-out infinite;
    }
    @keyframes bubble-in {
      from {
        opacity: 0;
        transform: scale(0.85) translateY(6px);
      }
    }
    @keyframes fade-in {
      from {
        opacity: 0;
      }
    }
    @keyframes ping {
      to {
        opacity: 0;
        transform: scale(2.6);
      }
    }
  `,
})
export class WhatsAppPreview {}

@Component({
  selector: 'app-customer-app-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mock" aria-hidden="true">
      <div class="phone">
        <p class="head">Your vehicle</p>
        <ol class="steps">
          @for (step of steps; track step; let i = $index) {
            <li [class.done]="i < current" [class.now]="i === current" [style.--i]="i">{{ step }}</li>
          }
        </ol>
        <div class="advisor">
          <small>Service advisor</small>
          <p>We'll send photos once the inspection is done.</p>
        </div>
      </div>
      <div class="otp">
        <small>One-time PIN</small>
        <span class="digits"><i>4</i><i>8</i><i>1</i><i>•</i><i>•</i><i>•</i></span>
      </div>
    </div>
  `,
  styles: `
    .mock {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
      gap: 0.75rem;
      align-items: center;
      font-size: 0.78rem;
    }
    .phone {
      display: grid;
      gap: 0.5rem;
      padding: 0.7rem;
      border: 1px solid var(--rule);
      border-radius: 16px;
    }
    .head {
      margin: 0;
      font-weight: 600;
    }
    .steps {
      display: grid;
      gap: 0.25rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .steps li {
      position: relative;
      padding-left: 1.1rem;
      color: var(--ink-soft);
    }
    .steps li::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.35em;
      width: 0.55rem;
      height: 0.55rem;
      border: 1.5px solid var(--rule);
      border-radius: 50%;
    }
    .steps li.done::before {
      background: var(--ink-soft);
      border-color: var(--ink-soft);
    }
    .steps li.now {
      color: var(--ink);
      font-weight: 600;
    }
    .steps li.now::before {
      background: var(--brand);
      border-color: var(--brand);
    }
    .advisor {
      padding: 0.45rem 0.6rem;
      background: color-mix(in srgb, var(--brand) 10%, transparent);
      border-radius: 8px;
    }
    .advisor small {
      color: var(--accent);
      font-family: var(--font-mono);
      font-size: 0.62rem;
    }
    .advisor p {
      margin: 0.15rem 0 0;
    }
    .otp {
      display: grid;
      gap: 0.35rem;
    }
    .otp small {
      color: var(--ink-soft);
    }
    .digits {
      display: flex;
      gap: 0.25rem;
    }
    .digits i {
      display: grid;
      place-items: center;
      width: 1.5rem;
      height: 1.9rem;
      font-style: normal;
      font-family: var(--font-mono);
      border: 1px solid var(--rule);
      border-radius: 4px;
    }
    /* When the card comes forward: the car moves through the stations, the PIN types in */
    :host-context(.card[data-pos='active']) .steps li {
      animation: step-in 0.4s var(--ease-out) both;
      animation-delay: calc(0.45s + var(--i) * 0.18s);
    }
    :host-context(.card[data-pos='active']) .steps li.now::before {
      animation: now-pulse 0.6s var(--ease-out) calc(0.45s + var(--i) * 0.18s + 0.3s) both;
    }
    :host-context(.card[data-pos='active']) .advisor {
      animation: step-in 0.45s var(--ease-out) 1.5s both;
    }
    :host-context(.card[data-pos='active']) .digits i {
      animation: digit-in 0.25s ease-out both;
    }
    :host-context(.card[data-pos='active']) .digits i:nth-child(1) {
      animation-delay: 0.6s;
    }
    :host-context(.card[data-pos='active']) .digits i:nth-child(2) {
      animation-delay: 0.75s;
    }
    :host-context(.card[data-pos='active']) .digits i:nth-child(3) {
      animation-delay: 0.9s;
    }
    :host-context(.card[data-pos='active']) .digits i:nth-child(n + 4) {
      animation-delay: 1.05s;
    }
    @keyframes step-in {
      from {
        opacity: 0;
        transform: translateX(-8px);
      }
    }
    @keyframes now-pulse {
      50% {
        transform: scale(1.6);
      }
    }
    @keyframes digit-in {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
    }
  `,
})
export class CustomerAppPreview {
  protected readonly steps = ['Checked in', 'Inspection', 'In the workshop', 'Wash bay', 'Ready'];
  protected readonly current = 2;
}

@Component({
  selector: 'app-teams-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mock" aria-hidden="true">
      <div class="top">
        <b>Team North</b>
        <span class="goal">Goal: 40 test drives</span>
      </div>
      @for (m of members; track m.name) {
        <div class="row" [class.behind]="m.progress < 60">
          <span class="name">{{ m.name }}</span>
          <span class="bar"><i [style.width.%]="m.progress" [style.--i]="$index"></i></span>
          <span class="flag">{{ m.progress < 60 ? 'Behind' : 'On track' }}</span>
        </div>
      }
      <p class="roles"><span>Can create teams</span><span>Can edit teams</span></p>
    </div>
  `,
  styles: `
    .mock {
      display: grid;
      gap: 0.5rem;
      font-size: 0.78rem;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .goal {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--ink-soft);
    }
    .row {
      display: grid;
      grid-template-columns: 4.5rem 1fr 4rem;
      align-items: center;
      gap: 0.6rem;
    }
    .bar {
      height: 0.45rem;
      background: var(--rule);
      border-radius: 999px;
      overflow: hidden;
    }
    .bar i {
      display: block;
      height: 100%;
      background: var(--ink-soft);
    }
    .behind .bar i {
      background: var(--brand);
    }
    .flag {
      font-size: 0.68rem;
      color: var(--ink-soft);
      text-align: right;
    }
    .behind .flag {
      color: var(--accent);
      font-weight: 600;
    }
    .roles {
      display: flex;
      gap: 0.4rem;
      margin: 0.2rem 0 0;
      font-family: var(--font-mono);
      font-size: 0.65rem;
    }
    .roles span {
      padding: 0.15rem 0.5rem;
      border: 1px dashed var(--rule);
      border-radius: 999px;
    }
    /* When the card comes forward: bars grow toward the goal, then the one falling behind is flagged */
    .bar i {
      transform-origin: left;
    }
    :host-context(.card[data-pos='active']) .bar i {
      animation: grow 0.9s var(--ease-out) both;
      animation-delay: calc(0.45s + var(--i) * 0.1s);
    }
    :host-context(.card[data-pos='active']) .flag {
      animation: flag-in 0.4s ease-out 1.4s both;
    }
    :host-context(.card[data-pos='active']) .behind .flag {
      animation: flag-in 0.4s ease-out 1.4s both, nudge 0.5s ease-in-out 1.8s 2;
    }
    @keyframes grow {
      from {
        transform: scaleX(0);
      }
    }
    @keyframes flag-in {
      from {
        opacity: 0;
      }
    }
    @keyframes nudge {
      50% {
        transform: translateX(-3px);
      }
    }
  `,
})
export class TeamsPreview {
  protected readonly members = [
    { name: 'Lindiwe', progress: 88 },
    { name: 'Pieter', progress: 72 },
    { name: 'Aisha', progress: 45 },
    { name: 'Ruan', progress: 64 },
  ];
}

@Component({
  selector: 'app-exports-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mock" aria-hidden="true">
      <ol class="flow">
        <li><b>Table data</b><small>Export clicked</small></li>
        <li><b>Upload to S3</b><small>Private bucket</small></li>
        <li><b>Pre-signed URL</b><small>Time-limited link</small></li>
        <li class="end"><b>Download</b><small>In the UI</small></li>
      </ol>
    </div>
  `,
  styles: `
    .flow {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.5rem;
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 0.78rem;
      counter-reset: step;
    }
    .flow li {
      position: relative;
      display: grid;
      gap: 0.1rem;
      padding: 0.6rem 0.75rem 0.6rem 2.1rem;
      border: 1px solid var(--rule);
      border-radius: 8px;
      counter-increment: step;
    }
    .flow li::before {
      content: counter(step);
      position: absolute;
      left: 0.6rem;
      top: 0.6rem;
      display: grid;
      place-items: center;
      width: 1.1rem;
      height: 1.1rem;
      font-family: var(--font-mono);
      font-size: 0.62rem;
      border: 1px solid var(--rule);
      border-radius: 50%;
    }
    .flow li.end {
      border-color: var(--brand);
    }
    .flow li.end::before {
      color: var(--brand-ink);
      background: var(--brand);
      border-color: var(--brand);
    }
    small {
      color: var(--ink-soft);
    }
    /* When the card comes forward: each step lights up in turn, ending on the download */
    :host-context(.card[data-pos='active']) .flow li {
      animation: step-in 0.45s var(--ease-out) both;
    }
    :host-context(.card[data-pos='active']) .flow li:nth-child(1) {
      animation-delay: 0.45s;
    }
    :host-context(.card[data-pos='active']) .flow li:nth-child(2) {
      animation-delay: 0.7s;
    }
    :host-context(.card[data-pos='active']) .flow li:nth-child(3) {
      animation-delay: 0.95s;
    }
    :host-context(.card[data-pos='active']) .flow li:nth-child(4) {
      animation:
        step-in 0.45s var(--ease-out) 1.2s both,
        glow 1.2s ease-out 1.6s both;
    }
    @keyframes step-in {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.97);
      }
    }
    @keyframes glow {
      30% {
        box-shadow: 0 0 0 4px color-mix(in srgb, var(--brand) 25%, transparent);
      }
    }
  `,
})
export class ExportsPreview {}

@Component({
  selector: 'app-data-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="mock" aria-hidden="true">
      <pre><code><span class="k">var</span> rows = <span class="k">await</span> conn.QueryAsync&lt;LeadStat&gt;(
    sql, <span class="k">new</span> {{ '{' }} dealerId, from, to {{ '}' }});</code></pre>
      <p class="tags"><span>New tables and columns</span><span>Root-cause SQL</span><span>AI-assisted (Claude)</span></p>
    </div>
  `,
  styles: `
    .mock {
      display: grid;
      gap: 0.6rem;
    }
    pre {
      margin: 0;
      padding: 0.75rem 0.9rem;
      overflow-x: auto;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      line-height: 1.6;
      background: var(--paper);
      border: 1px solid var(--rule);
      border-radius: 8px;
    }
    .k {
      color: var(--accent);
    }
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 0;
      font-family: var(--font-mono);
      font-size: 0.65rem;
    }
    .tags span {
      padding: 0.15rem 0.5rem;
      border: 1px dashed var(--rule);
      border-radius: 999px;
    }
    /* When the card comes forward: the query types itself out, then the tags pop in */
    :host-context(.card[data-pos='active']) code {
      display: inline-block;
      animation: type-out 1.2s steps(40, end) 0.45s both;
    }
    :host-context(.card[data-pos='active']) .tags span {
      animation: pop 0.35s var(--ease-out) both;
    }
    :host-context(.card[data-pos='active']) .tags span:nth-child(1) {
      animation-delay: 1.6s;
    }
    :host-context(.card[data-pos='active']) .tags span:nth-child(2) {
      animation-delay: 1.72s;
    }
    :host-context(.card[data-pos='active']) .tags span:nth-child(3) {
      animation-delay: 1.84s;
    }
    @keyframes type-out {
      from {
        clip-path: inset(0 100% 0 0);
      }
      to {
        clip-path: inset(0 0 0 0);
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
export class DataPreview {}
