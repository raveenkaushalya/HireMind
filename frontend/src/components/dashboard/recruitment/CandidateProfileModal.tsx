import { useEffect, useState } from "react";
import type { Candidate, Stage } from "../../../data";
import { ScheduleInterviewModal } from "./ScheduleInterviewModal";

interface Props {
  candidate: Candidate;
  dark: boolean;
  stageColor: Record<Stage, string>;
  statusColor: Record<Candidate["status"], string>;
  onClose: () => void;
  userRole?: "hiring_manager" | "recruiter";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function cvMeta(id: string) {
  const n = parseInt(id.replace("CND-", ""), 10);
  const sizes = ["284 KB", "312 KB", "198 KB", "467 KB", "356 KB", "221 KB", "389 KB", "244 KB"];
  const pages = [1, 2, 2, 3, 2, 1, 3, 2];
  const uploadDaysAgo = [3, 7, 14, 2, 21, 5, 10, 8];
  const idx = n % sizes.length;
  const uploadDate = new Date();
  uploadDate.setDate(uploadDate.getDate() - uploadDaysAgo[idx]);
  return {
    size: sizes[idx],
    pages: pages[idx],
    uploadedAt: uploadDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }),
  };
}

export default function CandidateProfileModal({ candidate, dark, stageColor, statusColor, onClose, userRole = "hiring_manager" }: Props) {
  const [actionState, setActionState] = useState<"none" | "approved" | "scheduled" | "rejected" | "submitted_to_hm" | "assessment_sent">("none");
  const [cvPreviewOpen, setCvPreviewOpen] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const c = candidate;
  const initials = c.name.split(" ").map((n) => n[0]).join("");

  const stat = (label: string, value: React.ReactNode) => (
    <div className={`rounded-xl border px-3 py-2.5 ${dark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"}`}>
      <p className={`text-[10px] uppercase tracking-wide font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        className={`relative w-full sm:max-w-3xl max-h-full sm:max-h-[90vh] overflow-y-auto sm:rounded-2xl border shadow-2xl animate-fadeIn ${
          dark ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 z-10 flex items-start gap-4 p-5 border-b backdrop-blur-md ${dark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200"}`}>
          <div className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-lg" style={{ background: c.avatar }}>
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold truncate">{c.name}</h2>
              <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ring-1 ring-inset ${stageColor[c.stage]}`}>{c.stage}</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${statusColor[c.status]}`} />
                {c.status}
              </span>
            </div>
            <p className={`text-sm mt-0.5 truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>
              {c.role} · {c.department} · {c.id}
            </p>
            <p className={`text-xs mt-0.5 truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{c.location}</p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg flex-shrink-0 transition-colors ${dark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
            aria-label="Close profile"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6">
          {actionState !== "none" && (
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ${
                actionState === "rejected"
                  ? dark
                    ? "bg-rose-500/15 text-rose-300 ring-1 ring-inset ring-rose-500/30"
                    : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200"
                  : dark
                    ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-inset ring-emerald-500/30"
                    : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
              }`}
            >
              {actionState === "approved" ? (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Approved — {c.name} has been moved to the next stage.
                </>
              ) : actionState === "submitted_to_hm" ? (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Submitted — {c.name}'s profile and recruiter evaluation sent to Hiring Manager.
                </>
              ) : actionState === "assessment_sent" ? (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Assessment Dispatched — Screening questionnaire sent to {c.email}.
                </>
              ) : actionState === "scheduled" ? (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Interview scheduled for {c.name}. A calendar invite has been sent.
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Application rejected for {c.name}. The candidate will be notified.
                </>
              )}
            </div>
          )}

          {/* Key stats grid */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Overview</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {stat("Match Score", `${c.score}/100`)}
              {stat("Resume Match", `${c.resumeMatch}%`)}
              {stat("Experience", `${c.yearsExp} yrs`)}
              {stat("Seniority", c.seniority)}
              {stat("Source", c.source)}
              {stat("Applied", formatDate(c.appliedAt))}
              {stat("Shortlisted", formatDate(c.shortlistedAt))}
              {stat("Days in Pipeline", `${c.daysInPipeline}d`)}
            </div>
          </div>

          {/* Contact & logistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {stat("Email", <span className="font-normal text-xs break-all">{c.email}</span>)}
            {stat("Phone", <span className="font-normal text-xs">{c.phone}</span>)}
            {stat("Education", <span className="font-normal text-xs">{c.education}</span>)}
            {stat("Previous Company", <span className="font-normal text-xs">{c.previousCompany}</span>)}
            {stat("Expected Salary", c.expectedSalary)}
            {stat("Notice Period", c.noticePeriod)}
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {c.skills.map((s) => (
                <span
                  key={s}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Summary</h3>
            <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{c.summary}</p>
          </div>

          {/* CV File */}
          <CvFileSection dark={dark} candidate={c} cvPreviewOpen={cvPreviewOpen} setCvPreviewOpen={setCvPreviewOpen} />

          {/* Recruiter Assessment */}
          {userRole === "recruiter" && (
            <div className={`p-4 rounded-xl border ${dark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-teal-400" />
                  Recruiter Screening Assessment
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${dark ? "bg-teal-500/20 text-teal-300" : "bg-teal-100 text-teal-800"}`}>
                  Recruiter Logged
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className={dark ? "text-slate-500" : "text-slate-400"}>Cold Outreach Status: </span>
                  <span className="font-medium text-emerald-400">Responded & Keen</span>
                </div>
                <div>
                  <span className={dark ? "text-slate-500" : "text-slate-400"}>Culture Screen: </span>
                  <span className="font-medium">Passed (Score 9/10)</span>
                </div>
                <div>
                  <span className={dark ? "text-slate-500" : "text-slate-400"}>Salary Expectation: </span>
                  <span className="font-medium">{c.expectedSalary} (Within Band)</span>
                </div>
                <div>
                  <span className={dark ? "text-slate-500" : "text-slate-400"}>Availability: </span>
                  <span className="font-medium">{c.noticePeriod}</span>
                </div>
              </div>
              <p className={`text-xs italic ${dark ? "text-slate-400" : "text-slate-600"}`}>
                "Candidate expressed high motivation for the {c.department} team. Passed initial recruiter phone screening with flying colors. Highly recommended for HM technical review."
              </p>
            </div>
          )}

          {/* Interview history */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Interview History</h3>
            {c.interviewHistory.length === 0 ? (
              <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>No interviews conducted yet — candidate is at the {c.stage} stage.</p>
            ) : (
              <div className="space-y-3">
                {c.interviewHistory.map((ev, i) => (
                  <div key={i} className={`flex gap-3 rounded-xl border px-3 py-3 ${dark ? "border-slate-800 bg-slate-950/40" : "border-slate-200 bg-slate-50"}`}>
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${dark ? "bg-slate-800 text-amber-400" : "bg-amber-50 text-amber-700"}`}>
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <p className="text-sm font-semibold">{ev.stage} Interview</p>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }, (_, idx) => (
                            <svg key={idx} viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${idx < ev.rating ? "text-amber-400" : dark ? "text-slate-700" : "text-slate-300"}`} fill="currentColor">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className={`text-xs mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                        {formatDate(ev.date)} · with {ev.interviewer}
                      </p>
                      <p className={`text-xs mt-1.5 ${dark ? "text-slate-300" : "text-slate-600"}`}>{ev.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className={`sticky bottom-0 flex flex-col gap-2.5 p-5 border-t backdrop-blur-md ${dark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200"}`}>
          {userRole === "recruiter" ? (
            <>
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* Positive Action -> Emerald */}
                <button
                  onClick={() => setActionState("submitted_to_hm")}
                  disabled={actionState !== "none"}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    actionState !== "none"
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Submit to Hiring Manager
                </button>
                <button
                  onClick={() => setActionState("assessment_sent")}
                  disabled={actionState !== "none"}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    actionState !== "none"
                      ? "opacity-50 cursor-not-allowed"
                      : dark
                      ? "bg-slate-500/15 text-slate-300 hover:bg-slate-500/25 ring-1 ring-inset ring-slate-500/30"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 ring-1 ring-inset ring-slate-200"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Send Assessment
                </button>
                {/* Destructive Action -> Rose */}
                <button
                  onClick={() => setActionState("rejected")}
                  disabled={actionState !== "none"}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    actionState !== "none"
                      ? "opacity-50 cursor-not-allowed"
                      : dark
                      ? "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 ring-1 ring-inset ring-rose-500/30"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100 ring-1 ring-inset ring-rose-200"
                  }`}
                >
                  Reject
                </button>
              </div>

              {/* Main CTA -> Gold Action Accent */}
              <button
                onClick={() => setShowScheduleModal(true)}
                disabled={actionState !== "none"}
                className={`mx-auto w-full max-w-xs sm:max-w-md inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  actionState !== "none" ? "opacity-50 cursor-not-allowed" : ""
                } bg-amber-500 text-slate-950 hover:bg-amber-600`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Schedule Recruiter Screen
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-2.5">
                {/* Positive Action -> Emerald */}
                <button
                  onClick={() => setActionState("approved")}
                  disabled={actionState !== "none"}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    actionState !== "none"
                      ? "opacity-50 cursor-not-allowed"
                      : "bg-emerald-500 text-white hover:bg-emerald-600"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Approve
                </button>
                {/* Destructive Action -> Rose */}
                <button
                  onClick={() => setActionState("rejected")}
                  disabled={actionState !== "none"}
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    actionState !== "none"
                      ? "opacity-50 cursor-not-allowed"
                      : dark
                      ? "bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 ring-1 ring-inset ring-rose-500/30"
                      : "bg-rose-50 text-rose-700 hover:bg-rose-100 ring-1 ring-inset ring-rose-200"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Reject Application
                </button>
              </div>

              {/* Main CTA -> Gold Action Accent */}
              <button
                onClick={() => setShowScheduleModal(true)}
                disabled={actionState !== "none"}
                className={`mx-auto w-full max-w-xs sm:max-w-md inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  actionState !== "none" ? "opacity-50 cursor-not-allowed" : ""
                } bg-amber-500 text-slate-950 hover:bg-amber-600`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Schedule an Interview
              </button>
            </>
          )}
        </div>
      </div>

      {showScheduleModal && (
        <ScheduleInterviewModal
          dark={dark}
          onClose={() => setShowScheduleModal(false)}
          onConfirm={() => {
            setActionState("scheduled");
            setShowScheduleModal(false);
          }}
          candidateName={candidate.name}
        />
      )}
    </div>
  );
}

function CvFileSection({
  dark,
  candidate,
  cvPreviewOpen,
  setCvPreviewOpen,
}: {
  dark: boolean;
  candidate: Candidate;
  cvPreviewOpen: boolean;
  setCvPreviewOpen: (v: boolean) => void;
}) {
  const meta = cvMeta(candidate.id);
  const fileName = `${candidate.name.replace(/ /g, "_")}_CV.pdf`;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">CV / Resume</h3>
        <label
          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
            dark
              ? "text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
          </svg>
          Replace CV
          <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={() => {}} />
        </label>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${dark ? "border-slate-800 bg-slate-950/50" : "border-slate-200 bg-slate-50"}`}>
        <div className="flex items-center gap-4 p-4">
          {/* PDF Standard Red Branding preserved */}
          <div className="flex-shrink-0 w-12 h-14 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex flex-col items-center justify-center shadow-md shadow-red-500/20 relative">
            <span className="text-white text-[10px] font-black tracking-widest">PDF</span>
            <div className="absolute -bottom-0 -right-0 h-3 w-3 bg-white/20 rounded-tl-md" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{fileName}</p>
            <div className={`flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs ${dark ? "text-slate-400" : "text-slate-500"}`}>
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {meta.pages} {meta.pages === 1 ? "page" : "pages"}
              </span>
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                {meta.size}
              </span>
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Uploaded {meta.uploadedAt}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setCvPreviewOpen(!cvPreviewOpen)}
              title="Preview CV"
              className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                cvPreviewOpen
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : dark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <button
              title="Download CV"
              onClick={() => {}}
              className={`h-9 w-9 rounded-lg flex items-center justify-center transition-colors ${
                dark
                  ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            </button>
          </div>
        </div>

        {cvPreviewOpen && (
          <div className={`border-t ${dark ? "border-slate-800" : "border-slate-200"}`}>
            <div className={`p-5 space-y-4 text-xs ${dark ? "bg-slate-950/60 text-slate-300" : "bg-white text-slate-700"}`}>
              <div className="text-center pb-3 border-b" style={{ borderColor: dark ? "#1e293b" : "#e2e8f0" }}>
                <p className="text-base font-bold">{candidate.name}</p>
                <p className={`mt-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>{candidate.role} · {candidate.seniority}</p>
                <p className={`mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>{candidate.email} · {candidate.phone} · {candidate.location}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#eab308" }}>Professional Summary</p>
                <p className="leading-relaxed">{candidate.summary}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#eab308" }}>Core Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {candidate.skills.map((s) => (
                    <span key={s} className={`px-2 py-0.5 rounded text-[11px] font-medium ${dark ? "bg-slate-800 text-slate-300" : "bg-slate-100 text-slate-600"}`}>{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#eab308" }}>Experience</p>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-[12px]">{candidate.role}</p>
                        <p className={`${dark ? "text-slate-400" : "text-slate-500"}`}>{candidate.previousCompany}</p>
                      </div>
                      <p className={`text-[11px] whitespace-nowrap ${dark ? "text-slate-500" : "text-slate-400"}`}>{candidate.yearsExp} yr{candidate.yearsExp > 1 ? "s" : ""}</p>
                    </div>
                    <ul className={`mt-1 ml-3 list-disc space-y-0.5 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                      <li>Led cross-functional projects, driving measurable impact across {candidate.department} workflows.</li>
                      <li>Collaborated with stakeholders to define and ship key product milestones on schedule.</li>
                      <li>Mentored junior team members and contributed to technical direction.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#eab308" }}>Education</p>
                <p className="font-semibold text-[12px]">{candidate.education.split(" · ")[0]}</p>
                <p className={`${dark ? "text-slate-400" : "text-slate-500"}`}>{candidate.education.split(" · ")[1]}</p>
              </div>
            </div>

            <div className={`flex items-center justify-between px-5 py-3 border-t text-xs ${dark ? "border-slate-800 text-slate-500 bg-slate-950/60" : "border-slate-100 text-slate-400 bg-slate-50"}`}>
              <span>{meta.pages} page{meta.pages > 1 ? "s" : ""} · {meta.size}</span>
              <button
                onClick={() => setCvPreviewOpen(false)}
                className={`flex items-center gap-1 hover:underline ${dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"}`}
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M5 15l7-7 7 7" />
                </svg>
                Collapse preview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}