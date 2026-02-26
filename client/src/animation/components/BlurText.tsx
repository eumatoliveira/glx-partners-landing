import { type CSSProperties, type ElementType, useMemo, useRef } from "react";
import { m, useInView, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { shouldEnableTypingText } from "@/animation/utils/perfGuards";

type AnimateBy = "words" | "letters";
type Direction = "top" | "bottom";

type BlurSnapshot = Record<string, string | number>;

type BlurTextProps = {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: AnimateBy;
  direction?: Direction;
  threshold?: number;
  rootMargin?: string;
  animationFrom?: BlurSnapshot;
  animationTo?: BlurSnapshot[];
  easing?: Transition["ease"];
  onAnimationComplete?: () => void;
  stepDuration?: number;
  as?: ElementType;
};

type Token = {
  value: string;
  isWhitespace: boolean;
};

function buildKeyframes(from: BlurSnapshot, steps: BlurSnapshot[]): Record<string, Array<string | number | undefined>> {
  const keys = new Set<string>([...Object.keys(from), ...steps.flatMap(Object.keys)]);
  const keyframes: Record<string, Array<string | number | undefined>> = {};
  keys.forEach(key => {
    keyframes[key] = [from[key], ...steps.map(step => step[key])];
  });
  return keyframes;
}

function tokenizeText(text: string, animateBy: AnimateBy): Token[] {
  if (animateBy === "words") {
    return text.split(/(\s+)/).filter(Boolean).map(value => ({
      value,
      isWhitespace: /^\s+$/.test(value),
    }));
  }

  return Array.from(text).map(value => ({
    value,
    isWhitespace: /^\s+$/.test(value),
  }));
}

export default function BlurText({
  text = "",
  delay = 50,
  className = "",
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  rootMargin = "-80px",
  animationFrom,
  animationTo,
  easing = [0.22, 1, 0.36, 1],
  onAnimationComplete,
  stepDuration = 0.35,
  as: Component = "p",
}: BlurTextProps) {
  const capabilities = useMotionCapabilities();
  const canAnimate = shouldEnableTypingText(capabilities);
  const ref = useRef<HTMLElement | null>(null);
  const inView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });

  const elements = useMemo(() => tokenizeText(text, animateBy), [animateBy, text]);
  const lastAnimatedIndex = useMemo(() => {
    for (let i = elements.length - 1; i >= 0; i -= 1) {
      if (!elements[i].isWhitespace) return i;
    }
    return -1;
  }, [elements]);

  const defaultFrom = useMemo<BlurSnapshot>(
    () =>
      direction === "top"
        ? { filter: "blur(12px)", opacity: 0, y: -28 }
        : { filter: "blur(12px)", opacity: 0, y: 28 },
    [direction],
  );

  const defaultTo = useMemo<BlurSnapshot[]>(
    () => [
      { filter: "blur(6px)", opacity: 0.55, y: direction === "top" ? 4 : -4 },
      { filter: "blur(0px)", opacity: 1, y: 0 },
    ],
    [direction],
  );

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;
  const animateKeyframes = useMemo(() => buildKeyframes(fromSnapshot, toSnapshots), [fromSnapshot, toSnapshots]);
  const stepCount = toSnapshots.length + 1;
  const totalDuration = stepDuration * Math.max(1, stepCount - 1);
  const times = Array.from({ length: stepCount }, (_, i) => (stepCount === 1 ? 0 : i / (stepCount - 1)));

  const baseStyle: CSSProperties = { willChange: "transform, filter, opacity" };

  if (!canAnimate) {
    return (
      <Component ref={ref as any} className={cn(className)} style={{ whiteSpace: "pre-wrap" }}>
        {text}
      </Component>
    );
  }

  return (
    <Component ref={ref as any} className={cn("flex flex-wrap", className)}>
      {elements.map((segment, index) => {
        if (segment.isWhitespace) {
          return (
            <span key={`ws-${index}`} className="whitespace-pre">
              {segment.value}
            </span>
          );
        }

        return (
          <m.span
            key={`${segment.value}-${index}`}
            initial={fromSnapshot as any}
            animate={inView ? (animateKeyframes as any) : (fromSnapshot as any)}
            transition={{
              duration: capabilities.motionLevel === "lite" ? Math.min(totalDuration, 0.5) : totalDuration,
              times,
              delay: (index * delay) / 1000,
              ease: easing,
            }}
            onAnimationComplete={index === lastAnimatedIndex ? onAnimationComplete : undefined}
            style={baseStyle}
            className={animateBy === "letters" ? "inline-block" : "inline-block"}
          >
            {segment.value}
          </m.span>
        );
      })}
    </Component>
  );
}

