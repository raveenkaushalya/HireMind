import { useEffect, useMemo, useState } from "react";
import { type Candidate, type Department, type Source, type Stage, DEPARTMENTS, ALL_SOURCES, ALL_STAGES, CANDIDATES } from "../../../data";
import { ShortlistTrendChart, DepartmentBarChart, SourceDonutChart, StageFunnelChart } from "../../../components/dashboard/recruitment/Charts";
import CandidateProfileModal from "../../../components/dashboard/recruitment/CandidateProfileModal";
import HiringSettings from "../../../components/dashboard/recruitment/HiringSettings";
import JobOpenings from "../../../components/dashboard/recruitment/JobOpenings";
import { useAuth } from "../../../context/AuthContext";

type SortKey = "name" | "role" | "department" | "seniority" | "source" | "stage" | "score" | "yearsExp" | "daysInPipeline" | "shortlistedAt";
type Section = "overview" | "candidates" | "jobs" | "settings";
type Role = "hiring_manager" | "recruiter";

const SECTIONS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg> },
  { id: "candidates", label: "Candidates", icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" /><path strokeLinecap="round" d="M16 3.13a4 4 0 010 7.75M21 21v-1a5 5 0 00-3-4.58" /></svg> },
  { id: "jobs", label: "Job Openings", icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="7" width="18" height="13" rx="2" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M3 13h18" /></svg> },
  { id: "settings", label: "Settings", icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
];

const RANGE_OPTIONS = [{ label: "7d", days: 7 }, { label: "30d", days: 30 }, { label: "60d", days: 60 }, { label: "90d", days: 90 }];
const NAV_GROUPS = [{ label: "Dashboard", ids: ["overview"] }, { label: "Management", ids: ["candidates", "jobs"] }, { label: "System", ids: ["settings"] }];
function daysAgo(iso: string) { return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000); }

// Comprehensive mapping + default fallback for stage colors
const DEFAULT_STAGE_COLOR = "bg-slate-500/15 text-slate-600 dark:text-slate-300 ring-slate-500/30";
const stageColor: Record<string, string> = {
  Sourced: "bg-blue-500/15 text-blue-600 dark:text-blue-300 ring-blue-500/30",
  Applied: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 ring-indigo-500/30",
  Shortlisted: "bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-amber-500/30",
  "Phone Screen": "bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-sky-500/30",
  Technical: "bg-violet-500/15 text-violet-600 dark:text-violet-300 ring-violet-500/30",
  Onsite: "bg-orange-500/15 text-orange-600 dark:text-orange-300 ring-orange-500/30",
  Offer: "bg-pink-500/15 text-pink-600 dark:text-pink-300 ring-pink-500/30",
  Hired: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-emerald-500/30",
  Rejected: "bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-rose-500/30"
};

export default function HiringManagerDashboard({ onLogout }: { onLogout: () => void; onSwitch: () => void }) {
  const { token } = useAuth();
  const [dark, setDark] = useState(true);
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed] = useState(false);
  const [rangeDays, setRangeDays] = useState(30);
  const [dept, setDept] = useState<Department | "All">("All");
  const [source, setSource] = useState<Source | "All">("All");
  const [stageFilter, setStageFilter] = useState<Stage | "All">("All");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [profileCandidate, setProfileCandidate] = useState<Candidate | null>(null);

  // Dropdown / Profile Menu State
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>("");
  const userRole: Role = "hiring_manager";

  const COLORS = ["#eab308", "#ca8a04", "#d97706", "#f59e0b", "#10b981", "#14b8a6", "#0ea5e9"];
  const [candidatesData, setCandidatesData] = useState<Candidate[]>([]);

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  useEffect(() => {
    if (!token) return;

    fetch('/api/hiring-managers/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch HM profile");
        return res.json();
      })
      .then(hmProfile => {
        const name = hmProfile?.companyName || hmProfile?.company?.name || hmProfile?.company;
        if (name) setCompanyName(name);

        return Promise.all([
          fetch('/api/candidates', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
          fetch('/api/applications', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
          fetch('/api/jobs').then(res => res.json()),
          hmProfile // pass this along
        ]);
      })
      .then(([candidatesRes, applicationsRes, jobsRes, hmProfile]) => {
        if (!Array.isArray(candidatesRes) || !Array.isArray(applicationsRes)) return;

        const candsMap = new Map();
        candidatesRes.forEach((c: any) => candsMap.set(c.id, c));

        const jobsMap = new Map();
        if (Array.isArray(jobsRes)) {
          jobsRes.forEach((j: any) => jobsMap.set(j.id, j));
        }

        const filteredApps = applicationsRes.filter((a: any) => {
          if (!a.status || a.status === "Applied" || a.status === "Rejected") return false;

          const j = jobsMap.get(a.jobPostingId);
          if (!j) return false;

          if (hmProfile.companyId && j.companyId !== hmProfile.companyId) return false;

          return true;
        });

        const mappedApplicants = filteredApps.map((app: any, i: number) => {
          const c = candsMap.get(app.candidateId) || {};
          const j = jobsMap.get(app.jobPostingId) || {};

          let stg: Stage = "Shortlisted";
          if (app.status === "Applied") stg = "Shortlisted";
          else if (app.status === "Interview") stg = "Technical";
          else if (app.status === "Offer") stg = "Offer";
          else if (app.status === "Hired") stg = "Hired";
          else if (app.status === "Rejected") stg = "Rejected";

          return {
            id: app.id.toString(),
            name: app.candidateName || c.name || "Unknown Applicant",
            role: app.jobTitle || j.title || c.currentJobTitle || "Applicant",
            department: j.category || c.department || "General",
            seniority: j.yearsOfExperienceNeeded || c.experienceLevel || "Mid",
            source: c.source || "Unknown",
            stage: stg,
            score: 85,
            yearsExp: parseInt(j.yearsOfExperienceNeeded) || 3,
            location: c.location || "Remote",
            appliedAt: app.dateSubmitted || new Date().toISOString(),
            shortlistedAt: app.dateSubmitted || new Date().toISOString(),
            daysInPipeline: Math.max(1, Math.floor((new Date().getTime() - new Date(app.dateSubmitted || new Date()).getTime()) / (1000 * 3600 * 24))),
            status: "Active" as const,
            avatar: COLORS[i % COLORS.length],
            email: c.email || "",
            phone: c.phoneNumber || "",
            education: c.education || "",
            previousCompany: "",
            expectedSalary: j.salaryRange || "",
            noticePeriod: "",
            skills: c.skills ? c.skills.split(',') : [],
            summary: c.bio || "",
            resumeMatch: 95,
            resumeUrl: c.resumeUrl || "",
            interviewHistory: []
          };
        });

        setCandidatesData(mappedApplicants);
      })
      .catch(console.error);
  }, [token]);

  const filtered = useMemo(() => candidatesData.filter(c => {
    if (daysAgo(c.shortlistedAt) > rangeDays) return false;
    if (dept !== "All" && c.department !== dept) return false;
    if (source !== "All" && c.source !== source) return false;
    if (stageFilter !== "All" && c.stage !== stageFilter) return false;
    if (search) { const s = search.toLowerCase(); return c.name.toLowerCase().includes(s) || c.role.toLowerCase().includes(s) || c.location.toLowerCase().includes(s); }
    return true;
  }), [rangeDays, dept, source, stageFilter, search, candidatesData]);

  // Use candidatesData for charts and KPIs
  const kpis = useMemo(() => {
    const inRange = (c: Candidate, from: number, to: number) => { const d = daysAgo(c.shortlistedAt); return d >= from && d < to; };
    const base = candidatesData.filter(c => (dept === "All" || c.department === dept) && (source === "All" || c.source === source));
    const cur = base.filter(c => inRange(c, 0, rangeDays));
    const prev = base.filter(c => inRange(c, rangeDays, rangeDays * 2));
    const pct = (a: number, b: number) => b === 0 ? (a > 0 ? 100 : 0) : ((a - b) / b) * 100;
    const buckets = 12; const size = Math.max(1, Math.floor(rangeDays / buckets));
    const spark = (fn: (c: Candidate) => boolean) => { const arr: number[] = []; for (let i = buckets - 1; i >= 0; i--) { const from = i * size, to = (i + 1) * size; arr.push(base.filter(c => { const d = daysAgo(c.shortlistedAt); return d >= from && d < to && fn(c); }).length); } return arr; };
    let res = {
      shortlisted: cur.length, shortlistedTrend: pct(cur.length, prev.length), shortlistedSpark: spark(() => true),
      avgScore: cur.length > 0 ? cur.reduce((s, c) => s + c.score, 0) / cur.length : 0, avgScoreTrend: pct(cur.length > 0 ? cur.reduce((s, c) => s + c.score, 0) / cur.length : 0, prev.length > 0 ? prev.reduce((s, c) => s + c.score, 0) / prev.length : 0), avgScoreSpark: spark(c => c.score >= 75),
      interviews: cur.filter(c => ["Phone Screen", "Technical", "Onsite"].includes(c.stage)).length, interviewsTrend: pct(cur.filter(c => ["Phone Screen", "Technical", "Onsite"].includes(c.stage)).length, prev.filter(c => ["Phone Screen", "Technical", "Onsite"].includes(c.stage)).length), interviewsSpark: spark(c => ["Phone Screen", "Technical", "Onsite"].includes(c.stage)),
      offerRate: cur.length > 0 ? (cur.filter(c => c.stage === "Offer" || c.stage === "Hired").length / cur.length) * 100 : 0, offerRateTrend: pct(cur.length > 0 ? (cur.filter(c => c.stage === "Offer" || c.stage === "Hired").length / cur.length) * 100 : 0, prev.length > 0 ? (prev.filter(c => c.stage === "Offer" || c.stage === "Hired").length / prev.length) * 100 : 0), offerRateSpark: spark(c => c.stage === "Offer" || c.stage === "Hired"),
    };
    if (res.shortlisted === 0) {
      res = {
        shortlisted: 45, shortlistedTrend: 12, shortlistedSpark: Array(12).fill(4),
        avgScore: 82, avgScoreTrend: 5, avgScoreSpark: Array(12).fill(7),
        interviews: 28, interviewsTrend: 8, interviewsSpark: Array(12).fill(2),
        offerRate: 15, offerRateTrend: 2, offerRateSpark: Array(12).fill(1),
      };
    }
    return res;
  }, [rangeDays, dept, source, candidatesData]);

  const trendData = useMemo(() => {
    const bs = rangeDays <= 14 ? 1 : rangeDays <= 30 ? 3 : 7;
    let b: { date: string; shortlisted: number; interviews: number; offers: number }[] = [];
    const now = new Date();
    for (let i = rangeDays; i >= 0; i -= bs) { const from = i, to = Math.max(0, i - bs); const d = new Date(now); d.setDate(d.getDate() - Math.floor((from + to) / 2)); const pool = candidatesData.filter(c => { const day = daysAgo(c.shortlistedAt); return day <= from && day > to; }); b.push({ date: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }), shortlisted: pool.length, interviews: pool.filter(c => ["Phone Screen", "Technical", "Onsite"].includes(c.stage)).length, offers: pool.filter(c => c.stage === "Offer" || c.stage === "Hired").length }); }
    if (b.reduce((acc, curr) => acc + curr.shortlisted, 0) === 0) {
      b = [
        { date: "Jul 1", shortlisted: 10, interviews: 2, offers: 0 },
        { date: "Jul 5", shortlisted: 15, interviews: 5, offers: 1 },
        { date: "Jul 10", shortlisted: 8, interviews: 4, offers: 2 },
        { date: "Jul 15", shortlisted: 20, interviews: 8, offers: 1 },
        { date: "Jul 20", shortlisted: 12, interviews: 6, offers: 3 },
      ];
    }
    return b;
  }, [rangeDays, candidatesData]);

  const deptChartData = useMemo(() => {
    let data = DEPARTMENTS.map(d => { const r = candidatesData.filter(c => c.department === d); return { name: d, count: r.length, hired: r.filter(c => c.stage === "Hired").length }; });
    if (data.reduce((acc, curr) => acc + curr.count, 0) === 0) {
      data = [
        { name: "Engineering", count: 45, hired: 5 },
        { name: "Design", count: 20, hired: 2 },
        { name: "Product", count: 18, hired: 3 },
        { name: "Sales", count: 25, hired: 4 },
        { name: "Marketing", count: 12, hired: 1 },
      ];
    }
    return data.sort((a, b) => b.count - a.count);
  }, [candidatesData]);

  const sourceChartData = useMemo(() => {
    let data = ALL_SOURCES.map(s => ({ name: s, value: candidatesData.filter(c => c.source === s).length }));
    if (data.reduce((acc, curr) => acc + curr.value, 0) === 0) {
      data = [
        { name: "LinkedIn", value: 35 },
        { name: "Referral", value: 20 },
        { name: "Company Site", value: 25 },
        { name: "Agency", value: 10 },
        { name: "Job Board", value: 10 },
      ];
    }
    return data.filter(d => d.value > 0);
  }, [candidatesData]);

  const stageChartData = useMemo(() => {
    let data = ALL_STAGES.filter(s => s !== "Rejected").map(s => ({ name: s, value: candidatesData.filter(c => c.stage === s).length }));
    if (data.reduce((acc, curr) => acc + curr.value, 0) === 0) {
      data = [
        { name: "Applied", value: 120 },
        { name: "Shortlisted", value: 80 },
        { name: "Phone Screen", value: 50 },
        { name: "Technical", value: 30 },
        { name: "Onsite", value: 15 },
        { name: "Offer", value: 8 },
        { name: "Hired", value: 5 },
      ];
    }
    return data;
  }, [candidatesData]);
  const sorted = useMemo(() => { const a = [...filtered]; a.sort((x, y) => { const av = (x as any)[sortKey], bv = (y as any)[sortKey]; let c = 0; if (typeof av === "number" && typeof bv === "number") c = av - bv; else c = String(av).localeCompare(String(bv)); return sortDir === "asc" ? c : -c; }); return a; }, [filtered, sortKey, sortDir]);
  useEffect(() => setPage(1), [rangeDays, dept, source, stageFilter, search]);
  const totalPages = Math.max(1, Math.ceil(sorted.length / 10));
  const pageData = sorted.slice((page - 1) * 10, page * 10);
  const toggleSort = (k: SortKey) => { if (k === sortKey) setSortDir(d => d === "asc" ? "desc" : "asc"); else { setSortKey(k); setSortDir("desc"); } };
  const resetFilters = () => { setDept("All"); setSource("All"); setStageFilter("All"); setSearch(""); setRangeDays(30); };
  const handleNavClick = (id: Section) => { setSection(id); setSidebarOpen(false); };
  const labels: Record<Section, { title: string; subtitle: string }> = { overview: { title: "Overview", subtitle: "KPI summary, shortlisting trends, sources, departments & pipeline funnel" }, candidates: { title: "Shortlisted Candidates", subtitle: "Browse, search, sort, and filter all shortlisted candidates" }, jobs: { title: "Job Openings", subtitle: "Create, manage, and track all open positions" }, settings: { title: "Hiring Settings", subtitle: "Configure interview sequence stages and policy thresholds" } };

  const handleUpdateStatus = async (appId: string, newStage: string, details?: any) => {
    try {
      const payload: any = { newStage };
      if (details) {
        // details.date is a Date object from the ScheduleInterviewModal
        payload.date = details.date instanceof Date ? details.date.toLocaleDateString('en-CA') : details.date;
        payload.time = details.time;
        payload.notes = details.notes || details.feedback;
      }

      const res = await fetch(`/api/applications/${appId}/stage`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to update application status");

      // Remove candidate from HM dashboard if rejected or moved to Offer (Recruiter dashboard handles Offer)
      if (newStage === "Rejected" || newStage === "Offer") {
        setTimeout(() => {
          setCandidatesData(prev => prev.filter(c => c.id !== appId));
          setProfileCandidate(null);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-slate-950 text-slate-100" : "bg-[#f4f6fb] text-slate-900"}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className={`absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-20 ${dark ? "bg-yellow-600" : "bg-amber-300"}`} />
        <div className={`absolute top-1/3 -right-40 h-96 w-96 rounded-full blur-3xl opacity-20 ${dark ? "bg-amber-600" : "bg-yellow-200"}`} />
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-300 border-r ${dark ? "bg-slate-950/95 border-slate-800" : "bg-white/95 border-slate-200"} backdrop-blur-xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"} w-[260px]`}>
        <div className={`flex flex-col justify-center px-4 h-16 border-b flex-shrink-0 ${dark ? "border-slate-800" : "border-slate-200"} ${sidebarCollapsed ? "items-center" : ""}`}>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-slate-400" : "text-slate-500"}`}>
                HireMinds
              </span>
              <h1 className="text-sm font-extrabold tracking-tight truncate text-amber-500">
                {companyName || "Loading..."}
              </h1>
            </div>
          )}
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {NAV_GROUPS.map(g => (
            <div key={g.label} className="mb-5 last:mb-0">
              {!sidebarCollapsed && <p className={`px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${dark ? "text-slate-600" : "text-slate-400"}`}>{g.label}</p>}
              <div className="space-y-1">
                {SECTIONS.filter(s => g.ids.includes(s.id)).map(s => (
                  <button key={s.id} onClick={() => handleNavClick(s.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${section === s.id ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20" : dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"} ${sidebarCollapsed ? "justify-center" : ""}`}>
                    <span className="flex-shrink-0">{s.icon}</span>
                    {!sidebarCollapsed && <span className="truncate">{s.label}</span>}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className={`relative z-10 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"}`}>
        <header className={`sticky top-0 z-30 flex items-center gap-4 h-16 px-4 sm:px-6 border-b backdrop-blur-xl ${dark ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
          <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 -ml-2 rounded-lg ${dark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg></button>
          <div className="flex-1 min-w-0"><h2 className="text-base sm:text-lg font-bold tracking-tight truncate">{labels[section].title}</h2><p className={`text-xs hidden sm:block truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{labels[section].subtitle}</p></div>

          <div className="flex items-center gap-2">
            <button onClick={() => setDark(!dark)} className={`h-9 w-9 rounded-lg flex items-center justify-center ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>{dark ? <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></svg> : <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>}</button>

            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border text-xs font-semibold ${dark ? "border-slate-800 hover:bg-slate-800/60" : "border-slate-200 hover:bg-slate-100 bg-white"}`}
              >
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950 bg-gradient-to-br from-amber-400 to-yellow-500">
                  HM
                </div>
                <span className="hidden sm:inline">Manager</span>
                <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""} ${dark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-xl py-1 z-50 backdrop-blur-md ${dark ? "bg-slate-900/95 border-slate-800 text-slate-100" : "bg-white/95 border-slate-200 text-slate-900"}`}>
                  <button
                    onClick={() => { setSection("settings"); setDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold flex items-center gap-2 ${dark ? "hover:bg-slate-800/80" : "hover:bg-slate-100"}`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="7" r="4" /><path strokeLinecap="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /></svg>
                    Profile Settings
                  </button>
                  <div className={`my-1 border-t ${dark ? "border-slate-800" : "border-slate-100"}`} />
                  <button
                    onClick={() => { setDropdownOpen(false); onLogout(); }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-semibold text-rose-500 flex items-center gap-2 ${dark ? "hover:bg-slate-800/80" : "hover:bg-slate-100"}`}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className={`border-b px-4 sm:px-6 py-3 ${dark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50/80 border-slate-200/70"}`}>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]"><svg viewBox="0 0 24 24" className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${dark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.3-4.3" /></svg><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, role, ID…" className={`w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none transition-colors ${dark ? "bg-slate-900/60 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-amber-500" : "bg-white border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-amber-500"}`} /></div>
            <div className={`flex rounded-lg p-0.5 text-xs ${dark ? "bg-slate-900/60 border border-slate-800" : "bg-slate-100 border border-slate-200"}`}>{RANGE_OPTIONS.map(r => <button key={r.label} onClick={() => setRangeDays(r.days)} className={`px-3 py-1.5 rounded-md font-medium ${rangeDays === r.days ? "bg-amber-500 text-slate-950 shadow font-bold" : (dark ? "text-slate-400" : "text-slate-500")}`}>{r.label}</button>)}</div>
            <Select dark={dark} value={dept} onChange={(v: string) => setDept(v as Department | "All")} options={["All", ...DEPARTMENTS]} label="Dept" />
            <Select dark={dark} value={source} onChange={(v: string) => setSource(v as Source | "All")} options={["All", ...ALL_SOURCES]} label="Source" />
            <Select dark={dark} value={stageFilter} onChange={(v: string) => setStageFilter(v as Stage | "All")} options={["All", ...ALL_STAGES]} label="Stage" />
            <button onClick={resetFilters} className={`px-3 py-2 rounded-lg text-xs font-medium ${dark ? "text-slate-400 hover:text-slate-100" : "text-slate-500 hover:text-slate-900"}`}>Reset</button>
          </div>
        </div>

        <main className="px-4 sm:px-6 py-6 max-w-[1400px]">
          {section === "overview" && <OverviewSection dark={dark} kpis={kpis} trendData={trendData} sourceChartData={sourceChartData} deptChartData={deptChartData} stageChartData={stageChartData} />}
          {section === "candidates" && <CandidatesTable dark={dark} sorted={sorted} sortKey={sortKey} sortDir={sortDir} toggleSort={toggleSort} pageData={pageData} page={page} perPage={10} totalPages={totalPages} setPage={setPage} onViewProfile={setProfileCandidate} userRole={userRole} />}
          {section === "jobs" && <JobOpenings dark={dark} onViewProfile={setProfileCandidate} />}
          {section === "settings" && <HiringSettings dark={dark} />}
          <footer className={`mt-10 text-center text-xs pb-4 ${dark ? "text-slate-600" : "text-slate-400"}`}>· HireMinds ·</footer>
        </main>
      </div>
      {profileCandidate && (
        <CandidateProfileModal
          candidate={profileCandidate}
          dark={dark}
          stageColor={stageColor}
          userRole={userRole}
          onClose={() => setProfileCandidate(null)}
          onReject={(id) => handleUpdateStatus(id, "Rejected")}
          onOffer={(id) => handleUpdateStatus(id, "Offer")}
          onSchedule={(id, details) => handleUpdateStatus(id, "Technical", details)} // HM normally does Technical or Onsite
        />
      )}
    </div>
  );
}

function OverviewSection({ dark, kpis, trendData, sourceChartData, deptChartData, stageChartData }: any) {
  return <div className="space-y-6 animate-fadeIn">
    <WelcomeHero dark={dark} userRole="hiring_manager" />
    <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <KpiCard dark={dark} label="In Interview" value={kpis.interviews.toLocaleString()} color="#eab308" icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z" /></svg>} />
      <KpiCard dark={dark} label="Shortlisted" value={kpis.shortlisted.toLocaleString()} color="#ca8a04" icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 01-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
      <KpiCard dark={dark} label="Avg Score" value={kpis.avgScore.toFixed(0)} suffix="/100" color="#d97706" icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.98 10.11c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} />
      <KpiCard dark={dark} label="Offer Rate" value={kpis.offerRate.toFixed(0)} suffix="%" color="#f59e0b" icon={<svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 01-9 9 9 9 0 01-9-9 9 9 0 019 9z" /></svg>} />
    </section>
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card dark={dark} title="Top Sources" subtitle="Where candidates come from"><SourceDonutChart data={sourceChartData} dark={dark} /></Card>
      <Card dark={dark} title="Pipeline Funnel" subtitle="Candidate flow"><StageFunnelChart data={stageChartData} dark={dark} /></Card>
      <Card dark={dark} title="By Department" subtitle="Shortlisted vs hired"><DepartmentBarChart data={deptChartData} dark={dark} /></Card>
    </section>
    <Card dark={dark} title="Shortlisting Trend" subtitle="Shortlisted vs interviews vs offers"><ShortlistTrendChart data={trendData} dark={dark} /></Card>
  </div>;
}

function CandidatesTable({ dark, sorted, sortKey, sortDir, toggleSort, pageData, page, perPage, totalPages, setPage, onViewProfile, userRole }: any) {
  return <section className={`rounded-2xl border overflow-hidden backdrop-blur-md ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-slate-200"}`}>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 border-b border-slate-200/10">
      <div><h3 className="font-semibold text-base">{userRole === "recruiter" ? "Sourced Candidates" : "All Shortlisted Candidates"}</h3><p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{sorted.length} results · sorted by <span className="font-medium">{sortKey}</span> ({sortDir})</p></div>
      <div className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>Click headers to sort</div>
    </div>
    <div className="overflow-x-auto"><table className="w-full text-sm">
      <thead className={`text-xs uppercase tracking-wide ${dark ? "text-slate-400 bg-slate-950/40" : "text-slate-500 bg-slate-50"}`}><tr><Th dark={dark} sortKey="name" active={sortKey} dir={sortDir} onClick={toggleSort}>Candidate</Th><Th dark={dark} sortKey="role" active={sortKey} dir={sortDir} onClick={toggleSort}>Role</Th><Th dark={dark} sortKey="department" active={sortKey} dir={sortDir} onClick={toggleSort}>Dept</Th><Th dark={dark} sortKey="seniority" active={sortKey} dir={sortDir} onClick={toggleSort}>Level</Th><Th dark={dark} sortKey="source" active={sortKey} dir={sortDir} onClick={toggleSort}>Source</Th><Th dark={dark} sortKey="stage" active={sortKey} dir={sortDir} onClick={toggleSort}>Stage</Th><Th dark={dark} sortKey="score" active={sortKey} dir={sortDir} onClick={toggleSort} align="right">Score</Th><Th dark={dark} sortKey="yearsExp" active={sortKey} dir={sortDir} onClick={toggleSort} align="right">Exp</Th><Th dark={dark} sortKey="daysInPipeline" active={sortKey} dir={sortDir} onClick={toggleSort} align="right">Pipeline</Th><th className="px-4 py-3 font-medium text-right">Profile</th></tr></thead>
      <tbody>{pageData.map((c: Candidate) => <tr key={c.id} className={`border-t transition-colors ${dark ? "border-slate-800 hover:bg-slate-800/40" : "border-slate-100 hover:bg-slate-50"}`}><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold text-slate-950 flex-shrink-0" style={{ background: c.avatar }}>{c.name.split(" ").map((n: string) => n[0]).join("")}</div><div className="min-w-0"><div className="font-medium truncate">{c.name}</div><div className={`text-xs truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{c.id} · {c.location}</div></div></div></td><td className="px-4 py-3 whitespace-nowrap">{c.role}</td><td className={`px-4 py-3 whitespace-nowrap ${dark ? "text-slate-300" : "text-slate-600"}`}>{c.department}</td><td className={`px-4 py-3 whitespace-nowrap ${dark ? "text-slate-300" : "text-slate-600"}`}>{c.seniority}</td><td className={`px-4 py-3 whitespace-nowrap ${dark ? "text-slate-300" : "text-slate-600"}`}>{c.source}</td><td className="px-4 py-3 whitespace-nowrap"><span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ring-1 ring-inset ${stageColor[c.stage] || DEFAULT_STAGE_COLOR}`}>{c.stage}</span></td><td className="px-4 py-3 text-right"><div className="inline-flex items-center gap-2"><div className={`h-1.5 w-16 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-200"}`}><div className="h-full rounded-full transition-all" style={{ width: `${c.score}%`, background: c.score >= 85 ? "#eab308" : c.score >= 70 ? "#f59e0b" : "#ef4444" }} /></div><span className="font-semibold w-8 text-right">{c.score}</span></div></td><td className={`px-4 py-3 text-right ${dark ? "text-slate-300" : "text-slate-600"}`}>{c.yearsExp}y</td><td className={`px-4 py-3 text-right ${dark ? "text-slate-300" : "text-slate-600"}`}>{c.daysInPipeline}d</td><td className="px-4 py-3 text-right"><button onClick={() => onViewProfile(c)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${dark ? "bg-amber-500/15 text-amber-300 hover:bg-amber-500/25" : "bg-amber-50 text-amber-700 hover:bg-amber-100"}`}><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>View</button></td></tr>)}</tbody>
    </table></div>
    <div className={`flex items-center justify-between px-4 py-3 text-xs border-t ${dark ? "border-slate-800 text-slate-400" : "border-slate-100 text-slate-500"}`}><span>Showing {Math.min((page - 1) * perPage + 1, sorted.length)}–{Math.min(page * perPage, sorted.length)} of {sorted.length}</span><div className="flex items-center gap-1"><PageBtn dark={dark} disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</PageBtn>{Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5).map((p: number) => <button key={p} onClick={() => setPage(p)} className={`h-7 w-7 rounded-md font-medium transition-colors ${p === page ? "bg-amber-500 text-slate-950 font-bold" : dark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>{p}</button>)}<PageBtn dark={dark} disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</PageBtn></div></div>
  </section>;
}

function Select({ dark, value, onChange, options, label }: any) { return <div className="relative"><select value={value} onChange={(e: any) => onChange(e.target.value)} className={`appearance-none pl-3 pr-8 py-2 rounded-lg text-sm outline-none cursor-pointer ${dark ? "bg-slate-900/60 border border-slate-800 text-slate-100 focus:border-amber-500" : "bg-white border border-slate-200 text-slate-900 focus:border-amber-500"}`}>{options.map((o: string) => <option key={o} value={o}>{label}: {o}</option>)}</select><svg viewBox="0 0 24 24" className={`absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none ${dark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg></div>; }
function KpiCard({ dark, label, value, suffix, color, icon }: any) { return <div className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${dark ? "bg-slate-900/70 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200/70 hover:border-slate-300 shadow-sm"}`}><div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-20" style={{ background: color }} /><div className="relative flex items-start justify-between gap-3 p-5"><div className="min-w-0"><p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</p><div className="mt-2 flex items-baseline gap-1.5"><span className="text-[28px] font-extrabold tracking-tight leading-none">{value}</span>{suffix && <span className={`text-sm font-semibold ${dark ? "text-slate-500" : "text-slate-400"}`}>{suffix}</span>}</div></div><div className="h-11 w-11 flex-shrink-0 rounded-xl flex items-center justify-center ring-1 ring-inset transition-all group-hover:scale-105 [&>svg]:h-5 [&>svg]:w-5" style={{ background: `linear-gradient(135deg, ${color}2a, ${color}0d)`, color, boxShadow: `0 6px 16px -8px ${color}66, inset 0 0 0 1px ${color}38` }}>{icon}</div></div></div>; }
function Card({ dark, title, subtitle, children, className = "" }: any) { return <div className={`rounded-2xl border p-5 transition-all duration-300 hover:shadow-xl ${dark ? "bg-slate-900/70 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200/70 hover:border-slate-300 shadow-sm"} ${className}`}><div className="mb-3"><h3 className="font-bold text-sm">{title}</h3>{subtitle && <p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{subtitle}</p>}</div>{children}</div>; }
function Th({ dark, children, sortKey, active, dir, onClick, align = "left" }: any) { const a = active === sortKey; return <th className={`px-4 py-3 font-medium select-none ${align === "right" ? "text-right" : "text-left"}`}><button onClick={() => onClick(sortKey)} className={`inline-flex items-center gap-1 transition-colors ${a ? (dark ? "text-amber-300" : "text-amber-600") : (dark ? "hover:text-slate-200" : "hover:text-slate-900")}`}>{children}<span className="text-[10px] opacity-60">{a ? (dir === "asc" ? "▲" : "▼") : "↕"}</span></button></th>; }
function PageBtn({ dark, disabled, onClick, children }: any) { return <button disabled={disabled} onClick={onClick} className={`px-2 h-7 rounded-md font-medium transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : dark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>{children}</button>; }
function WelcomeHero({ dark, userRole }: any) { const h = new Date().getHours(); const g = h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : h < 21 ? "Good Evening" : "Good Night"; const n = userRole === "recruiter" ? "Recruiter" : "Manager"; return <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{g} {n}!</h2><p className={`text-xs mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Dashboard · {userRole === "recruiter" ? "Recruitment Operations" : "Hiring Overview"}</p></div><div className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border ${dark ? "bg-slate-900/70 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-600 shadow-sm"}`}><svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" /></svg>{new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}</div></div>; }