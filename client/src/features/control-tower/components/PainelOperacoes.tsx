import { useMemo } from "react";
import type { ControlTowerFact, ControlTowerFilterState } from "@shared/types";
import { calcCustoOportunidade, calcMargemPorMinuto } from "@shared/controlTowerRules";
import type { Language } from "@/i18n";
import type { ControlTowerLocale } from "@/lib/controlTowerLocale";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { Panel } from "./shared";
import FormulaTooltip from "./FormulaTooltip";

interface PainelOperacoesProps {
  language: Language;
  locale: ControlTowerLocale;
  facts: ControlTowerFact[];
  onDrillDown: (partial: Partial<ControlTowerFilterState>) => void;
}

export default function PainelOperacoes({ language, locale, facts, onDrillDown }: PainelOperacoesProps) {
  const metrics = useMemo(() => {
    const slotsVazios = facts.reduce((sum, row) => sum + row.slotsEmpty, 0);
    const ticketHistorico = facts.length === 0 ? 0 : facts.reduce((sum, row) => sum + row.ticketMedio, 0) / facts.length;
    const custoOportunidade = calcCustoOportunidade(slotsVazios, ticketHistorico);

    const margemMinuto = facts.length === 0
      ? 0
      : facts.reduce((sum, row) => sum + calcMargemPorMinuto(row.ticketMedio, row.custoVariavel, row.durationMinutes || 1), 0) / facts.length;

    const oee = facts.length === 0
      ? 0
      : facts.reduce((sum, row) => {
          const disponibilidade = row.slotsAvailable === 0 ? 0 : ((row.slotsAvailable - row.slotsEmpty) / row.slotsAvailable);
          const performance = row.durationMinutes === 0 ? 0 : Math.min(1, 45 / row.durationMinutes);
          const qualidade = row.status === "realizado" ? 1 : 0.65;
          return sum + (disponibilidade * performance * qualidade);
        }, 0) / facts.length * 100;

    const shrinkage = facts.length === 0 ? 0 : (facts.filter(row => row.status !== "realizado").length / facts.length) * 100;

    const heatmap = Array.from({ length: 12 }, (_, index) => {
      const hour = index + 8;
      const windowFacts = facts.filter(row => new Date(row.timestamp).getHours() === hour);
      const occupancy = windowFacts.reduce((sum, row) => {
        if (row.slotsAvailable === 0) return sum;
        return sum + ((row.slotsAvailable - row.slotsEmpty) / row.slotsAvailable) * 100;
      }, 0);
      const avg = windowFacts.length === 0 ? 0 : occupancy / windowFacts.length;
      return { hour, occupancy: avg };
    });

    return {
      custoOportunidade,
      margemMinuto,
      oee,
      shrinkage,
      heatmap,
    };
  }, [facts]);

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <Panel title={locale.operations.opportunityCost} metricKey="custo_oportunidade" language={language}>
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">{locale.operations.opportunityCost}</p>
          <p className="text-3xl font-semibold text-orange-300">{formatCurrency(metrics.custoOportunidade)}</p>
        </div>
      </Panel>

      <Panel title={locale.operations.marginMinute} metricKey="margem_por_minuto" language={language}>
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <p className="text-xs text-slate-400">{locale.operations.marginMinute}</p>
          <p className="text-3xl font-semibold text-cyan-300">{formatCurrency(metrics.margemMinuto)}</p>
        </div>
      </Panel>

      <Panel title={locale.operations.occupancyHeatmap} metricKey="heatmap_ocupacao" language={language}>
        <div className="grid grid-cols-4 gap-2">
          {metrics.heatmap.map(cell => {
            const intensity = Math.min(100, Math.max(0, cell.occupancy));
            return (
              <button
                key={cell.hour}
                type="button"
                onClick={() => onDrillDown({ status: intensity < 55 ? "agendado" : undefined })}
                className="rounded-lg border border-slate-800 px-2 py-3 text-center text-xs"
                style={{ backgroundColor: `rgba(249, 115, 22, ${0.15 + (intensity / 100) * 0.65})` }}
              >
                <p className="font-semibold text-slate-100">{cell.hour}:00</p>
                <p className="text-slate-200">{cell.occupancy.toFixed(0)}%</p>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title={locale.operations.oee} metricKey="mapa_vazamentos_ociosidade" language={language}>
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-slate-400">{locale.operations.oee}</p>
              <FormulaTooltip metricKey="mapa_vazamentos_ociosidade" language={language} />
            </div>
            <p className="text-xl font-semibold text-emerald-300">{formatPercent(metrics.oee)}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs text-slate-400">{locale.operations.shrinkage}</p>
              <FormulaTooltip metricKey="impacto_financeiro" language={language} />
            </div>
            <p className="text-xl font-semibold text-red-300">{formatPercent(metrics.shrinkage)}</p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
