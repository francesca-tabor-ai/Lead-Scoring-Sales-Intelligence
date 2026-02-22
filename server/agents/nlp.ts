/**
 * NLP Enrichment Agent - Extracts text signals via LLM or simulation
 * Set OPENAI_API_KEY to use real GPT-4 for signal extraction from scraped content
 */
import type { PrismaClient } from '@prisma/client';

const MOCK_SIGNALS: Record<string, { sentiment: number; expansion: boolean; hiring: boolean; funding: boolean }> = {
  'acme.io': { sentiment: 0.72, expansion: true, hiring: true, funding: false },
  'techscale.com': { sentiment: 0.85, expansion: true, hiring: true, funding: true },
  'dataflow.io': { sentiment: 0.65, expansion: true, hiring: false, funding: true },
  'cloudnine.co': { sentiment: 0.58, expansion: false, hiring: true, funding: false },
  'nextgenretail.com': { sentiment: 0.92, expansion: true, hiring: true, funding: false },
  'medtech.io': { sentiment: 0.78, expansion: true, hiring: true, funding: true },
  'finserve.com': { sentiment: 0.88, expansion: true, hiring: false, funding: true },
  'greenenergy.co': { sentiment: 0.71, expansion: true, hiring: true, funding: false },
  'logichain.io': { sentiment: 0.54, expansion: false, hiring: false, funding: true },
  'edutech.ventures': { sentiment: 0.81, expansion: true, hiring: true, funding: false },
  'cybershield.ai': { sentiment: 0.69, expansion: true, hiring: true, funding: true },
  'autodrive.io': { sentiment: 0.76, expansion: true, hiring: true, funding: false },
  'marketpulse.co': { sentiment: 0.62, expansion: false, hiring: true, funding: true },
  'buildright.com': { sentiment: 0.45, expansion: false, hiring: false, funding: false },
  'travelhub.io': { sentiment: 0.83, expansion: true, hiring: true, funding: false },
};

async function extractWithLLM(text: string, companyName: string): Promise<{ sentiment: number; expansion: boolean; hiring: boolean; funding: boolean }> {
  try {
    const { default: OpenAI } = await import('openai');
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return null!;

    const openai = new OpenAI({ apiKey });
    const res = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a B2B sales intelligence analyst. Extract structured signals from company text. Respond ONLY with valid JSON in this exact format:
{"sentiment": 0.0-1.0, "expansion": true/false, "hiring": true/false, "funding": true/false}
- sentiment: 0=negative, 0.5=neutral, 1=positive
- expansion: company shows intent to expand/grow
- hiring: actively hiring
- funding: recent funding or budget increase`,
        },
        {
          role: 'user',
          content: `Company: ${companyName}\n\nText to analyze:\n${text.slice(0, 4000)}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const raw = res.choices[0]?.message?.content;
    if (!raw) return null!;

    const parsed = JSON.parse(raw) as { sentiment?: number; expansion?: boolean; hiring?: boolean; funding?: boolean };
    return {
      sentiment: typeof parsed.sentiment === 'number' ? Math.max(0, Math.min(1, parsed.sentiment)) : 0.5,
      expansion: Boolean(parsed.expansion),
      hiring: Boolean(parsed.hiring),
      funding: Boolean(parsed.funding),
    };
  } catch {
    return null!;
  }
}

export async function runNLP(prisma: PrismaClient, leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) throw new Error('Lead not found');

  const domain = lead.domain.replace(/^https?:\/\//, '').split('/')[0];
  let signals = MOCK_SIGNALS[domain] ?? null;

  const profile = await prisma.companyProfile.findUnique({ where: { leadId } });
  const textToAnalyze = profile?.rawData ?? `Company ${lead.name} (${lead.domain}) in ${lead.industry}, ${lead.region}`;

  const llmSignals = await extractWithLLM(textToAnalyze, lead.name);
  if (llmSignals) signals = llmSignals;

  if (!signals) {
    signals = {
      sentiment: 0.5 + Math.random() * 0.4,
      expansion: Math.random() > 0.5,
      hiring: Math.random() > 0.5,
      funding: Math.random() > 0.6,
    };
  }

  const signalList = ['expansion', 'hiring', 'funding'].filter((_, i) => [signals.expansion, signals.hiring, signals.funding][i]);

  await prisma.nLPFeatures.upsert({
    where: { leadId },
    create: {
      leadId,
      sentiment: signals.sentiment,
      expansionSignal: signals.expansion,
      hiringSignal: signals.hiring,
      fundingSignal: signals.funding,
      rawSignals: JSON.stringify({ sentiment: signals.sentiment, signals: signalList }),
      processedAt: new Date(),
    },
    update: {
      sentiment: signals.sentiment,
      expansionSignal: signals.expansion,
      hiringSignal: signals.hiring,
      fundingSignal: signals.funding,
      rawSignals: JSON.stringify({ sentiment: signals.sentiment, signals: signalList }),
      processedAt: new Date(),
    },
  });

  return { success: true, leadId, usedLLM: !!llmSignals };
}
