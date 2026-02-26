import { describe, expect, it } from "vitest";
import { resolveMotionLevel, resolveViewportTier } from "./useMotionCapabilities";

describe("useMotionCapabilities helpers", () => {
  it("resolves viewport tier boundaries", () => {
    expect(resolveViewportTier(390)).toBe("mobile");
    expect(resolveViewportTier(900)).toBe("tablet");
    expect(resolveViewportTier(1366)).toBe("notebook");
    expect(resolveViewportTier(1700)).toBe("desktop");
    expect(resolveViewportTier(2560)).toBe("tv");
  });

  it("prioritizes reduced motion", () => {
    const result = resolveMotionLevel({
      prefersReducedMotion: true,
      isCoarsePointer: false,
      tier: "desktop",
      remoteActive: false,
    });
    expect(result).toBe("off");
  });

  it("returns lite for touch/mobile/remote", () => {
    expect(
      resolveMotionLevel({
        prefersReducedMotion: false,
        isCoarsePointer: true,
        tier: "desktop",
        remoteActive: false,
      }),
    ).toBe("lite");

    expect(
      resolveMotionLevel({
        prefersReducedMotion: false,
        isCoarsePointer: false,
        tier: "mobile",
        remoteActive: false,
      }),
    ).toBe("lite");

    expect(
      resolveMotionLevel({
        prefersReducedMotion: false,
        isCoarsePointer: false,
        tier: "desktop",
        remoteActive: true,
      }),
    ).toBe("lite");
  });
});
