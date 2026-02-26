import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ImpactSection from "@/components/ImpactSection";
import WhySection from "@/components/WhySection";
import WhatSection from "@/components/WhatSection";
import HowSection from "@/components/HowSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import ResultsSection from "@/components/ResultsSection";
import Footer from "@/components/Footer";
import { ScrollParallaxSection } from "@/animation/components/ScrollParallaxSection";
import { useParallaxScene } from "@/animation/hooks/useParallaxScene";
import { useScrollScrubTimeline } from "@/animation/hooks/useScrollScrubTimeline";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { shouldEnableGsapScrollScrub, shouldEnableParallax } from "@/animation/utils/perfGuards";
import { m, useTransform } from "framer-motion";
import { useMemo, useRef } from "react";

export default function Home() {
  const rootRef = useRef<HTMLElement>(null);
  const glowPrimaryRef = useRef<HTMLDivElement>(null);
  const glowSecondaryRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const caps = useMotionCapabilities();
  const parallaxEnabled = shouldEnableParallax(caps);
  const scrubEnabled = shouldEnableGsapScrollScrub(caps);

  const { yDeep, ySoft, progress, xSoft } = useParallaxScene({
    target: rootRef,
    offset: ["start start", "end end"],
    motionLevel: caps.motionLevel,
    enabled: parallaxEnabled,
  });

  const horizontalDrift = useTransform(progress, [0, 1], [0, parallaxEnabled ? 120 : 0]);
  const fgScale = useTransform(progress, [0, 1], [1, parallaxEnabled ? 1.08 : 1]);

  const scrubSteps = useMemo(
    () => [
      { target: glowPrimaryRef, to: { y: -160, scale: 1.15, opacity: 0.85 } },
      { target: glowSecondaryRef, to: { y: -120, x: -90, opacity: 0.8 } },
      { target: gridRef, to: { x: 180, opacity: 0.08 } },
    ],
    [],
  );

  useScrollScrubTimeline({
    containerRef: rootRef,
    enabled: scrubEnabled,
    motionLevel: caps.motionLevel,
    steps: scrubSteps,
    scrub: 0.95,
    start: "top top",
    end: "bottom top",
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      <Navbar />
      <main ref={rootRef} className="relative flex-grow overflow-hidden [perspective:1000px]">
        {/* ── Ambient Background Layer ── */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          {/* Radial gradients for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(230,126,34,0.06),transparent_42%),radial-gradient(circle_at_82%_22%,rgba(34,211,238,0.05),transparent_44%),linear-gradient(180deg,#050608_0%,#040507_100%)]" />

          {/* Top edge highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />
          {/* Bottom edge highlight */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          {/* Animated glow orbs */}
          <m.div
            ref={glowPrimaryRef}
            className="absolute left-[-8%] top-[12rem] h-[26rem] w-[26rem] rounded-full bg-orange-400/8 blur-[140px]"
            style={{ y: yDeep, scale: fgScale }}
          />
          <m.div
            ref={glowSecondaryRef}
            className="absolute right-[-10%] top-[45rem] h-[24rem] w-[24rem] rounded-full bg-cyan-400/7 blur-[130px]"
            style={{ y: ySoft, x: horizontalDrift }}
          />
          <m.div
            className="absolute left-[25%] top-[98rem] h-[20rem] w-[20rem] rounded-full bg-white/5 blur-[120px]"
            style={{ y: ySoft, x: xSoft }}
          />
          <m.div
            ref={gridRef}
            className="absolute inset-0 opacity-0"
            style={{ x: horizontalDrift }}
          />
        </div>

        {/* ── Page Sections ── */}
        <div className="relative z-10">
          <ScrollParallaxSection enterY={18} exitY={14} blurPx={0} offset={["start 95%", "end 5%"]}>
            <Hero />
          </ScrollParallaxSection>

          <div className="space-y-0">
            {/* Divider between Hero and Impact */}
            <div className="section-divider mx-auto w-4/5 max-w-4xl" />

            <ScrollParallaxSection enterY={34} exitY={10} blurPx={0}>
              <ImpactSection />
            </ScrollParallaxSection>

            <div className="section-divider mx-auto w-4/5 max-w-4xl" />

            <ScrollParallaxSection enterY={38} exitY={12} blurPx={0} offset={["start 90%", "end 16%"]}>
              <WhySection />
            </ScrollParallaxSection>

            <div className="section-divider mx-auto w-4/5 max-w-4xl" />

            <ScrollParallaxSection enterY={38} exitY={12} blurPx={0} offset={["start 90%", "end 16%"]}>
              <WhatSection />
            </ScrollParallaxSection>

            <div className="section-divider mx-auto w-4/5 max-w-4xl" />

            <ScrollParallaxSection enterY={34} exitY={10} blurPx={0}>
              <HowSection />
            </ScrollParallaxSection>

            <div className="section-divider mx-auto w-4/5 max-w-4xl" />

            <ScrollParallaxSection enterY={34} exitY={10} blurPx={0}>
              <TestimonialsSection />
            </ScrollParallaxSection>

            <div className="section-divider mx-auto w-4/5 max-w-4xl" />

            <ScrollParallaxSection enterY={28} exitY={8} blurPx={0}>
              <FaqSection />
            </ScrollParallaxSection>

            <div className="section-divider mx-auto w-4/5 max-w-4xl" />

            <ScrollParallaxSection enterY={28} exitY={8} blurPx={0}>
              <ResultsSection />
            </ScrollParallaxSection>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
