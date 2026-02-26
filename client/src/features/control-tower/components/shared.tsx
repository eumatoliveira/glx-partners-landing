import type { ReactNode } from "react";
import { m } from "framer-motion";
import type { Language } from "@/i18n";
import type { FormulaMetricKey } from "../state/FormulaCatalog";
import FormulaTooltip from "./FormulaTooltip";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { hoverLift, pulseP1, shimmerOnce, tapPress, tilt3D } from "@/animation/config/motionPresets";
import { shouldEnableHoverMotion } from "@/animation/utils/perfGuards";
import { ParallaxTiltCard } from "@/animation/components/ParallaxTiltCard";

interface PanelProps {
  title: string;
  metricKey: FormulaMetricKey;
  language: Language;
  children: ReactNode;
  className?: string;
  intent?: "default" | "warning" | "critical";
}

export function Panel({ title, metricKey, language, children, className, intent = "default" }: PanelProps) {
  const caps = useMotionCapabilities();
  const hoverEnabled = shouldEnableHoverMotion(caps);
  const tilt = tilt3D(caps.motionLevel);
  const intentStyle =
    intent === "critical"
      ? "border-red-500/40 bg-red-500/10"
      : intent === "warning"
        ? "border-amber-500/40 bg-amber-500/10"
        : "border-gray-200 bg-white dark:border-white/10 dark:bg-[#120f0d]/72";

  return (
    <ParallaxTiltCard intensity={Math.min(tilt.maxTilt, 4)} className={className}>
      <m.section
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        whileHover={hoverEnabled ? hoverLift(caps.motionLevel) : undefined}
        animate={intent === "critical" && caps.motionLevel !== "off" ? pulseP1 : undefined}
        className={`relative rounded-xl border shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:shadow-[0_8px_28px_rgba(0,0,0,0.25)] supports-[backdrop-filter]:backdrop-blur-xl ${intentStyle}`}
      >
        {intent === "warning" ? (
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
            variants={shimmerOnce}
            style={{
              backgroundImage: "linear-gradient(110deg, transparent 0%, rgba(251,191,36,0.12) 42%, transparent 74%)",
              backgroundSize: "220% 100%",
            }}
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 rounded-xl border border-black/[0.03] dark:border-white/[0.03]" />
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-slate-800/90">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
          <FormulaTooltip metricKey={metricKey} language={language} />
        </div>
        <div className="p-4">{children}</div>
      </m.section>
    </ParallaxTiltCard>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  metricKey: FormulaMetricKey;
  language: Language;
  onClick?: () => void;
  fillPercent?: number;
  emphasis?: "neutral" | "positive" | "warning" | "critical";
}

export function MetricCard({
  label,
  value,
  metricKey,
  language,
  onClick,
  fillPercent = 66,
  emphasis = "neutral",
}: MetricCardProps) {
  const caps = useMotionCapabilities();
  const hoverEnabled = shouldEnableHoverMotion(caps);
  const tilt = tilt3D(caps.motionLevel);
  const safePercent = Math.max(6, Math.min(100, fillPercent));
  const barClass =
    emphasis === "critical"
      ? "from-red-500 to-rose-300"
      : emphasis === "warning"
        ? "from-amber-500 to-orange-300"
        : emphasis === "positive"
          ? "from-emerald-500 to-cyan-300"
          : "from-[#e67e22] to-cyan-400";

  return (
    <ParallaxTiltCard intensity={Math.min(tilt.maxTilt, 4)} className="h-full">
      <m.button
        type="button"
        onClick={onClick}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        whileHover={hoverEnabled ? hoverLift(caps.motionLevel) : undefined}
        whileTap={tapPress(caps.motionLevel)}
        animate={emphasis === "critical" && caps.motionLevel !== "off" ? pulseP1 : undefined}
        className="group relative w-full rounded-lg border border-gray-200 bg-white p-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:border-[#e67e22]/70 dark:border-white/10 dark:bg-[#0f0c0a]/70 dark:shadow-[0_10px_28px_rgba(0,0,0,0.28)] supports-[backdrop-filter]:backdrop-blur-lg"
      >
        {emphasis === "warning" ? (
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-lg"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={shimmerOnce}
            style={{
              backgroundImage: "linear-gradient(110deg, transparent 0%, rgba(251,191,36,0.10) 45%, transparent 78%)",
              backgroundSize: "220% 100%",
            }}
          />
        ) : null}
        <div className="absolute right-3 top-3">
          <FormulaTooltip metricKey={metricKey} language={language} />
        </div>
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-slate-100">{value}</p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
          <m.div
            initial={{ width: "0%" }}
            whileInView={{ width: `${safePercent}%` }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            animate={emphasis === "critical" ? { opacity: [0.6, 1, 0.6] } : undefined}
            className={`h-full rounded-full bg-gradient-to-r ${barClass}`}
          />
        </div>
      </m.button>
    </ParallaxTiltCard>
  );
}

interface HorizontalBarProps {
  label: string;
  value: number;
  max: number;
  suffix?: string;
  onClick?: () => void;
}

export function HorizontalBar({ label, value, max, suffix = "", onClick }: HorizontalBarProps) {
  const caps = useMotionCapabilities();
  const hoverEnabled = shouldEnableHoverMotion(caps);
  const percent = max <= 0 ? 0 : Math.min(100, (value / max) * 100);
  return (
    <m.button
      type="button"
      onClick={onClick}
      whileHover={hoverEnabled ? { x: 3 } : undefined}
      whileTap={tapPress(caps.motionLevel)}
      className="w-full text-left"
    >
      <div className="mb-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
        <span>{label}</span>
        <span>
          {value.toFixed(1)}
          {suffix}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-800">
        <m.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-[#e67e22] to-cyan-400"
        />
      </div>
    </m.button>
  );
}
