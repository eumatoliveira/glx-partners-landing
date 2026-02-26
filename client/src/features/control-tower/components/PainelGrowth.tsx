import { useMemo } from "react";
import type { ControlTowerFact, ControlTowerFilterState } from "@shared/types";
import { calcLtvLiquido, calcNrr, calcPaybackCac } from "@shared/controlTowerRules";
import type { Language } from "@/i18n";
import type { ControlTowerLocale } from "@/lib/controlTowerLocale";
import { formatCurrency, formatPercent } from "../utils/formatters";
import { Panel } from "./shared";

interface PainelGrowthProps {
  language: Language;
  locale: ControlTowerLocale;
  facts: ControlTowerFact[];
  onDrillDown: (partial: Partial<ControlTowerFilterState>) => void;
}

export default function PainelGrowth({ language, locale, facts, onDrillDown }: PainelGrowthProps) {
  const data = useMemo(() => {
    const channelMap = facts.reduce<Record<string, { channel: string; investment: number; revenue: number }>>((acc, row) => {
      if (!acc[row.channel]) {
        acc[row.channel] = { channel: row.channel, investment: 0, revenue: 0 };
      }
      acc[row.channel]!.investment += row.exits;
      acc[row.channel]!.revenue += row.revenueValue;
      return acc;
    }, {});

    const attribution = Object.values(channelMap).map(item => ({
      ...item,
      roi: item.investment === 0 ? 0 : ((item.revenue - item.investment) / item.investment) * 100,
    }));

    const impressions = Math.max(1, facts.length * 20);
    const leads = Math.max(1, Math.round(impressions * 0.18));
    const agendados = facts.filter(row => row.status === "agendado" || row.status === "realizado").length;
    const realizados = facts.filter(row => row.status === "realizado").length;

    const investimentoTotal = attribution.reduce((sum, item) => sum + item.investment, 0);
    const cac = investimentoTotal / Math.max(1, leads);
    const margemContribuicao = facts.length === 0 ? 0 : facts.reduce((sum, row) => sum + (row.ticketMedio - row.custoVariavel), 0) / facts.length;
    const payback = calcPaybackCac(cac, Math.max(1, margemContribuicao));

    const ticketMedio = facts.length === 0 ? 0 : facts.reduce((sum, row) => sum + row.ticketMedio, 0) / facts.length;
    const frequencia = 2.1;
    const retencao = 0.82;
    const custosVariaveis = facts.length === 0 ? 0 : facts.reduce((sum, row) => sum + row.custoVariavel, 0) / facts.length;
    const ltvLiquido = calcLtvLiquido(ticketMedio, frequencia, retencao, custosVariaveis, cac);

    const receitaAtualBase = facts.reduce((sum, row) => sum + row.baseOldRevenueCurrent, 0);
    const receitaAnteriorBase = facts.reduce((sum, row) => sum + row.baseOldRevenuePrevious, 0);
    const nrr = calcNrr(receitaAtualBase, Math.max(1, receitaAnteriorBase));

    return {
      funnel: [
        { label: locale.labels.impressions, value: impressions },
        { label: locale.labels.leads, value: leads },
        { label: locale.labels.scheduled, value: agendados },
        { label: locale.labels.completed, value: realizados },
      ],
      payback,
      ltvLiquido,
      nrr,
      attribution,
    };
  }, [facts, locale.labels.completed, locale.labels.impressions, locale.labels.leads, locale.labels.scheduled]);

  const funnelMax = Math.max(...data.funnel.map(step => step.value), 1);

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <Panel title={locale.growth.funnel} metricKey="funnel_matematico" language={language}>
        <div className="space-y-3">
          {data.funnel.map(step => (
            <div key={step.label}>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                <span>{step.label}</span>
                <span>{step.value}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-cyan-400" style={{ width: `${(step.value / funnelMax) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title={locale.growth.payback} metricKey="payback_cac" language={language}>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-xs text-slate-400">{locale.growth.payback}</p>
            <p className="text-xl font-semibold text-orange-300">{data.payback.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-xs text-slate-400">{locale.growth.ltv}</p>
            <p className="text-xl font-semibold text-cyan-300">{formatCurrency(data.ltvLiquido)}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-xs text-slate-400">{locale.growth.nrr}</p>
            <p className="text-xl font-semibold text-emerald-300">{formatPercent(data.nrr)}</p>
          </div>
        </div>
      </Panel>

      <Panel title={locale.growth.attribution} metricKey="nrr" language={language} className="xl:col-span-2">
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="pb-2">{locale.labels.channel}</th>
                <th className="pb-2">{locale.labels.investment}</th>
                <th className="pb-2">{locale.labels.revenue}</th>
                <th className="pb-2">{locale.labels.roi}</th>
              </tr>
            </thead>
            <tbody>
              {data.attribution.map(row => (
                <tr key={row.channel} className="border-t border-slate-800 text-slate-200">
                  <td className="py-2">
                    <button type="button" onClick={() => onDrillDown({ channel: row.channel })} className="hover:text-orange-300">
                      {row.channel}
                    </button>
                  </td>
                  <td className="py-2">{formatCurrency(row.investment)}</td>
                  <td className="py-2">{formatCurrency(row.revenue)}</td>
                  <td className={`py-2 font-semibold ${row.roi >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                    {formatPercent(row.roi)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
