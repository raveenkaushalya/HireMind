import { useTheme } from '../context/ThemeContext';
import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: '7000+', label: 'Active Candidates', description: 'Verified professionals' },
  { value: '800+', label: 'Companies', description: 'Trust our platform' },
  { value: '10K+', label: 'Jobs Matched', description: 'By our AI engine' },
  { value: '96%', label: 'Match Accuracy', description: 'AI-powered precision' },
];

function AnimatedStat({ value }: { value: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const numericValue = parseInt(value.replace(/[^0-9]/g, ''), 10);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const duration = 1800;
          const increment = numericValue / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= numericValue) {
              setCount(numericValue);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);

          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [value]);

  const suffix = value.includes('%') ? '%' : value.includes('M+') ? 'M+' : value.includes('K+') ? 'K+' : '+';

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function Stats() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`relative py-14 ${isDark ? 'bg-surface-950' : 'bg-white'}`}>
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className={`relative rounded-3xl overflow-hidden p-10 lg:p-16 ${
          isDark
            ? 'bg-gradient-to-br from-primary-900/40 via-surface-900 to-primary-300/5 border border-surface-800'
            : 'bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800'
        }`}>
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center" style={{ animationDelay: `${index * 0.15}s` }}>
                <p className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-2 ${
                  isDark
                    ? 'bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent'
                    : 'text-white'
                }`}>
                  <AnimatedStat value={stat.value} />
                </p>
                <p className={`font-semibold text-sm sm:text-base mb-1 ${
                  isDark ? 'text-surface-200' : 'text-white/90'
                }`}>
                  {stat.label}
                </p>
                <p className={`text-xs sm:text-sm ${
                  isDark ? 'text-surface-400' : 'text-white/60'
                }`}>
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
