import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Fictional "before" screen in an early-2010s AngularJS style. Decorative only. */
@Component({
  selector: 'app-legacy-screen',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="screen">
      <div class="titlebar">
        <b>LeadManager 2.3</b>
        <span>Welcome, <u>demo</u> | <u>Logout</u></span>
      </div>
      <div class="tabs">
        <span class="tab on">Leads</span><span class="tab">Reports</span><span class="tab">Admin</span>
      </div>
      <div class="body">
        <fieldset>
          <legend>Search leads</legend>
          Name: <span class="input"></span>
          <span class="btn">Go</span>
          <span class="btn">Reset</span>
        </fieldset>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th class="wide">Enquiry</th>
              <th>Status</th>
              <th class="wide">Date</th>
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track row.id) {
              <tr>
                <td>{{ row.id }}</td>
                <td><u>{{ row.name }}</u></td>
                <td class="wide">{{ row.enquiry }}</td>
                <td>{{ row.status }}</td>
                <td class="wide">{{ row.date }}</td>
              </tr>
            }
          </tbody>
        </table>
        <div class="pager">
          <span>&laquo; Prev</span> Page 1 of 9 <span>Next &raquo;</span>
        </div>
        <div class="note">ng-repeat="lead in leads | filter:search"</div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      height: 100%;
    }
    .screen {
      height: 100%;
      background: #ece9d8;
      color: #000;
      font: 11px/1.35 Verdana, Tahoma, sans-serif;
      overflow: hidden;
    }
    .titlebar {
      display: flex;
      justify-content: space-between;
      gap: 8px;
      padding: 6px 8px;
      color: #fff;
      background: linear-gradient(#3a6ea5, #1c4a7e);
      border-bottom: 2px solid #0b2f57;
      white-space: nowrap;
    }
    .titlebar u {
      color: #cfe2ff;
    }
    .tabs {
      display: flex;
      gap: 2px;
      padding: 6px 8px 0;
      border-bottom: 1px solid #919b9c;
    }
    .tab {
      padding: 3px 10px;
      background: linear-gradient(#fff, #d8d4c4);
      border: 1px solid #919b9c;
      border-bottom: 0;
    }
    .tab.on {
      background: #fff;
      font-weight: bold;
    }
    .body {
      padding: 8px;
    }
    fieldset {
      margin: 0 0 8px;
      padding: 4px 8px 8px;
      border: 1px solid #919b9c;
      background: #f4f3ee;
    }
    legend {
      color: #0046d5;
      padding: 0 3px;
    }
    .input {
      display: inline-block;
      width: 30%;
      height: 15px;
      vertical-align: middle;
      background: #fff;
      border: 1px solid #7f9db9;
    }
    .btn {
      display: inline-block;
      margin-left: 4px;
      padding: 1px 8px;
      background: linear-gradient(#fff, #e3e0d0);
      border: 1px solid #003c74;
      border-radius: 3px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
    }
    th,
    td {
      border: 1px solid #a5acb5;
      padding: 3px 5px;
      text-align: left;
      white-space: nowrap;
    }
    th {
      background: linear-gradient(#f9f9f9, #d6dbe4);
    }
    tbody tr:nth-child(even) td {
      background: #eef3fb;
    }
    td u {
      color: #0000ee;
    }
    .pager {
      margin-top: 6px;
      text-align: center;
    }
    .pager span {
      color: #0000ee;
      text-decoration: underline;
    }
    .note {
      margin-top: 10px;
      font-family: 'Courier New', monospace;
      color: #6d6d6d;
    }
    @container (max-width: 520px) {
      .wide {
        display: none;
      }
    }
  `,
})
export class LegacyScreen {
  protected readonly rows = [
    { id: 2041, name: 'A. van Wyk', enquiry: 'Hatchback enquiry', status: 'NEW', date: '03/02/2014' },
    { id: 2040, name: 'S. Ndlovu', enquiry: 'Test drive', status: 'CONTACTED', date: '03/02/2014' },
    { id: 2039, name: 'L. Mokoena', enquiry: 'Finance quote', status: '{{lead.status}}', date: '02/02/2014' },
    { id: 2038, name: 'J. Pretorius', enquiry: 'Trade-in', status: 'WON', date: '01/02/2014' },
    { id: 2037, name: 'M. Daniels', enquiry: 'Service booking', status: 'NEW', date: '31/01/2014' },
    { id: 2036, name: 'T. Botha', enquiry: 'Bakkie enquiry', status: 'LOST', date: '30/01/2014' },
  ];
}
