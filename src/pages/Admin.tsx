import { trpc } from '../trpc';

export function Admin() {
  const { data: metrics } = trpc.admin.getModelMetrics.useQuery();
  const { data: config } = trpc.admin.getSystemConfig.useQuery();
  const retrain = trpc.admin.triggerRetrain.useMutation();
  const utils = trpc.useUtils();

  const onRetrain = async () => {
    await retrain.mutateAsync();
    utils.admin.getModelMetrics.invalidate();
  };

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Admin Panel</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>Model Metrics</h3>
          {metrics ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Accuracy</span><span>{(metrics.accuracy * 100).toFixed(1)}%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Precision</span><span>{(metrics.precision * 100).toFixed(1)}%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Recall</span><span>{(metrics.recall * 100).toFixed(1)}%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>F1</span><span>{(metrics.f1 * 100).toFixed(1)}%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>AUC</span><span>{(metrics.auc * 100).toFixed(1)}%</span></div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Trained: {new Date(metrics.trainedAt).toLocaleString()}</div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-secondary)' }}>No metrics yet</p>
          )}
          <button onClick={onRetrain} disabled={retrain.isPending} style={{ marginTop: '1rem' }}>
            {retrain.isPending ? 'Retraining...' : 'Trigger Retrain'}
          </button>
        </div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border)' }}>
          <h3 style={{ margin: '0 0 1rem' }}>System Config</h3>
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
    </div>
  );
}
