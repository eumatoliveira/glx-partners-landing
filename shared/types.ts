/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

export type AlertSeverity = "P1" | "P2" | "P3";

export interface ControlTowerFilterState {
  period: "7d" | "30d" | "90d" | "12m" | "custom";
  dateFrom?: string;
  dateTo?: string;
  channel?: string;
  professional?: string;
  procedure?: string;
  status?: string;
  pipeline?: string;
  unit?: string;
  alertSeverity?: AlertSeverity | "all";
}

export interface IngestionParsedRow {
  id: string;
  timestamp: string;
  channel: string;
  professional: string;
  procedure: string;
  status: "agendado" | "realizado" | "cancelado" | "noshow";
  pipeline?: string;
  unit?: string;
  entries: number;
  exits: number;
  slotsAvailable: number;
  slotsEmpty: number;
  ticketMedio: number;
  custoVariavel: number;
  durationMinutes: number;
  materialList: string[];
  waitMinutes: number;
  npsScore: number;
  baseOldRevenueCurrent: number;
  baseOldRevenuePrevious: number;
  crmLeadId?: string;
  sourceType?: "upload" | "crm" | "api" | "webhook" | "manual";
}

export interface ControlTowerFact extends IngestionParsedRow {
  ingestionId?: number;
  userId?: number;
  revenueValue: number;
}

export interface AlertEvent {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  metricKey: string;
  financialImpact: number;
  triggeredAt: string;
  context?: Record<string, unknown>;
}

export interface RcaRecord {
  id: number | string;
  alertId: string;
  severity: AlertSeverity;
  title: string;
  rootCause: string;
  actionPlan: string;
  owner: string;
  dueDate: string;
  status: "open" | "in_progress" | "done";
  createdAt?: string;
  updatedAt?: string;
}
