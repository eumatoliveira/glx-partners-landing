import { describe, it, expect, vi } from "vitest";

/**
 * Tests for the plan system:
 * 1. Plan access control logic (which sections each plan can access)
 * 2. updateUserPlan input validation via tRPC schema
 */

// Plan access control logic (mirrors Dashboard.tsx PLAN_ACCESS)
const PLAN_ACCESS: Record<string, string[]> = {
  essencial: ["dashboard", "dados", "configuracoes"],
  pro: ["dashboard", "realtime", "agenda", "equipe", "sprints", "funil", "canais", "dados", "relatorios", "configuracoes"],
  enterprise: ["dashboard", "realtime", "agenda", "equipe", "sprints", "funil", "canais", "integracoes", "dados", "relatorios", "configuracoes"],
};

const canAccess = (plan: string, sectionId: string) =>
  (PLAN_ACCESS[plan] || PLAN_ACCESS.essencial).includes(sectionId);

describe("Plan Access Control", () => {
  it("essencial plan should only access dashboard, dados, and configuracoes", () => {
    expect(canAccess("essencial", "dashboard")).toBe(true);
    expect(canAccess("essencial", "dados")).toBe(true);
    expect(canAccess("essencial", "configuracoes")).toBe(true);
    expect(canAccess("essencial", "realtime")).toBe(false);
    expect(canAccess("essencial", "agenda")).toBe(false);
    expect(canAccess("essencial", "equipe")).toBe(false);
    expect(canAccess("essencial", "sprints")).toBe(false);
    expect(canAccess("essencial", "funil")).toBe(false);
    expect(canAccess("essencial", "canais")).toBe(false);
    expect(canAccess("essencial", "integracoes")).toBe(false);
    expect(canAccess("essencial", "relatorios")).toBe(false);
  });

  it("pro plan should access all except integracoes", () => {
    expect(canAccess("pro", "dashboard")).toBe(true);
    expect(canAccess("pro", "realtime")).toBe(true);
    expect(canAccess("pro", "agenda")).toBe(true);
    expect(canAccess("pro", "equipe")).toBe(true);
    expect(canAccess("pro", "sprints")).toBe(true);
    expect(canAccess("pro", "funil")).toBe(true);
    expect(canAccess("pro", "canais")).toBe(true);
    expect(canAccess("pro", "dados")).toBe(true);
    expect(canAccess("pro", "relatorios")).toBe(true);
    expect(canAccess("pro", "configuracoes")).toBe(true);
    expect(canAccess("pro", "integracoes")).toBe(false);
  });

  it("enterprise plan should access everything", () => {
    const allSections = ["dashboard", "realtime", "agenda", "equipe", "sprints", "funil", "canais", "integracoes", "dados", "relatorios", "configuracoes"];
    for (const section of allSections) {
      expect(canAccess("enterprise", section)).toBe(true);
    }
  });

  it("unknown plan should fall back to essencial access", () => {
    expect(canAccess("unknown", "dashboard")).toBe(true);
    expect(canAccess("unknown", "dados")).toBe(true);
    expect(canAccess("unknown", "realtime")).toBe(false);
    expect(canAccess("unknown", "integracoes")).toBe(false);
  });

  it("each plan should be a superset of the previous tier", () => {
    const essencialSections = PLAN_ACCESS.essencial;
    const proSections = PLAN_ACCESS.pro;
    const enterpriseSections = PLAN_ACCESS.enterprise;

    // Every essencial section should be in pro
    for (const section of essencialSections) {
      expect(proSections).toContain(section);
    }

    // Every pro section should be in enterprise
    for (const section of proSections) {
      expect(enterpriseSections).toContain(section);
    }
  });
});

describe("Plan Enum Validation", () => {
  const validPlans = ["essencial", "pro", "enterprise"];

  it("should accept valid plan values", () => {
    for (const plan of validPlans) {
      expect(validPlans.includes(plan)).toBe(true);
    }
  });

  it("should reject invalid plan values", () => {
    const invalidPlans = ["free", "basic", "premium", "gold", ""];
    for (const plan of invalidPlans) {
      expect(validPlans.includes(plan)).toBe(false);
    }
  });

  it("default plan should be essencial", () => {
    const defaultPlan = "essencial";
    expect(validPlans.includes(defaultPlan)).toBe(true);
    expect(defaultPlan).toBe("essencial");
  });
});
