import { useMemo } from "react";
import type { ControlTowerFact, ControlTowerFilterState } from "@shared/types";
import { calcNps } from "@shared/controlTowerRules";
import type { Language } from "@/i18n";
import type { ControlTowerLocale } from "@/lib/controlTowerLocale";
import { formatPercent } from "../utils/formatters";
import { Panel } from "./shared";
import FormulaTooltip from "./FormulaTooltip";

interface PainelQualidadeProps {
  language: Language;
  locale: ControlTowerLocale;
  facts: ControlTowerFact[];
  onDrillDown: (partial: Partial<ControlTowerFilterState>) => void;
}

export default function PainelQualidade({ language, locale, facts, onDrillDown }: PainelQualidadeProps) {
  const data = useMemo(() => {
    const promotores = facts.filter(row => row.npsScore >= 80).length;
    const detratores = facts.filter(row => row.npsScore <= 60).length;
    const total = facts.length;
    const nps = calcNps(promotores, detratores, Math.max(1, total));
    const gaugePercent = Math.min(100, Math.max(0, (nps + 100) / 2));

    const frequencyMap = facts.reduce<Record<string, number>>((acc, row) => {
      const terms = [...row.materialList, row.procedure]
        .map(item => item.toLowerCase())
        .filter(item => item.length > 2);
      terms.forEach(term => {
        acc[term] = (acc[term] ?? 0) + 1;
      });
      return acc;
    }, {});
    const cloud = Object.entries(frequencyMap)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    const scatter = facts.slice(0, 40).map(row => ({
      professional: row.professional,
      wait: row.waitMinutes,
      satisfaction: row.npsScore,
      status: row.status,
    }));

    return { nps, gaugePercent, cloud, scatter };
  }, [facts]);

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <Panel title={locale.quality.nps} metricKey="nps_exato" language={language}>
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs text-slate-400">{locale.quality.nps}</p>
            <FormulaTooltip metricKey="nps_exato" language={language} />
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full rounded-full bg-gradient-to-r from-red-500 via-orange-400 to-emerald-400" style={{ width: `${data.gaugePercent}%` }} />
          </div>
          <p className="mt-3 text-2xl font-semibold text-emerald-300">{formatPercent(data.nps)}</p>
        </div>
      </Panel>

      <Panel title={locale.quality.wordCloud} metricKey="wordcloud_frequencia" language={language}>
        <div className="flex flex-wrap gap-2">
          {data.cloud.map(item => (
            <span
              key={item.term}
              className="rounded-full border border-slate-700 bg-slate-900/70 px-2 py-1 text-slate-100"
              style={{ fontSize: `${11 + Math.min(20, item.count * 1.5)}px` }}
            >
              {item.term}
            </span>
          ))}
        </div>
      </Panel>

      <Panel title={locale.quality.scatter} metricKey="espera_satisfacao" language={language} className="xl:col-span-2">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {data.scatter.map((point, index) => (
            <button
              key={`${point.professional}-${index}`}
              type="button"
              onClick={() => onDrillDown({ professional: point.professional })}
              className="rounded-lg border border-slate-800 bg-slate-900/70 p-3 text-left"
            >
              <p className="text-[11px] text-slate-300">{point.professional}</p>
              <p className="text-xs text-slate-400">X {point.wait} min</p>
              <p className="text-xs text-slate-400">Y {point.satisfaction}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-orange-400" style={{ width: `${Math.min(100, point.satisfaction)}%` }} />
              </div>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
}
