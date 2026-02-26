export const motionDurations = {
  instant: 0.12,
  fast: 0.2,
  medium: 0.35,
  slow: 0.55,
} as const;

export const motionEasings = {
  standard: [0.16, 1, 0.3, 1] as const,
  smooth: [0.22, 1, 0.36, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  linear: "linear" as const,
} as const;

export const motionSprings = {
  gentle: {
    type: "spring" as const,
    stiffness: 110,
    damping: 18,
    mass: 0.9,
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 220,
    damping: 20,
    mass: 0.8,
  },
  soft: {
    type: "spring" as const,
    stiffness: 70,
    damping: 24,
    mass: 1,
  },
} as const;

export const viewportThresholds = {
  mobile: 640,
  tablet: 1024,
  notebook: 1440,
  desktop: 1920,
} as const;
