import { z } from 'zod';
import { router, adminProcedure, publicProcedure } from '../trpc';

const adminRouter = router({
  // Model metrics (keep public for dashboard overview; admin CRUD below)
  getModelMetrics: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.modelMetrics.findFirst({ orderBy: { trainedAt: 'desc' } });
  }),

  triggerRetrain: adminProcedure.mutation(async ({ ctx }) => {
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

  // ===== Admin CRUD (protected) =====

  // Leads
  listLeads: adminProcedure
    .input(z.object({ status: z.string().optional(), limit: z.number().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const where = input?.status ? { status: input.status } : {};
      return ctx.prisma.lead.findMany({
        where,
        include: { companyProfile: true, nlpFeatures: true },
        orderBy: { createdAt: 'desc' },
        take: input?.limit ?? 100,
      });
    }),

  createLead: adminProcedure
    .input(z.object({ companyId: z.string(), name: z.string(), domain: z.string(), region: z.string(), industry: z.string(), status: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.lead.create({ data: { ...input, status: input.status ?? 'new' } });
    }),

  updateLead: adminProcedure
    .input(z.object({ id: z.string(), companyId: z.string().optional(), name: z.string().optional(), domain: z.string().optional(), region: z.string().optional(), industry: z.string().optional(), status: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.lead.update({ where: { id }, data });
    }),

  deleteLead: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.lead.delete({ where: { id: input } });
  }),

  // Company Profiles
  listCompanyProfiles: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.companyProfile.findMany({ include: { lead: true }, orderBy: { createdAt: 'desc' } });
  }),

  createCompanyProfile: adminProcedure
    .input(z.object({
      leadId: z.string(),
      revenue: z.string().optional(),
      employees: z.number().optional(),
      funding: z.string().optional(),
      techStack: z.string().optional(),
      rawData: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.companyProfile.create({ data: input });
    }),

  updateCompanyProfile: adminProcedure
    .input(z.object({
      id: z.string(),
      revenue: z.string().optional(),
      employees: z.number().optional(),
      funding: z.string().optional(),
      techStack: z.string().optional(),
      rawData: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.companyProfile.update({ where: { id }, data });
    }),

  deleteCompanyProfile: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.companyProfile.delete({ where: { id: input } });
  }),

  // NLP Features
  listNLPFeatures: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.nLPFeatures.findMany({ include: { lead: true }, orderBy: { createdAt: 'desc' } });
  }),

  createNLPFeatures: adminProcedure
    .input(z.object({
      leadId: z.string(),
      sentiment: z.number().optional(),
      expansionSignal: z.boolean().optional(),
      hiringSignal: z.boolean().optional(),
      fundingSignal: z.boolean().optional(),
      rawSignals: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.nLPFeatures.create({ data: input });
    }),

  updateNLPFeatures: adminProcedure
    .input(z.object({
      id: z.string(),
      sentiment: z.number().optional(),
      expansionSignal: z.boolean().optional(),
      hiringSignal: z.boolean().optional(),
      fundingSignal: z.boolean().optional(),
      rawSignals: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.nLPFeatures.update({ where: { id }, data });
    }),

  deleteNLPFeatures: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.nLPFeatures.delete({ where: { id: input } });
  }),

  // Lead Scores
  listLeadScores: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.leadScore.findMany({ include: { lead: true }, orderBy: { scoredAt: 'desc' } });
  }),

  createLeadScore: adminProcedure
    .input(z.object({
      leadId: z.string(),
      conversionProbability: z.number(),
      leadScore: z.number(),
      priorityRank: z.number(),
      factors: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.leadScore.create({ data: input });
    }),

  updateLeadScore: adminProcedure
    .input(z.object({
      id: z.string(),
      conversionProbability: z.number().optional(),
      leadScore: z.number().optional(),
      priorityRank: z.number().optional(),
      factors: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.leadScore.update({ where: { id }, data });
    }),

  deleteLeadScore: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.leadScore.delete({ where: { id: input } });
  }),

  // Budget Allocations
  listBudgetAllocations: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.budgetAllocation.findMany({ orderBy: { createdAt: 'desc' } });
  }),

  createBudgetAllocation: adminProcedure
    .input(z.object({
      budget: z.number(),
      selectedLeads: z.string(), // JSON array string
      expectedRoi: z.number(),
      totalCost: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.budgetAllocation.create({
        data: {
          budget: input.budget,
          selectedLeads: input.selectedLeads,
          expectedRoi: input.expectedRoi,
          totalCost: input.totalCost,
        },
      });
    }),

  deleteBudgetAllocation: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.budgetAllocation.delete({ where: { id: input } });
  }),

  // Agent Jobs
  listAgentJobs: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.agentJob.findMany({ include: { lead: true }, orderBy: { createdAt: 'desc' } });
  }),

  deleteAgentJob: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.agentJob.delete({ where: { id: input } });
  }),

  // Model Metrics
  listModelMetrics: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.modelMetrics.findMany({ orderBy: { trainedAt: 'desc' }, take: 50 });
  }),

  createModelMetrics: adminProcedure
    .input(z.object({
      accuracy: z.number(),
      precision: z.number(),
      recall: z.number(),
      f1: z.number(),
      auc: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.modelMetrics.create({ data: input });
    }),

  deleteModelMetrics: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    return ctx.prisma.modelMetrics.delete({ where: { id: input } });
  }),

  // Users
  listUsers: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }),

  createUser: adminProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(8), role: z.enum(['user', 'admin']) }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new Error('Email already registered');
      const { hashPassword } = await import('../auth');
      const passwordHash = await hashPassword(input.password);
      return ctx.prisma.user.create({
        data: { email: input.email, passwordHash, role: input.role },
        select: { id: true, email: true, role: true, createdAt: true },
      });
    }),

  updateUserRole: adminProcedure
    .input(z.object({ id: z.string(), role: z.enum(['user', 'admin']) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: input.id },
        data: { role: input.role },
        select: { id: true, email: true, role: true },
      });
    }),

  deleteUser: adminProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    if (ctx.user.sub === input) throw new Error('Cannot delete your own account');
    return ctx.prisma.user.delete({ where: { id: input } });
  }),
});

export { adminRouter };
