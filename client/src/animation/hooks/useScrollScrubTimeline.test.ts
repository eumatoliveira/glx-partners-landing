import { describe, expect, it } from "vitest";
import { resolveScrubFactor, shouldCreateScrubTimeline } from "./useScrollScrubTimeline";

describe("useScrollScrubTimeline helpers", () => {
  it("creates scrub timeline only for full motion and steps", () => {
    expect(shouldCreateScrubTimeline({ enabled: true, motionLevel: "full", stepCount: 1 })).toBe(true);
    expect(shouldCreateScrubTimeline({ enabled: false, motionLevel: "full", stepCount: 1 })).toBe(false);
    expect(shouldCreateScrubTimeline({ enabled: true, motionLevel: "lite", stepCount: 1 })).toBe(false);
    expect(shouldCreateScrubTimeline({ enabled: true, motionLevel: "full", stepCount: 0 })).toBe(false);
  });

  it("resolves scrub factor by motion level", () => {
    expect(resolveScrubFactor("off", 1)).toBe(0);
    expect(resolveScrubFactor("lite", 1)).toBe(0.45);
    expect(resolveScrubFactor("full", 1)).toBe(1);
  });
});

