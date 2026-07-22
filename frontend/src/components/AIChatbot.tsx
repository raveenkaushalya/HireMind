import { useState } from 'react';
import { Bot, X, Send } from 'lucide-react';

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Welcome to HireMind AI. I can help you discover jobs, improve your resume, prepare for interviews, and navigate the platform.',
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: 'user',
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'This is a demo response. Connect me to your AI backend to provide real answers.',
        },
      ]);
    }, 600);

    setMessage('');
  };

  const quickActions = [
    'Find Jobs',
    'Resume Review',
    'Interview Tips',
    'Career Advice',
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-yellow-500 text-black shadow-[0_10px_40px_rgba(234,179,8,0.5)] transition hover:scale-110 hover:rotate-6"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-2 sm:bottom-24 sm:right-6 animate-in slide-in-from-bottom-4 duration-300 z-[9999] w-[calc(100vw-1rem)] sm:w-[440px] max-w-[440px] overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.25)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <Bot size={20} />
              <div>
                <h3 className="font-semibold text-base">HireMind AI Assistant</h3>
                <p className="text-xs text-emerald-400">● Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="border-b border-black/10 dark:border-white/10 p-4">
            <p className="mb-3 text-sm opacity-80">
              How can I help you today?
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => setMessage(action)}
                  className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-2 text-left text-xs font-medium transition hover:bg-black/5 dark:hover:bg-white/10"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="h-[45vh] sm:h-80 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-yellow-500 text-black shadow-lg rounded-br-md'
                    : 'bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white border border-black/10 dark:border-white/10 rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-black/10 dark:border-white/10 p-4">
            <div className="flex gap-2 items-center">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about jobs, resumes, or interviews..."
                className="flex-1 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none"
              />
              <button
                onClick={handleSend}
                className="rounded-2xl bg-yellow-500 px-4 text-black transition hover:scale-105"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}