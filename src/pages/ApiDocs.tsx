import { Link } from 'react-router-dom';

const ENTITIES = [
  {
    name: 'User',
    table: 'users',
    fields: [
      { name: 'id', type: 'string', desc: 'CUID primary key' },
      { name: 'email', type: 'string', desc: 'Unique email' },
      { name: 'passwordHash', type: 'string', desc: 'Hashed password' },
      { name: 'role', type: 'string', desc: '"user" | "admin"' },
      { name: 'createdAt', type: 'DateTime', desc: '' },
      { name: 'updatedAt', type: 'DateTime', desc: '' },
    ],
  },
  {
    name: 'Lead',
    table: 'leads',
    fields: [
      { name: 'id', type: 'string', desc: 'CUID primary key' },
      { name: 'companyId', type: 'string', desc: 'External company identifier' },
      { name: 'name', type: 'string', desc: 'Company/lead name' },
      { name: 'domain', type: 'string', desc: 'Company domain' },
      { name: 'region', type: 'string', desc: 'Geographic region' },
      { name: 'industry', type: 'string', desc: 'Industry sector' },
      { name: 'status', type: 'string', desc: 'new | contacted | qualified | converted' },
      { name: 'createdAt', type: 'DateTime', desc: '' },
      { name: 'updatedAt', type: 'DateTime', desc: '' },
    ],
  },
  {
    name: 'CompanyProfile',
    table: 'company_profiles',
    fields: [
      { name: 'id', type: 'string', desc: 'CUID primary key' },
      { name: 'leadId', type: 'string', desc: 'FK to Lead' },
      { name: 'revenue', type: 'string?', desc: 'e.g. "$10M-$50M"' },
      { name: 'employees', type: 'int?', desc: '' },
      { name: 'funding', type: 'string?', desc: 'e.g. "Series B"' },
      { name: 'techStack', type: 'string?', desc: 'JSON array as string' },
      { name: 'rawData', type: 'string?', desc: 'Scraped content' },
      { name: 'enrichedAt', type: 'DateTime?', desc: '' },
      { name: 'createdAt', type: 'DateTime', desc: '' },
      { name: 'updatedAt', type: 'DateTime', desc: '' },
    ],
  },
  {
    name: 'NLPFeatures',
    table: 'nlp_features',
    fields: [
      { name: 'id', type: 'string', desc: 'CUID primary key' },
      { name: 'leadId', type: 'string', desc: 'FK to Lead' },
      { name: 'sentiment', type: 'float?', desc: '-1 to 1' },
      { name: 'expansionSignal', type: 'boolean?', desc: '' },
      { name: 'hiringSignal', type: 'boolean?', desc: '' },
      { name: 'fundingSignal', type: 'boolean?', desc: '' },
      { name: 'rawSignals', type: 'string?', desc: 'JSON' },
      { name: 'processedAt', type: 'DateTime?', desc: '' },
      { name: 'createdAt', type: 'DateTime', desc: '' },
      { name: 'updatedAt', type: 'DateTime', desc: '' },
    ],
  },
  {
    name: 'LeadScore',
    table: 'lead_scores',
    fields: [
      { name: 'id', type: 'string', desc: 'CUID primary key' },
      { name: 'leadId', type: 'string', desc: 'FK to Lead' },
      { name: 'conversionProbability', type: 'float', desc: '' },
      { name: 'leadScore', type: 'float', desc: '0-100' },
      { name: 'priorityRank', type: 'int', desc: '' },
      { name: 'factors', type: 'string?', desc: 'JSON explaining factors' },
      { name: 'scoredAt', type: 'DateTime', desc: '' },
    ],
  },
  {
    name: 'BudgetAllocation',
    table: 'budget_allocations',
    fields: [
      { name: 'id', type: 'string', desc: 'CUID primary key' },
      { name: 'budget', type: 'float', desc: '' },
      { name: 'selectedLeads', type: 'string', desc: 'JSON array of lead IDs' },
      { name: 'expectedRoi', type: 'float', desc: '' },
      { name: 'totalCost', type: 'float', desc: '' },
      { name: 'createdAt', type: 'DateTime', desc: '' },
    ],
  },
  {
    name: 'AgentJob',
    table: 'agent_jobs',
    fields: [
      { name: 'id', type: 'string', desc: 'CUID primary key' },
      { name: 'leadId', type: 'string?', desc: 'FK to Lead (optional)' },
      { name: 'agentType', type: 'string', desc: 'scraper | nlp | scoring | pipeline' },
      { name: 'status', type: 'string', desc: 'pending | running | completed | failed' },
      { name: 'startedAt', type: 'DateTime?', desc: '' },
      { name: 'completedAt', type: 'DateTime?', desc: '' },
      { name: 'error', type: 'string?', desc: '' },
      { name: 'createdAt', type: 'DateTime', desc: '' },
    ],
  },
  {
    name: 'ModelMetrics',
    table: 'model_metrics',
    fields: [
      { name: 'id', type: 'string', desc: 'CUID primary key' },
      { name: 'accuracy', type: 'float', desc: '' },
      { name: 'precision', type: 'float', desc: '' },
      { name: 'recall', type: 'float', desc: '' },
      { name: 'f1', type: 'float', desc: '' },
      { name: 'auc', type: 'float', desc: '' },
      { name: 'trainedAt', type: 'DateTime', desc: '' },
    ],
  },
];

const API_ROUTERS = [
  {
    name: 'auth',
    desc: 'Authentication & user session',
    procedures: [
      { name: 'signUp', method: 'Mutation', input: '{ email, password }', desc: 'Create new user account' },
      { name: 'logIn', method: 'Mutation', input: '{ email, password }', desc: 'Log in, returns token + user' },
      { name: 'me', method: 'Query', input: '(none)', desc: 'Get current user if authenticated' },
    ],
  },
  {
    name: 'leads',
    desc: 'Lead CRUD and import',
    procedures: [
      { name: 'list', method: 'Query', input: '{ status?, region?, industry? }', desc: 'List leads with filters' },
      { name: 'get', method: 'Query', input: 'leadId: string', desc: 'Get single lead by ID' },
      { name: 'create', method: 'Mutation', input: '{ companyId, name, domain, region, industry, status? }', desc: 'Create lead' },
      { name: 'update', method: 'Mutation', input: '{ id, companyId?, name?, domain?, region?, industry?, status? }', desc: 'Update lead' },
      { name: 'delete', method: 'Mutation', input: 'leadId: string', desc: 'Delete lead' },
      { name: 'importCSV', method: 'Mutation', input: 'csv: string', desc: 'Import leads from CSV' },
    ],
  },
  {
    name: 'agents',
    desc: 'AI agents (scraper, NLP, scoring)',
    procedures: [
      { name: 'runScraper', method: 'Mutation', input: 'leadId: string', desc: 'Run web scraper for lead' },
      { name: 'runNLP', method: 'Mutation', input: 'leadId: string', desc: 'Run NLP enrichment' },
      { name: 'runScoring', method: 'Mutation', input: 'leadId: string', desc: 'Run lead scoring' },
      { name: 'runPipeline', method: 'Mutation', input: 'leadId: string', desc: 'Run full pipeline (scraper → NLP → scoring)' },
      { name: 'getJobStatus', method: 'Query', input: 'jobId: string', desc: 'Get agent job status' },
    ],
  },
  {
    name: 'scores',
    desc: 'Lead scores and rankings',
    procedures: [
      { name: 'getScore', method: 'Query', input: 'leadId: string', desc: 'Get latest score for lead' },
      { name: 'getRankedLeads', method: 'Query', input: '(none)', desc: 'Get leads ordered by score' },
      { name: 'getExplainability', method: 'Query', input: 'leadId: string', desc: 'Get score factors/explainability' },
    ],
  },
  {
    name: 'budget',
    desc: 'Budget optimization',
    procedures: [
      { name: 'optimize', method: 'Mutation', input: '{ budget: number }', desc: 'Optimize lead selection by budget' },
      { name: 'getRecommendations', method: 'Query', input: '{ budget: number }', desc: 'Get recommendations (dry run)' },
      { name: 'saveAllocation', method: 'Mutation', input: '{ budget, selectedLeads[], expectedRoi, totalCost }', desc: 'Save allocation' },
    ],
  },
  {
    name: 'dashboard',
    desc: 'Dashboard stats and charts',
    procedures: [
      { name: 'getSummaryStats', method: 'Query', input: '(none)', desc: 'Total leads, scored leads, avg/top score' },
      { name: 'getConversionTrends', method: 'Query', input: '(none)', desc: 'Conversion trends by date' },
      { name: 'getROIProjections', method: 'Query', input: '{ budget? }', desc: 'ROI projections for budget levels' },
    ],
  },
  {
    name: 'chat',
    desc: 'Conversational AI assistant',
    procedures: [
      { name: 'sendMessage', method: 'Mutation', input: '{ message, history? }', desc: 'Send message to AI assistant' },
    ],
  },
  {
    name: 'admin',
    desc: 'Admin-only CRUD (requires admin role)',
    procedures: [
      { name: 'getModelMetrics', method: 'Query', input: '(none)', desc: 'Latest model metrics' },
      { name: 'triggerRetrain', method: 'Mutation', input: '(none)', desc: 'Trigger model retrain (simulated)' },
      { name: 'getSystemConfig', method: 'Query', input: '(none)', desc: 'System configuration' },
      { name: 'updateConfig', method: 'Mutation', input: 'config', desc: 'Update system config' },
      { name: 'listLeads', method: 'Query', input: '{ status?, limit? }', desc: 'Admin: list leads' },
      { name: 'createLead', method: 'Mutation', input: 'Lead fields', desc: 'Admin: create lead' },
      { name: 'updateLead', method: 'Mutation', input: 'Lead fields', desc: 'Admin: update lead' },
      { name: 'deleteLead', method: 'Mutation', input: 'leadId', desc: 'Admin: delete lead' },
      { name: 'listCompanyProfiles', method: 'Query', input: '(none)', desc: 'Admin: list company profiles' },
      { name: 'createCompanyProfile', method: 'Mutation', input: 'CompanyProfile fields', desc: 'Admin: create' },
      { name: 'updateCompanyProfile', method: 'Mutation', input: 'CompanyProfile fields', desc: 'Admin: update' },
      { name: 'deleteCompanyProfile', method: 'Mutation', input: 'id', desc: 'Admin: delete' },
      { name: 'listNLPFeatures', method: 'Query', input: '(none)', desc: 'Admin: list NLP features' },
      { name: 'createNLPFeatures', method: 'Mutation', input: 'NLPFeatures fields', desc: 'Admin: create' },
      { name: 'updateNLPFeatures', method: 'Mutation', input: 'NLPFeatures fields', desc: 'Admin: update' },
      { name: 'deleteNLPFeatures', method: 'Mutation', input: 'id', desc: 'Admin: delete' },
      { name: 'listLeadScores', method: 'Query', input: '(none)', desc: 'Admin: list lead scores' },
      { name: 'createLeadScore', method: 'Mutation', input: 'LeadScore fields', desc: 'Admin: create' },
      { name: 'updateLeadScore', method: 'Mutation', input: 'LeadScore fields', desc: 'Admin: update' },
      { name: 'deleteLeadScore', method: 'Mutation', input: 'id', desc: 'Admin: delete' },
      { name: 'listBudgetAllocations', method: 'Query', input: '(none)', desc: 'Admin: list allocations' },
      { name: 'createBudgetAllocation', method: 'Mutation', input: 'BudgetAllocation fields', desc: 'Admin: create' },
      { name: 'deleteBudgetAllocation', method: 'Mutation', input: 'id', desc: 'Admin: delete' },
      { name: 'listAgentJobs', method: 'Query', input: '(none)', desc: 'Admin: list agent jobs' },
      { name: 'deleteAgentJob', method: 'Mutation', input: 'id', desc: 'Admin: delete job' },
      { name: 'listModelMetrics', method: 'Query', input: '(none)', desc: 'Admin: list model metrics' },
      { name: 'createModelMetrics', method: 'Mutation', input: 'ModelMetrics fields', desc: 'Admin: create' },
      { name: 'deleteModelMetrics', method: 'Mutation', input: 'id', desc: 'Admin: delete' },
      { name: 'listUsers', method: 'Query', input: '(none)', desc: 'Admin: list users' },
      { name: 'createUser', method: 'Mutation', input: '{ email, password, role }', desc: 'Admin: create user' },
      { name: 'updateUserRole', method: 'Mutation', input: '{ id, role }', desc: 'Admin: update user role' },
      { name: 'deleteUser', method: 'Mutation', input: 'userId', desc: 'Admin: delete user' },
    ],
  },
];

export function ApiDocs() {
  return (
    <div className="api-docs-page">
      <header className="api-docs-header">
        <h1>API Documentation</h1>
        <p className="api-docs-intro">
          LSSIS uses <a href="https://trpc.io" target="_blank" rel="noopener noreferrer">tRPC</a> for type-safe API calls.
          Base URL: <code>/api/trpc</code>. Authenticate via <code>Authorization: Bearer &lt;token&gt;</code> for protected routes.
        </p>
      </header>

      <section className="api-docs-section">
        <h2>Entities (Data Models)</h2>
        <p className="api-docs-desc">Core database entities used across the platform.</p>
        {ENTITIES.map((entity) => (
          <div key={entity.name} className="api-docs-card">
            <h3 className="api-docs-entity-name">{entity.name}</h3>
            <span className="api-docs-table">table: {entity.table}</span>
            <table className="api-docs-table-grid">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {entity.fields.map((f) => (
                  <tr key={f.name}>
                    <td><code>{f.name}</code></td>
                    <td><code className="api-docs-type">{f.type}</code></td>
                    <td>{f.desc || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <section className="api-docs-section">
        <h2>API Endpoints (tRPC Procedures)</h2>
        <p className="api-docs-desc">
          All routers, procedures, and CRUD operations. Call via <code>trpc.routerName.procedureName</code>.
        </p>
        {API_ROUTERS.map((router) => (
          <div key={router.name} className="api-docs-card">
            <h3 className="api-docs-router-name">{router.name}</h3>
            <p className="api-docs-router-desc">{router.desc}</p>
            <table className="api-docs-table-grid">
              <thead>
                <tr>
                  <th>Procedure</th>
                  <th>Method</th>
                  <th>Input</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {router.procedures.map((p) => (
                  <tr key={p.name}>
                    <td><code>{p.name}</code></td>
                    <td><span className={`api-docs-badge api-docs-badge--${p.method.toLowerCase()}`}>{p.method}</span></td>
                    <td><code className="api-docs-input">{p.input}</code></td>
                    <td>{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <section className="api-docs-section api-docs-cta">
        <h3>Build on LSSIS</h3>
        <p>Integrate with the platform for advanced workflows. Browse the <Link to="/marketplace">App Marketplace</Link> or <Link to="/build-app">apply to build an app</Link>.</p>
      </section>
    </div>
  );
}
