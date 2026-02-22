/**
 * Web Scraper Agent - Firmographic data collection
 * Uses Gemini AI when GEMINI_API_KEY is set; otherwise uses mock data.
 */
import type { PrismaClient } from '@prisma/client';
import {
  enrichLeadWithGemini,
  mapGeminiToPrisma,
} from '../services/geminiService';

const MOCK_FIRMOGRAPHICS: Record<string, { revenue: string; employees: number; funding: string; techStack: string[] }> = {
  'acme.io': { revenue: '$10M-$50M', employees: 150, funding: 'Series B', techStack: ['React', 'Node.js', 'AWS'] },
  'techscale.com': { revenue: '$50M-$100M', employees: 400, funding: 'Series C', techStack: ['Python', 'TensorFlow', 'GCP'] },
  'dataflow.io': { revenue: '$5M-$10M', employees: 80, funding: 'Series A', techStack: ['Spark', 'Kafka', 'AWS'] },
  'cloudnine.co': { revenue: '$20M-$50M', employees: 200, funding: 'Series B', techStack: ['Kubernetes', 'Terraform', 'Azure'] },
  'nextgenretail.com': { revenue: '$100M+', employees: 1200, funding: 'Public', techStack: ['Java', 'Oracle', 'SAP'] },
  'medtech.io': { revenue: '$10M-$50M', employees: 180, funding: 'Series B', techStack: ['HIPAA', 'Python', 'AWS'] },
  'finserve.com': { revenue: '$50M-$100M', employees: 500, funding: 'Series D', techStack: ['Scala', ' Kafka', 'PostgreSQL'] },
  'greenenergy.co': { revenue: '$20M-$50M', employees: 250, funding: 'Series B', techStack: ['IoT', 'Python', 'Azure'] },
  'logichain.io': { revenue: '$5M-$10M', employees: 60, funding: 'Seed', techStack: ['Node.js', 'MongoDB', 'GCP'] },
  'edutech.ventures': { revenue: '$10M-$50M', employees: 120, funding: 'Series A', techStack: ['React', 'Firebase', 'AWS'] },
  'cybershield.ai': { revenue: '$5M-$10M', employees: 45, funding: 'Series A', techStack: ['Go', 'Rust', 'Kubernetes'] },
  'autodrive.io': { revenue: '$50M-$100M', employees: 350, funding: 'Series C', techStack: ['C++', 'ROS', 'AWS'] },
  'marketpulse.co': { revenue: '$10M-$20M', employees: 90, funding: 'Series A', techStack: ['Python', 'Snowflake', 'dbt'] },
  'buildright.com': { revenue: '$100M+', employees: 800, funding: 'Private', techStack: ['Salesforce', 'SAP', 'Procore'] },
  'travelhub.io': { revenue: '$20M-$50M', employees: 220, funding: 'Series B', techStack: ['React', 'GraphQL', 'AWS'] },
};

export async function runScraper(prisma: PrismaClient, leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error('Lead not found');

  const domain = lead.domain.replace(/^https?:\/\//, '').split('/')[0];
  const website = lead.domain.startsWith('http') ? lead.domain : `https://${lead.domain}`;

  const geminiResult = await enrichLeadWithGemini(lead.name, website);
  if (geminiResult) {
    const { companyProfile, nlpFeatures } = mapGeminiToPrisma(geminiResult, lead.name, lead.domain);
    await prisma.companyProfile.upsert({
      where: { leadId },
      create: { leadId, ...companyProfile },
      update: companyProfile,
    });
    await prisma.nLPFeatures.upsert({
      where: { leadId },
      create: { leadId, ...nlpFeatures },
      update: nlpFeatures,
    });
    return { success: true, leadId, source: 'gemini' };
  }

  const mock = MOCK_FIRMOGRAPHICS[domain] ?? {
    revenue: '$5M-$10M',
    employees: 50 + Math.floor(Math.random() * 100),
    funding: 'Seed',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
  };

  await prisma.companyProfile.upsert({
    where: { leadId },
    create: {
      leadId,
      revenue: mock.revenue,
      employees: mock.employees,
      funding: mock.funding,
      techStack: JSON.stringify(mock.techStack),
      rawData: `Simulated scraped content for ${lead.name} (${lead.domain})`,
      enrichedAt: new Date(),
    },
    update: {
      revenue: mock.revenue,
      employees: mock.employees,
      funding: mock.funding,
      techStack: JSON.stringify(mock.techStack),
      rawData: `Simulated scraped content for ${lead.name} (${lead.domain})`,
      enrichedAt: new Date(),
    },
  });

  return { success: true, leadId };
}
