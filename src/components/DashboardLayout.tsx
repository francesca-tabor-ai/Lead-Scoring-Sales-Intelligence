import { Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PageLoader } from './PageLoader';

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/dashboard/leads', label: 'Leads' },
  { path: '/dashboard/pipeline', label: 'Scoring Pipeline' },
  { path: '/dashboard/budget', label: 'Budget Optimizer' },
  { path: '/dashboard/admin', label: 'Admin' },
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
            const isActive = loc.pathname === n.path || (n.path !== '/' && n.path !== '/dashboard' && loc.pathname.startsWith(n.path)) || (n.path === '/dashboard' && loc.pathname === '/dashboard');
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
