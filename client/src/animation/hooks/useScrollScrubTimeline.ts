import { useEffect, useRef, type RefObject } from "react";
import type { MotionLevel } from "@/animation/types";
import { getGsapClient } from "@/animation/gsap/gsapClient";

type ScrubTarget = RefObject<HTMLElement | null> | string;

export interface ScrollScrubStep {
  target: ScrubTarget;
  to: Record<string, unknown>;
  from?: Record<string, unknown>;
  position?: number | string;
}

export interface ScrollScrubTimelineOptions {
  containerRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  motionLevel: MotionLevel;
  steps: ScrollScrubStep[];
  scrub?: number;
  start?: string;
  end?: string;
}

export function shouldCreateScrubTimeline({
  enabled,
  motionLevel,
  stepCount,
}: {
  enabled: boolean;
  motionLevel: MotionLevel;
  stepCount: number;
}): boolean {
  return enabled && motionLevel === "full" && stepCount > 0;
}

export function resolveScrubFactor(motionLevel: MotionLevel, scrubValue: number): number {
  if (motionLevel === "off") return 0;
  if (motionLevel === "lite") return Math.max(0.2, scrubValue * 0.45);
  return scrubValue;
}

export function useScrollScrubTimeline({
  containerRef,
  enabled,
  motionLevel,
  steps,
  scrub = 1,
  start = "top bottom",
  end = "bottom top",
}: ScrollScrubTimelineOptions) {
  const timelineRef = useRef<any>(null);

  useEffect(() => {
    const shouldRun = shouldCreateScrubTimeline({
      enabled,
      motionLevel,
      stepCount: steps.length,
    });

    if (!shouldRun || !containerRef.current) return;

    let isUnmounted = false;

    const setup = async () => {
      const gsapClient = await getGsapClient();
      if (!gsapClient || isUnmounted || !containerRef.current) return;

      const { gsap } = gsapClient;
      const scrubValue = resolveScrubFactor(motionLevel, scrub);

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: containerRef.current,
          start,
          end,
          scrub: scrubValue,
          invalidateOnRefresh: true,
        },
      });

      for (const step of steps) {
        const resolvedTarget =
          typeof step.target === "string" ? step.target : step.target.current;
        if (!resolvedTarget) continue;

        if (step.from) {
          timeline.fromTo(resolvedTarget, step.from, step.to, step.position);
          continue;
        }

        timeline.to(resolvedTarget, step.to, step.position);
      }

      timelineRef.current = timeline;
    };

    setup().catch(() => {
      // Fallback silencioso: motion continua com Framer caso GSAP falhe.
    });

    return () => {
      isUnmounted = true;
      if (!timelineRef.current) return;
      timelineRef.current.scrollTrigger?.kill();
      timelineRef.current.kill();
      timelineRef.current = null;
    };
  }, [containerRef, enabled, end, motionLevel, scrub, start, steps]);
}

