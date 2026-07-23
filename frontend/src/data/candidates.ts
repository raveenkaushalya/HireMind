// Realistic sample data generator for the Shortlisted Candidates dashboard

export type Stage =
  | "Applied"
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
  status: "Active" | "On Hold" | "Rejected" | "Offer" | "Hired" | "Under Review";
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
  resumeUrl?: string;
  interviewHistory: InterviewEvent[];
}

export const CANDIDATES: Candidate[] = [];

export const DEPARTMENTS: Department[] = [];
export const ALL_SOURCES: Source[] = [];
export const ALL_STAGES: Stage[] = [];
