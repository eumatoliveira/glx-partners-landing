import { describe, expect, it } from "vitest";
import { fadeInUp, hoverLift, tapPress } from "./motionPresets";

describe("motionPresets", () => {
  it("builds fadeInUp variants with custom distance", () => {
    const variants = fadeInUp(24);
    expect(variants.hidden).toMatchObject({ opacity: 0, y: 24 });
    expect(variants.visible).toMatchObject({ opacity: 1, y: 0 });
  });

  it("returns conservative hover in lite mode", () => {
    const preset = hoverLift("lite");
    expect(preset).toMatchObject({ y: -1 });
  });

  it("disables hover in off mode", () => {
    expect(hoverLift("off")).toEqual({});
  });

  it("keeps tap press stronger on full mode", () => {
    const full = tapPress("full");
    const lite = tapPress("lite");
    expect(full).toHaveProperty("scale", 0.985);
    expect(lite).toHaveProperty("scale", 0.995);
  });
});
