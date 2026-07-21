import { useMemo, useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

interface Props {
  onLogout: () => void;
}

type HmStatus = "Active" | "Pending Approval" | "Rejected" | "Suspended";
type Tab = "overview" | "profile" | "hiring_managers";

interface HiringManager {
  id: string;
  name: string;
  email: string;
  department: string;
  status: HmStatus;
  addedAt: string;
  lastActive: string;
  avatar: string;
  openJobs: number;
  activeCandidates: number;
}

const AVATAR_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e", "#f59e0b", "#10b981", "#14b8a6", "#0ea5e9"];

const HM_STATUS_STYLE: Record<HmStatus, string> = {
  "Active": "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30",
  "Pending Approval": "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30",
  "Rejected": "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30",
  "Suspended": "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30",
};

const DEPARTMENTS = ["Engineering", "Design", "Product", "Marketing", "Sales", "Operations", "Data"];

export default function CompanyDashboard({ onLogout }: Props) {
  const { userId, token } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [hms, setHms] = useState<HiringManager[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedHm, setSelectedHm] = useState<HiringManager | null>(null);
  const [statusFilter, setStatusFilter] = useState<"All" | HmStatus>("All");
  const [search, setSearch] = useState("");
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<number | null>(null);

  const [addForm, setAddForm] = useState({ name: "", email: "", department: "Engineering" });

  // Company profile (editable)
  const [profile, setProfile] = useState({
    name: "Loading...",
    industry: "",
    size: "",
    website: "",
    location: "",
    email: "",
    contact: "",
    phone: "",
    founded: "",
    description: "",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [profileEdit, setProfileEdit] = useState(profile);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/companies/by-user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.id) {
          setCompanyId(data.id);
          const loadedProfile = {
            name: data.name || "",
            industry: data.industry || "",
            size: data.size || "",
            website: "", // Not backed by DB
            location: data.location || "",
            email: data.email || "",
            contact: data.contactPersonName || "",
            phone: data.contactPersonNumber || "",
            founded: "", // Not backed by DB
            description: data.description || "",
          };
          setProfile(loadedProfile);
          setProfileEdit(loadedProfile);
        }
      })
      .catch(console.error);
  }, [userId, token]);

  useEffect(() => {
    if (!companyId) return;

    fetch(`/api/hiring-managers/by-company/${companyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          setHms(data.map((hm, i) => ({
            id: hm.id.toString(),
            name: hm.name || "",
            email: hm.email || "",
            department: hm.department || "Engineering",
            status: "Active", // Mocked as it's not in DB
            addedAt: hm.joinedDate ? hm.joinedDate.split('T')[0] : new Date().toISOString().split('T')[0],
            lastActive: "—",
            avatar: AVATAR_COLORS[i % AVATAR_COLORS.length],
            openJobs: 0,
            activeCandidates: 0
          })));
        }
      })
      .catch(console.error);
  }, [companyId, token]);

  const stats = useMemo(() => ({
    total: hms.length,
    active: hms.filter((h) => h.status === "Active").length,
    pending: hms.filter((h) => h.status === "Pending Approval").length,
    openJobs: hms.reduce((s, h) => s + h.openJobs, 0),
    activeCandidates: hms.reduce((s, h) => s + h.activeCandidates, 0),
  }), [hms]);

  const filteredHms = useMemo(() => {
    return hms.filter((h) => {
      if (statusFilter !== "All" && h.status !== statusFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return h.name.toLowerCase().includes(s) || h.email.toLowerCase().includes(s) || h.department.toLowerCase().includes(s);
      }
      return true;
    });
  }, [hms, statusFilter, search]);

  const addHm = async () => {
    if (!addForm.name || !addForm.email || !companyId || !userId) return;
    try {
      const res = await fetch(`/api/hiring-managers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: addForm.name,
          email: addForm.email,
          department: addForm.department,
          companyId: companyId,
          userId: userId // Typically they would have their own login, but passing valid required keys
        })
      });

      if (res.ok) {
        const data = await res.json();
        const newHm: HiringManager = {
          id: data.id.toString(),
          name: data.name,
          email: data.email,
          department: data.department || "Engineering",
          status: "Active",
          addedAt: new Date().toISOString().slice(0, 10),
          lastActive: "—",
          avatar: AVATAR_COLORS[hms.length % AVATAR_COLORS.length],
          openJobs: 0,
          activeCandidates: 0,
        };
        setHms((p) => [...p, newHm]);
        setEmailSent(addForm.email);
        setAddForm({ name: "", email: "", department: "Engineering" });
        setTimeout(() => { setShowAdd(false); setEmailSent(null); }, 3200);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeHm = async (id: string) => {
    try {
      const res = await fetch(`/api/hiring-managers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setHms((p) => p.filter((h) => h.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHmStatus = (id: string) => {
    // DB doesn't have status, updating locally only for demo
    setHms((p) => p.map((h) => h.id === id ? { ...h, status: h.status === "Active" ? "Suspended" : "Active" } : h));
  }

  const saveProfile = async () => {
    if (!companyId) return;
    try {
      const res = await fetch(`/api/companies/${companyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: profileEdit.name,
          industry: profileEdit.industry,
          size: profileEdit.size,
          location: profileEdit.location,
          email: profileEdit.email,
          contactPersonName: profileEdit.contact,
          contactPersonNumber: profileEdit.phone,
          description: profileEdit.description,
          userId: userId
        })
      });

      if (res.ok) {
        setProfile(profileEdit);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg> },
    { id: "profile", label: "Company Profile", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16m-10 0v-4a2 2 0 012-2h4a2 2 0 012 2v4" /></svg> },
    { id: "hiring_managers", label: "Hiring Managers", icon: <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="7" r="4" /><path strokeLinecap="round" d="M2 21v-1a5 5 0 015-5h4a5 5 0 015 5v1" /><path strokeLinecap="round" d="M16 3.13a4 4 0 010 7.75M21 21v-1a5 5 0 00-3-4.58" /></svg> },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-100 transition-colors duration-300">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-teal-600/10 blur-[100px]" />
      </div>

      {/* Top nav */}
      <div className="sticky top-0 z-30 relative z-10 flex items-center justify-between gap-4 h-14 px-4 sm:px-6 border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <span className="text-base font-extrabold tracking-tight">
            <span className="text-white">Hire</span><span style={{ color: "#eab308" }}>Minds</span><span className="text-red-500">.</span>
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${tab === t.id
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
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
            <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-indigo-600 to-violet-600 shadow-md flex-shrink-0">
              {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-xs font-semibold leading-tight text-slate-200">{profile.contact}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{profile.email}</p>
            </div>
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="flex sm:hidden items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
              {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
          </div>
          <button onClick={onLogout} className="h-8 px-3 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/60 transition-colors">
            Logout
          </button>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="sm:hidden relative z-10 border-b border-slate-800/60 bg-slate-900/60 backdrop-blur-xl px-4 py-1.5">
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all ${tab === t.id ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white" : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                }`}
            >
              {t.icon}
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="relative z-10 px-4 sm:px-6 py-6 max-w-[1280px] mx-auto space-y-6 animate-fadeIn">

        {/* ═════════ OVERVIEW ═════════ */}
        {tab === "overview" && (
          <>
            <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 backdrop-blur-md">
              <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl opacity-20 bg-indigo-500" />
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="h-16 w-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 ring-2 ring-slate-800/80">
                      {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-md bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Welcome back</p>
                    <h2 className="text-2xl font-extrabold tracking-tight mt-0.5">{profile.name}</h2>
                    <p className="text-sm mt-1 text-slate-400">Manage your company profile and hiring managers</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-800/60">
                  {[profile.industry, profile.size, profile.location].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 text-slate-300">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Hiring Managers" value={stats.total} color="#6366f1" />
              <StatCard label="Active Managers" value={stats.active} color="#10b981" />
              <StatCard label="Pending Approval" value={stats.pending} color="#f59e0b" />
              <StatCard label="Open Positions" value={stats.openJobs} color="#0ea5e9" />
            </div>

            {/* Pending approvals notice */}
            {stats.pending > 0 && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-500/20 text-amber-400 flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M5.07 19H18.93a2 2 0 001.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16a2 2 0 001.73 3z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-amber-300">
                      {stats.pending} hiring manager{stats.pending !== 1 ? "s" : ""} pending admin approval
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">These managers were added by you and are awaiting HireMinds admin review. Once approved, they'll receive an email to set up their portal password.</p>
                    <button
                      onClick={() => { setTab("hiring_managers"); setStatusFilter("Pending Approval"); }}
                      className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 transition-colors"
                    >
                      Review pending managers
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Managers Preview */}
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between p-4 border-b border-slate-800/60">
                <h3 className="text-sm font-bold">Recent Hiring Managers</h3>
                <button onClick={() => setTab("hiring_managers")} className="text-[11px] font-bold text-indigo-300 hover:text-indigo-200 transition-colors">
                  View all →
                </button>
              </div>
              <div>
                {hms.slice(0, 4).map((h) => (
                  <div key={h.id} className="flex items-center gap-3 px-4 py-3 border-b last:border-none border-slate-800/50 hover:bg-slate-900/40 transition-colors">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm flex-shrink-0" style={{ background: h.avatar }}>
                      {h.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold truncate">{h.name}</p>
                      <p className="text-[10px] text-slate-500">{h.department} · {h.email}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${HM_STATUS_STYLE[h.status]}`}>{h.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═════════ COMPANY PROFILE ═════════ */}
        {tab === "profile" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">Company Profile</h2>
                <p className="text-xs text-slate-500">Update your company information visible to recruiters and candidates.</p>
              </div>
            </div>

            {profileSaved && (
              <div className="rounded-xl px-3 py-2.5 text-xs font-bold flex items-center gap-2 bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                Company profile saved successfully.
              </div>
            )}

            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 backdrop-blur-md">
              <div className="flex items-center gap-5 mb-6 pb-6 border-b border-slate-800/60">
                <div className="relative flex-shrink-0">
                  <div className="h-20 w-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white bg-gradient-to-br from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/25 ring-2 ring-slate-700/60">
                    {profile.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30">
                    <p className="text-[9px] font-bold text-emerald-300 uppercase tracking-wider">Active</p>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-extrabold">{profile.name}</h3>
                  <p className="text-sm text-slate-400 mt-1">{profile.industry} · {profile.location}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                      Founded {profile.founded}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M22 8c0-2.8-2.2-5-5-5H7C4.2 3 2 5.2 2 8v8c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V8z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 8l10 6 10-6" />
                      </svg>
                      {profile.email}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8M16 10l-4-4-4 4" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" />
                      </svg>
                      {profile.size}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileInput label="Company Name" value={profileEdit.name} onChange={(v) => setProfileEdit({ ...profileEdit, name: v })} />
                <ProfileSelect label="Industry" value={profileEdit.industry} onChange={(v) => setProfileEdit({ ...profileEdit, industry: v })}
                  options={["Enterprise SaaS", "AI Infrastructure", "Content Platform", "HealthTech", "FinTech", "E-commerce", "Manufacturing", "Consulting"]} />
                <ProfileSelect label="Company Size" value={profileEdit.size} onChange={(v) => setProfileEdit({ ...profileEdit, size: v })}
                  options={["1-50 employees", "51-200 employees", "201-500 employees", "501-1000 employees", "1000+ employees"]} />
                <ProfileSelect label="Location" value={profileEdit.location} onChange={(v) => setProfileEdit({ ...profileEdit, location: v })}
                  options={["Remote · US", "Remote · EU", "New York, NY", "San Francisco, CA", "Austin, TX", "London, UK", "Berlin, DE", "Toronto, CA", "Bangalore, IN", "Singapore, SG"]} />
                <ProfileInput label="Website" value={profileEdit.website} onChange={(v) => setProfileEdit({ ...profileEdit, website: v })} />
                <ProfileInput label="Contact Email" value={profileEdit.email} onChange={(v) => setProfileEdit({ ...profileEdit, email: v })} type="email" />
                <ProfileInput label="Primary Contact Person" value={profileEdit.contact} onChange={(v) => setProfileEdit({ ...profileEdit, contact: v })} />
                <ProfileInput label="Contact Phone" value={profileEdit.phone} onChange={(v) => setProfileEdit({ ...profileEdit, phone: v })} />
              </div>

              <div className="mt-4">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Description</label>
                <textarea
                  value={profileEdit.description}
                  onChange={(e) => setProfileEdit({ ...profileEdit, description: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3.5 py-3 text-sm text-slate-100 outline-none transition-all focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 mt-6">
                <button
                  onClick={() => setProfileEdit(profile)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:bg-slate-800/60 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={saveProfile}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═════════ HIRING MANAGERS ═════════ */}
        {tab === "hiring_managers" && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Hiring Managers</h2>
                <p className="text-xs text-slate-500">Add hiring managers to your team. All additions go to admin for approval before they can log in.</p>
              </div>
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Add Hiring Manager
              </button>
            </div>

            {/* Status filter tabs */}
            <div className="flex gap-1.5 flex-wrap">
              {(["All", "Active", "Pending Approval", "Suspended", "Rejected"] as const).map((s) => {
                const count = s === "All" ? hms.length : hms.filter((h) => h.status === s).length;
                return (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${statusFilter === s
                        ? s === "Active" ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
                          : s === "Pending Approval" ? "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30"
                            : s === "Rejected" ? "bg-red-500/15 text-red-300 ring-1 ring-inset ring-red-500/30"
                              : s === "Suspended" ? "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30"
                                : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                      }`}
                  >
                    {s}
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${statusFilter === s ? "bg-white/10" : "bg-slate-800"}`}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative max-w-[300px]">
              <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="M21 21l-4.3-4.3" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hiring managers…"
                className="w-full pl-9 pr-3 py-2 rounded-lg text-sm outline-none bg-slate-950/60 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* HM grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredHms.map((h) => (
                <div key={h.id} className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-slate-700 backdrop-blur-md">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl flex items-center justify-center text-base font-bold text-white shadow-md flex-shrink-0" style={{ background: h.avatar }}>
                      {h.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">{h.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{h.email}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${HM_STATUS_STYLE[h.status]}`}>{h.status}</span>
                        <span className="text-[10px] text-slate-500">{h.department}</span>
                      </div>
                    </div>
                  </div>

                  {h.status === "Active" && (
                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-800/60">
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-indigo-400">{h.openJobs}</p>
                        <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mt-0.5">Open Jobs</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-extrabold text-emerald-400">{h.activeCandidates}</p>
                        <p className="text-[9px] uppercase tracking-wider font-bold text-slate-500 mt-0.5">Candidates</p>
                      </div>
                    </div>
                  )}

                  {h.status === "Pending Approval" && (
                    <div className="mt-4 pt-4 border-t border-slate-800/60 rounded-lg bg-amber-500/5 p-3 -mx-1">
                      <p className="text-[11px] text-amber-300 font-medium leading-relaxed">
                        <span className="font-bold">Awaiting admin review.</span> Once HireMinds admin approves this manager, they'll receive an email to create their portal password and log in.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 mt-4">
                    <p className="text-[10px] text-slate-500">Added {new Date(h.addedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setSelectedHm(h)}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all"
                      >
                        View
                      </button>
                      {h.status === "Active" && (
                        <button
                          onClick={() => toggleHmStatus(h.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 transition-all"
                        >
                          Suspend
                        </button>
                      )}
                      {h.status === "Suspended" && (
                        <button
                          onClick={() => toggleHmStatus(h.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 transition-all"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => removeHm(h.id)}
                        className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {filteredHms.length === 0 && (
                <div className="col-span-full py-12 text-center rounded-2xl border border-slate-800/60 bg-slate-900/60 text-slate-500">
                  <p className="text-sm font-bold">No hiring managers match your filters.</p>
                  <p className="text-xs mt-1">Try adjusting the search or status filter.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ═══════════════════ ADD HIRING MANAGER MODAL ═══════════════════ */}
      {showAdd && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-md rounded-2xl border border-slate-800/60 bg-slate-900/98 shadow-2xl backdrop-blur-xl animate-fadeIn">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
                <div>
                  <h3 className="text-base font-bold">Add Hiring Manager</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Submit a new hiring manager for admin approval.</p>
                </div>
                <button onClick={() => setShowAdd(false)} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800/60 transition-colors">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-5">
                {emailSent && (
                  <div className="mb-4 rounded-lg px-3 py-2.5 text-xs font-medium flex items-start gap-2 bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    <span>Submitted! {emailSent} has been queued for admin approval. Once approved, they'll receive an email to set their password.</span>
                  </div>
                )}
                <div className="space-y-4">
                  <ProfileInput label="Full Name" value={addForm.name} onChange={(v) => setAddForm({ ...addForm, name: v })} placeholder="Elena Fischer" />
                  <ProfileInput label="Work Email" value={addForm.email} onChange={(v) => setAddForm({ ...addForm, email: v })} placeholder="elena.f@vertexsys.io" type="email" />
                  <ProfileSelect label="Department" value={addForm.department} onChange={(v) => setAddForm({ ...addForm, department: v })} options={DEPARTMENTS} />
                </div>

                <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-[11px] text-amber-300 leading-relaxed">
                  <span className="font-bold">Next steps:</span> After submission, this hiring manager will appear in your "Pending Approval" list. HireMinds admin will review and approve; once approved, they'll get an email to create their password and log in.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-800/60">
                <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:bg-slate-800/60 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={addHm}
                  disabled={!addForm.name || !addForm.email}
                  className="px-5 py-2 rounded-lg text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit for Approval
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════════════════ HIRING MANAGER DETAIL POPUP ═══════════════════ */}
      {selectedHm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedHm(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-lg rounded-2xl border border-slate-800/60 bg-slate-900/98 shadow-2xl backdrop-blur-xl animate-fadeIn max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-slate-800/60 bg-slate-900/95 backdrop-blur-md">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-slate-500">Hiring Manager</p>
                  <h3 className="text-base font-bold">{selectedHm.name}</h3>
                </div>
                <button onClick={() => setSelectedHm(null)} className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-800/60 transition-colors">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-lg flex-shrink-0" style={{ background: selectedHm.avatar }}>
                    {selectedHm.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold">{selectedHm.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{selectedHm.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${HM_STATUS_STYLE[selectedHm.status]}`}>{selectedHm.status}</span>
                      <span className="text-[10px] text-slate-500">{selectedHm.department}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-4 space-y-0.5">
                  <DetailRow label="Manager ID">{selectedHm.id}</DetailRow>
                  <DetailRow label="Email">{selectedHm.email}</DetailRow>
                  <DetailRow label="Department">{selectedHm.department}</DetailRow>
                  <DetailRow label="Status">{selectedHm.status}</DetailRow>
                  <DetailRow label="Added">{new Date(selectedHm.addedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</DetailRow>
                  <DetailRow label="Last Active">{selectedHm.lastActive}</DetailRow>
                </div>

                {selectedHm.status === "Active" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-4 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Open Jobs</p>
                      <p className="text-2xl font-extrabold mt-1 text-indigo-400">{selectedHm.openJobs}</p>
                    </div>
                    <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 p-4 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Candidates</p>
                      <p className="text-2xl font-extrabold mt-1 text-emerald-400">{selectedHm.activeCandidates}</p>
                    </div>
                  </div>
                )}

                {selectedHm.status === "Pending Approval" && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <div className="flex items-start gap-2">
                      <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M12 8v4M12 16h.01" />
                      </svg>
                      <div>
                        <p className="text-xs font-bold text-amber-300">Awaiting Admin Approval</p>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          This manager was submitted on {new Date(selectedHm.addedAt).toLocaleDateString(undefined, { month: "long", day: "numeric" })}. Once HireMinds admin reviews and approves, they'll receive an email at <span className="font-mono text-amber-300">{selectedHm.email}</span> with a link to create their portal password.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      <footer className="mt-10 text-center text-xs text-slate-500 pb-4">
        HireMinds · Company Portal · Managed by your team
      </footer>
    </div>
  );
}

/* ── Helper Components ── */

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-900/60 p-5 transition-all hover:-translate-y-0.5 hover:shadow-xl backdrop-blur-md">
      <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full blur-2xl opacity-20" style={{ background: color }} />
      <div className="relative">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>
        <p className="mt-2 text-[28px] font-extrabold" style={{ color }}>{value}</p>
      </div>
    </div>
  );
}

function ProfileInput({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  );
}

function ProfileSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-950/60 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 outline-none transition-all focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-slate-800/50 last:border-none">
      <span className="text-xs font-semibold text-slate-400 min-w-[100px]">{label}</span>
      <span className="text-xs font-semibold text-right">{children}</span>
    </div>
  );
}
