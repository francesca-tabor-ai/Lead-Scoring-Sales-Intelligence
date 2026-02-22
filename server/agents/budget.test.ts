import { describe, it, expect } from 'vitest';

const COST_PER_LEAD = 500;
const BASE_CONVERSION_VALUE = 10000;

function optimizeBudgetPure(
  candidates: { conversionProbability: number }[],
  budget: number
): { selectedCount: number; totalCost: number; expectedValue: number; expectedRoi: number } {
  const sorted = [...candidates].sort((a, b) => b.conversionProbability - a.conversionProbability);
  let totalCost = 0;
  let expectedValue = 0;
  for (const s of sorted) {
    if (totalCost + COST_PER_LEAD <= budget) {
      totalCost += COST_PER_LEAD;
      expectedValue += s.conversionProbability * BASE_CONVERSION_VALUE;
    }
  }
  const expectedRoi = totalCost > 0 ? (expectedValue / totalCost) * 100 : 0;
  return {
    selectedCount: totalCost / COST_PER_LEAD,
    totalCost,
    expectedValue,
    expectedRoi,
  };
}

describe('Budget Allocation Agent', () => {
  it('selects more leads with larger budget', () => {
    const candidates = [
      { conversionProbability: 0.9 },
      { conversionProbability: 0.8 },
      { conversionProbability: 0.7 },
      { conversionProbability: 0.6 },
      { conversionProbability: 0.5 },
    ];
    const small = optimizeBudgetPure(candidates, 1000);
    const large = optimizeBudgetPure(candidates, 2500);
    expect(large.selectedCount).toBeGreaterThan(small.selectedCount);
  });

  it('prioritizes higher probability leads', () => {
    const candidates = [
      { conversionProbability: 0.3 },
      { conversionProbability: 0.9 },
      { conversionProbability: 0.5 },
    ];
    const r = optimizeBudgetPure(candidates, 1000);
    expect(r.selectedCount).toBe(2); // budget 1000 = 2 leads
    expect(r.expectedValue).toBeGreaterThan(0.9 * BASE_CONVERSION_VALUE + 0.5 * BASE_CONVERSION_VALUE - 1); // 0.9 and 0.5 selected
  });

  it('returns zero when budget is 0', () => {
    const r = optimizeBudgetPure([{ conversionProbability: 0.9 }], 0);
    expect(r.totalCost).toBe(0);
    expect(r.expectedValue).toBe(0);
    expect(r.expectedRoi).toBe(0);
  });

  it('computes ROI correctly', () => {
    const candidates = [{ conversionProbability: 1 }];
    const r = optimizeBudgetPure(candidates, 500);
    expect(r.totalCost).toBe(500);
    expect(r.expectedValue).toBe(10000);
    expect(r.expectedRoi).toBe(2000); // 10000/500 * 100
  });
});
