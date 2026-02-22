/**
 * Budget Allocation Agent - Knapsack-style ROI optimization
 */
import type { PrismaClient } from '@prisma/client';

const COST_PER_LEAD = 500; // assumed cost to pursue a lead
const BASE_CONVERSION_VALUE = 10000; // expected value per conversion

export async function optimizeBudget(prisma: PrismaClient, budget: number, persist = true) {
  const scores = await prisma.leadScore.findMany({
    where: {},
    distinct: ['leadId'],
    orderBy: { scoredAt: 'desc' },
    include: { lead: true },
  });

  const byLead = new Map<string, (typeof scores)[0]>();
  for (const s of scores) {
    if (!byLead.has(s.leadId)) byLead.set(s.leadId, s);
  }

  const candidates = Array.from(byLead.values())
    .sort((a, b) => b.conversionProbability - a.conversionProbability);

  const selected: typeof candidates = [];
  let totalCost = 0;
  let expectedValue = 0;

  for (const s of candidates) {
    if (totalCost + COST_PER_LEAD <= budget) {
      selected.push(s);
      totalCost += COST_PER_LEAD;
      expectedValue += s.conversionProbability * BASE_CONVERSION_VALUE;
    }
  }

  const expectedRoi = totalCost > 0 ? (expectedValue / totalCost) * 100 : 0;

  if (persist) {
    await prisma.budgetAllocation.create({
      data: {
        budget,
        selectedLeads: JSON.stringify(selected.map((s) => s.leadId)),
        expectedRoi,
        totalCost,
      },
    });
  }

  return {
    selectedLeads: selected.map((s) => ({ lead: s.lead, score: s.leadScore, probability: s.conversionProbability })),
    totalCost,
    expectedRoi,
    expectedValue,
    count: selected.length,
  };
}
