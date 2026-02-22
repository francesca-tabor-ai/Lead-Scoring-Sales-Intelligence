import { useState } from 'react';

const REQUEST_TYPES = [
  { value: 'support', label: 'Customer Support' },
  { value: 'bug', label: 'Bug Report' },
] as const;

const RECIPIENT = 'info@francescatabor.com';

export function Contact() {
  const [requestType, setRequestType] = useState<'support' | 'bug'>('support');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const typeLabel = REQUEST_TYPES.find((r) => r.value === requestType)?.label ?? 'Inquiry';
    const emailSubject = subject.trim()
      ? `[${typeLabel}] ${subject.trim()}`
      : typeLabel;
    const bodyParts = [
      message.trim() || '(No message provided)',
      '',
      '---',
      `Name: ${name.trim() || '(not provided)'}`,
      `Email: ${email.trim() || '(not provided)'}`,
      `Request Type: ${typeLabel}`,
    ];
    const mailtoUrl = `mailto:${RECIPIENT}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(bodyParts.join('\n'))}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="contact-page">
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Contact Us</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
        All submissions open a pre-filled email to {RECIPIENT}. Choose your request type and we’ll respond as soon as we can.
      </p>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="contact-form__field">
          <label htmlFor="contact-type">Request Type</label>
          <select
            id="contact-type"
            value={requestType}
            onChange={(e) => setRequestType(e.target.value as 'support' | 'bug')}
          >
            {REQUEST_TYPES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>

        <div className="contact-form__row">
          <div className="contact-form__field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="contact-form__field">
            <label htmlFor="contact-email">Email (for reply)</label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={
              requestType === 'support'
                ? 'e.g. How do I export my leads?'
                : 'e.g. Pipeline page crashes when selecting a lead'
            }
          />
        </div>

        <div className="contact-form__field">
          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your question or issue in detail..."
            rows={5}
          />
        </div>

        <button type="submit" className="contact-form__submit primary">
          Open Email — Send to {RECIPIENT}
        </button>
      </form>
    </div>
  );
}
