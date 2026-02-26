import { useCallback, useMemo } from "react";
import { enterprise } from "@shared/controlTowerRules";
import type { AlertEvent, AlertSeverity, ControlTowerFact } from "@shared/types";

export interface RcaDraftPayload {
  alertId: string;
  severity: AlertSeverity;
  title: string;
  rootCause: string;
  actionPlan: string;
  owner: string;
  dueDate: string;
  status: "open";
}

function severityRank(severity: AlertSeverity) {
  if (severity === "P1") return 3;
  if (severity === "P2") return 2;
  return 1;
}

export function useAlertEngine(facts: ControlTowerFact[]) {
  const snapshot = useMemo(() => enterprise.buildSnapshot(facts), [facts]);
  const alerts = useMemo(() => enterprise.evaluateAlerts(snapshot), [snapshot]);

  const highestSeverity = useMemo<AlertSeverity>(() => {
    if (alerts.length === 0) return "P3";
    return [...alerts]
      .sort((a, b) => severityRank(b.severity) - severityRank(a.severity))[0]!
      .severity;
  }, [alerts]);

  const generateRCA = useCallback((alert: AlertEvent): RcaDraftPayload => {
    const due = new Date();
    due.setDate(due.getDate() + 7);
    return {
      alertId: alert.id,
      severity: alert.severity,
      title: alert.title,
      rootCause: "",
      actionPlan: "",
      owner: "",
      dueDate: due.toISOString().slice(0, 10),
      status: "open",
    };
  }, []);

  return {
    snapshot,
    alerts,
    highestSeverity,
    generateRCA,
  };
}
