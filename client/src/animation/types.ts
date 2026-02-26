export type MotionLevel = "off" | "lite" | "full";

export type ViewportTier = "mobile" | "tablet" | "notebook" | "desktop" | "tv";

export type InputMode = "touch" | "mouse" | "remote";

export type MotionPresetKey =
  | "fadeInUp"
  | "fadeIn"
  | "scaleIn"
  | "slideInLeft"
  | "slideInRight"
  | "staggerContainer"
  | "pageEnter"
  | "pageExit"
  | "hoverLift"
  | "tapPress"
  | "cardLayout"
  | "typingText"
  | "glowPulse"
  | "scrollScrub"
  | "wordHighlight";

export interface MotionCapabilities {
  tier: ViewportTier;
  width: number;
  height: number;
  isLandscape: boolean;
  canHover: boolean;
  isCoarsePointer: boolean;
  prefersReducedMotion: boolean;
  inputMode: InputMode;
  motionLevel: MotionLevel;
}
