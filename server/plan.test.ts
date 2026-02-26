import { describe, expect, it } from "vitest";
import {
  MIN_PLAN_BY_SECTION,
  PLAN_ACCESS,
  getPlanBusinessRulebook,
  canAccessSection,
  getMinPlanForSection,
  hasEnterpriseStructuralAlerts,
  normalizePlanTier,
  type PlanTier,
  type SectionId,
} from "@shared/controlTowerRules";

const ALL_SECTIONS: SectionId[] = [
  "dashboard",
  "realtime",
  "agenda",
  "equipe",
  "sprints",
  "funil",
  "canais",
  "integracoes",
  "dados",
  "relatorios",
  "configuracoes",
  "rede",
  "benchmark_rede",
  "valuation",
  "investidor",
  "governanca",
  "api_bi",
  "qbr",
];

describe("Plan Access Matrix", () => {
  it("uses GLX Control Tower plan matrix (Essencial/Pro/Enterprise) as source of truth", () => {
    expect(PLAN_ACCESS.essencial).toEqual([
      "dashboard",
      "agenda",
      "funil",
      "canais",
      "integracoes",
      "dados",
      "relatorios",
      "configuracoes",
    ]);
    expect(PLAN_ACCESS.pro).toEqual([
      "dashboard",
      "realtime",
      "agenda",
      "equipe",
      "sprints",
      "funil",
      "canais",
      "integracoes",
      "dados",
      "relatorios",
      "configuracoes",
    ]);
    expect(PLAN_ACCESS.enterprise).toEqual([
      "dashboard",
      "realtime",
      "agenda",
      "equipe",
      "sprints",
      "funil",
      "canais",
      "integracoes",
      "dados",
      "relatorios",
      "configuracoes",
      "rede",
      "benchmark_rede",
      "valuation",
      "investidor",
      "governanca",
      "api_bi",
      "qbr",
    ]);
  });

  it("falls back to essencial when plan is invalid", () => {
    expect(normalizePlanTier("unknown")).toBe("essencial");
    expect(normalizePlanTier("start")).toBe("essencial");
    expect(normalizePlanTier("essential")).toBe("essencial");
    expect(normalizePlanTier("entreprise")).toBe("enterprise");
    expect(canAccessSection("unknown", "dashboard")).toBe(true);
    expect(canAccessSection("unknown", "relatorios")).toBe(true);
    expect(canAccessSection("unknown", "equipe")).toBe(false);
    expect(canAccessSection("unknown", "valuation")).toBe(false);
  });

  it("keeps access tiers as supersets (essencial ⊆ pro ⊆ enterprise)", () => {
    for (const section of PLAN_ACCESS.essencial) {
      expect(PLAN_ACCESS.pro).toContain(section);
    }
    for (const section of PLAN_ACCESS.pro) {
      expect(PLAN_ACCESS.enterprise).toContain(section);
    }
  });

  it("keeps integracoes available from essencial (DSH/integration status) onward", () => {
    expect(canAccessSection("essencial", "integracoes")).toBe(true);
    expect(canAccessSection("pro", "integracoes")).toBe(true);
    expect(canAccessSection("enterprise", "integracoes")).toBe(true);
  });

  it("restricts enterprise-only layers to enterprise plan", () => {
    const enterpriseOnly: SectionId[] = ["rede", "benchmark_rede", "valuation", "investidor", "governanca", "api_bi", "qbr"];
    for (const section of enterpriseOnly) {
      expect(canAccessSection("essencial", section)).toBe(false);
      expect(canAccessSection("pro", section)).toBe(false);
      expect(canAccessSection("enterprise", section)).toBe(true);
    }
  });
});

describe("Minimum Plan Mapping", () => {
  it("returns required plan for each dashboard function", () => {
    for (const section of ALL_SECTIONS) {
      expect(getMinPlanForSection(section)).toBe(MIN_PLAN_BY_SECTION[section]);
    }
  });

  it("matches explicit high-impact expectations", () => {
    expect(getMinPlanForSection("dashboard")).toBe("essencial");
    expect(getMinPlanForSection("agenda")).toBe("essencial");
    expect(getMinPlanForSection("relatorios")).toBe("essencial");
    expect(getMinPlanForSection("integracoes")).toBe("essencial");
    expect(getMinPlanForSection("equipe")).toBe("pro");
    expect(getMinPlanForSection("valuation")).toBe("enterprise");
    expect(getMinPlanForSection("investidor")).toBe("enterprise");
  });

  it("enforces access consistency with min-plan policy", () => {
    const rank: Record<PlanTier, number> = { essencial: 0, pro: 1, enterprise: 2 };
    const plans: PlanTier[] = ["essencial", "pro", "enterprise"];

    for (const section of ALL_SECTIONS) {
      const minimum = getMinPlanForSection(section);
      for (const plan of plans) {
        const expected = rank[plan] >= rank[minimum];
        expect(canAccessSection(plan, section)).toBe(expected);
      }
    }
  });
});

describe("Plan Business Rulebook", () => {
  it("separates business logic by plan according to GLX rulebooks", () => {
    const start = getPlanBusinessRulebook("essencial");
    const pro = getPlanBusinessRulebook("pro");
    const enterprise = getPlanBusinessRulebook("enterprise");

    expect(start.commercialLabel).toContain("Essencial");
    expect(start.modules.filter(m => m.layer === "core")).toHaveLength(4);
    expect(start.exports.executivePdf.cadence).toBe("monthly");
    expect(start.dataGovernance.integrationSlaHoursMax).toBe(4);

    expect(pro.inherits).toBe("essencial");
    expect(pro.dashboardMode).toBe("pro_optimization");
    expect(pro.capabilities.forecastBandsP10P50P90).toBe(true);
    expect(pro.capabilities.granularByProfessional).toBe(true);
    expect(pro.capabilities.simulators?.length).toBeGreaterThanOrEqual(4);

    expect(enterprise.inherits).toBe("pro");
    expect(enterprise.dashboardMode).toBe("enterprise_network");
    expect(enterprise.capabilities.multiUnitConsolidation).toBe(true);
    expect(enterprise.capabilities.valuationSuite).toBe(true);
    expect(enterprise.exports.investorPdfOneClick).toBe(true);
    expect(enterprise.exports.qbrQuarterlyAuto).toBe(true);
  });

  it("keeps structural alerts separated in enterprise only", () => {
    expect(hasEnterpriseStructuralAlerts("essencial")).toBe(false);
    expect(hasEnterpriseStructuralAlerts("pro")).toBe(false);
    expect(hasEnterpriseStructuralAlerts("enterprise")).toBe(true);
  });
});
