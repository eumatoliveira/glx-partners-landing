/**
 * GLX Control Tower — Alert Engine
 * Classifies KPI data into P1 (Critical), P2 (Warning), P3 (Monitor) alerts
 * Based on threshold rules from Control Tower Blueprint
 */

export type AlertPriority = 'P1' | 'P2' | 'P3';
export type AlertType = 'snapshot' | 'realtime';

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
  category: 'financial' | 'operational' | 'quality' | 'growth';
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt: Date | null;
  assignee: string | null;
}

export interface KPIData {
  noShowRate: number;       // % (0-100)
  margemLiquida: number;    // % (0-100)
  nps: number;              // 0-10
  faturamento: number;      // R$
  metaFaturamento: number;  // R$
  churnRate: number;        // % (0-100)
  fluxoCaixa: number;       // R$ (can be negative)
  occupancyRate: number;    // % (0-100)
  cac: number;              // R$
  ltv: number;              // R$
}

// Category weights for priority scoring
const CATEGORY_WEIGHTS: Record<string, number> = {
  'Fluxo de Caixa': 3,
  'Margem Líquida': 3,
  'Faturamento': 3,
  'No-Show': 2,
  'CAC': 2,
  'NPS': 2,
  'Churn': 2,
  'Ocupação': 1,
};

function generateId(): string {
  return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
}

function calculateDeviation(current: number, target: number): number {
  if (target === 0) return 0;
  return ((current - target) / target) * 100;
}

/**
 * Classify KPI data into prioritized alerts
 */
export function classifyAlerts(data: KPIData): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();

  // ─── No-Show Rate ───
  if (data.noShowRate > 25) {
    alerts.push({
      id: generateId(), priority: 'P1', type: 'snapshot',
      title: 'No-Show Crítico', kpiName: 'No-Show',
      message: `Taxa de no-show em ${data.noShowRate.toFixed(1)}% — acima do limite crítico de 25%. Impacto direto na receita.`,
      currentValue: data.noShowRate, targetValue: 10, deviationPercent: calculateDeviation(data.noShowRate, 10),
      financialImpact: data.faturamento * (data.noShowRate / 100) * 0.3,
      category: 'operational', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
    });
  } else if (data.noShowRate > 15) {
    alerts.push({
      id: generateId(), priority: 'P2', type: 'snapshot',
      title: 'No-Show Elevado', kpiName: 'No-Show',
      message: `Taxa de no-show em ${data.noShowRate.toFixed(1)}% — zona de atenção (>15%).`,
      currentValue: data.noShowRate, targetValue: 10, deviationPercent: calculateDeviation(data.noShowRate, 10),
      financialImpact: data.faturamento * (data.noShowRate / 100) * 0.15,
      category: 'operational', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
    });
  } else if (data.noShowRate > 5) {
    alerts.push({
      id: generateId(), priority: 'P3', type: 'snapshot',
      title: 'No-Show a Monitorar', kpiName: 'No-Show',
      message: `Taxa de no-show em ${data.noShowRate.toFixed(1)}% — primeiro desvio identificado.`,
      currentValue: data.noShowRate, targetValue: 5, deviationPercent: calculateDeviation(data.noShowRate, 5),
      financialImpact: null, category: 'operational', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
    });
  }

  // ─── Margem Líquida ───
  if (data.margemLiquida < 12) {
    alerts.push({
      id: generateId(), priority: 'P1', type: 'snapshot',
      title: 'Margem Líquida Crítica', kpiName: 'Margem Líquida',
      message: `Margem líquida em ${data.margemLiquida.toFixed(1)}% — abaixo de 12%. Revisar estrutura de custos imediatamente.`,
      currentValue: data.margemLiquida, targetValue: 18, deviationPercent: calculateDeviation(data.margemLiquida, 18),
      financialImpact: data.faturamento * ((18 - data.margemLiquida) / 100),
      category: 'financial', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
    });
  } else if (data.margemLiquida < 15) {
    alerts.push({
      id: generateId(), priority: 'P2', type: 'snapshot',
      title: 'Margem Líquida Abaixo da Meta', kpiName: 'Margem Líquida',
      message: `Margem líquida em ${data.margemLiquida.toFixed(1)}% — zona amarela (meta: 18%).`,
      currentValue: data.margemLiquida, targetValue: 18, deviationPercent: calculateDeviation(data.margemLiquida, 18),
      financialImpact: data.faturamento * ((18 - data.margemLiquida) / 100),
      category: 'financial', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
    });
  }

  // ─── NPS ───
  if (data.nps < 7.5) {
    alerts.push({
      id: generateId(), priority: 'P1', type: 'snapshot',
      title: 'NPS Crítico', kpiName: 'NPS',
      message: `NPS em ${data.nps.toFixed(1)} — abaixo do limite mínimo de 7.5. Risco reputacional.`,
      currentValue: data.nps, targetValue: 8.5, deviationPercent: calculateDeviation(data.nps, 8.5),
      financialImpact: null, category: 'quality', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
    });
  }

  // ─── Fluxo de Caixa ───
  if (data.fluxoCaixa < 0) {
    alerts.push({
      id: generateId(), priority: 'P1', type: 'realtime',
      title: 'Fluxo de Caixa Negativo', kpiName: 'Fluxo de Caixa',
      message: `Fluxo de caixa em R$ ${data.fluxoCaixa.toLocaleString('pt-BR')} — situação crítica.`,
      currentValue: data.fluxoCaixa, targetValue: 0, deviationPercent: -100,
      financialImpact: Math.abs(data.fluxoCaixa),
      category: 'financial', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
    });
  }

  // ─── Faturamento vs Meta ───
  const fatDeviation = calculateDeviation(data.faturamento, data.metaFaturamento);
  if (fatDeviation < -30) {
    alerts.push({
      id: generateId(), priority: 'P1', type: 'snapshot',
      title: 'Faturamento Muito Abaixo da Meta', kpiName: 'Faturamento',
      message: `Faturamento ${Math.abs(fatDeviation).toFixed(0)}% abaixo da meta. Gap: R$ ${(data.metaFaturamento - data.faturamento).toLocaleString('pt-BR')}.`,
      currentValue: data.faturamento, targetValue: data.metaFaturamento, deviationPercent: fatDeviation,
      financialImpact: data.metaFaturamento - data.faturamento,
      category: 'financial', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
    });
  } else if (fatDeviation < -15) {
    alerts.push({
      id: generateId(), priority: 'P2', type: 'snapshot',
      title: 'Faturamento Abaixo da Meta', kpiName: 'Faturamento',
      message: `Faturamento ${Math.abs(fatDeviation).toFixed(0)}% abaixo da meta mensal.`,
      currentValue: data.faturamento, targetValue: data.metaFaturamento, deviationPercent: fatDeviation,
      financialImpact: data.metaFaturamento - data.faturamento,
      category: 'financial', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
    });
  }

  // ─── Churn ───
  if (data.churnRate > 8) {
    alerts.push({
      id: generateId(), priority: 'P2', type: 'snapshot',
      title: 'Churn Elevado', kpiName: 'Churn',
      message: `Churn rate em ${data.churnRate.toFixed(1)}% — acima de 8%. Avaliar retenção.`,
      currentValue: data.churnRate, targetValue: 5, deviationPercent: calculateDeviation(data.churnRate, 5),
      financialImpact: null, category: 'growth', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
    });
  }

  // ─── LTV/CAC Ratio ───
  if (data.cac > 0 && data.ltv > 0) {
    const ratio = data.ltv / data.cac;
    if (ratio < 3) {
      alerts.push({
        id: generateId(), priority: ratio < 2 ? 'P1' : 'P2', type: 'snapshot',
        title: 'LTV/CAC Baixo', kpiName: 'LTV/CAC',
        message: `Ratio LTV/CAC em ${ratio.toFixed(1)}x — ${ratio < 2 ? 'abaixo do mínimo' : 'atenção'} (meta: ≥3x).`,
        currentValue: ratio, targetValue: 3, deviationPercent: calculateDeviation(ratio, 3),
        financialImpact: null, category: 'growth', timestamp: now, acknowledged: false, resolvedAt: null, assignee: null,
      });
    }
  }

  // Sort by priority score (P1 first, then by financial impact)
  const priorityOrder: Record<AlertPriority, number> = { P1: 0, P2: 1, P3: 2 };
  alerts.sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    // Higher financial impact first
    return (b.financialImpact ?? 0) - (a.financialImpact ?? 0);
  });

  return alerts;
}

/**
 * Play alert sound using Web Audio API (no file dependency)
 */
export function playAlertSound(priority: AlertPriority = 'P2'): void {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (priority === 'P1') {
      osc.frequency.value = 440;
      osc.type = 'sine';
      gain.gain.value = 0.15;
    } else if (priority === 'P2') {
      osc.frequency.value = 660;
      osc.type = 'sine';
      gain.gain.value = 0.08;
    } else {
      osc.frequency.value = 880;
      osc.type = 'sine';
      gain.gain.value = 0.04;
    }

    // Fade out
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch {
    // Audio not available — silent fail
  }
}

/**
 * Count active P1 alerts — used for "War Room" mode detection
 */
export function getP1Count(alerts: Alert[]): number {
  return alerts.filter(a => a.priority === 'P1' && !a.acknowledged).length;
}
