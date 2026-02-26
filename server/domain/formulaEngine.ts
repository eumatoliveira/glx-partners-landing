import { enterprise } from "@shared/controlTowerRules";
import type { ControlTowerFact } from "@shared/types";

export interface FormulaSnapshotInput {
  facts: ControlTowerFact[];
}

export function buildKpiSnapshot(input: FormulaSnapshotInput) {
  return enterprise.buildSnapshot(input.facts);
}

export function calculateCac(investment: number, convertedLeads: number): number {
  if (!Number.isFinite(investment) || !Number.isFinite(convertedLeads) || convertedLeads <= 0) return 0;
  return investment / convertedLeads;
}

export function calculateLtv(ticketMedio: number, frequencia: number, retencao: number, custosVariaveis: number, cac: number): number {
  return enterprise.formulas.calcLtvLiquido(ticketMedio, frequencia, retencao, custosVariaveis, cac);
}

export function calculateNrr(receitaBaseAtual: number, receitaBaseAnterior: number): number {
  return enterprise.formulas.calcNrr(receitaBaseAtual, receitaBaseAnterior);
}

export function calculateRevpas(receitaTotal: number, slotsDisponiveis: number): number {
  return enterprise.formulas.calcRevPas(receitaTotal, slotsDisponiveis);
}

export function calculateOpportunityCost(slotsVazios: number, ticketMedio: number): number {
  return enterprise.formulas.calcCustoOportunidade(slotsVazios, ticketMedio);
}
