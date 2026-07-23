import { useTheme } from '../context/ThemeContext';
import { CheckCircle2 } from 'lucide-react';


const highlights = [
  'Trained on 10K+ resumes and job descriptions',
  'Trusted by 800+ companies worldwide',
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
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTryVPR87NKJ6LZl8LyaUIrX9-tYHpe7TS8Dur-oz9zDGWJeZ1aldeJpDDx&s=10"
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
                About Us
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
              HireMinds. was born from a simple belief. Finding the perfect job or candidate shouldn't take months of guesswork. We combine cutting-edge AI with human expertise to make hiring faster, fairer, and more accurate.
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
      </div>
    </section>
  );
}
