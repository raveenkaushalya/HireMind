import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, User, Mail, Phone, Briefcase, GraduationCap,
  FileText, Upload, X, Sparkles, CheckCircle2, AlertCircle,
  Link2, Edit3, Save, ChevronRight, Brain, BarChart3, Target,
  Zap, BookOpen, LayoutDashboard, Clock, Eye, XCircle,
  CalendarDays, Building2, ExternalLink,
} from 'lucide-react';

// ── Parsed Resume Data ────────────────────────────────────────────────
interface ParsedResume {
  summary: string;
  experience: { title: string; company: string; duration: string; highlights: string[] }[];
  education: { degree: string; school: string; year: string }[];
  skills: { name: string; level: number }[];
  certifications: string[];
  languages: string[];
  overallScore: number;
}

const mockParsedResume: ParsedResume = {
  summary: 'Highly motivated Full-Stack Developer with 5+ years of experience building scalable web applications. Proficient in React, Node.js, TypeScript, and cloud technologies. Passionate about clean code, performance optimization, and AI-driven solutions.',
  experience: [
    {
      title: 'Senior Frontend Developer',
      company: 'CloudScale Inc.',
      duration: 'Jan 2022 – Present',
      highlights: [
        'Led migration from JavaScript to TypeScript across 200K+ lines of code',
        'Reduced page load times by 40% through code-splitting and lazy loading',
        'Mentored 4 junior developers and conducted code reviews',
      ],
    },
    {
      title: 'Full Stack Developer',
      company: 'TechNova Solutions',
      duration: 'Mar 2019 – Dec 2021',
      highlights: [
        'Built RESTful APIs serving 1M+ requests/day using Node.js and Express',
        'Developed real-time dashboard with React and WebSocket integration',
        'Implemented CI/CD pipelines reducing deployment time by 60%',
      ],
    },
  ],
  education: [
    { degree: 'B.S. Computer Science', school: 'University of California, Berkeley', year: '2019' },
  ],
  skills: [
    { name: 'React', level: 95 },
    { name: 'TypeScript', level: 92 },
    { name: 'Node.js', level: 88 },
    { name: 'Python', level: 75 },
    { name: 'AWS', level: 80 },
    { name: 'PostgreSQL', level: 82 },
    { name: 'Docker', level: 70 },
    { name: 'GraphQL', level: 78 },
  ],
  certifications: ['AWS Solutions Architect – Associate', 'Meta Front-End Developer Professional Certificate'],
  languages: ['English (Native)', 'Spanish (Intermediate)'],
  overallScore: 87,
};

// ── Skill Bar ─────────────────────────────────────────────────────────
function SkillBar({ name, level, isDark }: { name: string; level: number; isDark: boolean }) {
  const getColor = (l: number) => {
    if (l >= 90) return 'from-emerald-400 to-emerald-500';
    if (l >= 80) return 'from-blue-400 to-blue-500';
    if (l >= 70) return 'from-amber-400 to-amber-500';
    return 'from-orange-400 to-orange-500';
  };
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{name}</span>
        <span className={`text-xs font-bold ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{level}%</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-surface-700' : 'bg-surface-200'}`}>
        <div className={`h-full rounded-full bg-gradient-to-r ${getColor(level)} transition-all duration-700`} style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

// ── Applied Jobs Data ─────────────────────────────────────────────────
type ApplicationStatus = 'Applied' | 'Under Review' | 'Interview' | 'Offered' | 'Rejected';

interface TimelineEvent {
  date: string;
  status: ApplicationStatus | 'Submitted';
  description: string;
}

interface RecruiterFeedback {
  from: string;
  role: string;
  date: string;
  message: string;
  rating: number; // 1-5
}

interface AppliedJob {
  id: number;
  title: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: ApplicationStatus;
  aiScore: number;
  type: string;
  lastUpdate: string;
  note: string;
  timeline: TimelineEvent[];
  feedback: RecruiterFeedback[];
}

const appliedJobs: AppliedJob[] = [
  {
    id: 1,
    title: 'Senior AI/ML Engineer',
    company: 'NeuralTech Labs',
    logo: '🧠',
    location: 'San Francisco, CA',
    salary: '$180K - $250K',
    appliedDate: 'Dec 15, 2025',
    status: 'Interview',
    aiScore: 96,
    type: 'Full-time',
    lastUpdate: '2 days ago',
    note: 'Technical interview round scheduled for Dec 22',
    timeline: [
      { date: 'Dec 15, 2025', status: 'Submitted', description: 'Application submitted successfully.' },
      { date: 'Dec 16, 2025', status: 'Under Review', description: 'Your resume is being reviewed by the hiring team.' },
      { date: 'Dec 18, 2025', status: 'Interview', description: 'You have been shortlisted for a technical interview. Scheduled for Dec 22.' },
    ],
    feedback: [
      { from: 'Sarah Lin', role: 'Senior Recruiter', date: 'Dec 18, 2025', message: 'Excellent profile! Your experience with PyTorch and large-scale ML systems is a great fit. Looking forward to the technical round.', rating: 5 },
      { from: 'David Chen', role: 'Engineering Manager', date: 'Dec 17, 2025', message: 'Strong resume — particularly impressed by the MLOps pipeline work. Would love to discuss architecture decisions during the interview.', rating: 4 },
    ],
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'CloudScale Inc.',
    logo: '☁️',
    location: 'New York, NY',
    salary: '$140K - $190K',
    appliedDate: 'Dec 12, 2025',
    status: 'Under Review',
    aiScore: 92,
    type: 'Remote',
    lastUpdate: '5 days ago',
    note: 'Resume under review by the hiring team',
    timeline: [
      { date: 'Dec 12, 2025', status: 'Submitted', description: 'Application submitted successfully.' },
      { date: 'Dec 14, 2025', status: 'Under Review', description: 'Your application is being reviewed by the engineering team.' },
    ],
    feedback: [
      { from: 'Emily Torres', role: 'Technical Recruiter', date: 'Dec 14, 2025', message: "Good match for the role. Your React and TypeScript skills align well. We'll get back to you within a week.", rating: 4 },
    ],
  },
  {
    id: 3,
    title: 'Product Designer',
    company: 'DesignFlow Studio',
    logo: '🎨',
    location: 'Austin, TX',
    salary: '$120K - $160K',
    appliedDate: 'Dec 10, 2025',
    status: 'Offered',
    aiScore: 89,
    type: 'Full-time',
    lastUpdate: '1 day ago',
    note: 'Offer letter sent — respond by Dec 24',
    timeline: [
      { date: 'Dec 10, 2025', status: 'Submitted', description: 'Application submitted successfully.' },
      { date: 'Dec 11, 2025', status: 'Under Review', description: 'Portfolio and resume under review.' },
      { date: 'Dec 13, 2025', status: 'Interview', description: 'Design challenge and culture-fit interview completed.' },
      { date: 'Dec 17, 2025', status: 'Offered', description: 'Congratulations! An offer letter has been sent to your email.' },
    ],
    feedback: [
      { from: 'Mark Rivera', role: 'Head of Design', date: 'Dec 17, 2025', message: 'We were blown away by your portfolio and design thinking. Your approach to design systems is exactly what we need. Welcome aboard!', rating: 5 },
      { from: 'Jessica Park', role: 'HR Manager', date: 'Dec 16, 2025', message: 'Great culture fit. Team really enjoyed the conversation during the interview. Offer details will follow shortly.', rating: 5 },
      { from: 'Alex Kim', role: 'Senior Designer', date: 'Dec 14, 2025', message: 'Loved the design challenge submission — clean, thoughtful, and well-documented. Strongly recommend moving forward.', rating: 5 },
    ],
  },
  {
    id: 4,
    title: 'DevOps Lead',
    company: 'InfraCore Systems',
    logo: '⚙️',
    location: 'Seattle, WA',
    salary: '$160K - $210K',
    appliedDate: 'Dec 8, 2025',
    status: 'Rejected',
    aiScore: 94,
    type: 'Full-time',
    lastUpdate: '4 days ago',
    note: 'Position filled with an internal candidate',
    timeline: [
      { date: 'Dec 8, 2025', status: 'Submitted', description: 'Application submitted successfully.' },
      { date: 'Dec 9, 2025', status: 'Under Review', description: 'Your profile is being evaluated.' },
      { date: 'Dec 14, 2025', status: 'Rejected', description: 'Unfortunately, the position has been filled with an internal candidate.' },
    ],
    feedback: [
      { from: 'Ryan Cooper', role: 'Talent Acquisition Lead', date: 'Dec 14, 2025', message: "Your Kubernetes and Terraform experience is impressive. The role was filled internally, but we'd love to keep you in our pipeline for future openings.", rating: 4 },
    ],
  },
  {
    id: 5,
    title: 'Data Scientist',
    company: 'QuantumData AI',
    logo: '📊',
    location: 'Boston, MA',
    salary: '$150K - $200K',
    appliedDate: 'Dec 5, 2025',
    status: 'Applied',
    aiScore: 91,
    type: 'Remote',
    lastUpdate: '1 week ago',
    note: '',
    timeline: [
      { date: 'Dec 5, 2025', status: 'Submitted', description: 'Application submitted successfully.' },
    ],
    feedback: [],
  },
  {
    id: 6,
    title: 'Mobile App Developer',
    company: 'AppNova Digital',
    logo: '📱',
    location: 'Los Angeles, CA',
    salary: '$130K - $175K',
    appliedDate: 'Dec 3, 2025',
    status: 'Under Review',
    aiScore: 87,
    type: 'Contract',
    lastUpdate: '3 days ago',
    note: 'Recruiter viewed your profile',
    timeline: [
      { date: 'Dec 3, 2025', status: 'Submitted', description: 'Application submitted successfully.' },
      { date: 'Dec 6, 2025', status: 'Under Review', description: 'A recruiter has viewed your profile and is reviewing your application.' },
    ],
    feedback: [
      { from: 'Nina Patel', role: 'Recruiter', date: 'Dec 6, 2025', message: "Solid React Native experience. We're evaluating a few candidates this week and will follow up soon.", rating: 3 },
    ],
  },
];

// ════════════════════════════════════════════════════════════════════════
export default function CandidateDashboard() {
  const { theme } = useTheme();
  const { username, goHome } = useAuth();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'resume'>('overview');
  const [editing, setEditing] = useState(false);
  const [resumeFile, setResumeFile] = useState<string | null>(null);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [parsing, setParsing] = useState(false);
  const [selectedJob, setSelectedJob] = useState<AppliedJob | null>(null);

  // Editable profile fields
  const [profile, setProfile] = useState({
    fullName: username || 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Senior Frontend Developer',
    experience: '5+ years',
    education: 'B.S. Computer Science, UC Berkeley',
    linkedin: 'https://linkedin.com/in/johndoe',
    bio: 'Passionate full-stack developer with expertise in React, TypeScript, and Node.js. I love building products that make a difference.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'PostgreSQL'],
  });

  const setField = (field: string, value: string) => setProfile(p => ({ ...p, [field]: value }));

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file.name);
      setParsed(null);
    }
  };

  const handleParse = () => {
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      setParsed(mockParsedResume);
    }, 2000);
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm outline-none border transition-colors ${
    isDark
      ? 'bg-surface-800 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
      : 'bg-white border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'
  }`;

  const cardCls = `rounded-2xl p-5 lg:p-6 ${
    isDark ? 'bg-surface-800/60 border border-surface-700/50' : 'bg-white border border-surface-200 shadow-sm'
  }`;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard },
    { id: 'profile' as const, label: 'My Profile', icon: User },
    { id: 'resume' as const, label: 'Resume / CV Parsing', icon: FileText },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-surface-950' : 'bg-surface-50'}`}>

      {/* ── Top Bar ────────────────────────────────────────────────── */}
      <div className={`sticky top-0 z-40 border-b glass-strong ${
        isDark ? 'bg-surface-950/90 border-surface-800' : 'bg-white/90 border-surface-200'
      }`}>
        <div className="w-full px-6 sm:px-10 lg:px-16 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={goHome} className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-surface-400 hover:text-white hover:bg-surface-800' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
            }`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`font-display text-lg font-bold ${isDark ? 'text-white' : 'text-surface-900'}`}>
                Candidate Dashboard
              </h1>
              <p className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>
                Welcome back, {username}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-primary-500/20">
              {username.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ─────────────────────────────────────────── */}
      <div className={`border-b ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
        <div className="w-full px-6 sm:px-10 lg:px-16 flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? `border-primary-500 ${isDark ? 'text-white' : 'text-primary-600'}`
                  : `border-transparent ${isDark ? 'text-surface-400 hover:text-surface-200' : 'text-surface-500 hover:text-surface-700'}`
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────── */}
      <div className="w-full px-6 sm:px-10 lg:px-16 py-6">

        {/* ═══════════ OVERVIEW TAB ═══════════ */}
        {activeTab === 'overview' && (() => {
          const statusConfig: Record<ApplicationStatus, { color: string; bg: string; icon: typeof CheckCircle2 }> = {
            'Applied': { color: isDark ? 'text-blue-400' : 'text-blue-600', bg: isDark ? 'bg-blue-500/15 border-blue-500/20' : 'bg-blue-50 border-blue-200', icon: Clock },
            'Under Review': { color: isDark ? 'text-amber-400' : 'text-amber-600', bg: isDark ? 'bg-amber-500/15 border-amber-500/20' : 'bg-amber-50 border-amber-200', icon: Eye },
            'Interview': { color: isDark ? 'text-purple-400' : 'text-purple-600', bg: isDark ? 'bg-purple-500/15 border-purple-500/20' : 'bg-purple-50 border-purple-200', icon: CalendarDays },
            'Offered': { color: isDark ? 'text-emerald-400' : 'text-emerald-600', bg: isDark ? 'bg-emerald-500/15 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
            'Rejected': { color: isDark ? 'text-red-400' : 'text-red-600', bg: isDark ? 'bg-red-500/15 border-red-500/20' : 'bg-red-50 border-red-200', icon: XCircle },
          };

          const counts = {
            total: appliedJobs.length,
            applied: appliedJobs.filter(j => j.status === 'Applied').length,
            review: appliedJobs.filter(j => j.status === 'Under Review').length,
            interview: appliedJobs.filter(j => j.status === 'Interview').length,
            offered: appliedJobs.filter(j => j.status === 'Offered').length,
            rejected: appliedJobs.filter(j => j.status === 'Rejected').length,
          };

          const summaryCards = [
            { label: 'Total Applied', value: counts.total, icon: Briefcase, gradient: 'from-primary-500 to-primary-600', shadow: 'shadow-primary-500/20' },
            { label: 'Under Review', value: counts.review, icon: Eye, gradient: 'from-amber-500 to-amber-600', shadow: 'shadow-amber-500/20' },
            { label: 'Interviews', value: counts.interview, icon: CalendarDays, gradient: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20' },
            { label: 'Offers', value: counts.offered, icon: CheckCircle2, gradient: 'from-emerald-500 to-emerald-600', shadow: 'shadow-emerald-500/20' },
          ];

          return (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryCards.map(card => (
                  <div key={card.label} className={cardCls}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg ${card.shadow}`}>
                        <card.icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <p className={`font-display text-2xl lg:text-3xl font-bold ${isDark ? 'text-white' : 'text-surface-900'}`}>{card.value}</p>
                    <p className={`text-xs font-medium mt-1 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Application pipeline visual */}
              <div className={cardCls}>
                <h3 className={`font-display font-bold text-base mb-4 ${isDark ? 'text-white' : 'text-surface-900'}`}>Application Pipeline</h3>
                <div className="flex items-center gap-1 h-3 rounded-full overflow-hidden">
                  {counts.applied > 0 && <div className="h-full bg-blue-500 transition-all" style={{ flex: counts.applied }} />}
                  {counts.review > 0 && <div className="h-full bg-amber-500 transition-all" style={{ flex: counts.review }} />}
                  {counts.interview > 0 && <div className="h-full bg-purple-500 transition-all" style={{ flex: counts.interview }} />}
                  {counts.offered > 0 && <div className="h-full bg-emerald-500 transition-all" style={{ flex: counts.offered }} />}
                  {counts.rejected > 0 && <div className="h-full bg-red-500 transition-all" style={{ flex: counts.rejected }} />}
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3">
                  {[
                    { label: 'Applied', color: 'bg-blue-500', count: counts.applied },
                    { label: 'Under Review', color: 'bg-amber-500', count: counts.review },
                    { label: 'Interview', color: 'bg-purple-500', count: counts.interview },
                    { label: 'Offered', color: 'bg-emerald-500', count: counts.offered },
                    { label: 'Rejected', color: 'bg-red-500', count: counts.rejected },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-1.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                      <span className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{item.label} ({item.count})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applied Jobs List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-surface-900'}`}>Applied Jobs</h3>
                  <span className={`text-xs font-medium ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>{appliedJobs.length} applications</span>
                </div>

                <div className="space-y-3">
                  {appliedJobs.map(job => {
                    const sc = statusConfig[job.status];
                    const StatusIcon = sc.icon;
                    return (
                      <div key={job.id} onClick={() => setSelectedJob(job)} className={`${cardCls} group hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          {/* Left — Job info */}
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                              isDark ? 'bg-surface-700/80' : 'bg-surface-100'
                            }`}>
                              {job.logo}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}>{job.title}</h4>
                                <ExternalLink className={`w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                              </div>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className={`text-xs flex items-center gap-1 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                                  <Building2 className="w-3 h-3" />{job.company}
                                </span>
                                <span className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>·</span>
                                <span className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{job.location}</span>
                                <span className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>·</span>
                                <span className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{job.type}</span>
                              </div>
                              {job.note && (
                                <p className={`text-xs mt-1.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>
                                  💬 {job.note}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right — Status, score, meta */}
                          <div className="flex items-center gap-3 sm:gap-4 shrink-0 sm:flex-col sm:items-end">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${sc.bg}`}>
                              <StatusIcon className={`w-3 h-3 ${sc.color}`} />
                              <span className={sc.color}>{job.status}</span>
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <p className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>AI Score</p>
                                <p className={`text-sm font-bold ${isDark ? 'text-accent-400' : 'text-accent-600'}`}>{job.aiScore}%</p>
                              </div>
                              <div className="text-right">
                                <p className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Applied</p>
                                <p className={`text-xs font-medium ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{job.appliedDate}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ═══════════ PROFILE TAB ═══════════ */}
        {activeTab === 'profile' && (
          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left column — Profile card */}
            <div className="lg:col-span-1 space-y-5">
              {/* Avatar card */}
              <div className={`${cardCls} text-center`}>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg shadow-primary-500/20">
                  {profile.fullName.charAt(0).toUpperCase()}
                </div>
                <h2 className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-surface-900'}`}>{profile.fullName}</h2>
                <p className={`text-sm ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{profile.title}</p>
                <p className={`text-xs mt-1 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{profile.location}</p>

                <div className={`mt-4 pt-4 border-t space-y-2.5 text-left ${isDark ? 'border-surface-700' : 'border-surface-200'}`}>
                  <div className="flex items-center gap-2.5">
                    <Mail className={`w-4 h-4 shrink-0 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                    <span className={`text-sm truncate ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className={`w-4 h-4 shrink-0 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                    <span className={`text-sm ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{profile.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Link2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                    <span className={`text-sm truncate text-primary-500`}>{profile.linkedin}</span>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className={cardCls}>
                <h3 className={`font-display font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-surface-900'}`}>Profile Strength</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Profile completeness', value: 85, icon: Target },
                    { label: 'AI match readiness', value: 92, icon: Brain },
                    { label: 'Resume score', value: parsed ? parsed.overallScore : 0, icon: BarChart3 },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <stat.icon className={`w-3.5 h-3.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                          <span className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{stat.label}</span>
                        </div>
                        <span className={`text-xs font-bold ${stat.value > 0 ? (isDark ? 'text-accent-400' : 'text-accent-600') : (isDark ? 'text-surface-600' : 'text-surface-300')}`}>
                          {stat.value > 0 ? `${stat.value}%` : '—'}
                        </span>
                      </div>
                      <div className={`h-1.5 rounded-full ${isDark ? 'bg-surface-700' : 'bg-surface-200'}`}>
                        <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700" style={{ width: `${stat.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className={cardCls}>
                <h3 className={`font-display font-bold text-sm mb-3 ${isDark ? 'text-white' : 'text-surface-900'}`}>Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map(s => (
                    <span key={s} className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      isDark ? 'bg-primary-500/15 text-primary-300 border border-primary-500/20' : 'bg-primary-50 text-primary-600 border border-primary-200'
                    }`}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column — Editable details */}
            <div className="lg:col-span-2 space-y-5">
              <div className={cardCls}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-surface-900'}`}>Personal Details</h3>
                  <button
                    onClick={() => setEditing(!editing)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      editing
                        ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25'
                        : isDark
                          ? 'bg-surface-700 text-surface-300 hover:bg-surface-600'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    }`}
                  >
                    {editing ? <><Save className="w-4 h-4" /> Save</> : <><Edit3 className="w-4 h-4" /> Edit</>}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Full Name</label>
                      {editing ? (
                        <input value={profile.fullName} onChange={e => setField('fullName', e.target.value)} className={inputCls} />
                      ) : (
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-surface-900'}`}>{profile.fullName}</p>
                      )}
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Email</label>
                      {editing ? (
                        <input value={profile.email} onChange={e => setField('email', e.target.value)} className={inputCls} />
                      ) : (
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-surface-900'}`}>{profile.email}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Phone</label>
                      {editing ? (
                        <input value={profile.phone} onChange={e => setField('phone', e.target.value)} className={inputCls} />
                      ) : (
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-surface-900'}`}>{profile.phone}</p>
                      )}
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Location</label>
                      {editing ? (
                        <input value={profile.location} onChange={e => setField('location', e.target.value)} className={inputCls} />
                      ) : (
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-surface-900'}`}>{profile.location}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Job Title</label>
                      {editing ? (
                        <input value={profile.title} onChange={e => setField('title', e.target.value)} className={inputCls} />
                      ) : (
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-surface-900'}`}>{profile.title}</p>
                      )}
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Experience</label>
                      {editing ? (
                        <input value={profile.experience} onChange={e => setField('experience', e.target.value)} className={inputCls} />
                      ) : (
                        <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-surface-900'}`}>{profile.experience}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Education</label>
                    {editing ? (
                      <input value={profile.education} onChange={e => setField('education', e.target.value)} className={inputCls} />
                    ) : (
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-surface-900'}`}>{profile.education}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>LinkedIn</label>
                    {editing ? (
                      <input value={profile.linkedin} onChange={e => setField('linkedin', e.target.value)} className={inputCls} />
                    ) : (
                      <p className="text-sm font-medium text-primary-500">{profile.linkedin}</p>
                    )}
                  </div>
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Bio</label>
                    {editing ? (
                      <textarea value={profile.bio} onChange={e => setField('bio', e.target.value)} rows={3}
                        className={`${inputCls} resize-none`} />
                    ) : (
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{profile.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ RESUME / CV PARSING TAB ═══════════ */}
        {activeTab === 'resume' && (
          <div className="space-y-6">

            {/* Upload Section */}
            <div className={cardCls}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-surface-900'}`}>Upload Your Resume / CV</h3>
                  <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Our AI will parse and extract key information automatically</p>
                </div>
              </div>

              {!resumeFile ? (
                <label className={`flex flex-col items-center justify-center w-full h-48 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${
                  isDark
                    ? 'border-surface-700 bg-surface-800/30 hover:border-primary-500/50 hover:bg-surface-800/60'
                    : 'border-surface-300 bg-surface-50 hover:border-primary-400 hover:bg-surface-100'
                }`}>
                  <Upload className={`w-12 h-12 mb-3 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <p className={`text-sm font-semibold mb-1 ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                    Drop your resume here or click to browse
                  </p>
                  <p className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>
                    PDF, DOCX, or TXT — max 5MB
                  </p>
                  <input type="file" className="hidden" accept=".pdf,.docx,.doc,.txt" onChange={handleResumeUpload} />
                </label>
              ) : (
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-4 rounded-xl ${
                    isDark ? 'bg-surface-700/50 border border-surface-600' : 'bg-surface-50 border border-surface-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-primary-500/15' : 'bg-primary-50'}`}>
                        <FileText className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{resumeFile}</p>
                        <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                          {parsed ? 'Parsed successfully' : 'Ready to parse'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!parsed && (
                        <button onClick={handleParse} disabled={parsing}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all cursor-pointer disabled:opacity-60">
                          {parsing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4" />
                          )}
                          {parsing ? 'Parsing...' : 'Parse with AI'}
                        </button>
                      )}
                      <button onClick={() => { setResumeFile(null); setParsed(null); }}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-surface-600 text-surface-400' : 'hover:bg-surface-200 text-surface-500'}`}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {parsing && (
                    <div className={`rounded-xl p-5 text-center ${isDark ? 'bg-surface-800/50 border border-surface-700' : 'bg-surface-50 border border-surface-200'}`}>
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg shadow-primary-500/30">
                        <Brain className="w-8 h-8 text-white" />
                      </div>
                      <p className={`font-display font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                        AI is analyzing your resume…
                      </p>
                      <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                        Extracting skills, experience, education, and more
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Parsed Results */}
            {parsed && (
              <>
                {/* Score Banner */}
                <div className={`rounded-2xl overflow-hidden ${
                  isDark ? 'bg-gradient-to-r from-primary-900/50 to-accent-900/30 border border-surface-700' : 'bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200'
                }`}>
                  <div className="p-5 lg:p-6 flex flex-col sm:flex-row items-center gap-5">
                    <div className="relative w-24 h-24 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="44" fill="none" stroke={isDark ? '#1e293b' : '#e2e8f0'} strokeWidth="7" />
                        <circle cx="50" cy="50" r="44" fill="none" stroke="#6366f1" strokeWidth="7" strokeLinecap="round"
                          strokeDasharray={2 * Math.PI * 44} strokeDashoffset={2 * Math.PI * 44 * (1 - parsed.overallScore / 100)}
                          className="transition-all duration-1000" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`font-display text-2xl font-bold ${isDark ? 'text-white' : 'text-primary-600'}`}>{parsed.overallScore}</span>
                        <span className={`text-[10px] font-medium ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>/ 100</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-5 h-5 text-primary-500" />
                        <h3 className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-surface-900'}`}>AI Resume Score</h3>
                      </div>
                      <p className={`text-sm leading-relaxed ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                        Your resume demonstrates strong technical skills and measurable achievements. Consider adding more quantified outcomes and industry keywords to improve your score further.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Parsed Sections Grid */}
                <div className="grid lg:grid-cols-2 gap-6">

                  {/* Summary */}
                  <div className={`${cardCls} lg:col-span-2`}>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className={`w-4 h-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                      <h3 className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}>Professional Summary</h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{parsed.summary}</p>
                  </div>

                  {/* Experience */}
                  <div className={cardCls}>
                    <div className="flex items-center gap-2 mb-4">
                      <Briefcase className={`w-4 h-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                      <h3 className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}>Work Experience</h3>
                    </div>
                    <div className="space-y-5">
                      {parsed.experience.map((exp, i) => (
                        <div key={i} className={i > 0 ? `pt-4 border-t ${isDark ? 'border-surface-700' : 'border-surface-200'}` : ''}>
                          <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}>{exp.title}</p>
                          <p className={`text-xs mb-2 ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>{exp.company} · {exp.duration}</p>
                          <ul className="space-y-1.5">
                            {exp.highlights.map((h, j) => (
                              <li key={j} className="flex items-start gap-2">
                                <ChevronRight className="w-3 h-3 mt-1 text-accent-500 shrink-0" />
                                <span className={`text-xs leading-relaxed ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className={cardCls}>
                    <div className="flex items-center gap-2 mb-4">
                      <Zap className={`w-4 h-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                      <h3 className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}>Extracted Skills</h3>
                    </div>
                    <div className="space-y-3">
                      {parsed.skills.map(s => (
                        <SkillBar key={s.name} name={s.name} level={s.level} isDark={isDark} />
                      ))}
                    </div>
                  </div>

                  {/* Education */}
                  <div className={cardCls}>
                    <div className="flex items-center gap-2 mb-4">
                      <GraduationCap className={`w-4 h-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                      <h3 className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}>Education</h3>
                    </div>
                    {parsed.education.map((ed, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-accent-500 shrink-0 mt-0.5" />
                        <div>
                          <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{ed.degree}</p>
                          <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{ed.school} · {ed.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Certifications & Languages */}
                  <div className={cardCls}>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className={`w-4 h-4 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                      <h3 className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}>Certifications & Languages</h3>
                    </div>
                    {parsed.certifications.length > 0 && (
                      <div className="mb-4">
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Certifications</p>
                        <div className="space-y-2">
                          {parsed.certifications.map((c, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent-500 shrink-0 mt-0.5" />
                              <span className={`text-sm ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{c}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {parsed.languages.length > 0 && (
                      <div>
                        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Languages</p>
                        <div className="flex flex-wrap gap-2">
                          {parsed.languages.map(l => (
                            <span key={l} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              isDark ? 'bg-surface-700 text-surface-300' : 'bg-surface-100 text-surface-600'
                            }`}>{l}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Suggestions */}
                <div className={`rounded-2xl p-5 lg:p-6 ${
                  isDark ? 'bg-amber-500/5 border border-amber-500/15' : 'bg-amber-50 border border-amber-200'
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <h3 className={`font-display font-bold text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}>AI Improvement Suggestions</h3>
                  </div>
                  <ul className="space-y-2">
                    {[
                      'Add more quantified achievements (e.g., "Increased revenue by 30%")',
                      'Include relevant industry keywords for better ATS compatibility',
                      'Consider adding a "Projects" section to showcase personal work',
                      'Your Python skill can be strengthened — consider adding recent projects or certifications',
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 mt-0.5 text-amber-500 shrink-0" />
                        <span className={`text-sm ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* ═══════════ APPLICATION DETAIL POPUP ═══════════ */}
      {selectedJob && (() => {
        const tlColors: Record<string, string> = {
          'Submitted': 'bg-blue-500',
          'Applied': 'bg-blue-500',
          'Under Review': 'bg-amber-500',
          'Interview': 'bg-purple-500',
          'Offered': 'bg-emerald-500',
          'Rejected': 'bg-red-500',
        };

        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
            <div className={`relative w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col ${
              isDark ? 'bg-surface-900 border border-surface-700' : 'bg-white border border-surface-200'
            }`}>

              {/* Header */}
              <div className={`sticky top-0 z-10 px-5 lg:px-6 py-4 border-b glass-strong ${
                isDark ? 'bg-surface-900/90 border-surface-800' : 'bg-white/90 border-surface-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      isDark ? 'bg-surface-800' : 'bg-surface-100'
                    }`}>
                      {selectedJob.logo}
                    </div>
                    <div className="min-w-0">
                      <h2 className={`font-display font-bold text-base truncate ${isDark ? 'text-white' : 'text-surface-900'}`}>{selectedJob.title}</h2>
                      <p className={`text-xs truncate ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{selectedJob.company} · {selectedJob.location}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedJob(null)} className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
                    isDark ? 'hover:bg-surface-800 text-surface-400' : 'hover:bg-surface-100 text-surface-500'
                  }`}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-5 lg:px-6 py-5 space-y-6">

                {/* Job quick info */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                    isDark ? 'bg-primary-500/15 text-primary-400 border-primary-500/20' : 'bg-primary-50 text-primary-600 border-primary-200'
                  }`}>{selectedJob.type}</span>
                  <span className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{selectedJob.salary}</span>
                  <span className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>·</span>
                  <span className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Applied {selectedJob.appliedDate}</span>
                  <span className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>·</span>
                  <span className={`text-xs font-bold ${isDark ? 'text-accent-400' : 'text-accent-600'}`}>AI Score: {selectedJob.aiScore}%</span>
                </div>

                {/* ── Timeline ───────────────────────────────── */}
                <div>
                  <h3 className={`font-display font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-surface-900'}`}>Application Timeline</h3>
                  <div className="relative ml-3">
                    {selectedJob.timeline.map((event, i) => {
                      const isLast = i === selectedJob.timeline.length - 1;
                      const dotColor = tlColors[event.status] || 'bg-blue-500';
                      return (
                        <div key={i} className="flex gap-4 pb-6 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full shrink-0 ring-4 ${dotColor} ${isDark ? 'ring-surface-900' : 'ring-white'}`} />
                            {!isLast && <div className={`w-0.5 flex-1 mt-1 ${isDark ? 'bg-surface-700' : 'bg-surface-300'}`} />}
                          </div>
                          <div className="-mt-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{event.status}</span>
                              <span className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>{event.date}</span>
                            </div>
                            <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{event.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Recruiter Feedback ─────────────────────── */}
                <div>
                  <h3 className={`font-display font-bold text-sm mb-4 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                    Recruiter Feedback
                    {selectedJob.feedback.length > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        isDark ? 'bg-primary-500/15 text-primary-400' : 'bg-primary-50 text-primary-600'
                      }`}>{selectedJob.feedback.length}</span>
                    )}
                  </h3>

                  {selectedJob.feedback.length === 0 ? (
                    <div className={`rounded-xl p-5 text-center ${
                      isDark ? 'bg-surface-800/50 border border-surface-700' : 'bg-surface-50 border border-surface-200'
                    }`}>
                      <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>No feedback from recruiters yet. Check back later.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedJob.feedback.map((fb, i) => (
                        <div key={i} className={`rounded-xl p-4 ${
                          isDark ? 'bg-surface-800/60 border border-surface-700/50' : 'bg-surface-50 border border-surface-200'
                        }`}>
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                isDark ? 'bg-primary-500/20 text-primary-300' : 'bg-primary-100 text-primary-600'
                              }`}>
                                {fb.from.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{fb.from}</p>
                                <p className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>{fb.role}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, s) => (
                                  <svg key={s} className={`w-3 h-3 ${s < fb.rating ? 'fill-amber-400 text-amber-400' : isDark ? 'fill-surface-700 text-surface-700' : 'fill-surface-200 text-surface-200'}`} viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className={`text-[10px] ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>{fb.date}</span>
                            </div>
                          </div>
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{fb.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
