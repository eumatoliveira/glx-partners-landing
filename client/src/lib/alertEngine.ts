import { enterprise } from "@shared/controlTowerRules";

export type AlertPriority = "P1" | "P2" | "P3";
export type AlertType = "snapshot" | "realtime";

export interface Alert {
  id: string;
  priority: AlertPriority;
  type: AlertType;
  title: string;
  message: string;
  kpiName: string;
  currentValue: number;
  targetValue: number;
  deviationPercent: number;
  financialImpact: number | null;
  category: "financial" | "operational" | "quality" | "growth";
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt: Date | null;
  assignee: string | null;
}

export interface KPIData {
  noShowRate: number;
  margemLiquida: number;
  nps: number;
  faturamento: number;
  metaFaturamento: number;
  churnRate: number;
  fluxoCaixa: number;
  occupancyRate: number;
  cac: number;
  ltv: number;
  slotsVazios?: number;
  ticketMedio?: number;
  revpasAtual?: number;
  revpas7DiasAtras?: number;
}

function calculateDeviation(current: number, target: number): number {
  if (!Number.isFinite(current) || !Number.isFinite(target) || target === 0) return 0;
  return ((current - target) / target) * 100;
}

function inferCategory(metricKey: string): Alert["category"] {
  if (metricKey.includes("revpas") || metricKey.includes("faturamento") || metricKey.includes("margem")) return "financial";
  if (metricKey.includes("nps")) return "quality";
  if (metricKey.includes("cac") || metricKey.includes("nrr")) return "growth";
  return "operational";
}

export function classifyAlerts(data: KPIData): Alert[] {
  const impactoFinanceiro = enterprise.formulas.calcImpactoFinanceiro(
    data.slotsVazios ?? Math.max(0, Math.round(data.noShowRate)),
    data.ticketMedio ?? Math.max(0, data.faturamento / Math.max(1, data.metaFaturamento / 1000)),
  );

  const snapshot = {
    margemLiquida: data.margemLiquida,
    taxaNoshow: data.noShowRate,
    impactoFinanceiro,
    revpasAtual: data.revpasAtual ?? enterprise.formulas.calcRevPas(data.faturamento, Math.max(1, data.metaFaturamento / 100)),
    revpas7Dias: data.revpas7DiasAtras ?? enterprise.formulas.calcRevPas(data.metaFaturamento, Math.max(1, data.metaFaturamento / 90)),
    revpasDropPercent: enterprise.calcRevPasDropPercent(
      data.revpasAtual ?? enterprise.formulas.calcRevPas(data.faturamento, Math.max(1, data.metaFaturamento / 100)),
      data.revpas7DiasAtras ?? enterprise.formulas.calcRevPas(data.metaFaturamento, Math.max(1, data.metaFaturamento / 90)),
    ),
    slotsVazios: data.slotsVazios ?? 0,
    ticketMedio: data.ticketMedio ?? 0,
  };

  const enterpriseAlerts = enterprise.evaluateAlerts(snapshot);
  const normalized: Alert[] = enterpriseAlerts.map(alert => ({
    id: alert.id,
    priority: alert.severity,
    type: alert.severity === "P1" ? "realtime" : "snapshot",
    title: alert.title,
    message: alert.description,
    kpiName: alert.metricKey,
    currentValue: typeof alert.context?.value === "number" ? alert.context.value : 0,
    targetValue: 0,
    deviationPercent: calculateDeviation(
      typeof alert.context?.value === "number" ? alert.context.value : 0,
      typeof alert.context?.target === "number" ? alert.context.target : 1,
    ),
    financialImpact: alert.financialImpact,
    category: inferCategory(alert.metricKey),
    timestamp: new Date(alert.triggeredAt),
    acknowledged: false,
    resolvedAt: null,
    assignee: null,
  }));

  const ratio = data.cac > 0 ? data.ltv / data.cac : 0;
  if (ratio > 0 && ratio < 2.5) {
    normalized.push({
      id: `ltv-cac-${Date.now()}`,
      priority: ratio < 2 ? "P1" : "P2",
      type: "snapshot",
      title: "LTV/CAC fora da meta",
      message: "Relacao LTV/CAC abaixo do limite recomendado.",
      kpiName: "ltv_cac_ratio",
      currentValue: ratio,
      targetValue: 3,
      deviationPercent: calculateDeviation(ratio, 3),
      financialImpact: null,
      category: "growth",
      timestamp: new Date(),
      acknowledged: false,
      resolvedAt: null,
      assignee: null,
    });
  }

  const order: Record<AlertPriority, number> = { P1: 0, P2: 1, P3: 2 };
  normalized.sort((a, b) => {
    const byPriority = order[a.priority] - order[b.priority];
    if (byPriority !== 0) return byPriority;
    return (b.financialImpact ?? 0) - (a.financialImpact ?? 0);
  });

  return normalized;
}

export function playAlertSound(priority: AlertPriority = "P2"): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.value = priority === "P1" ? 420 : priority === "P2" ? 620 : 820;
    gain.gain.value = priority === "P1" ? 0.12 : priority === "P2" ? 0.08 : 0.05;
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // silent fallback
  }
}

export function getP1Count(alerts: Alert[]): number {
  return alerts.filter(alert => alert.priority === "P1" && !alert.acknowledged).length;
}
