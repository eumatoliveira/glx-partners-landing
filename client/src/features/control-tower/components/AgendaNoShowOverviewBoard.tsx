import { useMemo } from "react";
import { m, useReducedMotion } from "framer-motion";
import { AlertTriangle, TrendingDown } from "lucide-react";
import type { ControlTowerFact } from "@shared/types";
import { cn } from "@/lib/utils";
import { useClientDashboardTheme } from "@/contexts/ClientDashboardThemeContext";

interface AgendaNoShowOverviewBoardProps {
  planLabel?: string;
  appearance?: "auto" | "light" | "dark";
  facts?: ControlTowerFact[];
  hideHeader?: boolean;
}

type ComboPoint = { day: string; confirmedPct: number; unconfirmedPct: number; lineY: number };
type CancellationPoint = { x: number; y: number; tag?: string };
type ChannelRow = { week: string; values: [number, number, number, number] };
type WeeklyConsultationBar = { day: string; value: number; active?: boolean };
type NoShowPoint = { label: string; rate: number; total: number; y: number };

type DerivedBoardData = {
  noShowSeries: NoShowPoint[];
  noShowCurrentRate: number;
  noShowHighlight: { label: string; rate: number; aboveThreshold: boolean } | null;
  occupancyPct: number;
  comboPoints: ComboPoint[];
  comboAxisMax: number;
  cancellationPoints: CancellationPoint[];
  weeklyCancellationDeltaPct: number;
  channelRows: ChannelRow[];
  channelLabels: [string, string, string, string];
  weeklyConsultations: WeeklyConsultationBar[];
  unitLabels: string[];
  professionalLabels: string[];
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const DEFAULT_CHANNEL_LABELS: [string, string, string, string] = ["Online", "Phone", "In-Person", "Referral"];
const TARGET_NOSHOW = 10;
const THRESHOLD_NOSHOW = 15;
const OCCUPANCY_RISK_THRESHOLD = 60;
const OCCUPANCY_TARGET = 75;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function pct(numerator: number, denominator: number) {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) return 0;
  return (numerator / denominator) * 100;
}

function toDayKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDayKey(dayKey: string) {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(y || 1970, (m || 1) - 1, d || 1);
}

function shiftDay(date: Date, offset: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + offset);
  return copy;
}

function startOfWeek(date: Date) {
  const copy = new Date(date);
  const day = copy.getDay(); // 0 Sun..6 Sat
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function formatShortDate(date: Date) {
  return `${date.toLocaleString("en-US", { month: "short" })} ${date.getDate()}`;
}

function formatWeekday(date: Date) {
  return DAY_LABELS[date.getDay()] ?? "Day";
}

function roundUp(value: number, step: number) {
  if (value <= 0) return step;
  return Math.ceil(value / step) * step;
}

function toPctChartY(valuePct: number, minY = 40, maxY = 180) {
  const v = clamp(valuePct, 0, 100);
  return round1(maxY - ((maxY - minY) * v) / 100);
}

function labelChannel(name: string | undefined | null) {
  if (!name?.trim()) return "Unknown";
  const trimmed = name.trim();
  return trimmed.length > 14 ? `${trimmed.slice(0, 14)}…` : trimmed;
}

function buildPolyPoints(points: number[]) {
  if (points.length === 0) return "";
  const step = points.length > 1 ? 500 / (points.length - 1) : 0;
  return points.map((y, index) => `${Math.round(index * step)},${y}`).join(" ");
}

function buildComboLinePath(points: ComboPoint[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${10 + i * 25},${p.lineY}`).join(" ");
}

function buildCancellationLinePath(points: CancellationPoint[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
}

function buildCancellationAreaPath(points: CancellationPoint[]) {
  if (points.length === 0) return "M0,200 L500,200 Z";
  const line = buildCancellationLinePath(points);
  const lastX = points[points.length - 1]?.x ?? 500;
  return `${line} L ${lastX},200 L 0,200 Z`;
}

function deriveAgendaBoardData(facts: ControlTowerFact[]): DerivedBoardData {
  const safeFacts = [...facts].filter(f => !!f?.timestamp).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const now = new Date();

  const dailyMap = new Map<string, { date: Date; total: number; noshow: number; cancel: number; confirmed: number; unconfirmed: number; realized: number }>();
  const unitSet = new Set<string>();
  const professionalSet = new Set<string>();
  const channelTotals = new Map<string, number>();
  const channelByWeek = new Map<string, Map<string, number>>();

  let slotsAvailableSum = 0;
  let slotsFilledSum = 0;
  let totalAppointments = 0;
  let noShowAppointments = 0;

  for (const row of safeFacts) {
    const date = new Date(row.timestamp);
    if (!Number.isFinite(date.getTime())) continue;

    totalAppointments += 1;
    if (row.status === "noshow") noShowAppointments += 1;

    if (Number.isFinite(row.slotsAvailable)) {
      slotsAvailableSum += Math.max(0, row.slotsAvailable);
      slotsFilledSum += Math.max(0, row.slotsAvailable - Math.max(0, row.slotsEmpty));
    }

    if (row.unit) unitSet.add(row.unit);
    if (row.professional) professionalSet.add(row.professional);

    const channel = (row.channel || "Unknown").trim() || "Unknown";
    channelTotals.set(channel, (channelTotals.get(channel) ?? 0) + 1);

    const weekKey = toDayKey(startOfWeek(date));
    const weekChannels = channelByWeek.get(weekKey) ?? new Map<string, number>();
    weekChannels.set(channel, (weekChannels.get(channel) ?? 0) + 1);
    channelByWeek.set(weekKey, weekChannels);

    const dayKey = toDayKey(date);
    const bucket =
      dailyMap.get(dayKey) ??
      {
        date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        total: 0,
        noshow: 0,
        cancel: 0,
        confirmed: 0,
        unconfirmed: 0,
        realized: 0,
      };

    bucket.total += 1;
    if (row.status === "noshow") {
      bucket.noshow += 1;
      bucket.unconfirmed += 1;
    } else if (row.status === "cancelado") {
      bucket.cancel += 1;
      bucket.unconfirmed += 1;
    } else {
      bucket.confirmed += 1;
      if (row.status === "realizado") bucket.realized += 1;
    }

    dailyMap.set(dayKey, bucket);
  }

  const allDays = Array.from(dailyMap.entries())
    .sort((a, b) => a[1].date.getTime() - b[1].date.getTime())
    .map(([key, value]) => ({ key, ...value }));

  const lastAvailableDay = allDays[allDays.length - 1]?.date ?? now;

  const noShowBuckets = Array.from({ length: 11 }, (_, i) => {
    const date = shiftDay(lastAvailableDay, i - 10);
    const key = toDayKey(date);
    const bucket = dailyMap.get(key);
    const rate = bucket ? pct(bucket.noshow, bucket.total) : 0;
    return {
      label: formatShortDate(date),
      rate: round1(rate),
      total: bucket?.total ?? 0,
      y: toPctChartY(rate),
    };
  });

  const noShowCurrentRate = round1(pct(noShowAppointments, totalAppointments));
  const noShowHighlightSource =
    noShowBuckets
      .filter(p => p.total > 0)
      .sort((a, b) => b.rate - a.rate || a.label.localeCompare(b.label))[0] ?? null;
  const noShowHighlight = noShowHighlightSource
    ? {
        label: noShowHighlightSource.label,
        rate: noShowHighlightSource.rate,
        aboveThreshold: noShowHighlightSource.rate > THRESHOLD_NOSHOW,
      }
    : null;

  const occupancyPct = round1(pct(slotsFilledSum, slotsAvailableSum));

  const comboBuckets = Array.from({ length: 12 }, (_, i) => {
    const date = shiftDay(lastAvailableDay, i - 11);
    const key = toDayKey(date);
    const bucket = dailyMap.get(key);
    return {
      day: formatWeekday(date),
      confirmed: bucket?.confirmed ?? 0,
      unconfirmed: bucket?.unconfirmed ?? 0,
    };
  });
  const comboAxisMax = roundUp(Math.max(...comboBuckets.map(b => b.confirmed + b.unconfirmed), 0), 500);
  const comboPoints: ComboPoint[] = comboBuckets.map(bucket => {
    const total = bucket.confirmed + bucket.unconfirmed;
    const confirmRatePct = total > 0 ? pct(bucket.confirmed, total) : 0;
    return {
      day: bucket.day,
      confirmedPct: comboAxisMax > 0 ? (bucket.confirmed / comboAxisMax) * 100 : 0,
      unconfirmedPct: comboAxisMax > 0 ? (bucket.unconfirmed / comboAxisMax) * 100 : 0,
      lineY: clamp(150 - (confirmRatePct / 100) * 120, 20, 150),
    };
  });

  const cancellationBuckets = Array.from({ length: 8 }, (_, i) => {
    const date = shiftDay(lastAvailableDay, i - 7);
    const key = toDayKey(date);
    const bucket = dailyMap.get(key);
    return {
      date,
      value: bucket?.cancel ?? 0,
    };
  });
  const cancellationMax = Math.max(...cancellationBuckets.map(b => b.value), 1);
  const cancellationPoints: CancellationPoint[] = cancellationBuckets.map((bucket, index) => {
    const x = cancellationBuckets.length > 1 ? Math.round((500 * index) / (cancellationBuckets.length - 1)) : 0;
    const y = 20 + ((200 - 40) * bucket.value) / cancellationMax;
    let tag: string | undefined;
    if (index > 0) {
      const previous = cancellationBuckets[index - 1]?.value ?? 0;
      const delta = previous > 0 ? ((bucket.value - previous) / previous) * 100 : bucket.value > 0 ? 100 : 0;
      const roundedDelta = Math.round(delta);
      if (Number.isFinite(roundedDelta) && roundedDelta !== 0 && Math.abs(roundedDelta) >= 5) {
        tag = `${roundedDelta > 0 ? "+" : ""}${roundedDelta}%`;
      }
    }
    return { x, y: round1(y), tag };
  });

  const last7 = allDays.slice(-7).reduce((acc, day) => acc + day.cancel, 0);
  const prev7 = allDays.slice(-14, -7).reduce((acc, day) => acc + day.cancel, 0);
  const weeklyCancellationDeltaPct = prev7 > 0 ? round1(((last7 - prev7) / prev7) * 100) : last7 > 0 ? 100 : 0;

  const topChannels = Array.from(channelTotals.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([name]) => name);
  const channelLabels = [
    labelChannel(topChannels[0] ?? DEFAULT_CHANNEL_LABELS[0]),
    labelChannel(topChannels[1] ?? DEFAULT_CHANNEL_LABELS[1]),
    labelChannel(topChannels[2] ?? DEFAULT_CHANNEL_LABELS[2]),
    labelChannel(topChannels[3] ?? DEFAULT_CHANNEL_LABELS[3]),
  ] as [string, string, string, string];

  const orderedWeeks = Array.from(channelByWeek.keys()).sort();
  const selectedWeeks = orderedWeeks.slice(-5);
  const channelRows: ChannelRow[] =
    selectedWeeks.length > 0
      ? selectedWeeks.map((weekKey, idx) => {
          const weekChannels = channelByWeek.get(weekKey) ?? new Map<string, number>();
          return {
            week: `Week ${idx + 1}`,
            values: [
              weekChannels.get(topChannels[0] ?? "") ?? 0,
              weekChannels.get(topChannels[1] ?? "") ?? 0,
              weekChannels.get(topChannels[2] ?? "") ?? 0,
              weekChannels.get(topChannels[3] ?? "") ?? 0,
            ],
          };
        })
      : Array.from({ length: 5 }, (_, idx) => ({ week: `Week ${idx + 1}`, values: [0, 0, 0, 0] as [number, number, number, number] }));

  const weekdayCounts = new Map<number, number>();
  for (let i = 0; i < 7; i += 1) weekdayCounts.set(i, 0);
  for (const row of safeFacts) {
    const date = new Date(row.timestamp);
    if (!Number.isFinite(date.getTime())) continue;
    const day = date.getDay();
    const isConsultation = row.status === "realizado";
    if (isConsultation) weekdayCounts.set(day, (weekdayCounts.get(day) ?? 0) + 1);
  }
  const realizedTotal = Array.from(weekdayCounts.values()).reduce((a, b) => a + b, 0);
  if (realizedTotal === 0) {
    for (const row of safeFacts) {
      const date = new Date(row.timestamp);
      if (!Number.isFinite(date.getTime())) continue;
      const day = date.getDay();
      weekdayCounts.set(day, (weekdayCounts.get(day) ?? 0) + 1);
    }
  }
  const weeklyConsultations: WeeklyConsultationBar[] = [1, 2, 3, 4, 5, 6, 0].map(day => ({
    day: DAY_LABELS[day],
    value: weekdayCounts.get(day) ?? 0,
  }));
  const maxWeekConsult = Math.max(...weeklyConsultations.map(item => item.value), 0);
  const activeIdx = weeklyConsultations.findIndex(item => item.value === maxWeekConsult && maxWeekConsult > 0);
  if (activeIdx >= 0) weeklyConsultations[activeIdx] = { ...weeklyConsultations[activeIdx], active: true };

  return {
    noShowSeries: noShowBuckets,
    noShowCurrentRate,
    noShowHighlight,
    occupancyPct,
    comboPoints,
    comboAxisMax,
    cancellationPoints,
    weeklyCancellationDeltaPct,
    channelRows,
    channelLabels,
    weeklyConsultations,
    unitLabels: Array.from(unitSet).sort().slice(0, 3),
    professionalLabels: Array.from(professionalSet).sort().slice(0, 3),
  };
}

function FilterChip({
  children,
  active = false,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}) {
  const { isDark } = useClientDashboardTheme();
  return (
    <button
      type="button"
      className={cn(
        "rounded px-3 py-1 text-xs font-medium transition-colors",
        active
          ? isDark
            ? "border border-white/5 bg-white/10 text-white"
            : "border border-gray-200 bg-gray-200 text-gray-800"
          : isDark
            ? "text-zinc-400 hover:bg-white/5 hover:text-white"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-800",
        className,
      )}
    >
      {children}
    </button>
  );
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { isDark } = useClientDashboardTheme();
  return (
    <m.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 18, mass: 0.8 }}
      className={cn(
        "flex h-80 flex-col rounded-xl border p-5 shadow-sm",
        isDark ? "border-zinc-800 bg-[#121212]" : "border-gray-200 bg-white",
        className,
      )}
    >
      <h3 className={cn("mb-4 text-lg font-semibold", isDark ? "text-white" : "text-gray-900")}>{title}</h3>
      {children}
    </m.section>
  );
}

export default function AgendaNoShowOverviewBoard({
  planLabel = "Essential Plan",
  appearance = "auto",
  facts = [],
  hideHeader = false,
}: AgendaNoShowOverviewBoardProps) {
  const { isDark: dashboardIsDark } = useClientDashboardTheme();
  const isDark =
    appearance === "auto" ? dashboardIsDark : appearance === "dark";
  const reduceMotion = useReducedMotion();
  const data = useMemo(() => deriveAgendaBoardData(facts), [facts]);
  const COMBO_POINTS = data.comboPoints;
  const CANCELLATION_POINTS = data.cancellationPoints;
  const CHANNEL_ROWS = data.channelRows;
  const WEEKLY_CONSULTATIONS = data.weeklyConsultations;

  const noShowPolyline = useMemo(() => buildPolyPoints(data.noShowSeries.map(point => point.y)), [data.noShowSeries]);
  const noShowAreaPath = useMemo(() => {
    if (data.noShowSeries.length === 0) return "M0,200 L500,200 Z";
    const topPath = data.noShowSeries
      .map((point, index) => `${index === 0 ? "M" : "L"} ${Math.round((500 * index) / Math.max(data.noShowSeries.length - 1, 1))},${point.y}`)
      .join(" ");
    return `${topPath} L 500,200 L 0,200 Z`;
  }, [data.noShowSeries]);
  const comboLinePath = useMemo(() => buildComboLinePath(COMBO_POINTS), [COMBO_POINTS]);
  const cancellationLinePath = useMemo(() => buildCancellationLinePath(CANCELLATION_POINTS), [CANCELLATION_POINTS]);
  const cancellationAreaPath = useMemo(() => buildCancellationAreaPath(CANCELLATION_POINTS), [CANCELLATION_POINTS]);
  const noShowHighlightIndex = useMemo(() => {
    if (!data.noShowHighlight) return -1;
    return data.noShowSeries.findIndex(
      point => point.label === data.noShowHighlight?.label && point.rate === data.noShowHighlight?.rate,
    );
  }, [data.noShowHighlight, data.noShowSeries]);
  const noShowHighlightPoint = noShowHighlightIndex >= 0 ? data.noShowSeries[noShowHighlightIndex] ?? null : null;
  const noShowHighlightX = noShowHighlightIndex >= 0
    ? Math.round((500 * noShowHighlightIndex) / Math.max(data.noShowSeries.length - 1, 1))
    : 0;
  const noShowTickIndices = [0, 1, 3, 4, 6, 7, 9, 10];
  const noShowTickLabels = noShowTickIndices
    .map(index => data.noShowSeries[index]?.label)
    .filter((value): value is string => Boolean(value));
  const comboAxisLeftLabels = [
    data.comboAxisMax,
    Math.round(data.comboAxisMax * 0.8),
    Math.round(data.comboAxisMax * 0.6),
    Math.round(data.comboAxisMax * 0.4),
    Math.round(data.comboAxisMax * 0.2),
    0,
  ];
  const weeklyConsultationsMax = Math.max(...WEEKLY_CONSULTATIONS.map(item => item.value), 0, 1);

  const cardClass = isDark ? "border-zinc-800 bg-[#121212]" : "border-gray-200 bg-white";
  const muted = isDark ? "text-zinc-400" : "text-gray-500";
  const axisBorder = isDark ? "border-zinc-700" : "border-gray-300";
  const innerBorder = isDark ? "border-zinc-800" : "border-gray-200";
  const pageText = isDark ? "text-white" : "text-gray-900";

  return (
    <div className={cn("space-y-6", isDark ? "text-white" : "text-gray-900")}>
      {!hideHeader ? <div className="mb-6">
        <h1 className={cn("mb-4 text-2xl font-bold", pageText)}>{planLabel}: Agenda &amp; No-Show Overview</h1>
        <m.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className={cn("rounded-lg border p-3 shadow-sm", cardClass)}
        >
          <div className="flex flex-wrap items-center gap-3">
            <div className={cn("mr-2 flex items-center border-r pr-4", innerBorder)}>
              <span className={cn("mr-2 text-sm", muted)}>Period:</span>
              <select
                className={cn(
                  "cursor-pointer border-none bg-transparent p-0 text-sm font-medium outline-none ring-0",
                  pageText,
                )}
                defaultValue="Last 30 Days"
              >
                <option className={isDark ? "bg-[#121212]" : "bg-white"}>Last 30 Days</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-1">
              <FilterChip>7 days</FilterChip>
              <FilterChip active>30 days</FilterChip>
              <FilterChip>3 months</FilterChip>
              <FilterChip>1 year</FilterChip>
            </div>

            <div className={cn("mx-2 hidden h-6 w-px sm:block", isDark ? "bg-zinc-800" : "bg-gray-200")} />

            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("text-sm", muted)}>Unit:</span>
              <select
                defaultValue="All Clinics"
                className={cn(
                  "rounded border px-2 py-1 text-sm focus:border-[#FF6600] focus:outline-none focus:ring-1 focus:ring-[#FF6600]",
                  isDark ? "border-zinc-800 bg-black text-gray-300" : "border-gray-200 bg-gray-50 text-gray-700",
                )}
              >
                <option>All Clinics</option>
                {data.unitLabels.map(unit => (
                  <option key={unit}>{unit}</option>
                ))}
              </select>
              <div className="ml-1 flex flex-wrap gap-1">
                {(data.unitLabels.length > 0 ? data.unitLabels : ["No unit data"]).map((unit, index) => (
                  <span
                    key={`${unit}-${index}`}
                    className={cn(
                      "rounded border px-2 py-1 text-xs",
                      index === 0
                        ? isDark
                          ? "border-[#FF6600]/20 bg-[#FF6600]/20 text-[#FF6600]"
                          : "border-gray-200 bg-gray-100 text-gray-700"
                        : "cursor-pointer border-transparent",
                      index > 0 && muted,
                    )}
                  >
                    {unit}
                  </span>
                ))}
              </div>
            </div>

            <div className={cn("mx-2 hidden h-6 w-px lg:block", isDark ? "bg-zinc-800" : "bg-gray-200")} />

            <div className="hidden items-center gap-2 lg:flex">
              <span className={cn("text-sm", muted)}>Employee:</span>
              <select
                defaultValue="All Staff"
                className={cn(
                  "rounded border px-2 py-1 text-sm focus:border-[#FF6600] focus:outline-none focus:ring-1 focus:ring-[#FF6600]",
                  isDark ? "border-zinc-800 bg-black text-gray-300" : "border-gray-200 bg-gray-50 text-gray-700",
                )}
              >
                <option>All Staff</option>
                {data.professionalLabels.map(pro => (
                  <option key={pro}>{pro}</option>
                ))}
              </select>
              <div className="ml-1 flex gap-1">
                {(data.professionalLabels.length > 0 ? data.professionalLabels : ["No staff data"]).map((pro, index) => (
                  <span
                    key={`${pro}-${index}`}
                    className={cn(
                      "rounded border px-2 py-1 text-xs",
                      index === 0
                        ? isDark
                          ? "border-[#FF6600]/20 bg-[#FF6600]/20 text-[#FF6600]"
                          : "border-gray-200 bg-gray-100 text-gray-700"
                        : "cursor-pointer border-transparent",
                      index > 0 && muted,
                    )}
                  >
                    {pro}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </m.div>
      </div> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ChartCard title="1. No-Show Rate Trend">
          <div className={cn("relative flex h-full flex-1 items-end border-b border-l px-2 pb-6", axisBorder)}>
            <div className="pointer-events-none absolute inset-0 px-2 py-4">
              <div className="absolute left-0 right-0 top-[30%] flex items-center border-t border-dashed border-red-500 opacity-60">
                <span className={cn("ml-2 -mt-2 px-1 text-xs text-red-500", isDark ? "bg-[#121212]" : "bg-white")}>
                  Threshold &gt;15%
                </span>
              </div>
              <div className={cn("absolute bottom-[20%] left-0 right-0 flex items-center justify-end border-t border-dotted opacity-60", isDark ? "border-gray-600" : "border-gray-400")}>
                <span className={cn("mr-2 -mt-2 px-1 text-xs", isDark ? "bg-[#121212] text-gray-500" : "bg-white text-gray-400")}>
                  Target &lt;10%
                </span>
              </div>
              <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
                <defs>
                  <linearGradient id="glx-noshow-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#FF6600" stopOpacity={isDark ? 0.16 : 0.12} />
                    <stop offset="100%" stopColor="#FF6600" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <m.path
                  d={noShowAreaPath}
                  fill="url(#glx-noshow-fill)"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={reduceMotion ? undefined : { opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <m.polyline
                  fill="none"
                  points={noShowPolyline}
                  stroke="#FF6600"
                  strokeWidth="2"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  animate={reduceMotion ? undefined : { pathLength: 1 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                />
                {noShowHighlightPoint ? (
                  <>
                    <m.circle
                      cx={noShowHighlightX}
                      cy={noShowHighlightPoint.y}
                      r="4"
                      fill="#FF6600"
                      animate={reduceMotion ? undefined : { scale: [1, 1.18, 1], opacity: [0.9, 1, 0.9] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <circle cx={noShowHighlightX} cy={noShowHighlightPoint.y} r="10" fill="#FF6600" fillOpacity="0.16" />
                  </>
                ) : null}
              </svg>
              <m.div
                initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.25 }}
                className={cn(
                  "absolute left-[50%] top-[12%] z-10 whitespace-nowrap rounded border p-1.5 text-xs shadow",
                  isDark ? "border-zinc-600 bg-zinc-800 text-white" : "border-gray-200 bg-white text-gray-800",
                )}
              >
                <span className="font-bold">
                  {data.noShowHighlight ? `${data.noShowHighlight.label}: ${data.noShowHighlight.rate.toFixed(1)}%` : "No data: 0.0%"}
                </span>
                <span className={cn("block text-[10px] font-semibold", isDark ? "text-red-400" : "text-red-500")}>
                  {data.noShowHighlight
                    ? data.noShowHighlight.aboveThreshold
                      ? "(Above Threshold)"
                      : "(Within Target)"
                    : "(No data)"}
                </span>
              </m.div>
            </div>
          </div>
          <div className={cn("mt-2 flex justify-between px-2 text-[10px]", muted)}>
            {noShowTickLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <div>
              <span className={muted}>Current No-Show Rate: </span>
              <span className="ml-1 font-bold text-[#FF6600]">{data.noShowCurrentRate.toFixed(1)}%</span>
            </div>
            {isDark && data.noShowCurrentRate > THRESHOLD_NOSHOW ? (
              <span className="flex items-center rounded border border-red-500/20 bg-red-500/10 px-2 py-0.5 text-xs text-red-500">
                <AlertTriangle className="mr-1 h-3.5 w-3.5" /> Action Required
              </span>
            ) : null}
          </div>
        </ChartCard>

        <ChartCard title="2. Occupancy Rate (Bullet Chart)">
          <div className="flex flex-1 flex-col justify-center gap-6">
            <div className={cn("relative h-20 w-full rounded border px-4", isDark ? "border-zinc-800 bg-black" : "bg-gray-100")}>
              <div className={cn("absolute left-4 right-4 top-6 h-8 rounded-sm", isDark ? "bg-zinc-800/50" : "bg-gray-300/70")} />
              <div className={cn("absolute left-[60%] top-6 h-8 w-[15%]", isDark ? "bg-zinc-700/50" : "bg-orange-200/70")} />
              <div className={cn("absolute left-[75%] top-6 h-8 w-[20%]", isDark ? "bg-zinc-600/50" : "bg-orange-300/80")} />
              <m.div
                initial={reduceMotion ? false : { width: 0 }}
                animate={reduceMotion ? undefined : { width: `${clamp(data.occupancyPct, 0, 100)}%` }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className={cn(
                  "absolute left-4 top-[2.1rem] z-10 h-3",
                  isDark ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "bg-slate-800",
                )}
              />
              <div className="absolute left-[75%] top-5 z-20 h-10 w-0.5 bg-[#FF6600]" />
              <span className={cn("absolute -top-2 left-[75%] -translate-x-1/2 text-xs", isDark ? "text-[#FF6600]" : "text-gray-500")}>Target</span>
              <span className={cn("absolute top-[3.5rem] -translate-x-1/2 text-xs font-bold", pageText)} style={{ left: `${clamp(data.occupancyPct, 0, 100)}%` }}>
                {data.occupancyPct.toFixed(1)}%
              </span>
            </div>
            <div className={cn("-mt-2 flex justify-between px-4 text-xs", muted)}>
              <span>0</span>
              <div className="flex gap-16 md:gap-24">
                <span>{isDark ? `Risk <${OCCUPANCY_RISK_THRESHOLD}%` : `0-${OCCUPANCY_RISK_THRESHOLD}%`}</span>
                <span>70%</span>
                <span>{isDark ? `Target ${OCCUPANCY_TARGET}%` : `${OCCUPANCY_TARGET}%`}</span>
              </div>
            </div>
            {!isDark ? <div className="mt-[-10px] pl-4 text-xs text-red-400">Risk Zone: &lt;{OCCUPANCY_RISK_THRESHOLD}%</div> : null}
          </div>
          <div className={cn("mt-auto flex gap-4 border-t pt-2 text-sm", innerBorder)}>
            <div><span className={muted}>Current Occupancy:</span><span className={cn("ml-1 font-semibold", pageText)}>{data.occupancyPct.toFixed(1)}%</span></div>
            <div className={isDark ? "text-zinc-700" : "text-gray-300"}>|</div>
            <div><span className={muted}>Meta Target:</span><span className="ml-1 font-semibold text-[#FF6600]">&gt;{OCCUPANCY_TARGET}%</span></div>
            <div className={isDark ? "text-zinc-700" : "text-gray-300"}>|</div>
            <div className={cn("flex items-center text-xs", muted)}>Risk Zone: &lt;{OCCUPANCY_RISK_THRESHOLD}%</div>
          </div>
        </ChartCard>

        <ChartCard title="3. Confirmations (Combo Chart)">
          <div className="relative h-full flex-1 pt-4">
            <div className={cn("absolute bottom-6 left-0 top-0 flex h-[80%] flex-col justify-between text-[10px]", muted)}>
              {comboAxisLeftLabels.map((value, idx) => (
                <span key={`combo-axis-left-${idx}`}>
                  {isDark && value >= 1000 ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k` : value.toLocaleString("en-US")}
                </span>
              ))}
            </div>
            <div className={cn("absolute bottom-6 right-0 top-0 flex h-[80%] flex-col justify-between text-[10px] text-right", muted)}>
              <span>100%</span><span>80%</span><span>60%</span><span>40%</span><span>20%</span><span>0%</span>
            </div>

            <div className={cn("relative ml-8 mr-8 flex h-[80%] items-end justify-between gap-1 border-b pb-1", isDark ? "border-zinc-700" : "border-gray-200")}>
              {COMBO_POINTS.map((p, idx) => (
                <div key={`${p.day}-${idx}`} className="group flex h-full flex-1 flex-col items-center justify-end gap-0.5">
                  <m.div
                    initial={reduceMotion ? false : { height: 0 }}
                    animate={reduceMotion ? undefined : { height: `${p.confirmedPct}%` }}
                    transition={{ duration: 0.55, delay: idx * 0.03, ease: "easeOut" }}
                    className={cn("w-2", isDark ? "bg-zinc-600" : "bg-blue-500")}
                  />
                  <m.div
                    initial={reduceMotion ? false : { height: 0 }}
                    animate={reduceMotion ? undefined : { height: `${p.unconfirmedPct}%` }}
                    transition={{ duration: 0.45, delay: idx * 0.03 + 0.06, ease: "easeOut" }}
                    className="w-2 bg-[#FF6600]"
                  />
                </div>
              ))}

              <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible">
                <m.path
                  d={comboLinePath}
                  fill="none"
                  stroke={isDark ? "#ffffff" : "#111827"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  animate={reduceMotion ? undefined : { pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.12, ease: "easeOut" }}
                />
                {[0, 5, 9].filter(i => i < COMBO_POINTS.length).map((i) => (
                  <circle
                    key={i}
                    cx={10 + i * 25}
                    cy={COMBO_POINTS[i]!.lineY}
                    r="3"
                    className={cn(isDark ? "fill-[#121212] stroke-white" : "fill-white stroke-gray-900")}
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>

            <div className={cn("ml-8 mr-8 mt-1 flex justify-between text-[10px]", muted)}>
              {COMBO_POINTS.map((p, i) => <span key={`${p.day}-label-${i}`}>{p.day}</span>)}
            </div>

            <div className="mt-2 flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-1">
                <div className={cn("h-3 w-3 rounded-sm", isDark ? "bg-zinc-600" : "bg-blue-500")} />
                <span className={cn("text-xs", muted)}>Confirmed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-[#FF6600]" />
                <span className={cn("text-xs", muted)}>Unconfirmed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className={cn("relative h-1 w-3 rounded-sm", isDark ? "bg-white" : "bg-gray-900")}>
                  <div className={cn("absolute -top-1 left-1 h-1 w-1 rounded-full border", isDark ? "border-white" : "border-gray-900")} />
                </div>
                <span className={cn("text-xs", muted)}>Confirmation Rate %</span>
              </div>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="4. Cancellations Trend Line">
          <div className="relative flex h-full flex-1 items-end pb-8">
            <svg className="h-[80%] w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="glx-cancel-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FF6600" stopOpacity={isDark ? 0.25 : 0.18} />
                  <stop offset="100%" stopColor="#FF6600" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[50, 100, 150].map((y) => (
                <line
                  key={y}
                  x1="0"
                  x2="500"
                  y1={y}
                  y2={y}
                  stroke={isDark ? "#27272a" : "#e5e7eb"}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
              <m.path
                d={cancellationAreaPath}
                fill="url(#glx-cancel-fill)"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={reduceMotion ? undefined : { opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <m.path
                d={cancellationLinePath}
                fill="none"
                stroke="#FF6600"
                strokeWidth="2"
                initial={reduceMotion ? false : { pathLength: 0 }}
                animate={reduceMotion ? undefined : { pathLength: 1 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />

              {CANCELLATION_POINTS.filter(p => p.tag).map((p, idx) => (
                <m.g
                  key={`${p.x}-${p.y}`}
                  transform={`translate(${p.x},${p.y})`}
                  initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + idx * 0.08, duration: 0.25 }}
                >
                  <circle r="3" fill={isDark ? "#FFFFFF" : "#ef4444"} />
                  {(() => {
                    const tagWidth = Math.max(36, (p.tag?.length ?? 0) * 7 + 10);
                    return (
                  <rect
                    x={-tagWidth / 2}
                    y={-32}
                    width={tagWidth}
                    height="18"
                    rx="4"
                    fill={isDark ? "#121212" : "#ffffff"}
                    stroke="#ef4444"
                    strokeWidth="1"
                  />
                    );
                  })()}
                  <text x="0" y="-20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">{p.tag}</text>
                </m.g>
              ))}
            </svg>
          </div>
          <div className={cn("mt-auto flex items-center justify-between border-t pt-2", innerBorder)}>
            <span className={cn("text-sm", muted)}>Weekly Cancellations:</span>
            <div className="flex items-center gap-1">
              {isDark ? (
                <TrendingDown className={cn("h-4 w-4", data.weeklyCancellationDeltaPct <= 0 ? "text-green-500" : "text-red-400 rotate-180")} />
              ) : null}
              <span className={cn("text-sm font-bold", isDark ? "text-white" : "text-gray-900")}>
                {`${data.weeklyCancellationDeltaPct > 0 ? "+" : ""}${data.weeklyCancellationDeltaPct.toFixed(1)}%`}
              </span>
              {isDark ? <span className={cn("text-xs", muted)}>(vs last week)</span> : null}
            </div>
          </div>
        </ChartCard>

        <ChartCard title={isDark ? "5. Appointments by Channel" : "5. Appointments by Channel (Stacked Bar)"}>
          <div className="flex flex-1 flex-col justify-center gap-3">
            {CHANNEL_ROWS.map((row, rowIndex) => {
              const total = row.values.reduce((sum, value) => sum + value, 0);
              const segments = [
                { key: "s1", value: row.values[0], className: "bg-[#FF6600] text-white" },
                { key: "s2", value: row.values[1], className: isDark ? "bg-zinc-700 text-white" : "bg-orange-700 text-white" },
                { key: "s3", value: row.values[2], className: isDark ? "bg-zinc-800 text-white" : "bg-slate-500 text-white" },
                { key: "s4", value: row.values[3], className: isDark ? "bg-zinc-900 text-gray-400" : "bg-gray-300 text-gray-700" },
              ];
              return (
                <div key={row.week} className="group flex items-center text-xs">
                  <span className={cn("w-12 transition-colors", muted, isDark ? "group-hover:text-white" : "group-hover:text-gray-800")}>{row.week}</span>
                  <div className={cn("mx-2 flex h-5 flex-1 overflow-hidden rounded border", isDark ? "border-zinc-900" : "border-gray-200")}>
                    {segments.map((segment, segIndex) => (
                      <m.div
                        key={segment.key}
                        initial={reduceMotion ? false : { scaleX: 0 }}
                        animate={reduceMotion ? undefined : { scaleX: 1 }}
                        transition={{ delay: rowIndex * 0.05 + segIndex * 0.04, duration: 0.45, ease: "easeOut" }}
                        style={{ width: `${total > 0 ? (segment.value / total) * 100 : 0}%`, transformOrigin: "left center" }}
                        className={cn("flex items-center justify-center text-[10px]", segment.className)}
                      >
                        {segment.value}
                      </m.div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-sm bg-[#FF6600]" />
              <span className={muted}>{data.channelLabels[0]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-3 w-3 rounded-sm", isDark ? "bg-zinc-700" : "bg-orange-700")} />
              <span className={muted}>{data.channelLabels[1]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-3 w-3 rounded-sm", isDark ? "bg-zinc-800" : "bg-slate-500")} />
              <span className={muted}>{data.channelLabels[2]}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className={cn("h-3 w-3 rounded-sm border", isDark ? "border-zinc-700 bg-zinc-900" : "border-gray-300 bg-gray-300")} />
              <span className={muted}>{data.channelLabels[3]}</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title={isDark ? "6. Weekly Consultations" : "6. Weekly Consultations (Column Chart)"}>
          <div className="flex h-full flex-1 items-end justify-between px-4 pb-2 pt-6">
            {WEEKLY_CONSULTATIONS.map((item, idx) => {
              const height = item.value <= 0 ? 2 : Math.max(10, (item.value / weeklyConsultationsMax) * 140);
              return (
                <div key={item.day} className="group mx-1 flex w-full flex-col items-center gap-2">
                  {isDark ? (
                    <span className="mb-1 text-xs font-medium text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 group-hover:text-white">
                      {item.value || ""}
                    </span>
                  ) : (
                    <span className="mb-1 text-xs text-gray-800">{item.value || ""}</span>
                  )}
                  <m.div
                    initial={reduceMotion ? false : { height: 0 }}
                    animate={reduceMotion ? undefined : { height }}
                    transition={{ delay: 0.08 + idx * 0.05, duration: 0.55, ease: "easeOut" }}
                    className={cn(
                      "w-full max-w-[40px] rounded-t-sm",
                      isDark
                        ? item.active
                          ? "bg-gradient-to-t from-[#FF6600]/50 to-[#FF6600]"
                          : "bg-zinc-800"
                        : "bg-[#FF6600]",
                    )}
                    style={isDark && item.active ? { boxShadow: "0 0 15px rgba(255,102,0,0.25)" } : undefined}
                  />
                  <span className={cn("mt-2 text-xs", muted)}>{item.day}</span>
                </div>
              );
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
