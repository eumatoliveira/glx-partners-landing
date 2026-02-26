import type { AlertEvent, ControlTowerFact, ControlTowerFilterState, IngestionParsedRow, RcaRecord } from "@shared/types";

export type {
  AlertEvent,
  ControlTowerFact,
  ControlTowerFilterState,
  IngestionParsedRow,
  RcaRecord,
};

export interface ControlTowerDashboardResponse {
  filters: ControlTowerFilterState;
  facts: ControlTowerFact[];
  snapshot: {
    margemLiquida: number;
    taxaNoshow: number;
    impactoFinanceiro: number;
    revpasAtual: number;
    revpas7Dias: number;
    revpasDropPercent: number;
    slotsVazios: number;
    ticketMedio: number;
  };
  alerts: AlertEvent[];
  rca: RcaRecord[];
}

export interface DashboardModuleProps {
  facts: ControlTowerFact[];
  onDrillDown: (partial: Partial<ControlTowerFilterState>) => void;
}
