// Candidate Portal data access layer.
//
// The real backend (backend/src/HireMind.Api) doesn't expose candidate
// endpoints yet — Program.cs is still just the default template. Rather than
// block the whole Candidate Portal on that, every function here simulates
// the network call (latency + localStorage persistence) but keeps the same
// name/shape a real implementation would have, e.g.:
//
//   export async function fetchRecommendedJobs(profile) { ... }
//
// becomes, later:
//
//   export async function fetchRecommendedJobs(profile) {
//     const res = await fetch(`${apiBaseUrl}/api/candidate/jobs/recommended`, {
//       method: 'POST', body: JSON.stringify(profile), ...
//     });
//     return res.json();
//   }
//
// so swapping the implementation shouldn't require touching any component.

import {
  MOCK_JOBS,
  MOCK_APPLICATIONS_SEED,
  MOCK_INTERVIEWS_SEED,
} from './mockData/candidateMockData';

const LATENCY_MS = 380;

const STORAGE_KEYS = {
  applications: 'hiremind.candidate.applications',
  interviews: 'hiremind.candidate.interviews',
};

function delay(value, ms = LATENCY_MS) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

function readSeeded(key, seed) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    window.localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  } catch {
    return seed;
  }
}

function writeStore(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // best-effort only — a full disk / private-browsing mode shouldn't crash the UI
  }
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

/**
 * @param {{ query?: string, location?: string, role?: string, skills?: string[],
 *           salaryMin?: number, remoteOnly?: boolean }} filters
 */
export async function searchJobs(filters = {}) {
  const { query = '', location = '', role = '', skills = [], salaryMin = 0, remoteOnly = false } = filters;

  const results = MOCK_JOBS.filter((job) => {
    const matchesQuery =
      !query ||
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.company.toLowerCase().includes(query.toLowerCase());
    const matchesLocation = !location || job.location.toLowerCase().includes(location.toLowerCase());
    const matchesRole = !role || job.role === role;
    const matchesSkills = skills.length === 0 || skills.some((s) => job.skills.includes(s));
    const matchesSalary = job.salaryMax >= salaryMin;
    const matchesRemote = !remoteOnly || job.remote;
    return matchesQuery && matchesLocation && matchesRole && matchesSkills && matchesSalary && matchesRemote;
  });

  return delay(results);
}

export async function fetchJobById(jobId) {
  return delay(MOCK_JOBS.find((j) => j.id === jobId) ?? null);
}

/**
 * Very small stand-in for the real matching model: scores a job by how many
 * of the candidate's skills it lists, plus a bonus for role affinity inferred
 * from their most recent work history entry. Clearly labelled as a heuristic
 * — real scoring will come from the model serving layer.
 */
export async function fetchRecommendedJobs(profile) {
  const skillSet = new Set((profile?.skills ?? []).map((s) => s.toLowerCase()));
  const recentRole = profile?.workHistory?.[0]?.title?.toLowerCase() ?? '';

  const scored = MOCK_JOBS.map((job) => {
    const overlap = job.skills.filter((s) => skillSet.has(s.toLowerCase())).length;
    const roleBonus = recentRole && job.title.toLowerCase().includes(recentRole.split(' ')[0]) ? 1 : 0;
    const matchScore = Math.min(98, 40 + overlap * 14 + roleBonus * 10);
    return { ...job, matchScore, matchedSkills: job.skills.filter((s) => skillSet.has(s.toLowerCase())) };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);
  return delay(scored.slice(0, 6));
}

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export async function fetchApplications() {
  const applications = readSeeded(STORAGE_KEYS.applications, MOCK_APPLICATIONS_SEED);
  return delay(applications);
}

export async function applyToJob(jobId) {
  const applications = readSeeded(STORAGE_KEYS.applications, MOCK_APPLICATIONS_SEED);

  if (applications.some((a) => a.jobId === jobId)) {
    return delay({ alreadyApplied: true, applications });
  }

  const today = new Date().toISOString().slice(0, 10);
  const newApplication = {
    id: `app-${Date.now()}`,
    jobId,
    stage: 'applied',
    appliedAt: today,
    history: [{ stage: 'applied', at: today }],
    notes: '',
  };

  const next = [newApplication, ...applications];
  writeStore(STORAGE_KEYS.applications, next);
  return delay({ alreadyApplied: false, applications: next, application: newApplication });
}

export async function withdrawApplication(applicationId) {
  const applications = readSeeded(STORAGE_KEYS.applications, MOCK_APPLICATIONS_SEED);
  const next = applications.filter((a) => a.id !== applicationId);
  writeStore(STORAGE_KEYS.applications, next);
  return delay(next);
}

// ---------------------------------------------------------------------------
// Interviews
// ---------------------------------------------------------------------------

export async function fetchInterviews() {
  const interviews = readSeeded(STORAGE_KEYS.interviews, MOCK_INTERVIEWS_SEED);
  return delay(interviews);
}

export async function confirmInterview(interviewId, response) {
  const interviews = readSeeded(STORAGE_KEYS.interviews, MOCK_INTERVIEWS_SEED);
  const next = interviews.map((iv) =>
    iv.id === interviewId
      ? { ...iv, status: response === 'accept' ? 'confirmed' : 'reschedule_requested' }
      : iv
  );
  writeStore(STORAGE_KEYS.interviews, next);
  return delay(next);
}

// ---------------------------------------------------------------------------
// Resume upload
// ---------------------------------------------------------------------------

const ACCEPTED_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const MAX_FILE_BYTES = 5 * 1024 * 1024;

export function validateResumeFile(file) {
  if (!file) return 'No file selected.';
  if (!ACCEPTED_TYPES.includes(file.type) && !/\.(pdf|doc|docx)$/i.test(file.name)) {
    return 'Please upload a PDF, DOC, or DOCX file.';
  }
  if (file.size > MAX_FILE_BYTES) {
    return 'File is larger than 5MB — try a smaller export of your resume.';
  }
  return null;
}

/**
 * Simulates an upload. Returns an object URL so the widget can preview PDFs
 * immediately; a real implementation would return a server-hosted URL.
 */
export async function uploadResume(file) {
  const error = validateResumeFile(file);
  if (error) throw new Error(error);

  const meta = {
    name: file.name,
    sizeBytes: file.size,
    type: file.type || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    previewUrl: URL.createObjectURL(file),
  };

  return delay(meta, 700);
}

// ---------------------------------------------------------------------------
// Chatbot (bonus)
// ---------------------------------------------------------------------------

const CANNED_TOPICS = [
  {
    match: /(status|track|where).*(application|applied)/i,
    reply:
      'You can see every stage of your applications on the Application Tracker page — Applied, Screened, Interview, and Offer. Tap a card there for the latest update.',
  },
  {
    match: /(resume|cv)/i,
    reply:
      'Head to Profile → Resume to upload a new PDF, DOC, or DOCX (up to 5MB). It updates instantly and feeds the AI-recommended jobs feed too.',
  },
  {
    match: /(interview|schedule)/i,
    reply:
      'Upcoming interviews live on the Interview Schedule page. If one needs confirming, you will see a "Respond" button on its card.',
  },
  {
    match: /(recommend|match|suggest)/i,
    reply:
      'Recommended Jobs is scored from the skills and experience on your profile — the more complete it is, the sharper the matches.',
  },
  {
    match: /(salary|pay|compensation)/i,
    reply:
      'Job Search lets you set a minimum salary filter, and every listing shows its posted range up front.',
  },
];

/**
 * Placeholder assistant logic. This is intentionally simple pattern matching
 * — a real build would route this to an LLM endpoint (see AI model serving
 * notes in the project's broader spec) but the widget's interface here is
 * already shaped for that swap: one async function, one string in, one
 * string out.
 */
export async function sendChatMessage(message) {
  const found = CANNED_TOPICS.find((topic) => topic.match.test(message));
  const reply =
    found?.reply ??
    "I can help with your applications, resume, interviews, or job matches — try asking about one of those, or use the menu to jump straight to a page.";
  return delay(reply, 550);
}
