import { useEffect, useMemo, useState } from "react";
import { type Candidate, type Stage } from "../../../data";
import CandidateProfileModal from "../../../components/dashboard/recruitment/CandidateProfileModal";

// ──────────── Types ────────────
type PipelineColumn = "Applied" | "Screening" | "Interview" | "Offer" | "Hired";
type SubSection = "kanban" | "database" | "detail";
type SettingsSubSection = "profile" | "notifications" | "preferences";

interface TaskItem {
  id: string;
  type: "resume" | "interview" | "offer";
  title: string;
  due: string;
  candidate: string;
  candidateId: string;
  priority: "high" | "medium" | "low";
  done: boolean;
}

interface ActivityFeed {
  id: string;
  action: string;
  candidate: string;
  candidateId: string;
  time: string;
  icon: string;
}

interface RecruiterProfile {
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  joinedAt: string;
  bio: string;
}

// ──────────── Static Data ────────────
const COLORS = ["#eab308", "#ca8a04", "#d97706", "#f59e0b", "#10b981", "#14b8a6", "#0ea5e9"];
const PROFILE: RecruiterProfile = {
  name: "Kamal Fernando", email: "kamal.c@hireminds.co", phone: "+94 71 234 5678",
  role: "Senior Recruiter", avatar: COLORS[0], joinedAt: "2025-06-15",
  bio: "Experienced tech recruiter specializing in engineering and data roles across Fortune 500 companies.",
};

const ACTIVITIES: ActivityFeed[] = [];

// ──────────── Main Component ────────────
import { useAuth } from "../../../context/AuthContext";

export default function RecruiterDashboard({ onLogout, onSwitch }: { onLogout: () => void; onSwitch: () => void }) {
  const { token, username, email } = useAuth();
  const [dark, setDark] = useState(true);
  const [section, setSection] = useState<"overview" | "pipeline" | "interviews" | "settings">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileCandidate, setProfileCandidate] = useState<Candidate | null>(null);
  const [pipelineSub, setPipelineSub] = useState<SubSection>("kanban");
  const [settingsSub, setSettingsSub] = useState<SettingsSubSection>("profile");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [profile, setProfile] = useState<RecruiterProfile>({
    ...PROFILE,
    name: username || PROFILE.name,
    email: email || PROFILE.email
  });

  const [candidatesData, setCandidatesData] = useState<Candidate[]>([]);

  const handleRejectCandidate = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/stage`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newStage: "Rejected" }),
      });
      if (res.ok) {
        setCandidatesData(prev => prev.map(c => c.id === appId ? { ...c, stage: "Rejected" } : c));
        setProfileCandidate(null);
        setSelectedCandidate(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleInterview = async (appId: string, details: { date: Date, time: string, feedback: string }) => {
    try {
      const res = await fetch(`/api/applications/${appId}/stage`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStage: "Interview",
          date: `${details.date.getFullYear()}-${String(details.date.getMonth() + 1).padStart(2, '0')}-${String(details.date.getDate()).padStart(2, '0')}`,
          time: details.time,
          notes: details.feedback
        }), // "Interview" corresponds to "Screening" pipeline column
      });
      if (res.ok) {
        setCandidatesData(prev => prev.map(c => c.id === appId ? { ...c, stage: "Phone Screen" } : c)); // Phone Screen will go into Screening
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitToHM = async (appId: string, details: { feedback: string; score: number }) => {
    try {
      const res = await fetch(`/api/applications/${appId}/stage`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          newStage: "Technical",
          notes: `Score: ${details.score}/100. Feedback: ${details.feedback}`
        }), // "Technical" maps to the Interview column on HM / Recruiter board
      });
      if (res.ok) {
        setCandidatesData(prev => prev.map(c => c.id === appId ? { ...c, stage: "Technical" } : c));
        setTimeout(() => {
          setProfileCandidate(null);
          setSelectedCandidate(null);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleHiredCandidate = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/stage`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newStage: "Hired" }),
      });
      if (res.ok) {
        setCandidatesData(prev => prev.map(c => c.id === appId ? { ...c, stage: "Hired" } : c));
        setTimeout(() => {
          setProfileCandidate(null);
          setSelectedCandidate(null);
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  useEffect(() => {
    Promise.all([
      fetch('/api/candidates', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/applications', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.json()),
      fetch('/api/jobs').then(res => res.json())
    ])
      .then(([candidatesRes, applicationsRes, jobsRes]) => {
        if (!Array.isArray(candidatesRes) || !Array.isArray(applicationsRes)) return;

        const candsMap = new Map();
        candidatesRes.forEach((c: any) => candsMap.set(c.id, c));

        const jobsMap = new Map();
        if (Array.isArray(jobsRes)) {
          jobsRes.forEach((j: any) => jobsMap.set(j.id, j));
        }

        const mappedApplicants = applicationsRes.map((app: any, i: number) => {
          const c = candsMap.get(app.candidateId) || {};
          const j = jobsMap.get(app.jobPostingId) || {};

          let stg: Stage = "Applied";
          if (app.status === "Applied") stg = "Applied";
          else if (app.status === "Interview") stg = "Phone Screen"; // Map to proper Stage
          else if (app.status === "Technical") stg = "Technical";
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
            status: (stg === "Phone Screen" ? "Under Review" : "Active") as Candidate["status"],
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
            resumeUrl: c.resumeUrl || undefined,
            interviewHistory: [],
          };
        });

        // Let's rely entirely on actual applicants as requested by the user flow!
        setCandidatesData(mappedApplicants);
      })
      .catch(console.error);
  }, [token]);

  const navItems = [
    { id: "overview" as const, label: "Dashboard", icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg> },
    { id: "pipeline" as const, label: "Candidate Pipeline", icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg> },
    { id: "interviews" as const, label: "Interviews & Evaluations", icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" /></svg> },
    { id: "settings" as const, label: "Settings", icon: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  const stats = useMemo(() => {
    const activeJobs = [7, 5, 4, 3].length;
    const newApps = candidatesData.filter(c => c.stage === "Shortlisted").length;
    const avgFill = "24 days";
    const acceptanceRate = "87%";
    return { activeJobs, newApps, avgFill, acceptanceRate };
  }, [candidatesData]);

  const pipeline = useMemo(() => {
    const cols: Record<PipelineColumn, Candidate[]> = { Applied: [], Screening: [], Interview: [], Offer: [], Hired: [] };
    candidatesData.slice(0, 30).forEach((c) => {
      const map: Partial<Record<Stage, PipelineColumn>> = { Applied: "Applied", Shortlisted: "Applied", "Phone Screen": "Screening", Technical: "Interview", Onsite: "Interview", Offer: "Offer", Hired: "Hired" };
      const targetCol = map[c.stage];
      if (targetCol) {
        cols[targetCol].push(c);
      }
    });
    return cols;
  }, [candidatesData]);

  const toggleTask = (id: string) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: "Dashboard", subtitle: "Your recruitment command center. Metrics, tasks, and activity at a glance" },
    pipeline: { title: "Candidate Pipeline", subtitle: "Track candidates through every stage from application to hire" },
    interviews: { title: "Interviews & Evaluations", subtitle: "Schedule interviews, submit scorecards, and track assessments" },
    settings: { title: "Settings", subtitle: "Manage your profile, notifications, and system preferences" },
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-slate-950 text-slate-100" : "bg-[#f4f6fb] text-slate-900"}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className={`absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-20 ${dark ? "bg-amber-600" : "bg-amber-300"}`} />
        <div className={`absolute top-1/3 -right-40 h-96 w-96 rounded-full blur-3xl opacity-20 ${dark ? "bg-yellow-600" : "bg-yellow-200"}`} />
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar - Side profile section removed */}
      <aside className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-300 border-r ${dark ? "bg-slate-950/95 border-slate-800" : "bg-white/95 border-slate-200"} backdrop-blur-xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"} w-[260px]`}>
        <div className={`flex items-center gap-3 px-4 h-16 border-b flex-shrink-0 ${dark ? "border-slate-800" : "border-slate-200"} ${sidebarCollapsed ? "justify-center" : ""}`}>
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="text-xl font-extrabold tracking-tight truncate">
                <span className={dark ? "text-white" : "text-slate-900"}>Hire</span>
                <span style={{ color: "#eab308" }}>Minds</span>
                <span className="text-red-500">.</span>
              </h1>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className={`${sidebarCollapsed ? "" : "ml-auto"} hidden lg:flex p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-slate-800 text-slate-400 hover:text-slate-100" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"}`} title={sidebarCollapsed ? "Expand" : "Collapse"}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          {!sidebarCollapsed && <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden p-1.5 rounded-lg"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg></button>}
        </div>

        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
          {navItems.map((n) => (
            <button key={n.id} onClick={() => { setSection(n.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${section === n.id ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/20" : dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"} ${sidebarCollapsed ? "justify-center" : ""}`}
              title={sidebarCollapsed ? n.label : undefined}
            >
              <span className="flex-shrink-0">{n.icon}</span>
              {!sidebarCollapsed && <span className="truncate">{n.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Header & Workspace */}
      <div className={`relative z-10 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"}`}>
        <header className={`sticky top-0 z-30 flex items-center gap-4 h-16 px-4 sm:px-6 border-b backdrop-blur-xl ${dark ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
          <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 -ml-2 rounded-lg ${dark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold tracking-tight truncate">{sectionTitles[section].title}</h2>
            <p className={`text-xs truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{sectionTitles[section].subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark(!dark)} className={`h-9 w-9 rounded-lg flex items-center justify-center ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
              {dark ? <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></svg>
                : <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>}
            </button>

            {/* Profile Dropdown Component with Logout button inside */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border text-xs font-semibold ${dark ? "border-slate-800 hover:bg-slate-800/60" : "border-slate-200 hover:bg-slate-100 bg-white"}`}
              >
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950 bg-gradient-to-br from-amber-400 to-yellow-500">
                  RC
                </div>
                <span className="hidden sm:inline">{profile.name.split(" ")[0]}</span>
                <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""} ${dark ? "text-slate-500" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
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

        <main className="px-4 sm:px-6 py-6 max-w-[1400px]">
          {section === "overview" && (
            <OverviewSection dark={dark} stats={stats} tasks={tasks} toggleTask={toggleTask} activities={ACTIVITIES} />
          )}

          {section === "pipeline" && (
            <PipelineSection dark={dark} pipelineSub={pipelineSub} setPipelineSub={setPipelineSub} pipeline={pipeline} setSelectedCandidate={setSelectedCandidate} />
          )}

          {section === "interviews" && (
            <InterviewsSection dark={dark} candidates={candidatesData} onSelectCandidate={setSelectedCandidate} />
          )}

          {section === "settings" && (
            <SettingsSection dark={dark} sub={settingsSub} setSub={setSettingsSub} profile={profile} setProfile={setProfile} onLogout={onLogout} onSwitch={onSwitch} />
          )}
        </main>
      </div>

      {profileCandidate && (
        <CandidateProfileModal
          candidate={profileCandidate}
          dark={dark}
          stageColor={{
            "Applied": "bg-blue-500/15 text-blue-600 dark:text-blue-300 ring-blue-500/30",
            "Shortlisted": "bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-amber-500/30",
            "Phone Screen": "bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-sky-500/30",
            "Technical": "bg-violet-500/15 text-violet-600 dark:text-violet-300 ring-violet-500/30",
            "Onsite": "bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-amber-500/30",
            "Offer": "bg-pink-500/15 text-pink-600 dark:text-pink-300 ring-pink-500/30",
            "Hired": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-emerald-500/30",
            "Rejected": "bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-rose-500/30"
          }}
          userRole="recruiter"
          onClose={() => setProfileCandidate(null)}
          onReject={(id) => handleRejectCandidate(id)}
          onSchedule={(id, details) => handleScheduleInterview(id, details)}
          onHired={(id) => handleHiredCandidate(id)}
        />
      )}

      {selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          dark={dark}
          stageColor={{
            "Applied": "bg-blue-500/15 text-blue-600 dark:text-blue-300 ring-blue-500/30",
            "Shortlisted": "bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-amber-500/30",
            "Phone Screen": "bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-sky-500/30",
            "Technical": "bg-violet-500/15 text-violet-600 dark:text-violet-300 ring-violet-500/30",
            "Onsite": "bg-amber-500/15 text-amber-600 dark:text-amber-300 ring-amber-500/30",
            "Offer": "bg-pink-500/15 text-pink-600 dark:text-pink-300 ring-pink-500/30",
            "Hired": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-emerald-500/30",
            "Rejected": "bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-rose-500/30"
          }}

          userRole="recruiter"
          onClose={() => setSelectedCandidate(null)}
          onReject={(id) => handleRejectCandidate(id)}
          onSchedule={(id, details) => handleScheduleInterview(id, details)}
          onSubmitToHM={(id, details) => handleSubmitToHM(id, details)}
          onHired={(id) => handleHiredCandidate(id)}
        />
      )}
    </div>
  );
}

// ──────────── Dashboard / Overview ────────────
function OverviewSection({ dark, stats, tasks, toggleTask, activities }: { dark: boolean; stats: any; tasks: TaskItem[]; toggleTask: (id: string) => void; activities: ActivityFeed[] }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard dark={dark} label="Active Jobs" value={stats.activeJobs} color="#eab308" />
        <MetricCard dark={dark} label="New Applicants" value={stats.newApps} color="#ca8a04" />
        <MetricCard dark={dark} label="Avg Time-to-Fill" value={stats.avgFill} color="#f59e0b" />
        <MetricCard dark={dark} label="Offer Acceptance" value={stats.acceptanceRate} color="#10b981" />
      </div>
      
      <div className={`rounded-2xl border p-5 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
        <h3 className="font-bold text-sm mb-4">Application Trends</h3>
        <div className={`rounded-xl border p-4 ${dark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div><p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>This Week</p><p className="text-lg font-extrabold text-amber-500">+24</p></div>
            <div><p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Screening</p><p className="text-lg font-extrabold text-amber-400">18</p></div>
            <div><p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Interviewing</p><p className="text-lg font-extrabold text-amber-600">12</p></div>
            <div><p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Offers Out</p><p className="text-lg font-extrabold text-emerald-400">5</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ dark, label, value, color }: { dark: boolean; label: string; value: string | number; color: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
      <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-20" style={{ background: color }} />
      <p className={`text-[11px] font-bold uppercase tracking-[0.14em] ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
      <p className="mt-2 text-[28px] font-extrabold" style={{ color }}>{value}</p>
    </div>
  );
}

// ──────────── Candidate Pipeline ────────────
function PipelineSection({ dark, pipelineSub, setPipelineSub, pipeline, setSelectedCandidate }: {
  dark: boolean; pipelineSub: SubSection; setPipelineSub: (v: SubSection) => void;
  pipeline: Record<string, Candidate[]>; setSelectedCandidate: (c: Candidate | null) => void;
}) {
  const cols: PipelineColumn[] = ["Applied", "Screening", "Interview", "Offer", "Hired"];
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex gap-1">
        {(["kanban", "database"] as const).map((s) => (
          <button key={s} onClick={() => setPipelineSub(s)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pipelineSub === s ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20" : dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
          >{s === "kanban" ? "Kanban Board" : "Talent Pool Database"}</button>
        ))}
      </div>

      {pipelineSub === "kanban" && (
        <div className="flex gap-3 overflow-x-auto pb-4">
          {cols.map((col) => (
            <div key={col} className={`flex-shrink-0 w-64 rounded-2xl border ${dark ? "bg-slate-900/50 border-slate-800" : "bg-white/60 border-slate-200"}`}>
              <div className={`px-4 py-3 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider">{col}</h4>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{pipeline[col]?.length ?? 0}</span>
                </div>
              </div>
              <div className="p-2 space-y-2 max-h-[500px] overflow-y-auto">
                {(pipeline[col] || []).slice(0, 8).map((c) => (
                  <button key={c.id} onClick={() => setSelectedCandidate(c)}
                    className={`w-full text-left p-3 rounded-xl border transition-all hover:-translate-y-0.5 ${dark ? "bg-slate-950/60 border-slate-800 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-400 shadow-sm"}`}>
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-950 flex-shrink-0" style={{ background: c.avatar }}>{c.name.split(" ").map((n) => n[0]).join("")}</div>
                      <div className="min-w-0"><p className="text-xs font-bold truncate">{c.name}</p><p className={`text-[10px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{c.role}</p></div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {pipelineSub === "database" && (
        <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
          <table className="w-full text-xs">
            <thead className={dark ? "text-slate-500 bg-slate-950/40" : "text-slate-400 bg-slate-50"}>
              <tr><th className="py-3 px-4 text-left">Candidate</th><th className="py-3 px-4 text-left">Role</th><th className="py-3 px-4 text-center">Stage</th><th className="py-3 px-4 text-center">Score</th><th className="py-3 px-4 text-right">Source</th><th className="py-3 px-4 text-right">Details</th></tr>
            </thead>
            <tbody>
              {Object.values(pipeline).flat().slice(0, 20).map((c) => (
                <tr key={c.id} className={`border-t ${dark ? "border-slate-800/50 hover:bg-slate-900/40" : "border-slate-100 hover:bg-slate-50"}`}>
                  <td className="py-2.5 px-4"><div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-950" style={{ background: c.avatar }}>{c.name.split(" ").map((n) => n[0]).join("")}</div><span className="font-semibold">{c.name}</span></div></td>
                  <td className="py-2.5 px-4">{c.role}</td>
                  <td className="py-2.5 px-4 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{c.stage}</span></td>
                  <td className={`py-2.5 px-4 text-center font-bold ${c.score >= 85 ? "text-emerald-400" : c.score >= 70 ? "text-amber-400" : "text-rose-400"}`}>{c.score}</td>
                  <td className="py-2.5 px-4 text-right text-slate-400">{c.source}</td>
                  <td className="py-2.5 px-4 text-right"><button onClick={() => setSelectedCandidate(c)} className="text-amber-500 hover:text-amber-400 text-[10px] font-bold">View →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}



// ──────────── Interviews & Evaluations ────────────
function InterviewsSection({ dark, candidates, onSelectCandidate }: { dark: boolean; candidates: Candidate[]; onSelectCandidate: (c: Candidate) => void }) {
  const activeInterviews = candidates.filter(c => c.stage === "Phone Screen" || c.stage === "Technical" || c.stage === "Onsite");

  return (
    <div className="space-y-6 animate-fadeIn">
      {activeInterviews.length === 0 ? (
        <div className={`p-10 rounded-2xl border text-center ${dark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200/70"}`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${dark ? "bg-slate-800" : "bg-white border"}`}>
            <svg viewBox="0 0 24 24" className={`h-8 w-8 ${dark ? "text-slate-600" : "text-slate-400"}`} fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold mb-1">No Active Interviews</h3>
          <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>There are no candidates currently undergoing recruiter screening or interviews.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeInterviews.map((c) => (
            <div key={c.id} className={`flex flex-col relative rounded-2xl border overflow-hidden transition-all hover:shadow-lg ${dark ? "bg-slate-900/70 border-slate-800 hover:border-amber-500/30" : "bg-white border-slate-200 shadow-sm hover:border-amber-400"}`}>
              {/* Card Header Background */}
              <div className={`h-16 w-full absolute top-0 left-0 ${dark ? "bg-gradient-to-b from-slate-800/80 to-transparent" : "bg-gradient-to-b from-slate-100 to-transparent"}`} />

              <div className="relative p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-lg font-bold text-slate-950 shadow-md flex-shrink-0" style={{ background: c.avatar }}>
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${c.stage === "Phone Screen" ? "bg-sky-500/15 text-sky-500 ring-1 ring-inset ring-sky-500/30" :
                    c.stage === "Technical" ? "bg-violet-500/15 text-violet-400 ring-1 ring-inset ring-violet-500/30" :
                      "bg-amber-500/15 text-amber-500 ring-1 ring-inset ring-amber-500/30"
                    }`}>
                    {c.stage}
                  </span>
                </div>

                <h3 className="text-base font-bold truncate mb-1">{c.name}</h3>
                <p className={`text-xs truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{c.role}</p>
                <div className={`mt-4 pt-4 border-t grid grid-cols-2 gap-3 ${dark ? "border-slate-800" : "border-slate-100"}`}>
                  <div>
                    <p className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Candidate Score</p>
                    <p className="text-sm font-extrabold">{c.score}/100</p>
                  </div>
                  <div>
                    <p className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Days in Pipeline</p>
                    <p className="text-sm font-medium">{c.daysInPipeline} Days</p>
                  </div>
                </div>
              </div>

              <div className={`mt-auto p-3 border-t bg-black/5 ${dark ? "border-slate-800" : "border-slate-100"}`}>
                <button
                  onClick={() => onSelectCandidate(c)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-colors ${dark ? "bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300" : "bg-slate-100 hover:bg-amber-100 hover:text-amber-700 text-slate-700"}`}
                >
                  Review Details &amp; Evaluate
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ──────────── Settings ────────────
function SettingsSection({ dark, sub, setSub, profile, setProfile, onLogout }: { dark: boolean; sub: SettingsSubSection; setSub: (v: SettingsSubSection) => void; profile: RecruiterProfile; setProfile: (p: RecruiterProfile) => void; onLogout: () => void; onSwitch: () => void }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex gap-1">
        {(["profile", "notifications", "preferences"] as const).map((s) => (
          <button key={s} onClick={() => setSub(s)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${sub === s ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 shadow-lg shadow-amber-500/20" : dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
          >{s === "profile" ? "Profile" : s === "notifications" ? "Notifications" : "Preferences"}</button>
        ))}
      </div>

      {sub === "profile" && (
        <div className="space-y-6">
          <div className={`rounded-2xl border p-6 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pb-6 border-b border-slate-800/60">
              <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-slate-950 shadow-xl" style={{ background: profile.avatar }}>{profile.name.split(" ").map((n) => n[0]).join("")}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-extrabold">{profile.name}</h3>
                <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{profile.role}</p>
                <p className={`text-xs mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Member since {new Date(profile.joinedAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Full Name</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={`w-full px-3 py-2.5 rounded-xl text-sm ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 focus:border-amber-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500"} outline-none transition-all`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Email</label>
                <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={`w-full px-3 py-2.5 rounded-xl text-sm ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 focus:border-amber-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500"} outline-none transition-all`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Phone</label>
                <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={`w-full px-3 py-2.5 rounded-xl text-sm ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 focus:border-amber-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500"} outline-none transition-all`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Role</label>
                <input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className={`w-full px-3 py-2.5 rounded-xl text-sm ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 focus:border-amber-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500"} outline-none transition-all`} />
              </div>
              <div className="sm:col-span-2">
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Bio</label>
                <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className={`w-full px-3 py-2.5 rounded-xl text-sm resize-none ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 focus:border-amber-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-amber-500"} outline-none transition-all`} />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={onLogout} className="px-5 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 ring-1 ring-inset ring-rose-500/30 transition-all">
              Log Out
            </button>
          </div>
        </div>
      )}

      {sub === "notifications" && (
        <div className={`rounded-2xl border p-6 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
          <h3 className="font-bold text-sm mb-4">Notification Preferences</h3>
          {[
            { label: "New candidate applications", desc: "Get notified when new candidates apply", on: true },
            { label: "Interview reminders", desc: "Reminders 30 min before scheduled interviews", on: true },
            { label: "Assessment submissions", desc: "Alert when candidates submit assessments", on: false },
            { label: "Offer status changes", desc: "Updates when offers are accepted or declined", on: true },
            { label: "Weekly digest email", desc: "Summary of all recruitment activity", on: false },
          ].map((n, i) => (
            <div key={i} className={`flex items-center justify-between py-3 border-b last:border-none ${dark ? "border-slate-800/60" : "border-slate-100"}`}>
              <div><p className="text-xs font-semibold">{n.label}</p><p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{n.desc}</p></div>
              <div className={`h-5 w-10 rounded-full transition-colors cursor-pointer ${n.on ? "bg-amber-500" : dark ? "bg-slate-700" : "bg-slate-300"}`}>
                <div className={`h-4 w-4 rounded-full bg-white mt-0.5 transition-all ${n.on ? "ml-5.5 translate-x-0.5" : "ml-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      )}

      {sub === "preferences" && (
        <div className={`rounded-2xl border p-6 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
          <h3 className="font-bold text-sm mb-4">System Preferences</h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Default Pipeline View</label>
              <select className={`w-full px-3 py-2.5 rounded-xl text-sm ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100" : "bg-slate-50 border border-slate-200 text-slate-900"} outline-none`}>
                <option>Kanban Board</option><option>List View</option>
              </select>
            </div>
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Calendar Integration</label>
              <select className={`w-full px-3 py-2.5 rounded-xl text-sm ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100" : "bg-slate-50 border border-slate-200 text-slate-900"} outline-none`}>
                <option>Google Workspace</option><option>Microsoft Outlook</option><option>None</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-3 border-t border-slate-800/60">
              <div><p className="text-xs font-semibold">Dark Mode</p><p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Toggle the interface theme</p></div>
              <button onClick={() => document.documentElement.classList.toggle("dark")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${dark ? "bg-amber-500/15 text-amber-300" : "bg-slate-100 text-slate-600"}`}>
                {dark ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}