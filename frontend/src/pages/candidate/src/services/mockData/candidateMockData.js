// Placeholder data for the Candidate Portal.
// This stands in for HireMind.Api endpoints that don't exist yet (see
// backend/src/HireMind.Api). Swap `candidateApi.js` over to real fetch calls
// once /api/jobs, /api/applications, /api/interviews are live — the function
// signatures in candidateApi.js are written to match that future contract.

export const MOCK_JOBS = [
  {
    id: 'job-1001',
    title: 'Frontend Engineer, Platform',
    company: 'Northgale Systems',
    location: 'Colombo, LK',
    remote: true,
    role: 'Engineering',
    salaryMin: 180000,
    salaryMax: 260000,
    currency: 'LKR',
    skills: ['React', 'TypeScript', 'CSS', 'Accessibility'],
    postedAt: '2026-07-02',
    description:
      'Own the component library that powers three product lines. Work closely with design on a token-based system and help junior engineers ship accessible UI.',
  },
  {
    id: 'job-1002',
    title: 'Data Analyst, Risk',
    company: 'Ceylon Fintrust',
    location: 'Colombo, LK',
    remote: false,
    role: 'Data',
    salaryMin: 150000,
    salaryMax: 210000,
    currency: 'LKR',
    skills: ['SQL', 'Python', 'Statistics', 'Tableau'],
    postedAt: '2026-07-06',
    description:
      'Build the weekly risk-exposure reporting pipeline and partner with compliance to translate regulatory changes into dashboards.',
  },
  {
    id: 'job-1003',
    title: 'Product Designer',
    company: 'Aviro Labs',
    location: 'Remote',
    remote: true,
    role: 'Design',
    salaryMin: 190000,
    salaryMax: 250000,
    currency: 'LKR',
    skills: ['Figma', 'Design Systems', 'User Research'],
    postedAt: '2026-06-28',
    description:
      'Shape the onboarding experience for a B2B SaaS product used by 40+ enterprise clients. Heavy collaboration with PM and engineering.',
  },
  {
    id: 'job-1004',
    title: 'Backend Engineer, Payments',
    company: 'Northgale Systems',
    location: 'Colombo, LK',
    remote: false,
    role: 'Engineering',
    salaryMin: 220000,
    salaryMax: 300000,
    currency: 'LKR',
    skills: ['C#', '.NET', 'PostgreSQL', 'Distributed Systems'],
    postedAt: '2026-07-09',
    description:
      'Design and operate the ledger service behind our payment rails. On-call rotation, high-availability mindset required.',
  },
  {
    id: 'job-1005',
    title: 'Machine Learning Engineer',
    company: 'Solvane AI',
    location: 'Remote',
    remote: true,
    role: 'Data',
    salaryMin: 240000,
    salaryMax: 320000,
    currency: 'LKR',
    skills: ['Python', 'PyTorch', 'MLOps', 'NLP'],
    postedAt: '2026-07-10',
    description:
      'Fine-tune and serve the recommendation models behind our matching engine. You will own eval pipelines end to end.',
  },
  {
    id: 'job-1006',
    title: 'QA Automation Engineer',
    company: 'Ceylon Fintrust',
    location: 'Kandy, LK',
    remote: false,
    role: 'Engineering',
    salaryMin: 140000,
    salaryMax: 190000,
    currency: 'LKR',
    skills: ['Playwright', 'CI/CD', 'JavaScript'],
    postedAt: '2026-06-30',
    description:
      'Build out automated regression coverage for the core banking web app ahead of a major release.',
  },
  {
    id: 'job-1007',
    title: 'UX Researcher',
    company: 'Aviro Labs',
    location: 'Colombo, LK',
    remote: true,
    role: 'Design',
    salaryMin: 170000,
    salaryMax: 230000,
    currency: 'LKR',
    skills: ['User Research', 'Interviewing', 'Figma'],
    postedAt: '2026-07-01',
    description:
      'Run a continuous discovery practice across three squads. Prior experience with B2B research a strong plus.',
  },
  {
    id: 'job-1008',
    title: 'Product Manager, Growth',
    company: 'Solvane AI',
    location: 'Colombo, LK',
    remote: false,
    role: 'Product',
    salaryMin: 260000,
    salaryMax: 340000,
    currency: 'LKR',
    skills: ['Product Strategy', 'SQL', 'Experimentation'],
    postedAt: '2026-07-04',
    description:
      'Own the activation funnel for our self-serve tier. Comfortable running experiments and reading the data yourself.',
  },
];

// Seed applications reference the jobs above by id so the tracker and the
// job list stay consistent out of the box.
export const MOCK_APPLICATIONS_SEED = [
  {
    id: 'app-1',
    jobId: 'job-1004',
    stage: 'interview',
    appliedAt: '2026-06-20',
    history: [
      { stage: 'applied', at: '2026-06-20' },
      { stage: 'screened', at: '2026-06-25' },
      { stage: 'interview', at: '2026-07-03' },
    ],
    notes: 'Recruiter mentioned a second-round system design round.',
  },
  {
    id: 'app-2',
    jobId: 'job-1003',
    stage: 'screened',
    appliedAt: '2026-06-24',
    history: [
      { stage: 'applied', at: '2026-06-24' },
      { stage: 'screened', at: '2026-07-01' },
    ],
    notes: '',
  },
  {
    id: 'app-3',
    jobId: 'job-1006',
    stage: 'applied',
    appliedAt: '2026-07-08',
    history: [{ stage: 'applied', at: '2026-07-08' }],
    notes: '',
  },
  {
    id: 'app-4',
    jobId: 'job-1002',
    stage: 'offer',
    appliedAt: '2026-06-10',
    history: [
      { stage: 'applied', at: '2026-06-10' },
      { stage: 'screened', at: '2026-06-14' },
      { stage: 'interview', at: '2026-06-22' },
      { stage: 'offer', at: '2026-07-05' },
    ],
    notes: 'Offer expires 2026-07-20. Base + variable, details in email.',
  },
];

export const MOCK_INTERVIEWS_SEED = [
  {
    id: 'iv-1',
    applicationId: 'app-1',
    jobId: 'job-1004',
    type: 'Technical — System Design',
    mode: 'Video call',
    scheduledAt: '2026-07-17T10:30:00+05:30',
    durationMinutes: 60,
    withPeople: ['Dinusha Perera (Eng Manager)', 'Ravindu Silva (Staff Eng)'],
    location: 'Google Meet (link sent by email)',
    status: 'pending_confirmation',
  },
  {
    id: 'iv-2',
    applicationId: 'app-4',
    jobId: 'job-1002',
    type: 'Offer discussion',
    mode: 'Phone call',
    scheduledAt: '2026-07-15T15:00:00+05:30',
    durationMinutes: 30,
    withPeople: ['Amali Fernando (Talent Partner)'],
    location: '+94 11 234 5678',
    status: 'confirmed',
  },
];

export const ROLE_OPTIONS = ['Engineering', 'Data', 'Design', 'Product'];

export const SKILL_SUGGESTIONS = [
  'React',
  'TypeScript',
  'JavaScript',
  'Node.js',
  'C#',
  '.NET',
  'Python',
  'SQL',
  'PostgreSQL',
  'Figma',
  'Design Systems',
  'User Research',
  'PyTorch',
  'MLOps',
  'Playwright',
  'Product Strategy',
];

export const DEFAULT_PROFILE = {
  personal: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    headline: '',
    summary: '',
  },
  education: [],
  workHistory: [],
  skills: [],
  resume: null,
};
