import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { runScraper } from '../agents/scraper';
import { runNLP } from '../agents/nlp';
import { runScoring } from '../agents/scoring';

export const agentsRouter = router({
  runScraper: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const job = await ctx.prisma.agentJob.create({
      data: { leadId: input, agentType: 'scraper', status: 'running', startedAt: new Date() },
    });
    try {
      await runScraper(ctx.prisma, input);
      await ctx.prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'completed', completedAt: new Date() },
      });
    } catch (e) {
      await ctx.prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'failed', completedAt: new Date(), error: String(e) },
      });
      throw e;
    }
    return { jobId: job.id, success: true };
  }),

  runNLP: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const job = await ctx.prisma.agentJob.create({
      data: { leadId: input, agentType: 'nlp', status: 'running', startedAt: new Date() },
    });
    try {
      await runNLP(ctx.prisma, input);
      await ctx.prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'completed', completedAt: new Date() },
      });
    } catch (e) {
      await ctx.prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'failed', completedAt: new Date(), error: String(e) },
      });
      throw e;
    }
    return { jobId: job.id, success: true };
  }),

  runScoring: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const job = await ctx.prisma.agentJob.create({
      data: { leadId: input, agentType: 'scoring', status: 'running', startedAt: new Date() },
    });
    try {
      const result = await runScoring(ctx.prisma, input);
      await ctx.prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'completed', completedAt: new Date() },
      });
      return { jobId: job.id, ...result };
    } catch (e) {
      await ctx.prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'failed', completedAt: new Date(), error: String(e) },
      });
      throw e;
    }
  }),

  runPipeline: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const job = await ctx.prisma.agentJob.create({
      data: { leadId: input, agentType: 'pipeline', status: 'running', startedAt: new Date() },
    });
    try {
      await runScraper(ctx.prisma, input);
      await runNLP(ctx.prisma, input);
      const result = await runScoring(ctx.prisma, input);
      await ctx.prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'completed', completedAt: new Date() },
      });
      return { jobId: job.id, ...result };
    } catch (e) {
      await ctx.prisma.agentJob.update({
        where: { id: job.id },
        data: { status: 'failed', completedAt: new Date(), error: String(e) },
      });
      throw e;
    }
  }),

  getJobStatus: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.agentJob.findUnique({ where: { id: input }, include: { lead: true } });
  }),
});
