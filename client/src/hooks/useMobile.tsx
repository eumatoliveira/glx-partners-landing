import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

export function useIsMobile() {
  const { tier } = useMotionCapabilities();
  return tier === "mobile";
}
