import { z } from 'zod';
import OpenAI from 'openai';
import { router, publicProcedure } from '../trpc';

const PLATFORM_CONTEXT = `You are a friendly, helpful assistant for LSSIS (Lead Scoring & Sales Intelligence System). You answer questions about the platform and guide users through its features.

## Platform overview
LSSIS helps sales teams prioritize leads using AI-powered scoring, NLP enrichment, and budget optimization.

## Key features & navigation
- **Dashboard** (/) – Summary stats (total leads, scored leads, avg/top score), conversion trends chart, top ranked leads
- **Leads** (/leads) – List of leads with filters (new, contacted, qualified, converted), CSV import
- **Lead Detail** (/leads/:id) – Individual lead view with scores and enrichment
- **Scoring Pipeline** (/pipeline) – Run agents: Web Scraper → NLP Enrichment → Scoring (or full pipeline)
- **Budget Optimizer** (/budget) – Set budget, view ROI projections, optimize lead selection by expected value
- **Admin** (/admin) – System administration

## Pipeline flow
1. Web Scraper – Collects firmographic data from company domains
2. NLP Enrichment – Extracts sentiment, expansion, hiring, funding signals (uses OpenAI if API key set)
3. Scoring – Computes lead score for prioritization

## Budget Optimizer
Users can set a budget and run optimization to see which leads to pursue for best ROI. Charts show ROI by budget, allocation summary, and selected leads.

Keep answers concise and actionable. Direct users to specific pages when relevant. If asked about something outside the platform, politely redirect to LSSIS features.`;

export const chatRouter = router({
  sendMessage: publicProcedure
    .input(z.object({ message: z.string().min(1).max(2000), history: z.array(z.object({ role: z.enum(['user', 'assistant']), content: z.string() })).optional().default([]) }))
    .mutation(async ({ input }) => {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        return {
          content: "Chat is unavailable — OPENAI_API_KEY is not configured. Add it to your .env file to enable the conversational AI.",
          error: 'NO_API_KEY' as const,
        };
      }

      const openai = new OpenAI({ apiKey });
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        { role: 'system', content: PLATFORM_CONTEXT },
        ...input.history.slice(-10).map((h) => ({ role: h.role as 'user' | 'assistant', content: h.content })),
        { role: 'user', content: input.message },
      ];

      const res = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.6,
      });

      const content = res.choices[0]?.message?.content?.trim() ?? 'Sorry, I could not generate a response.';
      return { content };
    }),
});
