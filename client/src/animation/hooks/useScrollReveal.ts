import { useMemo } from "react";
import type { MotionLevel } from "@/animation/types";
import { fadeInUp, slideInLeft, slideInRight } from "@/animation/config/motionPresets";
import { motionDurations, motionEasings } from "@/animation/config/motionTokens";

interface ScrollRevealOptions {
  axis?: "y" | "x-left" | "x-right";
  distance?: number;
  once?: boolean;
  amount?: number;
  delay?: number;
  duration?: number;
  motionLevel: MotionLevel;
}

export function useScrollReveal({
  axis = "y",
  distance = 18,
  once = true,
  amount = 0.2,
  delay = 0,
  duration = motionDurations.medium,
  motionLevel,
}: ScrollRevealOptions) {
  const levelDistance = motionLevel === "full" ? distance : motionLevel === "lite" ? distance * 0.45 : 0;

  const variants = useMemo(() => {
    if (axis === "x-left") return slideInLeft(levelDistance);
    if (axis === "x-right") return slideInRight(levelDistance);
    return fadeInUp(levelDistance);
  }, [axis, levelDistance]);

  return {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once, amount },
    transition: {
      duration: motionLevel === "off" ? 0 : duration,
      delay,
      ease: motionEasings.standard,
    },
    variants,
  };
}
