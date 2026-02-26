import { useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { GlowPulse } from "@/animation/components/GlowPulse";
import SplitText from "@/animation/components/SplitText";
import BlurText from "@/animation/components/BlurText";
import { cn } from "@/lib/utils";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

export default function HowSection() {
  const { language } = useLanguage();
  const stepsContainerRef = useRef<HTMLDivElement | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const motionCaps = useMotionCapabilities();
  const reducedMotion = motionCaps.prefersReducedMotion || motionCaps.motionLevel === "off";

  const content = {
    pt: {
      badge: "Como Fazemos",
      title1: "Método",
      title2: "GLX",
      cta: "Começar Transformação",
      steps: [
        {
          step: "01",
          title: "Diagnóstico Baseado em Dados",
          desc: "Mapeamos a verdade operacional da clínica para entender onde o dinheiro está vazando.",
        },
        {
          step: "02",
          title: "Setup e Implementação",
          desc: "Instalamos os processos, dashboards e automações necessárias para a operação rodar.",
        },
        {
          step: "03",
          title: "Execução & Sprints",
          desc: "Rotina de gestão semanal. Acompanhamento de metas e correção de rota rápida.",
        },
        {
          step: "04",
          title: "Gestão Contínua / Partners",
          desc: "Acompanhamento de longo prazo para garantir escala sustentável e novos patamares.",
        },
      ],
    },
    en: {
      badge: "How We Do It",
      title1: "The",
      title2: "GLX Method",
      cta: "Start Transformation",
      steps: [
        {
          step: "01",
          title: "Data-Based Diagnosis",
          desc: "We map the clinic's operational truth to understand where money is leaking.",
        },
        {
          step: "02",
          title: "Setup & Implementation",
          desc: "We install the processes, dashboards, and automations needed for operations to run.",
        },
        {
          step: "03",
          title: "Execution & Sprints",
          desc: "Weekly management routine. Goal tracking and quick course correction.",
        },
        {
          step: "04",
          title: "Continuous Management / Partners",
          desc: "Long-term follow-up to ensure sustainable scale and new levels.",
        },
      ],
    },
    es: {
      badge: "Cómo Lo Hacemos",
      title1: "Método",
      title2: "GLX",
      cta: "Iniciar Transformación",
      steps: [
        {
          step: "01",
          title: "Diagnóstico Basado en Datos",
          desc: "Mapeamos la verdad operacional de la clínica para entender dónde se está fugando el dinero.",
        },
        {
          step: "02",
          title: "Setup e Implementación",
          desc: "Instalamos los procesos, dashboards y automatizaciones necesarias para que la operación funcione.",
        },
        {
          step: "03",
          title: "Ejecución & Sprints",
          desc: "Rutina de gestión semanal. Seguimiento de metas y corrección de rumbo rápida.",
        },
        {
          step: "04",
          title: "Gestión Continua / Partners",
          desc: "Acompañamiento a largo plazo para garantizar escala sostenible y nuevos niveles.",
        },
      ],
    },
  };

  const t = content[language];

  const { scrollYProgress } = useScroll({
    target: stepsContainerRef,
    offset: ["start 78%", "end 20%"],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 160, damping: 28, mass: 0.5 });
  const timelineFillScaleY = useTransform(smoothProgress, [0, 1], [0, 1]);
  const timelineGlowOpacity = useTransform(smoothProgress, [0, 0.12, 1], [0, 0.35, 0.85]);

  useMotionValueEvent(smoothProgress, "change", (value) => {
    const normalized = Math.max(0, Math.min(1, value));
    const nextStep = Math.min(t.steps.length - 1, Math.floor(normalized * t.steps.length));
    setActiveStep((current) => (current === nextStep ? current : nextStep));
  });

  return (
    <section id="how" className="py-24 bg-[#0A0A0B] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute right-0 top-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[150px] -translate-y-1/2" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <SplitText
              text={t.badge}
              tag="h2"
              splitType="words"
              className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs"
              delay={18}
              duration={0.35}
              threshold={0.2}
              rootMargin="-80px"
              from={{ opacity: 0, transform: "translateY(5px)" }}
              to={{ opacity: 1, transform: "translateY(0px)" }}
            />
          </m.div>

            <m.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
              className="text-4xl md:text-5xl lg:text-5xl font-extrabold mb-10 leading-[1.1] tracking-tight"
            >
              <SplitText
                text={t.title1}
                tag="span"
                splitType="chars"
                className="inline-block text-gray-400 font-light"
                delay={14}
                duration={0.36}
                threshold={0.12}
                rootMargin="-80px"
                from={{ opacity: 0, transform: "translateY(12px)" }}
                to={{ opacity: 1, transform: "translateY(0px)" }}
              />{" "}
              <m.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.12, duration: 0.01 }}
              >
                <SplitText
                  text={t.title2}
                  tag="span"
                  splitType="chars"
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60"
                  delay={12}
                  duration={0.38}
                  threshold={0.12}
                  rootMargin="-80px"
                  from={{ opacity: 0, transform: "translateY(12px)" }}
                  to={{ opacity: 1, transform: "translateY(0px)" }}
                />
              </m.span>
            </m.h3>

            <div ref={stepsContainerRef} className="space-y-4 relative">
              <div className="absolute left-6 lg:left-8 top-10 bottom-10 hidden sm:block">
                <div className="absolute inset-0 w-[1px] bg-white/10" />
                <m.div
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-full w-[1px] origin-top bg-gradient-to-b from-orange-400 via-orange-500 to-orange-500/30"
                  style={{ scaleY: timelineFillScaleY }}
                />
                <m.div
                  aria-hidden="true"
                  className="absolute top-0 left-0 h-full w-[3px] -translate-x-[1px] origin-top bg-gradient-to-b from-orange-400/70 via-orange-500/50 to-transparent blur-[2px]"
                  style={{ scaleY: timelineFillScaleY, opacity: timelineGlowOpacity }}
                />
              </div>

              {t.steps.map((item, index) => {
                const isActive = index <= activeStep;

                return (
                  <m.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.15, type: "spring", stiffness: 100, damping: 20 }}
                    className={cn(
                      "flex gap-6 sm:gap-8 group relative p-6 rounded-2xl border transition-all duration-500",
                      isActive
                        ? "bg-[#111113] border-orange-500/45 shadow-[0_0_30px_rgba(249,115,22,0.08)]"
                        : "bg-[#111113]/50 border-white/5 hover:border-orange-500/30 hover:bg-[#111113]",
                    )}
                  >
                    <div
                      className={cn(
                        "relative z-10 flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#0A0A0B] border flex items-center justify-center text-xl lg:text-2xl font-bold shadow-lg transition-all duration-500 font-mono",
                        isActive
                          ? "text-orange-400 border-orange-500/60 shadow-[0_0_26px_rgba(249,115,22,0.24)]"
                          : "text-gray-500 border-white/10 group-hover:text-orange-500 group-hover:border-orange-500/50",
                      )}
                    >
                      {item.step}
                    </div>
                    <div className="pt-2 lg:pt-3 flex flex-col justify-center">
                      <h4
                        className={cn(
                          "text-xl font-bold mb-2 transition-all",
                          isActive
                            ? "text-white"
                            : "text-white/60 group-hover:text-white/80",
                        )}
                      >
                        <SplitText
                          text={item.title}
                          tag="span"
                          splitType="words"
                          className="block"
                          delay={18}
                          duration={0.4}
                          threshold={0.2}
                          rootMargin="-50px"
                          from={{ opacity: 0, transform: "translateY(8px)" }}
                          to={{ opacity: 1, transform: "translateY(0px)" }}
                        />
                      </h4>
                      <BlurText
                        as="p"
                        text={item.desc}
                        className={cn("font-light leading-relaxed text-sm md:text-base", isActive ? "text-gray-300" : "text-gray-400")}
                        animateBy="words"
                        direction="bottom"
                        delay={14}
                        threshold={0.16}
                        rootMargin="-40px"
                        stepDuration={0.18}
                      />
                    </div>
                  </m.div>
                );
              })}
            </div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
              className="mt-12"
            >
              <GlowPulse intensity="medium">
                <Button
                  size="lg"
                  className="group relative bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest h-14 px-10 text-sm transition-all duration-300 w-full sm:w-auto overflow-hidden"
                  onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
                >
                  <span className="relative z-10">
                    <SplitText
                      text={t.cta}
                      tag="span"
                      splitType="words"
                      className="inline-block"
                      delay={14}
                      duration={0.28}
                      threshold={0.2}
                      rootMargin="-60px"
                      from={{ opacity: 0, transform: "translateY(4px)" }}
                      to={{ opacity: 1, transform: "translateY(0px)" }}
                    />
                  </span>
                  <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </Button>
              </GlowPulse>
            </m.div>
          </div>

          <m.div
            initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block [perspective:1000px]"
          >
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
              <m.div
                aria-hidden="true"
                className="absolute inset-y-0 left-0 z-20 w-20 bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none"
                animate={reducedMotion ? undefined : { x: ["-30%", "520%"] }}
                transition={reducedMotion ? undefined : { duration: 4.6, repeat: Infinity, ease: "linear", repeatDelay: 1.8 }}
              />
              <img
                src="/images/healthcare-dashboard.webp"
                alt="GLX Dashboard Methodology"
                className="w-full h-auto object-cover grayscale-[0.8] contrast-[1.1] transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent z-10 pointer-events-none opacity-80" />
            </div>
          </m.div>
        </div>
      </div>
    </section>
  );
}
