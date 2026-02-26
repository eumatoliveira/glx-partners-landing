import { m } from "framer-motion";
import { ReactNode } from "react";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { useScrollReveal } from "@/animation/hooks/useScrollReveal";

interface ScrollRevealProps {
  children: ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
}

export const ScrollReveal = ({ children, width = "fit-content", delay = 0 }: ScrollRevealProps) => {
  const { motionLevel } = useMotionCapabilities();
  const reveal = useScrollReveal({
    delay,
    motionLevel,
  });

  return (
    <div style={{ position: "relative", width, overflow: "hidden" }}>
      <m.div
        initial={reveal.initial}
        whileInView={reveal.whileInView}
        viewport={reveal.viewport}
        variants={reveal.variants}
        transition={reveal.transition}
      >
        {children}
      </m.div>
    </div>
  );
};


