import { m } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { GlowPulse } from "@/animation/components/GlowPulse";
import { TypingText } from "@/animation/components/TypingText";
import { ScrollWordHighlight } from "@/animation/components/ScrollWordHighlight";
import BlurText from "@/animation/components/BlurText";
import SplitText from "@/animation/components/SplitText";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";

export default function ResultsSection() {
  const { language } = useLanguage();
  const capabilities = useMotionCapabilities();
  const reducedMotion = capabilities.prefersReducedMotion || capabilities.motionLevel === "off";

  const content = {
    pt: {
      eyebrow: "PRÓXIMO PASSO",
      title: "Em 30 minutos, você sabe onde está o vazamento.",
      subtitle:
        "A Sprint Diagnóstica começa com uma conversa. Sem formulários longos, sem apresentação genérica. Você fala do seu cenário — a gente te diz o que os dados da sua especialidade mostram.",
      cta: "AGENDAR SPRINT DIAGNÓSTICA",
      note: "Disponível para clínicas acima de R$ 100K/mês",
    },
    en: {
      eyebrow: "NEXT STEP",
      title: "Ready to scale with predictability?",
      subtitle:
        "If you want clarity on where the biggest margin and capacity gains are in your operation, schedule an Executive Diagnosis.",
      cta: "Schedule Now",
      note: "Initial 30-minute diagnosis.",
    },
    es: {
      eyebrow: "SIGUIENTE PASO",
      title: "¿Listo para escalar con previsibilidad?",
      subtitle:
        "Si quieres claridad sobre dónde están las mayores ganancias de margen y capacidad en tu operación, agenda un Diagnóstico Ejecutivo.",
      cta: "Agendar Ahora",
      note: "Diagnóstico inicial de 30 minutos.",
    },
  } as const;

  const t = content[language];

  return (
    <section id="results" className="relative overflow-hidden border-t border-white/5 bg-[#0A0A0B] py-24">
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-[18%] h-60 w-60 rounded-full bg-orange-500/10 blur-[120px]"
        animate={reducedMotion ? undefined : { x: [0, 20, 0], y: [0, -14, 0], opacity: [0.25, 0.55, 0.25] }}
        transition={reducedMotion ? undefined : { duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] bottom-[12%] h-56 w-56 rounded-full bg-cyan-400/8 blur-[120px]"
        animate={reducedMotion ? undefined : { x: [0, -18, 0], y: [0, 16, 0] }}
        transition={reducedMotion ? undefined : { duration: 9.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />

      <div className="container relative z-10">
        <m.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-90px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-[#111113] p-10 shadow-[0_0_50px_rgba(255,122,0,0.05)] md:p-20"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[100px]" />
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={reducedMotion ? undefined : { x: ["-150%", "750%"] }}
            transition={reducedMotion ? undefined : { duration: 4, repeat: Infinity, repeatDelay: 2.2, ease: "linear" }}
          />
          <m.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.65, ease: "easeOut" }}
            style={{ transformOrigin: "center" }}
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <m.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              <span>{t.eyebrow}</span>
            </m.div>
            <m.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="mb-8 text-4xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl"
            >
              {capabilities.motionLevel === "full" ? (
                <SplitText
                  text={t.title}
                  tag="span"
                  splitType="words"
                  className="block text-center"
                  delay={12}
                  duration={0.42}
                  threshold={0.14}
                  rootMargin="-70px"
                  from={{ opacity: 0, transform: "translateY(12px)" }}
                  to={{ opacity: 1, transform: "translateY(0px)" }}
                />
              ) : (
                <TypingText text={t.title} mode="scroll" />
              )}
            </m.h2>

            <div className="mx-auto mb-12 max-w-3xl text-xl font-light leading-relaxed md:text-2xl">
              {capabilities.motionLevel === "full" ? (
                <BlurText
                  as="p"
                  text={t.subtitle}
                  className="justify-center text-gray-300"
                  animateBy="words"
                  direction="bottom"
                  delay={16}
                  threshold={0.12}
                  rootMargin="-60px"
                  stepDuration={0.22}
                />
              ) : (
                <ScrollWordHighlight text={t.subtitle} wordClassName="text-gray-500" activeWordClassName="text-gray-300" />
              )}
            </div>

            <m.div
              initial={{ opacity: 0, y: 12, scale: 0.985 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: 0.14, duration: 0.4, ease: "easeOut" }}
              className="flex flex-col items-center justify-center gap-6 sm:flex-row"
            >
              <GlowPulse intensity="strong">
                <m.div whileHover={reducedMotion ? undefined : { y: -2, scale: 1.015 }} whileTap={{ scale: 0.99 }}>
                <Button
                  size="lg"
                  className="group relative h-16 w-full overflow-hidden bg-orange-500 px-12 text-base font-bold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(255,122,0,0.3)] transition-all duration-300 hover:bg-orange-600 hover:shadow-[0_0_40px_rgba(255,122,0,0.5)] sm:w-auto"
                  onClick={() => window.open("https://calendly.com/glxpartners", "_blank", "noopener,noreferrer")}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {t.cta}
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 h-full w-full -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
                </Button>
                </m.div>
              </GlowPulse>
            </m.div>

            <m.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: 0.22, duration: 0.35 }}
              className="mt-8 text-sm font-medium uppercase tracking-wide text-gray-500"
            >
              <TypingText text={t.note} mode="scroll" stepMs={18} />
            </m.p>
          </div>
        </m.div>
      </div>
    </section>
  );
}
