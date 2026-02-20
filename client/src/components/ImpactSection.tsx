import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const clientLogos = [
  "/images/logo-maktub-new.png",
  "/images/logo-healthtech-new.png",
  "/images/logo-maktub-new.png",
  "/images/logo-healthtech-new.png",
  "/images/logo-maktub-new.png",
  "/images/logo-healthtech-new.png"
];

export default function ImpactSection() {
  const { t } = useLanguage();

  const stats = [
    { value: t.impact.statA, label: t.impact.statALabel },
    { value: t.impact.statB, label: t.impact.statBLabel },
    { value: t.impact.statC, label: t.impact.statCLabel },
    { value: t.impact.statD, label: t.impact.statDLabel }
  ];

  return (
    <section id="cases" className="py-24 bg-card border-y border-white/5 overflow-hidden">
      <div className="container mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight break-words">
                {stat.value}
              </div>
              <div className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden py-10 border-t border-white/5 bg-background/50 backdrop-blur-sm">
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />
        
        <div className="flex items-center gap-24 animate-scroll-right whitespace-nowrap">
          {clientLogos.map((logo, index) => (
            <div key={`logo-1-${index}`} className="flex-shrink-0 w-72 h-40 flex items-center justify-center grayscale opacity-100">
              <img 
                src={logo} 
                alt="Client Logo" 
                className="max-w-full max-h-full object-contain mix-blend-screen brightness-125 contrast-125"
              />
            </div>
          ))}
          {clientLogos.map((logo, index) => (
            <div key={`logo-2-${index}`} className="flex-shrink-0 w-72 h-40 flex items-center justify-center grayscale opacity-100">
              <img 
                src={logo} 
                alt="Client Logo" 
                className="max-w-full max-h-full object-contain mix-blend-screen brightness-125 contrast-125"
              />
            </div>
          ))}
           {clientLogos.map((logo, index) => (
            <div key={`logo-3-${index}`} className="flex-shrink-0 w-72 h-40 flex items-center justify-center grayscale opacity-100">
              <img 
                src={logo} 
                alt="Client Logo" 
                className="max-w-full max-h-full object-contain mix-blend-screen brightness-125 contrast-125"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
