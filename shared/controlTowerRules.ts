export type PlanTier = "essencial" | "pro" | "enterprise";
export type SectionId =
  | "dashboard"
  | "realtime"
  | "agenda"
  | "equipe"
  | "sprints"
  | "funil"
  | "canais"
  | "integracoes"
  | "dados"
  | "relatorios"
  | "configuracoes";
export type AlertPriority = "P1" | "P2" | "P3";

export type AlertKpiKey =
  | "noShowRate"
  | "margemLiquida"
  | "nps"
  | "faturamentoGapPercent"
  | "fluxoCaixa"
  | "churnRate"
  | "ltvCacRatio"
  | "occupancyRate";

type ThresholdComparator = "greater_than" | "less_than";

interface AlertThreshold {
  comparator: ThresholdComparator;
  target: number;
  p3: number;
  p2: number;
  p1: number;
}

export interface PdfCadenceRule {
  cadence: "weekly" | "monthly";
  maxExports: number;
}

export interface PdfCadenceWindow {
  start: Date;
  end: Date;
  key: string;
  cadence: PdfCadenceRule["cadence"];
  maxExports: number;
}

export const PLAN_RANK: Record<PlanTier, number> = {
  essencial: 0,
  pro: 1,
  enterprise: 2,
};

export const PLAN_ACCESS: Record<PlanTier, SectionId[]> = {
  essencial: ["dashboard", "dados", "configuracoes"],
  pro: ["dashboard", "realtime", "agenda", "equipe", "sprints", "funil", "canais", "dados", "relatorios", "configuracoes"],
  enterprise: ["dashboard", "realtime", "agenda", "equipe", "sprints", "funil", "canais", "integracoes", "dados", "relatorios", "configuracoes"],
};

export const MIN_PLAN_BY_SECTION: Record<SectionId, PlanTier> = {
  dashboard: "essencial",
  realtime: "pro",
  agenda: "pro",
  equipe: "pro",
  sprints: "pro",
  funil: "pro",
  canais: "pro",
  integracoes: "enterprise",
  dados: "essencial",
  relatorios: "pro",
  configuracoes: "essencial",
};

const PRO_ALERT_THRESHOLDS: Record<AlertKpiKey, AlertThreshold> = {
  noShowRate: { comparator: "greater_than", target: 8, p3: 8, p2: 12, p1: 20 },
  margemLiquida: { comparator: "less_than", target: 18, p3: 18, p2: 15, p1: 12 },
  nps: { comparator: "less_than", target: 8, p3: 8, p2: 7.8, p1: 7.5 },
  faturamentoGapPercent: { comparator: "less_than", target: 0, p3: -10, p2: -15, p1: -30 },
  fluxoCaixa: { comparator: "less_than", target: 0, p3: 50_000, p2: 10_000, p1: 0 },
  churnRate: { comparator: "greater_than", target: 5, p3: 5, p2: 8, p1: 12 },
  ltvCacRatio: { comparator: "less_than", target: 3, p3: 3, p2: 2.5, p1: 2 },
  occupancyRate: { comparator: "less_than", target: 80, p3: 80, p2: 70, p1: 55 },
};

export const ALERT_THRESHOLDS: Record<PlanTier, Record<AlertKpiKey, AlertThreshold>> = {
  essencial: {
    noShowRate: { comparator: "greater_than", target: 10, p3: 10, p2: 12, p1: 15 },
    margemLiquida: { comparator: "less_than", target: 18, p3: 18, p2: 15, p1: 12 },
    nps: { comparator: "less_than", target: 8, p3: 8, p2: 7.8, p1: 7.5 },
    faturamentoGapPercent: { comparator: "less_than", target: 0, p3: -5, p2: -15, p1: -20 },
    fluxoCaixa: { comparator: "less_than", target: 0, p3: 50_000, p2: 10_000, p1: 0 },
    churnRate: { comparator: "greater_than", target: 5, p3: 5, p2: 8, p1: 12 },
    ltvCacRatio: { comparator: "less_than", target: 3, p3: 3, p2: 2.5, p1: 2 },
    occupancyRate: { comparator: "less_than", target: 75, p3: 75, p2: 65, p1: 60 },
  },
  pro: PRO_ALERT_THRESHOLDS,
  enterprise: PRO_ALERT_THRESHOLDS,
};

export const PDF_CADENCE_POLICY: Record<PlanTier, PdfCadenceRule> = {
  essencial: { cadence: "monthly", maxExports: 1 },
  pro: { cadence: "weekly", maxExports: 1 },
  enterprise: { cadence: "weekly", maxExports: 1 },
};

export function normalizePlanTier(plan: string | null | undefined): PlanTier {
  if (plan === "pro" || plan === "enterprise") return plan;
  return "essencial";
}

export function canAccessSection(plan: string | null | undefined, section: SectionId): boolean {
  const normalizedPlan = normalizePlanTier(plan);
  return PLAN_ACCESS[normalizedPlan].includes(section);
}

export function getMinPlanForSection(section: SectionId): PlanTier {
  return MIN_PLAN_BY_SECTION[section];
}

export function classifyAlertPriority(kpi: AlertKpiKey, value: number, plan: string | null | undefined): AlertPriority | null {
  const normalizedPlan = normalizePlanTier(plan);
  const threshold = ALERT_THRESHOLDS[normalizedPlan][kpi];

  if (threshold.comparator === "greater_than") {
    if (value > threshold.p1) return "P1";
    if (value > threshold.p2) return "P2";
    if (value > threshold.p3) return "P3";
    return null;
  }

  if (value < threshold.p1) return "P1";
  if (value < threshold.p2) return "P2";
  if (value < threshold.p3) return "P3";
  return null;
}

export function getPdfCadenceWindow(plan: string | null | undefined, referenceDate = new Date()): PdfCadenceWindow {
  const normalizedPlan = normalizePlanTier(plan);
  const rule = PDF_CADENCE_POLICY[normalizedPlan];
  const date = new Date(referenceDate);
  date.setMilliseconds(0);

  if (rule.cadence === "monthly") {
    const start = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 1, 0, 0, 0, 0);
    const key = `m-${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
    return { start, end, key, cadence: rule.cadence, maxExports: rule.maxExports };
  }

  const start = new Date(date);
  const dayOffset = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - dayOffset);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const iso = getIsoWeekInfo(start);
  const key = `w-${iso.year}-${String(iso.week).padStart(2, "0")}`;
  return { start, end, key, cadence: rule.cadence, maxExports: rule.maxExports };
}

function getIsoWeekInfo(date: Date): { year: number; week: number } {
  const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() + 4 - day);

  const yearStart = new Date(Date.UTC(utcDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((utcDate.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7);

  return { year: utcDate.getUTCFullYear(), week };
}
