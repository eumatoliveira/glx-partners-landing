import { useEffect, useMemo, useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { shouldEnableTypingText } from "@/animation/utils/perfGuards";
import { clampProgress } from "@/animation/hooks/useTypingText";

interface ScrollWordHighlightProps {
  text: string;
  className?: string;
  wordClassName?: string;
  activeWordClassName?: string;
  progress?: number;
}

export function ScrollWordHighlight({
  text,
  className,
  wordClassName,
  activeWordClassName,
  progress,
}: ScrollWordHighlightProps) {
  const ref = useRef<HTMLParagraphElement | null>(null);
  const [localProgress, setLocalProgress] = useState(0);
  const capabilities = useMotionCapabilities();
  const enabled = shouldEnableTypingText(capabilities);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 25%"],
  });

  useMotionValueEvent(scrollYProgress, "change", value => {
    if (progress !== undefined || !enabled) return;
    setLocalProgress(value);
  });

  useEffect(() => {
    if (!enabled) setLocalProgress(1);
  }, [enabled]);

  const words = useMemo(() => text.trim().split(/\s+/), [text]);
  const effectiveProgress = clampProgress(progress ?? localProgress);
  const activeWords = Math.round(words.length * effectiveProgress);

  return (
    <m.p ref={ref} className={cn("leading-relaxed", className)}>
      {words.map((word, index) => {
        const active = enabled ? index < activeWords : true;
        return (
          <span
            key={`${word}-${index}`}
            className={cn(
              "mr-[0.3em] inline-block transition-colors duration-300",
              wordClassName,
              active ? activeWordClassName ?? "text-white" : "text-gray-500",
            )}
          >
            {word}
          </span>
        );
      })}
    </m.p>
  );
}

