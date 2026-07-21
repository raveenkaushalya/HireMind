import { useState } from "react";

interface Props {
  onLogin: () => void;
  onBack: () => void;
}

const ADMIN_USER = "admin";
const ADMIN_PASS = "hireminds";
const ADMIN_KEY = "ADM-SECURE-2026";

export default function AdminPortal({ onLogin, onBack }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showKey, setShowKey] = useState(false);

  const locked = attempts >= 4;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !key) {
      setError("All three fields are required to continue.");
      return;
    }
    if (username === ADMIN_USER && password === ADMIN_PASS && key === ADMIN_KEY) {
      setError(null);
      onLogin();
    } else {
      setAttempts((a) => a + 1);
      const remaining = 4 - (attempts + 1);
      setError(
        remaining > 0
          ? `Invalid credentials. ${remaining} attempt${remaining > 1 ? "s" : ""} remaining before lockout.`
          : "Too many failed attempts. Portal temporarily locked."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-[#0b0f1a] text-slate-100 transition-colors duration-300">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-rose-600/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Hire<span style={{ color: "#eab308" }}>Minds</span><span className="text-red-500">.</span>
          </h1>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
          <h2 className="text-xl font-extrabold tracking-tight mb-6">Admin Secure Login</h2>

          {error && (
            <div className={`mb-4 rounded-lg px-3 py-2 text-xs font-medium flex items-start gap-2 ${
              locked
                ? "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30"
                : "bg-amber-500/15 text-amber-300 ring-1 ring-inset ring-amber-500/30"
            }`}>
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <Field label="Username">
              <Input
                icon={<UserIcon />}
                value={username}
                onChange={setUsername}
                placeholder="admin"
                autoComplete="username"
                disabled={locked}
              />
            </Field>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Master Security Key</span>
              </div>
              <Input
                icon={<LockIcon />}
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                type="password"
                autoComplete="current-password"
                disabled={locked}
              />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-600">or security key</span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            {/* Security key */}
            <Field label="Master Security Key">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                  <KeyIcon />
                </span>
                <input
                  type={showKey ? "text" : "password"}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="ADM-XXXX-XXXX"
                  disabled={locked}
                  className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-10 pr-14 py-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showKey ? "Hide" : "Show"}
                </button>
              </div>
            </Field>

            {/* Authenticate */}
            <button
              type="submit"
              disabled={locked}
              className="w-full mt-6 py-3.5 rounded-xl text-sm font-extrabold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:brightness-110 hover:shadow-[0_20px_40px_-10px_rgba(139,92,246,0.5)] shadow-lg shadow-violet-500/25"
              style={{ backgroundImage: "linear-gradient(135deg, #7c3aed, #9333ea, #c026d3)" }}
            >
              <LockIcon className="h-4 w-4" />
              {locked ? "Portal Locked" : "Authenticate"}
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="mt-6 flex items-center justify-between text-xs font-semibold">
          <button onClick={onBack} className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 transition-colors">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back
          </button>
          <span className="text-slate-600">Sessions monitored · v2.1</span>
        </div>
      </div>
    </div>
  );
}

/* ── Helpers ── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-300 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Input({
  icon, value, onChange, placeholder, type = "text", autoComplete, disabled,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        disabled={disabled}
        className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-10 pr-3.5 py-3.5 text-sm text-slate-100 placeholder-slate-600 outline-none transition-all focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
      />
    </div>
  );
}

function UserIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path strokeLinecap="round" d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
function KeyIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.74 5.74 6 6 0 11-9-9A6 6 0 0119 5l-1.1-1.1a2 2 0 00-1.4-.58h-1a2 2 0 00-2 2v1a2 2 0 002 2h1a2 2 0 002-2z" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}
