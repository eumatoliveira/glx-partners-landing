import { useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { useTypingText } from "@/animation/hooks/useTypingText";
import { resolveTypingStepMs, shouldEnableTypingText } from "@/animation/utils/perfGuards";

interface TypingTextProps {
  text: string;
  className?: string;
  cursorClassName?: string;
  mode?: "time" | "scroll";
  progress?: number;
  stepMs?: number;
  startDelayMs?: number;
  holdMs?: number;
  loop?: boolean;
  showCursor?: boolean;
  enabled?: boolean;
}

export function TypingText({
  text,
  className,
  cursorClassName,
  mode = "time",
  progress,
  stepMs,
  startDelayMs = 0,
  holdMs = 1000,
  loop = false,
  showCursor = true,
  enabled = true,
}: TypingTextProps) {
  const capabilities = useMotionCapabilities();
  const canType = enabled && shouldEnableTypingText(capabilities);
  const hostRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: hostRef,
    offset: ["start 90%", "end 20%"],
  });

  useMotionValueEvent(scrollYProgress, "change", value => {
    if (mode !== "scroll" || progress !== undefined) return;
    setScrollProgress(value);
  });

  const effectiveProgress = progress ?? scrollProgress;

  const typing = useTypingText({
    text,
    enabled: canType,
    mode,
    progress: effectiveProgress,
    stepMs: stepMs ?? resolveTypingStepMs(capabilities),
    startDelayMs,
    holdMs,
    loop,
  });

  const cursorVisible = showCursor && canType && !typing.isComplete;
  return (
    <m.span ref={hostRef as any} className={cn("inline-flex items-baseline", className)}>
      <span>{typing.displayText}</span>
      {cursorVisible ? (
        <span
          aria-hidden="true"
          className={cn(
            "ml-0.5 inline-block h-[1em] w-[0.08em] animate-pulse rounded-full bg-current",
            cursorClassName,
          )}
        />
      ) : null}
    </m.span>
  );
}
