import { useTheme } from '../context/ThemeContext';
import { 
  BrainCircuit, FileSearch, Target, Zap, Shield, BarChart3, 
  ArrowRight 
} from 'lucide-react';

const features = [
  {
    icon: BrainCircuit,
    title: 'AI Candidate Scoring',
    description: 'Our AI analyzes candidate profiles against job requirements, providing a comprehensive compatibility score from 0-100 with detailed breakdowns.',
    gradient: 'from-violet-500 to-purple-600',
    shadow: 'shadow-violet-500/25',
    highlight: '96% accuracy',
  },
  {
    icon: FileSearch,
    title: 'Smart Resume Matching',
    description: 'Upload job descriptions and let our AI instantly match and rank the best-fit candidates from your talent pool using NLP and deep learning.',
    gradient: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/25',
    highlight: '10x faster',
  },
  {
    icon: Target,
    title: 'Precision Job Search',
    description: 'Our advanced algorithm considers skills, experience, culture fit, and career goals to surface the most relevant opportunities for candidates.',
    gradient: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/25',
    highlight: '85% match rate',
  },
  {
    icon: Zap,
    title: 'Instant Screening',
    description: 'Automate initial candidate screening with AI-powered assessments that evaluate technical skills, soft skills, and cultural alignment.',
    gradient: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/25',
    highlight: '70% time saved',
  },
  {
    icon: Shield,
    title: 'Bias-Free Hiring',
    description: 'Our AI is designed to reduce unconscious bias in the hiring process, focusing purely on skills and qualifications for fair evaluation.',
    gradient: 'from-rose-500 to-pink-500',
    shadow: 'shadow-rose-500/25',
    highlight: 'DEI focused',
  },
  {
    icon: BarChart3,
    title: 'Recruitment Analytics',
    description: 'Get deep insights into your hiring pipeline with real-time dashboards, conversion metrics, and AI-powered recommendations.',
    gradient: 'from-indigo-500 to-blue-600',
    shadow: 'shadow-indigo-500/25',
    highlight: 'Real-time data',
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
            Leverage cutting-edge artificial intelligence to transform every step of your hiring process,
            from candidate sourcing to final placement.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative rounded-2xl p-6 lg:p-8 transition-all duration-500 hover:-translate-y-1 ${
                isDark
                  ? 'bg-surface-800/50 border border-surface-700/50 hover:border-surface-600/80 hover:bg-surface-800/80'
                  : 'bg-white border border-surface-200 hover:border-surface-300 hover:shadow-xl hover:shadow-surface-200/50'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg ${feature.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Highlight Badge */}
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-bold mb-4 ${
                isDark
                  ? 'bg-primary-300/10 text-primary-300 border border-primary-300/20'
                  : 'bg-primary-50 text-primary-600 border border-primary-200'
              }`}>
                {feature.highlight}
              </div>

              {/* Content */}
              <h3 className={`font-display text-xl font-bold mb-3 ${
                isDark ? 'text-white' : 'text-surface-900'
              }`}>
                {feature.title}
              </h3>
              <p className={`text-sm leading-relaxed mb-5 ${
                isDark ? 'text-surface-400' : 'text-surface-500'
              }`}>
                {feature.description}
              </p>

              {/* Link */}
              <a href="#" className={`inline-flex items-center gap-2 text-sm font-semibold group/link ${
                isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-700'
              }`}>
                Learn more
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
