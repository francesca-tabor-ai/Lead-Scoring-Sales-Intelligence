import { Link } from 'react-router-dom';

const CASE_STUDIES = [
  {
    id: 'techscale',
    company: 'TechScale Inc',
    industry: 'SaaS',
    quote: 'We cut our SDR research time by 60% and improved conversion by 34%. LSSIS gave us a clear order of attack instead of guesswork.',
    author: 'Sarah Chen',
    role: 'VP of Sales',
    metrics: [
      { value: '60%', label: 'Less research time' },
      { value: '34%', label: 'Conversion lift' },
      { value: '2.4x', label: 'ROI on outbound' },
    ],
  },
  {
    id: 'dataflow',
    company: 'DataFlow Analytics',
    industry: 'Data & AI',
    quote: 'Budget optimization was a game-changer. We knew exactly which leads to fund and projected ROI before we spent a dollar.',
    author: 'Marcus Webb',
    role: 'Head of RevOps',
    metrics: [
      { value: '2.1x', label: 'Budget efficiency' },
      { value: '45%', label: 'Faster prioritization' },
      { value: '28%', label: 'Win rate improvement' },
    ],
  },
  {
    id: 'medtech',
    company: 'MedTech Solutions',
    industry: 'Healthcare',
    quote: 'Explainable scores finally got our reps to trust the system. They could see why a lead scored high and tailor their outreach accordingly.',
    author: 'Dr. Elena Rodriguez',
    role: 'Sales Director',
    metrics: [
      { value: '89%', label: 'Rep adoption' },
      { value: '22%', label: 'Quota attainment increase' },
      { value: '3 weeks', label: 'Time to value' },
    ],
  },
];

const LOGO_COMPANIES = [
  'TechScale',
  'DataFlow Analytics',
  'CloudNine',
  'MedTech Solutions',
  'FinServe Global',
  'EduTech Ventures',
  'CyberShield',
  'MarketPulse',
  'NextGen Retail',
  'LogiChain',
  'AutoDrive Systems',
  'GreenEnergy Co',
];

export function CaseStudies() {
  return (
    <div className="case-studies-page">
      {/* Scrolling logos */}
      <section className="case-studies-logos">
        <div className="case-studies-logos__inner">
          <p className="case-studies-logos__label">Trusted by sales teams at</p>
          <div className="case-studies-logos__track">
            <div className="case-studies-logos__scroll">
              {[...LOGO_COMPANIES, ...LOGO_COMPANIES].map((name, i) => (
                <span key={`${name}-${i}`} className="case-studies-logos__item">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="case-studies-hero">
        <h1>Results that speak for themselves</h1>
        <p>See how B2B sales teams use LSSIS to prioritize leads, optimize budgets, and close more deals.</p>
      </section>

      {/* Case study cards */}
      <section className="case-studies-grid">
        {CASE_STUDIES.map((cs) => (
          <article key={cs.id} className="case-study-card">
            <div className="case-study-card__header">
              <span className="case-study-card__company">{cs.company}</span>
              <span className="case-study-card__industry">{cs.industry}</span>
            </div>
            <blockquote className="case-study-card__quote">&ldquo;{cs.quote}&rdquo;</blockquote>
            <div className="case-study-card__author">
              <strong>{cs.author}</strong>
              <span>{cs.role}, {cs.company}</span>
            </div>
            <div className="case-study-card__metrics">
              {cs.metrics.map((m) => (
                <div key={m.label} className="case-study-card__metric">
                  <span className="case-study-card__metric-value">{m.value}</span>
                  <span className="case-study-card__metric-label">{m.label}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* CTA */}
      <section className="case-studies-cta">
        <h2>Ready to join them?</h2>
        <p>See what LSSIS can do for your sales team.</p>
        <div className="case-studies-cta__buttons">
          <Link to="/dashboard" className="landing-cta landing-cta--primary">
            Try LSSIS Free
          </Link>
          <Link to="/pricing" className="landing-cta landing-cta--secondary">
            View Pricing
          </Link>
        </div>
      </section>
    </div>
  );
}
