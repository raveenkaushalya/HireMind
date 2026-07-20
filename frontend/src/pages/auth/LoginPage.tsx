import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getRoleFromEmail, useAuth } from '../../context/AuthContext';
import {
  Eye, EyeOff, ArrowLeft, Mail, Lock,
  Sparkles, CheckCircle2, X, KeyRound, ShieldCheck, ArrowRight,
} from 'lucide-react';

// ── Forgot Password Modal ─────────────────────────────────────────────
function ForgotPasswordModal({ isDark, onClose }: { isDark: boolean; onClose: () => void }) {
  const [step, setStep] = useState<'email' | 'code' | 'reset' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const inputCls = `w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-colors ${
    isDark
      ? 'bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
      : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'
  }`;

  const handleSendCode = () => {
    setError('');
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('code'); }, 1200);
  };

  const handleVerifyCode = () => {
    setError('');
    if (!code.trim()) { setError('Please enter the verification code.'); return; }
    if (code.length < 4) { setError('Code must be at least 4 digits.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('reset'); }, 800);
  };

  const handleResetPassword = () => {
    setError('');
    if (!newPassword) { setError('Please enter a new password.'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep('done'); }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${
        isDark ? 'bg-surface-900 border border-surface-700' : 'bg-white border border-surface-200'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-surface-800' : 'border-surface-100'}`}>
          <h2 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-surface-900'}`}>
            {step === 'done' ? 'Password Reset' : 'Forgot Password'}
          </h2>
          <button onClick={onClose} className={`p-1.5 rounded-lg cursor-pointer ${isDark ? 'hover:bg-surface-800 text-surface-400' : 'hover:bg-surface-100 text-surface-500'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* ── Step 1: Email ── */}
          {step === 'email' && (
            <div className="space-y-4">
              <div className={`w-14 h-14 rounded-2xl mx-auto mb-2 flex items-center justify-center ${isDark ? 'bg-primary-500/15' : 'bg-primary-50'}`}>
                <Mail className="w-7 h-7 text-primary-500" />
              </div>
              <p className={`text-sm text-center ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                Enter the email address associated with your account. We'll send you a verification code.
              </p>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com" className={inputCls} autoFocus />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button onClick={handleSendCode} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all cursor-pointer disabled:opacity-60">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Verification Code <ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
          )}

          {/* ── Step 2: Verification Code ── */}
          {step === 'code' && (
            <div className="space-y-4">
              <div className={`w-14 h-14 rounded-2xl mx-auto mb-2 flex items-center justify-center ${isDark ? 'bg-accent-500/15' : 'bg-accent-50'}`}>
                <KeyRound className="w-7 h-7 text-accent-500" />
              </div>
              <p className={`text-sm text-center ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                We sent a code to <span className={`font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{email}</span>. Enter it below.
              </p>
              <div className="relative">
                <KeyRound className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                <input type="text" value={code} onChange={e => { setCode(e.target.value.replace(/\D/g, '')); setError(''); }}
                  placeholder="Enter 6-digit code" maxLength={6}
                  className={`${inputCls} tracking-[0.3em] text-center !pl-10`} />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button onClick={handleVerifyCode} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all cursor-pointer disabled:opacity-60">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify Code'}
              </button>
              <button onClick={() => { setStep('email'); setCode(''); setError(''); }}
                className={`w-full text-center text-xs font-medium cursor-pointer ${isDark ? 'text-surface-500 hover:text-surface-300' : 'text-surface-400 hover:text-surface-600'}`}>
                Didn't receive a code? Go back
              </button>
            </div>
          )}

          {/* ── Step 3: New Password ── */}
          {step === 'reset' && (
            <div className="space-y-4">
              <div className={`w-14 h-14 rounded-2xl mx-auto mb-2 flex items-center justify-center ${isDark ? 'bg-primary-500/15' : 'bg-primary-50'}`}>
                <ShieldCheck className="w-7 h-7 text-primary-500" />
              </div>
              <p className={`text-sm text-center ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                Create a new password for your account.
              </p>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => { setNewPassword(e.target.value); setError(''); }}
                  placeholder="New password (min 6 chars)" className={`${inputCls} !pr-10`} />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                <input type="password" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                  placeholder="Confirm new password" className={inputCls} />
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
              <button onClick={handleResetPassword} disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all cursor-pointer disabled:opacity-60">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Reset Password'}
              </button>
            </div>
          )}

          {/* ── Step 4: Success ── */}
          {step === 'done' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center mx-auto shadow-lg shadow-accent-500/30">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h3 className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-surface-900'}`}>Password Reset Successfully!</h3>
              <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                You can now sign in with your new password.
              </p>
              <button onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all cursor-pointer">
                Back to Sign In
              </button>
            </div>
          )}
        </div>

        {/* Step indicator */}
        {step !== 'done' && (
          <div className={`px-6 pb-4 flex justify-center gap-1.5`}>
            {['email', 'code', 'reset'].map((s, i) => (
              <div key={s} className={`h-1 rounded-full transition-all duration-300 ${
                s === step ? 'w-6 bg-primary-500' : i < ['email', 'code', 'reset'].indexOf(step) ? 'w-4 bg-primary-400' : `w-3 ${isDark ? 'bg-surface-700' : 'bg-surface-300'}`
              }`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Social Login Modal ────────────────────────────────────────────────
function SocialLoginModal({ provider, isDark, onClose, onSuccess }: {
  provider: 'google' | 'linkedin';
  isDark: boolean;
  onClose: () => void;
  onSuccess: (name: string, email: string) => void;
}) {
  const [step, setStep] = useState<'loading' | 'account' | 'signing'>('loading');
  const [selectedAccount, setSelectedAccount] = useState('');

  const isGoogle = provider === 'google';
  const brandColor = isGoogle ? '#4285F4' : '#0A66C2';
  const brandName = isGoogle ? 'Google' : 'LinkedIn';

  const accounts = isGoogle
    ? [
        { name: 'John Doe', email: 'john.doe@gmail.com', avatar: 'JD' },
        { name: 'John Work', email: 'john.work@company.com', avatar: 'JW' },
      ]
    : [
        { name: 'John Doe', email: 'john.doe@linkedin.com', avatar: 'JD' },
      ];

  // Simulate loading the provider page
  useState(() => {
    setTimeout(() => setStep('account'), 1500);
  });

  const handleSelect = (name: string) => {
    setSelectedAccount(name);
    setStep('signing');
    const account = accounts.find((a) => a.name === name);
    setTimeout(() => onSuccess(name.split(' ')[0], account?.email ?? ''), 1200);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl ${
        isDark ? 'bg-surface-900 border border-surface-700' : 'bg-white border border-surface-200'
      }`}>

        {/* Header bar with brand color */}
        <div className="h-1.5" style={{ backgroundColor: brandColor }} />

        <div className="px-6 py-6">
          {/* ── Loading ── */}
          {step === 'loading' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-lg" style={{ backgroundColor: brandColor }}>
                {isGoogle ? (
                  <svg className="w-7 h-7" viewBox="0 0 24 24">
                    <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                ) : (
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#fff">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                )}
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                Connecting to {brandName}...
              </p>
              <div className="w-8 h-8 border-3 border-surface-300 border-t-primary-500 rounded-full animate-spin mx-auto" />
            </div>
          )}

          {/* ── Account selection ── */}
          {step === 'account' && (
            <div className="space-y-4">
              <div className="text-center mb-2">
                <h3 className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-surface-900'}`}>
                  Sign in with {brandName}
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>
                  Choose an account to continue to HireMinds.
                </p>
              </div>

              <div className="space-y-2">
                {accounts.map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => handleSelect(acc.name)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      isDark
                        ? 'border-surface-700 hover:border-primary-500/40 hover:bg-surface-800/60'
                        : 'border-surface-200 hover:border-primary-300 hover:bg-surface-50'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: brandColor }}>
                      {acc.avatar}
                    </div>
                    <div className="text-left min-w-0">
                      <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{acc.name}</p>
                      <p className={`text-xs truncate ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>{acc.email}</p>
                    </div>
                  </button>
                ))}
              </div>

              <button onClick={onClose}
                className={`w-full text-center text-xs font-medium py-2 cursor-pointer ${isDark ? 'text-surface-500 hover:text-surface-300' : 'text-surface-400 hover:text-surface-600'}`}>
                Cancel
              </button>
            </div>
          )}

          {/* ── Signing in ── */}
          {step === 'signing' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center mx-auto shadow-lg shadow-primary-500/30">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <p className={`text-sm font-medium ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                Signing in as <span className={`font-bold ${isDark ? 'text-white' : 'text-surface-900'}`}>{selectedAccount}</span>...
              </p>
              <div className="w-8 h-8 border-3 border-surface-300 border-t-primary-500 rounded-full animate-spin mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// MAIN LOGIN PAGE
// ════════════════════════════════════════════════════════════════════════
export default function LoginPage() {
  const { theme } = useTheme();
  const { signIn, goHome, openRegister } = useAuth();
  const isDark = theme === 'dark';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [socialProvider, setSocialProvider] = useState<'google' | 'linkedin' | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(username.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      signIn(username.trim(), getRoleFromEmail(username.trim()));
    }, 800);
  };

  const handleSocialSuccess = (name: string, email: string) => {
    setSocialProvider(null);
    signIn(name, getRoleFromEmail(email));
  };

  const features = [
    'AI-powered job matching score',
    'Personalized skill breakdown',
    'Smart resume analysis',
    'Priority application status',
  ];

  return (
    <div className={`fixed inset-0 z-[70] flex ${isDark ? 'bg-surface-950' : 'bg-white'}`}>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <ForgotPasswordModal isDark={isDark} onClose={() => setShowForgotPassword(false)} />
      )}

      {/* Social Login Modal */}
      {socialProvider && (
        <SocialLoginModal
          provider={socialProvider}
          isDark={isDark}
          onClose={() => setSocialProvider(null)}
          onSuccess={handleSocialSuccess}
        />
      )}

      {/* Left — Branding Panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-[#040720] via-[#0a0e2a] to-[#0f1535]">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />
        </div>

        <div className="relative flex flex-col justify-between w-full p-10 xl:p-14">
          <span className="text-xl font-black tracking-tight text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Hire<span className="text-[#eab308]">Minds</span><span className="text-red-500">.</span>
          </span>

          <div>
            <h2 className="font-display text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              Unlock your
              <br />
              <span className="bg-gradient-to-r from-primary-300 to-primary-200 bg-clip-text text-transparent">
                AI advantage
              </span>
            </h2>
            <p className="text-white/60 text-base mb-8 max-w-sm">
              Sign in to access your personalized AI matching score, skill breakdowns, and smart job recommendations.
            </p>
            <div className="space-y-3">
              {features.map(f => (
                <div key={f} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary-300 shrink-0" />
                  <span className="text-white/80 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/30 text-xs">© 2026 HireMinds. All rights reserved.</p>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className={`flex-1 flex flex-col ${isDark ? 'bg-surface-950' : 'bg-white'}`}>

        {/* Top bar */}
        <div className="flex items-center justify-end p-4 lg:p-6">
          <button
            onClick={goHome}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              isDark ? 'text-surface-400 hover:text-white hover:bg-surface-800' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-sm">
            {/* Heading */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 ${
                isDark ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-primary-50 border border-primary-200'
              }`}>
                <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                <span className={`text-xs font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
                  Welcome back
                </span>
              </div>
              <h1 className={`font-display text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                Sign in to your account
              </h1>
              <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                Enter your email and password to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>
                  Email
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type="email" value={username} onChange={e => { setUsername(e.target.value); setError(''); }}
                    placeholder="you@example.com" autoFocus
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-colors ${
                      isDark ? 'bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
                           : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'
                    }`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`text-sm font-medium ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Password</label>
                  <button type="button" onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-medium text-primary-500 hover:text-primary-400 transition-colors cursor-pointer">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none border transition-colors ${
                      isDark ? 'bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
                           : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'
                    }`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${isDark ? 'text-surface-500 hover:text-surface-300' : 'text-surface-400 hover:text-surface-600'}`}>
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-surface-300 text-primary-500 cursor-pointer accent-primary-500" />
                <label htmlFor="remember" className={`text-sm cursor-pointer ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                  Remember me for 30 days
                </label>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">{error}</div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className={`flex-1 h-px ${isDark ? 'bg-surface-800' : 'bg-surface-200'}`} />
              <span className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>or continue with</span>
              <div className={`flex-1 h-px ${isDark ? 'bg-surface-800' : 'bg-surface-200'}`} />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setSocialProvider('google')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                isDark ? 'bg-surface-900 border-surface-700 text-surface-300 hover:bg-surface-800' : 'bg-white border-surface-300 text-surface-600 hover:bg-surface-50'
              }`}>
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button onClick={() => setSocialProvider('linkedin')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                isDark ? 'bg-surface-900 border-surface-700 text-surface-300 hover:bg-surface-800' : 'bg-white border-surface-300 text-surface-600 hover:bg-surface-50'
              }`}>
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn
              </button>
            </div>

            {/* Sign up link */}
            <p className={`text-center text-sm mt-6 pb-12 mb-8 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
              Don't have an account?{' '}
              <button type="button" onClick={openRegister}
                className="text-primary-500 font-semibold hover:text-primary-400 transition-colors cursor-pointer">
                Create an Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
