import type { MotionLevel } from "@/animation/types";
import { motionDurations, motionEasings, motionSprings } from "./motionTokens";
import type { TargetAndTransition, Variants } from "framer-motion";

export function fadeInUp(distance = 18): Variants {
  return {
    hidden: { opacity: 0, y: distance },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionDurations.medium,
        ease: motionEasings.standard,
      },
    },
  };
}

export function fadeIn(): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: motionDurations.medium,
        ease: motionEasings.standard,
      },
    },
  };
}

export function scaleIn(start = 0.97): Variants {
  return {
    hidden: { opacity: 0, scale: start },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: motionDurations.medium,
        ease: motionEasings.smooth,
      },
    },
  };
}

export function slideInLeft(distance = 20): Variants {
  return {
    hidden: { opacity: 0, x: -distance },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: motionDurations.medium,
        ease: motionEasings.standard,
      },
    },
  };
}

export function slideInRight(distance = 20): Variants {
  return {
    hidden: { opacity: 0, x: distance },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: motionDurations.medium,
        ease: motionEasings.standard,
      },
    },
  };
}

export function staggerContainer(stagger = 0.06, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren,
      },
    },
  };
}

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionDurations.medium,
      ease: motionEasings.standard,
    },
  },
};

export const pageExit: Variants = {
  hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
  visible: {
    opacity: 0,
    y: -8,
    filter: "blur(3px)",
    transition: {
      duration: motionDurations.fast,
      ease: motionEasings.exit,
    },
  },
};

export function hoverLift(level: MotionLevel): TargetAndTransition {
  if (level === "off") return {};
  if (level === "lite") {
    return {
      y: -1,
      scale: 1.003,
      transition: motionSprings.soft,
    };
  }
  return {
    y: -4,
    scale: 1.012,
    transition: motionSprings.gentle,
  };
}

export function tapPress(level: MotionLevel): TargetAndTransition {
  if (level === "off") return {};
  if (level === "lite") {
    return {
      scale: 0.995,
      transition: {
        duration: motionDurations.instant,
        ease: motionEasings.standard,
      },
    };
  }
  return {
    scale: 0.985,
    transition: {
      duration: motionDurations.instant,
      ease: motionEasings.standard,
    },
  };
}

export const cardLayout = {
  layout: true as const,
  transition: motionSprings.gentle,
};

export const pageTransitions = {
  enter: pageEnter,
  exit: pageExit,
};

export function cardEntranceStagger(stagger = 0.06, delayChildren = 0.04): Variants {
  return staggerContainer(stagger, delayChildren);
}

export const pulseP1: TargetAndTransition = {
  scale: [1, 1.02, 1],
  boxShadow: [
    "0 0 0 rgba(239,68,68,0)",
    "0 0 24px rgba(239,68,68,0.18)",
    "0 0 0 rgba(239,68,68,0)",
  ],
  transition: {
    duration: 1.9,
    repeat: Infinity,
    ease: motionEasings.smooth,
  },
};

export const shimmerOnce: Variants = {
  hidden: { backgroundPositionX: "-120%" },
  visible: {
    backgroundPositionX: ["-120%", "120%"],
    transition: {
      duration: motionDurations.slow,
      ease: motionEasings.smooth,
    },
  },
};

export function tilt3D(level: MotionLevel) {
  if (level === "off") {
    return { maxTilt: 0, perspective: 0, shine: false };
  }
  if (level === "lite") {
    return { maxTilt: 4, perspective: 900, shine: false };
  }
  return { maxTilt: 6, perspective: 1100, shine: true };
}

export const scrollStorySteps: Variants = {
  inactive: {
    opacity: 0.4,
    y: 8,
    scale: 0.985,
    filter: "blur(3px)",
  },
  active: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
      mass: 0.9,
    },
  },
};
