import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
    Eye, EyeOff, ArrowLeft, Mail, Lock,
    ShieldCheck
} from 'lucide-react';

export default function AdminLogin() {
    const { theme } = useTheme();
    const { signIn, goHome } = useAuth();
    const isDark = theme === 'dark';

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please enter email and password.');
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
            if (role !== 'admin' && role !== 'systemadmin' && role !== 'system admin') {
                throw new Error('Access denied. Admin portal requires administrator privileges.');
            }

            // Success
            signIn(data.name, data.role, data.token, data.userId, data.email);

            // Clean up URL visually
            window.history.pushState({}, '', '/');
        } catch (err: any) {
            setError(err.message || 'Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`fixed inset-0 z-[70] flex ${isDark ? 'bg-surface-950' : 'bg-white'}`}>

            {/* Left — Branding Panel */}
            <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca]">
                <div className="absolute inset-0">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl" />
                </div>

                <div className="relative flex flex-col justify-between w-full p-10 xl:p-14">
                    <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                        <span>Hire<span className="text-indigo-400">Minds</span><span className="text-red-500">.</span> Admin</span>
                    </span>

                    <div>
                        <h2 className="font-display text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
                            Restricted Area
                        </h2>
                        <p className="text-white/70 text-base max-w-sm">
                            Authorized personnel only. Use your system administrator credentials to access the control panel.
                        </p>
                    </div>
                    <p className="text-white/30 text-xs">© 2026 HireMinds Administration.</p>
                </div>
            </div>

            {/* Right — Login Form */}
            <div className={`flex-1 flex flex-col ${isDark ? 'bg-surface-950' : 'bg-white'}`}>

                {/* Top bar */}
                <div className="flex items-center justify-end p-4 lg:p-6">
                    <button
                        onClick={() => {
                            window.history.pushState({}, '', '/');
                            goHome();
                        }}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isDark ? 'text-surface-400 hover:text-white hover:bg-surface-800' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'}`}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Public Site
                    </button>
                </div>

                {/* Form area */}
                <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
                    <div className="w-full max-w-sm">
                        <div className="text-center mb-8">
                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5 shadow-lg ${isDark ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'}`}>
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h1 className={`font-display text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                                Admin Portal Login
                            </h1>
                            <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                                Sign in to manage the platform
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Admin Email</label>
                                <div className="relative">
                                    <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                                    <input
                                        type="email" value={username} onChange={e => { setUsername(e.target.value); setError(''); }}
                                        placeholder="admin@hireminds.co" autoFocus
                                        className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 text-white focus:border-indigo-500' : 'bg-surface-50 border-surface-300 text-surface-900 focus:border-indigo-500'}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Password</label>
                                <div className="relative">
                                    <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                                    <input
                                        type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setError(''); }}
                                        placeholder="••••••••"
                                        className={`w-full pl-10 pr-11 py-3 rounded-xl text-sm outline-none border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 text-white focus:border-indigo-500' : 'bg-surface-50 border-surface-300 text-surface-900 focus:border-indigo-500'}`}
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${isDark ? 'text-surface-500 hover:text-surface-300' : 'text-surface-400 hover:text-surface-600'}`}>
                                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">{error}</div>
                            )}

                            <button type="submit" disabled={loading}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all cursor-pointer disabled:opacity-60">
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Authenticate'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
