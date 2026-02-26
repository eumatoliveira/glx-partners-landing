import type { ReactNode } from "react";
import { m, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { hoverLift, tapPress, scaleIn } from "@/animation/config/motionPresets";
import { shouldEnableHoverMotion } from "@/animation/utils/perfGuards";

interface MotionCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  interactive?: boolean;
}

export function MotionCard({ children, className, interactive = true, ...rest }: MotionCardProps) {
  const capabilities = useMotionCapabilities();
  const hoverEnabled = interactive && shouldEnableHoverMotion(capabilities);

  return (
    <m.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={scaleIn(capabilities.motionLevel === "off" ? 1 : 0.985)}
      whileHover={hoverEnabled ? hoverLift(capabilities.motionLevel) : undefined}
      whileTap={interactive ? tapPress(capabilities.motionLevel) : undefined}
      layout
      {...rest}
    >
      {children}
    </m.div>
  );
}


