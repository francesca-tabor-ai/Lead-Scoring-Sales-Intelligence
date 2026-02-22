import { useParams, Link } from 'react-router-dom';
import { trpc } from '../trpc';

export function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: lead, isLoading } = trpc.leads.get.useQuery(id!);
  const { data: explain } = trpc.scores.getExplainability.useQuery(id!);
  const runPipeline = trpc.agents.runPipeline.useMutation();
  const utils = trpc.useUtils();

  const onRunPipeline = async () => {
    if (!id) return;
    await runPipeline.mutateAsync(id);
    utils.leads.get.invalidate({ id });
    utils.scores.getExplainability.invalidate({ id });
  };

  if (isLoading || !lead) return <div>Loading...</div>;

  const factors = explain?.factors ?? [];
  const latestScore = lead.leadScores?.[0];

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Link to="/leads" style={{ color: 'var(--text-secondary)' }}>← Leads</Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.5rem' }}>{lead.name}</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{lead.domain} · {lead.region} · {lead.industry}</div>
        </div>
        <button onClick={onRunPipeline} disabled={runPipeline.isPending}>
          {runPipeline.isPending ? 'Running...' : 'Run Scoring Pipeline'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Score</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: latestScore ? 'var(--accent)' : 'var(--text-secondary)' }}>
            {latestScore ? latestScore.leadScore : '—'}
          </div>
          {latestScore && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Conversion probability: {(latestScore.conversionProbability * 100).toFixed(1)}%
            </div>
          )}
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Firmographics</h3>
          {lead.companyProfile ? (
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              <li>Revenue: {lead.companyProfile.revenue ?? '—'}</li>
              <li>Employees: {lead.companyProfile.employees ?? '—'}</li>
              <li>Funding: {lead.companyProfile.funding ?? '—'}</li>
              {lead.companyProfile.techStack && (
                <li>Tech: {JSON.parse(lead.companyProfile.techStack as string)?.join?.(', ') ?? lead.companyProfile.techStack}</li>
              )}
            </ul>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>Run pipeline to enrich</p>
          )}
        </div>
      </div>

      {lead.nlpFeatures && (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)', marginTop: '1rem' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>NLP Signals</h3>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span>Sentiment: {((lead.nlpFeatures.sentiment ?? 0) * 100).toFixed(0)}%</span>
            <span>Expansion: {lead.nlpFeatures.expansionSignal ? 'Yes' : 'No'}</span>
            <span>Hiring: {lead.nlpFeatures.hiringSignal ? 'Yes' : 'No'}</span>
            <span>Funding: {lead.nlpFeatures.fundingSignal ? 'Yes' : 'No'}</span>
          </div>
        </div>
      )}

      {factors.length > 0 && (
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)', marginTop: '1rem' }}>
          <h3 style={{ margin: '0 0 0.75rem' }}>Score Factors</h3>
          <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
            {factors.map((f: { name: string; description: string; impact: number }, i: number) => (
              <li key={i}><strong>{f.name}</strong>: {f.description} (impact: {f.impact.toFixed(2)})</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
