import { useMemo } from "react";
import type { ControlTowerFact, ControlTowerFilterState } from "@shared/types";
import { calcCCC, calcCGN } from "@shared/controlTowerRules";
import type { Language } from "@/i18n";
import type { ControlTowerLocale } from "@/lib/controlTowerLocale";
import { formatCurrency } from "../utils/formatters";
import { HorizontalBar, Panel } from "./shared";
import FormulaTooltip from "./FormulaTooltip";

interface PainelFinanceiroProps {
  language: Language;
  locale: ControlTowerLocale;
  facts: ControlTowerFact[];
  onDrillDown: (partial: Partial<ControlTowerFilterState>) => void;
}

export default function PainelFinanceiro({ language, locale, facts, onDrillDown }: PainelFinanceiroProps) {
  const metrics = useMemo(() => {
    const receitaBruta = facts.reduce((sum, row) => sum + row.entries, 0);
    const deducoes = facts.filter(row => row.status !== "realizado").reduce((sum, row) => sum + row.ticketMedio * 0.4, 0);
    const custosVariaveis = facts.reduce((sum, row) => sum + row.custoVariavel, 0);
    const custosFixos = facts.reduce((sum, row) => sum + row.exits, 0) * 0.45;
    const ebitda = receitaBruta - deducoes - custosVariaveis - custosFixos;

    const prazoRecebimento = facts.length === 0 ? 0 : facts.reduce((sum, row) => sum + row.waitMinutes, 0) / facts.length + 12;
    const prazoEstoque = facts.length === 0 ? 0 : facts.reduce((sum, row) => sum + row.durationMinutes, 0) / facts.length * 0.4;
    const prazoPagamento = 21;
    const ccc = calcCCC(prazoRecebimento, prazoEstoque, prazoPagamento);

    const contasReceber = receitaBruta * 0.32;
    const estoque = custosVariaveis * 0.18;
    const contasPagar = custosFixos * 0.29;
    const cgn = calcCGN(contasReceber, estoque, contasPagar);

    const bcg = Object.values(
      facts.reduce<Record<string, { procedure: string; volume: number; margin: number }>>((acc, row) => {
        if (!acc[row.procedure]) {
          acc[row.procedure] = { procedure: row.procedure, volume: 0, margin: 0 };
        }
        acc[row.procedure]!.volume += 1;
        acc[row.procedure]!.margin += row.entries - row.custoVariavel;
        return acc;
      }, {}),
    ).map(item => ({
      ...item,
      marginPercent: item.volume === 0 ? 0 : (item.margin / Math.max(1, item.volume * 100)) * 100,
    }));

    const aging = [
      { bucket: "0-30", amount: facts.filter(row => row.waitMinutes <= 30).reduce((sum, row) => sum + row.exits * 0.25, 0) },
      { bucket: "31-60", amount: facts.filter(row => row.waitMinutes > 30 && row.waitMinutes <= 60).reduce((sum, row) => sum + row.exits * 0.35, 0) },
      { bucket: "61-90", amount: facts.filter(row => row.waitMinutes > 60 && row.waitMinutes <= 90).reduce((sum, row) => sum + row.exits * 0.45, 0) },
      { bucket: ">90", amount: facts.filter(row => row.waitMinutes > 90).reduce((sum, row) => sum + row.exits * 0.6, 0) },
    ];

    return {
      receitaBruta,
      deducoes,
      custosVariaveis,
      custosFixos,
      ebitda,
      ccc,
      cgn,
      bcg,
      aging,
    };
  }, [facts]);

  const maxWaterfall = Math.max(metrics.receitaBruta, metrics.deducoes, metrics.custosVariaveis, metrics.custosFixos, Math.abs(metrics.ebitda), 1);
  const maxAging = Math.max(...metrics.aging.map(item => item.amount), 1);

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <Panel title={locale.financial.dreWaterfall} metricKey="dre_waterfall" language={language}>
        <div className="space-y-3">
          <HorizontalBar label={locale.labels.grossRevenue} value={metrics.receitaBruta} max={maxWaterfall} onClick={() => onDrillDown({ status: "realizado" })} />
          <HorizontalBar label={locale.labels.deductions} value={metrics.deducoes} max={maxWaterfall} onClick={() => onDrillDown({ status: "cancelado" })} />
          <HorizontalBar label={locale.labels.variableCosts} value={metrics.custosVariaveis} max={maxWaterfall} />
          <HorizontalBar label={locale.labels.fixedCosts} value={metrics.custosFixos} max={maxWaterfall} />
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-xs text-slate-400">{locale.labels.ebitda}</p>
            <p className={`text-xl font-semibold ${metrics.ebitda >= 0 ? "text-emerald-300" : "text-red-300"}`}>
              {formatCurrency(metrics.ebitda)}
            </p>
          </div>
        </div>
      </Panel>

      <Panel title={locale.financial.ccc} metricKey="ccc" language={language}>
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>{locale.financial.ccc}</span>
              <FormulaTooltip metricKey="ccc" language={language} />
            </div>
            <p className="text-2xl font-semibold text-cyan-300">{metrics.ccc.toFixed(1)} dias</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
              <span>{locale.financial.cgn}</span>
              <FormulaTooltip metricKey="cgn" language={language} />
            </div>
            <p className="text-2xl font-semibold text-orange-300">{formatCurrency(metrics.cgn)}</p>
          </div>
        </div>
      </Panel>

      <Panel title={locale.financial.bcg} metricKey="margem_por_minuto" language={language}>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="pb-2">{locale.labels.procedure}</th>
                <th className="pb-2">{locale.labels.volume}</th>
                <th className="pb-2">{locale.labels.marginPercent}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.bcg.map(item => (
                <tr key={item.procedure} className="border-t border-slate-800 text-slate-200">
                  <td className="py-2">
                    <button type="button" onClick={() => onDrillDown({ procedure: item.procedure })} className="hover:text-orange-300">
                      {item.procedure}
                    </button>
                  </td>
                  <td className="py-2">{item.volume}</td>
                  <td className="py-2">{item.marginPercent.toFixed(2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel title={locale.financial.aging} metricKey="aging_inadimplencia" language={language}>
        <div className="space-y-2">
          {metrics.aging.map(item => (
            <div key={item.bucket} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
              <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                <span>{item.bucket}</span>
                <span>{formatCurrency(item.amount)}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-red-500 to-orange-300" style={{ width: `${(item.amount / maxAging) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
