import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTA() {
  const { theme } = useTheme();
  const { openRegister } = useAuth();
  const isDark = theme === 'dark';

  return (
    <section className={`relative py-16 lg:py-20 overflow-hidden ${
      isDark ? 'bg-surface-900' : 'bg-surface-50'
    }`}>
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#040720] via-[#0a0e2a] to-[#0f1535]" />
          <div className="absolute inset-0">
            <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary-500/15 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />
          </div>

          {/* Content */}
          <div className="relative px-6 py-12 lg:px-12 lg:py-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary-300" />
              <span className="text-sm font-semibold text-white/90">Start Free — No Credit Card Required</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
              Ready to Transform Your{' '}
              <span className="bg-gradient-to-r from-primary-300 to-primary-200 bg-clip-text text-transparent">
                Hiring Process?
              </span>
            </h2>

            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
              Join 10,000+ companies and 2 million professionals already using HireMinds. 
              to make smarter, faster, and fairer hiring decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={openRegister}
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold text-base shadow-2xl shadow-primary-500/30 hover:shadow-primary-500/50 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 cursor-pointer"
              >
                Create an Account
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="#"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-base hover:bg-white/20 transition-all duration-300"
              >
                Book a Demo
              </a>
            </div>

            {/* Avatars */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <div className="flex -space-x-3">
                {[
                  'https://images.pexels.com/photos/7717254/pexels-photo-7717254.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=48&w=48',
                  'https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=48&w=48',
                  'https://images.pexels.com/photos/33680700/pexels-photo-33680700.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=48&w=48',
                  'https://images.pexels.com/photos/33799456/pexels-photo-33799456.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=48&w=48',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-10 h-10 rounded-full border-2 border-[#0f1535] object-cover"
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-3.5 h-3.5 fill-primary-300 text-primary-300" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-white/60 mt-0.5">4.9/5 from 2,000+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
