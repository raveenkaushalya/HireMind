import React, { useEffect, useRef, useState } from 'react';
import { sendChatMessage } from '../../../services/candidateApi';

const SUGGESTIONS = ['Where is my application?', 'How do I update my resume?', 'Any interviews coming up?'];

const WELCOME = {
  from: 'bot',
  text: "Hi! I'm the HireMind assistant. Ask me about your applications, resume, or interviews.",
};

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const send = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
    setDraft('');
    setTyping(true);
    const reply = await sendChatMessage(trimmed);
    setTyping(false);
    setMessages((prev) => [...prev, { from: 'bot', text: reply }]);
  };

  return (
    <>
      {open && (
        <div className="cp-chatbot-panel" role="dialog" aria-label="HireMind assistant">
          <div className="cp-chatbot-head">
            <span className="cp-chatbot-head-title">HireMind Assistant</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close assistant">
              ×
            </button>
          </div>

          <div className="cp-chatbot-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div className={`cp-chatbot-msg from-${m.from}`} key={i}>
                {m.text}
              </div>
            ))}
            {typing && <div className="cp-chatbot-typing">Assistant is typing…</div>}
          </div>

          {messages.length <= 1 && (
            <div className="cp-chatbot-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} type="button" className="cp-chatbot-suggestion" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            className="cp-chatbot-input-row"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask a question…"
              aria-label="Message the assistant"
            />
            <button type="submit" className="cp-btn cp-btn-signal cp-btn-sm">
              Send
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        className="cp-chatbot-launcher"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close assistant' : 'Open assistant'}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 5h16v11H8l-4 4V5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
            fill="none"
          />
          <circle cx="9" cy="10.5" r="1" fill="currentColor" />
          <circle cx="12.5" cy="10.5" r="1" fill="currentColor" />
          <circle cx="16" cy="10.5" r="1" fill="currentColor" />
        </svg>
      </button>
    </>
  );
}
