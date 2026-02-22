import { useState } from 'react';
import { Link } from 'react-router-dom';

const COMPANY_SIZES = [
  { value: '1-10', label: '1–10 employees' },
  { value: '11-50', label: '11–50 employees' },
  { value: '51-200', label: '51–200 employees' },
  { value: '201-500', label: '201–500 employees' },
  { value: '500+', label: '500+ employees' },
  { value: 'solo', label: 'Solo developer' },
];

const APP_CATEGORIES = [
  { value: 'crm', label: 'CRM Integration' },
  { value: 'automation', label: 'Workflow Automation' },
  { value: 'analytics', label: 'Analytics & Reporting' },
  { value: 'enrichment', label: 'Data Enrichment' },
  { value: 'notifications', label: 'Notifications & Alerts' },
  { value: 'other', label: 'Other' },
];

const RECIPIENT = 'partners@lssis.example.com';

export function BuildApp() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    // Company / Developer
    companyName: '',
    companyWebsite: '',
    companySize: '',
    // Contact
    contactName: '',
    contactEmail: '',
    contactRole: '',
    // App
    appName: '',
    appDescription: '',
    appCategory: '',
    useCase: '',
    targetUsers: '',
    integrationReqs: '',
    // Technical
    techStack: '',
    timeline: '',
    // Additional
    additionalInfo: '',
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[LSSIS Partner] Build an App — ${form.appName || 'New Application'}`);
    const body = encodeURIComponent(
      [
        '--- LSSIS Partner Application ---',
        '',
        'COMPANY',
        `Name: ${form.companyName}`,
        `Website: ${form.companyWebsite}`,
        `Size: ${form.companySize}`,
        '',
        'CONTACT',
        `Name: ${form.contactName}`,
        `Email: ${form.contactEmail}`,
        `Role: ${form.contactRole}`,
        '',
        'APP',
        `Name: ${form.appName}`,
        `Category: ${form.appCategory}`,
        `Description: ${form.appDescription}`,
        `Use case: ${form.useCase}`,
        `Target users: ${form.targetUsers}`,
        `Integration requirements: ${form.integrationReqs}`,
        '',
        'TECHNICAL',
        `Tech stack: ${form.techStack}`,
        `Timeline: ${form.timeline}`,
        '',
        'ADDITIONAL',
        form.additionalInfo || '(none)',
      ].join('\n')
    );
    window.location.href = `mailto:${RECIPIENT}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="build-app-page">
        <div className="build-app-success">
          <div className="build-app-success__icon">✓</div>
          <h2>Application submitted</h2>
          <p>
            Your email client has opened with a pre-filled application. Send the email to complete your submission.
            Our team will review and get in touch within 3–5 business days.
          </p>
          <Link to="/marketplace" className="landing-cta landing-cta--primary">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="build-app-page">
      <header className="build-app-hero">
        <h1>Build an App on LSSIS</h1>
        <p>
          Join our partner program. Build integrations that help sales teams work smarter. Get inspired by Stripe and Shopify—we’re building a marketplace for lead scoring and sales intelligence.
        </p>
      </header>

      <div className="build-app-steps">
        <div className="build-app-step build-app-step--active">
          <span className="build-app-step__num">1</span>
          Company
        </div>
        <div className="build-app-step build-app-step--active">
          <span className="build-app-step__num">2</span>
          Contact
        </div>
        <div className="build-app-step build-app-step--active">
          <span className="build-app-step__num">3</span>
          App idea
        </div>
      </div>

      <form onSubmit={handleSubmit} className="build-app-form">
        <div className="build-app-form__section">
          <h3 className="build-app-form__section-title">Company / Developer</h3>
          <div className="build-app-form__field">
            <label htmlFor="companyName">Company or developer name *</label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Acme Inc"
              required
            />
          </div>
          <div className="build-app-form__field">
            <label htmlFor="companyWebsite">Website <span className="optional">(optional)</span></label>
            <input
              id="companyWebsite"
              name="companyWebsite"
              type="url"
              value={form.companyWebsite}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
          <div className="build-app-form__field">
            <label htmlFor="companySize">Company size</label>
            <select
              id="companySize"
              name="companySize"
              value={form.companySize}
              onChange={handleChange}
            >
              <option value="">Select size</option>
              {COMPANY_SIZES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="build-app-form__section">
          <h3 className="build-app-form__section-title">Primary contact</h3>
          <div className="build-app-form__field">
            <label htmlFor="contactName">Full name *</label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              value={form.contactName}
              onChange={handleChange}
              placeholder="Jane Smith"
              required
            />
          </div>
          <div className="build-app-form__field">
            <label htmlFor="contactEmail">Email *</label>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              value={form.contactEmail}
              onChange={handleChange}
              placeholder="jane@example.com"
              required
            />
          </div>
          <div className="build-app-form__field">
            <label htmlFor="contactRole">Role <span className="optional">(optional)</span></label>
            <input
              id="contactRole"
              name="contactRole"
              type="text"
              value={form.contactRole}
              onChange={handleChange}
              placeholder="Product Lead, Developer, etc."
            />
          </div>
        </div>

        <div className="build-app-form__section">
          <h3 className="build-app-form__section-title">App details</h3>
          <div className="build-app-form__field">
            <label htmlFor="appName">App name *</label>
            <input
              id="appName"
              name="appName"
              type="text"
              value={form.appName}
              onChange={handleChange}
              placeholder="e.g. HubSpot Lead Sync"
              required
            />
          </div>
          <div className="build-app-form__field">
            <label htmlFor="appCategory">Category</label>
            <select
              id="appCategory"
              name="appCategory"
              value={form.appCategory}
              onChange={handleChange}
            >
              <option value="">Select category</option>
              {APP_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="build-app-form__field">
            <label htmlFor="appDescription">Description *</label>
            <textarea
              id="appDescription"
              name="appDescription"
              value={form.appDescription}
              onChange={handleChange}
              placeholder="What does your app do? How does it integrate with LSSIS?"
              required
            />
          </div>
          <div className="build-app-form__field">
            <label htmlFor="useCase">Primary use case</label>
            <textarea
              id="useCase"
              name="useCase"
              value={form.useCase}
              onChange={handleChange}
              placeholder="Describe the main problem your app solves for LSSIS users."
            />
          </div>
          <div className="build-app-form__field">
            <label htmlFor="targetUsers">Target users</label>
            <input
              id="targetUsers"
              name="targetUsers"
              type="text"
              value={form.targetUsers}
              onChange={handleChange}
              placeholder="e.g. Sales managers, SDRs, RevOps teams"
            />
          </div>
          <div className="build-app-form__field">
            <label htmlFor="integrationReqs">Integration requirements</label>
            <textarea
              id="integrationReqs"
              name="integrationReqs"
              value={form.integrationReqs}
              onChange={handleChange}
              placeholder="Which LSSIS APIs or entities will you use? (leads, scores, budget, etc.)"
            />
          </div>
        </div>

        <div className="build-app-form__section">
          <h3 className="build-app-form__section-title">Technical</h3>
          <div className="build-app-form__field">
            <label htmlFor="techStack">Tech stack <span className="optional">(optional)</span></label>
            <input
              id="techStack"
              name="techStack"
              type="text"
              value={form.techStack}
              onChange={handleChange}
              placeholder="e.g. Node.js, Python, Zapier"
            />
          </div>
          <div className="build-app-form__field">
            <label htmlFor="timeline">Expected launch timeline</label>
            <input
              id="timeline"
              name="timeline"
              type="text"
              value={form.timeline}
              onChange={handleChange}
              placeholder="e.g. 4–6 weeks, Q2 2025"
            />
          </div>
        </div>

        <div className="build-app-form__section">
          <div className="build-app-form__field">
            <label htmlFor="additionalInfo">Anything else we should know?</label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={form.additionalInfo}
              onChange={handleChange}
              placeholder="Prior integrations, case studies, etc."
            />
          </div>
          <div className="build-app-form__field">
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="agreeTerms"
                checked={form.agreeTerms}
                onChange={handleChange}
                required
              />
              <span>
                I agree to the LSSIS Partner Program terms and will use the API in accordance with our agreement. *
              </span>
            </label>
          </div>
        </div>

        <p className="build-app-form__hint">
          Submitting opens your email client with a pre-filled application to {RECIPIENT}. You can edit before sending.
        </p>

        <button type="submit" className="build-app-form__submit primary">
          Submit Application
        </button>
      </form>
    </div>
  );
}
