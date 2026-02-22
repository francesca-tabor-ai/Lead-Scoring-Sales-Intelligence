import { trpc } from '../trpc';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = trpc.dashboard.getSummaryStats.useQuery();
  const { data: trends } = trpc.dashboard.getConversionTrends.useQuery();
  const { data: ranked } = trpc.scores.getRankedLeads.useQuery();

  if (statsLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Dashboard</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        <Card title="Total Leads" value={stats?.totalLeads ?? 0} />
        <Card title="Scored Leads" value={stats?.scoredLeads ?? 0} />
        <Card title="Avg Score" value={stats?.avgScore ?? 0} suffix="" />
        <Card title="Top Score" value={stats?.topScore ?? 0} suffix="" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Conversion Trends</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }} formatter={(v: number) => [`${(v * 100).toFixed(1)}%`, 'Avg conversion']} />
                <Line type="monotone" dataKey="avgConversion" stroke="var(--accent)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Top Ranked Leads</h3>
          <div style={{ maxHeight: 220, overflow: 'auto' }}>
            {(ranked ?? []).slice(0, 8).map((r, i) => (
              <Link key={r.lead.id} to={`/leads/${r.lead.id}`} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', color: 'inherit', textDecoration: 'none' }}>
                <span>#{i + 1} {r.lead.name}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{r.leadScore}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, suffix = '' }: { title: string; value: number; suffix?: string }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}{suffix}</div>
    </div>
  );
}
