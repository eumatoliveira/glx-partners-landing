import { eq, desc, sql, and, gte, lte, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  auditLogs, 
  InsertAuditLog,
  systemMetrics,
  InsertSystemMetric,
  featureFlags,
  InsertFeatureFlag,
  subscriptions,
  InsertSubscription,
  payments,
  InsertPayment,
  errorLogs,
  InsertErrorLog,
  serviceStatus,
  InsertServiceStatus
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ==================== ADMIN DASHBOARD QUERIES ====================

// Users Management
export async function getAllUsers(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(users).limit(limit).offset(offset).orderBy(desc(users.createdAt));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserRole(userId: number, role: 'user' | 'admin') {
  const db = await getDb();
  if (!db) return;
  
  await db.update(users).set({ role }).where(eq(users.id, userId));
}

export async function getUsersCount() {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: count() }).from(users);
  return result[0]?.count ?? 0;
}

export async function getMfaEnabledCount() {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({ count: count() }).from(users).where(eq(users.mfaEnabled, true));
  return result[0]?.count ?? 0;
}

// Audit Logs
export async function createAuditLog(log: InsertAuditLog) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(auditLogs).values(log);
}

export async function getAuditLogs(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(auditLogs).limit(limit).offset(offset).orderBy(desc(auditLogs.createdAt));
}

// System Metrics
export async function createSystemMetric(metric: InsertSystemMetric) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(systemMetrics).values(metric);
}

export async function getLatestMetrics() {
  const db = await getDb();
  if (!db) return [];
  
  // Get latest metric for each type
  const metricTypes = ['cpu', 'memory', 'storage', 'latency', 'error_rate', 'api_calls'] as const;
  const results = [];
  
  for (const type of metricTypes) {
    const result = await db.select()
      .from(systemMetrics)
      .where(eq(systemMetrics.metricType, type))
      .orderBy(desc(systemMetrics.recordedAt))
      .limit(1);
    if (result.length > 0) {
      results.push(result[0]);
    }
  }
  
  return results;
}

// Feature Flags
export async function getAllFeatureFlags() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(featureFlags).orderBy(featureFlags.name);
}

export async function createFeatureFlag(flag: InsertFeatureFlag) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(featureFlags).values(flag);
}

export async function updateFeatureFlag(id: number, updates: Partial<InsertFeatureFlag>) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(featureFlags).set(updates).where(eq(featureFlags.id, id));
}

export async function deleteFeatureFlag(id: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(featureFlags).where(eq(featureFlags.id, id));
}

// Subscriptions & Financial
export async function getAllSubscriptions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
}

export async function getActiveSubscriptions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(subscriptions).where(eq(subscriptions.status, 'active'));
}

export async function createSubscription(sub: InsertSubscription) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(subscriptions).values(sub);
}

export async function calculateMRR() {
  const db = await getDb();
  if (!db) return 0;
  
  const result = await db.select({
    total: sql<string>`SUM(${subscriptions.monthlyValue})`
  }).from(subscriptions).where(eq(subscriptions.status, 'active'));
  
  return parseFloat(result[0]?.total ?? '0');
}

export async function getChurnRate(months = 1) {
  const db = await getDb();
  if (!db) return 0;
  
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  const canceled = await db.select({ count: count() })
    .from(subscriptions)
    .where(and(
      eq(subscriptions.status, 'canceled'),
      gte(subscriptions.canceledAt, startDate)
    ));
  
  const total = await db.select({ count: count() }).from(subscriptions);
  
  const canceledCount = canceled[0]?.count ?? 0;
  const totalCount = total[0]?.count ?? 1;
  
  return (canceledCount / totalCount) * 100;
}

// Payments
export async function getPayments(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(payments).limit(limit).orderBy(desc(payments.createdAt));
}

export async function getPendingPayments() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(payments).where(eq(payments.status, 'pending'));
}

export async function getFailedPayments() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(payments).where(eq(payments.status, 'failed'));
}

// Error Logs
export async function createErrorLog(log: InsertErrorLog) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(errorLogs).values(log);
}

export async function getErrorLogs(limit = 100) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(errorLogs).limit(limit).orderBy(desc(errorLogs.createdAt));
}

export async function getErrorStats(hours = 24) {
  const db = await getDb();
  if (!db) return { total: 0, by4xx: 0, by5xx: 0 };
  
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - hours);
  
  const total = await db.select({ count: count() })
    .from(errorLogs)
    .where(gte(errorLogs.createdAt, startDate));
  
  const by4xx = await db.select({ count: count() })
    .from(errorLogs)
    .where(and(
      gte(errorLogs.createdAt, startDate),
      eq(errorLogs.errorType, '4xx')
    ));
  
  const by5xx = await db.select({ count: count() })
    .from(errorLogs)
    .where(and(
      gte(errorLogs.createdAt, startDate),
      eq(errorLogs.errorType, '5xx')
    ));
  
  return {
    total: total[0]?.count ?? 0,
    by4xx: by4xx[0]?.count ?? 0,
    by5xx: by5xx[0]?.count ?? 0
  };
}

// Service Status
export async function getAllServiceStatus() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(serviceStatus).orderBy(serviceStatus.serviceName);
}

export async function upsertServiceStatus(status: InsertServiceStatus) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(serviceStatus).values(status).onDuplicateKeyUpdate({
    set: {
      status: status.status,
      lastCheckedAt: new Date(),
      responseTime: status.responseTime,
      metadata: status.metadata
    }
  });
}

// Search users by email or name
export async function searchUsers(query: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(users)
    .where(sql`${users.email} LIKE ${`%${query}%`} OR ${users.name} LIKE ${`%${query}%`}`)
    .limit(limit);
}

// ==================== EMAIL/PASSWORD AUTHENTICATION ====================

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createUserWithPassword(userData: {
  email: string;
  passwordHash: string;
  name?: string;
  role?: 'user' | 'admin';
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Generate a unique openId for email/password users
  const openId = `email_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  await db.insert(users).values({
    openId,
    email: userData.email,
    passwordHash: userData.passwordHash,
    name: userData.name || userData.email.split('@')[0],
    loginMethod: 'email',
    role: userData.role || 'user',
    isActive: true,
    lastSignedIn: new Date(),
  });
  
  return await getUserByEmail(userData.email);
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
}

export async function updateUserStatus(userId: number, isActive: boolean) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(users).set({ isActive }).where(eq(users.id, userId));
}

export async function updateUserLastSignIn(userId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, userId));
}

export async function deleteUser(userId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(users).where(eq(users.id, userId));
}

export async function updateUser(userId: number, updates: { name?: string; email?: string; role?: 'user' | 'admin'; isActive?: boolean }) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(users).set(updates).where(eq(users.id, userId));
}
