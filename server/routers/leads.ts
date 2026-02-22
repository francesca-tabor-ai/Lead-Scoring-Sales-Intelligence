import { z } from 'zod';
import { router, publicProcedure } from '../trpc';

export const leadsRouter = router({
  list: publicProcedure
    .input(z.object({ status: z.string().optional(), region: z.string().optional(), industry: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where: Record<string, unknown> = {};
      if (input?.status) where.status = input.status;
      if (input?.region) where.region = input.region;
      if (input?.industry) where.industry = input.industry;
      return ctx.prisma.lead.findMany({
        where,
        include: { companyProfile: true, nlpFeatures: true },
        orderBy: { createdAt: 'desc' },
      });
    }),

  get: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return ctx.prisma.lead.findUnique({
      where: { id: input },
      include: { companyProfile: true, nlpFeatures: true, leadScores: { orderBy: { scoredAt: 'desc' }, take: 1 } },
    });
  }),

  create: publicProcedure
    .input(z.object({ companyId: z.string(), name: z.string(), domain: z.string(), region: z.string(), industry: z.string(), status: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.lead.create({
        data: { ...input, status: input.status ?? 'new' },
      });
    }),

  update: publicProcedure
    .input(z.object({ id: z.string(), companyId: z.string().optional(), name: z.string().optional(), domain: z.string().optional(), region: z.string().optional(), industry: z.string().optional(), status: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.lead.update({ where: { id }, data });
    }),

  delete: publicProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.lead.delete({ where: { id: input } });
  }),

  importCSV: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const Papa = (await import('papaparse')).default;
      const parsed = Papa.parse<Record<string, string>>(input, { header: true, skipEmptyLines: true });
      const rows = parsed.data.filter((r) => r.name && r.domain && r.companyId);
      const created = await Promise.all(
        rows.map((r) =>
          ctx.prisma.lead.create({
            data: {
              companyId: r.companyId ?? r.company_id ?? `gen-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              name: r.name,
              domain: r.domain,
              region: r.region ?? r.Region ?? 'Unknown',
              industry: r.industry ?? r.Industry ?? 'Unknown',
              status: r.status ?? 'new',
            },
          })
        )
      );
      return { imported: created.length, leads: created };
    }),
});
