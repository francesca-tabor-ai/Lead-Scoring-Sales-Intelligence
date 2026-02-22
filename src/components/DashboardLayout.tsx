import { Suspense } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { PageLoader } from './PageLoader';
import { ChatWidget } from './ChatWidget';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { path: '/', label: 'Home' },
  { path: '/leads', label: 'Leads' },
  { path: '/pipeline', label: 'Scoring Pipeline' },
  { path: '/budget', label: 'Budget Optimizer' },
  { path: '/admin', label: 'Admin' },
  { path: '/contact', label: 'Contact Us' },
];

export function DashboardLayout() {
  const loc = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="app layout-dashboard">
      <aside className="layout-sidebar">
        <div className="sidebar-header">
          <strong className="sidebar-brand">LSSIS</strong>
          <div className="sidebar-tagline">Lead Scoring & Sales Intelligence</div>
        </div>
        <nav className="sidebar-nav">
          {NAV.filter((n) => n.path !== '/admin' || user?.role === 'admin').map((n) => {
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
        <div className="sidebar-footer">
          {user ? (
            <>
              <span className="sidebar-user">{user.email}</span>
              {user.role === 'admin' && <span className="sidebar-badge">Admin</span>}
              <button type="button" onClick={logout} className="sidebar-logout">
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Sign in</Link>
          )}
        </div>
      </aside>
      <main className="layout-main">
        <Suspense fallback={<PageLoader />}>
          <div key={loc.pathname} className="page-transition">
            <Outlet />
          </div>
        </Suspense>
        <footer className="dashboard-footer">
          <div className="dashboard-footer__links">
            <Link to="/api-docs">API Docs</Link>
            <Link to="/marketplace">App Marketplace</Link>
            <Link to="/build-app">Build an App</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <span className="dashboard-footer__brand">LSSIS — Lead Scoring & Sales Intelligence</span>
        </footer>
      </main>
      <ChatWidget />
    </div>
  );
}
