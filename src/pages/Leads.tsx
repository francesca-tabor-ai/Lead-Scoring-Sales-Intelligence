import { useState } from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../trpc';

export function Leads() {
  const [status, setStatus] = useState<string>('');
  const { data: leads, isLoading } = trpc.leads.list.useQuery({ status: status || undefined });
  const deleteLead = trpc.leads.delete.useMutation();
  const utils = trpc.useUtils();

  const onDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await deleteLead.mutateAsync(id);
    utils.leads.list.invalidate();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Leads</h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
          </select>
          <Link to="/leads/import">
            <button>Import CSV</button>
          </Link>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 1rem' }}>Company</th>
              <th style={{ padding: '0.75rem 1rem' }}>Domain</th>
              <th style={{ padding: '0.75rem 1rem' }}>Region</th>
              <th style={{ padding: '0.75rem 1rem' }}>Industry</th>
              <th style={{ padding: '0.75rem 1rem' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((l) => (
              <tr key={l.id} style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <Link to={`/leads/${l.id}`} style={{ fontWeight: 500 }}>{l.name}</Link>
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>{l.domain}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{l.region}</td>
                <td style={{ padding: '0.75rem 1rem' }}>{l.industry}</td>
                <td style={{ padding: '0.75rem 1rem' }}><span style={{ padding: '2px 8px', borderRadius: 4, background: 'var(--bg-tertiary)', fontSize: '0.8rem' }}>{l.status}</span></td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <button onClick={() => onDelete(l.id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
