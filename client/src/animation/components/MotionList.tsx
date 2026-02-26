import type { ReactNode } from "react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer } from "@/animation/config/motionPresets";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

interface MotionListProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  stagger?: number;
  as?: "div" | "ul";
}

export function MotionList({ children, className, itemClassName, stagger = 0.06, as = "div" }: MotionListProps) {
  const { motionLevel } = useMotionCapabilities();
  const Component = as === "ul" ? m.ul : m.div;
  const items = Array.isArray(children) ? children : [children];

  return (
    <Component
      className={cn(className)}
      variants={staggerContainer(motionLevel === "off" ? 0 : stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
    >
      {items.map((child, index) => (
        <m.div
          key={index}
          className={cn(itemClassName)}
          variants={fadeInUp(motionLevel === "off" ? 0 : 14)}
          layout
        >
          {child}
        </m.div>
      ))}
    </Component>
  );
}


