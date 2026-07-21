import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft, ArrowRight, Mail, Lock, Eye, EyeOff,
  User, Phone, MapPin, Briefcase, Building2, GraduationCap,
  Sparkles, CheckCircle2, ChevronRight, Link2, X, Upload, FileText,
  ShieldCheck, PartyPopper, Search,
} from 'lucide-react';

type Role = '' | 'candidate' | 'company';

interface FormData {
  role: Role;

  // Candidate
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  location: string;
  currentTitle: string;
  experience: string;
  skills: string[];
  skillInput: string;
  linkedinUrl: string;
  education: string;
  bio: string;

  // Company
  companyName: string;
  companyIndustry: string;
  companyLocation: string;
  companyEmail: string;
  companyPhone: string;
  companySize: string;
  companyDescription: string;
  contactPersonName: string;
  contactPersonPhone: string;
  proofDocument: File | null;
  proofDocumentName: string;
  agreedToTerms: boolean;
}

const initialForm: FormData = {
  role: '',
  fullName: '', email: '', password: '', confirmPassword: '', phone: '',
  location: '', currentTitle: '', experience: '', skills: [], skillInput: '',
  linkedinUrl: '', education: '', bio: '',
  companyName: '', companyIndustry: '', companyLocation: '', companyEmail: '',
  companyPhone: '', companySize: '', companyDescription: '',
  contactPersonName: '', contactPersonPhone: '',
  proofDocument: null, proofDocumentName: '', agreedToTerms: false,
};

const experienceOptions = ['Fresh Graduate', 'Less than 1 year', '1-2 years', '3-5 years', '5-10 years', '10+ years'];
const companySizeOptions = ['1-10 employees', '11-50 employees', '51-200 employees', '201-1000 employees', '1000+ employees'];
const industryOptions = ['Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Manufacturing', 'Consulting', 'Media', 'Other'];

const roles: { id: Role; title: string; question: string; desc: string; icon: typeof User; color: string }[] = [
  { id: 'candidate', title: 'Job Seeker', question: 'Are you a job seeker?', desc: 'Find your dream job with AI-powered matching, skill insights, and smart resume analysis.', icon: Search, color: 'from-blue-500 to-cyan-500' },
  { id: 'company', title: 'Company', question: 'Are you a company?', desc: 'Post jobs, screen candidates with AI, and build your dream team faster.', icon: Building2, color: 'from-violet-500 to-purple-600' },
];

function Field({ label, icon: Icon, children, required, isDark }: { label: string; icon?: typeof User; children: React.ReactNode; required?: boolean; isDark: boolean }) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />}
        {children}
      </div>
    </div>
  );
}

// ── Success Modals ────────────────────────────────────────────────────
function CandidateSuccessModal({ isDark, onClose }: { isDark: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-2xl p-8 text-center shadow-2xl ${isDark ? 'bg-surface-900 border border-surface-700' : 'bg-white border border-surface-200'}`}>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
          <PartyPopper className="w-10 h-10 text-white" />
        </div>
        <h2 className={`font-display text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-surface-900'}`}>Welcome to HireMinds.!</h2>
        <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
          Your account has been created successfully. You can now sign in and start exploring AI-powered job matches.
        </p>
        <button onClick={onClose} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all cursor-pointer">
          Sign In Now
        </button>
      </div>
    </div>
  );
}

function CompanySuccessModal({ isDark, onClose }: { isDark: boolean; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-2xl p-8 text-center shadow-2xl ${isDark ? 'bg-surface-900 border border-surface-700' : 'bg-white border border-surface-200'}`}>
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h2 className={`font-display text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-surface-900'}`}>Application Submitted!</h2>
        <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
          Thank you for registering your company with HireMinds. Your application is now under review by our admin team.
        </p>
        <div className={`rounded-xl p-4 mb-5 text-left ${isDark ? 'bg-primary-500/5 border border-primary-500/15' : 'bg-primary-50 border border-primary-100'}`}>
          <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>What happens next?</p>
          <ul className="space-y-2">
            {['Our team will verify your company documents.', 'Verification usually takes 1-2 business days.', 'Once approved, you will receive an email with a link to create your password and log in.'].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${isDark ? 'text-primary-400' : 'text-primary-600'}`} />
                <span className={`text-xs ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={onClose} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all cursor-pointer">
          Got It
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
export default function RegisterPage() {
  const { theme } = useTheme();
  const { openLogin, goHome } = useAuth();
  const isDark = theme === 'dark';

  const [form, setForm] = useState<FormData>(initialForm);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showCandidateSuccess, setShowCandidateSuccess] = useState(false);
  const [showCompanySuccess, setShowCompanySuccess] = useState(false);

  const totalSteps = form.role === 'candidate' ? 2 : form.role === 'company' ? 3 : 1;

  const set = (field: keyof FormData, value: string | string[] | File | null | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const inputCls = (hasIcon = true) =>
    `w-full ${hasIcon ? 'pl-10' : 'pl-4'} pr-4 py-2.5 rounded-xl text-sm outline-none border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500'
      : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'
    }`;

  const selectCls = `w-full pl-4 pr-4 py-2.5 rounded-xl text-sm outline-none border transition-colors appearance-none cursor-pointer ${isDark ? 'bg-surface-900 border-surface-700 text-white focus:border-primary-500'
    : 'bg-surface-50 border-surface-300 text-surface-900 focus:border-primary-500'
    }`;

  const addSkill = () => {
    const s = form.skillInput.trim();
    if (s && !form.skills.includes(s) && form.skills.length < 15) { set('skills', [...form.skills, s]); set('skillInput', ''); }
  };
  const removeSkill = (skill: string) => set('skills', form.skills.filter(s => s !== skill));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { set('proofDocument', file); set('proofDocumentName', file.name); }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (step === 1 && !form.role) e.role = 'Please select a role.';

    if (step === 2 && form.role === 'candidate') {
      if (!form.fullName.trim()) e.fullName = 'Required.';
      if (!form.email.trim()) e.email = 'Required.';
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email.';
      if (!form.password) e.password = 'Required.';
      else if (form.password.length < 6) e.password = 'Min 6 characters.';
      if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
      if (!form.location.trim()) e.location = 'Required.';
      if (!form.experience) e.experience = 'Required.';
    }

    if (step === 2 && form.role === 'company') {
      if (!form.companyName.trim()) e.companyName = 'Required.';
      if (!form.companyEmail.trim()) e.companyEmail = 'Required.';
      else if (!/\S+@\S+\.\S+/.test(form.companyEmail)) e.companyEmail = 'Invalid email.';
      if (!form.companyPhone.trim()) e.companyPhone = 'Required.';
      if (!form.companyIndustry) e.companyIndustry = 'Required.';
      if (!form.companyLocation.trim()) e.companyLocation = 'Required.';
      if (!form.contactPersonName.trim()) e.contactPersonName = 'Required.';
      if (!form.contactPersonPhone.trim()) e.contactPersonPhone = 'Required.';
    }

    if (step === 3 && form.role === 'company') {
      if (!form.proofDocument) e.proofDocument = 'Please upload a proof document.';
      if (!form.agreedToTerms) e.agreedToTerms = 'You must agree to the terms.';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (!validate()) return; if (step < totalSteps) setStep(step + 1); else submit(); };
  const back = () => { if (step > 1) setStep(step - 1); else goHome(); };

  const submit = async () => {
    setLoading(true);
    try {
      if (form.role === 'candidate') {
        const authRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: form.fullName,
            email: form.email,
            password: form.password,
            role: 'Candidate'
          })
        });
        let authData = await authRes.json();
        if (!authRes.ok) throw new Error(authData.message || 'Registration failed');

        const loginRes = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            password: form.password
          })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginData.message || 'Login failed after registration');

        authData = loginData;

        // ✅ Properly extract token and userId inside submit()
        const token = authData?.token || authData?.result?.token || authData?.Token;
        const userId = authData?.userId || authData?.result?.userId || authData?.UserId;

        if (!token) {
          throw new Error("Authentication token was not received from login.");
        }

        const candidatePayload = {
          name: form.fullName,
          email: form.email,
          phoneNumber: form.phone,
          location: form.location,
          currentJobTitle: form.currentTitle,
          experienceLevel: form.experience,
          education: form.education,
          skills: form.skills.join(', '),
          linkedinUrl: form.linkedinUrl,
          bio: form.bio,
          userId: userId
        };

        const candRes = await fetch('/api/candidates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(candidatePayload)
        });

        if (!candRes.ok) throw new Error('Failed to create candidate profile');

        setShowCandidateSuccess(true);

      } else if (form.role === 'company') {
        const companyPayload = {
          name: form.companyName,
          industry: form.companyIndustry,
          email: form.companyEmail,
          phoneNumber: form.companyPhone,
          location: form.companyLocation,
          size: form.companySize,
          description: form.companyDescription,
          contactPersonName: form.contactPersonName,
          contactPersonNumber: form.contactPersonPhone,
        };

        const compRes = await fetch('/api/companies/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(companyPayload)
        });

        if (!compRes.ok) {
          const text = await compRes.text();
          throw new Error(text || 'Failed to request company account');
        }

        setShowCompanySuccess(true);
      }

    } catch (err: any) {
      setErrors({ server: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCandidateSuccessClose = () => {
    setShowCandidateSuccess(false);
    openLogin();
  };

  const handleCompanySuccessClose = () => {
    setShowCompanySuccess(false);
    goHome();
  };

  const errMsg = (field: string) => errors[field] ? <p className="text-xs text-red-400 mt-1">{errors[field]}</p> : null;

  return (
    <div className={`fixed inset-0 z-[70] flex ${isDark ? 'bg-surface-950' : 'bg-white'}`}>
      {showCandidateSuccess && <CandidateSuccessModal isDark={isDark} onClose={handleCandidateSuccessClose} />}
      {showCompanySuccess && <CompanySuccessModal isDark={isDark} onClose={handleCompanySuccessClose} />}

      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden bg-gradient-to-br from-[#040720] via-[#0a0e2a] to-[#0f1535]">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
        </div>
        <div className="relative flex flex-col justify-between w-full p-10 xl:p-14">
          <span className="text-xl font-black tracking-tight text-white" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            Hire<span className="text-[#eab308]">Minds</span><span className="text-red-500">.</span>
          </span>
          <div>
            <h2 className="font-display text-3xl xl:text-4xl font-bold text-white leading-tight mb-4">
              Join the future<br />
              <span className="bg-gradient-to-r from-primary-300 to-primary-200 bg-clip-text text-transparent">of recruitment</span>
            </h2>
            <p className="text-white/60 text-base mb-8 max-w-sm">
              Whether you're a job seeker or a company — HireMinds. connects the right people faster.
            </p>
            <div className="space-y-3">
              {['AI-scored candidate matching', 'Company verification & trust', 'Smart resume parsing & skill extraction', 'Real-time analytics dashboard'].map(f => (
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

      {/* ── Right form panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 lg:p-5 shrink-0">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 <= step ? 'bg-primary-500 w-6' : isDark ? 'bg-surface-700 w-3' : 'bg-surface-300 w-3'}`} />
            ))}
          </div>
          <button onClick={back} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isDark ? 'text-surface-400 hover:text-white hover:bg-surface-800' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'}`}>
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? 'Back to Home' : 'Back'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex items-start justify-center px-4 sm:px-6 py-4">
            <div className="w-full max-w-lg">

              {/* ═══ STEP 1: ROLE ═══ */}
              {step === 1 && (
                <div>
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${isDark ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-primary-50 border border-primary-200'}`}>
                      <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                      <span className={`text-xs font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>Step 1 of {totalSteps || '?'}</span>
                    </div>
                    <h1 className={`font-display text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>Create an Account</h1>
                    <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Select how you want to use HireMinds.</p>
                  </div>
                  <div className="space-y-3">
                    {roles.map(r => {
                      const selected = form.role === r.id;
                      return (
                        <button key={r.id} type="button" onClick={() => { set('role', r.id); setErrors({}); }}
                          className={`w-full flex items-start gap-4 p-5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${selected ? 'border-primary-500 shadow-lg shadow-primary-500/10' : isDark ? 'border-surface-700 hover:border-surface-600' : 'border-surface-200 hover:border-surface-300'
                            } ${isDark ? 'bg-surface-800/50' : 'bg-surface-50'}`}>
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center shrink-0 shadow-lg`}>
                            <r.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className={`font-display font-bold text-base ${isDark ? 'text-white' : 'text-surface-900'}`}>{r.question}</span>
                                <p className={`text-xs mt-0.5 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>{r.title}</p>
                              </div>
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? 'border-primary-500 bg-primary-500' : isDark ? 'border-surface-600' : 'border-surface-300'}`}>
                                {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                              </div>
                            </div>
                            <p className={`text-sm mt-2 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>{r.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {errMsg('role')}
                </div>
              )}

              {/* ═══ STEP 2: CANDIDATE DETAILS ═══ */}
              {step === 2 && form.role === 'candidate' && (
                <div>
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${isDark ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-primary-50 border border-primary-200'}`}>
                      <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                      <span className={`text-xs font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>Step 2 of {totalSteps}</span>
                    </div>
                    <h1 className={`font-display text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>Your Profile</h1>
                    <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Tell us about yourself so our AI can find the best matches.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Full Name" icon={User} required isDark={isDark}>
                        <input type="text" value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="John Doe" className={inputCls()} />
                        {errMsg('fullName')}
                      </Field>
                      <Field label="Email Address" icon={Mail} required isDark={isDark}>
                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" className={inputCls()} />
                        {errMsg('email')}
                      </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Password" icon={Lock} required isDark={isDark}>
                        <div className="relative">
                          <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                          <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 6 characters"
                            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm outline-none border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500' : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'}`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errMsg('password')}
                      </Field>
                      <Field label="Confirm Password" icon={Lock} required isDark={isDark}>
                        <input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Re-enter password" className={inputCls()} />
                        {errMsg('confirmPassword')}
                      </Field>
                    </div>
                    <Field label="Phone Number" icon={Phone} isDark={isDark}>
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls()} />
                    </Field>

                    <div className={`border-t pt-4 mt-2 ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Professional Details</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Location" icon={MapPin} required isDark={isDark}>
                        <input type="text" value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. San Francisco, CA" className={inputCls()} />
                        {errMsg('location')}
                      </Field>
                      <Field label="Current Job Title" icon={Briefcase} isDark={isDark}>
                        <input type="text" value={form.currentTitle} onChange={e => set('currentTitle', e.target.value)} placeholder="e.g. Frontend Developer" className={inputCls()} />
                      </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Experience Level<span className="text-red-400 ml-0.5">*</span></label>
                        <select value={form.experience} onChange={e => set('experience', e.target.value)} className={selectCls}>
                          <option value="">Select experience</option>
                          {experienceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        {errMsg('experience')}
                      </div>
                      <Field label="Education" icon={GraduationCap} isDark={isDark}>
                        <input type="text" value={form.education} onChange={e => set('education', e.target.value)} placeholder="e.g. B.S. Computer Science" className={inputCls()} />
                      </Field>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Skills</label>
                      <div className="flex gap-2">
                        <input type="text" value={form.skillInput} onChange={e => set('skillInput', e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                          placeholder="Type a skill and press Enter"
                          className={`flex-1 pl-4 pr-4 py-2.5 rounded-xl text-sm outline-none border transition-colors ${isDark ? 'bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500' : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'}`} />
                        <button type="button" onClick={addSkill} className="px-4 py-2.5 rounded-xl bg-primary-500 text-white text-sm font-semibold cursor-pointer hover:bg-primary-600 transition-colors">Add</button>
                      </div>
                      {form.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {form.skills.map(s => (
                            <span key={s} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${isDark ? 'bg-primary-500/15 text-primary-300 border border-primary-500/20' : 'bg-primary-50 text-primary-600 border border-primary-200'}`}>
                              {s}
                              <button type="button" onClick={() => removeSkill(s)} className="cursor-pointer hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Field label="LinkedIn URL" icon={Link2} isDark={isDark}>
                      <input type="url" value={form.linkedinUrl} onChange={e => set('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/yourname" className={inputCls()} />
                    </Field>
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Short Bio</label>
                      <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} placeholder="Tell recruiters a bit about yourself…"
                        className={`w-full pl-4 pr-4 py-2.5 rounded-xl text-sm outline-none border resize-none transition-colors ${isDark ? 'bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500' : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'}`} />
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ STEP 2: COMPANY DETAILS ═══ */}
              {step === 2 && form.role === 'company' && (
                <div>
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${isDark ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-primary-50 border border-primary-200'}`}>
                      <Building2 className="w-3.5 h-3.5 text-primary-500" />
                      <span className={`text-xs font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>Step 2 of {totalSteps}</span>
                    </div>
                    <h1 className={`font-display text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>Company Details</h1>
                    <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Tell us about your company to get started.</p>
                  </div>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Company Name" icon={Building2} required isDark={isDark}>
                        <input type="text" value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="e.g. Acme Corp" className={inputCls()} />
                        {errMsg('companyName')}
                      </Field>
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Industry<span className="text-red-400 ml-0.5">*</span></label>
                        <select value={form.companyIndustry} onChange={e => set('companyIndustry', e.target.value)} className={selectCls}>
                          <option value="">Select industry</option>
                          {industryOptions.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                        {errMsg('companyIndustry')}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Company Location" icon={MapPin} required isDark={isDark}>
                        <input type="text" value={form.companyLocation} onChange={e => set('companyLocation', e.target.value)} placeholder="e.g. New York, NY" className={inputCls()} />
                        {errMsg('companyLocation')}
                      </Field>
                      <Field label="Company Email" icon={Mail} required isDark={isDark}>
                        <input type="email" value={form.companyEmail} onChange={e => set('companyEmail', e.target.value)} placeholder="info@company.com" className={inputCls()} />
                        {errMsg('companyEmail')}
                      </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Company Phone" icon={Phone} required isDark={isDark}>
                        <input type="tel" value={form.companyPhone} onChange={e => set('companyPhone', e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls()} />
                        {errMsg('companyPhone')}
                      </Field>
                      <div>
                        <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Company Size</label>
                        <select value={form.companySize} onChange={e => set('companySize', e.target.value)} className={selectCls}>
                          <option value="">Select size</option>
                          {companySizeOptions.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Company Description</label>
                      <textarea value={form.companyDescription} onChange={e => set('companyDescription', e.target.value)} rows={3} placeholder="Brief description of your company…"
                        className={`w-full pl-4 pr-4 py-2.5 rounded-xl text-sm outline-none border resize-none transition-colors ${isDark ? 'bg-surface-900 border-surface-700 text-white placeholder:text-surface-500 focus:border-primary-500' : 'bg-surface-50 border-surface-300 text-surface-900 placeholder:text-surface-400 focus:border-primary-500'}`} />
                    </div>

                    <div className={`border-t pt-4 mt-2 ${isDark ? 'border-surface-800' : 'border-surface-200'}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-4 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Contact Person</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Contact Person Name" icon={User} required isDark={isDark}>
                        <input type="text" value={form.contactPersonName} onChange={e => set('contactPersonName', e.target.value)} placeholder="e.g. Jane Smith" className={inputCls()} />
                        {errMsg('contactPersonName')}
                      </Field>
                      <Field label="Contact Person Phone" icon={Phone} required isDark={isDark}>
                        <input type="tel" value={form.contactPersonPhone} onChange={e => set('contactPersonPhone', e.target.value)} placeholder="+1 (555) 000-0000" className={inputCls()} />
                        {errMsg('contactPersonPhone')}
                      </Field>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ STEP 3: COMPANY VERIFICATION ═══ */}
              {step === 3 && form.role === 'company' && (
                <div>
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 ${isDark ? 'bg-primary-500/10 border border-primary-500/20' : 'bg-primary-50 border border-primary-200'}`}>
                      <ShieldCheck className="w-3.5 h-3.5 text-primary-500" />
                      <span className={`text-xs font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>Step 3 of {totalSteps} — Verification</span>
                    </div>
                    <h1 className={`font-display text-2xl sm:text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>Company Verification</h1>
                    <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Upload proof to verify your company. After review, you'll receive a link to create your password.</p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-surface-300' : 'text-surface-700'}`}>Proof of Company Registration / License<span className="text-red-400 ml-0.5">*</span></label>
                      {!form.proofDocumentName ? (
                        <label className={`flex flex-col items-center justify-center w-full h-40 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${isDark ? 'border-surface-700 bg-surface-800/30 hover:border-primary-500/50 hover:bg-surface-800/60' : 'border-surface-300 bg-surface-50 hover:border-primary-400 hover:bg-surface-100'}`}>
                          <Upload className={`w-10 h-10 mb-3 ${isDark ? 'text-surface-500' : 'text-surface-400'}`} />
                          <p className={`text-sm font-medium mb-1 ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>Click to upload</p>
                          <p className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>PDF, JPG, or PNG (max 10MB)</p>
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
                        </label>
                      ) : (
                        <div className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-surface-800 border border-surface-700' : 'bg-surface-50 border border-surface-200'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-primary-500/15' : 'bg-primary-50'}`}><FileText className="w-5 h-5 text-primary-500" /></div>
                            <div>
                              <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-surface-900'}`}>{form.proofDocumentName}</p>
                              <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Document uploaded</p>
                            </div>
                          </div>
                          <button type="button" onClick={() => { set('proofDocument', null); set('proofDocumentName', ''); }}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${isDark ? 'hover:bg-surface-700 text-surface-400' : 'hover:bg-surface-200 text-surface-500'}`}><X className="w-4 h-4" /></button>
                        </div>
                      )}
                      {errMsg('proofDocument')}
                      <p className={`text-xs mt-2 ${isDark ? 'text-surface-500' : 'text-surface-400'}`}>Accepted: Business registration certificate, company license, tax registration, or similar official documents.</p>
                    </div>
                    <div className={`rounded-xl p-4 ${isDark ? 'bg-surface-800/50 border border-surface-700' : 'bg-surface-50 border border-surface-200'}`}>
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="terms" checked={form.agreedToTerms} onChange={e => set('agreedToTerms', e.target.checked)}
                          className="w-5 h-5 mt-0.5 rounded border-surface-300 text-primary-500 cursor-pointer accent-primary-500 shrink-0" />
                        <label htmlFor="terms" className={`text-sm cursor-pointer ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                          I agree to the <a href="#" className="text-primary-500 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-primary-500 font-semibold hover:underline">Privacy Policy</a>. I confirm the information provided is accurate.
                        </label>
                      </div>
                      {errMsg('agreedToTerms')}
                    </div>
                    <div className={`rounded-xl p-4 flex items-start gap-3 ${isDark ? 'bg-blue-500/5 border border-blue-500/15' : 'bg-blue-50 border border-blue-100'}`}>
                      <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                        After submission, our admin team will review and verify your company. Once approved, you will receive an email with a <strong>secure link to create your password</strong> and access your company dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Server error message display */}
              {errors.server && (
                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {errors.server}
                </div>
              )}

              {/* ── Action buttons ── */}
              <div className="flex items-center justify-between gap-4 mt-8 pb-8">
                <button type="button" onClick={back} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${isDark ? 'text-surface-400 hover:text-white hover:bg-surface-800' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'}`}>
                  {step === 1 ? 'Cancel' : 'Back'}
                </button>
                <button type="button" onClick={next} disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:from-primary-600 hover:to-primary-700 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : step === totalSteps ? <>Submit<ChevronRight className="w-4 h-4" /></>
                      : <>Continue<ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>

              <p className={`text-center text-sm pb-10 mb-6 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
                Already have an account?{' '}
                <button type="button" onClick={openLogin} className="text-primary-500 font-semibold hover:text-primary-400 transition-colors cursor-pointer">Sign In</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}