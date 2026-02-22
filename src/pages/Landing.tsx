import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero__content">
          <p className="landing-hero__badge">For B2B Sales Teams</p>
          <h1 className="landing-hero__title">
            Stop guessing. Start closing.
          </h1>
          <p className="landing-hero__subtitle">
            LSSIS helps sales leaders and SDR teams prioritize the right leads, allocate budgets intelligently, and turn pipeline chaos into predictable revenue — with explainable scores and ROI optimization built in.
          </p>
          <div className="landing-hero__ctas">
            <Link to="/dashboard" className="landing-cta landing-cta--primary">
              Try LSSIS Free
            </Link>
            <Link to="/case-studies" className="landing-cta landing-cta--secondary">
              See Case Studies
            </Link>
          </div>
        </div>
      </section>

      {/* The Customer */}
      <section className="landing-section landing-section--subtle">
        <div className="landing-section__inner">
          <h2 className="landing-section__title">Built for the people who move deals</h2>
          <p className="landing-section__intro">
            LSSIS is built for <strong>B2B sales leaders</strong>, <strong>SDR managers</strong>, and <strong>RevOps teams</strong> at SMB and mid-market companies who sell high-consideration products (ACV $10K–$100K+), manage hundreds or thousands of leads, and need to align effort with real pipeline value.
          </p>
          <div className="landing-personas">
            <div className="landing-persona">
              <div className="landing-persona__icon">👔</div>
              <h3>Sales Leaders</h3>
              <p>You need forecast accuracy and team productivity. You can’t afford reps chasing dead leads.</p>
            </div>
            <div className="landing-persona">
              <div className="landing-persona__icon">🎯</div>
              <h3>SDR Managers</h3>
              <p>You own outbound cadences and conversion rates. You need a clear order of attack.</p>
            </div>
            <div className="landing-persona">
              <div className="landing-persona__icon">📊</div>
              <h3>RevOps</h3>
              <p>You’re tired of stitching tools together. You want one source of truth for lead intelligence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Pain */}
      <section className="landing-section">
        <div className="landing-section__inner">
          <h2 className="landing-section__title">The problem: scattered leads, blind budgets, black-box scores</h2>
          <p className="landing-section__intro">
            SDRs waste 40–60% of their time on leads that never convert. Marketing and sales spend without knowing which leads will yield the best ROI. Reps don’t trust scores they can’t explain — so they ignore them. And firmographic data, NLP signals, and scores live in different tools and spreadsheets.
          </p>
          <div className="landing-pain-grid">
            <div className="landing-pain-card">
              <span className="landing-pain-card__label">Wasted time</span>
              <p>SDRs chase low-quality leads instead of the ones most likely to close.</p>
            </div>
            <div className="landing-pain-card">
              <span className="landing-pain-card__label">Manual guesswork</span>
              <p>No scalable, consistent way to prioritize who to call first.</p>
            </div>
            <div className="landing-pain-card">
              <span className="landing-pain-card__label">Blind budgets</span>
              <p>Spend without visibility into which leads will deliver the best ROI.</p>
            </div>
            <div className="landing-pain-card">
              <span className="landing-pain-card__label">Data silos</span>
              <p>Firmographics, signals, and scores scattered across tools and sheets.</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="landing-section landing-section--accent">
        <div className="landing-section__inner">
          <h2 className="landing-section__title">How we solve it</h2>
          <p className="landing-section__intro">
            LSSIS turns chaos into a single, transparent workflow: <strong>Import → Enrich → Score → Optimize</strong>. One platform. One source of truth. Explainable scores your reps will actually use.
          </p>
          <div className="landing-solution-steps">
            <div className="landing-step">
              <span className="landing-step__num">1</span>
              <div>
                <h3>Import & Enrich</h3>
                <p>Bring in leads from CSV. Our web scraper and NLP agents pull firmographics and buying signals automatically.</p>
              </div>
            </div>
            <div className="landing-step">
              <span className="landing-step__num">2</span>
              <div>
                <h3>Score & Explain</h3>
                <p>Every lead gets a 0–100 score with conversion probability. See exactly why each lead scored high or low — reps trust what they understand.</p>
              </div>
            </div>
            <div className="landing-step">
              <span className="landing-step__num">3</span>
              <div>
                <h3>Optimize Budget</h3>
                <p>Set your budget. Get the best set of leads and projected ROI. No more guessing which campaigns to fund.</p>
              </div>
            </div>
          </div>
          <div className="landing-section__cta">
            <Link to="/dashboard" className="landing-cta landing-cta--primary">
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="landing-trust">
        <div className="landing-trust__inner">
          <p className="landing-trust__label">Trusted by sales teams at</p>
          <div className="landing-trust__logos">
            {['TechScale', 'DataFlow', 'CloudNine', 'MedTech', 'FinServe', 'EduTech', 'CyberShield', 'MarketPulse'].map((name) => (
              <span key={name} className="landing-trust__logo">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="landing-cta-section">
        <div className="landing-cta-section__inner">
          <h2>Ready to prioritize like a pro?</h2>
          <p>Join sales teams who close more with less effort.</p>
          <Link to="/dashboard" className="landing-cta landing-cta--primary landing-cta--large">
            Try LSSIS Free
          </Link>
        </div>
      </section>
    </div>
  );
}
