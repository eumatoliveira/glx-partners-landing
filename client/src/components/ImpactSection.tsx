import { m } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import CountUp from "@/animation/components/CountUp";
import SplitText from "@/animation/components/SplitText";
import BlurText from "@/animation/components/BlurText";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

type FeaturedBrand = {
  name: string;
  logo: string;
};

const featuredBrands: FeaturedBrand[] = [
  {
    name: "Maktub Medicina Diagnóstica",
    logo: "/images/logo-maktub-new.png",
  },
  {
    name: "Lumina Dermatologia & Estética Médica",
    logo: "/images/logo-lumina.png",
  },
  {
    name: "Instituto VittaMéd Nutrologia",
    logo: "/images/logo-vittamed.png",
  },
  {
    name: "HealthTech Solutions",
    logo: "/images/HealthTech-Solutions.png",
  },
];

const badgeByLanguage = {
  pt: "RESULTADOS REAIS",
  en: "REAL RESULTS",
  es: "RESULTADOS REALES",
} as const;

function parseDecoratedNumber(input: string): { prefix: string; numeric: number; suffix: string; decimals: number } | null {
  const trimmed = input.trim();
  const match = trimmed.match(/^([^\d]*)(\d+(?:[.,]\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, numberTextRaw, suffix] = match;
  const numberText = numberTextRaw.replace(",", ".");
  const numeric = Number(numberText);
  if (!Number.isFinite(numeric)) return null;
  const decimals = numberText.includes(".") ? numberText.split(".")[1].length : 0;
  return { prefix, numeric, suffix, decimals };
}

function FeaturedLogo({ brand }: { brand: FeaturedBrand }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="flex h-20 w-full items-center justify-center rounded-xl border border-white/20 bg-white/[0.04] px-4">
        <span className="text-center text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
          {brand.name}
        </span>
      </div>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={brand.name}
      className="mx-auto max-h-20 w-auto object-contain brightness-110 contrast-125"
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}

export default function ImpactSection() {
  const { t, language } = useLanguage();
  const motionCaps = useMotionCapabilities();
  const reducedMotion = motionCaps.prefersReducedMotion || motionCaps.motionLevel === "off";

  const stats = [
    { value: t.impact.statA, label: t.impact.statALabel },
    { value: t.impact.statB, label: t.impact.statBLabel },
    { value: t.impact.statC, label: t.impact.statCLabel },
    { value: t.impact.statD, label: t.impact.statDLabel },
  ];

  return (
    <section id="cases" className="scroll-mt-28 py-24 bg-[#0A0A0B] border-y border-white/5 overflow-hidden">
      <div className="container mb-24 relative z-10">
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-8 top-4 h-24 rounded-full bg-orange-500/10 blur-3xl"
          animate={reducedMotion ? undefined : { opacity: [0.25, 0.5, 0.25], scale: [0.98, 1.03, 0.98] }}
          transition={reducedMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-10 top-28 h-40 w-40 rounded-full bg-cyan-400/10 blur-[80px]"
          animate={reducedMotion ? undefined : { y: [0, -14, 0], x: [0, 8, 0] }}
          transition={reducedMotion ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="mb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            <SplitText
              text={badgeByLanguage[language]}
              splitType="words"
              tag="span"
              className="inline-flex"
              delay={18}
              duration={0.35}
              threshold={0.2}
              rootMargin="-80px"
              from={{ opacity: 0, transform: "translateY(6px)" }}
              to={{ opacity: 1, transform: "translateY(0px)" }}
            />
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-center items-center justify-center">
          {stats.map((stat, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 20 }}
              whileHover={{ y: -6, scale: 1.02 }}
              animate={reducedMotion ? undefined : { y: [0, -2.5, 0] }}
              className="group relative flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.015] px-3 py-4 transition-colors hover:border-orange-500/25"
              style={reducedMotion ? undefined : { animationDelay: `${index * 0.2}s` }}
            >
              <m.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                style={{
                  background:
                    "radial-gradient(circle at 50% 15%, rgba(230,126,34,0.14), rgba(255,255,255,0) 65%)",
                }}
              />
              <m.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                animate={reducedMotion ? undefined : { x: ["-120%", "420%"] }}
                transition={reducedMotion ? undefined : { duration: 2.2, repeat: Infinity, repeatDelay: 1.4, ease: "linear", delay: index * 0.15 }}
              />
              <m.div
                className="relative z-10 text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mb-4 tracking-tighter drop-shadow-sm"
                whileHover={{ filter: "drop-shadow(0 0 10px rgba(230,126,34,0.18))" }}
                animate={reducedMotion ? undefined : { scale: [1, 1.015, 1] }}
                transition={reducedMotion ? undefined : { duration: 3.5 + index * 0.25, repeat: Infinity, ease: "easeInOut" }}
              >
                {(() => {
                  const parsed = parseDecoratedNumber(stat.value);
                  if (!parsed) return stat.value;
                  return (
                    <>
                      <span>{parsed.prefix}</span>
                      <CountUp
                        from={0}
                        to={parsed.numeric}
                        duration={1.6 + index * 0.12}
                        delay={0.18 + index * 0.1}
                        decimals={parsed.decimals}
                        startCounting
                        className="inline-block"
                      />
                      <span>{parsed.suffix}</span>
                    </>
                  );
                })()}
              </m.div>
              <div className="relative z-10 text-xs md:text-sm uppercase tracking-[0.2em] text-orange-500 font-bold max-w-[200px] leading-relaxed">
                <SplitText
                  text={stat.label}
                  splitType="words"
                  tag="div"
                  className="justify-center text-center"
                  delay={22}
                  duration={0.5}
                  threshold={0.2}
                  rootMargin="-70px"
                  from={{ opacity: 0, transform: "translateY(8px)" }}
                  to={{ opacity: 1, transform: "translateY(0px)" }}
                />
              </div>
            </m.div>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden py-12 border-t border-white/[0.03] bg-[#080808]">
        <m.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"
          animate={reducedMotion ? undefined : { opacity: [0.35, 0.9, 0.35], x: ["-6%", "6%", "-6%"] }}
          transition={reducedMotion ? undefined : { duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />

        <div className="container relative z-10">
          <m.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center gap-6 md:gap-10 lg:gap-14"
          >
            {featuredBrands.map((brand, index) => (
              <Link href="/planos" key={brand.name}>
                <m.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ delay: index * 0.12, duration: 0.45, ease: "easeOut" }}
                  whileHover={{ y: -4, scale: 1.05 }}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-6 py-5 backdrop-blur-sm transition-all duration-300 hover:border-orange-500/25 hover:bg-white/[0.06] min-w-[180px] md:min-w-[220px] cursor-pointer"
                >
                  <FeaturedLogo brand={brand} />
                  <BlurText
                    as="p"
                    text={brand.name}
                    className="text-center text-[10px] uppercase tracking-[0.18em] text-white/60 group-hover:text-white/80 transition-colors"
                    animateBy="words"
                    direction="bottom"
                    delay={16 + index * 6}
                    threshold={0.2}
                    rootMargin="-70px"
                    stepDuration={0.18}
                  />
                </m.div>
              </Link>
            ))}
          </m.div>
        </div>
      </div>
    </section>
  );
}
