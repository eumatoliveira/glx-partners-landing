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
  InsertServiceStatus,
  manualEntries,
  InsertManualEntry
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


// ==================== DASHBOARD CLIENTE - DATA ACCESS ====================

import {
  clients,
  InsertClient,
  ceoMetrics,
  InsertCeoMetric,
  andonAlerts,
  InsertAndonAlert,
  financialData,
  InsertFinancialData,
  operationsData,
  InsertOperationsData,
  wasteData,
  InsertWasteData,
  marketingData,
  InsertMarketingData,
  qualityData,
  InsertQualityData,
  peopleData,
  InsertPeopleData,
  dataGovernanceData,
  InsertDataGovernanceData,
  dataImports,
  InsertDataImport,
} from "../drizzle/schema";

// ==================== CLIENTS ====================

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(clients).orderBy(clients.name);
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getClientBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(clients).where(eq(clients.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(clients).values(client);
  return result;
}

export async function updateClient(id: number, updates: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(clients).set(updates).where(eq(clients.id, id));
}

export async function deleteClient(id: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(clients).where(eq(clients.id, id));
}

// ==================== CEO METRICS ====================

export async function getCeoMetrics(clientId: number, period?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (period) {
    return await db.select().from(ceoMetrics)
      .where(and(eq(ceoMetrics.clientId, clientId), eq(ceoMetrics.period, period)))
      .orderBy(desc(ceoMetrics.createdAt));
  }
  
  return await db.select().from(ceoMetrics)
    .where(eq(ceoMetrics.clientId, clientId))
    .orderBy(desc(ceoMetrics.createdAt));
}

export async function getLatestCeoMetrics(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(ceoMetrics)
    .where(eq(ceoMetrics.clientId, clientId))
    .orderBy(desc(ceoMetrics.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertCeoMetrics(data: InsertCeoMetric) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if exists for this client and period
  const existing = await db.select().from(ceoMetrics)
    .where(and(eq(ceoMetrics.clientId, data.clientId), eq(ceoMetrics.period, data.period)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(ceoMetrics).set(data).where(eq(ceoMetrics.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(ceoMetrics).values(data);
    return result[0].insertId;
  }
}

// ==================== ANDON ALERTS ====================

export async function getAndonAlerts(clientId: number, includeResolved = false) {
  const db = await getDb();
  if (!db) return [];
  
  if (includeResolved) {
    return await db.select().from(andonAlerts)
      .where(eq(andonAlerts.clientId, clientId))
      .orderBy(desc(andonAlerts.createdAt));
  }
  
  return await db.select().from(andonAlerts)
    .where(and(eq(andonAlerts.clientId, clientId), eq(andonAlerts.isResolved, false)))
    .orderBy(desc(andonAlerts.createdAt));
}

export async function createAndonAlert(alert: InsertAndonAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(andonAlerts).values(alert);
}

export async function resolveAndonAlert(id: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.update(andonAlerts).set({ isResolved: true, resolvedAt: new Date() }).where(eq(andonAlerts.id, id));
}

export async function deleteAndonAlert(id: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.delete(andonAlerts).where(eq(andonAlerts.id, id));
}

// ==================== FINANCIAL DATA ====================

export async function getFinancialData(clientId: number, period?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (period) {
    return await db.select().from(financialData)
      .where(and(eq(financialData.clientId, clientId), eq(financialData.period, period)))
      .orderBy(desc(financialData.createdAt));
  }
  
  return await db.select().from(financialData)
    .where(eq(financialData.clientId, clientId))
    .orderBy(desc(financialData.createdAt));
}

export async function getLatestFinancialData(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(financialData)
    .where(eq(financialData.clientId, clientId))
    .orderBy(desc(financialData.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertFinancialData(data: InsertFinancialData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(financialData)
    .where(and(eq(financialData.clientId, data.clientId), eq(financialData.period, data.period)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(financialData).set(data).where(eq(financialData.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(financialData).values(data);
    return result[0].insertId;
  }
}

// ==================== OPERATIONS DATA ====================

export async function getOperationsData(clientId: number, period?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (period) {
    return await db.select().from(operationsData)
      .where(and(eq(operationsData.clientId, clientId), eq(operationsData.period, period)))
      .orderBy(desc(operationsData.createdAt));
  }
  
  return await db.select().from(operationsData)
    .where(eq(operationsData.clientId, clientId))
    .orderBy(desc(operationsData.createdAt));
}

export async function getLatestOperationsData(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(operationsData)
    .where(eq(operationsData.clientId, clientId))
    .orderBy(desc(operationsData.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertOperationsData(data: InsertOperationsData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(operationsData)
    .where(and(eq(operationsData.clientId, data.clientId), eq(operationsData.period, data.period)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(operationsData).set(data).where(eq(operationsData.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(operationsData).values(data);
    return result[0].insertId;
  }
}

// ==================== WASTE DATA ====================

export async function getWasteData(clientId: number, period?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (period) {
    return await db.select().from(wasteData)
      .where(and(eq(wasteData.clientId, clientId), eq(wasteData.period, period)))
      .orderBy(desc(wasteData.createdAt));
  }
  
  return await db.select().from(wasteData)
    .where(eq(wasteData.clientId, clientId))
    .orderBy(desc(wasteData.createdAt));
}

export async function getLatestWasteData(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(wasteData)
    .where(eq(wasteData.clientId, clientId))
    .orderBy(desc(wasteData.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertWasteData(data: InsertWasteData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(wasteData)
    .where(and(eq(wasteData.clientId, data.clientId), eq(wasteData.period, data.period)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(wasteData).set(data).where(eq(wasteData.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(wasteData).values(data);
    return result[0].insertId;
  }
}

// ==================== MARKETING DATA ====================

export async function getMarketingData(clientId: number, period?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (period) {
    return await db.select().from(marketingData)
      .where(and(eq(marketingData.clientId, clientId), eq(marketingData.period, period)))
      .orderBy(desc(marketingData.createdAt));
  }
  
  return await db.select().from(marketingData)
    .where(eq(marketingData.clientId, clientId))
    .orderBy(desc(marketingData.createdAt));
}

export async function getLatestMarketingData(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(marketingData)
    .where(eq(marketingData.clientId, clientId))
    .orderBy(desc(marketingData.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertMarketingData(data: InsertMarketingData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(marketingData)
    .where(and(eq(marketingData.clientId, data.clientId), eq(marketingData.period, data.period)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(marketingData).set(data).where(eq(marketingData.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(marketingData).values(data);
    return result[0].insertId;
  }
}

// ==================== QUALITY DATA ====================

export async function getQualityData(clientId: number, period?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (period) {
    return await db.select().from(qualityData)
      .where(and(eq(qualityData.clientId, clientId), eq(qualityData.period, period)))
      .orderBy(desc(qualityData.createdAt));
  }
  
  return await db.select().from(qualityData)
    .where(eq(qualityData.clientId, clientId))
    .orderBy(desc(qualityData.createdAt));
}

export async function getLatestQualityData(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(qualityData)
    .where(eq(qualityData.clientId, clientId))
    .orderBy(desc(qualityData.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertQualityData(data: InsertQualityData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(qualityData)
    .where(and(eq(qualityData.clientId, data.clientId), eq(qualityData.period, data.period)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(qualityData).set(data).where(eq(qualityData.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(qualityData).values(data);
    return result[0].insertId;
  }
}

// ==================== PEOPLE DATA ====================

export async function getPeopleData(clientId: number, period?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (period) {
    return await db.select().from(peopleData)
      .where(and(eq(peopleData.clientId, clientId), eq(peopleData.period, period)))
      .orderBy(desc(peopleData.createdAt));
  }
  
  return await db.select().from(peopleData)
    .where(eq(peopleData.clientId, clientId))
    .orderBy(desc(peopleData.createdAt));
}

export async function getLatestPeopleData(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(peopleData)
    .where(eq(peopleData.clientId, clientId))
    .orderBy(desc(peopleData.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertPeopleData(data: InsertPeopleData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(peopleData)
    .where(and(eq(peopleData.clientId, data.clientId), eq(peopleData.period, data.period)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(peopleData).set(data).where(eq(peopleData.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(peopleData).values(data);
    return result[0].insertId;
  }
}

// ==================== DATA GOVERNANCE ====================

export async function getDataGovernanceData(clientId: number, period?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (period) {
    return await db.select().from(dataGovernanceData)
      .where(and(eq(dataGovernanceData.clientId, clientId), eq(dataGovernanceData.period, period)))
      .orderBy(desc(dataGovernanceData.createdAt));
  }
  
  return await db.select().from(dataGovernanceData)
    .where(eq(dataGovernanceData.clientId, clientId))
    .orderBy(desc(dataGovernanceData.createdAt));
}

export async function getLatestDataGovernanceData(clientId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(dataGovernanceData)
    .where(eq(dataGovernanceData.clientId, clientId))
    .orderBy(desc(dataGovernanceData.createdAt))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function upsertDataGovernanceData(data: InsertDataGovernanceData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(dataGovernanceData)
    .where(and(eq(dataGovernanceData.clientId, data.clientId), eq(dataGovernanceData.period, data.period)))
    .limit(1);
  
  if (existing.length > 0) {
    await db.update(dataGovernanceData).set(data).where(eq(dataGovernanceData.id, existing[0].id));
    return existing[0].id;
  } else {
    const result = await db.insert(dataGovernanceData).values(data);
    return result[0].insertId;
  }
}

// ==================== DATA IMPORTS ====================

export async function getDataImports(clientId?: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  
  if (clientId) {
    return await db.select().from(dataImports)
      .where(eq(dataImports.clientId, clientId))
      .orderBy(desc(dataImports.createdAt))
      .limit(limit);
  }
  
  return await db.select().from(dataImports)
    .orderBy(desc(dataImports.createdAt))
    .limit(limit);
}

export async function createDataImport(data: InsertDataImport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(dataImports).values(data);
  return result[0].insertId;
}

export async function updateDataImportStatus(id: number, status: 'pending' | 'processing' | 'completed' | 'failed', recordsImported?: number, errorMessage?: string) {
  const db = await getDb();
  if (!db) return;
  
  const updates: Partial<InsertDataImport> = { status };
  if (recordsImported !== undefined) updates.recordsImported = recordsImported;
  if (errorMessage) updates.errorMessage = errorMessage;
  if (status === 'completed' || status === 'failed') updates.completedAt = new Date();
  
  await db.update(dataImports).set(updates).where(eq(dataImports.id, id));
}

// ==================== BULK DATA OPERATIONS ====================

export async function getAllDashboardData(clientId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const [ceo, financial, operations, waste, marketing, quality, people, dataGov, alerts] = await Promise.all([
    getLatestCeoMetrics(clientId),
    getLatestFinancialData(clientId),
    getLatestOperationsData(clientId),
    getLatestWasteData(clientId),
    getLatestMarketingData(clientId),
    getLatestQualityData(clientId),
    getLatestPeopleData(clientId),
    getLatestDataGovernanceData(clientId),
    getAndonAlerts(clientId),
  ]);
  
  return {
    ceoMetrics: ceo,
    financialData: financial,
    operationsData: operations,
    wasteData: waste,
    marketingData: marketing,
    qualityData: quality,
    peopleData: people,
    dataGovernanceData: dataGov,
    andonAlerts: alerts,
  };
}


// ==================== MANUAL ENTRIES ====================

export async function getManualEntries(userId: number, category?: "financial" | "attendance") {
  const db = await getDb();
  if (!db) return [];
  if (category) {
    return db.select().from(manualEntries)
      .where(and(eq(manualEntries.userId, userId), eq(manualEntries.category, category)))
      .orderBy(desc(manualEntries.createdAt));
  }
  return db.select().from(manualEntries)
    .where(eq(manualEntries.userId, userId))
    .orderBy(desc(manualEntries.createdAt));
}

export async function createManualEntry(data: InsertManualEntry) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(manualEntries).values(data);
  return result[0].insertId;
}

export async function deleteManualEntry(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(manualEntries).where(and(eq(manualEntries.id, id), eq(manualEntries.userId, userId)));
  return { success: true };
}
