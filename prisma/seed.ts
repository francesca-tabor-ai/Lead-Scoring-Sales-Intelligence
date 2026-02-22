import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../server/auth';

const prisma = new PrismaClient();

const DEMO_LEADS = [
  { companyId: 'c1', name: 'Acme Corp', domain: 'acme.io', region: 'North America', industry: 'Technology', status: 'new' },
  { companyId: 'c2', name: 'TechScale Inc', domain: 'techscale.com', region: 'Europe', industry: 'SaaS', status: 'contacted' },
  { companyId: 'c3', name: 'DataFlow Analytics', domain: 'dataflow.io', region: 'North America', industry: 'Data & AI', status: 'qualified' },
  { companyId: 'c4', name: 'CloudNine Systems', domain: 'cloudnine.co', region: 'APAC', industry: 'Cloud', status: 'new' },
  { companyId: 'c5', name: 'NextGen Retail', domain: 'nextgenretail.com', region: 'Europe', industry: 'Retail', status: 'contacted' },
  { companyId: 'c6', name: 'MedTech Solutions', domain: 'medtech.io', region: 'North America', industry: 'Healthcare', status: 'new' },
  { companyId: 'c7', name: 'FinServe Global', domain: 'finserve.com', region: 'Europe', industry: 'Fintech', status: 'qualified' },
  { companyId: 'c8', name: 'GreenEnergy Co', domain: 'greenenergy.co', region: 'North America', industry: 'Energy', status: 'new' },
  { companyId: 'c9', name: 'LogiChain', domain: 'logichain.io', region: 'APAC', industry: 'Logistics', status: 'contacted' },
  { companyId: 'c10', name: 'EduTech Ventures', domain: 'edutech.ventures', region: 'North America', industry: 'Education', status: 'qualified' },
  { companyId: 'c11', name: 'CyberShield Security', domain: 'cybershield.ai', region: 'Europe', industry: 'Cybersecurity', status: 'new' },
  { companyId: 'c12', name: 'AutoDrive Systems', domain: 'autodrive.io', region: 'North America', industry: 'Automotive', status: 'contacted' },
  { companyId: 'c13', name: 'MarketPulse', domain: 'marketpulse.co', region: 'Europe', industry: 'Martech', status: 'new' },
  { companyId: 'c14', name: 'BuildRight Construction', domain: 'buildright.com', region: 'North America', industry: 'Construction', status: 'new' },
  { companyId: 'c15', name: 'TravelHub', domain: 'travelhub.io', region: 'APAC', industry: 'Travel', status: 'qualified' },
];

const ADMIN_EMAIL = 'admin@lssis.demo';
const ADMIN_PASSWORD = 'Admin123!';

async function main() {
  console.log('🌱 Seeding database...');

  // Clear in correct order (respecting foreign keys)
  await prisma.leadScore.deleteMany();
  await prisma.agentJob.deleteMany();
  await prisma.nLPFeatures.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.budgetAllocation.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.modelMetrics.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminHash = await hashPassword(ADMIN_PASSWORD);
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash: adminHash,
      role: 'admin',
    },
  });
  console.log(`✅ Created admin user: ${ADMIN_EMAIL}`);

  // Create demo user
  const demoHash = await hashPassword('Demo123!');
  await prisma.user.create({
    data: {
      email: 'demo@lssis.demo',
      passwordHash: demoHash,
      role: 'user',
    },
  });
  console.log('✅ Created demo user: demo@lssis.demo');

  // Create leads
  const createdLeads: { id: string; companyId: string }[] = [];
  for (const lead of DEMO_LEADS) {
    const l = await prisma.lead.create({
      data: {
        companyId: lead.companyId,
        name: lead.name,
        domain: lead.domain,
        region: lead.region,
        industry: lead.industry,
        status: lead.status,
      },
    });
    createdLeads.push({ id: l.id, companyId: l.companyId });
  }

  // Create company profiles for first 5 leads
  for (let i = 0; i < Math.min(5, createdLeads.length); i++) {
    const lead = createdLeads[i];
    await prisma.companyProfile.create({
      data: {
        leadId: lead.id,
        revenue: ['$1M-$10M', '$10M-$50M', '$50M-$100M', '$1M-$10M', '$10M-$50M'][i],
        employees: [25, 150, 80, 40, 200][i],
        funding: ['Seed', 'Series B', 'Series A', 'Seed', 'Series C'][i],
        techStack: JSON.stringify(['React', 'Node.js', 'PostgreSQL']),
        enrichedAt: new Date(),
      },
    });
  }

  // Create NLP features for first 5 leads
  for (let i = 0; i < Math.min(5, createdLeads.length); i++) {
    const lead = createdLeads[i];
    await prisma.nLPFeatures.create({
      data: {
        leadId: lead.id,
        sentiment: 0.6 + Math.random() * 0.3,
        expansionSignal: i % 2 === 0,
        hiringSignal: i % 3 === 0,
        fundingSignal: i < 2,
        rawSignals: JSON.stringify({ intent: 'high', keywords: ['growth', 'expansion'] }),
        processedAt: new Date(),
      },
    });
  }

  // Create lead scores for first 8 leads
  const leadIds = createdLeads.slice(0, 8).map((l) => l.id);
  for (let i = 0; i < leadIds.length; i++) {
    await prisma.leadScore.create({
      data: {
        leadId: leadIds[i],
        conversionProbability: 0.3 + (i / leadIds.length) * 0.5,
        leadScore: 40 + (i / leadIds.length) * 55,
        priorityRank: i + 1,
        factors: JSON.stringify([
          { factor: 'Company size', impact: 0.25 },
          { factor: 'NLP sentiment', impact: 0.2 },
          { factor: 'Industry fit', impact: 0.15 },
        ]),
      },
    });
  }

  // Create budget allocation
  await prisma.budgetAllocation.create({
    data: {
      budget: 10000,
      selectedLeads: JSON.stringify(leadIds.slice(0, 4)),
      expectedRoi: 2.4,
      totalCost: 9500,
    },
  });

  // Create agent jobs (sample)
  for (let i = 0; i < 3; i++) {
    await prisma.agentJob.create({
      data: {
        leadId: createdLeads[i].id,
        agentType: ['scraper', 'nlp', 'scoring'][i],
        status: 'completed',
        startedAt: new Date(Date.now() - 3600000),
        completedAt: new Date(),
      },
    });
  }

  // Create model metrics
  await prisma.modelMetrics.create({
    data: {
      accuracy: 0.87,
      precision: 0.82,
      recall: 0.79,
      f1: 0.8,
      auc: 0.89,
    },
  });

  console.log('✅ Seeded 15 leads, users, company profiles, NLP features, scores, budget allocations, agent jobs, and model metrics');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
