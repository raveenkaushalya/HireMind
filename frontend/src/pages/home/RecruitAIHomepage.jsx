import React, { useEffect, useState, useRef } from "react";
import {
  Users, Building2, UserCog, ShieldCheck, ArrowRight, ArrowUpRight,
  CheckCircle2, FileText, Radar, Mail, GitBranch, Link
} from "lucide-react";

const skills = ["React", "SQL", "REST APIs", "Node.js", "Git", "Agile", "C#", "Docker"];
const matchedSet = new Set(["React", "SQL", "REST APIs", "Git", "C#"]);

function useCountUp(target, start) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame;
    const duration = 1400;
    const startTime = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [start, target]);
  return value;
}

function ScanCard() {
  const [scanned, setScanned] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setScanned(true), 300);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const score = useCountUp(94, scanned);

  return (
    <div ref={ref} className="relative w-full max-w-sm">
      <div
        className="relative overflow-hidden rounded-2xl border"
        style={{ background: "#FFFFFF", borderColor: "#E4E2DA" }}
      >
        {/* scan beam */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, transparent, #F2A93B, transparent)",
            top: scanned ? "100%" : "0%",
            transition: "top 1.3s cubic-bezier(0.65,0,0.35,1)",
            boxShadow: "0 0 12px 2px rgba(242,169,59,0.5)",
          }}
        />
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", color: "#5B6472" }}>
                CAND-2201 · SOFTWARE ENGINEER
              </p>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: "#12213B", fontWeight: 600 }}>
                D. Fernando
              </p>
            </div>
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: "56px",
                height: "56px",
                border: "2px solid " + (scanned ? "#2E7D6B" : "#E4E2DA"),
                transition: "border-color 0.6s ease 1.1s",
              }}
            >
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "15px", fontWeight: 600, color: scanned ? "#2E7D6B" : "#5B6472" }}>
                {score}%
              </span>
            </div>
          </div>

          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "0.1em", color: "#5B6472", marginBottom: "10px" }}>
            SKILL MATCH — JR. BACKEND ROLE
          </p>
          <div className="flex flex-wrap gap-2 mb-1">
            {skills.map((s, i) => {
              const isMatch = matchedSet.has(s);
              return (
                <span
                  key={s}
                  className="rounded-md px-2 py-1"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: "11px",
                    border: "1px solid",
                    borderColor: scanned && isMatch ? "#2E7D6B" : "#E4E2DA",
                    color: scanned && isMatch ? "#1D5A47" : "#5B6472",
                    background: scanned && isMatch ? "#E1F0EA" : "transparent",
                    transition: `all 0.4s ease ${0.15 * i + 0.2}s`,
                  }}
                >
                  {isMatch && scanned ? "✓ " : ""}{s}
                </span>
              );
            })}
          </div>
        </div>
        <div
          className="flex items-center gap-2 px-6 py-3"
          style={{ borderTop: "1px solid #E4E2DA", background: "#FAF9F6" }}
        >
          <Radar size={14} color="#F2A93B" />
          <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "12px", color: "#5B6472" }}>
            Ranked and scored by the matching engine in real time
          </span>
        </div>
      </div>
    </div>
  );
}

const portals = [
  {
    key: "01",
    title: "Candidate portal",
    icon: Users,
    desc: "Register, build a professional profile, and manage your CV in one place.",
    perms: ["Job search & application submission", "AI-powered job recommendations", "Application tracking dashboard"],
  },
  {
    key: "02",
    title: "Recruiter portal",
    icon: Building2,
    desc: "Post roles, search candidates, and shortlist with AI-powered ranking.",
    perms: ["Job posting creation & management", "AI candidate ranking & screening", "Interview scheduling & applicant messaging"],
  },
  {
    key: "03",
    title: "Hiring manager dashboard",
    icon: UserCog,
    desc: "Review shortlisted candidates and manage the final hiring decision.",
    perms: ["Interview feedback management", "Candidate evaluation & scoring", "Hiring decision management"],
  },
  {
    key: "04",
    title: "Administration portal",
    icon: ShieldCheck,
    desc: "Manage users, roles, and departments across the organisation.",
    perms: ["User & role/permission management", "Recruitment analytics dashboard", "Organisation & department management"],
  },
];

const steps = [
  {
    n: "1",
    title: "Apply",
    body: "Candidates submit a profile once and apply to any open role across the org.",
  },
  {
    n: "2",
    title: "Match",
    body: "The matching engine scores each application against the role's requirements.",
  },
  {
    n: "3",
    title: "Hire",
    body: "Recruiters and hiring managers review ranked shortlists and move to interview.",
  },
];

export default function RecruitAIHomepage() {
  return (
    <div style={{ background: "#F5F6F2", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .rai-body { font-family: 'IBM Plex Sans', sans-serif; }
        .rai-display { font-family: 'Fraunces', serif; }
        .rai-mono { font-family: 'IBM Plex Mono', monospace; }
        .rai-btn-primary:hover { background: #0B1730 !important; }
        .rai-btn-ghost:hover { background: #FFFFFF !important; }
        .rai-card:hover { border-color: #12213B !important; transform: translateY(-2px); }
        .rai-card { transition: all 0.2s ease; }
      `}</style>

      {/* NAV */}
      <header className="rai-body sticky top-0 z-50 border-b border-[#E4E2DA]/80 bg-[#F5F6F2]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <a href="#top" className="flex items-center gap-3" style={{ textDecoration: "none" }}>
            <div
              style={{
                width: "11px",
                height: "11px",
                background: "linear-gradient(135deg, #F2A93B, #F7C56B)",
                borderRadius: "3px",
                boxShadow: "0 0 0 4px rgba(242,169,59,0.12)",
              }}
            />
            <span className="rai-display" style={{ fontSize: "20px", fontWeight: 700, color: "#12213B" }}>
              RecruitAI
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-2">
            {[
              ["How it works", "#how"],
              ["Portals", "#portals"],
              ["Matching engine", "#ai"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                style={{
                  fontSize: "14px",
                  color: "#5B6472",
                  textDecoration: "none",
                  padding: "9px 14px",
                  borderRadius: "999px",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = "rgba(18,33,59,0.06)";
                  event.currentTarget.style.color = "#12213B";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = "transparent";
                  event.currentTarget.style.color = "#5B6472";
                }}
              >
                {label}
              </a>
            ))}
          </nav>
          <button
            className="rai-btn-primary"
            style={{
              background: "#12213B",
              color: "#FFFFFF",
              fontSize: "14px",
              fontWeight: 600,
              padding: "10px 18px",
              borderRadius: "999px",
              border: "1px solid rgba(18,33,59,0.1)",
              cursor: "pointer",
              boxShadow: "0 10px 24px rgba(18,33,59,0.14)",
            }}
          >
            Sign in
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-28 min-h-[72svh] grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="rai-mono" style={{ fontSize: "12px", letterSpacing: "0.12em", color: "#F2A93B", marginBottom: "16px" }}>
            ONE PLATFORM · FOUR PORTALS
          </p>
          <h1 className="rai-display" style={{ fontSize: "44px", lineHeight: 1.1, color: "#12213B", fontWeight: 600, marginBottom: "20px" }}>
            An AI-powered recruitment and talent management platform.
          </h1>
          <p className="rai-body" style={{ fontSize: "16px", lineHeight: 1.7, color: "#5B6472", marginBottom: "28px", maxWidth: "480px" }}>
            Built for a multinational HR consulting firm, RecruitAI automates candidate
            screening, job matching, interview scheduling, and talent analytics — giving
            candidates, recruiters, hiring managers, and admins one connected system.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rai-btn-primary"
              style={{
                background: "#12213B", color: "#FFFFFF", fontSize: "15px", fontWeight: 500,
                padding: "12px 22px", borderRadius: "8px", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", gap: "8px",
              }}
            >
              Explore candidate portal <ArrowRight size={16} />
            </button>
            <button
              className="rai-btn-ghost"
              style={{
                background: "transparent", color: "#12213B", fontSize: "15px", fontWeight: 500,
                padding: "12px 22px", borderRadius: "8px", border: "1px solid #12213B", cursor: "pointer",
              }}
            >
              For recruiters
            </button>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <ScanCard />
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{ background: "#12213B" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ["4", "role-based portals"],
            ["JWT", "secured API access"],
            ["Live", "AI candidate ranking"],
            ["1", "shared source of truth"],
          ].map(([big, label]) => (
            <div key={label}>
              <p className="rai-display" style={{ color: "#F2A93B", fontSize: "26px", fontWeight: 600 }}>{big}</p>
              <p className="rai-body" style={{ color: "#B9C0CE", fontSize: "13px" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-20">
        <p className="rai-mono" style={{ fontSize: "12px", letterSpacing: "0.12em", color: "#F2A93B", marginBottom: "10px" }}>
          THE PIPELINE
        </p>
        <h2 className="rai-display" style={{ fontSize: "30px", color: "#12213B", fontWeight: 600, marginBottom: "40px" }}>
          Every application follows the same three steps
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div
                style={{
                  fontFamily: "'Fraunces', serif", fontSize: "48px", fontWeight: 700,
                  color: "#E4E2DA", lineHeight: 1, marginBottom: "12px",
                }}
              >
                {s.n}
              </div>
              <h3 className="rai-display" style={{ fontSize: "19px", color: "#12213B", fontWeight: 600, marginBottom: "8px" }}>
                {s.title}
              </h3>
              <p className="rai-body" style={{ fontSize: "14px", color: "#5B6472", lineHeight: 1.6 }}>
                {s.body}
              </p>
              {i < steps.length - 1 && (
                <div
                  className="hidden md:block"
                  style={{
                    position: "absolute", top: "24px", right: "-24px", width: "24px",
                    borderTop: "1px dashed #C9C6BB",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* PORTALS */}
      <section id="portals" className="max-w-6xl mx-auto px-6 py-20">
        <p className="rai-mono" style={{ fontSize: "12px", letterSpacing: "0.12em", color: "#F2A93B", marginBottom: "10px" }}>
          ACCESS LEVELS
        </p>
        <h2 className="rai-display" style={{ fontSize: "30px", color: "#12213B", fontWeight: 600, marginBottom: "40px" }}>
          Four portals, one role-based login
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {portals.map(({ key, title, icon: Icon, desc, perms }) => (
            <div
              key={key}
              className="rai-card"
              style={{
                background: "#FFFFFF", border: "1px solid #E4E2DA", borderRadius: "14px",
                padding: "22px", cursor: "pointer",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="rai-mono" style={{ fontSize: "11px", color: "#5B6472" }}>{key}</span>
                <div
                  className="flex items-center justify-center"
                  style={{ width: "38px", height: "38px", background: "#F5F6F2", borderRadius: "9px" }}
                >
                  <Icon size={18} color="#12213B" />
                </div>
              </div>
              <h3 className="rai-display" style={{ fontSize: "17px", color: "#12213B", fontWeight: 600, marginBottom: "6px" }}>
                {title}
              </h3>
              <p className="rai-body" style={{ fontSize: "13px", color: "#5B6472", lineHeight: 1.55, marginBottom: "14px" }}>
                {desc}
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {perms.map((p) => (
                  <li key={p} className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={13} color="#2E7D6B" />
                    <span className="rai-body" style={{ fontSize: "12px", color: "#5B6472" }}>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-1" style={{ marginTop: "10px" }}>
                <span className="rai-body" style={{ fontSize: "13px", fontWeight: 500, color: "#12213B" }}>
                  Enter portal
                </span>
                <ArrowUpRight size={14} color="#12213B" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI FEATURE */}
      <section id="ai" style={{ background: "#FFFFFF", borderTop: "1px solid #E4E2DA", borderBottom: "1px solid #E4E2DA" }}>
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="rai-mono" style={{ fontSize: "12px", letterSpacing: "0.12em", color: "#F2A93B", marginBottom: "10px" }}>
              MATCHING ENGINE
            </p>
            <h2 className="rai-display" style={{ fontSize: "28px", color: "#12213B", fontWeight: 600, marginBottom: "16px" }}>
              Scoring you can actually explain
            </h2>
            <p className="rai-body" style={{ fontSize: "15px", color: "#5B6472", lineHeight: 1.7, marginBottom: "18px" }}>
              Each application is scored against the role's listed skills and requirements,
              so recruiters see why a candidate ranks where they do — not just a number.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {[
                "Skill overlap scoring on every application",
                "Ranked shortlists for recruiters and hiring managers",
                "Transparent breakdown behind every match score",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2 mb-3">
                  <FileText size={15} color="#12213B" style={{ marginTop: "2px" }} />
                  <span className="rai-body" style={{ fontSize: "14px", color: "#12213B" }}>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center">
            <ScanCard />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="rai-body" style={{ background: "#0F1D34", color: "#D8DDE7", borderTop: "1px solid rgba(233, 228, 218, 0.08)" }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr] md:items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "linear-gradient(135deg, #F2A93B, #F7C56B)",
                    borderRadius: "3px",
                  }}
                />
                <span className="rai-display" style={{ fontSize: "18px", fontWeight: 700, color: "#FFFFFF" }}>
                  RecruitAI
                </span>
              </div>
              <p style={{ maxWidth: "360px", fontSize: "14px", lineHeight: 1.7, color: "#A7B0C2" }}>
                A recruitment platform that keeps candidates, recruiters, hiring managers,
                and admins aligned in one workflow.
              </p>
            </div>

            <div>
              <h3 className="rai-display" style={{ fontSize: "16px", color: "#FFFFFF", marginBottom: "12px" }}>
                Explore
              </h3>
              <div className="flex flex-col gap-3">
                {[
                  ["How it works", "#how"],
                  ["Portals", "#portals"],
                  ["Matching engine", "#ai"],
                ].map(([label, href]) => (
                  <a key={label} href={href} style={{ color: "#A7B0C2", fontSize: "14px", textDecoration: "none" }}>
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="rai-display" style={{ fontSize: "16px", color: "#FFFFFF", marginBottom: "12px" }}>
                Connect
              </h3>
              <div className="flex items-center gap-4 mb-5">
                <Mail size={16} color="#A7B0C2" />
                <GitBranch size={16} color="#A7B0C2" />
                <Link size={16} color="#A7B0C2" />
              </div>
              <p style={{ fontSize: "13px", color: "#8E97A8" }}>
                SE205.3 coursework build
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
