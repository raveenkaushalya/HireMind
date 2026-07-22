import { useTheme } from '../context/ThemeContext';
import { UserPlus, Upload, BrainCircuit, PartyPopper } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create Your Profile',
    description: 'Sign up and build your professional profile. Our AI helps optimize your resume for maximum visibility.',
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20',
  },
  {
    icon: Upload,
    step: '02',
    title: 'Upload & Match',
    description: 'Upload your resume or job description. Our AI engine instantly analyzes and matches the best opportunities or candidates.',
    color: 'from-violet-500 to-purple-600',
    shadow: 'shadow-violet-500/20',
  },
  {
    icon: BrainCircuit,
    step: '03',
    title: 'AI Scores & Ranks',
    description: 'Get detailed AI compatibility scores with breakdowns across skills, experience, culture fit, and growth potential.',
    color: 'from-emerald-500 to-teal-500',
    shadow: 'shadow-emerald-500/20',
  },
  {
    icon: PartyPopper,
    step: '04',
    title: 'Connect & Hire',
    description: 'Connect with your best matches, schedule interviews, and close offers all within the platform.',
    color: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/20',
  },
];

export default function HowItWorks() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`relative py-16 lg:py-20 overflow-hidden ${
      isDark ? 'bg-surface-900' : 'bg-surface-50'
    }`}>
      {/* Background */}
      <div className={`absolute inset-0 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
        style={{
          backgroundImage: `radial-gradient(circle, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative w-full px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 lg:mb-14">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            isDark
              ? 'bg-primary-500/10 border border-primary-500/20'
              : 'bg-primary-50 border border-primary-200'
          }`}>
            <span className={`text-sm font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
              Simple Process
            </span>
          </div>
          <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? 'text-white' : 'text-surface-900'
          }`}>
            How <span style={{ fontFamily: "'Montserrat', sans-serif" }}>Hire<span className="text-[#eab308]">Minds</span><span className="text-red-500">.</span></span>
            {' '}Works
          </h2>
          <p className={`text-lg ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
            Get started in minutes. Our AI handles the heavy lifting so you can focus on what matters most finding the perfect match.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`hidden lg:block absolute top-10 left-[60%] w-[calc(100%-20%)] h-[2px] ${
                  isDark ? 'bg-surface-700' : 'bg-surface-300'
                }`}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary-500" />
                </div>
              )}

              <div className={`relative rounded-2xl p-6 lg:p-8 text-center transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-surface-800/50 border border-surface-700/50 hover:border-surface-600'
                  : 'bg-white border border-surface-200 hover:shadow-xl hover:shadow-surface-200/50'
              }`}>
                {/* Step number */}
                <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold ${
                  isDark
                    ? 'bg-surface-700 text-surface-300 border border-surface-600'
                    : 'bg-surface-100 text-surface-500 border border-surface-200'
                }`}>
                  Step {step.step}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-lg ${step.shadow}`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className={`font-display text-lg font-bold mb-3 ${
                  isDark ? 'text-white' : 'text-surface-900'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-surface-400' : 'text-surface-500'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
