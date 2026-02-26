import { z } from "zod";
import { adminProcedure, router } from "./_core/trpc";
import * as db from "./db";

export const adminRouter = router({
  // ==================== DASHBOARD OVERVIEW ====================
  getDashboardStats: adminProcedure.query(async () => {
    const [
      usersCount,
      mfaCount,
      mrr,
      churnRate,
      errorStats,
      services,
      metrics
    ] = await Promise.all([
      db.getUsersCount(),
      db.getMfaEnabledCount(),
      db.calculateMRR(),
      db.getChurnRate(),
      db.getErrorStats(24),
      db.getAllServiceStatus(),
      db.getLatestMetrics()
    ]);

    return {
      users: {
        total: usersCount,
        mfaEnabled: mfaCount,
        mfaPercentage: usersCount > 0 ? (mfaCount / usersCount) * 100 : 0
      },
      financial: {
        mrr,
        arr: mrr * 12,
        churnRate
      },
      errors: errorStats,
      services,
      metrics
    };
  }),

  // ==================== USERS MANAGEMENT ====================
  getUsers: adminProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0)
    }).optional())
    .query(async ({ input }) => {
      const { limit = 50, offset = 0 } = input ?? {};
      const users = await db.getAllUsers(limit, offset);
      const integrationSummaryByUser = await db.getIntegrationSummariesByUserIds(users.map((user) => user.id));

      return users.map((user) => {
        const summary = integrationSummaryByUser.get(user.id);
        return {
          ...user,
          integrationCount: summary?.count ?? 0,
          integrationTypes: summary?.types ?? [],
        };
      });
    }),

  searchUsers: adminProcedure
    .input(z.object({
      query: z.string().min(1)
    }))
    .query(async ({ input }) => {
      return await db.searchUsers(input.query);
    }),

  updateUserRole: adminProcedure
    .input(z.object({
      userId: z.number(),
      role: z.enum(['user', 'admin'])
    }))
    .mutation(async ({ input, ctx }) => {
      await db.updateUserRole(input.userId, input.role);
      
      // Log the action
      await db.createAuditLog({
        userId: ctx.user.id,
        action: 'UPDATE_USER_ROLE',
        entity: 'users',
        entityId: String(input.userId),
        oldValue: null,
        newValue: { role: input.role }
      });
      
      return { success: true };
    }),

  updateUserPlan: adminProcedure
    .input(z.object({
      userId: z.number(),
      plan: z.enum(['essencial', 'pro', 'enterprise'])
    }))
    .mutation(async ({ input, ctx }) => {
      await db.updateUserPlan(input.userId, input.plan);
      
      // Log the action
      await db.createAuditLog({
        userId: ctx.user.id,
        action: 'UPDATE_USER_PLAN',
        entity: 'users',
        entityId: String(input.userId),
        oldValue: null,
        newValue: { plan: input.plan }
      });
      
      return { success: true };
    }),

  // ==================== AUDIT LOGS ====================
  getAuditLogs: adminProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0)
    }).optional())
    .query(async ({ input }) => {
      const { limit = 50, offset = 0 } = input ?? {};
      return await db.getAuditLogs(limit, offset);
    }),

  // ==================== FEATURE FLAGS ====================
  getFeatureFlags: adminProcedure.query(async () => {
    return await db.getAllFeatureFlags();
  }),

  createFeatureFlag: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      description: z.string().optional(),
      enabled: z.boolean().default(false),
      targetUsers: z.any().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      await db.createFeatureFlag(input);
      
      await db.createAuditLog({
        userId: ctx.user.id,
        action: 'CREATE_FEATURE_FLAG',
        entity: 'feature_flags',
        entityId: input.name,
        newValue: input
      });
      
      return { success: true };
    }),

  updateFeatureFlag: adminProcedure
    .input(z.object({
      id: z.number(),
      enabled: z.boolean().optional(),
      description: z.string().optional(),
      targetUsers: z.any().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      const { id, ...updates } = input;
      await db.updateFeatureFlag(id, updates);
      
      await db.createAuditLog({
        userId: ctx.user.id,
        action: 'UPDATE_FEATURE_FLAG',
        entity: 'feature_flags',
        entityId: String(id),
        newValue: updates
      });
      
      return { success: true };
    }),

  deleteFeatureFlag: adminProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ input, ctx }) => {
      await db.deleteFeatureFlag(input.id);
      
      await db.createAuditLog({
        userId: ctx.user.id,
        action: 'DELETE_FEATURE_FLAG',
        entity: 'feature_flags',
        entityId: String(input.id)
      });
      
      return { success: true };
    }),

  // ==================== FINANCIAL ====================
  getSubscriptions: adminProcedure.query(async () => {
    return await db.getAllSubscriptions();
  }),

  getActiveSubscriptions: adminProcedure.query(async () => {
    return await db.getActiveSubscriptions();
  }),

  getFinancialMetrics: adminProcedure.query(async () => {
    const [mrr, churnRate, activeSubscriptions, pendingPayments, failedPayments] = await Promise.all([
      db.calculateMRR(),
      db.getChurnRate(),
      db.getActiveSubscriptions(),
      db.getPendingPayments(),
      db.getFailedPayments()
    ]);

    // Calculate LTV (simplified: MRR * average customer lifetime in months)
    const avgLifetimeMonths = 24; // Assumed average
    const ltv = mrr > 0 && activeSubscriptions.length > 0 
      ? (mrr / activeSubscriptions.length) * avgLifetimeMonths 
      : 0;

    return {
      mrr,
      arr: mrr * 12,
      churnRate,
      ltv,
      activeSubscriptionsCount: activeSubscriptions.length,
      pendingPaymentsCount: pendingPayments.length,
      failedPaymentsCount: failedPayments.length,
      pendingPayments,
      failedPayments
    };
  }),

  getPayments: adminProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50)
    }).optional())
    .query(async ({ input }) => {
      const { limit = 50 } = input ?? {};
      return await db.getPayments(limit);
    }),

  // ==================== ERROR LOGS ====================
  getErrorLogs: adminProcedure
    .input(z.object({
      limit: z.number().min(1).max(200).default(100)
    }).optional())
    .query(async ({ input }) => {
      const { limit = 100 } = input ?? {};
      return await db.getErrorLogs(limit);
    }),

  getErrorStats: adminProcedure
    .input(z.object({
      hours: z.number().min(1).max(168).default(24)
    }).optional())
    .query(async ({ input }) => {
      const { hours = 24 } = input ?? {};
      return await db.getErrorStats(hours);
    }),

  // ==================== SERVICE STATUS ====================
  getServiceStatus: adminProcedure.query(async () => {
    return await db.getAllServiceStatus();
  }),

  updateServiceStatus: adminProcedure
    .input(z.object({
      serviceName: z.string().min(1).max(50),
      status: z.enum(['operational', 'degraded', 'down']),
      responseTime: z.number().optional(),
      metadata: z.any().optional()
    }))
    .mutation(async ({ input, ctx }) => {
      await db.upsertServiceStatus(input);
      
      await db.createAuditLog({
        userId: ctx.user.id,
        action: 'UPDATE_SERVICE_STATUS',
        entity: 'service_status',
        entityId: input.serviceName,
        newValue: input
      });
      
      return { success: true };
    }),

  // ==================== SYSTEM METRICS ====================
  getSystemMetrics: adminProcedure.query(async () => {
    return await db.getLatestMetrics();
  }),

  recordMetric: adminProcedure
    .input(z.object({
      metricType: z.enum(['cpu', 'memory', 'storage', 'latency', 'error_rate', 'api_calls']),
      value: z.string(),
      metadata: z.any().optional()
    }))
    .mutation(async ({ input }) => {
      await db.createSystemMetric(input);
      return { success: true };
    }),
});

export type AdminRouter = typeof adminRouter;
