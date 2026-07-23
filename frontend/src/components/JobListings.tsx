import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, Clock, ArrowRight, Sparkles,
  Laptop, Wrench, Stethoscope, GraduationCap,
  Landmark, Users, Palette, ShoppingBag, Factory,
  Utensils, Grid, LucideIcon
} from 'lucide-react';
import { type Job } from '../data/jobs';
import JobDetail from './JobDetail';

export const categoriesList = [
  {
    name: 'IT & Technology',
    icon: Laptop,
    badgeBg: 'bg-cyan-500/10 border-cyan-500/20',
    iconColor: 'text-cyan-500',
    activeRing: 'ring-cyan-500 border-cyan-500 bg-cyan-500/15'
  },
  {
    name: 'Engineering',
    icon: Wrench,
    badgeBg: 'bg-blue-500/10 border-blue-500/20',
    iconColor: 'text-blue-500',
    activeRing: 'ring-blue-500 border-blue-500 bg-blue-500/15'
  },
  {
    name: 'Healthcare & Pharma',
    icon: Stethoscope,
    badgeBg: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-500',
    activeRing: 'ring-emerald-500 border-emerald-500 bg-emerald-500/15'
  },
  {
    name: 'Education',
    icon: GraduationCap,
    badgeBg: 'bg-purple-500/10 border-purple-500/20',
    iconColor: 'text-purple-500',
    activeRing: 'ring-purple-500 border-purple-500 bg-purple-500/15'
  },
  {
    name: 'Banking & Finance',
    icon: Landmark,
    badgeBg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-500',
    activeRing: 'ring-amber-500 border-amber-500 bg-amber-500/15'
  },
  {
    name: 'Human Resources',
    icon: Users, // Updated to Users icon for HR & People operations
    badgeBg: 'bg-rose-500/10 border-rose-500/20',
    iconColor: 'text-rose-500',
    activeRing: 'ring-rose-500 border-rose-500 bg-rose-500/15'
  },
  {
    name: 'Design & Marketing',
    icon: Palette,
    badgeBg: 'bg-pink-500/10 border-pink-500/20',
    iconColor: 'text-pink-500',
    activeRing: 'ring-pink-500 border-pink-500 bg-pink-500/15'
  },
  {
    name: 'Logistics & Supply Chain',
    icon: ShoppingBag,
    badgeBg: 'bg-orange-500/10 border-orange-500/20',
    iconColor: 'text-orange-500',
    activeRing: 'ring-orange-500 border-orange-500 bg-orange-500/15'
  },
  {
    name: 'Apparel & Manufacturing',
    icon: Factory,
    badgeBg: 'bg-teal-500/10 border-teal-500/20',
    iconColor: 'text-teal-500',
    activeRing: 'ring-teal-500 border-teal-500 bg-teal-500/15'
  },
  {
    name: 'Hospitality & Tourism',
    icon: Utensils, // Updated to Utensils icon for Hotels, Resorts & Food Services
    badgeBg: 'bg-indigo-500/10 border-indigo-500/20',
    iconColor: 'text-indigo-500',
    activeRing: 'ring-indigo-500 border-indigo-500 bg-indigo-500/15'
  },
  {
    name: 'Other',
    icon: Grid,
    badgeBg: 'bg-slate-500/10 border-slate-500/20',
    iconColor: 'text-slate-400',
    activeRing: 'ring-slate-400 border-slate-400 bg-slate-500/15'
  }
];

// Helper to normalize category strings for foolproof matching
const normalizeCategory = (category?: string): string => {
  if (!category) return 'other';
  const cat = category.toLowerCase().trim();
  if (cat.includes('human') || cat.includes('hr')) return 'human resources';
  if (cat.includes('hospitality') || cat.includes('tourism') || cat.includes('hotel')) return 'hospitality & tourism';
  if (cat.includes('media') || cat.includes('design')) return 'design & marketing';
  if (cat.includes('it') || cat.includes('technology') || cat.includes('tech')) return 'it & technology';
  if (cat.includes('marketing') || cat.includes('sales')) return 'design & marketing';
  if (cat.includes('e-commerce') || cat.includes('ecommerce') || cat.includes('logistics')) return 'logistics & supply chain';
  if (cat.includes('apparel') || cat.includes('manufacturing')) return 'apparel & manufacturing';
  if (cat.includes('finance') || cat.includes('banking')) return 'banking & finance';
  if (cat.includes('healthcare') || cat.includes('pharma')) return 'healthcare & pharma';
  return cat;
};

// Map normalized category names to Lucide icons
export const categoryIconMap: Record<string, LucideIcon> = {
  'it & technology': Laptop,
  'engineering': Wrench,
  'healthcare & pharma': Stethoscope,
  'education': GraduationCap,
  'banking & finance': Landmark,
  'human resources': Users,
  'design & marketing': Palette,
  'logistics & supply chain': ShoppingBag,
  'apparel & manufacturing': Factory,
  'hospitality & tourism': Utensils,
  'other': Grid,
};

// Distinct vibrant background colors for floating category badge
export const cardBadgeStyles: Record<string, { bg: string; text: string }> = {
  'it & technology': { bg: 'bg-cyan-500', text: 'text-white' },
  'engineering': { bg: 'bg-blue-500', text: 'text-white' },
  'healthcare & pharma': { bg: 'bg-emerald-500', text: 'text-white' },
  'education': { bg: 'bg-purple-500', text: 'text-white' },
  'banking & finance': { bg: 'bg-amber-500', text: 'text-white' },
  'human resources': { bg: 'bg-rose-500', text: 'text-white' },
  'design & marketing': { bg: 'bg-pink-500', text: 'text-white' },
  'logistics & supply chain': { bg: 'bg-orange-500', text: 'text-white' },
  'apparel & manufacturing': { bg: 'bg-teal-500', text: 'text-white' },
  'hospitality & tourism': { bg: 'bg-indigo-500', text: 'text-white' },
  'other': { bg: 'bg-slate-600', text: 'text-white' },
};

export function JobCard({ job, onClick }: { job: Job; onClick: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Normalize category key
  const normalizedCat = normalizeCategory(job.category);

  // Fetch matched style and icon
  const categoryStyle = cardBadgeStyles[normalizedCat] || cardBadgeStyles['other'];
  const CategoryIcon = categoryIconMap[normalizedCat] || Grid;

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col justify-between rounded-3xl pt-8 pb-6 px-6 transition-all duration-300 cursor-pointer ${isDark
        ? 'bg-surface-900 border border-surface-800 hover:border-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/5'
        : 'bg-white border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-slate-300/60'
        }`}
    >
      {/* Floating Top Left Badge with matched Category Icon */}
      <div
        className={`absolute -top-4 left-6 w-11 h-11 rounded-full flex items-center justify-center shadow-md shadow-slate-900/10 transition-transform duration-300 group-hover:scale-110 ${categoryStyle.bg} ${categoryStyle.text}`}
      >
        <CategoryIcon className="w-5 h-5 stroke-[2.2]" />
      </div>

      <div>
        <div className="flex justify-between items-start mb-2.5">
          {/* Job Title */}
          <h3
            className={`font-display font-bold text-lg leading-tight transition-colors ${isDark ? 'text-white group-hover:text-primary-400' : 'text-slate-900 group-hover:text-primary-600'}`}
          >
            {job.title}
          </h3>
          {(job as any).urgent && (
            <span className="shrink-0 flex items-center gap-1 pl-1.5 pr-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 dark:text-red-300 ring-1 ring-inset ring-red-500/25 ml-2">
            ⚡Urgent
            </span>
          )}
        </div>

        {/* Company & Meta Details */}
        <div className="space-y-1.5 mb-4">
          <div className={`flex items-center gap-1.5 text-xs font-medium ${isDark ? 'text-surface-400' : 'text-slate-400'}`}>
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{job.company} • {job.location}</span>
          </div>

          <div className={`flex items-center gap-1.5 text-xs font-medium ${isDark ? 'text-surface-400' : 'text-slate-400'}`}>
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{job.posted}</span>
          </div>
        </div>
      </div>

      {/* Progress & Bottom Info Section */}
      <div>
        {/* Subtle Horizontal Divider Line inside card */}
        <div className={`w-full h-px mb-4 ${isDark ? 'bg-surface-800' : 'bg-slate-100'}`} />

        {/* Bottom Row: Tags/Applicants & Percentage Score */}
        <div className="flex items-center justify-between gap-2">
          {/* Left: Employment Tag / Applicant Count */}
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isDark ? 'bg-surface-800 text-surface-300' : 'bg-slate-100 text-slate-600'
                }`}
            >
              {job.type}
            </span>
            {job.applicants > 0 && (
              <span className={`text-xs font-medium ${isDark ? 'text-surface-400' : 'text-slate-400'}`}>
                {job.applicants} applicants
              </span>
            )}
          </div>

          {/* Right: Bold Match Percentage */}
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function JobListings({ searchQuery = '', searchLocation = '' }: { searchQuery?: string, searchLocation?: string }) {
  const { theme } = useTheme();
  const { openJobs } = useAuth();
  const isDark = theme === 'dark';
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const filters = ['All', 'Full-time', 'Remote', 'Contract', 'Part-time'];

  const [jobsData, setJobsData] = useState<Job[]>([]);

  useEffect(() => {
    fetch('/api/jobs')
      .then((res) => res.json())
      .then((data: any[]) => {
        if (Array.isArray(data)) {
          const parsedJobs = data.map((j) => ({
            id: j.id,
            title: j.title || 'Untitled',
            company: j.companyName || 'Unknown Company',
            logo: j.companyName ? j.companyName[0] : 'C',
            location: j.location || 'Remote',
            type: (j.type || 'Full-time') as any,
            salary: j.salaryRange || 'Competitive',
            posted: j.postedDate ? new Date(j.postedDate).toLocaleDateString() : 'Recently',
            tags: j.skillsNeeded ? j.skillsNeeded.split(',').map((t: string) => t.trim()) : [],
            aiScore: 90,
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
            category: j.category || 'IT & Technology',
            minQualification: j.minQualification || 'Any',
            urgent: j.isUrgent || false,
          }));
          setJobsData(parsedJobs);
        }
      })
      .catch(console.error);
  }, []);

  const filteredJobs = jobsData.filter((j) => {
    const matchesFilterType = activeFilter === 'All' || j.type === activeFilter;
    const matchesCategory =
      !selectedCategory ||
      normalizeCategory(j.category) === normalizeCategory(selectedCategory);

    // Advanced Search Filter
    let matchesSearch = true;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      // NLP-ish heuristic: remove fluff words
      const removeWords = ["i am looking for a", "looking for", "i want", "job", "a", "an", "the"];
      let coreQuery = q;
      removeWords.forEach(w => {
        coreQuery = coreQuery.replace(new RegExp(`\\b${w}\\b`, 'gi'), '');
      });
      coreQuery = coreQuery.trim();
      if (!coreQuery) coreQuery = q; // fallback if stripped entirely

      const searchTerms = coreQuery.split(' ').filter(t => t.length > 0);

      const searchTarget = `
        ${j.title} 
        ${j.company} 
        ${j.tags.join(' ')} 
        ${j.category}
      `.toLowerCase();

      matchesSearch = searchTerms.some(term => searchTarget.includes(term));
    }

    let matchesLoc = true;
    if (searchLocation.trim() !== '') {
      matchesLoc = j.location.toLowerCase().includes(searchLocation.toLowerCase().trim());
    }

    return matchesFilterType && matchesCategory && matchesSearch && matchesLoc;
  });

  // Limit job cards to 24 (6 rows x 4 columns on desktop)
  const displayedJobs = filteredJobs.slice(0, 24);

  return (
    <>
      <section id="find-jobs" className={`relative py-16 lg:py-20 ${isDark ? 'bg-surface-950' : 'bg-slate-50/60'}`}>
        <div className="relative w-full px-6 sm:px-10 lg:px-16">
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isDark
                  ? 'bg-primary-300/10 border border-primary-300/20'
                  : 'bg-primary-50 border border-primary-200'
                  }`}
              >
                <span className={`text-sm font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
                  AI-Curated Listings
                </span>
              </div>
              <h2
                className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-surface-900'
                  }`}
              >
                Featured{' '}
                <span className="bg-gradient-to-r from-primary-300 to-accent-500 bg-clip-text text-transparent">
                  Job Openings
                </span>
              </h2>
              <p className={`text-lg max-w-2xl ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                Hand-picked and AI-ranked opportunities from top companies. Each listing comes with an AI compatibility score.
              </p>
            </div>

            <button
              onClick={openJobs}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Browse All Jobs
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Type Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${activeFilter === filter
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                    : isDark
                      ? 'bg-surface-800 text-surface-300 hover:bg-surface-700 border border-surface-700'
                      : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200'
                    }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs font-semibold text-primary-500 hover:underline cursor-pointer"
              >
                Clear Industry Filter ({selectedCategory}) ×
              </button>
            )}
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
            {categoriesList.map((cat) => {
              const IconComponent = cat.icon;
              const isSelected = selectedCategory === cat.name;

              return (
                <div
                  key={cat.name}
                  onClick={() => setSelectedCategory(isSelected ? null : cat.name)}
                  className={`group flex items-center gap-3 px-3.5 py-3 rounded-2xl transition-all duration-200 cursor-pointer hover:-translate-y-0.5 ${isSelected
                    ? `ring-2 ${cat.activeRing} shadow-lg`
                    : isDark
                      ? 'bg-surface-800/60 border border-surface-700/50 hover:border-surface-600'
                      : 'bg-white border border-surface-200 hover:border-surface-300 hover:shadow-md'
                    }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-110 ${cat.badgeBg}`}
                  >
                    <IconComponent className={`w-4 h-4 ${cat.iconColor}`} />
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

          {/* Smooth Horizontal Line Separator */}
          <div className="relative my-10">
            <div
              className={`h-px w-full bg-gradient-to-r ${isDark
                ? 'from-transparent via-surface-700 to-transparent'
                : 'from-transparent via-slate-200 to-transparent'
                }`}
            />
          </div>

          {/* Job Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
            {displayedJobs.map((job) => (
              <JobCard key={job.id} job={job} onClick={() => setSelectedJob(job)} />
            ))}
          </div>

          {/* Empty State */}
          {filteredJobs.length === 0 && (
            <div
              className={`text-center py-12 rounded-2xl border ${isDark
                ? 'bg-surface-800/30 border-surface-700 text-surface-400'
                : 'bg-white border-surface-200 text-surface-500'
                }`}
            >
              <p className="text-base font-bold">No job listings found matching your selected criteria.</p>
              <button
                onClick={() => {
                  setActiveFilter('All');
                  setSelectedCategory(null);
                }}
                className="mt-3 text-xs font-semibold text-primary-500 hover:underline cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Load More Button */}
          {filteredJobs.length > 24 && (
            <div className="text-center mt-12">
              <button
                onClick={openJobs}
                className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${isDark
                  ? 'bg-surface-800 text-surface-300 hover:bg-surface-700 border border-surface-700'
                  : 'bg-white text-surface-600 hover:bg-surface-100 border border-surface-200 shadow-sm'
                  }`}
              >
                Load More Jobs ({filteredJobs.length - 24} remaining)
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Job Detail Overlay */}
      {selectedJob && <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </>
  );
}