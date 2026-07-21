import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
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

  const inputCls = `w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-colors ${isDark
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
      <div className={`relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${isDark ? 'bg-surface-900 border border-surface-700' : 'bg-white border border-surface-200'
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
              <div key={s} className={`h-1 rounded-full transition-all duration-300 ${s === step ? 'w-6 bg-primary-500' : i < ['email', 'code', 'reset'].indexOf(step) ? 'w-4 bg-primary-400' : `w-3 ${isDark ? 'bg-surface-700' : 'bg-surface-300'}`
                }`} />
            ))}
          </div>
        )}
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your email.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username.trim(), password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid login credentials');
      }

      const role = data.role?.toLowerCase();
      if (role === 'admin' || role === 'systemadmin' || role === 'system admin') {
        throw new Error('Administrators must log in via the /admin portal.');
      }

      // Success
      signIn(data.name, data.role, data.token, data.userId, data.email);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to server');
    } finally {
      setLoading(false);
    }
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
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isDark ? 'text-surface-400 hover:text-white hover:bg-surface-800' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
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
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 ${isDark ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-primary-50 border border-primary-200'
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
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
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
                    className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
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
