import { useState, useMemo, useEffect } from "react";
import { type Candidate } from "../../../data";
import { useAuth } from "../../../context/AuthContext";
import { SourceDonutChart, StageFunnelChart } from "./Charts";

interface JobOpening {
  id: string;
  title: string;
  category: string;
  location: string;
  type: "Full-time" | "Part-time" | "Remote" | "Hybrid" | "Onsite";
  level: "Junior" | "Mid" | "Senior" | "Lead" | "Principal";
  status: "Open" | "On Hold" | "Closed" | "Draft";
  applicants: number;
  shortlisted: number;
  inInterview: number;
  offers: number;
  postedAt: string;
  closingAt: string;
  salary: string;
  descriptionAboutTheRole: string;
  responsibilities: string;
  requirements: string;
  descriptionAboutTheCompany: string;
  urgent?: boolean;
  yearsOfExperienceNeeded?: string;
  minQualification?: string;
  skillsNeeded: string[];
}



const SEED_JOBS: JobOpening[] = [];

const STATUS_STYLES: Record<JobOpening["status"], string> = {
  Open: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
  "On Hold": "bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-1 ring-inset ring-amber-500/30",
  Closed: "bg-slate-500/15 text-slate-600 dark:text-slate-300 ring-1 ring-inset ring-slate-500/30",
  Draft: "bg-violet-500/15 text-violet-600 dark:text-violet-300 ring-1 ring-inset ring-violet-500/30",
};

const TYPE_OPTIONS = ["All", "Full-time", "Part-time", "Remote", "Hybrid", "Onsite"];
const STATUS_OPTIONS = ["All", "Open", "On Hold", "Closed", "Draft"];
const CATEGORY_OPTIONS = [
  'IT & Technology', 'Engineering', 'Healthcare & Pharma', 'Education',
  'Banking & Finance', 'Human Resources', 'Design & Marketing',
  'Logistics & Supply Chain', 'Apparel & Manufacturing', 'Hospitality & Tourism', 'Other'
];

interface Props {
  dark: boolean;
  onViewProfile?: (candidate: Candidate) => void;
}

export default function JobOpenings({ dark, onViewProfile }: Props) {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<JobOpening[]>(SEED_JOBS);
  const [companyId, setCompanyId] = useState<number | null>(null);

  const mapApiJob = (j: any): JobOpening => ({
    id: `JOB-${j.id}`,
    title: j.title || 'Untitled',
    category: j.category || 'IT & Technology',
    location: j.location || 'Colombo, Sri Lanka',
    type: (j.type as any) || 'Full-time',
    level: 'Mid',
    status: (j.status as any) || 'Open',
    applicants: j.applicants || 0,
    shortlisted: 0,
    inInterview: 0,
    offers: 0,
    postedAt: j.postedDate ? j.postedDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
    closingAt: j.closingDate ? j.closingDate.slice(0, 10) : '',
    salary: j.salaryRange || '',
    descriptionAboutTheRole: j.descriptionAboutTheRole || j.description || '',
    responsibilities: j.responsibilities || '',
    requirements: j.requirements || '',
    descriptionAboutTheCompany: j.descriptionAboutTheCompany || '',
    urgent: j.isUrgent || false,
    yearsOfExperienceNeeded: j.yearsOfExperienceNeeded || '',
    minQualification: j.minQualification || '',
    skillsNeeded: j.skillsNeeded ? j.skillsNeeded.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
  });

  // Step 1: Fetch HM's profile to get their company ID
  useEffect(() => {
    if (!token) return;
    fetch('/api/hiring-managers/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(profile => {
        if (profile?.companyId) {
          setCompanyId(profile.companyId);
        }
      })
      .catch(console.error);
  }, [token]);

  // Step 2: Fetch jobs for this company once we have the companyId
  useEffect(() => {
    if (companyId === null) return;
    fetch(`/api/jobs/by-company/${companyId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data.map(mapApiJob).reverse());
        }
      })
      .catch(console.error);
  }, [companyId]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [showForm, setShowForm] = useState(false);
  const [viewingJob, setViewingJob] = useState<JobOpening | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");

  const [form, setForm] = useState<Omit<JobOpening, "id" | "applicants" | "shortlisted" | "inInterview" | "offers">>({
    title: "",
    category: "IT & Technology",
    location: "Colombo, Sri Lanka",
    type: "Full-time",
    level: "Mid",
    status: "Draft",
    postedAt: new Date().toISOString().slice(0, 10),
    closingAt: "",
    salary: "",
    descriptionAboutTheRole: "",
    responsibilities: "",
    requirements: "",
    descriptionAboutTheCompany: "",
    urgent: false,
    yearsOfExperienceNeeded: "",
    minQualification: "",
    skillsNeeded: [],
  });

  // Applicants view state
  const [applicantSearch, setApplicantSearch] = useState("");
  const [applicantSortBy, setApplicantSortBy] = useState<"score" | "yearsExp" | "name" | "stage">("score");
  const [applicantSortDir, setApplicantSortDir] = useState<"asc" | "desc">("desc");
  const [applicantStageFilter, setApplicantStageFilter] = useState<string>("All");

  const [jobApplicantsPool, setJobApplicantsPool] = useState<any[]>([]);

  useEffect(() => {
    if (!viewingJob) {
      setJobApplicantsPool([]);
      return;
    }
    const jobId = viewingJob.id.replace('JOB-', '');
    fetch(`/api/applications/by-job/${jobId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const mapped = data.map(a => ({
            id: `APP-${a.id}`,
            candidateId: a.candidateId,
            name: a.candidateName || 'Unknown',
            email: a.candidateEmail || '',
            phone: a.candidatePhone || '',
            role: a.candidateCurrentJobTitle || '',
            department: viewingJob.category,
            seniority: a.candidateExperienceLevel || 'Mid',
            source: 'API',
            stage: a.status || 'Applied',
            score: 0, // AI Score mapped dynamically or kept 0 if not stored
            yearsExp: parseInt(a.candidateExperienceLevel) || 0,
            location: a.candidateLocation || 'Unknown',
            appliedAt: a.dateSubmitted,
            shortlistedAt: a.dateSubmitted,
            daysInPipeline: Math.floor((new Date().getTime() - new Date(a.dateSubmitted).getTime()) / (1000 * 3600 * 24)),
            status: a.status === 'Rejected' ? 'Rejected' : a.status === 'Hired' ? 'Hired' : 'Active',
            avatar: '#3b82f6',
            education: a.candidateEducation || '',
            previousCompany: '',
            resumeUrl: a.candidateResumeUrl || '',
            skills: typeof a.candidateSkills === 'string' ? a.candidateSkills.split(',').map((s: string) => s.trim()) : (a.candidateSkills || []),
            interviewHistory: []
          }));
          setJobApplicantsPool(mapped);
        }
      })
      .catch(console.error);
  }, [viewingJob, token]);

  const jobApplicants = useMemo(() => {
    let list = [...jobApplicantsPool];
    if (applicantStageFilter !== "All") list = list.filter(c => c.stage === applicantStageFilter);
    if (applicantSearch) {
      const s = applicantSearch.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(s) ||
        c.location.toLowerCase().includes(s) ||
        c.stage.toLowerCase().includes(s) ||
        c.role.toLowerCase().includes(s)
      );
    }
    list.sort((a, b) => {
      const av = a[applicantSortBy];
      const bv = b[applicantSortBy];
      let cmp = 0;
      if (typeof av === "number" && typeof bv === "number") cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      return applicantSortDir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [jobApplicantsPool, applicantSearch, applicantSortBy, applicantSortDir, applicantStageFilter]);

  const applicantStats = useMemo(() => {
    const stats = { total: jobApplicantsPool.length, shortlisted: 0, inInterview: 0, offer: 0, avgScore: 0 };
    if (jobApplicantsPool.length === 0) return stats;
    jobApplicantsPool.forEach((c) => {
      if (c.stage === "Shortlisted") stats.shortlisted++;
      if (["Phone Screen", "Technical", "Onsite"].includes(c.stage)) stats.inInterview++;
      if (c.stage === "Offer") stats.offer++;
      stats.avgScore += c.score;
    });
    stats.avgScore = Math.round(stats.avgScore / jobApplicantsPool.length);
    return stats;
  }, [jobApplicantsPool]);

  const filtered = useMemo(() => {
    const list = jobs.filter((j) => {
      if (typeFilter !== "All" && j.type !== typeFilter) return false;
      if (statusFilter !== "All" && j.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return j.title.toLowerCase().includes(s) || j.location.toLowerCase().includes(s);
      }
      return true;
    });
    return [...list].sort((a, b) => Number(b.urgent ?? false) - Number(a.urgent ?? false));
  }, [jobs, typeFilter, statusFilter, search]);

  const summary = useMemo(() => {
    const open = jobs.filter((j) => j.status === "Open").length;
    const onHold = jobs.filter((j) => j.status === "On Hold").length;
    const totalApplicants = jobs.reduce((s, j) => s + j.applicants, 0);
    const totalOffers = jobs.reduce((s, j) => s + j.offers, 0);
    return { open, onHold, totalApplicants, totalOffers };
  }, [jobs]);

  const openForm = (job?: JobOpening) => {
    if (job) {
      setEditingId(job.id);
      setForm({
        title: job.title,
        category: job.category || "IT & Technology",
        location: (job as any).location || "Colombo, Sri Lanka",
        type: job.type,
        level: job.level,
        status: job.status,
        postedAt: job.postedAt,
        closingAt: job.closingAt,
        salary: job.salary,
        descriptionAboutTheRole: job.descriptionAboutTheRole,
        responsibilities: job.responsibilities,
        requirements: job.requirements,
        descriptionAboutTheCompany: job.descriptionAboutTheCompany,
        urgent: job.urgent ?? false,
        yearsOfExperienceNeeded: job.yearsOfExperienceNeeded || "",
        minQualification: job.minQualification || "",
        skillsNeeded: job.skillsNeeded || [],
      });
    } else {
      setEditingId(null);
      setForm({
        title: "",
        category: "IT & Technology",
        location: "Colombo, Sri Lanka",
        type: "Full-time",
        level: "Mid",
        status: "Draft",
        postedAt: new Date().toISOString().slice(0, 10),
        closingAt: "",
        salary: "",
        descriptionAboutTheRole: "",
        responsibilities: "",
        requirements: "",
        descriptionAboutTheCompany: "",
        urgent: false,
        yearsOfExperienceNeeded: "",
        minQualification: "",
        skillsNeeded: [],
      });
    }
    setShowForm(true);
  };

  const saveJob = async () => {
    if (!form.title.trim()) return;

    if (!companyId) {
      alert('Unable to determine your company. Please refresh and try again.');
      return;
    }

    try {
      const isEdit = !!editingId;
      const url = isEdit ? `/api/jobs/${editingId.replace('JOB-', '')}` : `/api/jobs`;
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        title: form.title,
        category: form.category,
        location: form.location,
        skillsNeeded: form.skillsNeeded.join(", "),
        salaryRange: form.salary,
        type: form.type,
        companyId: companyId,
        closingDate: form.closingAt ? new Date(form.closingAt).toISOString() : null,
        descriptionAboutTheRole: form.descriptionAboutTheRole,
        responsibilities: form.responsibilities,
        requirements: form.requirements,
        descriptionAboutTheCompany: form.descriptionAboutTheCompany,
        yearsOfExperienceNeeded: form.yearsOfExperienceNeeded,
        minQualification: form.minQualification,
        status: form.status,
        isUrgent: form.urgent,
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed to save job: ${res.status} ${errText}`);
      }
      const savedJob = await res.json();

      const newJob: JobOpening = {
        id: `JOB-${savedJob.id}`,
        title: savedJob.title,
        category: savedJob.category || form.category,
        location: savedJob.location || form.location,
        type: savedJob.type as any,
        level: form.level,
        status: savedJob.status || "Open",
        applicants: savedJob.applicants || 0,
        shortlisted: 0,
        inInterview: 0,
        offers: 0,
        postedAt: savedJob.postedDate ? savedJob.postedDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
        closingAt: form.closingAt,
        salary: savedJob.salaryRange || "",
        descriptionAboutTheRole: savedJob.descriptionAboutTheRole || form.descriptionAboutTheRole,
        responsibilities: savedJob.responsibilities || form.responsibilities,
        requirements: savedJob.requirements || form.requirements,
        descriptionAboutTheCompany: savedJob.descriptionAboutTheCompany || form.descriptionAboutTheCompany,
        urgent: form.urgent,
        yearsOfExperienceNeeded: savedJob.yearsOfExperienceNeeded || form.yearsOfExperienceNeeded,
        minQualification: savedJob.minQualification || form.minQualification,
        skillsNeeded: savedJob.skillsNeeded ? savedJob.skillsNeeded.split(',').map((s: string) => s.trim()).filter(Boolean) : form.skillsNeeded,
      };

      if (isEdit) {
        setJobs(prev => prev.map(j => j.id === editingId ? newJob : j));
      } else {
        setJobs(prev => [newJob, ...prev]);
      }
      setShowForm(false);
    } catch (e) {
      console.error(e);
      alert(`Error saving job: ${e instanceof Error ? e.message : String(e)}`);
      setShowForm(false);
    }
  };

  const closeJob = async (id: string) => {
    const numericId = id.replace('JOB-', '');
    try {
      const res = await fetch(`/api/jobs/${numericId}`, {
        method: "DELETE",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
      }
    } catch (e) {
      console.error("Failed to close job", e);
    }
  };

  const toggleStatus = async (job: JobOpening) => {
    const numericId = job.id.replace('JOB-', '');
    const newStatus = job.status === "Open" ? "On Hold" : "Open";
    try {
      const res = await fetch(`/api/jobs/${numericId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(newStatus) // .NET requires JSON strings in quotes for [FromBody] string => e.g. '"Closed"'
      });
      if (res.ok) {
        setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j)));
      }
    } catch (e) {
      console.error("Failed to toggle status", e);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      {/* ==================== Applicants Queue View ==================== */}
      {viewingJob && (
        <div className={`absolute inset-0 z-20 min-h-full animate-fadeIn ${dark ? "bg-slate-950" : "bg-[#f4f6fb]"}`}>
          <div className="space-y-5 pb-6">
            <button
              onClick={() => setViewingJob(null)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-white shadow-sm"
                }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Jobs
            </button>

            <div className={`relative overflow-hidden rounded-2xl border p-6 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-20 bg-amber-500" />
              <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {viewingJob.urgent && viewingJob.status === "Open" ? (
                      <span className="inline-flex items-center gap-1 pl-1.5 pr-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-300 ring-1 ring-inset ring-red-500/25">
                        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        Urgent
                      </span>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[viewingJob.status]}`}>
                        {viewingJob.status}
                      </span>
                    )}
                    <span className={`text-[10px] font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>{viewingJob.id}</span>
                    <span className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>• Closes {new Date(viewingJob.closingAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight">{viewingJob.title}</h1>
                  <p className={`text-sm mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    {viewingJob.location} · {viewingJob.type} · {viewingJob.level}
                  </p>
                </div>
              </div>

              <div className={`relative mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t ${dark ? "border-slate-800" : "border-slate-100"}`}>
                {[
                  { label: "Total Applicants", value: applicantStats.total, color: "#eab308" },
                  { label: "Shortlisted", value: applicantStats.shortlisted, color: "#8b5cf6" },
                  { label: "In Interview", value: applicantStats.inInterview, color: "#0ea5e9" },
                  { label: "Avg Score", value: `${applicantStats.avgScore}`, suffix: "/100", color: "#10b981" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${dark ? "text-slate-500" : "text-slate-400"}`}>{s.label}</p>
                    <p className="mt-1 text-xl font-extrabold" style={{ color: s.color }}>
                      {s.value}
                      {s.suffix && <span className={`text-[10px] font-semibold ml-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{s.suffix}</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Applicant Mock Charts */}
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4`}>
              <div className={`rounded-2xl border p-5 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
                <div className="mb-3">
                  <h3 className="font-bold text-sm">Applicant Sources</h3>
                  <p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>Where applicants applied from</p>
                </div>
                <SourceDonutChart dark={dark} data={[
                  { name: "LinkedIn", value: 40 },
                  { name: "Direct", value: 30 },
                  { name: "Referral", value: 15 },
                  { name: "Agency", value: 15 },
                ]} />
              </div>
              <div className={`rounded-2xl border p-5 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
                <div className="mb-3">
                  <h3 className="font-bold text-sm">Application Funnel</h3>
                  <p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>Current pipeline stages</p>
                </div>
                <StageFunnelChart dark={dark} data={[
                  { name: "Applied", value: applicantStats.total || 45 },
                  { name: "Shortlisted", value: applicantStats.shortlisted || 20 },
                  { name: "Phone Screen", value: 12 },
                  { name: "Technical", value: applicantStats.inInterview || 5 },
                  { name: "Offer", value: applicantStats.offer || 2 },
                  { name: "Hired", value: 1 },
                ]} />
              </div>
            </div>

            <div className={`rounded-2xl border p-3 flex flex-wrap items-center gap-2 ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
              <div className="relative flex-1 min-w-[220px]">
                <svg viewBox="0 0 24 24" className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${dark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  placeholder="Search applicants by name, location, role, stage…"
                  className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-colors ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-amber-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500"}`}
                />
              </div>

              <select
                value={applicantStageFilter}
                onChange={(e) => setApplicantStageFilter(e.target.value)}
                className={`px-3 py-2 rounded-lg text-sm outline-none cursor-pointer ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 focus:border-amber-500" : "bg-white border border-slate-200 text-slate-900 focus:border-amber-500"}`}
              >
                {["All", "Shortlisted", "Phone Screen", "Technical", "Onsite", "Offer", "Hired", "Rejected"].map((s) => (
                  <option key={s} value={s}>{s === "All" ? "All Stages" : s}</option>
                ))}
              </select>

              <select
                value={applicantSortBy}
                onChange={(e) => setApplicantSortBy(e.target.value as typeof applicantSortBy)}
                className={`px-3 py-2 rounded-lg text-sm outline-none cursor-pointer ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 focus:border-amber-500" : "bg-white border border-slate-200 text-slate-900 focus:border-amber-500"}`}
              >
                <option value="score">Sort: Score</option>
                <option value="yearsExp">Sort: Experience</option>
                <option value="name">Sort: Name</option>
                <option value="stage">Sort: Stage</option>
              </select>

              <button
                onClick={() => setApplicantSortDir(applicantSortDir === "asc" ? "desc" : "asc")}
                title={applicantSortDir === "asc" ? "Ascending" : "Descending"}
                className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-800" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"}`}
              >
                <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${applicantSortDir === "asc" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7-7-7M12 3v18" />
                </svg>
              </button>

              <button
                onClick={() => { setApplicantSearch(""); setApplicantStageFilter("All"); setApplicantSortBy("score"); setApplicantSortDir("desc"); }}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                Reset
              </button>
            </div>

            {jobApplicants.length === 0 ? (
              <div className={`rounded-2xl border p-10 text-center text-sm ${dark ? "bg-slate-900/60 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}>
                No applicants match your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {jobApplicants.map((c) => {
                  const stageAccent =
                    c.stage === "Hired" ? "#10b981" :
                      c.stage === "Offer" ? "#f59e0b" :
                        c.stage === "Onsite" ? "#8b5cf6" :
                          c.stage === "Technical" ? "#ca8a04" :
                            c.stage === "Phone Screen" ? "#0ea5e9" :
                              c.stage === "Rejected" ? "#ef4444" : "#64748b";
                  return (
                    <div
                      key={c.id}
                      className={`group relative overflow-hidden rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg ${dark ? "bg-slate-900/70 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200/70 hover:border-slate-300 shadow-sm"}`}
                    >
                      <div>
                        <div className="flex items-start gap-3">
                          <div className="h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm flex-shrink-0" style={{ background: c.avatar }}>
                            {c.name.split(" ").map((n: string) => n[0]).join("")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold truncate">{c.name}</p>
                            <p className={`text-[11px] truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{c.role}</p>
                            <p className={`text-[10px] truncate mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{c.location}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={`text-lg font-extrabold leading-none ${c.score >= 85 ? "text-emerald-500" : c.score >= 70 ? "text-amber-500" : "text-rose-500"}`}>
                              {c.score}
                            </p>
                            <p className={`text-[9px] uppercase tracking-wider font-bold mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>Score</p>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                            style={{ background: `${stageAccent}22`, color: stageAccent }}
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: stageAccent }} />
                            {c.stage}
                          </span>
                          <span className={`text-[10px] font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>
                            {c.yearsExp}y exp
                          </span>
                          <span className={`text-[10px] font-semibold ${dark ? "text-slate-400" : "text-slate-500"}`}>
                            · {c.source}
                          </span>
                        </div>

                        <button
                          onClick={() => onViewProfile?.(c)}
                          className={`mt-3 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${dark ? "bg-amber-500/15 text-amber-300 hover:bg-amber-500/25" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                            }`}
                        >
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View Profile
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Open Jobs", value: summary.open, color: "#10b981", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { label: "On Hold", value: summary.onHold, color: "#f59e0b", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
          { label: "Total Applicants", value: summary.totalApplicants.toLocaleString(), color: "#eab308", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
          { label: "Offers Extended", value: summary.totalOffers, color: "#8b5cf6", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg> },
        ].map((kpi) => (
          <div key={kpi.label} className={`relative overflow-hidden rounded-2xl border p-5 transition-all hover:shadow-xl ${dark ? "bg-slate-900/70 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200/70 hover:border-slate-300 shadow-sm"}`}>
            <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-20" style={{ background: kpi.color }} />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${dark ? "text-slate-500" : "text-slate-400"}`}>{kpi.label}</p>
                <p className="mt-2 text-[28px] font-extrabold tracking-tight leading-none">{kpi.value}</p>
              </div>
              <div className="h-11 w-11 flex-shrink-0 rounded-xl flex items-center justify-center ring-1 ring-inset transition-all hover:scale-105 [&>svg]:h-5 [&>svg]:w-5" style={{ background: `linear-gradient(135deg, ${kpi.color}2a, ${kpi.color}0d)`, borderColor: `${kpi.color}40`, color: kpi.color, boxShadow: `0 6px 16px -8px ${kpi.color}66` }}>
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={`rounded-2xl border p-4 flex flex-wrap items-center gap-3 ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
        <div className="relative flex-1 min-w-[220px]">
          <svg viewBox="0 0 24 24" className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${dark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or department…"
            className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-colors ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-amber-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500"}`}
          />
        </div>

        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={`px-3 py-2 rounded-lg text-sm outline-none cursor-pointer ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 focus:border-amber-500" : "bg-white border border-slate-200 text-slate-900 focus:border-amber-500"}`}>
          {TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o === "All" ? "All Types" : o}</option>)}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`px-3 py-2 rounded-lg text-sm outline-none cursor-pointer ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 focus:border-amber-500" : "bg-white border border-slate-200 text-slate-900 focus:border-amber-500"}`}>
          {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o === "All" ? "All Status" : o}</option>)}
        </select>

        <button
          onClick={() => { setTypeFilter("All"); setStatusFilter("All"); setSearch(""); }}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
        >
          Reset
        </button>

        <button
          onClick={() => openForm()}
          className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm bg-amber-500 text-slate-950 hover:bg-amber-600"
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Job
        </button>
      </div>

      {/* Job list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((job) => (
          <div className={`relative overflow-hidden rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl ${job.urgent && job.status === "Open" ? (dark ? "border-red-500/50 shadow-red-500/10" : "border-red-300 shadow-red-500/10") : ""} ${dark ? "bg-slate-900/70 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200/70 hover:border-slate-300 shadow-sm"}`} key={job.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {job.urgent && job.status === "Open" ? (
                    <span className="inline-flex items-center gap-1 pl-1.5 pr-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-300 ring-1 ring-inset ring-red-500/25">
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                      </svg>
                      Urgent
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[job.status]}`}>
                      {job.status}
                    </span>
                  )}
                  <span className={`text-[10px] font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>{job.id}</span>
                </div>
                <h3 className="mt-1.5 text-base font-bold leading-tight">{job.title}</h3>
                <p className={`mt-0.5 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  {job.location}
                </p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => openForm(job)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${dark
                    ? "bg-slate-800 text-slate-200 hover:bg-slate-700"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => toggleStatus(job)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${job.status === "Open"
                    ? dark
                      ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                    : dark
                      ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    }`}
                >
                  {job.status === "Open" ? "Pause" : "Resume"}
                </button>
                <button
                  onClick={() => closeJob(job.id)}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all bg-rose-500/15 text-rose-500 hover:bg-rose-500/25 dark:text-rose-400"
                >
                  Close
                </button>
              </div>
            </div>

            <p className={`mt-3 text-xs leading-relaxed line-clamp-2 ${dark ? "text-slate-400" : "text-slate-600"}`}>{job.descriptionAboutTheRole}</p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{job.type}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{job.level}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{job.salary}</span>
            </div>

            <div className={`mt-4 pt-4 grid grid-cols-4 gap-2 border-t ${dark ? "border-slate-800" : "border-slate-100"}`}>
              {[
                { label: "Applicants", value: job.applicants, color: "#eab308" },
                { label: "Shortlisted", value: job.shortlisted, color: "#ca8a04" },
                { label: "In Interview", value: job.inInterview, color: "#d97706" },
                { label: "Offers", value: job.offers, color: "#10b981" },
              ].map((m) => (
                <button
                  key={m.label}
                  onClick={() => setViewingJob(job)}
                  className="text-center group/metric hover:opacity-80 transition-opacity"
                >
                  <p className="text-base font-extrabold group-hover/metric:scale-110 transition-transform" style={{ color: m.color }}>{m.value}</p>
                  <p className={`text-[10px] font-medium mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{m.label}</p>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                <span>Posted {new Date(job.postedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
              </div>
              <button
                onClick={() => setViewingJob(job)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${dark ? "bg-slate-800 text-amber-400 hover:bg-slate-700" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                  }`}
              >
                View Applicants
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className={`lg:col-span-2 rounded-2xl border p-10 text-center text-sm ${dark ? "bg-slate-900/60 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-400"}`}>
            No job openings match your filters.
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className={`relative w-full sm:max-w-2xl max-h-screen sm:max-h-[92vh] overflow-y-auto sm:rounded-2xl border shadow-2xl ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className={`sticky top-0 z-10 flex items-center justify-between px-5 py-3 border-b backdrop-blur-md ${dark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200"}`}>
              <h3 className="text-base font-semibold">{editingId ? "Edit Job Opening" : "Create New Job"}</h3>
              <button onClick={() => setShowForm(false)} className={`p-1.5 rounded-lg ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Job Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Senior Frontend Engineer" className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Category / Industry</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={`w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-amber-500 ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100" : "bg-white border border-slate-200 text-slate-900"}`}>
                    <option value="">Select industry</option>
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Remote, Colombo" className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Employment Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as JobOpening["type"] })} className={`w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100" : "bg-white border border-slate-200 text-slate-900"}`}>
                    {["Full-time", "Part-time", "Remote", "Hybrid", "Onsite"].map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Level</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as JobOpening["level"] })} className={`w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100" : "bg-white border border-slate-200 text-slate-900"}`}>
                    {["Junior", "Mid", "Senior", "Lead", "Principal"].map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Salary Range</label>
                  <input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} placeholder="$120k – $160k" className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as JobOpening["status"] })} className={`w-full px-3 py-2 rounded-lg text-sm outline-none cursor-pointer ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100" : "bg-white border border-slate-200 text-slate-900"}`}>
                    {["Draft", "Open", "On Hold", "Closed"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Posted Date</label>
                  <input type="date" value={form.postedAt} onChange={(e) => setForm({ ...form, postedAt: e.target.value })} className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100" : "bg-white border border-slate-200 text-slate-900"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Closing Date</label>
                  <input type="date" value={form.closingAt} onChange={(e) => setForm({ ...form, closingAt: e.target.value })} className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100" : "bg-white border border-slate-200 text-slate-900"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Experience Needed (Years)</label>
                  <input value={form.yearsOfExperienceNeeded} onChange={(e) => setForm({ ...form, yearsOfExperienceNeeded: e.target.value })} placeholder="e.g. 2, 3-5" className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400"}`} />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Min. Qualification (Education)</label>
                  <input value={form.minQualification} onChange={(e) => setForm({ ...form, minQualification: e.target.value })} placeholder="e.g. Bachelor's in CS" className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400"}`} />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Skills Needed</label>
                <div className={`w-full p-2 rounded-lg flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-amber-500 ${dark ? "bg-slate-950/60 border border-slate-800" : "bg-white border border-slate-200"}`}>
                  {form.skillsNeeded.map((skill) => (
                    <span key={skill} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${dark ? "bg-slate-800 text-slate-200" : "bg-slate-100 text-slate-700"}`}>
                      {skill}
                      <button onClick={(e) => { e.preventDefault(); setForm({ ...form, skillsNeeded: form.skillsNeeded.filter(s => s !== skill) }); }} className="text-slate-400 hover:text-red-400">&times;</button>
                    </span>
                  ))}
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === ",") {
                        e.preventDefault();
                        const val = skillInput.trim();
                        if (val && !form.skillsNeeded.includes(val)) {
                          setForm({ ...form, skillsNeeded: [...form.skillsNeeded, val] });
                        }
                        setSkillInput("");
                      }
                    }}
                    placeholder="Type a skill and press Enter..."
                    className={`flex-1 min-w-[150px] bg-transparent outline-none text-sm ${dark ? "text-slate-100 placeholder-slate-500" : "text-slate-900 placeholder-slate-400"}`}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mt-4">
                    <input
                      type="checkbox"
                      checked={form.urgent}
                      onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span className={`text-xs font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>
                      Mark as Urgent Job
                    </span>
                  </label>
                </div>
              </div>

              {/* 4 Text Areas */}
              <div>
                <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>About the Role</label>
                <textarea
                  value={form.descriptionAboutTheRole}
                  onChange={(e) => setForm({ ...form, descriptionAboutTheRole: e.target.value })}
                  rows={3}
                  placeholder="Describe the scope and objective of the role…"
                  className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400"}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Responsibilities</label>
                <textarea
                  value={form.responsibilities}
                  onChange={(e) => setForm({ ...form, responsibilities: e.target.value })}
                  rows={3}
                  placeholder="Key duties and day-to-day responsibilities…"
                  className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400"}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>Requirements</label>
                <textarea
                  value={form.requirements}
                  onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                  rows={3}
                  placeholder="Skills, qualifications, and experience required…"
                  className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400"}`}
                />
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1 ${dark ? "text-slate-300" : "text-slate-700"}`}>About the Company</label>
                <textarea
                  value={form.descriptionAboutTheCompany}
                  onChange={(e) => setForm({ ...form, descriptionAboutTheCompany: e.target.value })}
                  rows={3}
                  placeholder="Overview of company culture, mission, and benefits…"
                  className={`w-full px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-500 resize-none ${dark ? "bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400"}`}
                />
              </div>

              <label
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${form.urgent
                  ? dark
                    ? "bg-red-500/10 border-red-500/40"
                    : "bg-red-50 border-red-300"
                  : dark
                    ? "border-slate-800 hover:bg-slate-800/40"
                    : "border-slate-200 hover:bg-slate-50"
                  }`}
              >
                <div
                  className={`h-5 w-5 rounded-md flex items-center justify-center border-2 transition-all flex-shrink-0 ${form.urgent
                    ? "bg-red-500 border-red-500"
                    : dark
                      ? "border-slate-600"
                      : "border-slate-300"
                    }`}
                >
                  {form.urgent && (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={form.urgent ?? false}
                  onChange={(e) => setForm({ ...form, urgent: e.target.checked })}
                  className="sr-only"
                />
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${form.urgent ? "text-red-500" : dark ? "text-slate-200" : "text-slate-800"}`}>
                    Mark as Urgent
                  </p>
                  <p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    Highlights this opening at the top of the job card for priority hiring.
                  </p>
                </div>
                {form.urgent && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-500 ml-auto flex-shrink-0" fill="currentColor">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                )}
              </label>
            </div>

            <div className={`sticky bottom-0 flex items-center justify-end gap-2.5 px-5 py-3 border-t backdrop-blur-md ${dark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200"}`}>
              <button onClick={() => setShowForm(false)} className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-700"}`}>
                Cancel
              </button>
              <button onClick={saveJob} className="px-5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors">
                {editingId ? "Save Changes" : "Create Job"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
