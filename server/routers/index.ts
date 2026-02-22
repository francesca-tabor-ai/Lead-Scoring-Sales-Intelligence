import { router } from '../trpc';
import { authRouter } from './auth';
import { leadsRouter } from './leads';
import { agentsRouter } from './agents';
import { scoresRouter } from './scores';
import { budgetRouter } from './budget';
import { adminRouter } from './admin';
import { dashboardRouter } from './dashboard';
import { chatRouter } from './chat';

export const appRouter = router({
  auth: authRouter,
  leads: leadsRouter,
  agents: agentsRouter,
  scores: scoresRouter,
  budget: budgetRouter,
  admin: adminRouter,
  dashboard: dashboardRouter,
  chat: chatRouter,
});

export type AppRouter = typeof appRouter;
