import { useMemo } from "react";
import type { ControlTowerFact, ControlTowerFilterState } from "@shared/types";
import type { Language } from "@/i18n";
import type { ControlTowerLocale } from "@/lib/controlTowerLocale";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { Panel } from "./shared";
import FormulaTooltip from "./FormulaTooltip";

interface PainelEquipeProps {
  language: Language;
  locale: ControlTowerLocale;
  facts: ControlTowerFact[];
  onDrillDown: (partial: Partial<ControlTowerFilterState>) => void;
}

export default function PainelEquipe({ language, locale, facts, onDrillDown }: PainelEquipeProps) {
  const professionals = useMemo(() => {
    const map = facts.reduce<Record<string, {
      professional: string;
      faturamento: number;
      total: number;
      realizados: number;
      noShow: number;
      npsSum: number;
      atendimentoMin: number;
      cadeiraVaziaMin: number;
      atrasadoMin: number;
    }>>((acc, row) => {
      if (!acc[row.professional]) {
        acc[row.professional] = {
          professional: row.professional,
          faturamento: 0,
          total: 0,
          realizados: 0,
          noShow: 0,
          npsSum: 0,
          atendimentoMin: 0,
          cadeiraVaziaMin: 0,
          atrasadoMin: 0,
        };
      }
      const item = acc[row.professional]!;
      item.faturamento += row.revenueValue;
      item.total += 1;
      if (row.status === "realizado") item.realizados += 1;
      if (row.status === "noshow") item.noShow += 1;
      item.npsSum += row.npsScore;
      item.atendimentoMin += row.durationMinutes;
      item.cadeiraVaziaMin += row.slotsEmpty * 6;
      item.atrasadoMin += Math.max(0, row.waitMinutes - 5);
      return acc;
    }, {});

    return Object.values(map).map(item => {
      const taxaRetorno = item.total === 0 ? 0 : (item.realizados / item.total) * 100;
      const assiduidade = item.total === 0 ? 0 : 100 - (item.noShow / item.total) * 100;
      const npsIndividual = item.total === 0 ? 0 : item.npsSum / item.total;
      return {
        ...item,
        taxaRetorno,
        assiduidade,
        npsIndividual,
      };
    });
  }, [facts]);

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <Panel title={locale.team.multifactor} metricKey="multifatorial_equipe" language={language}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="pb-2">{locale.labels.professional}</th>
                <th className="pb-2">
                  {locale.labels.revenue}
                  <FormulaTooltip className="ml-1 inline-block align-middle" metricKey="multifatorial_equipe" language={language} />
                </th>
                <th className="pb-2">{locale.labels.returnRate}</th>
                <th className="pb-2">{locale.labels.attendance}</th>
                <th className="pb-2">{locale.labels.nps}</th>
              </tr>
            </thead>
            <tbody>
              {professionals.map(item => (
                <tr key={item.professional} className="border-t border-slate-800 text-slate-200">
                  <td className="py-2">
                    <button type="button" onClick={() => onDrillDown({ professional: item.professional })} className="hover:text-orange-300">
                      {item.professional}
                    </button>
                  </td>
                  <td className="py-2">{formatCurrency(item.faturamento)}</td>
                  <td className="py-2">{formatPercent(item.taxaRetorno)}</td>
                  <td className="py-2">{formatPercent(item.assiduidade)}</td>
                  <td className="py-2">{item.npsIndividual.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={locale.team.idleByProfessional} metricKey="ociosidade_profissional" language={language}>
        <div className="space-y-3">
          {professionals.map(item => {
            const total = item.atendimentoMin + item.cadeiraVaziaMin + item.atrasadoMin;
            const atendimentoWidth = total === 0 ? 0 : (item.atendimentoMin / total) * 100;
            const vazioWidth = total === 0 ? 0 : (item.cadeiraVaziaMin / total) * 100;
            const atrasadoWidth = total === 0 ? 0 : (item.atrasadoMin / total) * 100;
            return (
              <button
                key={item.professional}
                type="button"
                onClick={() => onDrillDown({ professional: item.professional })}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-left"
              >
                <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                  <span>{item.professional}</span>
                  <span>{Math.round(total)} {locale.labels.minutes}</span>
                </div>
                <div className="flex h-3 overflow-hidden rounded-full bg-slate-800">
                  <div className="bg-emerald-400" style={{ width: `${atendimentoWidth}%` }} />
                  <div className="bg-yellow-400" style={{ width: `${vazioWidth}%` }} />
                  <div className="bg-red-400" style={{ width: `${atrasadoWidth}%` }} />
                </div>
              </button>
            );
          })}
        </div>
      </Panel>
    </div>
  );
}
