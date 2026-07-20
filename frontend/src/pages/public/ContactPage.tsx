import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, Send, Mail, User, Phone, MessageSquare, CheckCircle2,
} from 'lucide-react';

export default function ContactPage() {
  const { theme } = useTheme();
  const { goHome } = useAuth();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const inputCls = (hasIcon = true) =>
    `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl text-sm outline-none border transition-colors ${
      isDark
        ? 'bg-surface-800 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
        : 'bg-white border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'
    }`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!form.name.trim()) err.name = 'Name is required.';
    if (!form.email.trim()) err.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(form.email)) err.email = 'Enter a valid email.';
    if (!form.message.trim()) err.message = 'Message is required.';
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-surface-950' : 'bg-surface-50'}`}>

      {/* Top Bar */}
      <div className={`sticky top-0 z-40 border-b ${isDark ? 'bg-[#040720] border-[#0f1535]' : 'bg-white border-surface-200'}`}>
        <div className="w-full px-6 sm:px-10 lg:px-16 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button onClick={goHome} className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isDark ? 'text-surface-400 hover:text-white hover:bg-surface-800' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
            }`}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className={`font-display text-lg font-bold ${isDark ? 'text-white' : 'text-surface-900'}`}>Get in Touch</h1>
          </div>
          <a href="#" onClick={e => { e.preventDefault(); goHome(); }}
            className={`font-black tracking-tight text-lg ${isDark ? 'text-white' : 'text-surface-900'}`}
            style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Hire<span className="text-[#eab308]">Minds</span><span className="text-red-500">.</span>
          </a>
        </div>
      </div>

      <div className="w-full px-6 sm:px-10 lg:px-16 py-10">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
              isDark ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-primary-50 border border-primary-200'
            }`}>
              <span className={`text-sm font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>Get in Touch</span>
            </div>
            <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-surface-900'}`}>
              We'd Love to{' '}
              <span className="bg-gradient-to-r from-primary-300 to-accent-500 bg-clip-text text-transparent">Hear From You</span>
            </h2>
            <p className={`text-base max-w-xl mx-auto ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
              Have a question, feedback, or inquiry? Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Mail, label: 'Email', value: 'support@hireminds.com' },
              { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
              { icon: MessageSquare, label: 'Live Chat', value: 'Mon-Fri, 9am-6pm EST' },
            ].map(item => (
              <div key={item.label} className={`flex items-center gap-3 p-4 rounded-xl ${
                isDark ? 'bg-surface-800/60 border border-surface-700/50' : 'bg-white border border-surface-200'
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-primary-500/10' : 'bg-primary-50'}`}>
                  <item.icon className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{item.label}</p>
                  <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form Card */}
          <div className={`rounded-2xl p-6 lg:p-8 ${
            isDark ? 'bg-surface-800/60 border border-surface-700/50' : 'bg-white border border-surface-200 shadow-sm'
          }`}>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>
                      Full Name<span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                      <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                        placeholder="Your full name" className={inputCls()} />
                    </div>
                    {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>
                      Email Address<span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                      <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                        placeholder="you@example.com" className={inputCls()} />
                    </div>
                    {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Phone Number</label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                        placeholder="+1 (555) 000-0000" className={inputCls()} />
                    </div>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Subject</label>
                    <input type="text" value={form.subject} onChange={e => set('subject', e.target.value)}
                      placeholder="What is this about?" className={inputCls(false)} />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>
                    Message<span className="text-red-400 ml-0.5">*</span>
                  </label>
                  <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={5}
                    placeholder="Tell us what's on your mind..."
                    className={`w-full pl-4 pr-4 py-3 rounded-xl text-sm outline-none border resize-none transition-colors ${
                      isDark ? 'bg-surface-800 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
                           : 'bg-white border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'
                    }`} />
                  {errors.message && <p className="text-xs text-red-400 mt-1">{errors.message}</p>}
                </div>

                <button type="submit" disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-all cursor-pointer disabled:opacity-60">
                  {loading
                    ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><Send className="w-4 h-4" /> Send Message</>}
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent-500/30">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className={`font-display font-bold text-2xl mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>Message Sent!</h3>
                <p className={`text-sm mb-8 max-w-sm mx-auto ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                  Thank you for reaching out. Our team will review your message and get back to you within 24 hours.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    className={`px-6 py-2.5 rounded-xl text-sm font-medium border cursor-pointer ${
                      isDark ? 'border-surface-700 text-surface-300 hover:bg-surface-800' : 'border-surface-300 text-surface-600 hover:bg-surface-100'
                    }`}>
                    Send Another Message
                  </button>
                  <button onClick={goHome}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all cursor-pointer">
                    Back to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
