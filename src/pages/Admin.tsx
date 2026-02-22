import { useState } from 'react';
import { trpc } from '../trpc';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'overview' | 'leads' | 'companyProfiles' | 'nlpFeatures' | 'leadScores' | 'budgetAllocations' | 'agentJobs' | 'modelMetrics' | 'users';

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'leads', label: 'Leads' },
  { key: 'companyProfiles', label: 'Company Profiles' },
  { key: 'nlpFeatures', label: 'NLP Features' },
  { key: 'leadScores', label: 'Lead Scores' },
  { key: 'budgetAllocations', label: 'Budget Allocations' },
  { key: 'agentJobs', label: 'Agent Jobs' },
  { key: 'modelMetrics', label: 'Model Metrics' },
  { key: 'users', label: 'Users' },
];

export function Admin() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="admin-page">
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Admin Dashboard</h1>
      <div className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`admin-tab ${tab === t.key ? 'admin-tab--active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="admin-content">
        {tab === 'overview' && <AdminOverview />}
        {tab === 'leads' && <AdminLeads />}
        {tab === 'companyProfiles' && <AdminCompanyProfiles />}
        {tab === 'nlpFeatures' && <AdminNLPFeatures />}
        {tab === 'leadScores' && <AdminLeadScores />}
        {tab === 'budgetAllocations' && <AdminBudgetAllocations />}
        {tab === 'agentJobs' && <AdminAgentJobs />}
        {tab === 'modelMetrics' && <AdminModelMetrics />}
        {tab === 'users' && <AdminUsers />}
      </div>
    </div>
  );
}

function AdminOverview() {
  const { data: metrics } = trpc.admin.getModelMetrics.useQuery();
  const { data: config } = trpc.admin.getSystemConfig.useQuery();
  const retrain = trpc.admin.triggerRetrain.useMutation();
  const utils = trpc.useUtils();

  const onRetrain = async () => {
    await retrain.mutateAsync();
    utils.admin.getModelMetrics.invalidate();
  };

  return (
    <div className="admin-grid">
      <div className="admin-card">
        <h3>Model Metrics</h3>
        {metrics ? (
          <div className="admin-metrics">
            <div><span>Accuracy</span><span>{(metrics.accuracy * 100).toFixed(1)}%</span></div>
            <div><span>Precision</span><span>{(metrics.precision * 100).toFixed(1)}%</span></div>
            <div><span>Recall</span><span>{(metrics.recall * 100).toFixed(1)}%</span></div>
            <div><span>F1</span><span>{(metrics.f1 * 100).toFixed(1)}%</span></div>
            <div><span>AUC</span><span>{(metrics.auc * 100).toFixed(1)}%</span></div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Trained: {new Date(metrics.trainedAt).toLocaleString()}</div>
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No metrics yet</p>
        )}
        <button onClick={onRetrain} disabled={retrain.isPending} style={{ marginTop: '1rem' }}>
          {retrain.isPending ? 'Retraining...' : 'Trigger Retrain'}
        </button>
      </div>
      <div className="admin-card">
        <h3>System Config</h3>
        {config ? (
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            <li>NLP Provider: {config.nlpProvider}</li>
            <li>Scoring Model: {config.scoringModel}</li>
          </ul>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        )}
      </div>
    </div>
  );
}

function AdminLeads() {
  const { data: items, refetch } = trpc.admin.listLeads.useQuery();
  const create = trpc.admin.createLead.useMutation({ onSuccess: () => refetch() });
  const update = trpc.admin.updateLead.useMutation({ onSuccess: () => refetch() });
  const del = trpc.admin.deleteLead.useMutation({ onSuccess: () => refetch() });
  const [editing, setEditing] = useState<NonNullable<typeof items>[number] | 'new' | null>(null);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    create.mutate({
      companyId: fd.get('companyId') as string,
      name: fd.get('name') as string,
      domain: fd.get('domain') as string,
      region: fd.get('region') as string,
      industry: fd.get('industry') as string,
      status: (fd.get('status') as string) || 'new',
    });
    setEditing(null);
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const id = fd.get('id') as string;
    update.mutate({
      id,
      companyId: fd.get('companyId') as string,
      name: fd.get('name') as string,
      domain: fd.get('domain') as string,
      region: fd.get('region') as string,
      industry: fd.get('industry') as string,
      status: fd.get('status') as string,
    });
    setEditing(null);
  };

  return (
    <div className="admin-crud">
      <button type="button" onClick={() => setEditing('new')}>+ Add Lead</button>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Domain</th><th>Region</th><th>Industry</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items?.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td><td>{r.domain}</td><td>{r.region}</td><td>{r.industry}</td><td>{r.status}</td>
                <td>
                  <button type="button" onClick={() => setEditing(r)}>Edit</button>
                  <button type="button" className="admin-btn-danger" onClick={() => { if (confirm('Delete?')) del.mutate(r.id); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>{editing === 'new' ? 'Create Lead' : 'Edit Lead'}</h3>
            <form onSubmit={editing === 'new' ? handleCreate : handleUpdate}>
              {editing !== 'new' && <input type="hidden" name="id" value={editing.id} />}
              <label>Company ID <input name="companyId" defaultValue={editing !== 'new' ? editing.companyId : ''} required /></label>
              <label>Name <input name="name" defaultValue={editing !== 'new' ? editing.name : ''} required /></label>
              <label>Domain <input name="domain" defaultValue={editing !== 'new' ? editing.domain : ''} required /></label>
              <label>Region <input name="region" defaultValue={editing !== 'new' ? editing.region : ''} required /></label>
              <label>Industry <input name="industry" defaultValue={editing !== 'new' ? editing.industry : ''} required /></label>
              <label>Status <select name="status" defaultValue={editing !== 'new' ? editing.status : 'new'}><option value="new">new</option><option value="contacted">contacted</option><option value="qualified">qualified</option><option value="converted">converted</option></select></label>
              <div className="admin-form-actions">
                <button type="submit">{editing === 'new' ? 'Create' : 'Update'}</button>
                <button type="button" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminCompanyProfiles() {
  const { data: items, refetch } = trpc.admin.listCompanyProfiles.useQuery();
  const create = trpc.admin.createCompanyProfile.useMutation({ onSuccess: () => refetch() });
  const update = trpc.admin.updateCompanyProfile.useMutation({ onSuccess: () => refetch() });
  const del = trpc.admin.deleteCompanyProfile.useMutation({ onSuccess: () => refetch() });
  const [editing, setEditing] = useState<NonNullable<typeof items>[number] | 'new' | null>(null);

  return (
    <div className="admin-crud">
      <button type="button" onClick={() => setEditing('new')}>+ Add Company Profile</button>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Lead</th><th>Revenue</th><th>Employees</th><th>Funding</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items?.map((r) => (
              <tr key={r.id}>
                <td>{r.lead?.name ?? r.leadId}</td><td>{r.revenue}</td><td>{r.employees}</td><td>{r.funding}</td>
                <td>
                  <button type="button" onClick={() => setEditing(r)}>Edit</button>
                  <button type="button" className="admin-btn-danger" onClick={() => { if (confirm('Delete?')) del.mutate(r.id); }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>{editing === 'new' ? 'Create Company Profile' : 'Edit'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget);
              if (editing === 'new') create.mutate({ leadId: fd.get('leadId') as string, revenue: fd.get('revenue') as string, employees: Number(fd.get('employees')) || undefined, funding: fd.get('funding') as string });
              else update.mutate({ id: editing.id, revenue: fd.get('revenue') as string, employees: Number(fd.get('employees')) || undefined, funding: fd.get('funding') as string });
              setEditing(null);
            }}>
              {editing === 'new' && <label>Lead ID <input name="leadId" required /></label>}
              <label>Revenue <input name="revenue" defaultValue={editing !== 'new' ? editing.revenue ?? '' : ''} /></label>
              <label>Employees <input type="number" name="employees" defaultValue={editing !== 'new' ? editing.employees ?? '' : ''} /></label>
              <label>Funding <input name="funding" defaultValue={editing !== 'new' ? editing.funding ?? '' : ''} /></label>
              <div className="admin-form-actions"><button type="submit">Save</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminNLPFeatures() {
  const { data: items, refetch } = trpc.admin.listNLPFeatures.useQuery();
  const create = trpc.admin.createNLPFeatures.useMutation({ onSuccess: () => refetch() });
  const update = trpc.admin.updateNLPFeatures.useMutation({ onSuccess: () => refetch() });
  const del = trpc.admin.deleteNLPFeatures.useMutation({ onSuccess: () => refetch() });
  const [editing, setEditing] = useState<NonNullable<typeof items>[number] | 'new' | null>(null);

  return (
    <div className="admin-crud">
      <button type="button" onClick={() => setEditing('new')}>+ Add NLP Features</button>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Lead</th><th>Sentiment</th><th>Expansion</th><th>Hiring</th><th>Funding</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items?.map((r) => (
              <tr key={r.id}>
                <td>{r.lead?.name ?? r.leadId}</td><td>{r.sentiment}</td><td>{r.expansionSignal ? '✓' : '—'}</td><td>{r.hiringSignal ? '✓' : '—'}</td><td>{r.fundingSignal ? '✓' : '—'}</td>
                <td><button type="button" onClick={() => setEditing(r)}>Edit</button><button type="button" className="admin-btn-danger" onClick={() => { if (confirm('Delete?')) del.mutate(r.id); }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>{editing === 'new' ? 'Create NLP Features' : 'Edit'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget);
              if (editing === 'new') create.mutate({ leadId: fd.get('leadId') as string, sentiment: Number(fd.get('sentiment')) || undefined, expansionSignal: fd.get('expansionSignal') === 'on', hiringSignal: fd.get('hiringSignal') === 'on', fundingSignal: fd.get('fundingSignal') === 'on' });
              else update.mutate({ id: editing.id, sentiment: Number(fd.get('sentiment')) || undefined, expansionSignal: fd.get('expansionSignal') === 'on', hiringSignal: fd.get('hiringSignal') === 'on', fundingSignal: fd.get('fundingSignal') === 'on' });
              setEditing(null);
            }}>
              {editing === 'new' && <label>Lead ID <input name="leadId" required /></label>}
              <label>Sentiment <input type="number" step="0.01" name="sentiment" defaultValue={editing !== 'new' ? editing.sentiment ?? '' : ''} /></label>
              <label><input type="checkbox" name="expansionSignal" defaultChecked={editing !== 'new' ? Boolean(editing.expansionSignal) : false} /> Expansion</label>
              <label><input type="checkbox" name="hiringSignal" defaultChecked={editing !== 'new' ? Boolean(editing.hiringSignal) : false} /> Hiring</label>
              <label><input type="checkbox" name="fundingSignal" defaultChecked={editing !== 'new' ? Boolean(editing.fundingSignal) : false} /> Funding</label>
              <div className="admin-form-actions"><button type="submit">Save</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminLeadScores() {
  const { data: items, refetch } = trpc.admin.listLeadScores.useQuery();
  const create = trpc.admin.createLeadScore.useMutation({ onSuccess: () => refetch() });
  const update = trpc.admin.updateLeadScore.useMutation({ onSuccess: () => refetch() });
  const del = trpc.admin.deleteLeadScore.useMutation({ onSuccess: () => refetch() });
  const [editing, setEditing] = useState<NonNullable<typeof items>[number] | 'new' | null>(null);

  return (
    <div className="admin-crud">
      <button type="button" onClick={() => setEditing('new')}>+ Add Lead Score</button>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Lead</th><th>Score</th><th>Probability</th><th>Rank</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items?.map((r) => (
              <tr key={r.id}>
                <td>{r.lead?.name ?? r.leadId}</td><td>{r.leadScore}</td><td>{(r.conversionProbability * 100).toFixed(1)}%</td><td>{r.priorityRank}</td>
                <td><button type="button" onClick={() => setEditing(r)}>Edit</button><button type="button" className="admin-btn-danger" onClick={() => { if (confirm('Delete?')) del.mutate(r.id); }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>{editing === 'new' ? 'Create Lead Score' : 'Edit'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget);
              if (editing === 'new') create.mutate({ leadId: fd.get('leadId') as string, conversionProbability: Number(fd.get('conversionProbability')), leadScore: Number(fd.get('leadScore')), priorityRank: Number(fd.get('priorityRank')), factors: fd.get('factors') as string });
              else update.mutate({ id: editing.id, conversionProbability: Number(fd.get('conversionProbability')) || undefined, leadScore: Number(fd.get('leadScore')) || undefined, priorityRank: Number(fd.get('priorityRank')) || undefined, factors: fd.get('factors') as string });
              setEditing(null);
            }}>
              {editing === 'new' && <label>Lead ID <input name="leadId" required /></label>}
              <label>Conversion Probability <input type="number" step="0.01" name="conversionProbability" defaultValue={editing !== 'new' ? editing.conversionProbability : 0.5} required /></label>
              <label>Lead Score <input type="number" name="leadScore" defaultValue={editing !== 'new' ? editing.leadScore : 50} required /></label>
              <label>Priority Rank <input type="number" name="priorityRank" defaultValue={editing !== 'new' ? editing.priorityRank : 1} required /></label>
              <label>Factors (JSON) <input name="factors" defaultValue={editing !== 'new' ? editing.factors ?? '' : ''} /></label>
              <div className="admin-form-actions"><button type="submit">Save</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminBudgetAllocations() {
  const { data: items, refetch } = trpc.admin.listBudgetAllocations.useQuery();
  const del = trpc.admin.deleteBudgetAllocation.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="admin-crud">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Budget</th><th>Expected ROI</th><th>Total Cost</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items?.map((r) => (
              <tr key={r.id}>
                <td>${r.budget.toLocaleString()}</td><td>{r.expectedRoi}x</td><td>${r.totalCost.toLocaleString()}</td><td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td><button type="button" className="admin-btn-danger" onClick={() => { if (confirm('Delete?')) del.mutate(r.id); }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminAgentJobs() {
  const { data: items, refetch } = trpc.admin.listAgentJobs.useQuery();
  const del = trpc.admin.deleteAgentJob.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="admin-crud">
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Type</th><th>Lead</th><th>Status</th><th>Started</th><th>Completed</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items?.map((r) => (
              <tr key={r.id}>
                <td>{r.agentType}</td><td>{r.lead?.name ?? '—'}</td><td>{r.status}</td><td>{r.startedAt ? new Date(r.startedAt).toLocaleString() : '—'}</td><td>{r.completedAt ? new Date(r.completedAt).toLocaleString() : '—'}</td>
                <td><button type="button" className="admin-btn-danger" onClick={() => { if (confirm('Delete?')) del.mutate(r.id); }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminModelMetrics() {
  const { data: items, refetch } = trpc.admin.listModelMetrics.useQuery();
  const create = trpc.admin.createModelMetrics.useMutation({ onSuccess: () => refetch() });
  const del = trpc.admin.deleteModelMetrics.useMutation({ onSuccess: () => refetch() });
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="admin-crud">
      <button type="button" onClick={() => setShowForm(true)}>+ Add Model Metrics</button>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Accuracy</th><th>Precision</th><th>Recall</th><th>F1</th><th>AUC</th><th>Trained</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items?.map((r) => (
              <tr key={r.id}>
                <td>{(r.accuracy * 100).toFixed(1)}%</td><td>{(r.precision * 100).toFixed(1)}%</td><td>{(r.recall * 100).toFixed(1)}%</td><td>{(r.f1 * 100).toFixed(1)}%</td><td>{(r.auc * 100).toFixed(1)}%</td><td>{new Date(r.trainedAt).toLocaleString()}</td>
                <td><button type="button" className="admin-btn-danger" onClick={() => { if (confirm('Delete?')) del.mutate(r.id); }}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showForm && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>Add Model Metrics</h3>
            <form onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget);
              create.mutate({ accuracy: Number(fd.get('accuracy')), precision: Number(fd.get('precision')), recall: Number(fd.get('recall')), f1: Number(fd.get('f1')), auc: Number(fd.get('auc')) });
              setShowForm(false);
            }}>
              <label>Accuracy <input type="number" step="0.01" name="accuracy" defaultValue="0.87" required /></label>
              <label>Precision <input type="number" step="0.01" name="precision" defaultValue="0.82" required /></label>
              <label>Recall <input type="number" step="0.01" name="recall" defaultValue="0.79" required /></label>
              <label>F1 <input type="number" step="0.01" name="f1" defaultValue="0.8" required /></label>
              <label>AUC <input type="number" step="0.01" name="auc" defaultValue="0.89" required /></label>
              <div className="admin-form-actions"><button type="submit">Create</button><button type="button" onClick={() => setShowForm(false)}>Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { data: items, refetch } = trpc.admin.listUsers.useQuery();
  const create = trpc.admin.createUser.useMutation({ onSuccess: () => refetch() });
  const updateRole = trpc.admin.updateUserRole.useMutation({ onSuccess: () => refetch() });
  const del = trpc.admin.deleteUser.useMutation({ onSuccess: () => refetch() });
  const [editing, setEditing] = useState<NonNullable<typeof items>[number] | 'new' | null>(null);
  const [createError, setCreateError] = useState('');

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateError('');
    const fd = new FormData(e.currentTarget);
    create.mutate(
      { email: fd.get('email') as string, password: fd.get('password') as string, role: (fd.get('role') as 'user' | 'admin') || 'user' },
      { onError: (err) => setCreateError(err.message), onSuccess: () => setEditing(null) }
    );
  };

  const handleEditRole = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editing === 'new' || !editing) return;
    const fd = new FormData(e.currentTarget);
    const role = fd.get('role') as 'user' | 'admin';
    updateRole.mutate({ id: editing.id, role }, { onSuccess: () => setEditing(null) });
  };

  return (
    <div className="admin-crud">
      <button type="button" onClick={() => { setEditing('new'); setCreateError(''); }}>+ Add User</button>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Email</th><th>Role</th><th>Created</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items?.map((r) => (
              <tr key={r.id}>
                <td>{r.email}</td><td>{r.role}</td><td>{new Date(r.createdAt).toLocaleString()}</td>
                <td>
                  <select value={r.role} onChange={(e) => updateRole.mutate({ id: r.id, role: e.target.value as 'user' | 'admin' })}>
                    <option value="user">user</option><option value="admin">admin</option>
                  </select>
                  <button
                    type="button"
                    className="admin-btn-danger"
                    disabled={currentUser?.id === r.id}
                    title={currentUser?.id === r.id ? 'Cannot delete your own account' : undefined}
                    onClick={() => { if (confirm('Delete user?')) del.mutate(r.id); }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editing && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>{editing === 'new' ? 'Create User' : 'Change Role'}</h3>
            {editing === 'new' ? (
              <form onSubmit={handleCreate}>
                {createError && <div className="auth-error" style={{ marginBottom: '0.5rem' }}>{createError}</div>}
                <label>Email <input type="email" name="email" required /></label>
                <label>Password <input type="password" name="password" minLength={8} required /></label>
                <label>Role <select name="role"><option value="user">user</option><option value="admin">admin</option></select></label>
                <div className="admin-form-actions"><button type="submit">Create</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div>
              </form>
            ) : (
              <form onSubmit={handleEditRole}>
                <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>Editing {editing.email}. Use the dropdown in the table to change role, or close to cancel.</p>
                <label>Role <select name="role" defaultValue={editing.role}><option value="user">user</option><option value="admin">admin</option></select></label>
                <div className="admin-form-actions"><button type="submit">Update Role</button><button type="button" onClick={() => setEditing(null)}>Cancel</button></div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
