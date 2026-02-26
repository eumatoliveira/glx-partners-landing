import type { MotionCapabilities } from "@/animation/types";

export function shouldEnableParallax(capabilities: MotionCapabilities): boolean {
  if (capabilities.motionLevel === "off") return false;
  if (capabilities.inputMode === "touch" && capabilities.motionLevel === "lite") return false;
  return true;
}

export function shouldEnableGsapScrollScrub(capabilities: MotionCapabilities): boolean {
  if (capabilities.motionLevel !== "full") return false;
  if (capabilities.prefersReducedMotion) return false;
  if (capabilities.inputMode !== "mouse") return false;
  return capabilities.tier !== "mobile" && capabilities.tier !== "tablet";
}

export function shouldEnableTypingText(capabilities: MotionCapabilities): boolean {
  if (capabilities.motionLevel === "off") return false;
  if (capabilities.prefersReducedMotion) return false;
  return true;
}

export function shouldEnableGlowPulse(capabilities: MotionCapabilities): boolean {
  if (capabilities.motionLevel === "off") return false;
  if (capabilities.prefersReducedMotion) return false;
  return true;
}

export function shouldEnableHoverMotion(capabilities: MotionCapabilities): boolean {
  if (capabilities.motionLevel === "off") return false;
  return capabilities.canHover && capabilities.inputMode !== "touch";
}

export function shouldEnableDragMotion(capabilities: MotionCapabilities): boolean {
  if (capabilities.motionLevel !== "full") return false;
  return capabilities.canHover && capabilities.inputMode === "mouse";
}

export function shouldEnableParticles(capabilities: MotionCapabilities): boolean {
  if (capabilities.prefersReducedMotion) return false;
  if (capabilities.motionLevel !== "full") return false;
  if (capabilities.inputMode !== "mouse") return false;
  return capabilities.tier === "desktop" || capabilities.tier === "tv" || capabilities.tier === "notebook";
}

export function resolveParallaxStrength(capabilities: MotionCapabilities): number {
  if (capabilities.motionLevel === "off") return 0;
  if (!shouldEnableParallax(capabilities)) return 0;
  if (capabilities.motionLevel === "lite") return 0.4;
  return 1;
}

export function resolveGsapScrubValue(capabilities: MotionCapabilities): number {
  if (!shouldEnableGsapScrollScrub(capabilities)) return 0;
  if (capabilities.tier === "desktop") return 0.9;
  if (capabilities.tier === "tv") return 0.7;
  return 0.8;
}

export function resolveBlurRadius(capabilities: MotionCapabilities, baseRadius: number): number {
  if (capabilities.motionLevel === "off") return 0;
  if (capabilities.motionLevel === "lite") return Math.round(baseRadius * 0.45);
  return baseRadius;
}

export function resolveAnimationDuration(capabilities: MotionCapabilities, baseDuration: number): number {
  if (capabilities.motionLevel === "off") return 0;
  if (capabilities.motionLevel === "lite") return Number((baseDuration * 0.8).toFixed(2));
  return baseDuration;
}

export function resolveTypingStepMs(capabilities: MotionCapabilities): number {
  if (!shouldEnableTypingText(capabilities)) return 0;
  if (capabilities.motionLevel === "lite") return 42;
  return 26;
}
