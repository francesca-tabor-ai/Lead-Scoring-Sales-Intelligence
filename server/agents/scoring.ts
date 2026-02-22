/**
 * Scoring Agent - Logistic regression simulation with explainable factors
 */
import type { PrismaClient } from '@prisma/client';

interface Factor {
  name: string;
  impact: number;
  description: string;
}

function computeScore(lead: { companyProfile?: { revenue?: string | null; employees?: number | null; funding?: string | null } | null; nlpFeatures?: { sentiment?: number | null; expansionSignal?: boolean | null; hiringSignal?: boolean | null; fundingSignal?: boolean | null } | null }): { probability: number; score: number; factors: Factor[] } {
  const factors: Factor[] = [];
  let raw = 0.3; // base

  // Revenue tier
  const revMap: Record<string, number> = { '$5M-$10M': 0.1, '$10M-$20M': 0.15, '$10M-$50M': 0.2, '$20M-$50M': 0.25, '$50M-$100M': 0.3, '$100M+': 0.35 };
  const rev = lead.companyProfile?.revenue ?? '$5M-$10M';
  const revScore = revMap[rev] ?? 0.15;
  raw += revScore;
  factors.push({ name: 'revenue_tier', impact: revScore, description: `Revenue bracket: ${rev}` });

  // Employees
  const emp = lead.companyProfile?.employees ?? 50;
  const empScore = Math.min(0.2, (emp / 500) * 0.2);
  raw += empScore;
  factors.push({ name: 'company_size', impact: empScore, description: `${emp} employees` });

  // NLP signals
  const sentiment = lead.nlpFeatures?.sentiment ?? 0.5;
  raw += sentiment * 0.2;
  factors.push({ name: 'sentiment', impact: sentiment * 0.2, description: `Sentiment score: ${(sentiment * 100).toFixed(0)}%` });

  if (lead.nlpFeatures?.expansionSignal) {
    raw += 0.08;
    factors.push({ name: 'expansion_signal', impact: 0.08, description: 'Expansion intent detected' });
  }
  if (lead.nlpFeatures?.hiringSignal) {
    raw += 0.06;
    factors.push({ name: 'hiring_signal', impact: 0.06, description: 'Active hiring' });
  }
  if (lead.nlpFeatures?.fundingSignal) {
    raw += 0.05;
    factors.push({ name: 'funding_signal', impact: 0.05, description: 'Recent funding' });
  }

  const probability = Math.min(0.98, Math.max(0.05, raw));
  const score = Math.round(probability * 100);

  return { probability, score, factors };
}

export async function runScoring(prisma: PrismaClient, leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { companyProfile: true, nlpFeatures: true },
  });
  if (!lead) throw new Error('Lead not found');

  const { probability, score, factors } = computeScore(lead);

  const existing = await prisma.leadScore.findFirst({ where: { leadId }, orderBy: { scoredAt: 'desc' } });
  const priorityRank = existing?.priorityRank ?? 0;

  await prisma.leadScore.create({
    data: {
      leadId,
      conversionProbability: probability,
      leadScore: score,
      priorityRank,
      factors: JSON.stringify(factors),
    },
  });

  return { success: true, leadId, score, probability, factors };
}

export async function getRankedLeads(prisma: PrismaClient) {
  const scores = await prisma.leadScore.findMany({
    where: {},
    distinct: ['leadId'],
    orderBy: { scoredAt: 'desc' },
    include: { lead: true },
    take: 100,
  });

  const byLead = new Map<string, (typeof scores)[0]>();
  for (const s of scores) {
    if (!byLead.has(s.leadId)) byLead.set(s.leadId, s);
  }

  const ranked = Array.from(byLead.values())
    .sort((a, b) => b.leadScore - a.leadScore)
    .map((s, i) => ({ ...s, priorityRank: i + 1 }));

  return ranked;
}
