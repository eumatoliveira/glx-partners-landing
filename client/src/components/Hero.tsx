import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform, useSpring, Variants } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Hero() {
  const { t } = useLanguage();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  // Spring physics for smooth scroll connection
  const smoothProgress = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 });
  
  // Cinematic translations
  const yBg = useTransform(smoothProgress, [0, 1], ["0%", "20%"]);
  const yImg = useTransform(smoothProgress, [0, 1], ["0%", "10%"]);
  const xImg = useTransform(smoothProgress, [0, 1], ["0%", "-5%"]);
  const rotateImg = useTransform(smoothProgress, [0, 1], ["0deg", "-1.8deg"]);
  const opacityText = useTransform(smoothProgress, [0, 0.8], [1, 0]);
  const scaleImg = useTransform(smoothProgress, [0, 1], [1, 1.05]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring" as const, stiffness: 100, damping: 20, mass: 1 }
    }
  };

  return (
    <section ref={ref} className="relative min-h-screen flex items-center pt-32 pb-16 overflow-hidden bg-[#07080b] [perspective:1000px]">
      {/* Background Cinematic Elements */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-orange-500/12 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/12 blur-[100px]" />
        <div className="absolute left-[30%] top-[18%] h-[220px] w-[220px] rounded-full bg-white/10 blur-[90px]" />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "38px 38px" }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay" />
      </motion.div>

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Text Composition (Left) */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ opacity: opacityText }}
          className="lg:col-span-6 flex flex-col justify-center order-1 lg:order-1 relative z-20"
        >
          <motion.div variants={itemVariants} className="mb-6 flex items-center gap-3">
            <div className="h-[1px] w-8 bg-orange-500" />
            <span className="text-orange-500 text-xs font-bold tracking-[0.25em] uppercase">
              {t.hero.badge}
            </span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-[-0.02em] text-white mb-6">
            <span className="block">{t.hero.title1}</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">{t.hero.title2}</span>
            <span className="block opacity-50 font-light italic mt-1">{t.hero.title3}</span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-300 font-medium mb-6 leading-relaxed max-w-xl">
            {t.hero.subtitle} <span className="text-orange-500">{t.hero.subtitleHighlight}</span>.
          </motion.p>

          <motion.p variants={itemVariants} className="text-base md:text-lg text-gray-500 mb-10 max-w-lg leading-relaxed font-light">
            {t.hero.description}
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-center">
            <Button 
              size="lg" 
              className="group neon-btn-solid relative bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest h-14 px-10 text-sm transition-all duration-300 w-full sm:w-auto overflow-hidden"
              onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
            >
              <span className="relative z-10">{t.hero.cta}</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="neon-btn-outline border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold uppercase tracking-widest h-14 px-8 text-sm backdrop-blur-md transition-all duration-300 w-full sm:w-auto hover:border-white/30"
              onClick={() => document.getElementById('cases')?.scrollIntoView({behavior: 'smooth'})}
            >
              {t.hero.secondary}
            </Button>
          </motion.div>

        </motion.div>

        {/* Hero Image / Visual Concept (Right) */}
        <motion.div 
          style={{ y: yImg, x: xImg, rotate: rotateImg, scale: scaleImg }}
          initial={{ opacity: 0, filter: "blur(10px)", x: 20 }}
          animate={{ opacity: 1, filter: "blur(0px)", x: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 relative order-2 lg:order-2 flex justify-center lg:justify-end [perspective:1000px]"
        >
          <div className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[4/5] max-w-[520px] overflow-hidden rounded-3xl group border border-white/10 shadow-[0_24px_90px_rgba(0,0,0,0.55)]">
            <motion.div 
              className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"
            />
            {/* Management GIF loop with cinematic grade */}
            <motion.img 
              src="/images/management-loop.gif" 
              alt="Loop de gestao GLX" 
              className="object-cover w-full h-full contrast-[1.06] brightness-[0.9] saturate-[1.05] transition-transform duration-1000 group-hover:scale-105"
              loading="eager"
            />
            {/* Vignette Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_35%,rgba(10,10,11,0.8)_100%)] z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/20 to-transparent z-10 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
