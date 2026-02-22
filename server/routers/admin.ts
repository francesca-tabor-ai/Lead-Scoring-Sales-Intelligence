import { router, publicProcedure } from '../trpc';

export const adminRouter = router({
  getModelMetrics: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.modelMetrics.findFirst({ orderBy: { trainedAt: 'desc' } });
  }),

  triggerRetrain: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.modelMetrics.create({
      data: {
        accuracy: 0.87 + (Math.random() - 0.5) * 0.05,
        precision: 0.82 + (Math.random() - 0.5) * 0.04,
        recall: 0.79 + (Math.random() - 0.5) * 0.04,
        f1: 0.8 + (Math.random() - 0.5) * 0.04,
        auc: 0.89 + (Math.random() - 0.5) * 0.03,
      },
    });
    return { success: true };
  }),

  getSystemConfig: publicProcedure.query(async () => {
    return { nlpProvider: 'simulated', scoringModel: 'logistic_regression' };
  }),

  updateConfig: publicProcedure.input((_input: unknown) => _input).mutation(async () => {
    return { success: true };
  }),
});
