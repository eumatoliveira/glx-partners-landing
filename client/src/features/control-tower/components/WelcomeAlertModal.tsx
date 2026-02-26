import { useEffect, useMemo, useState } from "react";
import type { AlertEvent, AlertSeverity } from "@shared/types";
import type { ControlTowerLocale } from "@/lib/controlTowerLocale";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AudioAlertService } from "../services/AudioAlertService";

const STORAGE_KEY = "control-tower-welcome-alert-shown";

interface WelcomeAlertModalProps {
  locale: ControlTowerLocale;
  alerts: AlertEvent[];
  highestSeverity: AlertSeverity;
}

export default function WelcomeAlertModal({ locale, alerts, highestSeverity }: WelcomeAlertModalProps) {
  const [open, setOpen] = useState(false);

  const topAlerts = useMemo(() => alerts.slice(0, 4), [alerts]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const alreadyShown = sessionStorage.getItem(STORAGE_KEY) === "1";
    if (alreadyShown) return;
    if (alerts.length === 0) return;

    setOpen(true);
    void AudioAlertService.playAlertAudio(highestSeverity);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }, [alerts, highestSeverity]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border border-slate-700 bg-slate-950 text-slate-100 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{locale.welcome.title}</DialogTitle>
          <DialogDescription className="text-slate-300">
            {locale.welcome.subtitle}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">{locale.welcome.highestSeverity}</p>
          <p className="mt-1 text-xl font-semibold text-orange-300">{highestSeverity}</p>
        </div>

        <div className="space-y-2">
          {topAlerts.map(alert => (
            <div key={alert.id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-100">{alert.title}</p>
                <span className="rounded-full border border-red-500/40 bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-300">
                  {alert.severity}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-300">{alert.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)} className="bg-orange-500 text-black hover:bg-orange-400">
            {locale.welcome.close}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
