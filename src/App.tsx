import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './components/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { LeadDetail } from './pages/LeadDetail';
import { Pipeline } from './pages/Pipeline';
import { Budget } from './pages/Budget';
import { Admin } from './pages/Admin';
import { ImportCSV } from './pages/ImportCSV';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { useAuth } from './contexts/AuthContext';

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="leads/import" element={<ImportCSV />} />
        <Route path="leads/:id" element={<LeadDetail />} />
        <Route path="pipeline" element={<Pipeline />} />
        <Route path="budget" element={<Budget />} />
        <Route path="admin" element={<AdminGuard><Admin /></AdminGuard>} />
        <Route path="contact" element={<Contact />} />
        <Route path="api-docs" element={<ApiDocs />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="build-app" element={<BuildApp />} />
      </Route>
    </Routes>
  );
}

export default App;
