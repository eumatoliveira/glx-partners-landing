import { type CSSProperties, type ElementType, useMemo, useRef } from "react";
import { m, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { shouldEnableTypingText } from "@/animation/utils/perfGuards";

type SplitTextMode = "chars" | "words" | "lines" | "words, chars";

interface SplitToken {
  value: string;
  isWhitespace: boolean;
}

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: SplitTextMode;
  from?: CSSProperties;
  to?: CSSProperties;
  threshold?: number;
  rootMargin?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  textAlign?: CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

function splitIntoTokens(text: string, splitType: SplitTextMode): SplitToken[] {
  if (splitType.includes("words")) {
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

export default function SplitText({
  text,
  className,
  delay = 45,
  duration = 0.9,
  ease = "easeOut",
  splitType = "chars",
  from = { opacity: 0, transform: "translateY(20px)" },
  to = { opacity: 1, transform: "translateY(0px)" },
  threshold = 0.12,
  rootMargin = "-80px",
  tag = "p",
  textAlign = "left",
  onLetterAnimationComplete,
}: SplitTextProps) {
  const capabilities = useMotionCapabilities();
  const canAnimate = shouldEnableTypingText(capabilities);
  const rootRef = useRef<HTMLElement | null>(null);
  const callbackCalledRef = useRef(false);
  const inView = useInView(rootRef, {
    once: true,
    amount: threshold,
    margin: rootMargin as any,
  });

  const tokens = useMemo(() => splitIntoTokens(text, splitType), [text, splitType]);
  const lastAnimatedTokenIndex = useMemo(() => {
    for (let i = tokens.length - 1; i >= 0; i -= 1) {
      if (!tokens[i].isWhitespace) return i;
    }
    return -1;
  }, [tokens]);

  if (!canAnimate) {
    const Tag = tag as ElementType;
    return (
      <Tag
        className={cn(className)}
        style={{ textAlign, whiteSpace: "pre-wrap", wordBreak: "break-word" }}
      >
        {text}
      </Tag>
    );
  }

  const Tag = tag as ElementType;

  return (
    <Tag
      ref={rootRef as any}
      className={cn("inline-block whitespace-pre-wrap", className)}
      style={{ textAlign, wordBreak: "break-word" }}
    >
      {tokens.map((token, index) => {
        if (token.isWhitespace) {
          return (
            <span key={`ws-${index}`} className="whitespace-pre">
              {token.value}
            </span>
          );
        }

        return (
          <m.span
            key={`${token.value}-${index}`}
            className="inline-block will-change-transform"
            initial={from as any}
            animate={inView ? (to as any) : (from as any)}
            transition={{
              duration: capabilities.motionLevel === "lite" ? Math.min(duration, 0.55) : duration,
              delay: (delay * index) / 1000,
              ease: ease as any,
            }}
            onAnimationComplete={() => {
              if (index !== lastAnimatedTokenIndex) return;
              if (callbackCalledRef.current) return;
              callbackCalledRef.current = true;
              onLetterAnimationComplete?.();
            }}
          >
            {token.value}
          </m.span>
        );
      })}
    </Tag>
  );
}
