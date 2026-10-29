/**
 * Skills and where each one was used. Evidence is factual; no levels, bars or percentages.
 * A skill with no example yet gets an empty list.
 */
export interface Evidence {
  where: string;
  what: string;
}

export interface Skill {
  name: string;
  evidence: Evidence[];
}

export interface SkillGroup {
  title: string;
  skills: Skill[];
}

const CMS = 'CMS Systems';
const WIM = 'WIM Technologies';
const STOCK = 'Stock Management App';
const QUOTE = 'Customer and quote manager';

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: 'Front end',
    skills: [
      {
        name: 'Angular (11 to 22)',
        evidence: [
          { where: CMS, what: 'Working with Angular 22 on the newest mobile app' },
          { where: CMS, what: 'Rewrote the lead management front end from AngularJS 1.8.2 to Angular 19' },
          { where: CMS, what: 'Rewrote the stock management front end from Angular 11 to Angular 19, page by page' },
          { where: STOCK, what: 'Vehicle stock management app with Angular and Angular Material' },
          { where: QUOTE, what: 'Angular 19 with NgRx and route guards' },
        ],
      },
      {
        name: 'TypeScript',
        evidence: [
          { where: CMS, what: 'Lead management rewrite in Angular 19' },
          { where: CMS, what: 'WhatsApp messaging in the workshop system, with real-time updates over SignalR' },
          { where: CMS, what: 'Customer workshop app built with TypeScript and Ionic' },
          { where: QUOTE, what: 'Angular 19 and NgRx (store, effects, entity)' },
        ],
      },
      {
        name: 'Ionic',
        evidence: [
          { where: CMS, what: "Responsible for moving the company's mobile apps into one Angular and Ionic app" },
          {
            where: CMS,
            what: 'Created a customer workshop app: link access, one-time PIN, live station status and messaging with the service advisor',
          },
        ],
      },
      {
        name: 'PrimeNG',
        evidence: [{ where: STOCK, what: 'Used with Angular and Angular Material' }],
      },
      {
        name: 'Highcharts',
        evidence: [
          {
            where: CMS,
            what: 'Built interactive dashboards (lead analytics, OEM, workshop) with drill-down; improved performance with lazy loading and split drill-down views',
          },
        ],
      },
      {
        name: 'Syncfusion',
        evidence: [{ where: CMS, what: 'Built a tablet document-signing solution using Syncfusion and AWS S3' }],
      },
      {
        name: 'AngularJS',
        evidence: [{ where: CMS, what: 'Rewrote the lead management front end from AngularJS 1.8.2 to Angular 19' }],
      },
      {
        name: 'JavaScript',
        evidence: [
          {
            where: CMS,
            what: 'Sales teams and goals: dealers create teams and set goals, with a view of where members are falling behind and role-based editing',
          },
          { where: WIM, what: 'Front-end work with HTML, CSS and JavaScript in a remote Scrum team' },
        ],
      },
      {
        name: 'HTML',
        evidence: [{ where: WIM, what: 'Front-end work with HTML, CSS and JavaScript' }],
      },
      {
        name: 'CSS',
        evidence: [
          { where: WIM, what: 'Front-end work with HTML, CSS and JavaScript' },
          { where: WIM, what: 'UI improvements to a Google Maps project, working with a graphic designer' },
        ],
      },
    ],
  },
  {
    title: 'Back end',
    skills: [
      {
        name: 'C# and .NET Core',
        evidence: [
          { where: WIM, what: 'Back-end work with .NET Core in a remote Scrum team' },
          { where: STOCK, what: 'ASP.NET Core Web API' },
        ],
      },
      {
        name: 'REST APIs',
        evidence: [{ where: STOCK, what: 'ASP.NET Core Web API' }],
      },
      {
        name: 'Entity Framework',
        evidence: [{ where: STOCK, what: 'Entity Framework Core with SQL Server' }],
      },
      {
        name: 'SQL Server',
        evidence: [
          // TODO: Phillip to confirm the CMS database is SQL Server (it may belong under a general "SQL" chip)
          { where: CMS, what: 'Added new tables and columns for most projects; used SQL to find the root cause of bugs' },
          { where: STOCK, what: 'With Entity Framework Core and an ASP.NET Core Web API' },
        ],
      },
      {
        name: 'Dapper',
        evidence: [{ where: CMS, what: 'Dapper queries that act as stored procedures for the dashboards, written with help from Claude' }],
      },
      {
        name: 'SignalR',
        evidence: [{ where: CMS, what: 'Real-time UI updates for WhatsApp messages in the workshop system' }],
      },
      {
        name: 'WhatsApp messaging',
        evidence: [
          {
            where: CMS,
            what: 'Utility template messages to customers, like when their car is ready for collection, with uploaded photos',
          },
        ],
      },
    ],
  },
  {
    title: 'Cloud',
    skills: [
      {
        name: 'AWS Lambda',
        evidence: [
          { where: CMS, what: 'Developed Lambda functions for SMS, SQS-driven email and third-party payloads' },
          { where: WIM, what: 'Built a scheduled Lambda job that populates daily statistics for a KPI module' },
        ],
      },
      {
        name: 'S3',
        evidence: [
          {
            where: CMS,
            what: "Made all S3 buckets private for one of the company's largest apps and moved file retrieval to the AWS SDK with pre-signed URLs",
          },
          { where: CMS, what: 'Built a tablet document-signing solution using Syncfusion and AWS S3' },
          { where: CMS, what: 'Multiple table data exports, uploaded to S3 and sent to the UI as pre-signed URLs' },
        ],
      },
      {
        name: 'SNS',
        evidence: [{ where: CMS, what: 'Used SNS to notify third parties' }],
      },
      {
        name: 'SQS',
        evidence: [{ where: CMS, what: 'SQS-driven email from Lambda functions' }],
      },
    ],
  },
  {
    title: 'Tools and process',
    skills: [
      { name: 'Git', evidence: [] },
      { name: 'Bitbucket pipelines', evidence: [] },
      { name: 'Jira', evidence: [] },
      {
        name: 'Claude (AI-assisted development)',
        evidence: [
          { where: CMS, what: 'Used Claude to help improve performance on projects with new tables and columns' },
          { where: CMS, what: 'Used Claude to help write Dapper queries that act as stored procedures for the dashboards' },
        ],
      },
      {
        name: 'Scrum',
        evidence: [{ where: WIM, what: 'Front-end and back-end work in a fully remote Scrum team' }],
      },
    ],
  },
];
