import { useMemo, useState } from "react";
import { CANDIDATES } from '../../data';

// ─────────────────────────── Types ───────────────────────────
type EntityStatus = "Active" | "Pending" | "Suspended" | "Rejected";
type Role = "Admin" | "Recruiter" | "Hiring Manager" | "Viewer";

interface Recruiter {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: EntityStatus;
  assignedCompanyIds: string[];
  joinedAt: string;
  lastActive: string;
  avatar: string;
  phone: string;
  location: string;
}

interface Company {
  id: string;
  name: string;
  industry: string;
  contact: string;
  email: string;
  status: "Approved" | "Pending" | "Rejected";
  registeredAt: string;
  recruiterIds: string[];
  applicantsCount: number;
  openJobs: number;
  website: string;
  location: string;
  size: string;
}

interface Relationship {
  id: string;
  recruiterId: string;
  companyId: string;
  candidateId: string;
  stage: string;
  lastTicket: string;
}

type EntityType = "company" | "recruiter" | "candidate";
type Tab = "overview" | "candidates" | "recruiters" | "companies";

// ─────────────────────────── Constants ───────────────────────────
const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#14b8a6", "#0ea5e9"];

const SEED_RECRUITERS: Recruiter[] = [
  { id: "REC-001", name: "Ava Johnson", email: "ava.j@hireminds.co", role: "Recruiter", status: "Active", assignedCompanyIds: ["CMP-01", "CMP-03"], joinedAt: "2026-02-15", lastActive: "2 min ago", avatar: AVATAR_COLORS[0], phone: "+1 (415) 555-0281", location: "San Francisco, CA" },
  { id: "REC-002", name: "Marcus Lee", email: "marcus.l@hireminds.co", role: "Recruiter", status: "Active", assignedCompanyIds: ["CMP-02"], joinedAt: "2026-03-02", lastActive: "15 min ago", avatar: AVATAR_COLORS[1], phone: "+1 (310) 555-0142", location: "Los Angeles, CA" },
  { id: "REC-003", name: "Priya Shah", email: "priya.s@hireminds.co", role: "Recruiter", status: "Active", assignedCompanyIds: ["CMP-01", "CMP-04"], joinedAt: "2026-03-18", lastActive: "1 hr ago", avatar: AVATAR_COLORS[2], phone: "+44 20 7946 0958", location: "London, UK" },
  { id: "REC-004", name: "Diego Novak", email: "diego.n@hireminds.co", role: "Recruiter", status: "Pending", assignedCompanyIds: [], joinedAt: "2026-04-09", lastActive: "—", avatar: AVATAR_COLORS[3], phone: "+49 30 901 820", location: "Berlin, DE" },
  { id: "REC-005", name: "Elena Fischer", email: "elena.f@hireminds.co", role: "Hiring Manager", status: "Active", assignedCompanyIds: ["CMP-02", "CMP-03"], joinedAt: "2025-11-20", lastActive: "5 min ago", avatar: AVATAR_COLORS[4], phone: "+65 6271 0980", location: "Singapore, SG" },
];

const SEED_COMPANIES: Company[] = [
  { id: "CMP-01", name: "Vertex Systems", industry: "Enterprise SaaS", contact: "Sara Kim", email: "talent@vertexsys.io", status: "Approved", registeredAt: "2026-01-22", recruiterIds: ["REC-001", "REC-003"], applicantsCount: 214, openJobs: 7, website: "vertexsys.io", location: "San Francisco, CA", size: "501-1000 employees" },
  { id: "CMP-02", name: "Nimbus Labs", industry: "AI Infrastructure", contact: "Tom Osei", email: "jobs@nimbuslabs.ai", status: "Approved", registeredAt: "2026-02-05", recruiterIds: ["REC-002", "REC-005"], applicantsCount: 186, openJobs: 5, website: "nimbuslabs.ai", location: "Austin, TX", size: "201-500 employees" },
  { id: "CMP-03", name: "Cascade Media", industry: "Content Platform", contact: "Leah Novak", email: "work@cascademedia.com", status: "Pending", registeredAt: "2026-04-10", recruiterIds: [], applicantsCount: 0, openJobs: 2, website: "cascademedia.com", location: "New York, NY", size: "51-200 employees" },
  { id: "CMP-04", name: "BrightPath Health", industry: "HealthTech", contact: "Ravi Patel", email: "hr@brightpath.health", status: "Pending", registeredAt: "2026-04-12", recruiterIds: [], applicantsCount: 0, openJobs: 4, website: "brightpath.health", location: "Boston, MA", size: "201-500 employees" },
];

const SEED_RELATIONSHIPS: Relationship[] = [
  { id: "REL-001", recruiterId: "REC-001", companyId: "CMP-01", candidateId: CANDIDATES[0].id, stage: "Technical", lastTicket: "Interview scheduled" },
  { id: "REL-002", recruiterId: "REC-001", companyId: "CMP-03", candidateId: CANDIDATES[3].id, stage: "Shortlisted", lastTicket: "Sourced via LinkedIn" },
  { id: "REL-003", recruiterId: "REC-002", companyId: "CMP-02", candidateId: CANDIDATES[7].id, stage: "Onsite", lastTicket: "Panel stage" },
  { id: "REL-004", recruiterId: "REC-003", companyId: "CMP-04", candidateId: CANDIDATES[11].id, stage: "Offer", lastTicket: "Offer extended" },
  { id: "REL-005", recruiterId: "REC-005", companyId: "CMP-02", candidateId: CANDIDATES[15].id, stage: "Phone Screen", lastTicket: "Screening call complete" },
];


// ─────────────────────────── Helpers ───────────────────────────
const initialsOf = (name: string) => name.split(" ").map((n) => n[0]).join("");

const ROLE_STYLES: Record<Role, string> = {
  Admin: "bg-violet-500/15 text-violet-400 ring-1 ring-inset ring-violet-500/30",
  Recruiter: "bg-sky-500/15 text-sky-400 ring-1 ring-inset ring-sky-500/30",
  "Hiring Manager": "bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30",
  Viewer: "bg-slate-500/15 text-slate-400 ring-1 ring-inset ring-slate-500/30",
};

// ─────────────────────────── Component ───────────────────────────
export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [recruiters, setRecruiters] = useState<Recruiter[]>(SEED_RECRUITERS);
  const [companies, setCompanies] = useState<Company[]>(SEED_COMPANIES);
  const [relationships] = useState<Relationship[]>(SEED_RELATIONSHIPS);

  // ── Panels ──
  const [panel, setPanel] = useState<{ type: EntityType; id: string | null }>({ type: "company", id: null });
  const [panelTab, setPanelTab] = useState<"overview" | "edit" | "access" | "password">("overview");
  const [showAddRecruiter, setShowAddRecruiter] = useState(false);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [recruiterForm, setRecruiterForm] = useState({ name: "", email: "", role: "Recruiter" as Role, companyId: "" });
  const [companyStatusFilter, setCompanyStatusFilter] = useState<"All" | "Approved" | "Pending" | "Rejected">("All");

  // ── Derived ──
  const activeRecruiters = useMemo(() => recruiters.filter(r => r.status === "Active").length, [recruiters]);
  const pendingCompanies = useMemo(() => companies.filter(c => c.status === "Pending").length, [companies]);
  const activeRelations = useMemo(() => relationships.length, [relationships]);

  const companyById = (id: string | null | undefined) => companies.find((c) => c.id === id);
  const recruiterById = (id: string | null | undefined) => recruiters.find((r) => r.id === id);

  const approveCompany = (id: string) => setCompanies((p) => p.map((c) => (c.id === id ? { ...c, status: "Approved" } : c)));
  const rejectCompany = (id: string) => setCompanies((p) => p.map((c) => (c.id === id ? { ...c, status: "Rejected" } : c)));

  const toggleRecruiterStatus = (id: string) =>
    setRecruiters((p) => p.map((r) => (r.id === id ? { ...r, status: r.status === "Active" ? "Suspended" : "Active" } : r)));

  const changeRecruiterRole = (id: string) => {
    const roles: Role[] = ["Recruiter", "Hiring Manager", "Viewer"];
    setRecruiters((p) =>
      p.map((r) => {
        if (r.id !== id) return r;
        const i = roles.indexOf(r.role);
        return { ...r, role: roles[(i + 1) % roles.length] };
      })
    );
  };

  const assignCompanyToRecruiter = (recruiterId: string, companyId: string) =>
    setRecruiters((p) =>
      p.map((r) =>
        r.id !== recruiterId
          ? r
          : r.assignedCompanyIds.includes(companyId)
            ? { ...r, assignedCompanyIds: r.assignedCompanyIds.filter((x) => x !== companyId) }
            : { ...r, assignedCompanyIds: [...r.assignedCompanyIds, companyId] }
      )
    );

  const addRecruiter = () => {
    if (!recruiterForm.name || !recruiterForm.email) return;
    const newRec: Recruiter = {
      id: `REC-${String(recruiters.length + 6).padStart(3, "0")}`,
      name: recruiterForm.name,
      email: recruiterForm.email,
      role: recruiterForm.role,
      status: "Pending",
      assignedCompanyIds: recruiterForm.companyId ? [recruiterForm.companyId] : [],
      joinedAt: new Date().toISOString().slice(0, 10),
      lastActive: "—",
      avatar: AVATAR_COLORS[recruiters.length % AVATAR_COLORS.length],
      phone: "—",
      location: "—",
    };
    setRecruiters((p) => [...p, newRec]);
    setEmailSent(newRec.email);
    setRecruiterForm({ name: "", email: "", role: "Recruiter", companyId: "" });
    setTimeout(() => {
      setShowAddRecruiter(false);
      setEmailSent(null);
    }, 3200);
  };

  const openPanel = (type: EntityType, id: string) => {
    setPanel({ type, id });
    setPanelTab("overview");
  };
  const closePanel = () => setPanel({ type: "company", id: null });

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg> },
    { id: "candidates", label: "Candidates", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" /><path strokeLinecap="round" d="M16 3.13a4 4 0 010 7.75M21 21v-1a5 5 0 00-3-4.58" /></svg> },
    { id: "recruiters", label: "Recruiters", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 015.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: "companies", label: "Companies", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" /></svg> },
  ];

  const activeCompany = panel.type === "company" ? companyById(panel.id) : undefined;
  const activeRecruiter = panel.type === "recruiter" ? recruiterById(panel.id) : undefined;
  const activeCandidate = panel.type === "candidate" ? CANDIDATES.find((c) => c.id === panel.id) : undefined;
  const filteringSearch = search.toLowerCase();

  // ─────────────────────────── Render ───────────────────────────
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100 transition-colors duration-300">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-rose-600/10 blur-[100px]" />
      </div>

      {/* Top navigation */}
      <div className="sticky top-0 z-30 relative z-10 flex items-center justify-between gap-4 h-14 px-4 sm:px-6 border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-base font-extrabold tracking-tight">
            <span className="text-white">Hire</span><span style={{ color: "#eab308" }}>Minds</span><span className="text-red-500">.</span>
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 ml-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                tab === t.id
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="hidden sm:flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800/60 transition-all"
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-md flex-shrink-0">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold leading-tight text-slate-200">System Admin</p>
              <p className="text-[10px] text-slate-500 leading-tight">admin@hireminds.co</p>
            </div>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="flex sm:hidden items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-bold text-slate-400">Administrator</span>
          </div>
          <button onClick={onLogout} className="h-8 px-3 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile tabs strip */}
      <div className="sm:hidden relative z-10 border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-xl px-4 py-1.5">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                tab === t.id ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="relative z-10 px-4 sm:px-6 py-6 max-w-[1280px] mx-auto space-y-6 animate-fadeIn">

        {/* ═════════ Overview ═════════ */}
        {tab === "overview" && (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 backdrop-blur-md">
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-20 bg-violet-500" />
              <h2 className="text-2xl font-extrabold tracking-tight">System Administration</h2>
              <p className="text-sm mt-1 text-slate-400">Central hub for candidate management, recruiter assignments, and company onboarding.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Role-Based Access", "Portal Emails", "Approval Workflows", "Activity Trail"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-300">{tag}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlowStat label="Total Candidates" value={CANDIDATES.length} color="#6366f1" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" /><path strokeLinecap="round" d="M16 3.13a4 4 0 010 7.75M21 21v-1a5 5 0 00-3-4.58" /></svg>} />
              <GlowStat label="Active Recruiters" value={activeRecruiters} color="#0ea5e9" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 015.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
              <GlowStat label="Pending Companies" value={pendingCompanies} color="#f59e0b" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" /></svg>} />
              <GlowStat label="Active Relations" value={activeRelations} color="#10b981" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>} />
            </div>

            {/* Roles + pending queue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <RolesPanel recruiters={recruiters} onOpenRecruiter={(id) => openPanel("recruiter", id)} />
              <PendingQueue companies={companies} onApprove={approveCompany} onReject={rejectCompany} />
            </div>
          </>
        )}

        {/* ═════════ Candidates ═════════ */}
        {tab === "candidates" && (
          <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 overflow-hidden backdrop-blur-md">
            <div className="p-4 border-b border-slate-800/60 flex flex-wrap items-center gap-3 justify-between">
              <div>
                <h3 className="text-sm font-bold">Candidate Profiles</h3>
                <p className="text-xs text-slate-500">View and manage every candidate in the system</p>
              </div>
              <SearchInput search={search} setSearch={setSearch} placeholder="Search by name, role…" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-800/60 text-slate-500 uppercase tracking-wider font-bold">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {CANDIDATES.filter((c) => {
                    if (!filteringSearch) return true;
                    return c.name.toLowerCase().includes(filteringSearch) || c.role.toLowerCase().includes(filteringSearch);
                  }).slice(0, 15).map((c) => (
                    <tr key={c.id} className="border-b last:border-none border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ background: c.avatar }}>
                            {initialsOf(c.name)}
                          </div>
                          <div>
                            <p className="font-bold">{c.name}</p>
                            <p className="text-[10px] text-slate-500">{c.id} · {c.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{c.role}</td>
                      <td className="py-3 px-4 text-slate-400">{c.location}</td>
                      <td className="py-3 px-4 text-center"><Badge tone={statusTone(c.status === "Active" ? "Active" : c.status)}>{c.status}</Badge></td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => openPanel("candidate", c.id)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-500/15 text-indigo-300 hover:bg-indigo-500/30 transition-all">
                          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ═════════ Recruiters ═════════ */}
        {tab === "recruiters" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold">Recruiter Directory</h3>
                <p className="text-xs text-slate-500">The admin adds each recruiter. Invite emails contain a verification link to create their portal account.</p>
              </div>
              <button
                onClick={() => setShowAddRecruiter(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25 transition-all"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Recruiter
              </button>
            </div>

            {showAddRecruiter && (
              <div className="rounded-2xl border border-violet-500/40 bg-slate-900/70 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold">Invite New Recruiter</h4>
                  <button onClick={() => setShowAddRecruiter(false)} className="text-xs text-slate-500 hover:text-slate-300">Cancel</button>
                </div>
                {emailSent && (
                  <div className="mb-4 rounded-lg px-3 py-2.5 text-xs font-medium flex items-start gap-2 bg-violet-500/15 text-violet-300 ring-1 ring-inset ring-violet-500/30">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 8c0-2.8-2.2-5-5-5H7C4.2 3 2 5.2 2 8v8c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V8z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 8l10 6 10-6" />
                    </svg>
                    <span>Verification email sent to {emailSent}. The invite link lets them create their portal account.</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <InputField label="Full Name" value={recruiterForm.name} onChange={(v) => setRecruiterForm({ ...recruiterForm, name: v })} placeholder="Ava Johnson" />
                  <InputField label="Work Email" value={recruiterForm.email} onChange={(v) => setRecruiterForm({ ...recruiterForm, email: v })} placeholder="ava.j@hireminds.co" type="email" />
                  <SelectField label="Role" value={recruiterForm.role} onChange={(v) => setRecruiterForm({ ...recruiterForm, role: v as Role })} options={["Recruiter", "Hiring Manager", "Viewer"] as string[]} />
                  <SelectField label="Assign to Client Company" value={recruiterForm.companyId} onChange={(v) => setRecruiterForm({ ...recruiterForm, companyId: v })} options={["", ...companies.filter(c => c.status !== "Rejected").map(c => c.id)]} formatOption={(id) => id === "" ? "Unassigned" : companies.find(c => c.id === id)?.name ?? id} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={addRecruiter} className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-md shadow-violet-500/25 transition-all">
                    Send Invite
                  </button>
                  <p className="text-[10px] text-slate-500">An email with a verification link will be sent automatically.</p>
                </div>
              </div>
            )}

            <div className="relative">
              <SearchInput search={search} setSearch={setSearch} placeholder="Search recruiters…" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              {recruiters.filter((r) => {
                if (!filteringSearch) return true;
                return r.name.toLowerCase().includes(filteringSearch) || r.email.toLowerCase().includes(filteringSearch) || r.role.toLowerCase().includes(filteringSearch);
              }).map((r) => (
                <div key={r.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-700 backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center text-base font-bold text-white shadow-md flex-shrink-0" style={{ background: r.avatar }}>
                      {initialsOf(r.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold">{r.name}</p>
                        <button onClick={() => changeRecruiterRole(r.id)} title="Click to cycle roles" className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all hover:brightness-110 ${ROLE_STYLES[r.role]}`}>
                          {r.role}
                          <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 ml-0.5" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                      </div>
                      <p className="text-xs mt-0.5 text-slate-400">{r.email}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                        <span className="text-[10px] text-slate-500">Joined {new Date(r.joinedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                        <span className="text-[10px] text-slate-500">· {r.location}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-1.5">
                      <button onClick={() => toggleRecruiterStatus(r.id)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all ${r.status === "Active" ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25" : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"}`}>
                        {r.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                      <button onClick={() => openPanel("recruiter", r.id)} className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all">Manage</button>
                    </div>
                  </div>

                  {/* Connected companies */}
                  <div className="mt-4 pt-4 border-t border-slate-800">
                    <p className="text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-500">Connected Companies</p>
                    <div className="flex flex-wrap gap-1.5">
                      {r.assignedCompanyIds.length === 0 && (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-medium text-slate-600">Not assigned yet.</span>
                      )}
                      {r.assignedCompanyIds.map((cid) => {
                        const comp = companyById(cid);
                        if (!comp) return null;
                        return (
                          <span key={cid} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-sky-500/10 text-sky-400 ring-1 ring-inset ring-sky-500/20 hover:bg-sky-500/20 transition-all group">
                            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" /></svg>
                            {comp.name}
                            <button
                              onClick={() => assignCompanyToRecruiter(r.id, cid)}
                              title="Remove assignment"
                              className="h-3.5 w-3.5 rounded-full flex items-center justify-center transition-all hover:bg-red-500/30 hover:text-red-300"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                    {r.status === "Active" && (
                      <div className="mt-2 relative flex-1 min-w-[140px]">
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              const rid = e.target.value;
                              setRecruiters((p) => p.map((rec) => rec.id === r.id ? { ...rec, assignedCompanyIds: [...rec.assignedCompanyIds, rid] } : rec));
                              setCompanies((p) => p.map((c) => c.id === rid ? { ...c, recruiterIds: [...c.recruiterIds, r.id] } : c));
                              e.target.value = "";
                            }
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs outline-none cursor-pointer bg-slate-950/60 border border-slate-800 text-slate-100"
                        >
                          <option value="">Assign to a company…</option>
                          {companies.filter((c) => c.status === "Approved" && !r.assignedCompanyIds.includes(c.id)).map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═════════ Companies ═════════ */}
        {tab === "companies" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold">Client Company Registrations</h3>
                <p className="text-xs text-slate-500">Companies sign up through the platform. Admin reviews each registration; a verification link is emailed on approval.</p>
              </div>
              <SearchInput search={search} setSearch={setSearch} placeholder="Search companies…" />
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-1.5">
              {(["All", "Approved", "Pending", "Rejected"] as const).map((s) => {
                const count = s === "All" ? companies.length : companies.filter((c) => c.status === s).length;
                return (
                  <button
                    key={s}
                    onClick={() => setCompanyStatusFilter(s)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      companyStatusFilter === s
                        ? s === "Approved" ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
                          : s === "Pending" ? "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30"
                          : s === "Rejected" ? "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30"
                          : "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    }`}
                  >
                    {s}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${companyStatusFilter === s ? "bg-white/10" : "bg-slate-800"}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {companies.filter((c) => {
                if (companyStatusFilter !== "All" && c.status !== companyStatusFilter) return false;
                if (!filteringSearch) return true;
                return c.name.toLowerCase().includes(filteringSearch) || c.industry.toLowerCase().includes(filteringSearch) || c.contact.toLowerCase().includes(filteringSearch);
              }).map((c) => (
                <div key={c.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-700 backdrop-blur-md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0">
                        {initialsOf(c.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-500">{c.industry}</p>
                        <p className="text-[10px] text-slate-500">{c.email}</p>
                      </div>
                    </div>
                    <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                  </div>

                  {recruiters.filter((r) => r.status === "Active" && !c.recruiterIds.includes(r.id)).length > 0 && (
                    <div className="mt-4 relative flex-1 min-w-[130px]">
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            e.stopPropagation();
                          }
                        }}
                        className="w-full px-2.5 py-1 rounded-lg text-xs outline-none cursor-pointer bg-slate-950/60 border border-slate-800 text-slate-100"
                      >
                        <option value="">+ Assign recruiter</option>
                        {recruiters.filter((r) => r.status === "Active" && !c.recruiterIds.includes(r.id)).map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openPanel("company", c.id)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-300 hover:text-indigo-200 transition-all"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" /></svg>
                      Full Details &amp; Management
                    </button>
                    {c.status === "Pending" && (
                      <div className="flex gap-1.5">
                        <button onClick={() => approveCompany(c.id)} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-all">✓ Approve</button>
                        <button onClick={() => rejectCompany(c.id)} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all">✕ Reject</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ─────────────────────────── Entity Detail Panel ─────────────────────────── */}
      {(activeCompany || activeRecruiter || activeCandidate) && (
        <EntityDetailPanel
          type={panel.type}
          company={activeCompany}
          recruiter={activeRecruiter}
          candidate={activeCandidate}
          panelTab={panelTab} setPanelTab={setPanelTab}
          recruiters={recruiters} companies={companies}
          onClose={closePanel}
          onApproveCompany={approveCompany}
          onRejectCompany={rejectCompany}
          onToggleRecruiterStatus={toggleRecruiterStatus}
          editCompany={(id, field, value) => setCompanies((p) => p.map((c) => (c.id === id ? { ...c, [field]: value } : c)))}
          editRecruiter={(id, field, value) => setRecruiters((p) => p.map((r) => (r.id === id ? { ...r, [field]: value } : r)))}
          onAssignCompany={(cid, rid) => {
            setCompanies((p) => p.map((c) => (c.id === cid ? { ...c, recruiterIds: [...c.recruiterIds, rid] } : c)));
            setRecruiters((p) => p.map((r) => (r.id === rid ? { ...r, assignedCompanyIds: [...r.assignedCompanyIds, cid] } : r)));
          }}
          onUnassignCompany={(cid, rid) => {
            setCompanies((p) => p.map((c) => (c.id === cid ? { ...c, recruiterIds: c.recruiterIds.filter((x) => x !== rid) } : c)));
            setRecruiters((p) => p.map((r) => (r.id === rid ? { ...r, assignedCompanyIds: r.assignedCompanyIds.filter((x) => x !== cid) } : r)));
          }}
        />
      )}

      <footer className="mt-10 text-center text-xs text-slate-500 pb-4">
        Admin Portal v2.1 · All actions are logged and monitored
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
//                              SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════════

// ─────────────────────────── Stat Card ───────────────────────────
function GlowStat({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-900/60 hover:border-slate-700 backdrop-blur-md">
      <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-20" style={{ background: color }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-2 text-[28px] font-extrabold">{value}</p>
        </div>
        <div className="h-11 w-11 flex-shrink-0 rounded-xl flex items-center justify-center ring-1 ring-inset [&>svg]:h-5 [&>svg]:w-5" style={{ background: `linear-gradient(135deg, ${color}2a, ${color}0d)`, color }}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── Badge ───────────────────────────
function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "violet" | "emerald" | "amber" | "red" | "sky" | "rose" | "teal" | "pink" }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-500/15 text-slate-300 ring-1 ring-inset ring-slate-500/30",
    violet: "bg-violet-500/15 text-violet-300 ring-1 ring-inset ring-violet-500/30",
    emerald: "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
    amber: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
    red: "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30",
    sky: "bg-sky-500/15 text-sky-300 ring-1 ring-inset ring-sky-500/30",
    rose: "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30",
    teal: "bg-teal-500/15 text-teal-300 ring-1 ring-inset ring-teal-500/30",
    pink: "bg-pink-500/15 text-pink-300 ring-1 ring-inset ring-pink-500/30",
  };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${tones[tone]}`}>{children}</span>;
}
const statusTone = (s: string): ("slate" | "violet" | "emerald" | "amber" | "red" | "sky" | "rose" | "teal" | "pink") => {
  if (s === "Active" || s === "Approved" || s === "Hired") return "emerald";
  if (s === "Pending" || s === "On Hold" || s === "On Hold") return "amber";
  if (s === "Rejected") return "red";
  if (s === "Suspended") return "rose";
  if (s === "Technical" || s === "Onsite") return "violet";
  if (s === "Offer") return "pink";
  if (s === "Phone Screen") return "sky";
  return "slate";
};

// ─────────────────────────── Search Input ───────────────────────────
function SearchInput({ search, setSearch, placeholder }: { search: string; setSearch: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative min-w-[200px]">
      <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.3-4.3" />
      </svg>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-violet-500 transition-colors"
      />
    </div>
  );
}

// ─────────────────────────── Roles Panel ───────────────────────────
function RolesPanel({ recruiters, onOpenRecruiter }: { recruiters: Recruiter[]; onOpenRecruiter: (id: string) => void }) {
  const rolesData = [
    { role: "Admin" as Role, desc: "Full platform control", count: 1, clickable: false },
    { role: "Hiring Manager" as Role, desc: "Full recruitment funnel", count: recruiters.filter((r) => r.role === "Hiring Manager").length, clickable: true },
    { role: "Recruiter" as Role, desc: "Sourcing-focused", count: recruiters.filter((r) => r.role === "Recruiter").length, clickable: true },
    { role: "Viewer" as Role, desc: "Read-only dashboards", count: recruiters.filter((r) => r.role === "Viewer").length, clickable: true },
  ];
  const roleIcons: Record<Role, React.ReactNode> = {
    Admin: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 015.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    "Hiring Manager": <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" /></svg>,
    Recruiter: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 015.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    Viewer: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>,
  };
  const roleColors: Record<Role, string> = { Admin: "#8b5cf6", "Hiring Manager": "#10b981", Recruiter: "#0ea5e9", Viewer: "#64748b" };

  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 backdrop-blur-md">
      <h3 className="text-sm font-bold mb-3">Access Control Summary</h3>
      <div className="space-y-2">
        {rolesData.map((r) => (
          <button
            key={r.role}
            onClick={() => r.clickable && onOpenRecruiter(recruiters.find((x) => x.role === r.role && x.status === "Active")?.id ?? recruiters[0].id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all hover:brightness-125 ${r.clickable ? "bg-slate-950/60 border border-slate-800 hover:border-slate-600" : "bg-slate-900/40 border border-transparent"}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md" style={{ background: `linear-gradient(135deg, ${roleColors[r.role]}22, ${roleColors[r.role]}08)`, color: roleColors[r.role] }}>
                {roleIcons[r.role]}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${ROLE_STYLES[r.role]}`}>{r.role}</span>
                  <span className="text-xs font-bold">{r.count} {r.count === 1 ? "user" : "users"}</span>
                </div>
                <p className="text-[10px] mt-0.5 text-slate-500">{r.desc}</p>
              </div>
            </div>
            {r.clickable && (
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-600 flex-shrink-0 ml-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Pending companies queue
function PendingQueue({ companies, onApprove, onReject }: { companies: Company[]; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 backdrop-blur-md">
      <h3 className="text-sm font-bold mb-3">Company Onboarding Queue</h3>
      {companies.filter((c) => c.status === "Pending").length === 0 ? (
        <p className="text-xs text-slate-500">No pending registrations. You're all caught up.</p>
      ) : (
        <div className="space-y-2.5">
          {companies.filter((c) => c.status === "Pending").map((c) => (
            <div key={c.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-amber-500 to-orange-600 flex-shrink-0 shadow-lg shadow-amber-500/20">
                {initialsOf(c.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">{c.name}</p>
                <p className="text-[10px] text-amber-400/80">{c.industry} · {c.contact}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => onApprove(c.id)} className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/25">✓ Approve</button>
                <button onClick={() => onReject(c.id)} className="px-2 py-1 rounded-lg bg-red-500/15 text-red-400 text-[10px] font-bold hover:bg-red-500/25">✕ Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────── Field Helpers ───────────────────────────
const INPUT_CLS = "w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-slate-950/60 border border-slate-700/60 text-slate-100 placeholder-slate-500 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all";
const LBL_CLS = "block text-xs font-semibold text-slate-300 mb-1.5";

function InputField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className={LBL_CLS}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} className={INPUT_CLS} />
    </div>
  );
}

function SelectField({ label, value, onChange, options, formatOption }: { label: string; value: string; onChange: (v: string) => void; options: string[]; formatOption?: (v: string) => string }) {
  return (
    <div>
      <label className={LBL_CLS}>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${INPUT_CLS} cursor-pointer`}>
        {options.map((o) => (
          <option key={o} value={o}>{formatOption ? formatOption(o) : o}</option>
        ))}
      </select>
    </div>
  );
}

// ───────────────────────────────────────────────────────────────────────────────────
//                         ENTITY DETAIL PANEL (SIDE DRAWER)
// ───────────────────────────────────────────────────────────────────────────────────
function EntityDetailPanel({
  type, company, recruiter, candidate, panelTab, setPanelTab,
  recruiters, companies, onClose, onApproveCompany, onRejectCompany,
  onToggleRecruiterStatus, editCompany, editRecruiter,
  onAssignCompany, onUnassignCompany,
}: {
  type: EntityType;
  company?: Company;
  recruiter?: Recruiter;
  candidate?: (typeof CANDIDATES)[number];
  panelTab: "overview" | "edit" | "access" | "password";
  setPanelTab: (v: "overview" | "edit" | "access" | "password") => void;
  recruiters: Recruiter[]; companies: Company[];
  onClose: () => void;
  onApproveCompany: (id: string) => void;
  onRejectCompany: (id: string) => void;
  onToggleRecruiterStatus: (id: string) => void;
  editCompany: (id: string, field: string, value: string) => void;
  editRecruiter: (id: string, field: string, value: string) => void;
  onAssignCompany: (companyId: string, recruiterId: string) => void;
  onUnassignCompany: (companyId: string, recruiterId: string) => void;
}) {
  const [edit, setEdit] = useState<Record<string, any>>(() => {
    if (type === "company" && company) return { ...company };
    if (type === "recruiter" && recruiter) return { ...recruiter };
    if (type === "candidate" && candidate) return { ...candidate };
    return {};
  });
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwSuccess, setPwSuccess] = useState(false);
  const [editSave, setEditSave] = useState(false);

  const handleSave = () => {
    if (type === "company" && company) {
      Object.entries(edit).forEach(([k, v]) => editCompany(company.id, k, v));
    } else if (type === "recruiter" && recruiter) {
      Object.entries(edit).forEach(([k, v]) => editRecruiter(recruiter.id, k, v));
    }
    setEditSave(true);
    setTimeout(() => setEditSave(false), 2000);
  };

  const handlePwReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.next || pw.next !== pw.confirm || pw.next.length < 6) return;
    setPwSuccess(true);
    setPw({ current: "", next: "", confirm: "" });
    setTimeout(() => setPwSuccess(false), 2500);
  };

  const panelTabs = [
    { id: "overview" as const, label: "Overview", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: "edit" as const, label: "Profile Edit", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.4-9.4a2 2 0 112.8 2.8L18 14l-4 1 1-4 7.6-7.6z" /></svg> },
    { id: "access" as const, label: "Access Control", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
    { id: "password" as const, label: "Password", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.74 5.74 6 6 0 11-9-9A6 6 0 0119 5l-1.1-1.1a2 2 0 00-1.4-.58h-1a2 2 0 00-2 2v1a2 2 0 002 2h1a2 2 0 002-2z" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg> },
  ];

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Centered Modal */}
      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-0 sm:p-6 pointer-events-none">
        <div className="pointer-events-auto w-full sm:max-w-xl max-h-screen sm:max-h-[88vh] bg-slate-900/98 sm:rounded-2xl border border-slate-800/60 shadow-2xl backdrop-blur-xl flex flex-col animate-fadeIn overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60 bg-slate-900/60 flex-shrink-0">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500">
              {type === "company" ? "Client Company" : type === "recruiter" ? "Team Member" : "Candidate"}
            </p>
            <h3 className="text-base font-bold truncate max-w-[300px]">
              {type === "company" ? company?.name : type === "recruiter" ? recruiter?.name : candidate?.name}
            </h3>
            <p className="text-[10px] text-slate-500">
              ID: {type === "company" ? company?.id : type === "recruiter" ? recruiter?.id : candidate?.id}
            </p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 transition-colors">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 px-5 py-2 border-b border-slate-800/60 bg-slate-900/60 flex-shrink-0">
          {panelTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setPanelTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                panelTab === t.id
                  ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ─── Company panel ─── */}
          {type === "company" && company && (
            <>
              {panelTab === "overview" && (
                <>
                  <CompanyOverview company={company} recruiters={recruiters} />
                  {company.status === "Pending" && (
                    <div className="flex gap-2">
                      <button onClick={() => onApproveCompany(company.id)} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition-all">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Approve Registration
                      </button>
                      <button onClick={() => onRejectCompany(company.id)} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-500/20 transition-all">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        Reject
                      </button>
                    </div>
                  )}
                </>
              )}
              {panelTab === "edit" && (
                <CompanyEditForm edit={edit} setEdit={setEdit} editSave={editSave} onSave={handleSave} />
              )}
              {panelTab === "access" && (
                <CompanyAccess
                  company={company} recruiters={recruiters}
                  assignedRecruiterIds={companies.find((c) => c.id === company.id)?.recruiterIds ?? []}
                  onAssign={(rid) => onAssignCompany(company.id, rid)}
                  onUnassign={(rid) => onUnassignCompany(company.id, rid)}
                />
              )}
              {panelTab === "password" && (
                <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5 text-center">
                  <p className="text-xs font-bold text-slate-400">Password management is not available for company accounts.</p>
                  <p className="text-[10px] text-slate-500 mt-1">Company portal credentials are managed by the company's own admin through their workspace.</p>
                </div>
              )}
            </>
          )}

          {/* ─── Recruiter panel ─── */}
          {type === "recruiter" && recruiter && (
            <>
              {panelTab === "overview" && (
                <>
                  <RecruiterOverview recruiter={recruiter} />
                  <button
                    onClick={() => onToggleRecruiterStatus(recruiter.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all ${recruiter.status === "Active" ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-amber-500/20" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20"}`}
                  >
                    {recruiter.status === "Active" ? "Suspend Portal Access" : "Restore Portal Access"}
                  </button>
                </>
              )}
              {panelTab === "edit" && (
                <RecruiterEditForm edit={edit} setEdit={setEdit} editSave={editSave} onSave={handleSave} />
              )}
              {panelTab === "access" && (
                <RecruiterAccess
                  recruiter={recruiter}
                  approvedCompanies={companies.filter((c) => c.status === "Approved")}
                  onAssign={(cid) => onAssignCompany(cid, recruiter.id)}
                  onUnassign={(cid) => onUnassignCompany(cid, recruiter.id)}
                />
              )}
              {panelTab === "password" && (
                <PasswordPanel pw={pw} setPw={setPw} pwSuccess={pwSuccess} onSubmit={handlePwReset}
                  title="Reset Recruiter Password" desc="As an admin, you can reset this recruiter's portal password. No current password is required."
                />
              )}
            </>
          )}

          {/* ─── Candidate panel ─── */}
          {type === "candidate" && candidate && (
            <>
              {panelTab === "overview" && (
                <CandidateOverview candidate={candidate} />
              )}
              {panelTab === "edit" && (
                <CandidateEditForm edit={edit} setEdit={setEdit} editSave={editSave} onSave={handleSave} />
              )}
              {panelTab === "access" && (
                <CandidateAccess
                  candidate={candidate} recruiters={recruiters} companies={companies}
                  onAssign={(cid) => {
                    const rec = recruiters.find((r) => r.status === "Active" && r.assignedCompanyIds.includes(cid));
                    if (rec) onAssignCompany(cid, rec.id);
                  }}
                />
              )}
              {panelTab === "password" && (
                <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5 text-center">
                  <p className="text-xs font-bold text-slate-400">Password management is not available for candidate profiles.</p>
                  <p className="text-[10px] text-slate-500 mt-1">Admin can only reset recruiter portal passwords.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

// ——— Entity Overview Sub-Panels ———

function InfoItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2.5 border-b border-slate-800/50 last:border-none">
      <span className="text-xs font-semibold text-slate-400 min-w-[110px] leading-relaxed">{label}</span>
      <span className="text-xs font-semibold text-right shrink-0">{children}</span>
    </div>
  );
}

function CompanyOverview({ company, recruiters }: { company: Company; recruiters: Recruiter[] }) {
  const approvedNames = recruiters.filter((r) => company.recruiterIds.includes(r.id)).map((r) => r.name);
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 shadow-lg shadow-indigo-500/20">
            {initialsOf(company.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold">{company.name}</h4>
              <Badge tone={statusTone(company.status)}>{company.status}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{company.industry}</p>
          </div>
        </div>
        <div className="mt-5 space-y-0.5">
          <InfoItem label="Industry">{company.industry}</InfoItem>
          <InfoItem label="Primary Contact">{company.contact}</InfoItem>
          <InfoItem label="Email">{company.email}</InfoItem>
          <InfoItem label="Website">{company.website}</InfoItem>
          <InfoItem label="Location">{company.location}</InfoItem>
          <InfoItem label="Size">{company.size}</InfoItem>
          <InfoItem label="Registered">{new Date(company.registeredAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</InfoItem>
          <InfoItem label="Total Applicants">{company.applicantsCount}</InfoItem>
          <InfoItem label="Open Jobs">{company.openJobs}</InfoItem>
          <InfoItem label="Assigned Recruiters">{approvedNames.length === 0 ? <span className="text-slate-500">None</span> : approvedNames.join(", ")}</InfoItem>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Applicants</p>
          <p className="text-xl font-extrabold mt-1">{company.applicantsCount}</p>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Open Jobs</p>
          <p className="text-xl font-extrabold mt-1">{company.openJobs}</p>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Size</p>
          <p className="text-base font-extrabold mt-1.5 text-slate-300">{company.size.split(" ")[0]}</p>
        </div>
      </div>
    </div>
  );
}

function CompanyEditForm({ edit, setEdit, editSave, onSave }: { edit: Record<string, any>; setEdit: (v: Record<string, any>) => void; editSave: boolean; onSave: () => void }) {
  return (
    <div className="space-y-4">
      {editSave && <SaveOk />}
      <input type="hidden" readOnly value={edit.registeredAt ?? ""} />

      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-300">Company Name</label>
        <input
          value={edit.name ?? ""}
          onChange={(e) => setEdit({ ...edit, name: e.target.value })}
          className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-950/60 border border-slate-700/60 text-slate-100 outline-none focus:border-violet-500 transition-all"
        />
      </div>
      <SelectFieldShim
        label="Industry"
        value={edit.industry ?? ""}
        options={["Enterprise SaaS", "AI Infrastructure", "Content Platform", "HealthTech", "FinTech", "E-commerce", "Manufacturing", "Consulting"]}
        onChange={(v) => setEdit({ ...edit, industry: v })}
      />
      <InputSimple label="Primary Contact" value={edit.contact ?? ""} onChange={(v) => setEdit({ ...edit, contact: v })} />
      <InputSimple label="Email" value={edit.email ?? ""} type="email" onChange={(v) => setEdit({ ...edit, email: v })} />
      <InputSimple label="Website" value={edit.website ?? ""} onChange={(v) => setEdit({ ...edit, website: v })} />
      <InputSimple label="Location" value={edit.location ?? ""} onChange={(v) => setEdit({ ...edit, location: v })} />
      <SelectFieldShim
        label="Company Size"
        value={edit.size ?? ""}
        options={["1-50 employees", "51-200 employees", "201-500 employees", "501-1000 employees", "1000+ employees"]}
        onChange={(v) => setEdit({ ...edit, size: v })}
      />
      <InputSimple label="Total Applicants" value={String(edit.applicantsCount ?? "")} type="number" onChange={(v) => setEdit({ ...edit, applicantsCount: parseInt(v, 10) || 0 })} />
      <InputSimple label="Open Jobs" value={String(edit.openJobs ?? "")} type="number" onChange={(v) => setEdit({ ...edit, openJobs: parseInt(v, 10) || 0 })} />
      <SelectFieldShim
        label="Status"
        value={edit.status ?? "Pending"}
        options={["Approved", "Pending", "Rejected"]}
        onChange={(v) => setEdit({ ...edit, status: v })}
      />
      <div className="flex gap-2 pt-2">
        <button onClick={onSave} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function RecruiterEditForm({ edit, setEdit, editSave, onSave }: { edit: Record<string, any>; setEdit: (v: Record<string, any>) => void; editSave: boolean; onSave: () => void }) {
  return (
    <div className="space-y-4">
      {editSave && <SaveOk />}
      <InputSimple label="Full Name" value={edit.name ?? ""} onChange={(v) => setEdit({ ...edit, name: v })} />
      <InputSimple label="Email" value={edit.email ?? ""} type="email" onChange={(v) => setEdit({ ...edit, email: v })} />
      <SelectFieldShim label="Role" value={edit.role ?? "Recruiter"} options={["Recruiter", "Hiring Manager", "Viewer"]} onChange={(v) => setEdit({ ...edit, role: v })} />
      <InputSimple label="Phone" value={edit.phone ?? ""} onChange={(v) => setEdit({ ...edit, phone: v })} />
      <InputSimple label="Location" value={edit.location ?? ""} onChange={(v) => setEdit({ ...edit, location: v })} />
      <SelectFieldShim label="Status" value={edit.status ?? "Active"} options={["Active", "Pending", "Suspended"]} onChange={(v) => setEdit({ ...edit, status: v })} />
      <div className="flex gap-2 pt-2">
        <button onClick={onSave} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function CandidateEditForm({ edit, setEdit, editSave, onSave }: { edit: Record<string, any>; setEdit: (v: Record<string, any>) => void; editSave: boolean; onSave: () => void }) {
  return (
    <div className="space-y-4">
      {editSave && <SaveOk />}
      <div className="rounded-lg px-3 py-2 text-[10px] font-medium bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20">
        Admin can only edit contact and identity fields. Stage, score, and recruitment-specific fields are managed by the hiring team.
      </div>
      <InputSimple label="Full Name" value={edit.name ?? ""} onChange={(v) => setEdit({ ...edit, name: v })} />
      <InputSimple label="Email" value={edit.email ?? ""} type="email" onChange={(v) => setEdit({ ...edit, email: v })} />
      <InputSimple label="Location" value={edit.location ?? ""} onChange={(v) => setEdit({ ...edit, location: v })} />
      <SelectFieldShim label="Status" value={edit.status ?? "Active"} options={["Active", "On Hold", "Rejected"]} onChange={(v) => setEdit({ ...edit, status: v })} />
      <div className="flex gap-2 pt-2">
        <button onClick={onSave} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}

function RecruiterOverview({ recruiter }: { recruiter: Recruiter }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-lg" style={{ background: recruiter.avatar }}>
            {initialsOf(recruiter.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold">{recruiter.name}</h4>
              <Badge tone={statusTone(recruiter.status)}>{recruiter.status}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{recruiter.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge tone={statusTone(recruiter.role)}>{recruiter.role}</Badge>
              <Badge tone="slate">{recruiter.location}</Badge>
            </div>
          </div>
        </div>
        <div className="mt-5 space-y-0.5">
          <InfoItem label="Email">{recruiter.email}</InfoItem>
          <InfoItem label="Phone">{recruiter.phone}</InfoItem>
          <InfoItem label="Location">{recruiter.location}</InfoItem>
          <InfoItem label="Joined">{new Date(recruiter.joinedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</InfoItem>
          <InfoItem label="Last Active">{recruiter.lastActive}</InfoItem>
          <InfoItem label="Client Companies">
            {recruiter.assignedCompanyIds.length === 0
              ? <span className="text-slate-500">None</span>
              : recruiter.assignedCompanyIds.map((cid) => `CMP-${cid.split("-")[1]}`).join(", ")
            }
          </InfoItem>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Source Rate</p>
          <p className="text-xl font-extrabold mt-1">82%</p>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Hire Rate</p>
          <p className="text-xl font-extrabold mt-1">68%</p>
        </div>
        <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-3 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Placed</p>
          <p className="text-xl font-extrabold mt-1">34</p>
        </div>
      </div>
    </div>
  );
}

function CandidateOverview({ candidate }: { candidate: (typeof CANDIDATES)[number] }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-md" style={{ background: candidate.avatar }}>
            {initialsOf(candidate.name)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-base font-bold">{candidate.name}</h4>
              <Badge tone={statusTone(candidate.status === "On Hold" ? "Pending" : candidate.status)}>{candidate.status}</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{candidate.role}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge tone={statusTone(candidate.stage)}>{candidate.stage}</Badge>
              <Badge tone="slate">{candidate.seniority}</Badge>
              <Badge tone="slate">{candidate.location}</Badge>
            </div>
          </div>
        </div>
        <div className="mt-5 space-y-0.5">
          <InfoItem label="Email">{candidate.email}</InfoItem>
          <InfoItem label="Role">{candidate.role}</InfoItem>
          <InfoItem label="Department">{candidate.department}</InfoItem>
          <InfoItem label="Seniority">{candidate.seniority}</InfoItem>
          <InfoItem label="Source">{candidate.source}</InfoItem>
          <InfoItem label="Experience">{candidate.yearsExp} yrs</InfoItem>
          <InfoItem label="Location">{candidate.location}</InfoItem>
          <InfoItem label="Applied">{new Date(candidate.appliedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</InfoItem>
        </div>
      </div>
    </div>
  );
}

function CompanyAccess({
  company, recruiters, assignedRecruiterIds, onAssign, onUnassign,
}: {
  company: Company; recruiters: Recruiter[]; assignedRecruiterIds: string[];
  onAssign: (rid: string) => void; onUnassign: (rid: string) => void;
  companies?: Company[];
}) {
  const assigned = recruiters.filter((r) => assignedRecruiterIds.includes(r.id));
  const available = recruiters.filter((r) => r.status === "Active" && !assignedRecruiterIds.includes(r.id));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
        <h4 className="text-sm font-bold mb-3">Assigned Recruiters</h4>
        {assigned.length === 0 ? (
          <p className="text-xs text-slate-500">No recruiters are assigned to this company yet.</p>
        ) : (
          <div className="space-y-2">
            {assigned.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: r.avatar }}>
                  {initialsOf(r.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{r.name}</p>
                  <p className="text-[10px] text-slate-500">{r.email}</p>
                </div>
                <button onClick={() => onUnassign(r.id)} className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-500/20 hover:text-red-300 transition-all">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {available.length > 0 && (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
          <h4 className="text-sm font-bold mb-3">Available Active Recruiters</h4>
          <p className="text-xs text-slate-500 mb-3">Select a recruiter to assign to {company.name}.</p>
          <div className="space-y-2">
            {available.map((r) => (
              <button
                key={r.id}
                onClick={() => onAssign(r.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left bg-slate-900/40 border border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all"
              >
                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: r.avatar }}>
                  {initialsOf(r.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{r.name}</p>
                  <p className="text-[10px] text-slate-500">{r.role}</p>
                </div>
                <span className="text-[10px] font-bold text-sky-400">+ Assign</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RecruiterAccess({
  recruiter, approvedCompanies, onAssign, onUnassign,
}: {
  recruiter: Recruiter; approvedCompanies: Company[];
  onAssign: (cid: string) => void; onUnassign: (cid: string) => void;
}) {
  const assigned = approvedCompanies.filter((c) => recruiter.assignedCompanyIds.includes(c.id));
  const available = approvedCompanies.filter((c) => !recruiter.assignedCompanyIds.includes(c.id));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
        <h4 className="text-sm font-bold mb-3">Connected Companies</h4>
        {assigned.length === 0 ? (
          <p className="text-xs text-slate-500">Not linked to any client company yet.</p>
        ) : (
          <div className="space-y-2">
            {assigned.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0">{initialsOf(c.name)}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{c.name}</p>
                  <p className="text-[10px] text-slate-500">{c.industry}</p>
                </div>
                <button onClick={() => onUnassign(c.id)} className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-500/20 hover:text-red-300 transition-all">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {available.length > 0 && (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
          <h4 className="text-sm font-bold mb-3">Approved Companies</h4>
          <p className="text-xs text-slate-500 mb-3">Assign {recruiter.name} to a client company.</p>
          <div className="space-y-2">
            {available.map((c) => (
              <button
                key={c.id}
                onClick={() => onAssign(c.id)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left bg-slate-900/40 border border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all"
              >
                <div className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0">{initialsOf(c.name)}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{c.name}</p>
                  <p className="text-[10px] text-slate-500">{c.industry}</p>
                </div>
                <span className="text-[10px] font-bold text-sky-400">+ Assign</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CandidateAccess({
  candidate, recruiters, companies, onAssign,
}: {
  candidate: (typeof CANDIDATES)[number]; recruiters: Recruiter[]; companies: Company[];
  onAssign: (companyId: string) => void;
}) {
  // Map candidate to recruiter via department to suggest fit
  const mappedRecruiter = recruiters.find((r) => r.assignedCompanyIds.length > 0);
  const mappedCompany = mappedRecruiter ? companies.find((c) => c.id === mappedRecruiter.assignedCompanyIds[0]) : undefined;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
        <h4 className="text-sm font-bold mb-3">Current Connection</h4>
        {mappedRecruiter && mappedCompany ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: mappedRecruiter.avatar }}>
                {mappedRecruiter.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-400">Recruiter Connection</p>
                <p className="text-sm font-extrabold">{mappedRecruiter.name}</p>
                <p className="text-[10px] text-sky-400 mt-0.5">Connected via {mappedCompany.name}</p>
              </div>
              <Badge tone={statusTone(candidate.status === "On Hold" ? "Pending" : candidate.status)}>{candidate.status}</Badge>
            </div>
            <div className="flex items-center gap-2 justify-center text-slate-500">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </div>
          </div>
        ) : (
          <p className="text-xs text-slate-500">No active recruiter-company connection found for this candidate.</p>
        )}
      </div>

      {mappedCompany && (
        <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
          <h4 className="text-sm font-bold mb-3">Suggested Clients</h4>
          <p className="text-xs text-slate-500 mb-3">Based on candidate role and connected companies.</p>
          {companies.filter((c) => c.status === "Approved" && c.industry.includes(candidate.department === "Engineering" ? "SaaS" : "")).map((c) => (
            <button
              key={c.id}
              onClick={() => onAssign(c.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left bg-slate-900/40 border border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all"
            >
              <div className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0">{initialsOf(c.name)}</div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold">{c.name}</p>
                <p className="text-[10px] text-slate-500">{c.industry}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Password panel ───
function PasswordPanel({
  pw, setPw, pwSuccess, onSubmit, title, desc,
}: {
  pw: { current: string; next: string; confirm: string };
  setPw: (v: { current: string; next: string; confirm: string }) => void;
  pwSuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
  title: string; desc: string;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 flex-shrink-0">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold">{title}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
          </div>
        </div>

        {pwSuccess && (
          <div className="mb-4 rounded-lg px-3 py-2.5 text-xs font-medium flex items-start gap-2 bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
            <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            A verification email with a link to finalize the password change has been sent.
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <PwField label="New Password" value={pw.next} onChange={(v) => setPw({ ...pw, next: v })} placeholder="Minimum 6 characters" />
          <PwField label="Confirm Password" value={pw.confirm} onChange={(v) => setPw({ ...pw, confirm: v })} placeholder="Repeat new password" />
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25 transition-all"
          >
            Reset Portal Password
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-[11px] leading-relaxed text-slate-400">
        <p className="font-bold text-violet-300 mb-1">Security Tip</p>
        A strong password contains letters, numbers, and symbols. Rotating credentials every 90 days helps reduce account takeover risk.
      </div>
    </div>
  );
}

function PwField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
      <div className="relative">
        <svg viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="10" rx="2" /><path strokeLinecap="round" d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-10 pr-14 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
        />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────── Shared Helpers ───────────────────────────
function SaveOk() {
  return (
    <div className="mb-4 rounded-xl px-3 py-2.5 text-xs font-bold flex items-center gap-2 bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30 animate-fadeIn">
      <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
      Changes saved successfully.
    </div>
  );
}

function InputSimple({ label, value, type = "text", onChange }: { label: string; value: string; type?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type={type}
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-950/60 border border-slate-700/60 text-slate-100 placeholder-slate-500 outline-none focus:border-violet-500 transition-all"
      />
    </div>
  );
}

function SelectFieldShim({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-950/60 border border-slate-700/60 text-slate-100 outline-none cursor-pointer focus:border-violet-500 transition-all"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
