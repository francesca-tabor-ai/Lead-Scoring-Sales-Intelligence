import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';

/* Lazy load pages for faster initial load */
const Dashboard = lazy(() => import('./pages/Dashboard').then((m) => ({ default: m.Dashboard })));
const Leads = lazy(() => import('./pages/Leads').then((m) => ({ default: m.Leads })));
const LeadDetail = lazy(() => import('./pages/LeadDetail').then((m) => ({ default: m.LeadDetail })));
const Pipeline = lazy(() => import('./pages/Pipeline').then((m) => ({ default: m.Pipeline })));
const Budget = lazy(() => import('./pages/Budget').then((m) => ({ default: m.Budget })));
const Admin = lazy(() => import('./pages/Admin').then((m) => ({ default: m.Admin })));
const ImportCSV = lazy(() => import('./pages/ImportCSV').then((m) => ({ default: m.ImportCSV })));

function App() {
  return (
    <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<Leads />} />
          <Route path="leads/import" element={<ImportCSV />} />
          <Route path="leads/:id" element={<LeadDetail />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="budget" element={<Budget />} />
          <Route path="admin" element={<Admin />} />
        </Route>
      </Routes>
  );
}

export default App;
