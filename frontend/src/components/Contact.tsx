import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  Send, Mail, User, Phone, CheckCircle2, ArrowRight,
} from 'lucide-react';

export default function Contact() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const inputCls = (hasIcon = true) =>
    `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-3 rounded-xl text-sm outline-none border transition-colors ${
      isDark
        ? 'bg-surface-900/80 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
        : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'
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
    setTimeout(() => { setLoading(false); setSubmitted(true); }, 1000);
  };

  return (
    <section id="get-in-touch" className={`relative py-16 lg:py-20 ${isDark ? 'bg-surface-950' : 'bg-white'}`}>
      <div className="relative w-full px-6 sm:px-10 lg:px-16">

        {/* Outer card wrapper */}
        <div className={`relative rounded-3xl overflow-hidden ${
          isDark ? 'bg-gradient-to-br from-[#040720] via-[#0a0e2a] to-[#0f1535] border border-[#1a1f45]' : 'bg-gradient-to-br from-surface-50 to-surface-100 border border-surface-200'
        }`}>
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <div className={`absolute -top-32 -right-32 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-primary-500/5' : 'bg-primary-100/50'}`} />
            <div className={`absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl ${isDark ? 'bg-accent-500/5' : 'bg-primary-50/50'}`} />
            <div className={`absolute inset-0 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.03]'}`}
              style={{ backgroundImage: `radial-gradient(circle, ${isDark ? '#fff' : '#000'} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
          </div>

          <div className="relative px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">

              {/* Left — Heading + Info (2 cols) */}
              <div className="lg:col-span-2 flex flex-col justify-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 self-start ${
                  isDark ? 'bg-white/5 border border-white/10' : 'bg-primary-50 border border-primary-200'
                }`}>
                  <span className={`text-sm font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>Get in Touch</span>
                </div>
                <h2 className={`font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${isDark ? 'text-white' : 'text-surface-900'}`}>
                  Have a Question?
                  <br />
                  <span className="bg-gradient-to-r from-primary-300 to-accent-500 bg-clip-text text-transparent">
                    We'd Love to Hear
                  </span>
                </h2>

                <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                  Whether you have feedback, an inquiry, or just want to say hello — our team is here for you and typically responds within 24 hours.
                </p>

                <div className="space-y-3">
                  {[
                    { icon: Mail, label: 'support@hireminds.com' },
                    { icon: Phone, label: '+1 (555) 123-4567' },
                  ].map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isDark ? 'bg-white/5' : 'bg-primary-50'}`}>
                        <item.icon className={`w-4 h-4 ${isDark ? 'text-primary-300' : 'text-primary-500'}`} />
                      </div>
                      <span className={`text-sm ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — Form (3 cols) */}
              <div className="lg:col-span-3">
                <div className={`rounded-2xl p-6 sm:p-8 ${
                  isDark ? 'bg-surface-900/60 border border-surface-700/40' : 'bg-white border border-surface-200 shadow-lg shadow-surface-200/30'
                }`}>
                  {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>
                            Full Name<span className="text-red-400 ml-0.5">*</span>
                          </label>
                          <div className="relative">
                            <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" className={inputCls()} />
                          </div>
                          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>
                            Email<span className="text-red-400 ml-0.5">*</span>
                          </label>
                          <div className="relative">
                            <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" className={inputCls()} />
                          </div>
                          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Phone</label>
                          <div className="relative">
                            <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                            <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls()} />
                          </div>
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Subject</label>
                          <input type="text" value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="What is this about?" className={inputCls(false)} />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>
                          Message<span className="text-red-400 ml-0.5">*</span>
                        </label>
                        <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={4}
                          placeholder="Tell us what's on your mind..."
                          className={`w-full pl-4 pr-4 py-3 rounded-xl text-sm outline-none border resize-none transition-colors ${
                            isDark ? 'bg-surface-900/80 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
                                 : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'
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
                    <div className="text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-500/30">
                        <CheckCircle2 className="w-8 h-8 text-white" />
                      </div>
                      <h3 className={`font-display font-bold text-xl mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>Message Sent!</h3>
                      <p className={`text-sm mb-6 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                        Thank you for reaching out. We'll get back to you within 24 hours.
                      </p>
                      <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                        className="inline-flex items-center gap-2 text-sm font-semibold cursor-pointer text-primary-500 hover:text-primary-400 transition-colors">
                        Send another message <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
