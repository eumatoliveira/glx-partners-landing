import { describe, expect, it } from "vitest";
import {
  clampProgress,
  resolveTypedLengthByProgress,
  resolveTypingStep,
} from "./useTypingText";

describe("useTypingText helpers", () => {
  it("clamps progress boundaries", () => {
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(0.4)).toBe(0.4);
    expect(clampProgress(2)).toBe(1);
    expect(clampProgress(Number.NaN)).toBe(0);
  });

  it("resolves typed length by progress", () => {
    expect(resolveTypedLengthByProgress(20, 0)).toBe(0);
    expect(resolveTypedLengthByProgress(20, 0.5)).toBe(10);
    expect(resolveTypedLengthByProgress(20, 1)).toBe(20);
  });

  it("normalizes typing step interval", () => {
    expect(resolveTypingStep(7)).toBe(12);
    expect(resolveTypingStep(35.8)).toBe(35);
    expect(resolveTypingStep(Number.POSITIVE_INFINITY)).toBe(28);
  });
});

