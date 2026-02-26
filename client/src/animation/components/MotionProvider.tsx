import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { MotionCapabilitiesProvider, useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

function MotionConfigBridge({ children }: { children: ReactNode }) {
  const capabilities = useMotionCapabilities();
  return (
    <MotionConfig reducedMotion={capabilities.motionLevel === "off" ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionCapabilitiesProvider>
        <MotionConfigBridge>{children}</MotionConfigBridge>
      </MotionCapabilitiesProvider>
    </LazyMotion>
  );
}
