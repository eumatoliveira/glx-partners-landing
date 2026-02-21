import { describe, expect, it } from "vitest";
import {
  MIN_PLAN_BY_SECTION,
  PLAN_ACCESS,
  canAccessSection,
  getMinPlanForSection,
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
];

describe("Plan Access Matrix", () => {
  it("uses Template A as source of truth", () => {
    expect(PLAN_ACCESS.essencial).toEqual(["dashboard", "dados", "configuracoes"]);
    expect(PLAN_ACCESS.pro).toEqual([
      "dashboard",
      "realtime",
      "agenda",
      "equipe",
      "sprints",
      "funil",
      "canais",
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
    ]);
  });

  it("falls back to essencial when plan is invalid", () => {
    expect(normalizePlanTier("unknown")).toBe("essencial");
    expect(canAccessSection("unknown", "dashboard")).toBe(true);
    expect(canAccessSection("unknown", "relatorios")).toBe(false);
  });

  it("keeps access tiers as supersets (essencial ⊆ pro ⊆ enterprise)", () => {
    for (const section of PLAN_ACCESS.essencial) {
      expect(PLAN_ACCESS.pro).toContain(section);
    }
    for (const section of PLAN_ACCESS.pro) {
      expect(PLAN_ACCESS.enterprise).toContain(section);
    }
  });

  it("blocks integracoes outside enterprise", () => {
    expect(canAccessSection("essencial", "integracoes")).toBe(false);
    expect(canAccessSection("pro", "integracoes")).toBe(false);
    expect(canAccessSection("enterprise", "integracoes")).toBe(true);
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
    expect(getMinPlanForSection("relatorios")).toBe("pro");
    expect(getMinPlanForSection("integracoes")).toBe("enterprise");
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
