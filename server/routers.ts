import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { adminRouter } from "./adminRouter";
import { authRouter } from "./authRouter";
import { dashboardDataRouter } from "./dashboardDataRouter";
import { getClientBySlug, getAllDashboardData } from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Email/Password Authentication Routes
  emailAuth: authRouter,

  // Admin Dashboard Routes
  admin: adminRouter,

  // Dashboard Data Management Routes
  dashboardData: dashboardDataRouter,

  // Client Dashboard Data (for authenticated clients)
  clientDashboard: router({
    getMyDashboard: protectedProcedure
      .input(z.object({ clientSlug: z.string() }))
      .query(async ({ input }) => {
        const client = await getClientBySlug(input.clientSlug);
        if (!client) {
          return null;
        }
        return await getAllDashboardData(client.id);
      }),
  }),
});

export type AppRouter = typeof appRouter;
