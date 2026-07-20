// Realistic sample data generator for the Shortlisted Candidates dashboard

export type Stage =
  | "Shortlisted"
  | "Phone Screen"
  | "Technical"
  | "Onsite"
  | "Offer"
  | "Hired"
  | "Rejected";

export type Department =
  | "Engineering"
  | "Design"
  | "Product"
  | "Marketing"
  | "Sales"
  | "Operations"
  | "Data";

export type Source =
  | "LinkedIn"
  | "Referral"
  | "Job Board"
  | "Company Site"
  | "Agency"
  | "University";

export type Seniority = "Junior" | "Mid" | "Senior" | "Lead" | "Principal";

export interface InterviewEvent {
  stage: Stage;
  date: string; // ISO
  interviewer: string;
  feedback: string;
  rating: number; // 1-5
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  department: Department;
  seniority: Seniority;
  source: Source;
  stage: Stage;
  score: number; // 0-100
  yearsExp: number;
  location: string;
  appliedAt: string; // ISO date
  shortlistedAt: string; // ISO
  daysInPipeline: number;
  status: "Active" | "On Hold" | "Rejected" | "Offer" | "Hired";
  avatar: string; // initials color hex
  // Extended profile details
  email: string;
  phone: string;
  education: string;
  previousCompany: string;
  expectedSalary: string;
  noticePeriod: string;
  skills: string[];
  summary: string;
  resumeMatch: number; // 0-100
  interviewHistory: InterviewEvent[];
}

const FIRST = [
  "Aarav","Priya","Liam","Sofia","Noah","Mia","Ethan","Ava","Kai","Zara",
  "Marcus","Elena","Diego","Aisha","Ravi","Leah","Yuki","Omar","Nora","Ian",
  "Chloe","Jonas","Amara","Felix","Isla","Mateo","Anika","Ruben","Sana","Theo",
  "Nadia","Hugo","Maya","Arjun","Freya","Levi","Iris","Kian","Selin","Rafael",
];
const LAST = [
  "Patel","Nguyen","Kim","Garcia","Silva","Novak","Rossi","Ahmed","Chen","Okafor",
  "Ivanov","Müller","Dubois","Cohen","Andersen","Lopez","Fischer","Wang","Reyes","Singh",
  "Kowalski","Nakamura","Bianchi","Haddad","Petrov","Costa","Sato","Park","Oliveira","Ali",
];
const ROLES: Record<Department, string[]> = {
  Engineering: ["Frontend Engineer","Backend Engineer","Full-Stack Engineer","DevOps Engineer","Mobile Engineer","QA Engineer"],
  Design: ["Product Designer","UX Researcher","Visual Designer","Design Systems Lead"],
  Product: ["Product Manager","Technical PM","Growth PM"],
  Marketing: ["Content Strategist","Growth Marketer","Brand Manager"],
  Sales: ["Account Executive","Sales Development Rep","Enterprise AE"],
  Operations: ["People Ops","Recruiting Coordinator","Business Ops Analyst"],
  Data: ["Data Scientist","Data Engineer","ML Engineer","Analytics Engineer"],
};
const LOCATIONS = ["Remote · US","Remote · EU","New York, NY","San Francisco, CA","Austin, TX","London, UK","Berlin, DE","Toronto, CA","Bangalore, IN","Singapore, SG"];
const DEPTS: Department[] = ["Engineering","Design","Product","Marketing","Sales","Operations","Data"];
const SOURCES: Source[] = ["LinkedIn","Referral","Job Board","Company Site","Agency","University"];
const SENIORITIES: Seniority[] = ["Junior","Mid","Senior","Lead","Principal"];
const STAGES: Stage[] = ["Shortlisted","Phone Screen","Technical","Onsite","Offer","Hired","Rejected"];
const AVATAR_COLORS = ["#6366f1","#8b5cf6","#ec4899","#f43f5e","#f59e0b","#10b981","#14b8a6","#0ea5e9","#3b82f6","#a855f7"];

const UNIVERSITIES = [
  "Stanford University","MIT","UC Berkeley","University of Toronto","Imperial College London",
  "National University of Singapore","IIT Bombay","TU Munich","University of Waterloo","ETH Zurich",
  "University of Michigan","Georgia Tech","Carnegie Mellon University","University of Melbourne","NYU",
];
const DEGREES = ["B.Sc. Computer Science","B.Tech in Engineering","M.Sc. Data Science","MBA","B.A. Design","M.Eng. Software Systems","B.Sc. Business Analytics"];
const PREV_COMPANIES = [
  "Nimbus Labs","Quantix Corp","Bright Path Inc.","Vertex Solutions","Northwind Digital","Cascade Systems",
  "Lumen Analytics","Orbit Software","Pinecone Technologies","Anchor Point Media","Skyline Ventures","Fern & Co.",
];
const SKILL_POOL: Record<Department, string[]> = {
  Engineering: ["React","TypeScript","Node.js","AWS","Docker","Kubernetes","GraphQL","Python","CI/CD","System Design"],
  Design: ["Figma","User Research","Prototyping","Design Systems","Wireframing","Accessibility","Sketch","Motion Design"],
  Product: ["Roadmapping","A/B Testing","SQL","Stakeholder Mgmt","Agile","User Stories","Analytics","Prioritization"],
  Marketing: ["SEO","Content Strategy","Copywriting","Google Ads","Brand Strategy","Email Marketing","Analytics"],
  Sales: ["Negotiation","CRM","Cold Outreach","Pipeline Mgmt","Salesforce","Account Management","Closing"],
  Operations: ["Process Design","ATS Tools","Vendor Mgmt","Onboarding","Compliance","Scheduling","Reporting"],
  Data: ["Python","SQL","Machine Learning","Tableau","Statistics","ETL","Spark","A/B Testing"],
};
const INTERVIEWERS = ["Priya Sharma","James Carter","Wei Zhang","Fatima Noor","Lucas Meyer","Sofia Ricci","Daniel Osei","Hana Kobayashi"];
const FEEDBACK_POOL = [
  "Strong communicator, solid grasp of fundamentals.",
  "Impressive problem-solving approach under pressure.",
  "Great culture fit, asked thoughtful questions.",
  "Solid technical depth, needs more system design practice.",
  "Very structured thinker, clear examples from past work.",
  "Enthusiastic and quick learner, some gaps in experience.",
  "Excellent portfolio walkthrough, confident presenter.",
  "Good collaborator, could improve on concise communication.",
];

// Deterministic PRNG so data is stable across renders
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

function daysAgoIso(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

// Generate ~180 candidates spread across the last ~90 days
export const CANDIDATES: Candidate[] = Array.from({ length: 184 }, (_, i) => {
  const dept = pick(DEPTS);
  const role = pick(ROLES[dept]);
  const first = pick(FIRST);
  const last = pick(LAST);
  const daysAgo = int(0, 89);
  const pipeline = int(1, Math.max(1, daysAgo));
  const stageWeights: [Stage, number][] = [
    ["Shortlisted", 42],
    ["Phone Screen", 22],
    ["Technical", 14],
    ["Onsite", 8],
    ["Offer", 5],
    ["Hired", 4],
    ["Rejected", 5],
  ];
  const total = stageWeights.reduce((s, [, w]) => s + w, 0);
  let r = rand() * total;
  let stage: Stage = "Shortlisted";
  for (const [s, w] of stageWeights) {
    if (r < w) {
      stage = s;
      break;
    }
    r -= w;
  }
  const status: Candidate["status"] =
    stage === "Hired"
      ? "Hired"
      : stage === "Offer"
      ? "Offer"
      : stage === "Rejected"
      ? "Rejected"
      : rand() < 0.08
      ? "On Hold"
      : "Active";

  const seniority = pick(SENIORITIES);
  const email = `${first.toLowerCase()}.${last.toLowerCase()}${int(1, 99)}@mail.com`;
  const phone = `+1 (${int(200, 999)}) ${int(200, 999)}-${String(int(0, 9999)).padStart(4, "0")}`;
  const education = `${pick(DEGREES)} · ${pick(UNIVERSITIES)}`;
  const previousCompany = pick(PREV_COMPANIES);
  const expectedSalary = `$${int(70, 220)}k`;
  const noticePeriod = pick(["Immediate", "2 weeks", "1 month", "6 weeks", "2 months"]);
  const skillPool = SKILL_POOL[dept];
  const skillCount = int(4, 6);
  const skills = Array.from(new Set(Array.from({ length: skillCount }, () => pick(skillPool))));
  const resumeMatch = int(60, 99);
  const summary = `${seniority}-level ${role.toLowerCase()} with ${int(1, 15)}+ years of relevant background, coming from ${previousCompany}. Sourced via ${pick(SOURCES)} and shortlisted for strong alignment with the ${dept} team's needs.`;

  // Build interview history up to how far the candidate progressed
  const stageOrder: Stage[] = ["Shortlisted", "Phone Screen", "Technical", "Onsite", "Offer", "Hired"];
  const reachedIndex = stage === "Rejected" ? int(0, 3) : stageOrder.indexOf(stage);
  const interviewStages = stageOrder.slice(1, Math.max(1, reachedIndex + 1)).filter((s) => s !== "Offer" && s !== "Hired");
  const interviewHistory: InterviewEvent[] = interviewStages.map((s, idx) => ({
    stage: s,
    date: daysAgoIso(Math.max(0, daysAgo - idx * int(2, 5))),
    interviewer: pick(INTERVIEWERS),
    feedback: pick(FEEDBACK_POOL),
    rating: int(3, 5),
  }));

  return {
    id: `CND-${String(1000 + i)}`,
    name: `${first} ${last}`,
    role,
    department: dept,
    seniority,
    source: pick(SOURCES),
    stage,
    score: int(58, 98),
    yearsExp: int(1, 15),
    location: pick(LOCATIONS),
    appliedAt: daysAgoIso(daysAgo + pipeline),
    shortlistedAt: daysAgoIso(daysAgo),
    daysInPipeline: pipeline,
    status,
    avatar: AVATAR_COLORS[i % AVATAR_COLORS.length],
    email,
    phone,
    education,
    previousCompany,
    expectedSalary,
    noticePeriod,
    skills,
    summary,
    resumeMatch,
    interviewHistory,
  };
});

export const DEPARTMENTS = DEPTS;
export const ALL_SOURCES = SOURCES;
export const ALL_STAGES = STAGES;
