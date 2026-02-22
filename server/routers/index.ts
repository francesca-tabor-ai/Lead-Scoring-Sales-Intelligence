import { router } from '../trpc';
import { leadsRouter } from './leads';
import { agentsRouter } from './agents';
import { scoresRouter } from './scores';
import { budgetRouter } from './budget';
import { adminRouter } from './admin';
import { dashboardRouter } from './dashboard';

export const appRouter = router({
  leads: leadsRouter,
  agents: agentsRouter,
  scores: scoresRouter,
  budget: budgetRouter,
  admin: adminRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;
