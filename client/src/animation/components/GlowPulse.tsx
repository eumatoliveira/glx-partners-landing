import type { ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { shouldEnableGlowPulse } from "@/animation/utils/perfGuards";

type GlowIntensity = "subtle" | "medium" | "strong";

interface GlowPulseProps {
  children: ReactNode;
  className?: string;
  colorClassName?: string;
  intensity?: GlowIntensity;
  disabled?: boolean;
}

const intensityByLevel: Record<GlowIntensity, { from: number; to: number; duration: number }> = {
  subtle: { from: 0.18, to: 0.28, duration: 2.4 },
  medium: { from: 0.24, to: 0.36, duration: 2.1 },
  strong: { from: 0.3, to: 0.48, duration: 1.8 },
};

export function GlowPulse({
  children,
  className,
  colorClassName = "bg-orange-500/30",
  intensity = "medium",
  disabled = false,
}: GlowPulseProps) {
  const capabilities = useMotionCapabilities();
  const enabled = !disabled && shouldEnableGlowPulse(capabilities);
  const spec = intensityByLevel[intensity];

  return (
    <m.div className={cn("relative", className)}>
      {enabled ? (
        <m.div
          aria-hidden="true"
          className={cn("pointer-events-none absolute -inset-1 rounded-xl blur-xl", colorClassName)}
          initial={{ opacity: spec.from, scale: 0.98 }}
          animate={{ opacity: [spec.from, spec.to, spec.from], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: spec.duration, ease: "easeInOut", repeat: Infinity }}
        />
      ) : null}
      <div className="relative z-10">{children}</div>
    </m.div>
  );
}

