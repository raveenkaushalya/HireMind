import { useMemo, useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

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
  proofUrl?: string;
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
const AVATAR_COLORS = ["#d97706", "#b45309", "#eab308", "#ca8a04", "#a16207", "#10b981", "#0ea5e9", "#8b5cf6"];

// ─────────────────────────── Helpers ───────────────────────────
const initialsOf = (name: string) => name ? name.split(" ").map((n) => n[0]).join("") : "U";

const ROLE_STYLES: Record<Role, string> = {
  Admin: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
  Recruiter: "bg-sky-500/15 text-sky-400 ring-1 ring-inset ring-sky-500/30",
  "Hiring Manager": "bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30",
  Viewer: "bg-slate-500/15 text-slate-400 ring-1 ring-inset ring-slate-500/30",
};

// ─────────────────────────── Component ───────────────────────────
export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [search, setSearch] = useState("");
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [relationships] = useState<Relationship[]>([]);
  const [candidatesData, setCandidatesData] = useState<any[]>([]);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { token } = useAuth();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!token) return;

    // Fetch candidates
    fetch('/api/candidates', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCandidatesData(data.map((c: any) => ({
            id: c.id.toString(),
            name: c.name || "Unknown Candidate",
            role: c.currentJobTitle || "Applicant",
            department: "Engineering",
            seniority: c.experienceLevel || "Mid",
            source: "Company Site",
            stage: "Shortlisted",
            score: 85,
            yearsExp: 3,
            location: c.location || "Remote",
            appliedAt: new Date().toISOString(),
            shortlistedAt: new Date().toISOString(),
            daysInPipeline: 2,
            status: "Active",
            avatar: "#eab308",
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

    // Fetch companies
    fetch('/api/companies', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCompanies(data.map((c: any) => ({
            id: c.id.toString(),
            name: c.name || "Unknown Company",
            industry: c.industry || "General",
            contact: c.contactPersonName || "Unknown",
            email: c.email || "",
            status: c.status || "Pending",
            registeredAt: new Date().toISOString(),
            recruiterIds: [],
            applicantsCount: 0,
            openJobs: 0,
            website: "",
            location: c.location || "",
            size: c.size || "",
            proofUrl: c.proofDocumentsMetadataLink || c.proofUrl || c.proofDocument || ""
          })));
        }
      }).catch(console.error);

    // Fetch recruiters
    fetch('/api/recruiters', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRecruiters(data.map((r: any, i) => ({
            id: r.id.toString(),
            name: r.name || "Unknown",
            email: r.email || "",
            role: "Recruiter",
            status: r.status || "Pending",
            assignedCompanyIds: [],
            joinedAt: r.joinedDate ? new Date(r.joinedDate).toLocaleDateString() : "Recently",
            lastActive: "—",
            avatar: AVATAR_COLORS[i % AVATAR_COLORS.length],
            phone: "—",
            location: "—"
          })));
        }
      }).catch(console.error);
  }, [token]);

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

  const approveCompany = async (id: string) => {
    try {
      const res = await fetch(`/api/companies/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Company formally approved! Token for password setup: ${data.registrationToken}`);
        setCompanies((p) => p.map((c) => (c.id === id ? { ...c, status: "Approved" } : c)));
      } else {
        alert("Failed to approve company: " + await res.text());
      }
    } catch (e) {
      console.error(e);
      alert("Error approving company");
    }
  };

  const rejectCompany = async (id: string) => {
    try {
      const reason = prompt("Enter reason for rejection:");
      const res = await fetch(`/api/companies/${id}/reject`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(reason || "No reason provided")
      });
      if (res.ok) {
        setCompanies((p) => p.map((c) => (c.id === id ? { ...c, status: "Rejected" } : c)));
      } else {
        alert("Failed to reject company: " + await res.text());
      }
    } catch (e) {
      console.error(e);
      alert("Error rejecting company");
    }
  };

  const toggleRecruiterStatus = (id: string) =>
    setRecruiters((p) => p.map((r) => (r.id === id ? { ...r, status: r.status === "Active" ? "Suspended" : "Active" } : r)));

  const assignCompanyToRecruiter = (recruiterId: string, companyId: string) => {
    setRecruiters((p) =>
      p.map((r) =>
        r.id !== recruiterId
          ? r
          : r.assignedCompanyIds.includes(companyId)
            ? { ...r, assignedCompanyIds: r.assignedCompanyIds.filter((x) => x !== companyId) }
            : { ...r, assignedCompanyIds: [...r.assignedCompanyIds, companyId] }
      )
    );
    setCompanies((p) =>
      p.map((c) =>
        c.id !== companyId
          ? c
          : c.recruiterIds.includes(recruiterId)
            ? { ...c, recruiterIds: c.recruiterIds.filter((x) => x !== recruiterId) }
            : { ...c, recruiterIds: [...c.recruiterIds, recruiterId] }
      )
    );
  };

  const addRecruiter = async () => {
    if (!recruiterForm.name || !recruiterForm.email) return;

    try {
      const res = await fetch('/api/recruiters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: recruiterForm.name,
          email: recruiterForm.email,
          status: 'Pending'
        })
      });

      if (res.ok) {
        const backendRec = await res.json();
        const newRec: Recruiter = {
          id: backendRec.id.toString(),
          name: backendRec.name,
          email: backendRec.email,
          role: recruiterForm.role,
          status: backendRec.status || 'Pending',
          assignedCompanyIds: recruiterForm.companyId ? [recruiterForm.companyId] : [],
          joinedAt: backendRec.joinedDate ? new Date(backendRec.joinedDate).toLocaleDateString() : new Date().toLocaleDateString(),
          lastActive: "—",
          avatar: AVATAR_COLORS[recruiters.length % AVATAR_COLORS.length],
          phone: "—",
          location: "—",
        };
        setRecruiters((p) => [...p, newRec]);
        if (recruiterForm.companyId) {
          setCompanies((p) => p.map((c) => c.id === recruiterForm.companyId ? { ...c, recruiterIds: [...c.recruiterIds, newRec.id] } : c));
        }
        setEmailSent(newRec.email);
        setRecruiterForm({ name: "", email: "", role: "Recruiter", companyId: "" });
        setTimeout(() => {
          setShowAddRecruiter(false);
          setEmailSent(null);
        }, 3200);
      } else {
        const errorText = await res.text();
        alert("Failed to add recruiter: " + errorText);
      }
    } catch (e: any) {
      console.error(e);
      alert("Error adding recruiter: " + e.message);
    }
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
  const activeCandidate = panel.type === "candidate" ? candidatesData.find((c) => c.id === panel.id) : undefined;
  const filteringSearch = search.toLowerCase();

  // ─────────────────────────── Render ───────────────────────────
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100 transition-colors duration-300">
      {/* Ambient gold glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-amber-500/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-yellow-600/10 blur-[100px]" />
      </div>

      {/* Top navigation */}
      <div className="sticky top-0 z-30 relative flex items-center justify-between gap-4 h-14 px-4 sm:px-6 border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-xl">
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tab === t.id
                ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-950 shadow-lg shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border border-slate-800 hover:bg-slate-800/60 transition-all cursor-pointer"
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-amber-950 bg-gradient-to-br from-amber-400 to-yellow-600 shadow-md flex-shrink-0">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold leading-tight text-slate-200">System Admin</p>
              <p className="text-[10px] text-slate-500 leading-tight">admin@hireminds.co</p>
            </div>
            <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800/80 bg-slate-900/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn">
              <div className="px-3 py-2 border-b border-slate-800/60 mb-1">
                <p className="text-xs font-bold text-slate-200">System Admin</p>
                <p className="text-[10px] text-slate-500 truncate">admin@hireminds.co</p>
              </div>
              <button
                onClick={() => {
                  setProfileDropdownOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile tabs strip */}
      <div className="sm:hidden relative z-10 border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-xl px-4 py-1.5">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tab === t.id ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-950" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <main className="relative z-10 px-4 sm:px-6 py-6 max-w-[1280px] mx-auto space-y-6">

        {/* ═════════ Overview ═════════ */}
        {tab === "overview" && (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 backdrop-blur-md">
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-20 bg-amber-500" />
              <h2 className="text-2xl font-extrabold tracking-tight">System Administration</h2>
              <p className="text-sm mt-1 text-slate-400">Central hub for candidate management, recruiter assignments, and company onboarding.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Role-Based Access", "Portal Emails", "Approval Workflows", "Activity Trail"].map((tag) => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-300">{tag}</span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlowStat label="Total Candidates" value={candidatesData.length} color="#eab308" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" /><path strokeLinecap="round" d="M16 3.13a4 4 0 010 7.75M21 21v-1a5 5 0 00-3-4.58" /></svg>} />
              <GlowStat label="Active Recruiters" value={activeRecruiters} color="#0ea5e9" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2a3 3 0 00-5.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2a3 3 0 015.356-1.857m0 0a5 5 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
              <GlowStat label="Pending Companies" value={pendingCompanies} color="#d97706" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" /></svg>} />
              <GlowStat label="Active Relations" value={activeRelations} color="#10b981" icon={<svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>} />
            </div>

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
                    <th className="py-3 px-4 text-left">Candidate</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-left">Location</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatesData.filter((c) => {
                    if (!filteringSearch) return true;
                    return c.name.toLowerCase().includes(filteringSearch) || c.role.toLowerCase().includes(filteringSearch);
                  }).slice(0, 15).map((c) => (
                    <tr key={c.id} className="border-b last:border-none border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold text-amber-950 shadow-sm" style={{ background: c.avatar }}>
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
                        <button onClick={() => openPanel("candidate", c.id)} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/15 text-amber-300 hover:bg-amber-500/30 transition-all cursor-pointer">
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
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Recruiter
              </button>
            </div>

            {showAddRecruiter && (
              <div className="rounded-2xl border border-amber-500/40 bg-slate-900/70 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold">Invite New Recruiter</h4>
                  <button onClick={() => setShowAddRecruiter(false)} className="text-xs text-slate-500 hover:text-slate-300">Cancel</button>
                </div>
                {emailSent && (
                  <div className="mb-4 rounded-lg px-3 py-2.5 text-xs font-medium flex items-start gap-2 bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 8c0-2.8-2.2-5-5-5H7C4.2 3 2 5.2 2 8v8c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V8z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2 8l10 6 10-6" />
                    </svg>
                    <span>Verification email sent to {emailSent}. The invite link lets them create their portal account.</span>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <InputField label="Full Name" value={recruiterForm.name} onChange={(v) => setRecruiterForm({ ...recruiterForm, name: v })} placeholder="Ava Johnson" />
                  <InputField label="Work Email" value={recruiterForm.email} onChange={(v) => setRecruiterForm({ ...recruiterForm, email: v })} placeholder="ava.j@hireminds.co" type="email" />
                  <SelectField label="Assign to Client Company" value={recruiterForm.companyId} onChange={(v) => setRecruiterForm({ ...recruiterForm, companyId: v })} options={["", ...companies.filter(c => c.status !== "Rejected").map(c => c.id)]} formatOption={(id) => id === "" ? "Unassigned" : companies.find(c => c.id === id)?.name ?? id} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <button onClick={addRecruiter} className="px-4 py-2 rounded-lg text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-md shadow-amber-500/25 transition-all cursor-pointer">
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
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center text-base font-bold text-amber-950 shadow-md flex-shrink-0" style={{ background: r.avatar }}>
                      {initialsOf(r.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold">{r.name}</p>
                      </div>
                      <p className="text-xs mt-0.5 text-slate-400">{r.email}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <Badge tone={statusTone(r.status)}>{r.status}</Badge>
                        <span className="text-[10px] text-slate-500">Joined {new Date(r.joinedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
                        <span className="text-[10px] text-slate-500">· {r.location}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex gap-1.5">
                      <button onClick={() => toggleRecruiterStatus(r.id)} className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${r.status === "Active" ? "bg-amber-500/15 text-amber-400 hover:bg-amber-500/25" : "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"}`}>
                        {r.status === "Active" ? "Suspend" : "Activate"}
                      </button>
                      <button onClick={() => openPanel("recruiter", r.id)} className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all cursor-pointer">Manage</button>
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
                          <span key={cid} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/20 hover:bg-amber-500/20 transition-all group">
                            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" /></svg>
                            {comp.name}
                            <button
                              onClick={() => assignCompanyToRecruiter(r.id, cid)}
                              title="Remove assignment"
                              className="h-3.5 w-3.5 rounded-full flex items-center justify-center transition-all hover:bg-red-500/30 hover:text-red-300 cursor-pointer"
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
                              assignCompanyToRecruiter(r.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg text-xs outline-none cursor-pointer bg-slate-950/60 border border-slate-800 text-slate-100 focus:border-amber-500"
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
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${companyStatusFilter === s
                      ? s === "Approved" ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
                        : s === "Pending" ? "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30"
                          : s === "Rejected" ? "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30"
                            : "bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-950 shadow-lg shadow-amber-500/20"
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
                <div key={c.id} className="relative rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-700 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    {/* Top row: Avatar & Company Info + Top-Right Actions (Proof Doc + Badge) */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold text-amber-950 shadow-md bg-gradient-to-br from-amber-500 to-yellow-600 flex-shrink-0">
                          {initialsOf(c.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold truncate pr-2">{c.name}</p>
                          <p className="text-[10px] text-slate-500">{c.industry}</p>
                          <p className="text-[10px] text-slate-500">{c.email}</p>
                        </div>
                      </div>

                      {/* Top Right Section: Transparent Blue Proof Doc + Status Badge */}
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <Badge tone={statusTone(c.status)}>{c.status}</Badge>
                        {c.proofUrl && (
                          <a
                            href={c.proofUrl}
                            target="_blank"
                            rel="noreferrer"
                            title="Download Verification Proof Document"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 border border-sky-500/20 transition-all cursor-pointer shadow-sm"
                          >
                            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Proof Doc
                          </a>
                        )}
                      </div>
                    </div>

                    {recruiters.filter((r) => r.status === "Active" && !c.recruiterIds.includes(r.id)).length > 0 && (
                      <div className="mt-4 relative flex-1 min-w-[130px]">
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              assignCompanyToRecruiter(e.target.value, c.id);
                            }
                          }}
                          className="w-full px-2.5 py-1 rounded-lg text-xs outline-none cursor-pointer bg-slate-950/60 border border-slate-800 text-slate-100 focus:border-amber-500"
                        >
                          <option value="">+ Assign recruiter</option>
                          {recruiters.filter((r) => r.status === "Active" && !c.recruiterIds.includes(r.id)).map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openPanel("company", c.id)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 transition-all cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" /></svg>
                      Full Details &amp; Management
                    </button>
                    {c.status === "Pending" && (
                      <div className="flex gap-1.5">
                        <button onClick={() => approveCompany(c.id)} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-all cursor-pointer">✓ Approve</button>
                        <button onClick={() => rejectCompany(c.id)} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all cursor-pointer">✕ Reject</button>
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
          onAssignCompany={(cid, rid) => assignCompanyToRecruiter(rid, cid)}
          onUnassignCompany={(cid, rid) => assignCompanyToRecruiter(rid, cid)}
        />
      )}

      <footer className="mt-10 text-center text-xs text-slate-500 pb-4">
      HireMinds · Admin Portal
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════
//                                SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════════

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

function Badge({ children, tone = "slate" }: { children: React.ReactNode; tone?: "slate" | "violet" | "emerald" | "amber" | "red" | "sky" | "rose" | "teal" | "pink" }) {
  const tones: Record<string, string> = {
    slate: "bg-slate-500/15 text-slate-300 ring-1 ring-inset ring-slate-500/30",
    violet: "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
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
  if (s === "Pending" || s === "On Hold") return "amber";
  if (s === "Rejected") return "red";
  if (s === "Suspended") return "rose";
  if (s === "Technical" || s === "Onsite") return "amber";
  if (s === "Offer") return "pink";
  if (s === "Phone Screen") return "sky";
  return "slate";
};

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
        className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-amber-500 transition-colors"
      />
    </div>
  );
}

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
  const roleColors: Record<Role, string> = { Admin: "#eab308", "Hiring Manager": "#10b981", Recruiter: "#0ea5e9", Viewer: "#64748b" };

  return (
    <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 backdrop-blur-md">
      <h3 className="text-sm font-bold mb-3">Access Control Summary</h3>
      <div className="space-y-2">
        {rolesData.map((r) => (
          <button
            key={r.role}
            onClick={() => r.clickable && onOpenRecruiter(recruiters.find((x) => x.role === r.role && x.status === "Active")?.id ?? recruiters[0]?.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all hover:brightness-125 cursor-pointer ${r.clickable ? "bg-slate-950/60 border border-slate-800 hover:border-slate-600" : "bg-slate-900/40 border border-transparent"}`}
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
              <div className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-amber-950 bg-gradient-to-br from-amber-500 to-yellow-600 flex-shrink-0 shadow-lg shadow-amber-500/20">
                {initialsOf(c.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold truncate">{c.name}</p>
                <p className="text-[10px] text-amber-400/80">{c.industry} · {c.contact}</p>
              </div>
              <div className="flex gap-1">
                <button onClick={() => onApprove(c.id)} className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-[10px] font-bold hover:bg-emerald-500/25 cursor-pointer">✓ Approve</button>
                <button onClick={() => onReject(c.id)} className="px-2 py-1 rounded-lg bg-red-500/15 text-red-400 text-[10px] font-bold hover:bg-red-500/25 cursor-pointer">✕ Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const INPUT_CLS = "w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-slate-950/60 border border-slate-700/60 text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all";
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
//                            ENTITY DETAIL PANEL (MODAL)
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
  candidate?: any;
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
    ...(type === "recruiter" ? [{ id: "password" as const, label: "Password", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.74 5.74 6 6 0 11-9-9A6 6 0 0119 5l-1.1-1.1a2 2 0 00-1.4-.58h-1a2 2 0 00-2 2v1a2 2 0 002 2h1a2 2 0 002-2z" /><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" /></svg> }] : []),
  ];

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />

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
            <button onClick={onClose} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 transition-colors cursor-pointer">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Tab bar */}
          <div className="flex gap-1 px-5 py-2 border-b border-slate-800/60 bg-slate-900/60 flex-shrink-0">
            {panelTabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setPanelTab(t.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${panelTab === t.id
                  ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-amber-950 shadow-lg shadow-amber-500/20"
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

            {/* Company panel */}
            {type === "company" && company && (
              <>
                {panelTab === "overview" && (
                  <>
                    <CompanyOverview company={company} recruiters={recruiters} />
                    {company.status === "Pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => onApproveCompany(company.id)} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          Approve Registration
                        </button>
                        <button onClick={() => onRejectCompany(company.id)} className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-lg shadow-rose-500/20 transition-all cursor-pointer">
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
              </>
            )}

            {/* Recruiter panel */}
            {type === "recruiter" && recruiter && (
              <>
                {panelTab === "overview" && (
                  <>
                    <RecruiterOverview recruiter={recruiter} />
                    <button
                      onClick={() => onToggleRecruiterStatus(recruiter.id)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${recruiter.status === "Active" ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg shadow-amber-500/20" : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/20"}`}
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
                    title="Reset Recruiter Password" desc="As an admin, you can reset this recruiter's portal password."
                  />
                )}
              </>
            )}

            {/* Candidate panel */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────── Detail Sub-Views ───────────────────────────

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
        {/* Header section with Top Right Proof Doc Button */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-4 min-w-0">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-amber-950 bg-gradient-to-br from-amber-500 to-yellow-600 flex-shrink-0 shadow-lg shadow-amber-500/20">
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

          {/* Top Right Transparent Blue Download Proof Doc Button */}
          {company.proofUrl && (
            <a
              href={company.proofUrl}
              target="_blank"
              rel="noreferrer"
              title="Download Verification Proof Document"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 border border-sky-500/20 transition-all flex-shrink-0 shadow-sm"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Proof Doc
            </a>
          )}
        </div>

        <div className="mt-5 space-y-0.5">
          <InfoItem label="Industry">{company.industry}</InfoItem>
          <InfoItem label="Primary Contact">{company.contact}</InfoItem>
          <InfoItem label="Email">{company.email}</InfoItem>
          <InfoItem label="Location">{company.location || "—"}</InfoItem>
          <InfoItem label="Size">{company.size || "—"}</InfoItem>
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
          <p className="text-base font-extrabold mt-1.5 text-slate-300">{company.size.split(" ")[0] || "—"}</p>
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
          className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-950/60 border border-slate-700/60 text-slate-100 outline-none focus:border-amber-500 transition-all"
        />
      </div>
      <SelectFieldShim
        label="Industry"
        value={edit.industry ?? ""}
        options={[
          'IT & Technology', 'Engineering', 'Healthcare & Pharma', 'Education',
          'Banking & Finance', 'Human Resources', 'Design & Marketing',
          'Logistics & Supply Chain', 'Apparel & Manufacturing', 'Hospitality & Tourism', 'Other'
        ]}
        onChange={(v) => setEdit({ ...edit, industry: v })}
      />
      <InputSimple label="Primary Contact" value={edit.contact ?? ""} onChange={(v) => setEdit({ ...edit, contact: v })} />
      <InputSimple label="Email" value={edit.email ?? ""} type="email" onChange={(v) => setEdit({ ...edit, email: v })} />
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
        <button onClick={onSave} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-lg shadow-amber-500/25 transition-all cursor-pointer">
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
      <InputSimple label="Phone" value={edit.phone ?? ""} onChange={(v) => setEdit({ ...edit, phone: v })} />
      <SelectFieldShim label="Status" value={edit.status ?? "Active"} options={["Active", "Pending", "Suspended"]} onChange={(v) => setEdit({ ...edit, status: v })} />
      <div className="flex gap-2 pt-2">
        <button onClick={onSave} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-lg shadow-amber-500/25 transition-all cursor-pointer">
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
        <button onClick={onSave} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-lg shadow-amber-500/25 transition-all cursor-pointer">
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
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-amber-950 flex-shrink-0 shadow-lg" style={{ background: recruiter.avatar }}>
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
          <InfoItem label="Joined">{new Date(recruiter.joinedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</InfoItem>
          <InfoItem label="Last Active">{recruiter.lastActive}</InfoItem>
          <InfoItem label="Client Companies">
            {recruiter.assignedCompanyIds.length === 0
              ? <span className="text-slate-500">None</span>
              : recruiter.assignedCompanyIds.map((cid) => `CMP-${cid.split("-")[1] ?? cid}`).join(", ")
            }
          </InfoItem>
        </div>
      </div>
    </div>
  );
}

function CandidateOverview({ candidate }: { candidate: any }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-amber-950 flex-shrink-0 shadow-md" style={{ background: candidate.avatar }}>
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
                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold text-amber-950 flex-shrink-0" style={{ background: r.avatar }}>
                  {initialsOf(r.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{r.name}</p>
                  <p className="text-[10px] text-slate-500">{r.email}</p>
                </div>
                <button onClick={() => onUnassign(r.id)} className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer">
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left bg-slate-900/40 border border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all cursor-pointer"
              >
                <div className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold text-amber-950 flex-shrink-0" style={{ background: r.avatar }}>
                  {initialsOf(r.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{r.name}</p>
                  <p className="text-[10px] text-slate-500">{r.role}</p>
                </div>
                <span className="text-[10px] font-bold text-amber-400">+ Assign</span>
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
                <div className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-amber-950 bg-gradient-to-br from-amber-500 to-yellow-600 flex-shrink-0">{initialsOf(c.name)}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{c.name}</p>
                  <p className="text-[10px] text-slate-500">{c.industry}</p>
                </div>
                <button onClick={() => onUnassign(c.id)} className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-red-500/20 hover:text-red-300 transition-all cursor-pointer">
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
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left bg-slate-900/40 border border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all cursor-pointer"
              >
                <div className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-amber-950 bg-gradient-to-br from-amber-500 to-yellow-600 flex-shrink-0">{initialsOf(c.name)}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{c.name}</p>
                  <p className="text-[10px] text-slate-500">{c.industry}</p>
                </div>
                <span className="text-[10px] font-bold text-amber-400">+ Assign</span>
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
  candidate: any; recruiters: Recruiter[]; companies: Company[];
  onAssign: (companyId: string) => void;
}) {
  const mappedRecruiter = recruiters.find((r) => r.assignedCompanyIds.length > 0);
  const mappedCompany = mappedRecruiter ? companies.find((c) => c.id === mappedRecruiter.assignedCompanyIds[0]) : undefined;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-800/60 bg-slate-950/60 p-5">
        <h4 className="text-sm font-bold mb-3">Current Connection</h4>
        {mappedRecruiter && mappedCompany ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center text-sm font-bold text-amber-950 flex-shrink-0" style={{ background: mappedRecruiter.avatar }}>
                {initialsOf(mappedRecruiter.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-400">Recruiter Connection</p>
                <p className="text-sm font-extrabold">{mappedRecruiter.name}</p>
                <p className="text-[10px] text-amber-400 mt-0.5">Connected via {mappedCompany.name}</p>
              </div>
              <Badge tone={statusTone(candidate.status === "On Hold" ? "Pending" : candidate.status)}>{candidate.status}</Badge>
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left bg-slate-900/40 border border-slate-700/40 hover:bg-slate-800/60 hover:border-slate-600 transition-all cursor-pointer"
            >
              <div className="h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold text-amber-950 bg-gradient-to-br from-amber-500 to-yellow-600 flex-shrink-0">{initialsOf(c.name)}</div>
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
          <div className="h-11 w-11 rounded-xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-yellow-600 text-amber-950 shadow-lg shadow-amber-500/25 flex-shrink-0 font-bold">
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
            Password reset request completed successfully.
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <PwField label="New Password" value={pw.next} onChange={(v) => setPw({ ...pw, next: v })} placeholder="Minimum 6 characters" />
          <PwField label="Confirm Password" value={pw.confirm} onChange={(v) => setPw({ ...pw, confirm: v })} placeholder="Repeat new password" />
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-xs font-bold text-amber-950 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
          >
            Reset Portal Password
          </button>
        </form>
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
          className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-10 pr-14 py-3 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
        />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

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
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-950/60 border border-slate-700/60 text-slate-100 placeholder-slate-500 outline-none focus:border-amber-500 transition-all"
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
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-950/60 border border-slate-700/60 text-slate-100 outline-none cursor-pointer focus:border-amber-500 transition-all"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}