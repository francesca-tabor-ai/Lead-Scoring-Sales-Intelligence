import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { getRankedLeads } from '../agents/scoring';

export const scoresRouter = router({
  getScore: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.leadScore.findFirst({
      where: { leadId: input },
      orderBy: { scoredAt: 'desc' },
      include: { lead: true },
    });
  }),

  getRankedLeads: publicProcedure.query(async ({ ctx }) => {
    return getRankedLeads(ctx.prisma);
  }),

  getExplainability: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const score = await ctx.prisma.leadScore.findFirst({
      where: { leadId: input },
      orderBy: { scoredAt: 'desc' },
    });
    return score ? { factors: score.factors ? JSON.parse(score.factors) : [] } : { factors: [] };
  }),
});
