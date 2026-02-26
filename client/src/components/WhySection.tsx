import { useRef, useState } from "react";
import { m, useTransform, type MotionValue, type Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import BlurText from "@/animation/components/BlurText";
import SplitText from "@/animation/components/SplitText";
import { ScrollWordHighlight } from "@/animation/components/ScrollWordHighlight";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { useParallaxScene } from "@/animation/hooks/useParallaxScene";
import { shouldEnableParallax } from "@/animation/utils/perfGuards";
import { ParallaxTiltCard } from "@/animation/components/ParallaxTiltCard";
import { cn } from "@/lib/utils";

type WhyMeta = {
  labelWhat: string;
  labelHow: string;
  cards: Array<{
    whatLabel?: string;
    howLabel?: string;
    what: string;
    how: string;
    microTitle: string;
    microSubtitle: string;
  }>;
};

const whyMetaByLanguage: Record<"pt" | "en" | "es", WhyMeta> = {
  pt: {
    labelWhat: "Diagnostico",
    labelHow: "Sistema GLX",
    cards: [
      {
        whatLabel: "Como sua clinica opera hoje",
        howLabel: "Como isso aparece na rotina",
        what:
          "Gestao no feeling e no extrato bancario\nNo-show sem protocolo de recuperacao\nLead esperando horas por uma resposta\nServico popular com margem negativa\nVoce no centro de toda decisao\nCrescimento que depende de mais esforco",
        how:
          "A operacao ate vende, mas perde margem e previsibilidade.\nO dinheiro entra, mas parte dele vaza em no-show, atraso de resposta e processo sem dono.",
        microTitle: "Estado Atual",
        microSubtitle: "Onde o lucro se perde",
      },
      {
        whatLabel: "Beneficios com GLX Partners",
        howLabel: "Parceria de execucao",
        what:
          "Dashboard executivo com decisoes em dados\nProtocolo que reduz no-show em 40%\nSLA de resposta abaixo de 1 hora\nMapa de margem por procedimento e medico\nTime operando por sistema, nao por voce\nMeta e sprint semanal para crescimento previsivel",
        how:
          "A GLX nao e agencia.\nNao e consultoria que entrega diagnostico e some.\nSomos uma parceira de execucao:\ndiagnosticamos com dados,\ninstalamos o sistema e\nficamos ate o resultado virar rotina.",
        microTitle: "Estado GLX",
        microSubtitle: "Operacao com captura",
      },
      {
        whatLabel: "Metodologia",
        howLabel: "Entrega",
        what:
          "Growth Strategy + Lean Six Sigma + IA\n\nCertificados pelos maiores conselhos de Lean Health e Six Sigma do mundo.",
        how:
          "Execucao. Nao so estrategia.\n\nA estrategia e apenas o comeco. O que entregamos e o resultado funcionando.",
        microTitle: "Arquitetura GLX",
        microSubtitle: "Metodo + execucao",
      },
    ],
  },
  en: {
    labelWhat: "What you get",
    labelHow: "How it works",
    cards: [
      {
        what: "Predictable pipeline with qualified demand and controlled CAC.",
        how: "Offer + messaging + funnel + weekly conversion cadence.",
        microTitle: "Growth Loop",
        microSubtitle: "Acquisition -> Conversion -> Revenue",
      },
      {
        what: "Lean operations with less queueing and less rework.",
        how: "Bottleneck diagnosis + process standardization + improvement rituals.",
        microTitle: "Lean Flow",
        microSubtitle: "Cycle Time | Capacity | NPS",
      },
      {
        what: "Automation of repetitive work without inflating headcount.",
        how: "Repetition mapping + automation/agents + execution monitoring.",
        microTitle: "AI Ops",
        microSubtitle: "Automations + alerts + handoff",
      },
    ],
  },
  es: {
    labelWhat: "What you get",
    labelHow: "How it works",
    cards: [
      {
        what: "Pipeline predecible con demanda calificada y CAC controlado.",
        how: "Oferta + mensaje + embudo + rutina semanal de conversion.",
        microTitle: "Growth Loop",
        microSubtitle: "Adquisicion -> Conversion -> Ingresos",
      },
      {
        what: "Operacion mas lean, menos filas y menos retrabajo.",
        how: "Diagnostico de cuellos + estandarizacion + rituales de mejora.",
        microTitle: "Lean Flow",
        microSubtitle: "Tiempo de ciclo | Capacidad | NPS",
      },
      {
        what: "Automatizacion de tareas repetitivas sin inflar el equipo.",
        how: "Mapa de repeticion + agentes/automatizaciones + control.",
        microTitle: "AI Ops",
        microSubtitle: "Automatizaciones + alerts + handoff",
      },
    ],
  },
};

function WhyMicroVisual({
  index,
  active,
  reducedMotion,
  large = false,
}: {
  index: number;
  active: boolean;
  reducedMotion: boolean;
  large?: boolean;
}) {
  if (index === 0) {
    const bars = large ? [0.26, 0.34, 0.46, 0.58, 0.72, 0.84] : [0.34, 0.52, 0.68, 0.86];

    return (
      <div className={cn("relative rounded-xl border border-white/10 bg-white/[0.02]", large ? "h-48 md:h-56 p-4" : "h-28 p-3")}>
        <div className={cn("mb-2 flex items-center justify-between uppercase tracking-[0.16em] text-white/45", large ? "text-[11px]" : "text-[10px]")}>
          <span>Pipeline</span>
          <span>Weekly</span>
        </div>
        <div className={cn("grid", large ? "grid-cols-6 gap-2.5" : "grid-cols-4 gap-2")}>
          {bars.map((v, i) => (
            <div key={i} className={cn("rounded-md border border-white/6 bg-white/[0.015]", large ? "p-2.5" : "p-2")}>
              <div className={cn("rounded bg-white/[0.02]", large ? "h-24 md:h-28" : "h-10")}>
                <m.div
                  className="h-full origin-bottom rounded bg-gradient-to-t from-orange-500/70 to-cyan-300/50"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: v }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.18 + i * 0.06, duration: 0.45, ease: "easeOut" }}
                  style={{ transformOrigin: "bottom" }}
                />
              </div>
            </div>
          ))}
        </div>
        {large ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["CAC ↓", "Conv. ↑", "Receita ↑"].map((label) => (
              <div key={label} className="rounded-md border border-white/6 bg-white/[0.015] px-2 py-1.5 text-center text-[10px] uppercase tracking-[0.14em] text-white/55">
                {label}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="relative h-28 rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-white/45">Flow lanes</div>
        <div className="space-y-2">
          {[34, 62, 48].map((v, i) => (
            <div key={i} className="h-5 rounded-md border border-white/6 bg-white/[0.015] px-1 py-1">
              <m.div
                className="h-full rounded bg-gradient-to-r from-cyan-300/40 to-orange-500/65"
                initial={{ width: "0%" }}
                whileInView={{ width: `${v}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.18 + i * 0.05, duration: 0.45, ease: "easeOut" }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-28 rounded-xl border border-white/10 bg-white/[0.02] p-3">
      <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/45">
        <span>Automation</span>
        <span>AI</span>
      </div>
      <div className="relative h-[72px] overflow-hidden rounded-lg border border-white/6 bg-[#0f1217]/70">
        <div className="absolute inset-x-3 top-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-orange-400/80" />
          <div className="h-px flex-1 bg-gradient-to-r from-orange-400/70 to-cyan-300/70" />
          <div className="h-2 w-2 rounded-full bg-cyan-300/80" />
        </div>
        <div className="absolute inset-x-3 bottom-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-white/70" />
          <div className="h-px flex-1 bg-white/15" />
          <div className="h-2 w-2 rounded-full bg-white/45" />
        </div>
        <m.div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-16 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent"
          animate={reducedMotion ? undefined : { x: ["-140%", "420%"] }}
          transition={reducedMotion ? undefined : { duration: 7.2, repeat: Infinity, ease: "linear" }}
          style={{ opacity: active ? 1 : 0.55 }}
        />
      </div>
    </div>
  );
}

function cardAccentClass(index: number) {
  if (index === 1) return "from-cyan-300/20 via-cyan-300/8 to-transparent";
  if (index === 2) return "from-orange-500/18 via-orange-400/6 to-transparent";
  return "from-orange-500/18 via-white/5 to-transparent";
}

function nonEmptyLines(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function WhySection() {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const capabilities = useMotionCapabilities();
  const reducedMotion = capabilities.prefersReducedMotion || capabilities.motionLevel === "off";
  const parallaxEnabled = shouldEnableParallax(capabilities);
  const { ySoft, yDeep, xSoft, smoothProgress } = useParallaxScene({
    target: sectionRef,
    motionLevel: capabilities.motionLevel,
    enabled: parallaxEnabled,
    offset: ["start end", "end start"],
  });
  const meta = whyMetaByLanguage[language];
  const sectionCopy =
    language === "pt"
      ? {
          title1: "Voce ja tem o ativo.",
          title2: "Falta o sistema que o monetiza.",
          subtitle:
            "A maioria das clinicas privadas de alto padrao nao tem problema de demanda. Tem problema de captura: o dinheiro existe na operacao, mas vaza silenciosamente — em no-show sem protocolo, em leads que demoram horas para receber resposta, em servicos com margem negativa que ninguem mapeou.",
        }
      : {
          title1: t.why.whyTitle1,
          title2: t.why.whyTitle2,
          subtitle: t.why.whySubtitle,
        };
  const items =
    language === "pt"
      ? [
          {
            title: "Como sua clinica opera hoje",
            desc: "Operacao dependente de voce, com vazamentos silenciosos e margem sem previsibilidade.",
          },
          {
            title: "Como opera com a GLX Partners",
            desc: "Sistema integrado, execucao disciplinada e crescimento com previsibilidade.",
          },
          {
            title: "Metodologia + Entrega",
            desc: "Growth Strategy + Lean Six Sigma + IA.\nExecucao. Nao so estrategia.",
          },
        ]
      : [
          { title: t.why.whyItem1Title, desc: t.why.whyItem1Desc },
          { title: t.why.whyItem2Title, desc: t.why.whyItem2Desc },
          { title: t.why.whyItem3Title, desc: t.why.whyItem3Desc },
        ];
  const visibleItems = language === "pt" ? items.slice(0, 2) : items;
  const visibleMetaCards = meta.cards.slice(0, visibleItems.length);
  const isPtComparisonOnly = language === "pt";

  const parallaxRange = reducedMotion ? 0 : capabilities.motionLevel === "full" ? 12 : 8;
  const accentY0 = useTransform(smoothProgress, [0, 1], [-parallaxRange * 0.15, parallaxRange * 0.85]);
  const accentY1 = useTransform(smoothProgress, [0, 1], [parallaxRange * 0.2, -parallaxRange * 0.55]);
  const accentY2 = useTransform(smoothProgress, [0, 1], [-parallaxRange * 0.1, parallaxRange]);
  const accentOffsets: MotionValue<number>[] = [accentY0, accentY1, accentY2];

  const gridVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      id="why"
      className="relative overflow-hidden border-t border-white/5 bg-[#0A0A0B] py-28 md:py-32"
    >
      <m.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-8 h-20 rounded-full bg-white/[0.03] blur-3xl"
        animate={reducedMotion ? undefined : { opacity: [0.15, 0.32, 0.15], x: ["-3%", "3%", "-3%"] }}
        transition={reducedMotion ? undefined : { duration: 7.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <m.div
        aria-hidden="true"
        style={{ y: ySoft }}
        className="pointer-events-none absolute right-0 top-0 h-[500px] w-1/3 rounded-full bg-orange-500/8 blur-[120px]"
      />
      <m.div
        aria-hidden="true"
        style={{ y: yDeep, x: xSoft }}
        className="pointer-events-none absolute -left-24 bottom-12 h-56 w-56 rounded-full bg-cyan-500/10 blur-[110px]"
      />

      <div className="container relative z-10">
        {!isPtComparisonOnly ? (
          <m.div style={{ y: ySoft }} className="relative mx-auto mb-16 max-w-4xl text-center md:mb-20">
            <m.div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-8 h-24 w-72 -translate-x-1/2 rounded-full bg-orange-500/10 blur-[70px]"
              animate={reducedMotion ? undefined : { opacity: [0.2, 0.4, 0.2] }}
              transition={reducedMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <m.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="mb-8 text-4xl font-extrabold leading-[1.05] tracking-tight text-white md:text-6xl"
            >
              <SplitText
                text={sectionCopy.title1}
                tag="span"
                splitType="chars"
                className="block"
                textAlign="center"
                delay={16}
                duration={0.42}
                threshold={0.12}
                rootMargin="-90px"
                from={{ opacity: 0, transform: "translateY(14px)" }}
                to={{ opacity: 1, transform: "translateY(0px)" }}
              />
              <SplitText
                text={sectionCopy.title2}
                tag="span"
                splitType="chars"
                className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/45"
                textAlign="center"
                delay={14}
                duration={0.45}
                threshold={0.12}
                rootMargin="-90px"
                from={{ opacity: 0, transform: "translateY(16px)" }}
                to={{ opacity: 1, transform: "translateY(0px)" }}
              />
            </m.h2>

            <m.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.12, duration: 0.5, ease: "easeOut" }}
              style={{ y: yDeep }}
              className="mx-auto max-w-3xl text-xl font-light leading-relaxed md:text-2xl"
            >
              {capabilities.motionLevel === "full" ? (
                <BlurText
                  as="p"
                  text={sectionCopy.subtitle}
                  className="justify-center text-gray-300"
                  animateBy="words"
                  direction="bottom"
                  delay={24}
                  threshold={0.12}
                  rootMargin="-70px"
                  stepDuration={0.24}
                />
              ) : (
                <ScrollWordHighlight text={sectionCopy.subtitle} wordClassName="text-gray-500" activeWordClassName="text-gray-300" />
              )}
            </m.div>
          </m.div>
        ) : null}

        <m.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={gridVariants}
          className={cn(
            "mx-auto grid grid-cols-1 gap-6",
            visibleItems.length === 2 ? "max-w-6xl lg:grid-cols-2" : "lg:grid-cols-3",
          )}
        >
          {visibleItems.map((item, index) => {
            const cardMeta = visibleMetaCards[index] ?? meta.cards[index];
            const active = hoveredCardIndex === index;
            const dimmed = hoveredCardIndex !== null && hoveredCardIndex !== index;
            const large = false;
            const isPtBeforeAfterCard = isPtComparisonOnly && index < 2;
            const comparisonBadge = index === 0 ? "Antes" : "Depois com a GLX";
            const comparisonBadgeClass =
              index === 0
                ? "border-orange-400/25 bg-orange-500/10 text-orange-200/90"
                : "border-cyan-300/20 bg-cyan-400/8 text-cyan-100/85";
            const comparisonSummaryLabel = index === 0 ? "Impacto na rotina" : "O que muda com a GLX";
            const whatLines = nonEmptyLines(cardMeta.what);

            return (
              <m.div
                key={index}
                variants={itemVariants}
                className={cn("transition-opacity duration-[180ms] ease-out", dimmed && "opacity-[0.88]")}
              >
                <ParallaxTiltCard
                  intensity={capabilities.motionLevel === "full" ? 6 : 3}
                  onHoverStart={() => setHoveredCardIndex(index)}
                  onHoverEnd={() => setHoveredCardIndex((current) => (current === index ? null : current))}
                  whileHover={
                    reducedMotion
                      ? undefined
                      : { y: -4, scale: 1.008, transition: { duration: 0.18, ease: "easeOut" } }
                  }
                  whileTap={reducedMotion ? undefined : { scale: 0.997 }}
                  className={cn(
                    "group relative h-full overflow-hidden rounded-2xl border bg-[#101114]/82 p-6 shadow-[0_12px_28px_rgba(0,0,0,0.24)] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-[220ms] md:p-8",
                    "border-white/10 hover:border-orange-400/35 hover:shadow-[0_18px_36px_rgba(0,0,0,0.28)]",
                    active && "border-orange-400/40 shadow-[0_20px_40px_rgba(0,0,0,0.32)]",
                  )}
                >
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.008)_52%,rgba(255,255,255,0.004))]" />
                  <m.div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-10 -top-8 h-40 w-40 rounded-full blur-3xl"
                    style={{ y: accentOffsets[index] }}
                    animate={
                      reducedMotion || index !== 2 ? undefined : { opacity: [0.16, 0.24, 0.16], scale: [1, 1.03, 1] }
                    }
                    transition={reducedMotion || index !== 2 ? undefined : { duration: 7, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="h-full w-full rounded-full bg-orange-500/16" />
                  </m.div>
                  <m.div
                    aria-hidden="true"
                    className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-[220ms]", cardAccentClass(index))}
                    animate={{ opacity: active ? 1 : 0.45 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  />
                  <m.div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-orange-500/80 via-orange-300/30 to-transparent"
                    animate={{ scaleX: active ? 1.15 : 1 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    style={{ transformOrigin: "left center" }}
                  />

                  <div className={cn("relative z-10 grid h-full gap-5", large ? "content-start grid-rows-[auto_auto]" : "")}>
                    <div className={cn("flex min-w-0 flex-col", large && "order-2")}>
                      {isPtBeforeAfterCard ? null : (
                        <div className="mb-4 inline-flex items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.03] px-3 py-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                          <span className="text-[10px] uppercase tracking-[0.18em] text-white/55">
                            {cardMeta.microTitle}
                          </span>
                        </div>
                      )}

                      <h3 className={cn("mb-4 font-bold tracking-tight text-white", large ? "text-3xl md:text-[2.15rem]" : "text-2xl md:text-[2rem]")}>
                        <SplitText
                          text={item.title}
                          tag="span"
                          splitType="words"
                          delay={22}
                          duration={0.42}
                          threshold={0.18}
                          rootMargin="-60px"
                          className="block"
                          from={{ opacity: 0, transform: "translateY(8px)" }}
                          to={{ opacity: 1, transform: "translateY(0px)" }}
                        />
                      </h3>

                      <p className={cn("mb-4 whitespace-pre-line leading-relaxed text-white/72", large ? "text-[15px] md:text-base" : "text-sm md:text-[15px]")}>
                        {item.desc}
                      </p>

                      {isPtBeforeAfterCard ? (
                        <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <div
                              className={cn(
                                "inline-flex items-center rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em]",
                                comparisonBadgeClass,
                              )}
                            >
                              {comparisonBadge}
                            </div>
                            <span className="text-[10px] uppercase tracking-[0.16em] text-white/45">
                              {cardMeta.whatLabel ?? meta.labelWhat}
                            </span>
                          </div>

                          <ul className="space-y-2">
                            {whatLines.map((line) => (
                              <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-white/86">
                                <span
                                  aria-hidden="true"
                                  className={cn(
                                    "mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full",
                                    index === 0 ? "bg-orange-400/85" : "bg-cyan-300/75",
                                  )}
                                />
                                <span>{line}</span>
                              </li>
                            ))}
                          </ul>

                          <div
                            className={cn(
                              "mt-4 rounded-lg border px-3 py-3",
                              index === 0 ? "border-orange-400/12 bg-orange-500/[0.03]" : "border-cyan-300/12 bg-cyan-400/[0.03]",
                            )}
                          >
                            <div className="mb-1 text-[10px] uppercase tracking-[0.16em] text-white/55">
                              {comparisonSummaryLabel}
                            </div>
                            <div className="whitespace-pre-line text-sm leading-relaxed text-white/80">{cardMeta.how}</div>
                          </div>
                        </div>
                      ) : (
                        <div className={cn("space-y-3", large && "md:grid md:grid-cols-2 md:gap-3 md:space-y-0")}>
                          <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
                            <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-orange-300/85">{cardMeta.whatLabel ?? meta.labelWhat}</div>
                            <div className={cn("whitespace-pre-line leading-relaxed text-white/85", large ? "text-[14px]" : "text-sm")}>{cardMeta.what}</div>
                          </div>
                          <div className="rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3">
                            <div className="mb-1 text-[11px] uppercase tracking-[0.16em] text-cyan-200/70">{cardMeta.howLabel ?? meta.labelHow}</div>
                            <div className={cn("whitespace-pre-line leading-relaxed text-white/80", large ? "text-[14px]" : "text-sm")}>{cardMeta.how}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ParallaxTiltCard>
              </m.div>
            );
          })}
        </m.div>
      </div>
    </section>
  );
}
