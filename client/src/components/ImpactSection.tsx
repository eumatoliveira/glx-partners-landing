import { m } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import CountUp from "@/animation/components/CountUp";
import SplitText from "@/animation/components/SplitText";
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

function FeaturedLogo({ brand, active }: { brand: FeaturedBrand; active: boolean }) {
  const [broken, setBroken] = useState(false);
  if (broken) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-lg border border-white/15 bg-white/[0.03] px-3 text-center text-[11px] font-semibold uppercase tracking-[0.12em] text-white/80">
        {brand.name}
      </div>
    );
  }

  return (
    <img
      src={brand.logo}
      alt={brand.name}
      className={`mx-auto h-full w-full rounded-lg object-contain transition-all duration-300 ${
        active ? "grayscale-0 opacity-100" : "grayscale brightness-75 contrast-110 opacity-65"
      }`}
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}

export default function ImpactSection() {
  const { t, language } = useLanguage();
  const motionCaps = useMotionCapabilities();
  const reducedMotion = motionCaps.prefersReducedMotion || motionCaps.motionLevel === "off";
  const [hoveredLogoIndex, setHoveredLogoIndex] = useState<number | null>(null);

  const stats = [
    { value: t.impact.statA, label: t.impact.statALabel },
    { value: t.impact.statB, label: t.impact.statBLabel },
    { value: t.impact.statC, label: t.impact.statCLabel },
    { value: t.impact.statD, label: t.impact.statDLabel },
  ];
  const rotatingBrands = [...featuredBrands, ...featuredBrands];

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

        <div className="grid grid-cols-1 gap-5 text-center sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {stats.map((stat, index) => (
            <m.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 20 }}
              whileHover={{ y: -6, scale: 1.02 }}
              animate={reducedMotion ? undefined : { y: [0, -2.5, 0] }}
              className="group relative flex min-h-[15.5rem] flex-col items-center justify-center gap-2 rounded-2xl border border-white/5 bg-white/[0.015] px-4 py-5 text-center transition-colors hover:border-orange-500/25 sm:min-h-[17rem] sm:px-5 md:min-h-[18rem]"
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
                className="relative z-10 mb-1 whitespace-nowrap bg-gradient-to-b from-white to-neutral-500 bg-clip-text text-5xl font-extrabold tracking-tighter text-transparent drop-shadow-sm sm:text-6xl md:text-7xl"
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
              <div className="relative z-10 flex w-full justify-center text-[11px] font-bold uppercase leading-relaxed tracking-[0.08em] text-orange-500 sm:text-xs sm:tracking-[0.12em] md:text-sm md:tracking-[0.16em]">
                <SplitText
                  text={stat.label}
                  splitType="words"
                  tag="div"
                  className="mx-auto inline-block max-w-[22ch] text-center"
                  textAlign="center"
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
            className="relative"
          >
            <div className="overflow-hidden">
              <m.div
                className="flex w-max gap-4 will-change-transform sm:gap-5 lg:gap-6"
                animate={reducedMotion ? undefined : { x: ["-50%", "0%"] }}
                transition={reducedMotion ? undefined : { duration: 22, repeat: Infinity, ease: "linear" }}
              >
                {rotatingBrands.map((brand, index) => (
                  <div
                    key={`${brand.name}-${index}`}
                    className="group flex h-[13.5rem] w-[14.5rem] flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-center transition-colors duration-300 hover:border-orange-400/35 sm:h-[14.2rem] sm:w-[16.5rem] lg:h-[14.8rem] lg:w-[17.5rem]"
                    onMouseEnter={() => setHoveredLogoIndex(index)}
                    onMouseLeave={() => setHoveredLogoIndex(null)}
                  >
                    <div className="flex h-20 w-40 items-center justify-center rounded-lg sm:h-24 sm:w-44">
                      <FeaturedLogo brand={brand} active={hoveredLogoIndex === index} />
                    </div>
                    <p className="flex h-10 items-center justify-center text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 sm:h-11 sm:text-xs">
                      {brand.name}
                    </p>
                  </div>
                ))}
              </m.div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
