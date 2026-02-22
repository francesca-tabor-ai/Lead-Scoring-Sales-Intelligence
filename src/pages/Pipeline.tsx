import { useState } from 'react';
import { trpc } from '../trpc';

export function Pipeline() {
  const { data: leads } = trpc.leads.list.useQuery();
  const [selected, setSelected] = useState<string | null>(null);
  const runScraper = trpc.agents.runScraper.useMutation();
  const runNLP = trpc.agents.runNLP.useMutation();
  const runScoring = trpc.agents.runScoring.useMutation();
  const runPipeline = trpc.agents.runPipeline.useMutation();
  const utils = trpc.useUtils();

  const run = async (fn: () => Promise<unknown>) => {
    if (!selected) return;
    await fn();
    utils.leads.list.invalidate();
    utils.leads.get.invalidate({ id: selected });
    utils.scores.getRankedLeads.invalidate();
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Scoring Pipeline</h1>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Select Lead</h3>
          <select
            value={selected ?? ''}
            onChange={(e) => setSelected(e.target.value || null)}
            style={{ width: '100%', marginBottom: '1rem' }}
          >
            <option value="">Choose a lead...</option>
            {(leads ?? []).map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button onClick={() => run(() => runScraper.mutateAsync(selected!))} disabled={!selected || runScraper.isPending}>
              Run Scraper
            </button>
            <button onClick={() => run(() => runNLP.mutateAsync(selected!))} disabled={!selected || runNLP.isPending}>
              Run NLP Agent
            </button>
            <button onClick={() => run(() => runScoring.mutateAsync(selected!))} disabled={!selected || runScoring.isPending}>
              Run Scoring
            </button>
            <button onClick={() => run(() => runPipeline.mutateAsync(selected!))} disabled={!selected || runPipeline.isPending} style={{ marginTop: '0.5rem', background: 'var(--accent)', borderColor: 'var(--accent)' }}>
              Run Full Pipeline
            </button>
          </div>
        </div>

        <div style={{ flex: '1 1 280px', background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Pipeline Flow</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Step n={1} label="Web Scraper" desc="Collect firmographic data" />
            <div style={{ borderLeft: '2px solid var(--border)', marginLeft: 12, height: 16 }} />
            <Step n={2} label="NLP Enrichment" desc="Extract text signals" />
            <div style={{ borderLeft: '2px solid var(--border)', marginLeft: 12, height: 16 }} />
            <Step n={3} label="Scoring" desc="Compute lead score" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ n, label, desc }: { n: number; label: string; desc: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{n}</div>
      <div>
        <div style={{ fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{desc}</div>
      </div>
    </div>
  );
}
