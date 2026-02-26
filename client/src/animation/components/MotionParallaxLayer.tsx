import type { CSSProperties, ReactNode } from "react";
import { m, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { shouldEnableParallax } from "@/animation/utils/perfGuards";

interface MotionParallaxLayerProps {
  children?: ReactNode;
  className?: string;
  style?: MotionStyle;
  fallbackStyle?: CSSProperties;
  ariaHidden?: boolean;
}

export function MotionParallaxLayer({
  children,
  className,
  style,
  fallbackStyle,
  ariaHidden = true,
}: MotionParallaxLayerProps) {
  const capabilities = useMotionCapabilities();
  const enabled = shouldEnableParallax(capabilities);

  return (
    <m.div
      aria-hidden={ariaHidden}
      className={cn("pointer-events-none", className)}
      style={enabled ? style : fallbackStyle}
    >
      {children}
    </m.div>
  );
}


