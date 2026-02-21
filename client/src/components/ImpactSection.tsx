import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

type CaseBrand = {
  name: string;
  logo: string;
};

const caseBrands: CaseBrand[] = [
  { name: "Maktub Medicina Diagnostica", logo: "/images/logo-maktub-new.png" },
  { name: "Healthtech Solutions", logo: "/images/logo-badge.jpg" },
  { name: "GLX Clinical Ops", logo: "/images/logo-transparent.png" },
  { name: "Maktub Prime", logo: "/images/logo-maktub.jpg" },
];

function CaseLogo({ brand }: { brand: CaseBrand }) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div className="flex h-16 w-full items-center justify-center rounded-md border border-white/15 bg-white/[0.04] px-4">
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
      className="max-w-full max-h-full object-contain mix-blend-screen brightness-125 contrast-125"
      onError={() => setBroken(true)}
      loading="lazy"
    />
  );
}

export default function ImpactSection() {
  const { t } = useLanguage();

  const stats = [
    { value: t.impact.statA, label: t.impact.statALabel },
    { value: t.impact.statB, label: t.impact.statBLabel },
    { value: t.impact.statC, label: t.impact.statCLabel },
    { value: t.impact.statD, label: t.impact.statDLabel }
  ];

  return (
    <section id="cases" className="py-24 bg-[#0A0A0B] border-y border-white/5 overflow-hidden">
      <div className="container mb-32 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center items-center justify-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100, damping: 20 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500 mb-4 tracking-tighter drop-shadow-sm">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm uppercase tracking-[0.2em] text-orange-500 font-bold max-w-[200px] leading-relaxed">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden py-16 border-t border-white/[0.03] bg-[#0A0A0B]/80 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <img
            src="/images/management-loop.gif"
            alt="Loop de gestao"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-black/55" />
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-[#0A0A0B] via-transparent to-[#0A0A0B] w-full" />
        
        <div className="relative z-20 flex items-center gap-24 animate-scroll-right whitespace-nowrap px-10">
          {[...caseBrands, ...caseBrands, ...caseBrands].map((brand, index) => (
            <div key={`logo-${index}`} className="flex-shrink-0 w-64 h-32 flex items-center justify-center grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
              <CaseLogo brand={brand} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
