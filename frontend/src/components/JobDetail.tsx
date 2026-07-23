import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  X, MapPin, Clock, Users, Briefcase, DollarSign,
  Building2, Sparkles, CheckCircle2, ArrowRight,
  Lock, Send, ChevronRight, Star, GraduationCap,
} from 'lucide-react';
import type { Job } from '../data/jobs';

function SkillMatchBar({ skill, match, isDark }: { skill: string; match: number; isDark: boolean }) {
  const getBarColor = (m: number) => {
    if (m >= 90) return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
    if (m >= 80) return 'bg-gradient-to-r from-blue-400 to-blue-500';
    if (m >= 70) return 'bg-gradient-to-r from-amber-400 to-amber-500';
    return 'bg-gradient-to-r from-orange-400 to-orange-500';
  };

  const getTextColor = (m: number) => {
    if (m >= 90) return 'text-emerald-500';
    if (m >= 80) return 'text-blue-500';
    if (m >= 70) return 'text-amber-500';
    return 'text-orange-500';
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{skill}</span>
        <span className={`text-sm font-bold ${getTextColor(match)}`}>{match}%</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-surface-700' : 'bg-surface-200'}`}>
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(match)}`}
          style={{ width: `${match}%` }}
        />
      </div>
    </div>
  );
}

function OverallMatchBadge({ score, isDark }: { score: number; isDark: boolean }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 95) return { stroke: '#10b981', glow: 'shadow-emerald-500/30', text: 'text-emerald-500', label: 'Excellent Match' };
    if (s >= 90) return { stroke: '#3b82f6', glow: 'shadow-blue-500/30', text: 'text-blue-500', label: 'Great Match' };
    if (s >= 85) return { stroke: '#f59e0b', glow: 'shadow-amber-500/30', text: 'text-amber-500', label: 'Good Match' };
    return { stroke: '#f97316', glow: 'shadow-orange-500/30', text: 'text-orange-500', label: 'Fair Match' };
  };

  const color = getColor(score);

  return (
    <div className={`rounded-2xl p-6 text-center ${isDark ? 'bg-surface-800/80 border border-surface-700/50' : 'bg-surface-50 border border-surface-200'
      }`}>
      <div className="flex items-center justify-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-primary-500" />
        <h3 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-surface-900'}`}>
          AI Match Score
        </h3>
      </div>
      <div className="relative w-32 h-32 mx-auto mb-3">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" fill="none"
            stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="8" />
          <circle cx="60" cy="60" r="54" fill="none"
            stroke={color.stroke} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-display text-3xl font-bold ${color.text}`}>{score}%</span>
        </div>
      </div>
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isDark ? 'bg-surface-700 text-surface-200' : 'bg-white border border-surface-200 text-surface-700'
        }`}>
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        {color.label}
      </span>
    </div>
  );
}

export default function JobDetail({ job, onClose }: { job: Job; onClose: () => void }) {
  const { theme } = useTheme();
  const { isSignedIn, openLogin, userId, token, userRole } = useAuth();
  const isDark = theme === 'dark';
  const [note, setNote] = useState('');
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const [candidateProfile, setCandidateProfile] = useState<any>(null);
  const [profileCompleteness, setProfileCompleteness] = useState(0);

  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzingMatch, setAnalyzingMatch] = useState(false);

  useEffect(() => {
    if (isSignedIn && userRole?.toLowerCase() === 'candidate' && userId && token) {
      fetch(`/api/candidates/by-user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            setCandidateProfile(data);
            const fields = ['name', 'email', 'phoneNumber', 'location', 'currentJobTitle', 'experienceLevel', 'education', 'skills', 'linkedinUrl', 'resumeUrl', 'bio'];
            const filled = fields.filter(f => data[f] && typeof data[f] === 'string' && data[f].trim() !== '').length;
            const pct = Math.round((filled / fields.length) * 100);
            setProfileCompleteness(pct);

            // If they have a resume URL, dynamically match against this job!
            if (data.resumeUrl) {
              setAnalyzingMatch(true);
              const formData = new FormData();
              formData.append('resumeUrl', data.resumeUrl);
              formData.append('jobDescription', `${job.title}\n${job.fullDescription}\nRequirements:\n${job.requirements.join('\n')}`);

              fetch('/api/portal/candidate/analyze', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
              })
                .then(r => r.json())
                .then(aiData => {
                  setAiAnalysis(aiData);
                  setAnalyzingMatch(false);
                })
                .catch(err => {
                  console.error(err);
                  setAnalyzingMatch(false);
                });
            }
          }
        })
        .catch(console.error);
    }
  }, [isSignedIn, userRole, userId, token, job]);

  // scroll to panel top on open
  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [job.id]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const typeColors: Record<string, string> = {
    'Full-time': isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
    'Remote': isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Contract': isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200',
    'Part-time': isDark ? 'bg-purple-500/15 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const handleApply = async () => {
    if (!isSignedIn) {
      openLogin();
      return;
    }

    if (profileCompleteness < 90 || !candidateProfile?.resumeUrl) {
      alert("Please ensure your profile completeness is at least 90% and you have uploaded your CV to apply for jobs.");
      return;
    }

    setApplying(true);
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          candidateId: candidateProfile.id,
          jobPostingId: Number(job.id) // Assuming job.id is the numeric ID
        })
      });

      if (res.ok) {
        setApplied(true);
      } else {
        const txt = await res.text();
        alert("Failed to apply: " + txt);
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during application.");
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`relative w-full h-full max-w-none max-h-screen rounded-none overflow-hidden shadow-2xl flex flex-col ${isDark ? 'bg-surface-900 border border-surface-700/50' : 'bg-white border border-surface-200'
          }`}
      >
        {/* Sticky Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between gap-4 px-4 lg:px-5 py-4 border-b glass-strong ${isDark ? 'bg-surface-900/90 border-surface-800' : 'bg-white/90 border-surface-200'
          }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDark ? 'bg-surface-800' : 'bg-surface-100'
              }`}>
              {job.logo}
            </div>
            <div className="min-w-0">
              <h2 className={`font-display font-bold text-lg truncate ${isDark ? 'text-white' : 'text-surface-900'}`}>
                {job.title}
              </h2>
              <p className={`text-sm truncate ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                {job.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`shrink-0 p-2 rounded-xl transition-colors cursor-pointer ${isDark ? 'hover:bg-surface-800 text-surface-400 hover:text-white' : 'hover:bg-surface-100 text-surface-400 hover:text-surface-900'
              }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-6 lg:px-8 py-6 lg:py-8 space-y-8">

            {/* Top Info Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${typeColors[job.type]}`}>
                {job.type}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-sm ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                <MapPin className="w-4 h-4" /> {job.location}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-sm ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                <DollarSign className="w-4 h-4" /> {job.salary}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-sm ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                <Clock className="w-4 h-4" /> {job.posted}
              </span>
              <span className={`inline-flex items-center gap-1.5 text-sm ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                <Users className="w-4 h-4" /> {job.applicants} applicants
              </span>
              <span className={`inline-flex items-center gap-1.5 text-sm ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                <GraduationCap className="w-4 h-4" /> {job.minQualification || "Any"} Minimum Education
              </span>
              <span className={`inline-flex items-center gap-1.5 text-sm ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                <Briefcase className="w-4 h-4" /> {job.experience} Years of Experience
              </span>
            </div>

            {/* Skill tags */}
            <div className="flex flex-wrap gap-2">
              {job.tags.map(tag => (
                <span key={tag} className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${isDark ? 'bg-primary-500/10 text-primary-300 border border-primary-500/20' : 'bg-primary-50 text-primary-600 border border-primary-200'
                  }`}>
                  {tag}
                </span>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Job Details */}
              <div className="lg:col-span-2 space-y-8">

                {/* About the Role */}
                <div>
                  <h3 className={`font-display font-bold text-lg mb-3 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                    About the Role
                  </h3>
                  <div className={`p-5 rounded-xl ${isDark ? 'bg-surface-800/40 text-surface-300' : 'bg-surface-50 text-surface-600'}`}>
                    <p className={`text-sm leading-relaxed`}>
                      {job.fullDescription}
                    </p>
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className={`font-display font-bold text-lg mb-3 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                    Responsibilities
                  </h3>
                  <ul className="space-y-2.5">
                    {job.responsibilities.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <ChevronRight className={`w-4 h-4 mt-0.5 shrink-0 text-primary-500`} />
                        <span className={`text-sm leading-relaxed ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className={`font-display font-bold text-lg mb-3 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                    Requirements
                  </h3>
                  <ul className="space-y-2.5">
                    {job.requirements.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-accent-500" />
                        <span className={`text-sm leading-relaxed ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company Info */}
                <div className={`rounded-xl p-5 ${isDark ? 'bg-surface-800/60 border border-surface-700/50' : 'bg-surface-50 border border-surface-200'
                  }`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Building2 className={`w-5 h-5 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                    <h3 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-surface-900'}`}>
                      About {job.company}
                    </h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                    {job.companyDescription}
                  </p>
                </div>

                {/* Application Card */}
                {isSignedIn && userRole?.toLowerCase() === 'candidate' && (
                  <div className={`rounded-2xl p-6 shadow-xl ${isDark ? 'bg-gradient-to-br from-surface-800 to-surface-900 border border-primary-500/20' : 'bg-white border border-primary-100 shadow-primary-500/5'
                    }`}>
                    <h3 className={`font-display font-bold text-xl mb-4 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                      Apply for this Role
                    </h3>

                    {!applied ? (
                      <div className="space-y-5">
                        {/* Note textarea */}
                        <div>
                          <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                            Add a note <span className={`font-normal ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>(optional)</span>
                          </label>
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={4}
                            placeholder="Introduce yourself, highlight relevant experience, or mention why you're excited about this role..."
                            className={`w-full px-4 py-3 rounded-xl text-sm outline-none border resize-none transition-colors ${isDark
                              ? 'bg-surface-950/80 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                              : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                              }`}
                          />
                          <p className={`text-xs mt-1 text-right ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>
                            {note.length}/500 characters
                          </p>
                        </div>

                        {(profileCompleteness < 90 || !candidateProfile?.resumeUrl) && (
                          <div className="p-4 mb-2 text-sm rounded-lg flex items-start gap-3 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                            <span className="shrink-0 text-xl">⚠️</span>
                            <div>
                              <strong className="block mb-1">Action Required</strong>
                              Only Candidates with at least 90% profile completeness and an uploaded CV can apply.
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handleApply}
                          disabled={applying || profileCompleteness < 90 || !candidateProfile?.resumeUrl}
                          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="w-5 h-5" />
                          {applying ? "Applying..." : "Submit Application"}
                        </button>
                      </div>
                    ) : (
                      /* Success state */
                      <div className="text-center py-8">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-accent-500/40">
                          <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <h4 className={`font-display font-bold text-2xl mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                          Application Sent!
                        </h4>
                        <p className={`text-base ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                          Your application has been submitted to {job.company}. You'll hear back within 5 business days.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Sidebar */}
              <div className="space-y-6">

                {/* AI Match Score Section */}
                {isSignedIn ? (
                  <>
                    <OverallMatchBadge score={analyzingMatch ? 0 : (aiAnalysis ? aiAnalysis.overallScore : job.aiScore)} isDark={isDark} />

                    {/* Skill Breakdown */}
                    <div className={`rounded-2xl p-5 ${isDark ? 'bg-surface-800/80 border border-surface-700/50' : 'bg-surface-50 border border-surface-200'
                      }`}>
                      <h3 className={`font-display font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                        {analyzingMatch ? "AI is analyzing your profile..." : "Skill Matching Breakdown"}
                      </h3>
                      <div className="space-y-4">
                        {analyzingMatch ? (
                          <div className="flex justify-center py-6">
                            <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                          </div>
                        ) : aiAnalysis ? (
                          // Render dynamic matching skills
                          <>
                            {(aiAnalysis.matchingSkills || []).map((s: string) => (
                              <SkillMatchBar key={s} skill={s} match={100} isDark={isDark} />
                            ))}
                            {(aiAnalysis.missingSkills || []).map((s: string) => (
                              <SkillMatchBar key={s} skill={s} match={0} isDark={isDark} />
                            ))}
                          </>
                        ) : (
                          // Fallback to static job data if no AI analysis
                          job.skillMatch.map(s => (
                            <SkillMatchBar key={s.skill} skill={s.skill} match={s.match} isDark={isDark} />
                          ))
                        )}
                      </div>
                    </div>
                    {/* Optional: Add AI Justification if generated */}
                    {aiAnalysis && aiAnalysis.justification && (
                      <div className={`rounded-2xl p-5 ${isDark ? 'bg-surface-800/80 border border-surface-700/50' : 'bg-surface-50 border border-surface-200'}`}>
                        <h3 className={`font-display font-bold text-sm mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>AI Match Context</h3>
                        <p className={`text-xs leading-relaxed ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{aiAnalysis.justification}</p>
                      </div>
                    )}

                    {/* Actionable Tips */}
                    {aiAnalysis && aiAnalysis.improvingFeedbacks && aiAnalysis.improvingFeedbacks.length > 0 && (
                      <div className={`rounded-2xl p-5 ${isDark ? 'bg-surface-800/80 border border-accent-500/30' : 'bg-accent-50 border border-accent-200'}`}>
                        <h3 className={`font-display font-bold text-sm mb-3 text-accent-500 flex items-center gap-1.5`}>
                          <GraduationCap className="w-4 h-4" />
                          Tips to Prepare & Improve
                        </h3>
                        <ul className="space-y-2">
                          {(aiAnalysis.improvingFeedbacks as string[]).map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-accent-500" />
                              <span className={`text-xs leading-relaxed ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  /* Sign-in gate */
                  <div className={`rounded-2xl p-6 text-center ${isDark ? 'bg-surface-800/80 border border-surface-700/50' : 'bg-surface-50 border border-surface-200'
                    }`}>
                    <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDark ? 'bg-surface-700' : 'bg-surface-200'
                      }`}>
                      <Lock className={`w-7 h-7 ${isDark ? 'text-surface-400' : 'text-surface-400'}`} />
                    </div>
                    <h3 className={`font-display font-bold text-base mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                      Sign in to see your match rate
                    </h3>
                    <p className={`text-sm mb-5 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                      Our AI compares your skills and qualifications against this job to give you a personalized compatibility score.
                    </p>
                    <button
                      onClick={openLogin}
                      className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 cursor-pointer"
                    >
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className={`text-xs mt-3 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>
                      Free account — no credit card required
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
