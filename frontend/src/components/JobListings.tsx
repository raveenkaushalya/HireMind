import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Clock, ArrowRight, Sparkles,
  Users
} from 'lucide-react';
import { jobs, categories, type Job } from '../data/jobs';
import JobDetail from './JobDetail';

function AIScoreBadge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 95) return 'from-emerald-400 to-emerald-600';
    if (s >= 90) return 'from-blue-400 to-blue-600';
    if (s >= 85) return 'from-amber-400 to-amber-600';
    return 'from-orange-400 to-orange-600';
  };

  return (
    <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${getColor(score)} flex items-center justify-center shadow-lg`}>
      <span className="text-white font-bold text-sm">{score}</span>
      <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-primary-300" />
    </div>
  );
}

function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const typeColors: Record<string, string> = {
    'Full-time': isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
    'Remote': isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Contract': isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200',
    'Part-time': isDark ? 'bg-purple-500/15 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative rounded-2xl p-5 lg:p-6 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer ${
        isDark
          ? 'bg-surface-800/50 border border-surface-700/50 hover:border-primary-500/30 hover:bg-surface-800/80'
          : 'bg-white border border-surface-200 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/50'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Company Logo */}
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
          isDark ? 'bg-surface-700/80' : 'bg-surface-100'
        }`}>
          {job.logo}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h3 className={`font-display font-bold text-lg group-hover:text-primary-500 transition-colors ${
                isDark ? 'text-white' : 'text-surface-900'
              }`}>
                {job.title}
              </h3>
              <p className={`text-sm font-medium ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                {job.company}
              </p>
            </div>
            <AIScoreBadge score={job.aiScore} />
          </div>

          <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
            {job.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-flex items-center gap-1.5 text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
              <MapPin className="w-3.5 h-3.5" />
              {job.location}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
              <Clock className="w-3.5 h-3.5" />
              {job.posted}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
              <Users className="w-3.5 h-3.5" />
              {job.applicants} applicants
            </span>
          </div>

          {/* Tags & Price */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${typeColors[job.type]}`}>
                {job.type}
              </span>
              {job.tags.slice(0, 2).map(tag => (
                <span key={tag} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  isDark ? 'bg-surface-700/60 text-surface-300' : 'bg-surface-100 text-surface-600'
                }`}>
                  {tag}
                </span>
              ))}
              {job.tags.length > 2 && (
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                  isDark ? 'bg-surface-700/60 text-surface-400' : 'bg-surface-100 text-surface-500'
                }`}>
                  +{job.tags.length - 2}
                </span>
              )}
            </div>
            <span className={`text-sm font-bold whitespace-nowrap ${
              isDark ? 'text-accent-400' : 'text-accent-600'
            }`}>
              {job.salary}
            </span>
          </div>
        </div>
      </div>


    </div>
  );
}

export default function JobListings() {
  const { theme } = useTheme();
  const { openJobs } = useAuth();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const filters = ['All', 'Full-time', 'Remote', 'Contract', 'Part-time'];

  const filteredJobs = activeFilter === 'All'
    ? jobs
    : jobs.filter(j => j.type === activeFilter);

  return (
    <>
      <section id="find-jobs" className={`relative py-16 lg:py-20 ${isDark ? 'bg-surface-950' : 'bg-white'}`}>
        {/* Background */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-3xl ${
          isDark ? 'bg-primary-500/3' : 'bg-primary-50/50'
        }`} />

        <div className="relative w-full px-6 sm:px-10 lg:px-16">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                isDark
                  ? 'bg-primary-300/10 border border-primary-300/20'
                  : 'bg-primary-50 border border-primary-200'
              }`}>
                <span className={`text-sm font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
                  AI-Curated Listings
                </span>
              </div>
              <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${
                isDark ? 'text-white' : 'text-surface-900'
              }`}>
                Featured{' '}
                <span className="bg-gradient-to-r from-primary-300 to-accent-500 bg-clip-text text-transparent">
                  Job Openings
                </span>
              </h2>
              <p className={`text-lg max-w-2xl ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                Hand-picked and AI-ranked opportunities from top companies. Each listing comes with an AI compatibility score.
              </p>
            </div>

            <button onClick={openJobs} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer">
              Browse All Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : isDark
                        ? 'bg-surface-800 text-surface-300 hover:bg-surface-700 border border-surface-700'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200 border border-surface-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Categories Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {categories.map(cat => (
              <div
                key={cat.name}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer hover:-translate-y-0.5 ${
                  isDark
                    ? 'bg-surface-800/50 border border-surface-700/50 hover:border-surface-600'
                    : 'bg-surface-50 border border-surface-200 hover:border-surface-300 hover:shadow-md'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{cat.name}</p>
                  <p className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>{cat.count} jobs</p>
                </div>
              </div>
            ))}
          </div>

          {/* Job Cards Grid */}
          <div className="grid lg:grid-cols-2 gap-5">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>

          {/* Load More */}
          {filteredJobs.length > 0 && (
            <div className="text-center mt-10">
              <button
                onClick={openJobs}
                className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                isDark
                  ? 'bg-surface-800 text-surface-300 hover:bg-surface-700 border border-surface-700'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200 border border-surface-200'
              }`}>
                Load More Jobs
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Job Detail Overlay */}
      {selectedJob && (
        <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </>
  );
}
