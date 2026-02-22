import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { optimizeBudget } from '../agents/budget';

export const budgetRouter = router({
  optimize: publicProcedure.input(z.object({ budget: z.number() })).mutation(async ({ ctx, input }) => {
    return optimizeBudget(ctx.prisma, input.budget);
  }),

  getRecommendations: publicProcedure.input(z.object({ budget: z.number() })).query(async ({ ctx, input }) => {
    return optimizeBudget(ctx.prisma, input.budget, false);
  }),

  saveAllocation: publicProcedure
    .input(z.object({ budget: z.number(), selectedLeads: z.array(z.string()), expectedRoi: z.number(), totalCost: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.budgetAllocation.create({
        data: {
          budget: input.budget,
          selectedLeads: JSON.stringify(input.selectedLeads),
          expectedRoi: input.expectedRoi,
          totalCost: input.totalCost,
        },
      });
    }),
});
