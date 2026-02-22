import { Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PageLoader } from './PageLoader';

const NAV = [
  { path: '/', label: 'Dashboard' },
  { path: '/leads', label: 'Leads' },
  { path: '/pipeline', label: 'Scoring Pipeline' },
  { path: '/budget', label: 'Budget Optimizer' },
  { path: '/admin', label: 'Admin' },
];

export function DashboardLayout() {
  const loc = useLocation();

  return (
    <div className="app layout-dashboard">
      <aside className="layout-sidebar">
        <div className="sidebar-header">
          <strong className="sidebar-brand">LSSIS</strong>
          <div className="sidebar-tagline">Lead Scoring & Sales Intelligence</div>
        </div>
        <nav className="sidebar-nav">
          {NAV.map((n) => {
            const isActive = loc.pathname === n.path || (n.path !== '/' && loc.pathname.startsWith(n.path));
            return (
              <Link
                key={n.path}
                to={n.path}
                className={`nav-link ${isActive ? 'nav-link--active' : ''}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="layout-main">
        <Suspense fallback={<PageLoader />}>
          <div key={loc.pathname} className="page-transition">
            <Outlet />
          </div>
        </Suspense>
      </main>
    </div>
  );
}
