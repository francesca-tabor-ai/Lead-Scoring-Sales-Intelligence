import { useState } from 'react';
import { trpc } from '../trpc';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Legend,
  Area,
  AreaChart,
} from 'recharts';

const PRESETS = [5000, 10000, 25000, 50000];

export function Budget() {
  const [budget, setBudget] = useState(10000);
  const { data: projections } = trpc.dashboard.getROIProjections.useQuery();
  const optimize = trpc.budget.optimize.useMutation();

  const result = optimize.data ?? (projections && projections.length > 0 ? (projections.find((p) => p.totalCost <= budget && p.totalCost > 0) ?? projections[0]) : null);

  const chartData = projections?.map((p) => ({
    budget: p.totalCost,
    budgetLabel: `$${(p.totalCost / 1000).toFixed(0)}k`,
    roi: Number(p.expectedRoi?.toFixed(1) ?? 0),
    count: p.count ?? 0,
    expectedValue: (p.expectedValue ?? 0) / 1000,
    cost: (p.totalCost ?? 0) / 1000,
  })) ?? [];

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Budget Optimizer</h1>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <label>Budget: $</label>
        <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value) || 0)} style={{ width: 120 }} />
        {PRESETS.map((p) => (
          <button key={p} onClick={() => setBudget(p)} style={{ padding: '0.4rem 0.8rem' }}>${(p / 1000).toFixed(0)}k</button>
        ))}
        <button onClick={() => optimize.mutate({ budget })} disabled={optimize.isPending} style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}>
          {optimize.isPending ? 'Optimizing...' : 'Optimize'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>ROI by Budget</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="budgetLabel" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }} />
                <Bar dataKey="roi" fill="var(--accent)" name="Expected ROI %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Allocation Summary</h3>
          {result ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Leads selected</span>
                <strong>{result.count}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Total cost</span>
                <strong>${result.totalCost?.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Expected ROI</span>
                <strong style={{ color: 'var(--success)' }}>{result.expectedRoi?.toFixed(1)}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Expected value</span>
                <strong>${result.expectedValue?.toLocaleString()}</strong>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Run optimization or load projections</p>
          )}
        </div>
      </div>

      {/* Advanced ROI Projections */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 1rem' }}>ROI Projections — Cost vs Expected Value</h3>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)', minHeight: 300 }}>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="budgetLabel" stroke="var(--text-secondary)" fontSize={11} />
              <YAxis yAxisId="left" stroke="var(--text-secondary)" fontSize={11} label={{ value: 'ROI %', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-secondary)' } }} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--text-secondary)" fontSize={11} label={{ value: 'Value ($k)', angle: 90, position: 'insideRight', style: { fill: 'var(--text-secondary)' } }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
                formatter={(value, name) => [typeof value === 'number' ? (name === 'Expected Value ($k)' ? `$${value}k` : `${value}%`) : value, name]}
                labelFormatter={(label) => `Budget: ${label}`}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="roi" fill="var(--accent)" name="ROI %" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="expectedValue" stroke="var(--success)" strokeWidth={2} dot={{ r: 4 }} name="Expected Value ($k)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Leads vs Budget</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="budgetLabel" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }} />
                <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} dot={{ r: 4 }} name="Leads selected" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Value vs Cost (ROI Curve)</h3>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--success)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--success)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="budgetLabel" stroke="var(--text-secondary)" fontSize={11} />
                <YAxis stroke="var(--text-secondary)" fontSize={11} />
                <Tooltip contentStyle={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }} />
                <Area type="monotone" dataKey="expectedValue" stroke="var(--success)" fill="url(#valueGrad)" name="Expected value ($k)" />
                <Line type="monotone" dataKey="cost" stroke="var(--warning)" strokeWidth={2} dot={{ r: 3 }} name="Cost ($k)" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {result?.selectedLeads && result.selectedLeads.length > 0 && (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Selected Leads</h3>
          <div style={{ maxHeight: 200, overflow: 'auto' }}>
            {result.selectedLeads.map((s: { lead: { id: string; name: string }; score: number }) => (
              <div key={s.lead.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span>{s.lead.name}</span>
                <span style={{ color: 'var(--accent)' }}>Score: {s.score}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
