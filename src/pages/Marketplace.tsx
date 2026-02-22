import { Link } from 'react-router-dom';

const MOCK_APPS = [
  {
    id: 'hubspot-sync',
    name: 'HubSpot Sync',
    desc: 'Sync leads and scores bidirectionally with HubSpot. Automatically push scored leads to your CRM and pull contact activities.',
    icon: '📊',
    tags: ['CRM', 'Sync', 'Popular'],
    status: 'Available',
  },
  {
    id: 'slack-alerts',
    name: 'Slack Lead Alerts',
    desc: 'Get instant Slack notifications when high-score leads are identified. Configure channels per score threshold.',
    icon: '💬',
    tags: ['Notifications', 'Slack'],
    status: 'Available',
  },
  {
    id: 'salesforce-connector',
    name: 'Salesforce Connector',
    desc: 'Deep integration with Salesforce. Map leads, opportunities, and activities. Run scoring from within SFDC.',
    icon: '☁️',
    tags: ['CRM', 'Enterprise'],
    status: 'Coming soon',
  },
  {
    id: 'zapier',
    name: 'Zapier Integration',
    desc: 'Connect LSSIS to 5,000+ apps. Trigger workflows when leads are scored, imported, or status changes.',
    icon: '⚡',
    tags: ['Automation', 'No-code'],
    status: 'Available',
  },
  {
    id: 'pipedrive-sync',
    name: 'Pipedrive Sync',
    desc: 'Keep Pipedrive pipelines in sync with LSSIS scores. Auto-create deals for top-ranked leads.',
    icon: '📈',
    tags: ['CRM', 'Pipeline'],
    status: 'Beta',
  },
  {
    id: 'webhooks',
    name: 'Webhooks',
    desc: 'Send lead events to your systems via HTTP webhooks. Score changes, new leads, pipeline updates.',
    icon: '🔗',
    tags: ['Developer', 'API'],
    status: 'Available',
  },
];

export function Marketplace() {
  return (
    <div className="marketplace-page">
      <header className="marketplace-hero">
        <h1>App Marketplace</h1>
        <p>
          Integrate with LSSIS for advanced workflows. Connect your CRM, automate pipelines, and extend the platform.
        </p>
      </header>

      <div className="marketplace-grid">
        {MOCK_APPS.map((app) => (
          <article key={app.id} className="marketplace-card">
            <div className="marketplace-card__icon">{app.icon}</div>
            <h3 className="marketplace-card__name">{app.name}</h3>
            <p className="marketplace-card__desc">{app.desc}</p>
            <div className="marketplace-card__tags">
              {app.tags.map((tag) => (
                <span key={tag} className="marketplace-card__tag">{tag}</span>
              ))}
              {app.status !== 'Available' && (
                <span className="marketplace-card__tag" style={{ background: 'var(--gradient-accent-subtle)', color: 'var(--color-accent)' }}>
                  {app.status}
                </span>
              )}
            </div>
            <Link to={app.status === 'Available' ? `/marketplace/${app.id}` : '#'} className="marketplace-card__cta">
              {app.status === 'Available' ? 'View details →' : 'Notify me'}
            </Link>
          </article>
        ))}
      </div>

      <section className="marketplace-cta-section">
        <h3>Build your own app</h3>
        <p>Have an idea? Apply to build an app on LSSIS and reach thousands of sales teams.</p>
        <Link to="/build-app">Apply to Build an App</Link>
      </section>
    </div>
  );
}
