import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number; // seconds (compat with existing usage)
  duration?: number; // seconds (compat with existing usage)
  progress?: number; // 0..1 external progress (e.g., scroll scrub)
  className?: string;
  startCounting?: boolean;
  startWhen?: boolean;
  separator?: string;
  decimals?: number;
  easing?: (t: number) => number;
  format?: (value: number) => string;
  onStart?: () => void;
  onEnd?: () => void;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function formatCount(value: number, decimals: number, separator?: string) {
  const safeDecimals = Math.max(0, decimals);
  const rounded = Number(value.toFixed(safeDecimals));
  const [intPart, decimalPart] = rounded.toFixed(safeDecimals).split(".");
  const normalizedInt = separator ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : intPart;
  if (!decimalPart || safeDecimals <= 0) return normalizedInt;
  return `${normalizedInt}.${decimalPart}`;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 1,
  progress,
  className,
  startCounting,
  startWhen = true,
  separator,
  decimals = 0,
  easing = easeOutCubic,
  format,
  onStart,
  onEnd,
}: CountUpProps) {
  const capabilities = useMotionCapabilities();
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.25, margin: "-60px" as any });
  const shouldStart = startCounting ?? startWhen;
  const startValue = direction === "down" ? to : from;
  const endValue = direction === "down" ? from : to;
  const progressMode = typeof progress === "number";

  const initialDisplay = useMemo(
    () => (format ? format(startValue) : formatCount(startValue, decimals, separator)),
    [decimals, format, separator, startValue],
  );
  const [display, setDisplay] = useState(initialDisplay);
  const startedRef = useRef(false);
  const endedRef = useRef(false);

  // Reset if target values change before animation starts (or component reuses with different KPI)
  useEffect(() => {
    startedRef.current = false;
    endedRef.current = false;
    setDisplay(format ? format(startValue) : formatCount(startValue, decimals, separator));
  }, [decimals, endValue, format, separator, startValue]);

  useEffect(() => {
    if (!progressMode) return;

    if (!shouldStart) {
      setDisplay(format ? format(startValue) : formatCount(startValue, decimals, separator));
      return;
    }

    const reduced = capabilities.prefersReducedMotion || capabilities.motionLevel === "off";
    const normalizedProgress = reduced ? 1 : Math.max(0, Math.min(1, progress ?? 0));
    const eased = easing(normalizedProgress);
    const value = startValue + (endValue - startValue) * eased;
    const fixed = Number(value.toFixed(Math.max(0, decimals)));
    setDisplay(format ? format(fixed) : formatCount(fixed, decimals, separator));

    if (normalizedProgress > 0 && !startedRef.current) {
      startedRef.current = true;
      onStart?.();
    }

    if (normalizedProgress >= 1 && !endedRef.current) {
      endedRef.current = true;
      onEnd?.();
    }
  }, [
    capabilities.motionLevel,
    capabilities.prefersReducedMotion,
    decimals,
    easing,
    endValue,
    format,
    onEnd,
    onStart,
    progress,
    progressMode,
    separator,
    shouldStart,
    startValue,
  ]);

  useEffect(() => {
    if (progressMode) return;
    if (!shouldStart) return;

    const reduced = capabilities.prefersReducedMotion || capabilities.motionLevel === "off";
    if (!inView) {
      if (!startedRef.current) {
        setDisplay(format ? format(startValue) : formatCount(startValue, decimals, separator));
      }
      return;
    }

    if (startedRef.current) return;

    if (reduced) {
      startedRef.current = true;
      onStart?.();
      setDisplay(format ? format(endValue) : formatCount(endValue, decimals, separator));
      if (!endedRef.current) {
        endedRef.current = true;
        onEnd?.();
      }
      return;
    }

    startedRef.current = true;
    onStart?.();

    let rafId = 0;
    let startTs = 0;
    const delayMs = Math.max(0, delay * 1000);
    const durationMs = Math.max(120, duration * 1000);

    const render = (value: number) => {
      const fixed = Number(value.toFixed(Math.max(0, decimals)));
      setDisplay(format ? format(fixed) : formatCount(fixed, decimals, separator));
    };

    const tick = (now: number) => {
      if (!startTs) startTs = now;
      const elapsed = now - startTs;
      if (elapsed < delayMs) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const t = Math.min(1, (elapsed - delayMs) / durationMs);
      const eased = easing(t);
      const value = startValue + (endValue - startValue) * eased;
      render(value);

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (!endedRef.current) {
        endedRef.current = true;
        onEnd?.();
      }
    };

    render(startValue);
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [
    capabilities.motionLevel,
    capabilities.prefersReducedMotion,
    decimals,
    delay,
    duration,
    easing,
    endValue,
    format,
    inView,
    onEnd,
    onStart,
    separator,
    shouldStart,
    startValue,
    progressMode,
  ]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </span>
  );
}
