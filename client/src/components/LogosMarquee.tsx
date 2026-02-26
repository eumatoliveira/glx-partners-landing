"use client";

import type { CSSProperties, ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface Logo {
  src: string;
  alt: string;
  href?: string;
  imgClassName?: string;
  cardClassName?: string;
}

export interface LogosMarqueeProps {
  logos: Logo[];
  speedSeconds?: number;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(media.matches);
    onChange();
    media.addEventListener?.("change", onChange);
    return () => media.removeEventListener?.("change", onChange);
  }, []);

  return reducedMotion;
}

function LogoCard({
  logo,
  broken,
  onBroken,
  index,
}: {
  logo: Logo;
  broken: boolean;
  onBroken: (src: string) => void;
  index: number;
}) {
  const content: ReactNode = (
    <div
      className={cx(
        "group/logo relative flex h-24 min-w-[185px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 px-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-lg md:h-32 md:min-w-[255px] md:px-6 motion-safe:animate-[logoCardFloat_7s_ease-in-out_infinite]",
        logo.cardClassName,
      )}
      style={{ animationDelay: `${index * 0.35}s` }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.07),transparent_65%)] opacity-80" />
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-y-0 -left-10 w-20 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition-opacity duration-300 group-hover/logo:opacity-100" />
      {broken ? (
        <div className="relative z-10 h-16 w-40 rounded-lg border border-white/10 bg-white/5 md:h-20 md:w-48" aria-hidden="true" />
      ) : (
        <img
          src={logo.src}
          alt={logo.alt}
          loading="lazy"
          onError={() => onBroken(logo.src)}
          className={cx(
            "relative z-10 max-h-24 w-auto object-contain opacity-75 grayscale transition duration-500 motion-safe:animate-[logoPulse_6s_ease-in-out_infinite] group-hover/logo:scale-105 group-hover/logo:opacity-100 group-hover/logo:grayscale-0 md:max-h-32",
            "max-w-[78%] md:max-w-[82%]",
            logo.imgClassName,
          )}
          style={{ animationDelay: `${0.2 + index * 0.25}s` }}
        />
      )}
    </div>
  );

  if (!logo.href) return <>{content}</>;

  return (
    <a
      href={logo.href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={logo.alt}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/40 rounded-xl"
    >
      {content}
    </a>
  );
}

export default function LogosMarquee({
  logos,
  speedSeconds = 28,
}: LogosMarqueeProps) {
  const baseTrackRef = useRef<HTMLDivElement | null>(null);
  const [loopWidth, setLoopWidth] = useState(0);
  const [brokenSources, setBrokenSources] = useState<Record<string, true>>({});
  const reducedMotion = usePrefersReducedMotion();

  const safeLogos = useMemo(() => logos.filter((logo) => Boolean(logo?.alt?.trim())), [logos]);
  const hasEnoughItemsToLoop = safeLogos.length > 1;
  const shouldAnimate = !reducedMotion && hasEnoughItemsToLoop && loopWidth > 0;

  useEffect(() => {
    if (!baseTrackRef.current || typeof window === "undefined") return;

    let rafId = 0;
    const measure = () => {
      cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const width = baseTrackRef.current?.getBoundingClientRect().width ?? 0;
        setLoopWidth((prev) => (Math.abs(prev - width) < 1 ? prev : width));
      });
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => {
        cancelAnimationFrame(rafId);
        window.removeEventListener("resize", measure);
      };
    }

    const ro = new ResizeObserver(() => measure());
    ro.observe(baseTrackRef.current);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [safeLogos]);

  const handleBroken = (src: string) => {
    setBrokenSources((current) => (current[src] ? current : { ...current, [src]: true }));
  };

  const baseItems = useMemo(
    () =>
      safeLogos.map((logo, index) => (
        <LogoCard
          key={`base-${logo.src}-${logo.alt}-${index}`}
          logo={logo}
          broken={Boolean(brokenSources[logo.src])}
          onBroken={handleBroken}
          index={index}
        />
      )),
    [safeLogos, brokenSources],
  );

  const cloneItems = useMemo(
    () =>
      safeLogos.map((logo, index) => (
        <LogoCard
          key={`clone-${logo.src}-${logo.alt}-${index}`}
          logo={logo}
          broken={Boolean(brokenSources[logo.src])}
          onBroken={handleBroken}
          index={index + safeLogos.length}
        />
      )),
    [safeLogos, brokenSources],
  );

  const marqueeStyle = {
    ["--loopWidth" as string]: `${Math.max(loopWidth, 1)}px`,
    animation: shouldAnimate ? `scrollLeft ${Math.max(6, speedSeconds)}s linear infinite` : "none",
    willChange: shouldAnimate ? "transform" : undefined,
  } as CSSProperties;

  return (
    <div
      className="group relative mx-auto w-full max-w-[1280px] overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_18px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-5"
    >
      <style>
        {`@keyframes scrollLeft {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-1 * var(--loopWidth))); }
        }
        @keyframes logoCardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes logoPulse {
          0%, 100% { opacity: 0.75; filter: drop-shadow(0 0 0 rgba(255,255,255,0)); }
          50% { opacity: 0.92; filter: drop-shadow(0 0 14px rgba(255,255,255,0.14)); }
        }`}
      </style>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(249,115,22,0.16),transparent_48%),radial-gradient(circle_at_82%_100%,rgba(34,211,238,0.14),transparent_56%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/30 via-white/5 to-transparent opacity-90" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/30 via-white/5 to-transparent opacity-90" />

      <div className="relative overflow-hidden">
        <div
          className={cx(
            "flex items-center transform-gpu",
            shouldAnimate ? "w-max gap-0 group-hover:[animation-play-state:paused]" : "flex-wrap gap-4",
          )}
          style={marqueeStyle}
        >
          <div ref={baseTrackRef} className="flex shrink-0 items-center gap-4 pr-4 md:gap-5 md:pr-5">
            {baseItems}
          </div>
          {shouldAnimate ? (
            <div aria-hidden="true" className="flex shrink-0 items-center gap-4 pr-4 md:gap-5 md:pr-5">
              {cloneItems}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
