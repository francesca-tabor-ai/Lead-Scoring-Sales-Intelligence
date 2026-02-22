/**
 * Gemini AI Service - Lead enrichment and scoring via Google Gemini
 * Optional alternative to OpenAI: set GEMINI_API_KEY to use AI-based enrichment.
 */
import { GoogleGenAI, Type } from '@google/genai';

const GEMINI_MODEL = 'gemini-2.0-flash';

export interface GeminiCompanyProfile {
  revenue: number;
  employee_count: number;
  industry: string;
  funding_amount: number;
  funding_date: string;
  tech_stack: string;
  hiring_growth: number;
  location: string;
}

export interface GeminiNLPFeatures {
  sentiment_score: number;
  expansion_score: number;
  hiring_score: number;
  funding_signal: number;
  technology_adoption_score: number;
}

export interface GeminiLeadScore {
  conversion_probability: number;
  lead_score: number;
  priority_rank: string;
  explanation: string;
}

function revenueToBracket(revM: number): string {
  if (revM < 5) return '$5M-$10M';
  if (revM < 10) return '$5M-$10M';
  if (revM < 20) return '$10M-$20M';
  if (revM < 50) return '$20M-$50M';
  if (revM < 100) return '$50M-$100M';
  return '$100M+';
}

function fundingToRound(amount: number, _date: string): string {
  if (amount <= 0) return 'Seed';
  if (amount < 5) return 'Seed';
  if (amount < 15) return 'Series A';
  if (amount < 50) return 'Series B';
  if (amount < 100) return 'Series C';
  if (amount < 300) return 'Series D';
  return 'IPO';
}

export async function enrichLeadWithGemini(
  companyName: string,
  website: string
): Promise<{ profile: GeminiCompanyProfile; signals: GeminiNLPFeatures } | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Analyze the company "${companyName}" (website: ${website}). 
Provide structured firmographic data and NLP signals based on recent public information.
If data is unknown, provide realistic estimates based on industry standards.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            profile: {
              type: Type.OBJECT,
              properties: {
                revenue: { type: Type.NUMBER, description: 'Estimated annual revenue in millions USD' },
                employee_count: { type: Type.INTEGER },
                industry: { type: Type.STRING },
                funding_amount: { type: Type.NUMBER, description: 'Total funding in millions USD' },
                funding_date: { type: Type.STRING },
                tech_stack: { type: Type.STRING },
                hiring_growth: { type: Type.NUMBER, description: 'Percentage growth in last 12 months' },
                location: { type: Type.STRING },
              },
              required: [
                'revenue',
                'employee_count',
                'industry',
                'funding_amount',
                'funding_date',
                'tech_stack',
                'hiring_growth',
                'location',
              ],
            },
            signals: {
              type: Type.OBJECT,
              properties: {
                sentiment_score: { type: Type.NUMBER, description: '-1 to 1' },
                expansion_score: { type: Type.NUMBER, description: '0 to 1' },
                hiring_score: { type: Type.NUMBER, description: '0 to 1' },
                funding_signal: { type: Type.NUMBER, description: '0 to 1' },
                technology_adoption_score: { type: Type.NUMBER, description: '0 to 1' },
              },
              required: [
                'sentiment_score',
                'expansion_score',
                'hiring_score',
                'funding_signal',
                'technology_adoption_score',
              ],
            },
          },
          required: ['profile', 'signals'],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as { profile: GeminiCompanyProfile; signals: GeminiNLPFeatures };
  } catch {
    return null;
  }
}

/**
 * Map Gemini enrichment result to Prisma-compatible shape for CompanyProfile and NLPFeatures
 */
export function mapGeminiToPrisma(
  result: { profile: GeminiCompanyProfile; signals: GeminiNLPFeatures },
  leadName: string,
  domain: string
) {
  const { profile, signals } = result;
  const revenueBracket = revenueToBracket(profile.revenue);
  const fundingRound = fundingToRound(profile.funding_amount, profile.funding_date);
  const techStack = profile.tech_stack
    ? profile.tech_stack.split(/[,;|]/).map((s) => s.trim()).filter(Boolean)
    : ['Unknown'];

  return {
    companyProfile: {
      revenue: revenueBracket,
      employees: profile.employee_count,
      funding: fundingRound,
      techStack: JSON.stringify(techStack),
      rawData: `Gemini-enriched: ${leadName} (${domain}) - ${profile.industry}, ${profile.location}. Revenue ~$${profile.revenue}M, ${profile.employee_count} employees, ${fundingRound}.`,
      enrichedAt: new Date(),
    },
    nlpFeatures: {
      sentiment: (signals.sentiment_score + 1) / 2, // -1..1 -> 0..1
      expansionSignal: signals.expansion_score > 0.5,
      hiringSignal: signals.hiring_score > 0.5,
      fundingSignal: signals.funding_signal > 0.5,
      rawSignals: JSON.stringify({
        sentiment: signals.sentiment_score,
        expansion: signals.expansion_score,
        hiring: signals.hiring_score,
        funding: signals.funding_signal,
        techAdoption: signals.technology_adoption_score,
      }),
      processedAt: new Date(),
    },
  };
}

export async function calculateScoreWithGemini(
  profile: GeminiCompanyProfile,
  signals: GeminiNLPFeatures
): Promise<GeminiLeadScore | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `Act as a Lead Scoring Agent. Given the following company profile and NLP signals, 
calculate a conversion probability (0-1) and a lead score (0-100).

Profile: ${JSON.stringify(profile)}
Signals: ${JSON.stringify(signals)}

Use a logistic regression approach conceptually. 
Factors to consider:
- High revenue and employee count are positive.
- Recent funding and high hiring growth are strong positive signals.
- Positive sentiment and expansion scores increase probability.
- Tech stack alignment (assume enterprise SaaS context).

Provide a detailed explanation of why the score was given.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conversion_probability: { type: Type.NUMBER },
            lead_score: { type: Type.INTEGER },
            priority_rank: { type: Type.STRING, description: 'Very High, High, Medium, Low' },
            explanation: { type: Type.STRING },
          },
          required: ['conversion_probability', 'lead_score', 'priority_rank', 'explanation'],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as GeminiLeadScore;
  } catch {
    return null;
  }
}
