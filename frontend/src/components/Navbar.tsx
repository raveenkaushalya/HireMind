import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn, username, signOut, openLogin, openDashboard } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isDark = theme === 'dark';
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Scroll — add affix (shrink + shadow)
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navBg = isDark ? 'bg-[#040720]' : 'bg-white';
  const navBorder = isDark ? 'border-[#0f1535]' : 'border-surface-200';

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-400 ease-in-out ${navBg} border-b ${navBorder} ${
        scrolled ? 'shadow-lg py-0' : 'py-1 lg:py-2'
      } ${isDark && scrolled ? 'shadow-black/40' : scrolled ? 'shadow-surface-300/40' : ''}`}
    >
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className={`flex items-center justify-between transition-all duration-400 ${scrolled ? 'h-14' : 'h-16 lg:h-[65px]'}`}>

          {/* ── Logo Text ── */}
          <a href="#" className={`font-black tracking-tight transition-all duration-400 ${scrolled ? 'text-lg' : 'text-xl'} ${isDark ? 'text-white' : 'text-surface-900'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Hire<span className="text-[#eab308]">Minds</span><span className="text-red-500">.</span>
          </a>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {['Find Jobs', 'AI Features', 'About', 'FAQ'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? 'text-surface-300 hover:text-white hover:bg-white/5'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full p-1 transition-all duration-500 ${
                isDark ? 'bg-white/10' : 'bg-primary-100'
              }`}
              aria-label="Toggle theme"
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${
                isDark ? 'translate-x-6 bg-[#040720]' : 'translate-x-0 bg-white'
              }`}>
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-primary-400" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
            </button>

            {isSignedIn ? (
              /* ── Profile icon (desktop) ── */
              <div className="hidden sm:block relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-md transition-all duration-300 cursor-pointer ${
                    profileOpen ? 'shadow-primary-500/40 ring-2 ring-primary-400/50' : 'shadow-primary-500/20 hover:shadow-primary-500/40'
                  }`}
                >
                  {username.charAt(0).toUpperCase()}
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className={`absolute right-0 mt-2 w-52 rounded-xl overflow-hidden shadow-xl border animate-slide-up ${
                    isDark ? 'bg-[#0a0e2a] border-[#1a1f45]' : 'bg-white border-surface-200'
                  }`}>
                    <div className={`px-4 py-3 border-b ${isDark ? 'border-[#1a1f45]' : 'border-surface-100'}`}>
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{username}</p>
                      <p className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Signed in</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { openDashboard(); setProfileOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                          isDark ? 'text-surface-300 hover:text-white hover:bg-white/5' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                        }`}
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => { signOut(); setProfileOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
                          isDark ? 'text-red-400 hover:text-red-300 hover:bg-white/5' : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLogin}
                className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isDark ? 'text-surface-300 hover:text-white hover:bg-white/5' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                }`}
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            )}

            <a
              href="#find-jobs"
              className={`hidden sm:inline-flex rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 ${
                scrolled ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-sm'
              }`}
            >
              Browse Jobs
            </a>

            {/* ── Hamburger (navTrigger) ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden navTrigger ${mobileOpen ? 'active' : ''} ${isDark ? 'text-white' : 'text-surface-900'}`}
              aria-label="Toggle menu"
            >
              <i /><i /><i />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${
          mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        } ${navBg}`}
      >
        <div className={`border-t px-4 sm:px-6 py-4 space-y-1 ${isDark ? 'border-[#0f1535]' : 'border-surface-200'}`}>
          {['Find Jobs', 'AI Features', 'About', 'FAQ'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isDark ? 'text-surface-300 hover:text-white hover:bg-white/5' : 'text-surface-600 hover:bg-surface-100'
              }`}
            >
              {item}
            </a>
          ))}

          {isSignedIn ? (
            <div className={`mt-2 pt-3 border-t ${isDark ? 'border-[#0f1535]' : 'border-surface-200'}`}>
              <button
                onClick={() => { openDashboard(); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  isDark ? 'text-surface-300 hover:bg-white/5' : 'text-surface-600 hover:bg-surface-100'
                }`}
              >
                <User className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                  isDark ? 'text-red-400 hover:bg-white/5' : 'text-red-500 hover:bg-red-50'
                }`}
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 flex gap-3">
              <button
                onClick={() => { openLogin(); setMobileOpen(false); }}
                className={`flex-1 text-center py-2.5 rounded-xl text-sm font-medium border cursor-pointer ${
                  isDark ? 'border-[#1a1f45] text-surface-300' : 'border-surface-300 text-surface-600'
                }`}
              >
                Sign In
              </button>
              <a href="#find-jobs" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold">
                Browse Jobs
              </a>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
