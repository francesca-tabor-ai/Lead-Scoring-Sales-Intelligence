import { describe, it, expect } from 'vitest';

// Test the scoring logic (pure computation) - factors and probability calculation
function computeScore(lead: {
  companyProfile?: { revenue: string; employees: number | null; funding: string } | null;
  nlpFeatures?: { sentiment: number | null; expansionSignal: boolean | null; hiringSignal: boolean | null; fundingSignal: boolean | null } | null;
}): { probability: number; score: number } {
  let raw = 0.3;
  const revMap: Record<string, number> = { '$5M-$10M': 0.1, '$10M-$50M': 0.2, '$50M-$100M': 0.3, '$100M+': 0.35 };
  const rev = lead.companyProfile?.revenue ?? '$5M-$10M';
  raw += revMap[rev] ?? 0.15;
  const emp = lead.companyProfile?.employees ?? 50;
  raw += Math.min(0.2, (emp / 500) * 0.2);
  const sentiment = lead.nlpFeatures?.sentiment ?? 0.5;
  raw += sentiment * 0.2;
  if (lead.nlpFeatures?.expansionSignal) raw += 0.08;
  if (lead.nlpFeatures?.hiringSignal) raw += 0.06;
  if (lead.nlpFeatures?.fundingSignal) raw += 0.05;
  const probability = Math.min(0.98, Math.max(0.05, raw));
  const score = Math.round(probability * 100);
  return { probability, score };
}

describe('Scoring Agent', () => {
  it('computes higher score for larger revenue', () => {
    const small = computeScore({ companyProfile: { revenue: '$5M-$10M', employees: 50, funding: '' } });
    const large = computeScore({ companyProfile: { revenue: '$100M+', employees: 50, funding: '' } });
    expect(large.score).toBeGreaterThan(small.score);
  });

  it('computes higher score with positive sentiment', () => {
    const low = computeScore({ nlpFeatures: { sentiment: 0.2, expansionSignal: false, hiringSignal: false, fundingSignal: false } });
    const high = computeScore({ nlpFeatures: { sentiment: 0.9, expansionSignal: false, hiringSignal: false, fundingSignal: false } });
    expect(high.score).toBeGreaterThan(low.score);
  });

  it('adds points for expansion signal', () => {
    const no = computeScore({ nlpFeatures: { sentiment: 0.5, expansionSignal: false, hiringSignal: false, fundingSignal: false } });
    const yes = computeScore({ nlpFeatures: { sentiment: 0.5, expansionSignal: true, hiringSignal: false, fundingSignal: false } });
    expect(yes.score).toBeGreaterThan(no.score);
  });

  it('clamps probability between 0.05 and 0.98', () => {
    const extremeLow = computeScore({
      companyProfile: { revenue: '$5M-$10M', employees: 1, funding: '' },
      nlpFeatures: { sentiment: 0, expansionSignal: false, hiringSignal: false, fundingSignal: false },
    });
    const extremeHigh = computeScore({
      companyProfile: { revenue: '$100M+', employees: 2000, funding: '' },
      nlpFeatures: { sentiment: 1, expansionSignal: true, hiringSignal: true, fundingSignal: true },
    });
    expect(extremeLow.probability).toBeGreaterThanOrEqual(0.05);
    expect(extremeHigh.probability).toBeLessThanOrEqual(0.98);
  });

  it('returns score 0-100', () => {
    const r = computeScore({});
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(100);
  });
});
