import { useId, useMemo } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

type SparklinePoint = [number, number];

function buildSparklinePath(points: SparklinePoint[]) {
  if (!points.length) return "";
  return points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x} ${y}`)
    .join(" ");
}

export function AnimatedSparkline({
  className,
  color = "#f97316",
  points = [
    [4, 42],
    [24, 40],
    [44, 34],
    [64, 38],
    [84, 28],
    [104, 22],
    [124, 26],
    [144, 16],
    [164, 18],
    [184, 10],
  ],
}: {
  className?: string;
  color?: string;
  points?: SparklinePoint[];
}) {
  const capabilities = useMotionCapabilities();
  const reduced = capabilities.prefersReducedMotion || capabilities.motionLevel === "off";
  const path = useMemo(() => buildSparklinePath(points), [points]);
  const gradientId = useId();

  return (
    <div className={cn("relative h-20 w-full overflow-hidden rounded-lg border border-white/10 bg-black/30 p-2", className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(249,115,22,0.12),transparent_55%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.12),transparent_50%)]" />
      <svg viewBox="0 0 190 48" className="relative z-10 h-full w-full">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="70%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path d={path} stroke="rgba(255,255,255,0.08)" strokeWidth="7" fill="none" strokeLinecap="round" />
        <m.path
          d={path}
          stroke={`url(#${gradientId})`}
          strokeWidth="2.8"
          fill="none"
          strokeLinecap="round"
          initial={reduced ? false : { pathLength: 0, opacity: 0.6 }}
          whileInView={reduced ? undefined : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        {!reduced ? (
          <m.circle
            r="2.8"
            fill="#f97316"
            stroke="#fff"
            strokeWidth="0.8"
            animate={{
              cx: [4, 24, 44, 64, 84, 104, 124, 144, 164, 184],
              cy: [42, 40, 34, 38, 28, 22, 26, 16, 18, 10],
              opacity: [0.75, 1, 0.9, 1],
            }}
            transition={{ duration: 6.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
          />
        ) : null}
      </svg>
    </div>
  );
}

export function AnimatedBarTrend({
  className,
  values = [32, 46, 38, 62, 74, 68, 88],
}: {
  className?: string;
  values?: number[];
}) {
  const capabilities = useMotionCapabilities();
  const reduced = capabilities.prefersReducedMotion || capabilities.motionLevel === "off";

  return (
    <div className={cn("relative h-20 w-full overflow-hidden rounded-lg border border-white/10 bg-black/30 p-2", className)}>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),transparent_55%)]" />
      <div className="relative z-10 flex h-full items-end gap-1.5">
        {values.map((value, index) => (
          <div key={`${index}-${value}`} className="flex h-full flex-1 items-end">
            <m.div
              className="w-full rounded-sm bg-gradient-to-t from-orange-600/70 via-orange-500/80 to-amber-300/80 shadow-[0_0_18px_rgba(249,115,22,0.2)]"
              initial={reduced ? false : { height: "12%" }}
              whileInView={reduced ? undefined : { height: `${value}%` }}
              viewport={{ once: true, margin: "-50px" }}
              animate={
                reduced
                  ? undefined
                  : {
                      opacity: [0.85, 1, 0.92],
                      filter: [
                        "drop-shadow(0 0 0px rgba(249,115,22,0.0))",
                        "drop-shadow(0 0 8px rgba(249,115,22,0.28))",
                        "drop-shadow(0 0 2px rgba(249,115,22,0.12))",
                      ],
                    }
              }
              transition={{
                height: { delay: 0.08 * index, duration: 0.75, type: "spring", stiffness: 120, damping: 18 },
                opacity: { duration: 3.8, repeat: Infinity, delay: index * 0.14, repeatType: "mirror" },
                filter: { duration: 3.8, repeat: Infinity, delay: index * 0.14, repeatType: "mirror" },
              }}
              style={{ willChange: "height, opacity" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnimatedGauge({
  className,
  value = 82,
  label = "Score",
}: {
  className?: string;
  value?: number;
  label?: string;
}) {
  const capabilities = useMotionCapabilities();
  const reduced = capabilities.prefersReducedMotion || capabilities.motionLevel === "off";
  const safeValue = Math.max(0, Math.min(100, value));
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const targetDash = circumference * (1 - safeValue / 100);
  const gradientId = useId();

  return (
    <div className={cn("relative flex h-24 items-center gap-3 rounded-lg border border-white/10 bg-black/35 px-3", className)}>
      <div className="relative grid h-16 w-16 place-items-center">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="none" />
          <m.circle
            cx="32"
            cy="32"
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={reduced ? false : { strokeDashoffset: circumference }}
            whileInView={reduced ? undefined : { strokeDashoffset: targetDash }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>
        <m.span
          className="absolute text-xs font-bold text-white tabular-nums"
          animate={reduced ? undefined : { scale: [1, 1.06, 1] }}
          transition={{ duration: 3.2, repeat: Infinity }}
        >
          {safeValue}%
        </m.span>
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.22em] text-orange-400">{label}</div>
        <div className="mt-1 text-sm font-semibold text-white">Saude operacional</div>
        <div className="mt-1 h-1.5 w-full rounded-full bg-white/10">
          <m.div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-orange-400"
            initial={reduced ? false : { width: "0%" }}
            whileInView={reduced ? undefined : { width: `${safeValue}%` }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

export function ExecutiveMiniDashboard({
  className,
  title = "Executive Pulse",
}: {
  className?: string;
  title?: string;
}) {
  const capabilities = useMotionCapabilities();
  const reduced = capabilities.prefersReducedMotion || capabilities.motionLevel === "off";

  return (
    <m.div
      initial={reduced ? false : { opacity: 0, y: 14, scale: 0.985 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-[#090a0d]/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(249,115,22,0.18),transparent_45%),radial-gradient(circle_at_90%_12%,rgba(34,211,238,0.12),transparent_40%)]" />
      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-orange-300">{title}</div>
          <m.div
            className="h-2 w-2 rounded-full bg-emerald-400"
            animate={reduced ? undefined : { opacity: [0.45, 1, 0.45], scale: [0.95, 1.25, 0.95] }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-lg border border-white/8 bg-white/5 px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/60">ROI</div>
            <div className="mt-0.5 text-sm font-semibold text-white">3.2x</div>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/5 px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/60">No-show</div>
            <div className="mt-0.5 text-sm font-semibold text-orange-300">10.3%</div>
          </div>
          <div className="rounded-lg border border-white/8 bg-white/5 px-2 py-1.5">
            <div className="text-[9px] uppercase tracking-[0.18em] text-white/60">Conv.</div>
            <div className="mt-0.5 text-sm font-semibold text-cyan-300">81.7%</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-[1.05fr_1fr] gap-2">
          <AnimatedBarTrend className="h-24" values={[18, 30, 28, 44, 57, 61, 69]} />
          <div className="flex flex-col gap-2">
            <AnimatedSparkline className="h-[4.5rem]" points={[[4, 36], [24, 34], [44, 26], [64, 22], [84, 16], [104, 24], [124, 18], [144, 20], [164, 14], [184, 10]]} />
            <AnimatedGauge value={84} label="SLA" />
          </div>
        </div>
      </div>
    </m.div>
  );
}

export function MetricTicker({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const capabilities = useMotionCapabilities();
  const reduced = capabilities.prefersReducedMotion || capabilities.motionLevel === "off";
  const doubled = [...items, ...items];

  return (
    <div className={cn("relative overflow-hidden rounded-full border border-white/10 bg-white/[0.03] py-2", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0a0a0b] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0a0a0b] to-transparent" />
      <m.div
        className="flex min-w-max items-center gap-6 px-4"
        animate={reduced ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            <span>{item}</span>
          </div>
        ))}
      </m.div>
    </div>
  );
}
