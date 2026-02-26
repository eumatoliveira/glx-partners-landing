import { useEffect, useMemo, useState, type RefObject } from "react";
import { useScroll, useSpring, useTransform, type UseScrollOptions } from "framer-motion";
import type { MotionLevel } from "@/animation/types";
import { motionSprings } from "@/animation/config/motionTokens";

export interface ParallaxSceneOptions {
  target?: RefObject<HTMLElement | null>;
  offset?: UseScrollOptions["offset"];
  motionLevel: MotionLevel;
  enabled?: boolean;
}

const DEFAULT_OFFSET = ["start end", "end start"] as NonNullable<UseScrollOptions["offset"]>;

export function shouldUseTargetScroll({
  enabled,
  motionLevel,
  hasHydratedTarget,
}: {
  enabled: boolean;
  motionLevel: MotionLevel;
  hasHydratedTarget: boolean;
}): boolean {
  return enabled && motionLevel !== "off" && hasHydratedTarget;
}

export function resolveParallaxFactor({
  enabled,
  motionLevel,
}: {
  enabled: boolean;
  motionLevel: MotionLevel;
}): number {
  if (!enabled || motionLevel === "off") return 0;
  return motionLevel === "full" ? 1 : 0.42;
}

export function useParallaxScene({
  target,
  offset = DEFAULT_OFFSET,
  motionLevel,
  enabled = true,
}: ParallaxSceneOptions) {
  const [hasHydratedTarget, setHasHydratedTarget] = useState(false);

  useEffect(() => {
    if (!target) {
      setHasHydratedTarget(false);
      return;
    }

    let rafId = -1;
    const hydrate = () => setHasHydratedTarget(Boolean(target.current));
    hydrate();

    if (!target.current && typeof window !== "undefined") {
      rafId = window.requestAnimationFrame(hydrate);
    }

    return () => {
      if (rafId !== -1 && typeof window !== "undefined") {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [target]);

  const useTargetScroll = shouldUseTargetScroll({
    enabled,
    motionLevel,
    hasHydratedTarget,
  });

  const scrollOptions = useMemo<UseScrollOptions>(() => {
    if (useTargetScroll && target) {
      return { target: target as RefObject<HTMLElement>, offset };
    }

    return { offset };
  }, [offset, target, useTargetScroll]);

  const { scrollYProgress } = useScroll(scrollOptions);

  const smoothProgress = useSpring(scrollYProgress, motionSprings.soft);
  const factor = resolveParallaxFactor({ enabled, motionLevel });

  const ySoft = useTransform(smoothProgress, [0, 1], [0, 22 * factor]);
  const yDeep = useTransform(smoothProgress, [0, 1], [0, 42 * factor]);
  const xSoft = useTransform(smoothProgress, [0, 1], [0, -10 * factor]);
  const rotateSoft = useTransform(smoothProgress, [0, 1], [0, -1.6 * factor]);
  const scaleSoft = useTransform(smoothProgress, [0, 1], [1, 1 + 0.045 * factor]);
  const opacitySoft = useTransform(smoothProgress, [0, 1], [1, 1 - 0.35 * factor]);

  return {
    progress: scrollYProgress,
    smoothProgress,
    ySoft,
    yDeep,
    xSoft,
    rotateSoft,
    scaleSoft,
    opacitySoft,
    hasHydratedTarget,
    useTargetScroll,
  };
}
