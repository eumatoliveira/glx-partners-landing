import { useMemo, useState } from "react";
import { m } from "framer-motion";
import { Siren } from "lucide-react";
import type { AlertEvent } from "@shared/types";
import type { Language } from "@/i18n";
import type { ControlTowerLocale } from "@/lib/controlTowerLocale";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FORMULA_CATALOG, type FormulaMetricKey } from "../state/FormulaCatalog";
import type { RcaDraftPayload } from "../hooks/useAlertEngine";
import { formatCurrency } from "../utils/formatters";
import FormulaTooltip from "./FormulaTooltip";
import { Panel } from "./shared";

interface WarRoomProps {
  language: Language;
  locale: ControlTowerLocale;
  alerts: AlertEvent[];
  generateRCA: (alert: AlertEvent) => RcaDraftPayload;
  onSaved?: () => void;
}

function resolveMetricKey(metricKey: string): FormulaMetricKey {
  if (metricKey in FORMULA_CATALOG) return metricKey as FormulaMetricKey;
  return "impacto_financeiro";
}

export default function WarRoom({ language, locale, alerts, generateRCA, onSaved }: WarRoomProps) {
  const [selectedAlert, setSelectedAlert] = useState<AlertEvent | null>(null);
  const [draft, setDraft] = useState<RcaDraftPayload | null>(null);

  const createRcaMutation = trpc.controlTower.createRca.useMutation({
    onSuccess: () => {
      toast.success(locale.warRoom.saved);
      setSelectedAlert(null);
      setDraft(null);
      onSaved?.();
    },
    onError: () => toast.error(locale.warRoom.saveError),
  });

  const p1Alerts = useMemo(() => alerts.filter(alert => alert.severity === "P1"), [alerts]);

  const openRca = (alert: AlertEvent) => {
    setSelectedAlert(alert);
    setDraft(generateRCA(alert));
  };

  const saveRca = async () => {
    if (!draft) return;
    await createRcaMutation.mutateAsync(draft);
  };

  return (
    <Panel
      title={locale.warRoom.title}
      metricKey="impacto_financeiro"
      language={language}
      intent={p1Alerts.length > 0 ? "critical" : "default"}
    >
      <p className="mb-3 text-xs text-slate-300">{locale.warRoom.subtitle}</p>

      {p1Alerts.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-sm text-slate-300">
          {locale.warRoom.noAlerts}
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {p1Alerts.map(alert => {
            const metricKey = resolveMetricKey(alert.metricKey);
            return (
              <m.article
                key={alert.id}
                className="relative rounded-lg border border-red-500/40 bg-red-500/10 p-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                animate={{ boxShadow: ["0 0 0 rgba(239,68,68,0.15)", "0 0 20px rgba(239,68,68,0.35)", "0 0 0 rgba(239,68,68,0.15)"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="absolute right-3 top-3">
                  <FormulaTooltip metricKey={metricKey} language={language} />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <m.div
                    animate={{ rotate: [0, -8, 8, -8, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }}
                  >
                    <Siren className="h-4 w-4 text-red-300" />
                  </m.div>
                  <p className="text-sm font-semibold text-red-200">{alert.title}</p>
                </div>
                <p className="text-xs text-red-100/90">{alert.description}</p>
                <p className="mt-2 text-xs text-red-200">
                  {locale.warRoom.impact}: <span className="font-semibold">{formatCurrency(alert.financialImpact)}</span>
                </p>
                <button
                  type="button"
                  onClick={() => openRca(alert)}
                  className="mt-3 rounded-md bg-red-200 px-3 py-1.5 text-xs font-semibold text-red-900 transition hover:bg-red-100"
                >
                  {locale.warRoom.registerRca}
                </button>
              </m.article>
            );
          })}
        </div>
      )}

      <Dialog open={!!selectedAlert && !!draft} onOpenChange={open => { if (!open) { setSelectedAlert(null); setDraft(null); } }}>
        <DialogContent className="border border-slate-700 bg-slate-950 text-slate-100 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{locale.warRoom.modalTitle}</DialogTitle>
          </DialogHeader>
          {draft ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-slate-400">{locale.warRoom.rootCause}</label>
                <textarea
                  value={draft.rootCause}
                  onChange={event => setDraft({ ...draft, rootCause: event.target.value })}
                  className="h-24 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">{locale.warRoom.actionPlan}</label>
                <textarea
                  value={draft.actionPlan}
                  onChange={event => setDraft({ ...draft, actionPlan: event.target.value })}
                  className="h-24 w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-slate-400">{locale.warRoom.owner}</label>
                  <input
                    value={draft.owner}
                    onChange={event => setDraft({ ...draft, owner: event.target.value })}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-400">{locale.warRoom.dueDate}</label>
                  <input
                    type="date"
                    value={draft.dueDate}
                    onChange={event => setDraft({ ...draft, dueDate: event.target.value })}
                    className="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={saveRca}
                  disabled={createRcaMutation.isPending}
                  className="rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
                >
                  {locale.warRoom.save}
                </button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </Panel>
  );
}
