import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { MotionCapabilities, ViewportTier } from "@/animation/types";
import { viewportThresholds } from "@/animation/config/motionTokens";

export const DEFAULT_CAPABILITIES: MotionCapabilities = {
  tier: "desktop",
  width: 1366,
  height: 768,
  isLandscape: true,
  canHover: true,
  isCoarsePointer: false,
  prefersReducedMotion: false,
  inputMode: "mouse",
  motionLevel: "full",
};

export function resolveViewportTier(width: number): ViewportTier {
  if (width < viewportThresholds.mobile) return "mobile";
  if (width < viewportThresholds.tablet) return "tablet";
  if (width < viewportThresholds.notebook) return "notebook";
  if (width < viewportThresholds.desktop) return "desktop";
  return "tv";
}

function readQuery(query: string): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia(query).matches;
}

export function resolveMotionLevel({
  prefersReducedMotion,
  isCoarsePointer,
  tier,
  remoteActive,
}: {
  prefersReducedMotion: boolean;
  isCoarsePointer: boolean;
  tier: ViewportTier;
  remoteActive: boolean;
}): MotionCapabilities["motionLevel"] {
  if (prefersReducedMotion) return "off";
  if (isCoarsePointer || remoteActive || tier === "mobile") return "lite";
  return "full";
}

function computeCapabilities(remoteActive: boolean): MotionCapabilities {
  if (typeof window === "undefined") return DEFAULT_CAPABILITIES;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const tier = resolveViewportTier(width);
  const prefersReducedMotion = readQuery("(prefers-reduced-motion: reduce)");
  const canHover = readQuery("(hover: hover)");
  const coarsePointer = readQuery("(pointer: coarse)");
  const inputMode = remoteActive ? "remote" : coarsePointer ? "touch" : "mouse";
  const motionLevel = resolveMotionLevel({
    prefersReducedMotion,
    isCoarsePointer: coarsePointer,
    remoteActive,
    tier,
  });

  return {
    tier,
    width,
    height,
    isLandscape: width >= height,
    canHover,
    isCoarsePointer: coarsePointer,
    prefersReducedMotion,
    inputMode,
    motionLevel,
  };
}

const MotionCapabilitiesContext = createContext<MotionCapabilities>(DEFAULT_CAPABILITIES);

export function MotionCapabilitiesProvider({ children }: { children: ReactNode }) {
  const [remoteActive, setRemoteActive] = useState(false);
  const [capabilities, setCapabilities] = useState<MotionCapabilities>(DEFAULT_CAPABILITIES);
  const remoteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => setCapabilities(computeCapabilities(remoteActive));

    const onRemoteKey = (event: KeyboardEvent) => {
      const remoteKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", "Escape"];
      if (!remoteKeys.includes(event.key)) return;
      setRemoteActive(true);
      if (remoteTimerRef.current) {
        clearTimeout(remoteTimerRef.current);
      }
      remoteTimerRef.current = setTimeout(() => setRemoteActive(false), 5000);
    };

    const onPointerInput = () => {
      if (!remoteActive) return;
      setRemoteActive(false);
    };

    const onResize = () => update();

    const mqls = [
      window.matchMedia("(prefers-reduced-motion: reduce)"),
      window.matchMedia("(hover: hover)"),
      window.matchMedia("(pointer: coarse)"),
    ];

    for (const mql of mqls) {
      if (typeof mql.addEventListener === "function") {
        mql.addEventListener("change", update);
      } else {
        mql.addListener(update);
      }
    }

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("keydown", onRemoteKey);
    window.addEventListener("pointerdown", onPointerInput, { passive: true });
    update();

    return () => {
      if (remoteTimerRef.current) {
        clearTimeout(remoteTimerRef.current);
      }
      for (const mql of mqls) {
        if (typeof mql.removeEventListener === "function") {
          mql.removeEventListener("change", update);
        } else {
          mql.removeListener(update);
        }
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onRemoteKey);
      window.removeEventListener("pointerdown", onPointerInput);
    };
  }, [remoteActive]);

  const value = useMemo(() => capabilities, [capabilities]);
  return <MotionCapabilitiesContext.Provider value={value}>{children}</MotionCapabilitiesContext.Provider>;
}

export function useMotionCapabilities(): MotionCapabilities {
  return useContext(MotionCapabilitiesContext);
}
