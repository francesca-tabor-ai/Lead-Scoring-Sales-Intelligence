import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { hashPassword, signToken } from '../auth';

export const authRouter = router({
  signUp: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(8) }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.prisma.user.findUnique({ where: { email: input.email } });
      if (existing) throw new Error('Email already registered');
      const passwordHash = await hashPassword(input.password);
      const user = await ctx.prisma.user.create({
        data: { email: input.email, passwordHash, role: 'user' },
      });
      const token = signToken({ id: user.id, email: user.email, role: user.role });
      return { token, user: { id: user.id, email: user.email, role: user.role } };
    }),

  logIn: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { verifyPassword } = await import('../auth');
      const user = await ctx.prisma.user.findUnique({ where: { email: input.email } });
      if (!user) throw new Error('Invalid email or password');
      const ok = await verifyPassword(input.password, user.passwordHash);
      if (!ok) throw new Error('Invalid email or password');
      const token = signToken({ id: user.id, email: user.email, role: user.role });
      return { token, user: { id: user.id, email: user.email, role: user.role } };
    }),

  me: publicProcedure.query(({ ctx }) => {
    return ctx.user ? { user: ctx.user } : { user: null };
  }),
});
