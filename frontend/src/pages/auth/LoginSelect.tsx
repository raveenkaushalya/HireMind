import { useEffect, useState } from "react";

interface Props {
  onSelect: (portal: "hiring_manager" | "recruiter" | "company" | "admin") => void;
}

export default function LoginSelect({ onSelect }: Props) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const nd = !dark;
    setDark(nd);
    document.documentElement.classList.toggle("dark", nd);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative transition-colors duration-300 ${dark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"}`}>
      {/* Ambient Orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-25 ${dark ? "bg-indigo-500" : "bg-indigo-300"}`} />
        <div className={`absolute top-1/3 -right-40 h-96 w-96 rounded-full blur-3xl opacity-25 ${dark ? "bg-teal-500" : "bg-teal-300"}`} />
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleTheme}
          className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${dark ? "bg-slate-900 border border-slate-800 hover:bg-slate-800" : "bg-white border border-slate-200 hover:bg-slate-100"}`}
          aria-label="Toggle theme"
        >
          {dark ? (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
      </div>

      <div className="relative z-10 w-full max-w-3xl text-center space-y-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">
            <span className={dark ? "text-white" : "text-slate-900"}>Hire</span>
            <span style={{ color: "#eab308" }}>Minds</span>
            <span className="text-red-500">.</span>
          </h1>
          <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Select a workspace to log in to recruitment analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <PortalCard
            initial="HM"
            title="Hiring Manager Portal"
            desc="Review shortlisted candidates, evaluate scores, manage interview approvals, and schedule sessions."
            accent="indigo"
            dark={dark}
            onClick={() => onSelect("hiring_manager")}
          />
          <PortalCard
            initial="RC"
            title="Recruiter Operations Portal"
            desc="Manage sourcing channels, log recruiter screening notes, dispatch assessments, forward profiles to HM."
            accent="teal"
            dark={dark}
            onClick={() => onSelect("recruiter")}
          />
          <PortalCard
            initial="CM"
            title="Company Admin Portal"
            desc="Manage your company profile and hiring managers — add team members for admin approval."
            accent="emerald"
            dark={dark}
            onClick={() => onSelect("company")}
          />
          <PortalCard
            initial="AD"
            title="System Admin Portal"
            desc="Full platform control — manage recruiters, candidates, company approvals, roles, and access."
            accent="violet"
            dark={dark}
            onClick={() => onSelect("admin")}
          />
        </div>
      </div>
    </div>
  );
}

function PortalCard({
  initial, title, desc, accent, dark, onClick,
}: {
  initial: string;
  title: string;
  desc: string;
  accent: "indigo" | "teal" | "emerald" | "violet";
  dark: boolean;
  onClick: () => void;
}) {
  const gradients: Record<string, string> = {
    indigo: "from-violet-500 to-indigo-600",
    teal: "from-teal-500 to-emerald-600",
    emerald: "from-emerald-500 to-teal-600",
    violet: "from-violet-600 to-fuchsia-600",
  };
  const hoverBorders: Record<string, string> = {
    indigo: "hover:border-indigo-500/50",
    teal: "hover:border-teal-500/50",
    emerald: "hover:border-emerald-500/50",
    violet: "hover:border-violet-500/50",
  };
  const btnColors: Record<string, string> = {
    indigo: "bg-indigo-500 hover:bg-indigo-600",
    teal: "bg-teal-600 hover:bg-teal-700",
    emerald: "bg-emerald-600 hover:bg-emerald-700",
    violet: "bg-gradient-to-r from-violet-600 to-fuchsia-600",
  };

  return (
    <div
      onClick={onClick}
      className={`group p-6 rounded-2xl border cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        dark ? `bg-slate-900/80 border-slate-800 ${hoverBorders[accent]}` : `bg-white border-slate-200 ${hoverBorders[accent]}`
      }`}
    >
      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradients[accent]} flex items-center justify-center text-white font-bold text-sm shadow-md mb-4`}>
        {initial}
      </div>
      <h3 className="text-base font-bold mb-1">{title}</h3>
      <p className={`text-xs mb-5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{desc}</p>
      <button className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition-colors flex items-center justify-center gap-1.5 ${btnColors[accent]}`}>
        Enter Workspace
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
