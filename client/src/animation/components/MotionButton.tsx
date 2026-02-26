import type { ReactNode } from "react";
import { m, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { hoverLift, tapPress } from "@/animation/config/motionPresets";
import { shouldEnableHoverMotion } from "@/animation/utils/perfGuards";

interface MotionButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
}

export function MotionButton({ children, className, ...rest }: MotionButtonProps) {
  const capabilities = useMotionCapabilities();
  const hoverEnabled = shouldEnableHoverMotion(capabilities);

  return (
    <m.button
      className={cn(className)}
      whileHover={hoverEnabled ? hoverLift(capabilities.motionLevel) : undefined}
      whileTap={tapPress(capabilities.motionLevel)}
      {...rest}
    >
      {children}
    </m.button>
  );
}


