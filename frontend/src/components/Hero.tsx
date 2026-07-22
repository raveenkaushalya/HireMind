import { useTheme } from '../context/ThemeContext';
import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function Hero() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className={`relative min-h-screen flex items-center overflow-hidden pt-20 ${
      isDark ? 'bg-surface-950' : 'bg-white'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className={`absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl animate-float ${
          isDark ? 'bg-primary-600/10' : 'bg-primary-200/40'
        }`} />
        <div className={`absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-3xl animate-float-delayed ${
          isDark ? 'bg-primary-300/5' : 'bg-primary-100/30'
        }`} />
        <div className={`absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full blur-3xl ${
          isDark ? 'bg-primary-500/5' : 'bg-primary-100/50'
        }`} />

        {/* Grid Pattern */}
        <div className={`absolute inset-0 ${isDark ? 'opacity-[0.03]' : 'opacity-[0.04]'}`}
          style={{
            backgroundImage: `radial-gradient(circle, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative w-full px-6 sm:px-10 lg:px-16 py-8 lg:py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-slide-up">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${
              isDark
                ? 'bg-primary-500/10 border border-primary-500/20'
                : 'bg-primary-50 border border-primary-200'
            }`}>
              <span className={`text-sm font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
                #1 AI-Powered Recruitment Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 ${
              isDark ? 'text-white' : 'text-surface-900'
            }`}>
              Get Hired and Hire Smarter
              <br />
              with{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-primary-300 via-primary-500 to-accent-500 bg-clip-text text-transparent animate-gradient">
                  AI-Powered
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 8C50 2 250 2 298 8" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                      <stop stopColor="#FDD017" />
                      <stop offset="1" stopColor="#F97316" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              {' '}Recruitment
            </h1>

            <p className={`text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto ${
              isDark ? 'text-surface-400' : 'text-surface-500'
            }`}>
              Connect top talent with dream companies using our advanced AI matching engine. 
              Resume scoring, intelligent job matching, and smart search all in one platform.
            </p>

            {/* Search Bar */}
            <div className={`rounded-2xl p-2 mb-8 shadow-2xl ${
              isDark
                ? 'bg-surface-800/80 border border-surface-700/50 shadow-black/20'
                : 'bg-white border border-surface-200 shadow-surface-200/50'
            }`}>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-3 px-4 py-2">
                  <Search className={`w-5 h-5 shrink-0 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type="text"
                    placeholder="Job title, skill, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full bg-transparent text-sm outline-none placeholder:text-surface-400 ${
                      isDark ? 'text-white' : 'text-surface-900'
                    }`}
                  />
                </div>
                <div className={`hidden sm:flex items-center gap-3 px-4 py-2 border-l ${
                  isDark ? 'border-surface-700' : 'border-surface-200'
                }`}>
                  <MapPin className={`w-5 h-5 shrink-0 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type="text"
                    placeholder="Location"
                    className={`w-full bg-transparent text-sm outline-none placeholder:text-surface-400 ${
                      isDark ? 'text-white' : 'text-surface-900'
                    }`}
                  />
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 cursor-pointer">
                  <Search className="w-4 h-4" />
                  Search Jobs
                </button>
              </div>
            </div>

            {/* Quick Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className={`text-sm ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Popular:</span>
              {['AI Engineer', 'React Developer', 'Product Manager', 'UX Designer'].map(tag => (
                <button
                  key={tag}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    isDark
                      ? 'bg-surface-800 text-surface-300 hover:bg-surface-700 border border-surface-700'
                      : 'bg-surface-100 text-surface-600 hover:bg-surface-200 border border-surface-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
