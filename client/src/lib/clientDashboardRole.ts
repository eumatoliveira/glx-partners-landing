import { isPlanAtLeast, type PlanTier } from "@shared/controlTowerRules";

export type ClientDashboardRole = "CEO" | "MANAGER" | "OPERATIONAL" | "TECHNICAL";

export type ClientDashboardRoute =
  | "ceo"
  | "gestor"
  | "operacional"
  | "warroom"
  | "financeiro"
  | "operacoes"
  | "growth"
  | "qualidade"
  | "equipe"
  | "ingestao";

const ROLE_PATH_BY_ROLE: Record<ClientDashboardRole, string> = {
  CEO: "/ceo",
  MANAGER: "/gestor",
  OPERATIONAL: "/operacional",
  TECHNICAL: "/integracoes",
};

const ROLE_ALIASES: Record<string, ClientDashboardRole> = {
  ceo: "CEO",
  owner: "CEO",
  executivo: "CEO",
  executive: "CEO",
  manager: "MANAGER",
  gestor: "MANAGER",
  tatico: "MANAGER",
  tactical: "MANAGER",
  operational: "OPERATIONAL",
  operacional: "OPERATIONAL",
  ops: "OPERATIONAL",
  operador: "OPERATIONAL",
  technical: "TECHNICAL",
  tecnico: "TECHNICAL",
  tech: "TECHNICAL",
  bi: "TECHNICAL",
  data: "TECHNICAL",
};

interface UserLike {
  email?: string | null;
  plan?: string | null;
  dashboardRole?: string | null;
  profileRole?: string | null;
  metadata?: unknown;
}

function normalizeRoleCandidate(value: unknown): ClientDashboardRole | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return ROLE_ALIASES[normalized] ?? null;
}

function parseRoleOverridesEnv(): Record<string, ClientDashboardRole> {
  const raw = import.meta.env.VITE_CLIENT_DASHBOARD_ROLE_MAP;
  if (!raw || typeof raw !== "string") return {};

  return raw
    .split(",")
    .map(entry => entry.trim())
    .filter(Boolean)
    .reduce<Record<string, ClientDashboardRole>>((acc, entry) => {
      const [emailPart, rolePart] = entry.split(":").map(item => item.trim());
      if (!emailPart || !rolePart) return acc;
      const role = normalizeRoleCandidate(rolePart);
      if (!role) return acc;
      acc[emailPart.toLowerCase()] = role;
      return acc;
    }, {});
}

const roleOverridesByEmail = parseRoleOverridesEnv();

function extractMetadataRole(metadata: unknown): ClientDashboardRole | null {
  if (!metadata || typeof metadata !== "object") return null;
  const record = metadata as Record<string, unknown>;
  return (
    normalizeRoleCandidate(record.dashboardRole) ??
    normalizeRoleCandidate(record.profileRole) ??
    normalizeRoleCandidate(record.role)
  );
}

function fallbackRoleFromPlan(plan: string | null | undefined): ClientDashboardRole {
  if (plan === "enterprise") return "CEO";
  if (plan === "pro") return "MANAGER";
  return "OPERATIONAL";
}

function inferRoleFromEmail(email: string | null | undefined): ClientDashboardRole | null {
  if (!email) return null;
  const normalized = email.toLowerCase();
  if (
    normalized.includes("tech") ||
    normalized.includes("tecnico") ||
    normalized.includes("bi@") ||
    normalized.includes(".bi@") ||
    normalized.includes("dados")
  ) {
    return "TECHNICAL";
  }
  if (normalized.includes("ceo") || normalized.includes("owner") || normalized.includes("diret")) {
    return "CEO";
  }
  if (normalized.includes("gestor") || normalized.includes("manager") || normalized.includes("coorden")) {
    return "MANAGER";
  }
  if (normalized.includes("oper") || normalized.includes("assist")) {
    return "OPERATIONAL";
  }
  return null;
}

export function resolveClientDashboardRole(user: UserLike | null | undefined): ClientDashboardRole {
  if (!user) return "OPERATIONAL";

  const explicitRole =
    normalizeRoleCandidate(user.dashboardRole) ??
    normalizeRoleCandidate(user.profileRole) ??
    extractMetadataRole(user.metadata);
  if (explicitRole) return explicitRole;

  const email = user.email?.toLowerCase();
  if (email && roleOverridesByEmail[email]) {
    return roleOverridesByEmail[email];
  }

  const inferredByEmail = inferRoleFromEmail(user.email);
  if (inferredByEmail) return inferredByEmail;

  return fallbackRoleFromPlan(user.plan);
}

export function getDefaultDashboardPathByRole(role: ClientDashboardRole): string {
  return ROLE_PATH_BY_ROLE[role];
}

export function canAccessWarRoom(role: ClientDashboardRole): boolean {
  return role === "CEO" || role === "MANAGER";
}

export type ClientDomainModule =
  | "ceo"
  | "warroom"
  | "financeiro"
  | "operacoes"
  | "growth"
  | "qualidade"
  | "equipe"
  | "ingestao";

const MIN_PLAN_BY_CLIENT_DOMAIN: Record<ClientDomainModule, PlanTier> = {
  ceo: "essencial",
  warroom: "pro",
  financeiro: "essencial",
  operacoes: "essencial",
  growth: "essencial",
  qualidade: "essencial",
  equipe: "pro",
  ingestao: "essencial",
};

export function canAccessClientDomain(
  role: ClientDashboardRole,
  module: ClientDomainModule,
  plan?: string | null,
): boolean {
  if (!isPlanAtLeast(plan, MIN_PLAN_BY_CLIENT_DOMAIN[module])) return false;

  if (module === "ingestao") return role === "TECHNICAL" || role === "CEO" || role === "MANAGER";
  if (module === "warroom") return canAccessWarRoom(role);
  if (module === "ceo") return role === "CEO";
  if (module === "financeiro" || module === "operacoes" || module === "qualidade" || module === "equipe") {
    return role === "CEO" || role === "MANAGER";
  }
  if (module === "growth") {
    return role === "CEO" || role === "MANAGER";
  }
  return false;
}
