import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, Search, MapPin, Sparkles,
  Clock, Users,
} from 'lucide-react';
import { type Job } from '../../data/jobs';
import JobDetail from '../../components/JobDetail';

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

  const categoriesList = [
    { name: 'Engineering', icon: '💻' },
    { name: 'Design', icon: '🎨' },
    { name: 'Product', icon: '📦' },
    { name: 'Marketing', icon: '📈' },
    { name: 'Sales', icon: '🤝' },
  ];

  const typeFilters = ['All', 'Full-time', 'Remote', 'Contract', 'Part-time'];
  const allCategories = ['All', ...categoriesList.map(c => c.name)];

  const filteredJobs = jobsData.filter(job => {
    const matchCategory = activeCategory === 'All' || job.category === activeCategory;
    const matchType = activeType === 'All' || job.type === activeType;
    const matchSearch = !searchQuery.trim() ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchType && matchSearch;
  });

  const groupedJobs: Record<string, Job[]> = {};
  filteredJobs.forEach(job => {
    if (!groupedJobs[job.category]) groupedJobs[job.category] = [];
    groupedJobs[job.category].push(job);
  });

  const typeColors: Record<string, string> = {
    'Full-time': isDark ? 'bg-blue-500/15 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
    'Remote': isDark ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    'Contract': isDark ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200',
    'Part-time': isDark ? 'bg-purple-500/15 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const categoryIcons: Record<string, string> = {};
  categoriesList.forEach(c => { categoryIcons[c.name] = c.icon; });

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

        {/* ── Category pills ─────────────────────────────────────── */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Category</p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeCategory === cat
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : isDark
                      ? 'bg-surface-800 text-surface-300 hover:bg-surface-700 border border-surface-700'
                      : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
                  }`}
              >
                {cat !== 'All' && <span>{categoryIcons[cat]}</span>}
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Type filters ───────────────────────────────────────── */}
        <div>
          <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Job Type</p>
          <div className="flex flex-wrap gap-2">
            {typeFilters.map(f => (
              <button
                key={f}
                onClick={() => setActiveType(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeType === f
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

        {/* ── Jobs by Category ───────────────────────────────────── */}
        {filteredJobs.length === 0 ? (
          <div className={`rounded-2xl p-10 text-center ${isDark ? 'bg-surface-800/50 border border-surface-700' : 'bg-white border border-surface-200'
            }`}>
            <Search className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-surface-600' : 'text-surface-300'}`} />
            <p className={`font-display font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-surface-900'}`}>No jobs found</p>
            <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Try adjusting your filters or search query.</p>
          </div>
        ) : (
          Object.entries(groupedJobs).map(([category, categoryJobs]) => (
            <div key={category}>
              {/* Category header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">{categoryIcons[category]}</span>
                <h2 className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-surface-900'}`}>{category}</h2>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-surface-800 text-surface-400' : 'bg-surface-200 text-surface-500'
                  }`}>{categoryJobs.length}</span>
              </div>

              {/* Job cards */}
              <div className="grid lg:grid-cols-2 gap-4 mb-8">
                {categoryJobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`group relative rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${isDark
                        ? 'bg-surface-800/60 border border-surface-700/50 hover:border-primary-500/30 hover:bg-surface-800/80'
                        : 'bg-white border border-surface-200 hover:border-primary-300 hover:shadow-xl hover:shadow-primary-100/50'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${isDark ? 'bg-surface-700/80' : 'bg-surface-100'
                        }`}>{job.logo}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <div>
                            <h3 className={`font-display font-bold text-sm group-hover:text-primary-500 transition-colors ${isDark ? 'text-white' : 'text-surface-900'
                              }`}>{job.title}</h3>
                            <p className={`text-xs font-medium ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{job.company}</p>
                          </div>
                          <div className={`relative w-10 h-10 rounded-lg bg-gradient-to-br ${job.aiScore >= 95 ? 'from-emerald-400 to-emerald-600' :
                              job.aiScore >= 90 ? 'from-blue-400 to-blue-600' :
                                job.aiScore >= 85 ? 'from-amber-400 to-amber-600' : 'from-orange-400 to-orange-600'
                            } flex items-center justify-center shadow-lg shrink-0`}>
                            <span className="text-white font-bold text-xs">{job.aiScore}</span>
                            <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-primary-300" />
                          </div>
                        </div>

                        <p className={`text-xs mb-3 line-clamp-1 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{job.description}</p>

                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className={`inline-flex items-center gap-1 text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                            <MapPin className="w-3 h-3" />{job.location}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                            <Clock className="w-3 h-3" />{job.posted}
                          </span>
                          <span className={`inline-flex items-center gap-1 text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                            <Users className="w-3 h-3" />{job.applicants}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${typeColors[job.type]}`}>{job.type}</span>
                            {job.tags.slice(0, 2).map(tag => (
                              <span key={tag} className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${isDark ? 'bg-surface-700/60 text-surface-300' : 'bg-surface-100 text-surface-600'
                                }`}>{tag}</span>
                            ))}
                          </div>
                          <span className={`text-xs font-bold whitespace-nowrap ${isDark ? 'text-accent-400' : 'text-accent-600'}`}>{job.salary}</span>
                        </div>
                      </div>
                    </div>


                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Job Detail Overlay */}
      {selectedJob && (
        <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}
