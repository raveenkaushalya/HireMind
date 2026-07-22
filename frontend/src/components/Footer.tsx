import { useTheme } from '../context/ThemeContext';
import { Mail } from 'lucide-react';

const footerLinks = {
  'For Candidates': ['Browse Jobs', 'AI Resume Builder', 'Career Resources', 'Salary Calculator', 'Skill Assessment'],
  'For Recruiters': ['Post a Job', 'AI Screening', 'Talent Pool', 'Analytics', 'Pricing'],
  'Company': ['About Us', 'Careers', 'Blog', 'Press', 'Contact'],
  'Legal': ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
};

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <footer className={`relative pt-16 pb-8 ${
      isDark ? 'bg-surface-950 border-t border-surface-800' : 'bg-white border-t border-surface-200'
    }`}>
      <div className="w-full px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <a href="#" className={`inline-block mb-4 text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-surface-900'}`} style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Hire<span className="text-[#eab308]">Minds</span><span className="text-red-500">.</span>
            </a>
            <p className={`text-sm leading-relaxed mb-6 max-w-xs ${
              isDark ? 'text-surface-400' : 'text-surface-500'
            }`}>
              AI-powered recruitment platform connecting top talent with dream companies. Smarter hiring starts here.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              {[
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
              ].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                    isDark
                      ? 'bg-surface-800 text-surface-400 hover:text-white hover:bg-surface-700'
                      : 'bg-surface-100 text-surface-400 hover:text-surface-900 hover:bg-surface-200'
                  }`}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className={`font-display font-semibold text-sm mb-4 ${
                isDark ? 'text-white' : 'text-surface-900'
              }`}>
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className={`text-sm transition-colors ${
                        isDark
                          ? 'text-surface-400 hover:text-primary-400'
                          : 'text-surface-500 hover:text-primary-600'
                      }`}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        

        {/* Bottom */}
        <div className={`pt-8 border-t ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
          <p className={`text-sm text-center ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>
            © 2026 HireMinds. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
