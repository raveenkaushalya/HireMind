import { useTheme } from '../context/ThemeContext';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'VP of Talent, CloudScale Inc.',
    image: 'https://images.pexels.com/photos/7717254/pexels-photo-7717254.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    text: 'HireMinds. reduced our time-to-hire by 60%. The AI matching is incredibly accurate — we found our entire engineering team through the platform.',
    rating: 5,
  },
  {
    name: 'James Park',
    role: 'Senior Developer, NeuralTech',
    image: 'https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    text: "The AI scoring system gave me insights I never expected. I landed my dream job within 2 weeks. The platform truly understands what candidates want.",
    rating: 5,
  },
  {
    name: 'Dr. Emily Chen',
    role: 'Head of HR, QuantumData AI',
    image: 'https://images.pexels.com/photos/33680700/pexels-photo-33680700.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    text: 'The bias-free hiring feature is a game-changer. We\'ve built the most diverse team in our company\'s history thanks to HireMinds. intelligent screening.',
    rating: 5,
  },
];

export default function Testimonials() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section className={`relative py-16 lg:py-20 ${isDark ? 'bg-surface-950' : 'bg-white'}`}>
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl ${
        isDark ? 'bg-primary-500/3' : 'bg-primary-50/50'
      }`} />

      <div className="relative w-full px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            isDark
              ? 'bg-primary-500/10 border border-primary-500/20'
              : 'bg-primary-50 border border-primary-200'
          }`}>
            <span className={`text-sm font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
              Success Stories
            </span>
          </div>
          <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 ${
            isDark ? 'text-white' : 'text-surface-900'
          }`}>
            Loved by{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-500 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
            See what our users say about their experience with HireMinds.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:-translate-y-1 ${
                isDark
                  ? 'bg-surface-800/50 border border-surface-700/50 hover:border-surface-600'
                  : 'bg-surface-50 border border-surface-200 hover:shadow-xl hover:shadow-surface-200/50'
              }`}
            >
              {/* Quote icon */}
              <div className={`absolute top-6 right-6 ${isDark ? 'text-surface-700' : 'text-surface-200'}`}>
                <Quote className="w-8 h-8" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className={`text-sm leading-relaxed mb-6 ${
                isDark ? 'text-surface-300' : 'text-surface-600'
              }`}>
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-500/20"
                />
                <div>
                  <p className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}>
                    {t.name}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
