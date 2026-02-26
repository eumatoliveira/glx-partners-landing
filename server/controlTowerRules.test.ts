import { describe, expect, it } from "vitest";
import {
  calcImpactoFinanceiro,
  calcRevPasDropPercent,
  detectRevPasDrop7d,
  enterprise,
} from "@shared/controlTowerRules";
import type { ControlTowerFact } from "@shared/types";

function makeFact(partial: Partial<ControlTowerFact>): ControlTowerFact {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    channel: "meta",
    professional: "Ana",
    procedure: "Consulta",
    status: "realizado",
    entries: 500,
    exits: 180,
    slotsAvailable: 20,
    slotsEmpty: 4,
    ticketMedio: 380,
    custoVariavel: 120,
    durationMinutes: 45,
    materialList: ["resina"],
    waitMinutes: 15,
    npsScore: 88,
    baseOldRevenueCurrent: 20000,
    baseOldRevenuePrevious: 24000,
    revenueValue: 320,
    ...partial,
  };
}

describe("enterprise math rules", () => {
  it("calculates financial impact strictly", () => {
    expect(calcImpactoFinanceiro(12, 420)).toBe(5040);
  });

  it("detects RevPAS drop in 7 days", () => {
    const drop = calcRevPasDropPercent(65, 100);
    expect(drop).toBeCloseTo(35, 5);
    expect(detectRevPasDrop7d(65, 100)).toBe(true);
    expect(detectRevPasDrop7d(90, 100)).toBe(false);
  });

  it("classifies P1 alerts when critical thresholds are crossed", () => {
    const facts: ControlTowerFact[] = [
      ...Array.from({ length: 8 }, (_, idx) =>
        makeFact({
          id: `old-${idx}`,
          timestamp: new Date(Date.now() - (8 - idx) * 86_400_000).toISOString(),
          revenueValue: 600,
          slotsAvailable: 10,
          slotsEmpty: 1,
          status: "realizado",
          entries: 900,
          exits: 600,
        })),
      ...Array.from({ length: 7 }, (_, idx) =>
        makeFact({
          id: `new-${idx}`,
          timestamp: new Date(Date.now() - idx * 86_400_000).toISOString(),
          revenueValue: 90,
          slotsAvailable: 10,
          slotsEmpty: 12,
          status: "noshow",
          entries: 200,
          exits: 260,
        })),
    ];

    const snapshot = enterprise.buildSnapshot(facts);
    const alerts = enterprise.evaluateAlerts(snapshot);

    expect(snapshot.taxaNoshow).toBeGreaterThan(25);
    expect(snapshot.impactoFinanceiro).toBeGreaterThan(5000);
    expect(snapshot.revpasDropPercent).toBeGreaterThan(15);
    expect(alerts.some(alert => alert.severity === "P1")).toBe(true);
  });
});
