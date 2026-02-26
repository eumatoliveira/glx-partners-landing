import type { ReactNode } from "react";
import { m, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { useScrollReveal } from "@/animation/hooks/useScrollReveal";

interface MotionSectionProps extends Omit<HTMLMotionProps<"section">, "children"> {
  children: ReactNode;
  axis?: "y" | "x-left" | "x-right";
  distance?: number;
  delay?: number;
  once?: boolean;
  amount?: number;
}

export function MotionSection({
  children,
  className,
  axis = "y",
  distance = 18,
  delay = 0,
  once = true,
  amount = 0.2,
  ...rest
}: MotionSectionProps) {
  const { motionLevel } = useMotionCapabilities();
  const reveal = useScrollReveal({
    axis,
    distance,
    delay,
    once,
    amount,
    motionLevel,
  });

  return (
    <m.section
      className={cn(className)}
      initial={reveal.initial}
      whileInView={reveal.whileInView}
      viewport={reveal.viewport}
      transition={reveal.transition}
      variants={reveal.variants}
      {...rest}
    >
      {children}
    </m.section>
  );
}


