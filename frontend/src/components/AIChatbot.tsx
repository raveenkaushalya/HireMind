import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';

export default function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Welcome to HireMinds AI. I can help you discover jobs, improve your resume, prepare for interviews, and navigate the platform.',
    },
  ]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: 'user',
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');

    try {
      // Map existing messages to OpenRouter expected format
      const history = [...messages, userMessage].map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(history)
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.text || "I'm sorry, I couldn't understand that.",
          },
        ]);
      } else {
        throw new Error(await res.text());
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Oops, I ran into an error connecting to my AI brain.`,
        },
      ]);
    }
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
        aria-label={open ? 'Close Chat' : 'Open Chat'}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-yellow-500 text-black shadow-[0_10px_40px_rgba(234,179,8,0.5)] transition hover:scale-110 active:scale-95"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-3 left-3 sm:left-auto sm:right-6 sm:bottom-24 z-[9999] max-h-[80vh] sm:max-h-[600px] w-auto sm:w-[420px] flex flex-col overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white backdrop-blur-xl shadow-2xl transition-all">

          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-4 py-3 sm:px-5 sm:py-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-600 dark:text-yellow-400">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base leading-tight">HireMinds AI Assistant</h3>
                <p className="text-[11px] font-medium text-emerald-500 dark:text-emerald-400">● Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-slate-500 hover:bg-black/5 dark:hover:bg-white/10 dark:text-slate-400 transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="border-b border-black/10 dark:border-white/10 p-3 sm:p-4 shrink-0 bg-slate-50/50 dark:bg-slate-800/30">
            <p className="mb-2 text-xs font-medium opacity-75">
              How can I help you today?
            </p>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => setMessage(action)}
                  className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-left text-xs font-medium transition hover:bg-yellow-500/10 hover:border-yellow-500/30 truncate"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-[200px] max-h-[40vh] sm:max-h-[320px]">
            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user';

              const renderMarkdown = (text: string) => {
                let html = text
                  // Bold (**text**)
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-yellow-600 dark:text-yellow-500">$1</strong>')
                  // List items (- or *)
                  .replace(/^[\-\*]\s+(.*)$/gm, '<li class="ml-4 list-disc">$1</li>')
                  // Newlines to <br> but skip for lists
                  .replace(/\n(?!(<li))/g, '<br/>');

                // Wrap sequential lists
                html = html.replace(/(<li.*?>.*?<\/li>(\s*<br\/>\s*)*)+/g, (match) => {
                  const cleanMatch = match.replace(/\s*<br\/>\s*/g, '');
                  return `<ul class="mb-2 mt-1 space-y-1">${cleanMatch}</ul>`;
                });

                return { __html: html };
              };

              return (
                <div
                  key={index}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${isUser
                    ? 'ml-auto bg-yellow-500 text-black shadow-sm rounded-br-xs font-medium'
                    : 'bg-black/5 dark:bg-white/10 text-slate-900 dark:text-white border border-black/5 dark:border-white/5 rounded-bl-xs'
                    }`}
                >
                  {isUser ? msg.text : <div dangerouslySetInnerHTML={renderMarkdown(msg.text)} />}
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-black/10 dark:border-white/10 p-3 sm:p-4 shrink-0 bg-white/50 dark:bg-slate-900/50">
            <div className="flex gap-2 items-center">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about jobs, resumes..."
                className="flex-1 min-w-0 rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-yellow-500/50 transition"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                aria-label="Send message"
                className="shrink-0 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-yellow-500 text-black transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
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