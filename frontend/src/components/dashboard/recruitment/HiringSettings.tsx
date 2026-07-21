import { useState } from "react";

interface Props {
  dark: boolean;
}

export default function HiringSettings({ dark }: Props) {
  const [stages, setStages] = useState([
    { name: "Shortlisted", active: true, desc: "Initial matching & scoring checks" },
    { name: "Phone Screen", active: true, desc: "Recruiter high-level compatibility" },
    { name: "Technical", active: true, desc: "Engineering logic / architecture challenge" },
    { name: "Onsite", active: true, desc: "Deep cultural fit and system design sessions" },
    { name: "Offer", active: true, desc: "Salary alignment and structural details" },
  ]);

  const [scoreThreshold, setScoreThreshold] = useState(70);
  const [autoApprove, setAutoApprove] = useState(false);

  const toggleStage = (index: number) => {
    const updated = [...stages];
    updated[index].active = !updated[index].active;
    setStages(updated);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Settings Hero */}
      <div className={`p-6 rounded-2xl border ${dark ? "bg-slate-900/40 border-slate-800" : "bg-white border-slate-200"}`}>
        <h3 className="text-lg font-bold">Hiring Workflows & Settings</h3>
        <p className={`text-xs mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
          Customize interview sequence pipeline stages, system thresholds, and automated recruitment policies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stages Config */}
        <div className={`p-5 rounded-2xl border ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
          <h4 className="text-sm font-bold mb-3">Interview Sequences</h4>
          <p className={`text-xs mb-4 ${dark ? "text-slate-400" : "text-slate-500"}`}>
            Toggle active interview evaluation stages to reflect on pipeline funnel.
          </p>

          <div className="space-y-3">
            {stages.map((stage, idx) => (
              <div
                key={stage.name}
                onClick={() => toggleStage(idx)}
                className={`flex items-start justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  stage.active
                    ? dark
                      ? "bg-indigo-500/10 border-indigo-500/30 text-slate-100"
                      : "bg-indigo-50/50 border-indigo-200 text-slate-900"
                    : dark
                    ? "border-slate-800/80 bg-slate-950/20 text-slate-500"
                    : "border-slate-100 bg-slate-50/50 text-slate-400"
                }`}
              >
                <div className="min-w-0 pr-4">
                  <p className="text-xs font-bold">{stage.name}</p>
                  <p className={`text-[10px] mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{stage.desc}</p>
                </div>
                <div className="flex-shrink-0 pt-0.5">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    stage.active
                      ? "bg-indigo-500 border-indigo-500 text-white"
                      : dark ? "border-slate-700" : "border-slate-300"
                  }`}>
                    {stage.active && (
                      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Policy Settings */}
        <div className="space-y-4">
          {/* Policy Card */}
          <div className={`p-5 rounded-2xl border ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
            <h4 className="text-sm font-bold mb-3">System Thresholds</h4>
            <div className="space-y-4">
              {/* Threshold Slider */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className={dark ? "text-slate-300" : "text-slate-600"}>Scorecard Threshold</span>
                  <span className="text-indigo-500 font-bold">{scoreThreshold}/100</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={scoreThreshold}
                  onChange={(e) => setScoreThreshold(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <p className={`text-[10px] mt-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  Highlights matching candidates who meet or exceed this score in resume matching assessments.
                </p>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-start justify-between gap-4 pt-3 border-t border-slate-200/10">
                <div className="min-w-0">
                  <label className="text-xs font-bold block">Auto-approve Outstanding Profiles</label>
                  <span className={`text-[10px] mt-0.5 block ${dark ? "text-slate-500" : "text-slate-400"}`}>
                    Automatically tag candidates with &ge; 95 match rating as "Priority High".
                  </span>
                </div>
                <button
                  onClick={() => setAutoApprove(!autoApprove)}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 flex-shrink-0 ${
                    autoApprove ? "bg-indigo-500" : dark ? "bg-slate-800" : "bg-slate-200"
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 transform ${
                    autoApprove ? "translate-x-4" : "translate-x-0"
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className={`p-5 rounded-2xl border ${dark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200"}`}>
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "#6366f1" }}>System Integration</h4>
            <p className={`text-xs leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>
              These configurations sync dynamically with your ATS partner. Any changes committed will reflect on Slack triggers, Google Calendar invites, and Greenhouse pipelines in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
