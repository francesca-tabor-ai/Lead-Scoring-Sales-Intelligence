import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { trpc } from '../trpc';

export function ImportCSV() {
  const navigate = useNavigate();
  const [csv, setCsv] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importCSV = trpc.leads.importCSV.useMutation();
  const utils = trpc.useUtils();

  const onSubmit = async () => {
    if (!csv.trim()) return;
    setError('');
    try {
      const res = await importCSV.mutateAsync(csv);
      utils.leads.list.invalidate();
      navigate('/leads', { state: { imported: res.imported } });
    } catch (e) {
      setError(String(e));
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    try {
      const text = await file.text();
      setCsv(text);
    } catch (err) {
      setError('Could not read file');
    }
    e.target.value = '';
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Link to="/leads" style={{ color: 'var(--text-secondary)' }}>← Leads</Link>
      </div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Import CSV</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Upload a file or paste CSV with columns: companyId (or company_id), name, domain, region, industry, status (optional)
      </p>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={onFileChange}
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current?.click()} style={{ background: 'var(--bg-tertiary)' }}>
          Choose CSV file
        </button>
        {csv && <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', alignSelf: 'center' }}>{csv.split('\n').length} lines</span>}
      </div>

      {error && <div style={{ color: 'var(--warning)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>{error}</div>}

      <textarea
        value={csv}
        onChange={(e) => setCsv(e.target.value)}
        placeholder="companyId,name,domain,region,industry,status&#10;c1,Acme,acme.io,North America,Tech,new"
        style={{ width: '100%', minHeight: 200, padding: '1rem', fontFamily: 'monospace', fontSize: '0.85rem', resize: 'vertical', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)' }}
        rows={10}
      />
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        <button onClick={onSubmit} disabled={!csv.trim() || importCSV.isPending}>
          {importCSV.isPending ? 'Importing...' : 'Import'}
        </button>
        <Link to="/leads"><button>Cancel</button></Link>
      </div>
    </div>
  );
}
