/**
 * Pre-written answers for the "Ask me" chat, in the first person. Factual and plain:
 * no client names or internal details.
 */
export interface ChatLink {
  label: string;
  href: string;
}

export interface ChatTopic {
  id: string;
  question: string;
  answer: string[];
  links?: ChatLink[];
}

export const CHAT_GREETING = [
  "Hi, I'm Phillip. Thanks for stopping by.",
  "Pick a question below and I'll answer it.",
];

export const CHAT_TOPICS: ChatTopic[] = [
  {
    id: 'about',
    question: 'Tell me about yourself',
    answer: [
      "I'm a front-end-focused full-stack developer based in Somerset West, South Africa. I build customer-facing web and mobile apps with Angular, Ionic and .NET (C#), and I've worked in telecommunications and automotive since 2022.",
      'I have a passion for problem solving that I learned from a young age on the family farm, and I enjoy developing and strive to keep improving my skill set.',
      "I prefer the front end, but I've worked full stack my whole career.",
    ],
  },
  {
    id: 'stack',
    question: "What's your main tech stack?",
    answer: [
      "On the front end: Angular (version 11 up to 22, which I'm using on the newest mobile app), TypeScript, Ionic, PrimeNG, Highcharts and Syncfusion, plus AngularJS, JavaScript, HTML and CSS.",
      "On the back end: C# and .NET Core, REST APIs, Entity Framework, Dapper, SignalR and SQL Server. In the cloud I've worked with AWS Lambda, S3, SNS and SQS.",
    ],
  },
  {
    id: 'current',
    question: 'What do you do in your current role?',
    answer: [
      "I'm a Software Developer at CMS Systems, which makes automotive software. I've been there since September 2023, working hybrid.",
      'I rewrote the lead management front end from AngularJS 1.8.2 to Angular 19, and the stock management front end from Angular 11 to Angular 19, page by page. I also built interactive Highcharts dashboards with drill-down, and a tablet document-signing solution using Syncfusion and AWS S3.',
      'The platform has over 71,000 users.',
    ],
  },
  {
    id: 'highlight',
    question: 'Which project should I look at first?',
    answer: [
      'The lead management rewrite. I designed and built the new front end independently over 4 months, moving it from AngularJS 1.8.2 to Angular 19.',
      'The Projects section has a before-and-after slider that shows the idea, using my own mock-up screens.',
    ],
    links: [{ label: 'Go to Projects', href: '#projects' }],
  },
  {
    id: 'more-work',
    question: 'What else have you built at CMS Systems?',
    answer: [
      'I added WhatsApp messaging to the workshop system, with utility template messages to customers (like when their car is ready for collection, with photos) and SignalR updating the UI in real time.',
      'I created a customer workshop app with TypeScript and Ionic, and added a teams-and-goals section to the sales module, with a view of where team members are falling behind and role assignment for who can create and edit teams.',
      'I also added multiple table data exports through S3 and pre-signed URLs, and did a lot of database work: new tables and columns, performance improvements, Dapper queries for dashboards, and bug fixes.',
    ],
    links: [{ label: 'See them in Projects', href: '#projects' }],
  },
  {
    id: 'realtime',
    question: 'Have you built real-time features?',
    answer: [
      'Yes. When I added WhatsApp messaging to the workshop system, I used SignalR so new messages show up in the UI in real time.',
    ],
  },
  {
    id: 'ai',
    question: 'Do you use AI tools?',
    answer: [
      "Yes, I use Claude. It helped me improve performance on projects where I'd added new tables and columns, and I used it to help write Dapper queries that act as stored procedures for our dashboards.",
    ],
  },
  {
    id: 'cloud',
    question: "What's your cloud experience?",
    answer: [
      'Mostly AWS. At CMS Systems I developed Lambda functions for SMS, SQS-driven email and third-party payloads, and used SNS to notify third parties.',
      "I also made all S3 buckets private for one of the company's largest apps and moved file retrieval to the AWS SDK with pre-signed URLs, and I added table data exports that are uploaded to S3 and sent to the UI as pre-signed URLs.",
      'At WIM Technologies I built a scheduled AWS Lambda job that populates daily statistics for a KPI module.',
    ],
  },
  {
    id: 'mobile',
    question: 'Have you built mobile apps?',
    answer: [
      "Yes. At CMS Systems I'm responsible for moving the company's mobile apps into one Angular and Ionic app, and I'm working with Angular 22 on the newest one.",
      'I created a customer workshop app with TypeScript and Ionic: customers open it from a link, verify with a one-time PIN, see which station their car is at, and communicate with their service advisor.',
      'I also built a tablet document-signing solution using Syncfusion and AWS S3.',
    ],
  },
  {
    id: 'team',
    question: 'How do you work with a team?',
    answer: [
      'At WIM Technologies I did front-end and back-end work in a fully remote Scrum team, and worked with a graphic designer on UI improvements to a Google Maps project.',
      'I work with Git, Bitbucket pipelines and Jira.',
    ],
  },
  {
    id: 'study',
    question: 'What did you study?',
    answer: ['A BSc in Computer Science at Stellenbosch University, from 2018 to 2022. I studied on a rugby bursary.'],
  },
  {
    id: 'location',
    question: 'Where are you based?',
    answer: [
      "Somerset West, South Africa (UTC+2). I've worked both fully remote and hybrid.",
      'I speak English and Afrikaans.',
    ],
  },
  {
    id: 'contact',
    question: 'How can I get in touch?',
    answer: [
      'Email is best: Phillipmar27@gmail.com. You can also find me on LinkedIn and GitHub, or download my CV.',
    ],
    links: [
      { label: 'Email me', href: 'mailto:Phillipmar27@gmail.com' },
      { label: 'Download my CV', href: 'Phillip-Marais-CV.pdf' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/phillip-m-92b2a7136/' },
      { label: 'GitHub', href: 'https://github.com/PhillipMarais' },
    ],
  },
];
