import { useRef, type ReactNode } from "react";
import { m, useMotionTemplate, useMotionValue, useSpring, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { shouldEnableHoverMotion, shouldEnableParallax } from "@/animation/utils/perfGuards";

interface ParallaxTiltCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  intensity?: number;
  disableInteractive?: boolean;
}

export function ParallaxTiltCard({
  children,
  className,
  intensity = 9,
  disableInteractive = false,
  onMouseMove,
  onMouseLeave,
  ...rest
}: ParallaxTiltCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const capabilities = useMotionCapabilities();
  const interactive = !disableInteractive && shouldEnableHoverMotion(capabilities) && shouldEnableParallax(capabilities);

  const pointerX = useMotionValue(50);
  const pointerY = useMotionValue(50);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 24, mass: 0.7 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 24, mass: 0.7 });
  const springPointerX = useSpring(pointerX, { stiffness: 170, damping: 26, mass: 0.6 });
  const springPointerY = useSpring(pointerY, { stiffness: 170, damping: 26, mass: 0.6 });

  const spotlight = useMotionTemplate`radial-gradient(500px circle at ${springPointerX}% ${springPointerY}%, rgba(255, 122, 0, 0.20), rgba(255, 122, 0, 0) 58%)`;

  return (
    <m.div
      ref={ref}
      className={cn("group relative overflow-hidden", className)}
      style={
        interactive
          ? {
              rotateX: springRotateX,
              rotateY: springRotateY,
              transformPerspective: 1100,
              transformStyle: "preserve-3d",
            }
          : undefined
      }
      whileHover={interactive ? { y: -6, scale: 1.01 } : undefined}
      whileTap={interactive ? { scale: 0.995 } : undefined}
      onMouseMove={(event) => {
        if (!interactive || !ref.current) {
          onMouseMove?.(event);
          return;
        }

        const rect = ref.current.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width) * 100;
        const py = ((event.clientY - rect.top) / rect.height) * 100;
        const offsetX = (px - 50) / 50;
        const offsetY = (py - 50) / 50;

        pointerX.set(Math.max(0, Math.min(100, px)));
        pointerY.set(Math.max(0, Math.min(100, py)));
        rotateY.set(offsetX * intensity);
        rotateX.set(-offsetY * intensity);
        onMouseMove?.(event);
      }}
      onMouseLeave={(event) => {
        if (interactive) {
          rotateX.set(0);
          rotateY.set(0);
          pointerX.set(50);
          pointerY.set(50);
        }
        onMouseLeave?.(event);
      }}
      {...rest}
    >
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={interactive ? { background: spotlight } : undefined}
      />
      <div className="relative z-[2] h-full">{children}</div>
    </m.div>
  );
}
