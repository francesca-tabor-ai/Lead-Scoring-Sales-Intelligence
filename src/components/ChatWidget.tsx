import { useState, useRef, useEffect } from 'react';
import { trpc } from '../trpc';

const PROMPT_PROBES = [
  'What can I do on the Dashboard?',
  'How does the scoring pipeline work?',
  'How do I import leads from CSV?',
  'What does the Budget Optimizer do?',
  'How do I run the full pipeline on a lead?',
  'What signals does NLP extraction find?',
  'Where can I see my top-ranked leads?',
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const sendMessage = trpc.chat.sendMessage.useMutation();

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text: string) => {
    const msg = text.trim();
    if (!msg) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);

    try {
      const res = await sendMessage.mutateAsync({
        message: msg,
        history: messages,
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: res.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Something went wrong. Please try again.' },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  return (
    <>
      <button
        type="button"
        className="chat-widget__toggle"
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <ChatIcon />
      </button>

      {isOpen && (
        <div className="chat-widget">
          <div className="chat-widget__header">
            <span className="chat-widget__title">LSSIS Assistant</span>
            <button
              type="button"
              className="chat-widget__close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className="chat-widget__messages" ref={listRef}>
            {messages.length === 0 ? (
              <div className="chat-widget__probes">
                <p className="chat-widget__probes-intro">Ask me anything about the platform:</p>
                <div className="chat-widget__probes-list">
                  {PROMPT_PROBES.map((probe) => (
                    <button
                      key={probe}
                      type="button"
                      className="chat-widget__probe"
                      onClick={() => handleSend(probe)}
                    >
                      {probe}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`chat-widget__msg chat-widget__msg--${m.role}`}>
                  <div className="chat-widget__msg-content">{m.content}</div>
                </div>
              ))
            )}
            {sendMessage.isPending && (
              <div className="chat-widget__msg chat-widget__msg--assistant">
                <div className="chat-widget__msg-content chat-widget__typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          <form className="chat-widget__form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the platform..."
              className="chat-widget__input"
              disabled={sendMessage.isPending}
            />
            <button
              type="submit"
              className="chat-widget__send"
              disabled={!input.trim() || sendMessage.isPending}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
