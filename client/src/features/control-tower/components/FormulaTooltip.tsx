import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Language } from "@/i18n";
import { getFormula, type FormulaMetricKey } from "../state/FormulaCatalog";

interface FormulaTooltipProps {
  metricKey: FormulaMetricKey;
  language: Language;
  className?: string;
}

export default function FormulaTooltip({ metricKey, language, className }: FormulaTooltipProps) {
  const formula = getFormula(metricKey);

  return (
    <div className={className}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900/70 text-slate-200 transition hover:border-orange-500 hover:text-orange-400"
            aria-label={`Formula info ${formula.metricName[language]}`}
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs border border-slate-700 bg-slate-950 text-slate-100 px-3 py-2">
          <p className="font-semibold text-xs text-orange-300">{formula.metricName[language]}</p>
          <p className="mt-1 text-[11px] leading-relaxed">{formula.formula}</p>
          <p className="mt-1 text-[11px] text-slate-300">{formula.legend[language]}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
