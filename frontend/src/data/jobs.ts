export interface Job {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  salary: string;
  posted: string;
  tags: string[];
  aiScore: number;
  description: string;
  applicants: number;
  fullDescription: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  experience: string;
  department: string;
  companyDescription: string;
  skillMatch: { skill: string; match: number }[];
  category: string;
  minQualification?: string;
}

export const jobs: Job[] = [];

export const categories = [];
