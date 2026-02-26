import {
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { shouldEnableTypingText } from "@/animation/utils/perfGuards";

export interface TextTypeProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  showCursor?: boolean;
  hideCursorWhileTyping?: boolean;
  cursorCharacter?: string | ReactNode;
  cursorClassName?: string;
  text: string | string[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  loop?: boolean;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: string, index: number) => void;
  startOnVisible?: boolean;
  reverseMode?: boolean;
}

function clampSpeed(value: number | undefined, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  return Math.max(10, Math.floor(value as number));
}

export default function TextType({
  text,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: TextTypeProps) {
  const capabilities = useMotionCapabilities();
  const canAnimate = shouldEnableTypingText(capabilities);
  const containerRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.15, margin: "-60px" });

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const [displayedText, setDisplayedText] = useState(canAnimate ? "" : textArray[0] ?? "");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [initialDelayDone, setInitialDelayDone] = useState(initialDelay <= 0);

  const shouldStart = canAnimate && (!startOnVisible || isInView);
  const typingSpeedSafe = clampSpeed(typingSpeed, 50);
  const deletingSpeedSafe = clampSpeed(deletingSpeed, 30);

  useEffect(() => {
    if (!canAnimate) {
      setDisplayedText(textArray[0] ?? "");
      return;
    }
  }, [canAnimate, textArray]);

  useEffect(() => {
    setInitialDelayDone(initialDelay <= 0);
    setDisplayedText(canAnimate ? "" : textArray[0] ?? "");
    setCurrentCharIndex(0);
    setIsDeleting(false);
    setCurrentTextIndex(0);
  }, [canAnimate, initialDelay, textArray]);

  useEffect(() => {
    if (!shouldStart) return;

    const source = textArray[currentTextIndex] ?? "";
    const currentText = reverseMode ? Array.from(source).reverse().join("") : source;

    const getNextSpeed = () => {
      if (!variableSpeed) return typingSpeedSafe;
      const min = Math.max(10, Math.floor(variableSpeed.min));
      const max = Math.max(min, Math.floor(variableSpeed.max));
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (!initialDelayDone && !isDeleting && displayedText === "" && currentCharIndex === 0 && initialDelay > 0) {
      timeoutId = setTimeout(() => {
        setInitialDelayDone(true);
      }, initialDelay);
      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    if (!isDeleting) {
      if (currentCharIndex < currentText.length) {
        timeoutId = setTimeout(() => {
          setDisplayedText(prev => prev + currentText[currentCharIndex]);
          setCurrentCharIndex(prev => prev + 1);
        }, getNextSpeed());
      } else {
        onSentenceComplete?.(source, currentTextIndex);
        if (!loop && currentTextIndex === textArray.length - 1) return;
        timeoutId = setTimeout(() => {
          if (textArray.length > 1 || loop) {
            setIsDeleting(true);
          }
        }, pauseDuration);
      }
    } else if (displayedText.length > 0) {
      timeoutId = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
      }, deletingSpeedSafe);
    } else {
      timeoutId = setTimeout(() => {
        setIsDeleting(false);
        setCurrentCharIndex(0);
        setCurrentTextIndex(prev => (prev + 1) % Math.max(textArray.length, 1));
      }, Math.min(200, pauseDuration));
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [
    canAnimate,
    currentCharIndex,
    currentTextIndex,
    deletingSpeedSafe,
    displayedText,
    initialDelay,
    initialDelayDone,
    isDeleting,
    loop,
    onSentenceComplete,
    pauseDuration,
    reverseMode,
    shouldStart,
    textArray,
    typingSpeedSafe,
    variableSpeed,
  ]);

  useEffect(() => {
    if (!canAnimate) return;
    if (!isDeleting) return;
    if (displayedText.length > 0) return;
    setCurrentCharIndex(0);
  }, [canAnimate, displayedText.length, isDeleting]);

  const currentTextColor = textColors.length > 0 ? textColors[currentTextIndex % textColors.length] : undefined;
  const activeSourceText = textArray[currentTextIndex] ?? "";
  const shouldHideCursor =
    hideCursorWhileTyping && (!isDeleting && displayedText.length < activeSourceText.length);

  const style = props.style as CSSProperties | undefined;

  return createElement(
    Component,
    {
      ...props,
      ref: containerRef,
      className: cn("inline-block whitespace-pre-wrap tracking-tight", className),
      style,
    },
    <span className="inline" style={{ color: currentTextColor ?? "inherit" }}>
      {canAnimate ? displayedText : activeSourceText}
    </span>,
    showCursor ? (
      <span
        aria-hidden="true"
        className={cn(
          "ml-1 inline-block opacity-100 animate-pulse",
          shouldHideCursor ? "hidden" : undefined,
          cursorClassName,
        )}
      >
        {cursorCharacter}
      </span>
    ) : null,
  );
}
