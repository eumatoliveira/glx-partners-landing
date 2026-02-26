import { Children, type ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/animation/config/motionPresets";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

interface MotionPageShellProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  distance?: number;
}

export function MotionPageShell({
  children,
  className,
  stagger = 0.06,
  distance = 14,
}: MotionPageShellProps) {
  const { motionLevel } = useMotionCapabilities();
  const resolvedDistance = motionLevel === "full" ? distance : motionLevel === "lite" ? distance * 0.55 : 0;
  const disable = motionLevel === "off";

  return (
    <m.div
      className={cn(className)}
      initial={disable ? false : "hidden"}
      animate="visible"
      variants={disable ? undefined : staggerContainer(stagger, 0.02)}
    >
      {Children.map(children, child => (
        <m.div layout variants={disable ? undefined : fadeInUp(resolvedDistance)}>
          {child}
        </m.div>
      ))}
    </m.div>
  );
}

