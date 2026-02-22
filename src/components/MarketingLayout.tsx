import { Link, Outlet } from 'react-router-dom';

const NAV = [
  { path: '/', label: 'Product' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/case-studies', label: 'Case Studies' },
];

export function MarketingLayout() {
  return (
    <div className="marketing-layout">
      <header className="marketing-header">
        <div className="marketing-header__inner">
          <Link to="/" className="marketing-brand">
            <span className="marketing-brand__logo">LSSIS</span>
            <span className="marketing-brand__tag">Lead Scoring & Sales Intelligence</span>
          </Link>
          <nav className="marketing-nav">
            {NAV.map((n) => (
              <Link key={n.path} to={n.path} className="marketing-nav__link">
                {n.label}
              </Link>
            ))}
            <Link to="/dashboard" className="marketing-nav__cta">
              Get Started
            </Link>
          </nav>
        </div>
      </header>
      <main className="marketing-main">
        <Outlet />
      </main>
      <footer className="marketing-footer">
        <div className="marketing-footer__inner">
          <span className="marketing-footer__brand">LSSIS</span>
          <div className="marketing-footer__links">
            <Link to="/pricing">Pricing</Link>
            <Link to="/case-studies">Case Studies</Link>
            <Link to="/dashboard">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
