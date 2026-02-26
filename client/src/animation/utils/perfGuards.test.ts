import { describe, expect, it } from "vitest";
import type { MotionCapabilities } from "@/animation/types";
import {
  resolveAnimationDuration,
  resolveBlurRadius,
  resolveGsapScrubValue,
  resolveParallaxStrength,
  resolveTypingStepMs,
  shouldEnableDragMotion,
  shouldEnableGlowPulse,
  shouldEnableGsapScrollScrub,
  shouldEnableHoverMotion,
  shouldEnableParallax,
  shouldEnableTypingText,
} from "./perfGuards";

const fullCaps: MotionCapabilities = {
  tier: "desktop",
  width: 1440,
  height: 900,
  isLandscape: true,
  canHover: true,
  isCoarsePointer: false,
  prefersReducedMotion: false,
  inputMode: "mouse",
  motionLevel: "full",
};

describe("perfGuards", () => {
  it("enables interactive motion for full desktop capabilities", () => {
    expect(shouldEnableParallax(fullCaps)).toBe(true);
    expect(shouldEnableHoverMotion(fullCaps)).toBe(true);
    expect(shouldEnableDragMotion(fullCaps)).toBe(true);
    expect(shouldEnableGsapScrollScrub(fullCaps)).toBe(true);
    expect(shouldEnableTypingText(fullCaps)).toBe(true);
    expect(shouldEnableGlowPulse(fullCaps)).toBe(true);
    expect(resolveParallaxStrength(fullCaps)).toBe(1);
    expect(resolveGsapScrubValue(fullCaps)).toBe(0.9);
    expect(resolveTypingStepMs(fullCaps)).toBe(26);
  });

  it("disables expensive motion for off level", () => {
    const reduced: MotionCapabilities = { ...fullCaps, motionLevel: "off", prefersReducedMotion: true };
    expect(shouldEnableParallax(reduced)).toBe(false);
    expect(shouldEnableHoverMotion(reduced)).toBe(false);
    expect(shouldEnableDragMotion(reduced)).toBe(false);
    expect(shouldEnableGsapScrollScrub(reduced)).toBe(false);
    expect(shouldEnableTypingText(reduced)).toBe(false);
    expect(shouldEnableGlowPulse(reduced)).toBe(false);
    expect(resolveBlurRadius(reduced, 100)).toBe(0);
    expect(resolveAnimationDuration(reduced, 0.5)).toBe(0);
    expect(resolveParallaxStrength(reduced)).toBe(0);
    expect(resolveGsapScrubValue(reduced)).toBe(0);
    expect(resolveTypingStepMs(reduced)).toBe(0);
  });

  it("keeps lite mode conservative", () => {
    const liteTouch: MotionCapabilities = {
      ...fullCaps,
      inputMode: "touch",
      motionLevel: "lite",
      isCoarsePointer: true,
      canHover: false,
      tier: "mobile",
      width: 390,
      height: 844,
    };

    expect(shouldEnableParallax(liteTouch)).toBe(false);
    expect(shouldEnableHoverMotion(liteTouch)).toBe(false);
    expect(shouldEnableDragMotion(liteTouch)).toBe(false);
    expect(shouldEnableGsapScrollScrub(liteTouch)).toBe(false);
    expect(shouldEnableTypingText(liteTouch)).toBe(true);
    expect(shouldEnableGlowPulse(liteTouch)).toBe(true);
    expect(resolveBlurRadius(liteTouch, 100)).toBe(45);
    expect(resolveAnimationDuration(liteTouch, 1)).toBe(0.8);
    expect(resolveParallaxStrength(liteTouch)).toBe(0);
    expect(resolveGsapScrubValue(liteTouch)).toBe(0);
    expect(resolveTypingStepMs(liteTouch)).toBe(42);
  });
});
