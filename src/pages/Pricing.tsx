import { useState } from 'react';
import { Link } from 'react-router-dom';

type Tier = 'individual' | 'team' | 'enterprise';

const TIERS = {
  individual: {
    name: 'Individual',
    price: 49,
    period: '/month',
    description: 'For solo sales professionals and small teams getting started.',
    features: [
      { label: 'Leads scored', value: '1,000', suffix: '/month' },
      { label: 'Pipeline runs', value: '100', suffix: '/month' },
      { label: 'CSV import', value: true },
      { label: 'Explainable scores', value: true },
      { label: 'Budget optimizer', value: false },
      { label: 'API access', value: false },
      { label: 'Email support', value: true },
      { label: 'Priority support', value: false },
      { label: 'Dedicated CSM', value: false },
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  team: {
    name: 'Team',
    price: 149,
    period: '/user/month',
    description: 'For SDR teams and RevOps who need collaboration and scaling.',
    features: [
      { label: 'Leads scored', value: '10,000', suffix: '/month' },
      { label: 'Pipeline runs', value: 'Unlimited', suffix: '' },
      { label: 'CSV import', value: true },
      { label: 'Explainable scores', value: true },
      { label: 'Budget optimizer', value: true },
      { label: 'API access', value: true },
      { label: 'Email support', value: true },
      { label: 'Priority support', value: true },
      { label: 'Dedicated CSM', value: false },
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    period: '',
    description: 'For large orgs with custom needs, integrations, and compliance.',
    features: [
      { label: 'Leads scored', value: 'Custom', suffix: '' },
      { label: 'Pipeline runs', value: 'Unlimited', suffix: '' },
      { label: 'CSV import', value: true },
      { label: 'Explainable scores', value: true },
      { label: 'Budget optimizer', value: true },
      { label: 'API access', value: true },
      { label: 'Email support', value: true },
      { label: 'Priority support', value: true },
      { label: 'Dedicated CSM', value: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
} as const;

function FeatureValue({ f }: { f: (typeof TIERS.individual.features)[0] }) {
  if (typeof f.value === 'boolean') {
    return f.value ? <span className="pricing-feature__check">✓</span> : <span className="pricing-feature__cross">—</span>;
  }
  return <span className="pricing-feature__value">{f.value}{f.suffix ?? ''}</span>;
}

export function Pricing() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');

  const annualMultiplier = 0.83; // ~2 months free

  return (
    <div className="pricing-page">
      <section className="pricing-hero">
        <h1>Simple, transparent pricing</h1>
        <p>Scale from solo to enterprise. Start free, upgrade when you're ready.</p>
        <div className="pricing-toggle">
          <button
            type="button"
            className={billing === 'monthly' ? 'pricing-toggle__active' : ''}
            onClick={() => setBilling('monthly')}
          >
            Monthly
          </button>
          <button
            type="button"
            className={billing === 'annual' ? 'pricing-toggle__active' : ''}
            onClick={() => setBilling('annual')}
          >
            Annual <span className="pricing-toggle__badge">Save 17%</span>
          </button>
        </div>
      </section>

      <section className="pricing-grid">
        {(Object.keys(TIERS) as Tier[]).map((tierKey) => {
          const t = TIERS[tierKey];
          const price = t.price === null ? null : billing === 'annual' ? Math.round(t.price * 12 * annualMultiplier) / 12 : t.price;
          const period = t.price === null ? '' : billing === 'annual' ? '/user/month' : t.period;

          return (
            <div
              key={tierKey}
              className={`pricing-card ${t.popular ? 'pricing-card--popular' : ''}`}
            >
              {t.popular && <span className="pricing-card__badge">Most Popular</span>}
              <h2 className="pricing-card__name">{t.name}</h2>
              <p className="pricing-card__desc">{t.description}</p>
              <div className="pricing-card__price">
                {price === null ? (
                  <span>Custom</span>
                ) : (
                  <>
                    <span className="pricing-card__amount">${price}</span>
                    <span className="pricing-card__period">{period}</span>
                  </>
                )}
              </div>
              <ul className="pricing-card__features">
                {t.features.map((f) => (
                  <li key={f.label} className="pricing-feature">
                    <span className="pricing-feature__label">{f.label}</span>
                    <FeatureValue f={f} />
                  </li>
                ))}
              </ul>
              <Link
                to={tierKey === 'enterprise' ? '/dashboard' : '/dashboard'}
                className={`pricing-card__cta ${t.popular ? 'pricing-card__cta--primary' : ''}`}
              >
                {t.cta}
              </Link>
            </div>
          );
        })}
      </section>

      <section className="pricing-faq">
        <h2>Frequently asked questions</h2>
        <div className="pricing-faq__grid">
          <div className="pricing-faq__item">
            <h4>What counts as a &quot;lead scored&quot;?</h4>
            <p>Each time we run our scoring pipeline on a lead (web scrape + NLP + ML score), it counts as one lead scored. Re-scoring the same lead counts again.</p>
          </div>
          <div className="pricing-faq__item">
            <h4>Can I change plans later?</h4>
            <p>Yes. You can upgrade or downgrade anytime. Changes take effect at the start of your next billing cycle.</p>
          </div>
          <div className="pricing-faq__item">
            <h4>Do you offer a free trial?</h4>
            <p>Yes. All paid plans include a 14-day free trial. No credit card required for Individual and Team.</p>
          </div>
          <div className="pricing-faq__item">
            <h4>What about Enterprise?</h4>
            <p>Enterprise includes custom lead limits, SSO, dedicated CSM, SLA, and integration support. Contact us for a custom quote.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
