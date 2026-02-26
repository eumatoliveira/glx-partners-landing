import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TypingMode = "time" | "scroll";

export interface UseTypingTextOptions {
  text: string;
  enabled: boolean;
  mode?: TypingMode;
  progress?: number;
  stepMs?: number;
  startDelayMs?: number;
  holdMs?: number;
  loop?: boolean;
}

export function clampProgress(progress: number): number {
  if (Number.isNaN(progress)) return 0;
  if (progress < 0) return 0;
  if (progress > 1) return 1;
  return progress;
}

export function resolveTypedLengthByProgress(textLength: number, progress: number): number {
  return Math.round(textLength * clampProgress(progress));
}

export function resolveTypingStep(stepMs: number): number {
  if (!Number.isFinite(stepMs)) return 28;
  if (stepMs < 12) return 12;
  return Math.floor(stepMs);
}

export function useTypingText({
  text,
  enabled,
  mode = "time",
  progress = 0,
  stepMs = 28,
  startDelayMs = 0,
  holdMs = 1000,
  loop = false,
}: UseTypingTextOptions) {
  const [visibleCount, setVisibleCount] = useState(() => (enabled ? 0 : text.length));
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const safeStepMs = resolveTypingStep(stepMs);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      setVisibleCount(text.length);
      return;
    }

    if (mode === "scroll") {
      clearTimers();
      setVisibleCount(resolveTypedLengthByProgress(text.length, progress));
      return;
    }

    clearTimers();

    const startTypingCycle = () => {
      setVisibleCount(0);
      intervalRef.current = setInterval(() => {
        setVisibleCount(current => {
          if (current >= text.length) {
            if (!loop) {
              clearTimers();
              return current;
            }

            clearTimers();
            timeoutRef.current = setTimeout(startTypingCycle, holdMs);
            return current;
          }
          return current + 1;
        });
      }, safeStepMs);
    };

    timeoutRef.current = setTimeout(startTypingCycle, Math.max(0, startDelayMs));

    return clearTimers;
  }, [
    clearTimers,
    enabled,
    holdMs,
    loop,
    mode,
    progress,
    safeStepMs,
    startDelayMs,
    text.length,
  ]);

  useEffect(() => {
    if (!enabled || mode === "scroll") return;
    if (visibleCount > text.length) setVisibleCount(text.length);
  }, [enabled, mode, text.length, visibleCount]);

  const displayText = useMemo(() => text.slice(0, visibleCount), [text, visibleCount]);
  const isComplete = displayText.length >= text.length;
  const progressRatio = text.length === 0 ? 1 : displayText.length / text.length;

  const reset = useCallback(() => {
    setVisibleCount(0);
  }, []);

  return {
    displayText,
    visibleCount,
    isComplete,
    progressRatio,
    reset,
  };
}
