import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { getRankedLeads } from '../agents/scoring';
import { optimizeBudget } from '../agents/budget';

export const dashboardRouter = router({
  getSummaryStats: publicProcedure.query(async ({ ctx }) => {
    const [leadCount, scoreCount, avgScore] = await Promise.all([
      ctx.prisma.lead.count(),
      ctx.prisma.leadScore.count(),
      ctx.prisma.leadScore.aggregate({ _avg: { leadScore: true } }),
    ]);
    const ranked = await getRankedLeads(ctx.prisma);
    const topScore = ranked[0]?.leadScore ?? 0;
    return {
      totalLeads: leadCount,
      scoredLeads: scoreCount,
      avgScore: Math.round(avgScore._avg.leadScore ?? 0),
      topScore,
    };
  }),

  getConversionTrends: publicProcedure.query(async ({ ctx }) => {
    const scores = await ctx.prisma.leadScore.findMany({
      orderBy: { scoredAt: 'desc' },
      take: 30,
    });
    const byDate = scores.reduce<Record<string, { count: number; avg: number; sum: number }>>((acc, s) => {
      const d = s.scoredAt.toISOString().slice(0, 10);
      if (!acc[d]) acc[d] = { count: 0, avg: 0, sum: 0 };
      acc[d].count++;
      acc[d].sum += s.conversionProbability;
      acc[d].avg = acc[d].sum / acc[d].count;
      return acc;
    }, {});
    return Object.entries(byDate).map(([date, v]) => ({ date, avgConversion: v.avg, count: v.count }));
  }),

  getROIProjections: publicProcedure
    .input(z.object({ budget: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const budgets = input?.budget != null ? [input.budget] : [5000, 10000, 25000, 50000];
      return Promise.all(budgets.map((b) => optimizeBudget(ctx.prisma, b, false)));
    }),
});
