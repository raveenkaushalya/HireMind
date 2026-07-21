import { useEffect, useMemo, useState } from "react";
import { type Candidate, type Stage } from "../../../data";

// ──────────── Types ────────────
type PipelineColumn = "Applied" | "Screening" | "Interview" | "Offer" | "Hired";
type SubSection = "kanban" | "database" | "detail";
type InterviewSubSection = "scheduling" | "scorecards" | "assessments";
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

interface InterviewEvent {
  id: string;
  candidate: string;
  candidateId: string;
  date: string;
  time: string;
  type: string;
  interviewer: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  scorecard?: { categories: { name: string; score: number; max: number }[]; notes: string; recommendation: string; submitted: boolean };
}

interface Assessment {
  id: string;
  candidate: string;
  candidateId: string;
  type: string;
  sent: string;
  due: string;
  status: "Pending" | "Submitted" | "Overdue";
  score?: number;
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
const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#14b8a6", "#0ea5e9"];
const PROFILE: RecruiterProfile = {
  name: "Ava Johnson", email: "ava.j@hireminds.co", phone: "+1 (415) 555-0281",
  role: "Senior Recruiter", avatar: COLORS[0], joinedAt: "2025-06-15",
  bio: "Experienced tech recruiter specializing in engineering and data roles across Fortune 500 companies.",
};

const TASKS: TaskItem[] = [];

const ACTIVITIES: ActivityFeed[] = [];

const INTERVIEWS: InterviewEvent[] = [];

const ASSESSMENTS: Assessment[] = [];

// ──────────── Main Component ────────────
import { useAuth } from "../../../context/AuthContext";

export default function RecruiterDashboard({ onLogout, onSwitch }: { onLogout: () => void; onSwitch: () => void }) {
  const { token, username, email } = useAuth();
  const [dark, setDark] = useState(true);
  const [section, setSection] = useState<"overview" | "pipeline" | "interviews" | "settings">("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [profileCandidate, setProfileCandidate] = useState<Candidate | null>(null);
  const [pipelineSub, setPipelineSub] = useState<SubSection>("kanban");
  const [interviewsSub, setInterviewsSub] = useState<InterviewSubSection>("scheduling");
  const [settingsSub, setSettingsSub] = useState<SettingsSubSection>("profile");
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [tasks, setTasks] = useState<TaskItem[]>([]); // Cleared mock data
  const [profile, setProfile] = useState<RecruiterProfile>({
    ...PROFILE,
    name: username || PROFILE.name,
    email: email || PROFILE.email
  });

  const [candidatesData, setCandidatesData] = useState<Candidate[]>([]);

  useEffect(() => { document.documentElement.classList.toggle("dark", dark); }, [dark]);

  useEffect(() => {
    fetch('/api/candidates', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCandidatesData(data.map((c: any, i) => ({
            id: c.id.toString(),
            name: c.name || "Unknown Candidate",
            role: c.currentJobTitle || "Applicant",
            department: "Engineering",
            seniority: c.experienceLevel || "Mid",
            source: "Company Site",
            stage: "Shortlisted", // Default mock stage since it relies on Application
            score: 85, // mock score
            yearsExp: 3,
            location: c.location || "Remote",
            appliedAt: new Date().toISOString(),
            shortlistedAt: new Date().toISOString(),
            daysInPipeline: 2,
            status: "Active",
            avatar: COLORS[i % COLORS.length],
            email: c.email || "",
            phone: c.phoneNumber || "",
            education: c.education || "",
            previousCompany: "",
            expectedSalary: "",
            noticePeriod: "",
            skills: c.skills ? c.skills.split(',') : [],
            summary: c.bio || "",
            resumeMatch: 90,
            interviewHistory: []
          })));
        }
      }).catch(console.error);
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
      const map: Record<Stage, PipelineColumn> = { Shortlisted: "Applied", "Phone Screen": "Screening", Technical: "Interview", Onsite: "Interview", Offer: "Offer", Hired: "Hired", Rejected: "Applied" };
      cols[map[c.stage]].push(c);
    });
    return cols;
  }, [candidatesData]);

  const toggleTask = (id: string) => setTasks((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const sectionTitles: Record<string, { title: string; subtitle: string }> = {
    overview: { title: "Dashboard", subtitle: "Your recruitment command center — metrics, tasks, and activity at a glance" },
    pipeline: { title: "Candidate Pipeline", subtitle: "Track candidates through every stage from application to hire" },
    interviews: { title: "Interviews & Evaluations", subtitle: "Schedule interviews, submit scorecards, and track assessments" },
    settings: { title: "Settings", subtitle: "Manage your profile, notifications, and system preferences" },
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-slate-950 text-slate-100" : "bg-[#f4f6fb] text-slate-900"}`}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className={`absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-20 ${dark ? "bg-indigo-500" : "bg-indigo-300"}`} />
        <div className={`absolute top-1/3 -right-40 h-96 w-96 rounded-full blur-3xl opacity-20 ${dark ? "bg-teal-500" : "bg-teal-300"}`} />
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full flex flex-col transition-all duration-300 border-r ${dark ? "bg-slate-950/95 border-slate-800" : "bg-white/95 border-slate-200"} backdrop-blur-xl ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 ${sidebarCollapsed ? "lg:w-[72px]" : "lg:w-[260px]"} w-[260px`}>
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
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${section === n.id ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30" : dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"} ${sidebarCollapsed ? "justify-center" : ""}`}
              title={sidebarCollapsed ? n.label : undefined}
            >
              <span className="flex-shrink-0">{n.icon}</span>
              {!sidebarCollapsed && <span className="truncate">{n.label}</span>}
            </button>
          ))}
        </nav>

        {/* User pill */}
        {!sidebarCollapsed && (
          <div className={`px-3 pb-4 pt-2 border-t ${dark ? "border-slate-800" : "border-slate-200"}`}>
            <div className={`flex items-center gap-3 px-3 py-2 rounded-xl ${dark ? "bg-slate-900/60" : "bg-slate-50"}`}>
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: profile.avatar }}>{profile.name.split(" ").map((n) => n[0]).join("")}</div>
              <div className="min-w-0"><p className="text-xs font-medium truncate">{profile.name}</p><p className={`text-[10px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{profile.role}</p></div>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <div className={`relative z-10 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"}`}>
        <header className={`sticky top-0 z-30 flex items-center gap-4 h-14 px-4 sm:px-6 border-b backdrop-blur-xl ${dark ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"}`}>
          <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 -ml-2 rounded-lg ${dark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold tracking-tight truncate">{sectionTitles[section].title}</h2>
            <p className={`text-xs truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{sectionTitles[section].subtitle}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setDark(!dark)} className={`h-8 w-8 rounded-lg flex items-center justify-center ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
              {dark ? <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" /></svg>
                : <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>}
            </button>
            <button onClick={() => setShowLogout(true)} className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${dark ? "border-slate-800 hover:bg-slate-800/60" : "border-slate-200 hover:bg-slate-100 bg-white"}`}>
              <div className="h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: profile.avatar }}>{profile.name.split(" ").map((n) => n[0]).join("")}</div>
              <span>{profile.name.split(" ")[0]}</span>
            </button>
          </div>
        </header>

        <main className="px-4 sm:px-6 py-6 max-w-[1400px]">
          {/* Dashboard / Overview */}
          {section === "overview" && (
            <OverviewSection dark={dark} stats={stats} tasks={tasks} toggleTask={toggleTask} activities={ACTIVITIES} />
          )}

          {/* Candidate Pipeline */}
          {section === "pipeline" && (
            <PipelineSection dark={dark} pipelineSub={pipelineSub} setPipelineSub={setPipelineSub} pipeline={pipeline} setSelectedCandidate={setSelectedCandidate} />
          )}

          {/* Interviews */}
          {section === "interviews" && (
            <InterviewsSection dark={dark} sub={interviewsSub} setSub={setInterviewsSub} interviews={INTERVIEWS} assessments={ASSESSMENTS} />
          )}

          {/* Settings */}
          {section === "settings" && (
            <SettingsSection dark={dark} sub={settingsSub} setSub={setSettingsSub} profile={profile} setProfile={setProfile} onLogout={onLogout} onSwitch={onSwitch} />
          )}
        </main>
      </div>

      {/* Candidate Profile Modal */}
      {profileCandidate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setProfileCandidate(null)} />
          <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl p-6 animate-fadeIn ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">Candidate Profile</h3>
              <button onClick={() => setProfileCandidate(null)} className={`p-1.5 rounded-lg ${dark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <CandidateDetail candidate={profileCandidate} dark={dark} />
          </div>
        </div>
      )}

      {/* Candidate Detail (Pipeline) */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedCandidate(null)} />
          <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl p-6 animate-fadeIn ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold">Candidate Details</h3>
              <button onClick={() => setSelectedCandidate(null)} className={`p-1.5 rounded-lg ${dark ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <CandidateDetail candidate={selectedCandidate} dark={dark} />
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogout && <LogoutModal dark={dark} onClose={() => setShowLogout(false)} onLogout={onLogout} onSwitch={onSwitch} />}
    </div>
  );
}

// ──────────── Dashboard / Overview ────────────
function OverviewSection({ dark, stats, tasks, toggleTask, activities }: { dark: boolean; stats: any; tasks: TaskItem[]; toggleTask: (id: string) => void; activities: ActivityFeed[] }) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard dark={dark} label="Active Jobs" value={stats.activeJobs} color="#6366f1" />
        <MetricCard dark={dark} label="New Applicants" value={stats.newApps} color="#0ea5e9" />
        <MetricCard dark={dark} label="Avg Time-to-Fill" value={stats.avgFill} color="#f59e0b" />
        <MetricCard dark={dark} label="Offer Acceptance" value={stats.acceptanceRate} color="#10b981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className={`lg:col-span-1 rounded-2xl border p-5 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
          <h3 className="font-bold text-sm mb-4">Pending Tasks</h3>
          <div className="space-y-2">
            {tasks.map((t) => (
              <label key={t.id} className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all ${t.done ? (dark ? "bg-slate-800/30 opacity-50" : "bg-slate-50 opacity-50") : (dark ? "bg-slate-950/40 hover:bg-slate-950/60" : "bg-slate-50 hover:bg-slate-100")}`}>
                <input type="checkbox" checked={t.done} onChange={() => toggleTask(t.id)} className="mt-0.5 accent-indigo-500" />
                <div className="min-w-0 flex-1">
                  <p className={`text-xs font-bold ${t.done ? "line-through" : ""}`}>{t.title}</p>
                  <p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{t.candidate} · {t.due}</p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${t.priority === "high" ? "bg-rose-500/15 text-rose-400" : t.priority === "medium" ? "bg-amber-500/15 text-amber-400" : "bg-slate-500/15 text-slate-400"}`}>{t.priority}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`lg:col-span-2 rounded-2xl border p-5 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
          <h3 className="font-bold text-sm mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
            {activities.map((a) => (
              <div key={a.id} className={`flex items-start gap-3 p-3 rounded-xl ${dark ? "bg-slate-950/40" : "bg-slate-50"}`}>
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${dark ? "bg-slate-800 text-slate-300" : "bg-white text-slate-500 border border-slate-200"}`}>
                  {a.icon === "mail" && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
                  {a.icon === "arrow" && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>}
                  {a.icon === "check" && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                  {a.icon === "code" && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>}
                  {a.icon === "phone" && <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold">{a.action}</p>
                  <p className={`text-[11px] ${dark ? "text-slate-400" : "text-slate-500"}`}>{a.candidate}</p>
                </div>
                <span className={`text-[10px] whitespace-nowrap ${dark ? "text-slate-500" : "text-slate-400"}`}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className={`rounded-2xl border p-5 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
        <h3 className="font-bold text-sm mb-4">Application Trends</h3>
        <div className={`rounded-xl border p-4 ${dark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div><p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>This Week</p><p className="text-lg font-extrabold text-emerald-400">+24</p></div>
            <div><p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Screening</p><p className="text-lg font-extrabold text-indigo-400">18</p></div>
            <div><p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Interviewing</p><p className="text-lg font-extrabold text-amber-400">12</p></div>
            <div><p className={`text-[10px] ${dark ? "text-slate-500" : "text-slate-400"}`}>Offers Out</p><p className="text-lg font-extrabold text-rose-400">5</p></div>
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
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${pipelineSub === s ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20" : dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
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
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: c.avatar }}>{c.name.split(" ").map((n) => n[0]).join("")}</div>
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
                  <td className="py-2.5 px-4"><div className="flex items-center gap-2"><div className="h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: c.avatar }}>{c.name.split(" ").map((n) => n[0]).join("")}</div><span className="font-semibold">{c.name}</span></div></td>
                  <td className="py-2.5 px-4">{c.role}</td>
                  <td className="py-2.5 px-4 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{c.stage}</span></td>
                  <td className={`py-2.5 px-4 text-center font-bold ${c.score >= 85 ? "text-emerald-400" : c.score >= 70 ? "text-amber-400" : "text-rose-400"}`}>{c.score}</td>
                  <td className="py-2.5 px-4 text-right text-slate-400">{c.source}</td>
                  <td className="py-2.5 px-4 text-right"><button onClick={() => setSelectedCandidate(c)} className="text-indigo-400 hover:text-indigo-300 text-[10px] font-bold">View →</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────── Candidate Detail Modal ────────────
function CandidateDetail({ candidate, dark }: { candidate: Candidate; dark: boolean }) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg flex-shrink-0" style={{ background: candidate.avatar }}>{candidate.name.split(" ").map((n) => n[0]).join("")}</div>
        <div className="min-w-0 flex-1">
          <h4 className="text-base font-bold">{candidate.name}</h4>
          <p className={`text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>{candidate.role} · {candidate.department}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dark ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-500/30" : "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200"}`}>{candidate.stage}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${dark ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{candidate.seniority}</span>
          </div>
        </div>
        <div className="text-right"><p className={`text-2xl font-extrabold ${candidate.score >= 85 ? "text-emerald-400" : candidate.score >= 70 ? "text-amber-400" : "text-rose-400"}`}>{candidate.score}</p><p className={`text-[9px] uppercase tracking-wider font-bold ${dark ? "text-slate-500" : "text-slate-400"}`}>Score</p></div>
      </div>

      <div className={`rounded-xl border p-4 space-y-0.5 ${dark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-100"}`}>
        <InfoRow dark={dark} label="Email">{candidate.email}</InfoRow>
        <InfoRow dark={dark} label="Location">{candidate.location}</InfoRow>
        <InfoRow dark={dark} label="Experience">{candidate.yearsExp} years</InfoRow>
        <InfoRow dark={dark} label="Source">{candidate.source}</InfoRow>
        <InfoRow dark={dark} label="Applied">{new Date(candidate.appliedAt).toLocaleDateString()}</InfoRow>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Skills</p>
        <div className="flex flex-wrap gap-1.5">
          {candidate.skills?.slice(0, 8).map((s) => <span key={s} className={`px-2 py-1 rounded-lg text-[11px] font-semibold ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{s}</span>)}
        </div>
      </div>

      {candidate.summary && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Notes</p>
          <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{candidate.summary}</p>
        </div>
      )}
    </div>
  );
}

function InfoRow({ dark, label, children }: { dark: boolean; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className={`text-[11px] font-semibold min-w-[80px] ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</span>
      <span className="text-xs font-semibold text-right">{children}</span>
    </div>
  );
}

// ──────────── Interviews & Evaluations ────────────
function InterviewsSection({ dark, sub, setSub, interviews, assessments }: { dark: boolean; sub: InterviewSubSection; setSub: (v: InterviewSubSection) => void; interviews: InterviewEvent[]; assessments: Assessment[] }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex gap-1 flex-wrap">
        {(["scheduling", "scorecards", "assessments"] as const).map((s) => (
          <button key={s} onClick={() => setSub(s)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${sub === s ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20" : dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
          >{s === "scheduling" ? " Scheduling" : s === "scorecards" ? "📝 Scorecards" : "💻 Assessments"}</button>
        ))}
      </div>

      {sub === "scheduling" && (
        <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
          <table className="w-full text-xs">
            <thead className={dark ? "text-slate-500 bg-slate-950/40" : "text-slate-400 bg-slate-50"}>
              <tr><th className="py-3 px-4 text-left">Candidate</th><th className="py-3 px-4 text-left">Date & Time</th><th className="py-3 px-4 text-left">Type</th><th className="py-3 px-4 text-left">Interviewer</th><th className="py-3 px-4 text-center">Status</th></tr>
            </thead>
            <tbody>
              {interviews.map((i) => (
                <tr key={i.id} className={`border-t ${dark ? "border-slate-800/50 hover:bg-slate-900/40" : "border-slate-100 hover:bg-slate-50"}`}>
                  <td className="py-3 px-4 font-semibold">{i.candidate}</td>
                  <td className="py-3 px-4">{new Date(i.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {i.time}</td>
                  <td className="py-3 px-4">{i.type}</td>
                  <td className="py-3 px-4 text-slate-400">{i.interviewer}</td>
                  <td className="py-3 px-4 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${i.status === "Scheduled" ? "bg-indigo-500/15 text-indigo-300 ring-1 ring-inset ring-indigo-500/30" : i.status === "Completed" ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30" : "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30"}`}>{i.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === "scorecards" && (
        <div className="space-y-4">
          {interviews.filter((i) => i.scorecard).map((i) => (
            <div key={i.id} className={`rounded-2xl border p-5 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
              <div className="flex items-start justify-between mb-4">
                <div><h4 className="text-sm font-bold">{i.candidate}</h4><p className={`text-[11px] ${dark ? "text-slate-500" : "text-slate-400"}`}>{i.type} · {new Date(i.date).toLocaleDateString()}</p></div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30">Submitted</span>
              </div>
              <div className="space-y-2">
                {i.scorecard!.categories.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-3">
                    <span className={`text-xs font-semibold w-28 ${dark ? "text-slate-400" : "text-slate-500"}`}>{cat.name}</span>
                    <div className={`flex-1 h-2 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
                      <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: `${(cat.score / cat.max) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold w-10 text-right">{cat.score}/{cat.max}</span>
                  </div>
                ))}
              </div>
              <p className={`text-xs mt-4 leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{i.scorecard!.notes}</p>
              <p className={`text-xs font-bold mt-2 ${dark ? "text-emerald-300" : "text-emerald-700"}`}>Recommendation: {i.scorecard!.recommendation}</p>
            </div>
          ))}
        </div>
      )}

      {sub === "assessments" && (
        <div className={`rounded-2xl border overflow-hidden ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
          <table className="w-full text-xs">
            <thead className={dark ? "text-slate-500 bg-slate-950/40" : "text-slate-400 bg-slate-50"}>
              <tr><th className="py-3 px-4 text-left">Candidate</th><th className="py-3 px-4 text-left">Assessment</th><th className="py-3 px-4 text-left">Due</th><th className="py-3 px-4 text-center">Status</th><th className="py-3 px-4 text-right">Score</th></tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id} className={`border-t ${dark ? "border-slate-800/50 hover:bg-slate-900/40" : "border-slate-100 hover:bg-slate-50"}`}>
                  <td className="py-3 px-4 font-semibold">{a.candidate}</td>
                  <td className="py-3 px-4">{a.type}</td>
                  <td className="py-3 px-4 text-slate-400">{new Date(a.due).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-center"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.status === "Pending" ? "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30" : a.status === "Submitted" ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30" : "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30"}`}>{a.status}</span></td>
                  <td className="py-3 px-4 text-right font-bold">{a.score ? `${a.score}%` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ──────────── Settings ────────────
function SettingsSection({ dark, sub, setSub, profile, setProfile, onLogout, onSwitch }: { dark: boolean; sub: SettingsSubSection; setSub: (v: SettingsSubSection) => void; profile: RecruiterProfile; setProfile: (p: RecruiterProfile) => void; onLogout: () => void; onSwitch: () => void }) {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex gap-1">
        {(["profile", "notifications", "preferences"] as const).map((s) => (
          <button key={s} onClick={() => setSub(s)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${sub === s ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/20" : dark ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}
          >{s === "profile" ? "👤 Profile" : s === "notifications" ? "🔔 Notifications" : "⚙️ Preferences"}</button>
        ))}
      </div>

      {sub === "profile" && (
        <div className="space-y-6">
          <div className={`rounded-2xl border p-6 ${dark ? "bg-slate-900/70 border-slate-800" : "bg-white border-slate-200/70 shadow-sm"}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-6 pb-6 border-b border-slate-800/60">
              <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-xl" style={{ background: profile.avatar }}>{profile.name.split(" ").map((n) => n[0]).join("")}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-extrabold">{profile.name}</h3>
                <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>{profile.role}</p>
                <p className={`text-xs mt-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>Member since {new Date(profile.joinedAt).toLocaleDateString(undefined, { month: "long", year: "numeric" })}</p>
              </div>
              <button onClick={onSwitch} className="px-4 py-2 rounded-lg text-xs font-bold text-slate-300 border border-slate-700 hover:bg-slate-800/60 transition-colors flex-shrink-0">
                Switch to Hiring Manager
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Full Name</label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className={`w-full px-3 py-2.5 rounded-xl text-sm ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 focus:border-indigo-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500"} outline-none transition-all`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Email</label>
                <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} className={`w-full px-3 py-2.5 rounded-xl text-sm ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 focus:border-indigo-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500"} outline-none transition-all`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Phone</label>
                <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={`w-full px-3 py-2.5 rounded-xl text-sm ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 focus:border-indigo-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500"} outline-none transition-all`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Role</label>
                <input value={profile.role} onChange={(e) => setProfile({ ...profile, role: e.target.value })} className={`w-full px-3 py-2.5 rounded-xl text-sm ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 focus:border-indigo-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500"} outline-none transition-all`} />
              </div>
              <div className="sm:col-span-2">
                <label className={`block text-xs font-semibold mb-1.5 ${dark ? "text-slate-300" : "text-slate-700"}`}>Bio</label>
                <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} rows={3} className={`w-full px-3 py-2.5 rounded-xl text-sm resize-none ${dark ? "bg-slate-950/60 border border-slate-700/60 text-slate-100 focus:border-indigo-500" : "bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500"} outline-none transition-all`} />
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
              <div className={`h-5 w-10 rounded-full transition-colors cursor-pointer ${n.on ? "bg-indigo-500" : dark ? "bg-slate-700" : "bg-slate-300"}`}>
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
              <button onClick={() => document.documentElement.classList.toggle("dark")} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${dark ? "bg-indigo-500/15 text-indigo-300" : "bg-slate-100 text-slate-600"}`}>
                {dark ? "☀️ Light" : "🌙 Dark"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────── Logout Modal ───────────
function LogoutModal({ dark, onClose, onLogout, onSwitch }: { dark: boolean; onClose: () => void; onLogout: () => void; onSwitch: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-sm rounded-2xl border shadow-2xl p-6 animate-fadeIn ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"}`}>
        <h3 className="text-base font-bold mb-4">Manage Session</h3>
        <div className="space-y-2.5">
          <button onClick={() => { onSwitch(); onClose(); }} className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-xs font-semibold ${dark ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25" : "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"}`}>
            <span>Switch to Hiring Manager</span>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          <button onClick={onLogout} className={`w-full flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-semibold ${dark ? "bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25" : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"}`}>
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" /></svg>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
