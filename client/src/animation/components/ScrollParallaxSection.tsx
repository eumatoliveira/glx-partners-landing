import { useRef, type ReactNode } from "react";
import {
  m,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
  type UseScrollOptions,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

interface ScrollParallaxSectionProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  enterY?: number;
  exitY?: number;
  blurPx?: number;
  offset?: UseScrollOptions["offset"];
  as?: "div" | "section";
}

const DEFAULT_OFFSET = ["start 88%", "end 14%"] as NonNullable<UseScrollOptions["offset"]>;

export function ScrollParallaxSection({
  children,
  className,
  enterY = 34,
  exitY = 10,
  blurPx = 6,
  offset = DEFAULT_OFFSET,
  as = "div",
  ...rest
}: ScrollParallaxSectionProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const caps = useMotionCapabilities();
  const reduced = caps.prefersReducedMotion || caps.motionLevel === "off";
  const factor = reduced ? 0 : caps.motionLevel === "full" ? 1 : 0.55;
  const Component = as === "section" ? m.section : m.div;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: reduced ? 220 : 120,
    damping: reduced ? 36 : 22,
    mass: reduced ? 0.5 : 0.6,
  });

  const y = useTransform(
    smooth,
    [0, 0.22, 0.75, 1],
    [enterY * factor, 0, -exitY * factor, -exitY * 1.35 * factor],
  );
  // When blur is disabled (Home uses blurPx=0), keep content fully crisp and opaque.
  const animateVisualFade = !reduced && blurPx > 0;
  const opacity = useTransform(smooth, [0, 0.08, 0.22, 1], [reduced || !animateVisualFade ? 1 : 0.15, 0.62, 1, 0.98]);
  const scale = useTransform(smooth, [0, 0.22, 1], [animateVisualFade ? 1 - 0.012 * factor : 1, 1, 1]);
  const shouldApplyFilter = !reduced && blurPx > 0;
  const blur = useTransform(smooth, [0, 0.2, 1], [blurPx * factor, 0, 0]);
  const filter = useMotionTemplate`blur(${blur}px) saturate(${reduced ? 1 : 0.96 + 0.04 * factor})`;

  return (
    <Component
      ref={ref as any}
      className={cn("relative will-change-transform", className)}
      style={
        reduced
          ? undefined
          : {
              y,
              opacity,
              scale,
              ...(shouldApplyFilter ? { filter } : {}),
              transformOrigin: "center top",
            }
      }
      {...rest}
    >
      {children}
    </Component>
  );
}
