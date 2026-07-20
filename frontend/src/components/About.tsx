import { useTheme } from '../context/ThemeContext';
import { CheckCircle2, Target, Heart, Globe, TrendingUp } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Precision Matching',
    description: 'We obsess over accuracy so the right talent meets the right opportunity.',
  },
  {
    icon: Heart,
    title: 'Fair & Inclusive',
    description: 'Bias-aware AI that gives every candidate an equal shot at success.',
  },
  {
    icon: TrendingUp,
    title: 'Always Evolving',
    description: 'Our models learn from millions of placements to get smarter every day.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Connecting talent and companies across 60+ countries worldwide.',
  },
];

const highlights = [
  'Trained on 500M+ resumes and job descriptions',
  'SOC 2 Type II & GDPR compliant',
  'Real-time market intelligence built-in',
  'Dedicated success team for every account',
];

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section id="about" className={`relative py-16 lg:py-20 overflow-hidden ${
      isDark ? 'bg-surface-900' : 'bg-surface-50'
    }`}>
      {/* Background */}
      <div className={`absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl ${
        isDark ? 'bg-primary-500/5' : 'bg-primary-100/50'
      }`} />

      <div className="relative w-full px-6 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/9301835/pexels-photo-9301835.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=720&w=900"
                alt="Our team collaborating"
                className="w-full h-[460px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>


          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              isDark
                ? 'bg-primary-500/10 border border-primary-500/20'
                : 'bg-primary-50 border border-primary-200'
            }`}>
              <span className={`text-sm font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
                About HireMinds.
              </span>
            </div>

            <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 ${
              isDark ? 'text-white' : 'text-surface-900'
            }`}>
              On a Mission to{' '}
              <span className="bg-gradient-to-r from-primary-300 to-accent-500 bg-clip-text text-transparent">
                Reinvent Hiring
              </span>
            </h2>

            <p className={`text-lg leading-relaxed mb-4 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
              HireMinds. was born from a simple belief: finding the perfect job or candidate shouldn't take months of guesswork. We combine cutting-edge AI with human expertise to make hiring faster, fairer, and more accurate.
            </p>
            <p className={`text-base leading-relaxed mb-8 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
              Today, our platform powers recruitment for startups and Fortune 500 companies alike, processing millions of matches every single day.
            </p>

            {/* Highlights */}
            <div className="grid sm:grid-cols-2 gap-3 mb-8">
              {highlights.map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-accent-500 shrink-0 mt-0.5" />
                  <span className={`text-sm font-medium ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 lg:mt-16">
          {values.map(value => (
            <div
              key={value.title}
              className={`rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-surface-800/50 border border-surface-700/50 hover:border-surface-600'
                  : 'bg-white border border-surface-200 hover:shadow-xl hover:shadow-surface-200/50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                isDark ? 'bg-primary-500/10' : 'bg-primary-50'
              }`}>
                <value.icon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className={`font-display font-bold text-base mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                {value.title}
              </h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
