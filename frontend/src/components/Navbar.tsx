import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isSignedIn, username, signOut, openLogin, openRegister, openDashboard } = useAuth();
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
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-400 ease-in-out ${navBg} border-b ${navBorder} ${scrolled ? 'shadow-lg py-0' : 'py-1 lg:py-2'
        } ${isDark && scrolled ? 'shadow-black/40' : scrolled ? 'shadow-surface-300/40' : ''}`}
    >
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className={`relative flex items-center justify-between transition-all duration-400 ${scrolled ? 'h-14' : 'h-16 lg:h-[65px]'}`}>

          {/* ── Logo Text ── */}
          <a href="#" className={`font-black tracking-tight transition-all duration-400 z-10 ${scrolled ? 'text-lg' : 'text-xl'} ${isDark ? 'text-white' : 'text-surface-900'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Hire<span className="text-[#eab308]">Minds</span><span className="text-red-500">.</span>
          </a>

          {/* ── Centered Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            {['Find Jobs', 'AI Features', 'About', 'FAQ', 'Contact Us'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className={`group relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg hover:scale-[1.02] ${isDark
                  ? 'text-surface-300 hover:text-white hover:bg-white/5'
                  : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100/80'
                  }`}
              >
                {item}
                {/* Subtle animated underline indicator */}
                <span className="absolute bottom-1 left-4 right-4 h-[2px] bg-gradient-to-r from-primary-500 to-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left rounded-full" />
              </a>
            ))}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-3 z-10">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`relative w-14 h-8 rounded-full p-1 transition-all duration-500 cursor-pointer ${isDark ? 'bg-white/10' : 'bg-primary-100'
                }`}
              aria-label="Toggle theme"
            >
              <div className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${isDark ? 'translate-x-6 bg-[#040720]' : 'translate-x-0 bg-white'
                }`}>
                {isDark ? (
                  <Moon className="w-3.5 h-3.5 text-primary-400" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </div>
            </button>

            {isSignedIn ? (
              /* ── Refined Profile Icon & Dropdown ── */
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`group relative w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 via-primary-500 to-amber-500 p-[2px] shadow-md transition-all duration-300 cursor-pointer hover:scale-105 ${profileOpen ? 'ring-2 ring-primary-400 ring-offset-2 ring-offset-transparent' : 'hover:shadow-primary-500/30'
                    }`}
                  aria-label="User Profile"
                >
                  <div className={`w-full h-full rounded-full flex items-center justify-center font-bold text-sm transition-colors ${isDark ? 'bg-[#0a0e2a] text-white' : 'bg-white text-primary-600'
                    }`}>
                    {username ? username.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileOpen && (
                  <div className={`absolute right-0 mt-2 w-52 rounded-xl overflow-hidden shadow-2xl border animate-slide-up z-50 ${isDark ? 'bg-[#0a0e2a] border-[#1a1f45]' : 'bg-white border-surface-200'
                    }`}>
                    <div className={`px-4 py-3 border-b ${isDark ? 'border-[#1a1f45]' : 'border-surface-100'}`}>
                      <p className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-surface-900'}`}>{username}</p>
                      <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Signed in</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { openDashboard(); setProfileOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${isDark ? 'text-surface-300 hover:text-white hover:bg-white/5' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                          }`}
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => { signOut(); setProfileOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer ${isDark ? 'text-red-400 hover:text-red-300 hover:bg-white/5' : 'text-red-500 hover:text-red-600 hover:bg-red-50'
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
              /* ── Desktop Sign In & Register Buttons ── */
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={openLogin}
                  className={`px-3.5 sm:px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${isDark ? 'text-surface-300 hover:text-white hover:bg-white/5' : 'text-surface-600 hover:text-surface-900 hover:bg-surface-100'
                    }`}
                >
                  Sign In
                </button>
                <button
                  onClick={openRegister}
                  className="px-3.5 sm:px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  Register
                </button>
              </div>
            )}

            {/* ── Mobile/Responsive Hamburger Menu Button ── */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden navTrigger ${mobileOpen ? 'active' : ''} ${isDark ? 'text-gray-500' : 'text-surface-900'}`}
              aria-label="Toggle menu"
            >
              <i /><i /><i />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile/Responsive Nav Dropdown ── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-400 ease-in-out ${mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          } ${navBg}`}
      >
        <div className={`border-t px-4 sm:px-6 py-4 space-y-1 ${isDark ? 'border-[#0f1535]' : 'border-surface-200'}`}>
          {['Find Jobs', 'AI Features', 'About', 'FAQ', 'Contact Us'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isDark ? 'text-surface-300 hover:text-white hover:bg-white/5' : 'text-surface-600 hover:bg-surface-100'
                }`}
            >
              {item}
            </a>
          ))}

          {/* Mobile Auth Buttons when not signed in */}
          {!isSignedIn && (
            <div className="pt-3 flex gap-3 border-t mt-2">
              <button
                onClick={() => { openLogin(); setMobileOpen(false); }}
                className={`flex-1 text-center py-2.5 rounded-xl text-sm font-semibold border cursor-pointer transition-colors ${isDark ? 'border-[#1a1f45] text-surface-300 hover:bg-white/5' : 'border-surface-300 text-surface-600 hover:bg-surface-50'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { openRegister(); setMobileOpen(false); }}
                className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold shadow-md cursor-pointer transition-opacity hover:opacity-95"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}