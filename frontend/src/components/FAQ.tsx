import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does the AI matching algorithm work?',
    a: 'Our AI analyzes over 200 data points from each candidate profile and job description including skills, experience, certifications, career trajectory, and culture signals. Using deep learning models trained on 500M+ data points, it produces a compatibility score from 0-100 with a transparent breakdown.',
  },
  {
    q: 'Is the AI really bias-free?',
    a: 'While no system is perfect, our AI is specifically engineered to remove common hiring biases. We strip out identifying information (name, gender, age, photo) during scoring and continuously audit our models for fairness across demographics. The result is a measurably more diverse and qualified candidate pool.',
  },
  {
    q: 'Can candidates use the platform for free?',
    a: 'Yes! Candidates can create a profile, upload a resume, get their AI score, and apply to unlimited jobs completely free forever. We only charge companies and recruiters for premium tools like advanced screening, analytics, and bulk matching.',
  },
  {
    q: 'How accurate is the AI candidate score?',
    a: 'Our scoring engine achieves 96% accuracy when measured against actual hiring outcomes. Every score comes with a detailed breakdown so recruiters and candidates understand exactly why a match is (or isn\'t) strong.',
  },
  {
    q: 'How long does it take to get matches?',
    a: 'Most matches are generated in real-time typically under 3 seconds. After uploading a resume or posting a job, you\'ll see ranked results instantly, no waiting required.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We are SOC 2 Type II and GDPR compliant. All data is encrypted in transit and at rest, and we never sell your information. You have full control to delete your account and data at any time.',
  },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`rounded-2xl overflow-hidden transition-all duration-300 ${
      isOpen
        ? isDark
          ? 'bg-surface-800/80 border border-primary-500/30'
          : 'bg-white border border-primary-200 shadow-lg shadow-primary-100/40'
        : isDark
          ? 'bg-surface-800/50 border border-surface-700/50'
          : 'bg-white border border-surface-200'
    }`}>
      <button
        onClick={onToggle}
        className={`flex items-center justify-between gap-4 w-full px-5 lg:px-6 py-5 text-left cursor-pointer transition-colors ${
          isOpen
            ? isDark ? 'text-white' : 'text-surface-900'
            : isDark ? 'text-surface-200 hover:text-white' : 'text-surface-700 hover:text-surface-900'
        }`}
      >
        <span className="font-display font-semibold text-base">{faq.q}</span>
        <ChevronDown className={`w-5 h-5 shrink-0 text-primary-500 transition-transform duration-300 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className={`px-5 lg:px-6 pb-5 text-sm leading-relaxed ${
            isDark ? 'text-surface-400' : 'text-surface-500'
          }`}>
            {faq.a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { theme } = useTheme();
  const { openContact } = useAuth();
  const isDark = theme === 'dark';
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className={`relative py-16 lg:py-20 ${isDark ? 'bg-surface-950' : 'bg-white'}`}>
      <div className={`absolute top-1/2 -translate-y-1/2 left-0 w-96 h-96 rounded-full blur-3xl ${
        isDark ? 'bg-primary-500/5' : 'bg-primary-50/50'
      }`} />

      <div className="relative w-full px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            isDark
              ? 'bg-primary-500/10 border border-primary-500/20'
              : 'bg-primary-50 border border-primary-200'
          }`}>
            <span className={`text-sm font-semibold ${isDark ? 'text-primary-300' : 'text-primary-600'}`}>
              FAQ
            </span>
          </div>
          <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 ${
            isDark ? 'text-white' : 'text-surface-900'
          }`}>
            Questions?{' '}
            <span className="bg-gradient-to-r from-primary-300 to-accent-500 bg-clip-text text-transparent">
              We've Got Answers
            </span>
          </h2>
          <p className={`text-lg ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
            Everything you need to know about HireMinds. Can't find what you're looking for?{' '}
            <button onClick={openContact} className="text-primary-500 font-semibold hover:underline cursor-pointer">Contact our team</button>.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem
              key={faq.q}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>


      </div>
    </section>
  );
}
