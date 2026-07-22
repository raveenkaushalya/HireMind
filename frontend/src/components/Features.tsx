import { useTheme } from '../context/ThemeContext';
import {
  Trophy,
  FileCheck,
  Target,
  Zap,
  ShieldCheck,
  BarChart3,
} from 'lucide-react';

const features = [
  {
    icon: Trophy,
    title: 'AI Candidate Scoring',
    description: 'Our AI analyzes candidate profiles against job requirements, providing a comprehensive compatibility score from 0-100 with detailed breakdowns.',
    highlight: '96% accuracy',
  },
  {
    icon: FileCheck,
    title: 'Smart Resume Matching',
    description: 'Upload job descriptions and let our AI instantly match and rank the best fit candidates from your talent pool using NLP and deep learning.',
    highlight: '10x faster',
  },
  {
    icon: Target,
    title: 'Precision Job Search',
    description: 'Our advanced algorithm considers skills, experience, culture fit, and career goals to surface the most relevant opportunities for candidates.',
    highlight: '85% match rate',
  },
  {
    icon: Zap,
    title: 'Instant Screening',
    description: 'Automate initial candidate screening with AI-powered assessments that evaluate technical skills, soft skills, and cultural alignment.',
    highlight: '70% time saved',
  },
  {
    icon: ShieldCheck,
    title: 'Bias-Free Hiring',
    description: 'Our AI is designed to reduce unconscious bias in the hiring process, focusing purely on skills and qualifications for fair evaluation.',
    highlight: 'DEI focused',
  },
  {
    icon: BarChart3,
    title: 'Recruitment Analytics',
    description: 'Get deep insights into your hiring pipeline with real time dashboards, conversion metrics, and AI-powered recommendations.',
    highlight: 'Real time data',
  },
];

export default function Features() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="ai-features" className={`relative py-16 lg:py-20 overflow-hidden ${
      isDark ? 'bg-surface-900' : 'bg-surface-50'
    }`}>
      {/* Background */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl ${
        isDark ? 'bg-primary-500/5' : 'bg-primary-100/50'
      }`} />
      <div className={`absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl ${
        isDark ? 'bg-accent-500/5' : 'bg-accent-100/50'
      }`} />

      <div className="relative w-full px-6 sm:px-10 lg:px-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            isDark
              ? 'bg-primary-500/10 border border-primary-500/20'
              : 'bg-primary-50 border border-primary-200'
          }`}>
            <span className={`text-sm font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
              AI-Powered Features
            </span>
          </div>
          <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? 'text-white' : 'text-surface-900'
          }`}>
            Supercharge Your{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-500 bg-clip-text text-transparent">
              Recruitment
            </span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
            Leverage cutting edge artificial intelligence to transform every step of your hiring process,
            from candidate sourcing to final placement.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative rounded-2xl p-7 lg:p-8 transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-surface-800/40 border border-surface-700 hover:border-primary-500/40 hover:bg-surface-800/70 hover:shadow-lg hover:shadow-primary-500/10'
                  : 'bg-white border border-surface-200 hover:border-primary-300 hover:shadow-xl'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`mb-6 flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                isDark
                  ? 'bg-surface-700/60 border border-surface-600 group-hover:border-primary-500/40'
                  : 'bg-surface-100 border border-surface-200'
              }`}>
                <feature.icon
                  className={`w-6 h-6 ${
                    isDark ? 'text-primary-400' : 'text-primary-600'
                  }`}
                />
              </div>

              {/* Highlight Badge */}
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold mb-5 ${
                isDark
                  ? 'bg-primary-300/10 text-primary-300 border border-primary-300/20'
                  : 'bg-primary-50 text-primary-600 border border-primary-200'
              }`}>
                {feature.highlight}
              </div>

              {/* Content */}
              <h3 className={`text-xl font-semibold tracking-tight mb-3 ${
                isDark ? 'text-white' : 'text-surface-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm leading-7 ${
                isDark ? 'text-surface-400' : 'text-surface-500'
              }`}>
                {feature.description}
              </p>

            
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
