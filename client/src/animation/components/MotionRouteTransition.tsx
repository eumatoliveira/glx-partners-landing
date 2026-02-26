import type { ReactNode } from "react";
import { AnimatePresence, m } from "framer-motion";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { pageEnter, pageExit } from "@/animation/config/motionPresets";

interface MotionRouteTransitionProps {
  routeKey: string;
  children: ReactNode;
}

export function MotionRouteTransition({ routeKey, children }: MotionRouteTransitionProps) {
  const { motionLevel } = useMotionCapabilities();
  const disable = motionLevel === "off";
  const enterTransition = (pageEnter.visible as any)?.transition;
  const exitTransition = (pageExit.visible as any)?.transition;
  const routeVariants = disable
    ? undefined
    : {
        // Keep route fades, but avoid transform/filter on the route wrapper.
        // Those properties create a containing block and break `position: fixed` children (Navbar).
        hidden: { opacity: (pageEnter.hidden as any)?.opacity ?? 0 },
        visible: { opacity: (pageEnter.visible as any)?.opacity ?? 1, transition: enterTransition },
        exit: { opacity: (pageExit.visible as any)?.opacity ?? 0, transition: exitTransition },
      };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={routeKey}
        initial={disable ? false : "hidden"}
        animate="visible"
        exit={disable ? undefined : "exit"}
        variants={routeVariants}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}

