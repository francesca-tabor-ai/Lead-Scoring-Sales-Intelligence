import { PrismaClient } from '@prisma/client';

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

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.leadScore.deleteMany();
  await prisma.agentJob.deleteMany();
  await prisma.nLPFeatures.deleteMany();
  await prisma.companyProfile.deleteMany();
  await prisma.budgetAllocation.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.modelMetrics.deleteMany();

  for (const lead of DEMO_LEADS) {
    await prisma.lead.create({
      data: {
        companyId: lead.companyId,
        name: lead.name,
        domain: lead.domain,
        region: lead.region,
        industry: lead.industry,
        status: lead.status,
      },
    });
  }

  // Create initial model metrics
  await prisma.modelMetrics.create({
    data: {
      accuracy: 0.87,
      precision: 0.82,
      recall: 0.79,
      f1: 0.80,
      auc: 0.89,
    },
  });

  console.log('✅ Seeded 15 leads and model metrics');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
