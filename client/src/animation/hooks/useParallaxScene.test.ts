import { describe, expect, it } from "vitest";
import { resolveParallaxFactor, shouldUseTargetScroll } from "./useParallaxScene";

describe("useParallaxScene helpers", () => {
  it("uses target scroll only when enabled, motion is active and target is hydrated", () => {
    expect(
      shouldUseTargetScroll({
        enabled: true,
        motionLevel: "full",
        hasHydratedTarget: true,
      }),
    ).toBe(true);

    expect(
      shouldUseTargetScroll({
        enabled: true,
        motionLevel: "off",
        hasHydratedTarget: true,
      }),
    ).toBe(false);

    expect(
      shouldUseTargetScroll({
        enabled: true,
        motionLevel: "full",
        hasHydratedTarget: false,
      }),
    ).toBe(false);
  });

  it("resolves parallax factor by motion level", () => {
    expect(resolveParallaxFactor({ enabled: true, motionLevel: "full" })).toBe(1);
    expect(resolveParallaxFactor({ enabled: true, motionLevel: "lite" })).toBe(0.42);
    expect(resolveParallaxFactor({ enabled: true, motionLevel: "off" })).toBe(0);
    expect(resolveParallaxFactor({ enabled: false, motionLevel: "full" })).toBe(0);
  });
});

