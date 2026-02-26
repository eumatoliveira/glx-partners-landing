import { AnimatePresence, m } from "framer-motion";
import type { AlertEvent } from "@shared/types";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { pulseP1 } from "@/animation/config/motionPresets";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface PriorityAlertBarProps {
  alerts: AlertEvent[];
  onOpenP1: (alertId: string) => void;
}

const COPY = {
  pt: { critical: "Alerta critico ativo", viewNow: "Ver agora" },
  es: { critical: "Alerta critico activo", viewNow: "Ver ahora" },
  en: { critical: "Critical alert active", viewNow: "View now" },
} as const;

export default function PriorityAlertBar({ alerts, onOpenP1 }: PriorityAlertBarProps) {
  const caps = useMotionCapabilities();
  const { language } = useLanguage();
  const p1Alerts = alerts.filter(alert => alert.severity === "P1");
  const primary = p1Alerts[0];
  const copy = COPY[language];

  return (
    <AnimatePresence initial={false}>
      {primary ? (
        <m.div
          key={primary.id}
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 180, damping: 18 }}
          className="fixed left-4 right-4 top-[72px] z-40 lg:left-[calc(18rem+1.5rem)] lg:right-6"
        >
          <m.button
            type="button"
            onClick={() => onOpenP1(primary.id)}
            className={cn(
              "group flex w-full items-center justify-between gap-3 rounded-xl border border-red-400/30",
              "bg-[linear-gradient(135deg,rgba(127,29,29,0.72),rgba(30,20,20,0.78))]",
              "px-4 py-3 text-left shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl",
              "supports-[backdrop-filter]:bg-red-950/35",
            )}
            animate={caps.motionLevel === "off" ? undefined : pulseP1}
            whileHover={caps.motionLevel === "off" ? undefined : { scale: 1.005 }}
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="mt-0.5 rounded-lg border border-red-300/30 bg-red-500/15 p-2 text-red-100">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-red-300/30 bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold tracking-[0.18em] text-red-100">
                    P1
                  </span>
                  <p className="truncate text-sm font-semibold text-white">{copy.critical}</p>
                </div>
                <p className="mt-1 truncate text-xs text-red-100/85">
                  {primary.title} · {primary.description}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-red-100">
              {copy.viewNow}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </m.button>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
