import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Search } from 'lucide-react';
import { type Job } from '../../data/jobs';
import JobDetail from '../../components/JobDetail';
import { categoriesList, JobCard } from '../../components/JobListings';

export default function JobsPage() {
  const { theme } = useTheme();
  const { goHome } = useAuth();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState('All');
  const [activeType, setActiveType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [jobsData, setJobsData] = useState<Job[]>([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const parsedJobs = data.map(j => ({
            id: j.id,
            title: j.title || 'Untitled',
            company: j.companyName || 'Unknown Company',
            logo: j.companyName ? j.companyName[0] : 'C',
            location: j.location || 'Remote',
            type: (j.type || 'Full-time') as any,
            salary: j.salaryRange || 'Competitive',
            posted: j.postedDate ? new Date(j.postedDate).toLocaleDateString() : 'Recently',
            tags: j.skillsNeeded ? j.skillsNeeded.split(',').map((t: string) => t.trim()) : [],
            aiScore: 90, // mock
            description: j.descriptionAboutTheRole || '',
            applicants: j.applicants || 0,
            fullDescription: j.descriptionAboutTheRole || '',
            responsibilities: j.responsibilities ? j.responsibilities.split('\n') : [],
            requirements: j.requirements ? j.requirements.split('\n') : [],
            benefits: [],
            experience: j.yearsOfExperienceNeeded || 'Any',
            department: 'General',
            companyDescription: j.descriptionAboutTheCompany || '',
            skillMatch: [],
            category: j.category || 'Engineering' // Mocking category for now since backend doesn't have it
          }));
          setJobsData(parsedJobs);
        }
      })
      .catch(console.error);
  }, []);

  const typeFilters = ['All', 'Full-time', 'Remote', 'Contract', 'Part-time'];

  const filteredJobs = jobsData.filter(job => {
    const matchCategory = activeCategory === 'All' || job.category === activeCategory;
    const matchType = activeType === 'All' || job.type === activeType;
    const matchSearch = !searchQuery.trim() ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchType && matchSearch;
  });

  return (
    <div className={`min-h-screen ${isDark ? 'bg-surface-950' : 'bg-surface-50'}`}>

      {/* ── Top Bar ──────────────────────────────────────────────── */}
      <div className={`sticky top-0 z-40 border-b glass-strong ${isDark ? 'bg-surface-950/90 border-surface-800' : 'bg-white/90 border-surface-200'
        }`}>
        <div className="w-full px-6 sm:px-10 lg:px-16 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={goHome} className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'text-surface-400 hover:text-white hover:bg-surface-800' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
              }`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className={`font-display text-lg font-bold ${isDark ? 'text-white' : 'text-surface-900'}`}>All Jobs</h1>
              <p className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>{filteredJobs.length} jobs found</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-16 py-6 space-y-6">

        {/* ── Search ─────────────────────────────────────────────── */}
        <div className={`rounded-xl p-2 flex items-center gap-2 ${isDark ? 'bg-surface-800/80 border border-surface-700/50' : 'bg-white border border-surface-200 shadow-sm'
          }`}>
          <Search className={`w-5 h-5 ml-3 shrink-0 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
          <input
            type="text"
            placeholder="Search by title, company, or skill..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`flex-1 bg-transparent text-sm outline-none py-2 ${isDark ? 'text-white placeholder:text-surface-500' : 'text-surface-900 placeholder:text-surface-400'}`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className={`text-xs px-3 py-1 rounded-lg cursor-pointer ${isDark ? 'text-surface-400 hover:text-white' : 'text-surface-500 hover:text-surface-900'
              }`}>Clear</button>
          )}
        </div>

        {/* ── Type filters ───────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Job Type</p>
            {activeCategory !== 'All' && (
              <button
                onClick={() => setActiveCategory('All')}
                className="text-xs font-semibold text-primary-500 hover:underline cursor-pointer"
              >
                Clear Industry Filter ({activeCategory}) ×
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {typeFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveType(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${activeType === f
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                  : isDark
                    ? 'bg-surface-800 text-surface-300 hover:bg-surface-700 border border-surface-700'
                    : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
                  }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Category Grid ─────────────────────────────────────── */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Industry</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
            {categoriesList.map((cat) => {
              const IconComponent = cat.icon;
              const isSelected = activeCategory === cat.name;

              return (
                <div
                  key={cat.name}
                  onClick={() => setActiveCategory(isSelected ? 'All' : cat.name)}
                  className={`group flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${isSelected
                    ? `ring-2 ${cat.activeRing || 'ring-primary-500 border-primary-500 bg-primary-500/15'} shadow-lg`
                    : isDark
                      ? 'bg-surface-800/60 border border-surface-700/50 hover:border-surface-600'
                      : 'bg-white border border-surface-200 hover:border-surface-300 hover:shadow-md'
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-110 ${cat.badgeBg || 'bg-primary-500/10 border-primary-500/20'}`}
                  >
                    <IconComponent className={`w-4 h-4 ${cat.iconColor || 'text-primary-500'}`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold truncate transition-colors ${isSelected
                        ? 'text-primary-500'
                        : isDark
                          ? 'text-surface-200 group-hover:text-white'
                          : 'text-surface-800 group-hover:text-surface-900'
                        }`}
                    >
                      {cat.name}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Smooth Horizontal Line Separator */}
        <div className="relative my-10">
          <div
            className={`h-px w-full bg-gradient-to-r ${isDark
              ? 'from-transparent via-surface-700 to-transparent'
              : 'from-transparent via-slate-200 to-transparent'
              }`}
          />
        </div>

        {/* ── Job Cards Grid ───────────────────────────────────── */}
        {filteredJobs.length === 0 ? (
          <div className={`rounded-2xl p-10 text-center ${isDark ? 'bg-surface-800/50 border border-surface-700' : 'bg-white border border-surface-200'
            }`}>
            <Search className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-surface-600' : 'text-surface-300'}`} />
            <p className={`font-display font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-surface-900'}`}>No jobs found</p>
            <p className={`text-sm mb-4 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Try adjusting your filters or search query.</p>
            <button
              onClick={() => {
                setActiveType('All');
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-primary-500 hover:underline cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>
        )}
      </div>

      {/* Job Detail Overlay */}
      {selectedJob && (
        <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
