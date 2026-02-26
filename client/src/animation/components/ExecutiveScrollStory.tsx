import { useMemo, useRef, useState } from "react";
import { m, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import type { AlertEvent } from "@shared/types";
import type { EnterpriseSnapshot } from "@shared/controlTowerRules";
import { ArrowRight, BarChart3, ShieldAlert, Sparkles } from "lucide-react";
import { scrollStorySteps } from "@/animation/config/motionPresets";
import { useMotionCapabilities } from "@/animation/hooks/useMotionCapabilities";
import { formatCurrency, formatPercent } from "@/features/control-tower/utils/formatters";
import { cn } from "@/lib/utils";

interface ExecutiveScrollStoryProps {
  title: string;
  subtitle: string;
  snapshot: EnterpriseSnapshot;
  alerts: AlertEvent[];
  onCtaClick?: () => void;
}

function clampStep(progress: number) {
  if (progress < 0.34) return 0;
  if (progress < 0.68) return 1;
  return 2;
}

export default function ExecutiveScrollStory({
  title,
  subtitle,
  snapshot,
  alerts,
  onCtaClick,
}: ExecutiveScrollStoryProps) {
  const caps = useMotionCapabilities();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });
  const [activeStep, setActiveStep] = useState(0);

  const bgY = useTransform(scrollYProgress, [0, 1], [0, caps.motionLevel === "full" ? -26 : -8]);
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  useMotionValueEvent(scrollYProgress, "change", latest => {
    setActiveStep(clampStep(latest));
  });

  const topP1 = alerts.find(a => a.severity === "P1");
  const topCause = useMemo(() => {
    if (snapshot.revpasDropPercent > 15) return `RevPAS caiu ${formatPercent(snapshot.revpasDropPercent)}`;
    if (snapshot.taxaNoshow > 25) return `No-show em ${formatPercent(snapshot.taxaNoshow)}`;
    if (snapshot.margemLiquida < 10) return `Margem líquida em ${formatPercent(snapshot.margemLiquida)}`;
    return "Variação normal sem desvio crítico";
  }, [snapshot]);

  const recommendation = topP1
    ? "Priorize RCA do alerta P1 e congele otimizações secundárias até estabilizar margem/no-show."
    : snapshot.taxaNoshow > 20
      ? "Ative confirmação e remanejamento de agenda para reduzir no-show e recuperar capacidade."
      : "Mantenha rotina executiva semanal e reforce canal com melhor ROI para crescimento previsível.";

  const steps = [
    {
      key: "overview",
      title: "Visão Geral",
      icon: BarChart3,
      lines: [
        `Margem liquida: ${formatPercent(snapshot.margemLiquida)}`,
        `RevPAS atual: ${formatCurrency(snapshot.revpasAtual)}`,
        `Impacto financeiro: ${formatCurrency(snapshot.impactoFinanceiro)}`,
      ],
    },
    {
      key: "change",
      title: "O que mudou",
      icon: Sparkles,
      lines: [
        topCause,
        `No-show: ${formatPercent(snapshot.taxaNoshow)} · Slots vazios: ${snapshot.slotsVazios.toFixed(0)}`,
        `RevPAS atual: ${formatCurrency(snapshot.revpasAtual)}`,
      ],
    },
    {
      key: "action",
      title: "O que fazer agora",
      icon: ShieldAlert,
      lines: [
        recommendation,
        topP1 ? `P1 ativo: ${topP1.title}` : "Sem P1 ativo no momento",
        "CTA: revisar alertas ativos e registrar RCA se necessário.",
      ],
    },
  ] as const;

  return (
    <div ref={rootRef} className="relative h-[280vh]">
      <div className="sticky top-20 z-10">
        <m.div
          style={{ y: bgY }}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-white/10",
            "bg-[radial-gradient(circle_at_15%_15%,rgba(230,126,34,0.15),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.12),transparent_42%),rgba(20,16,13,0.68)]",
            "shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#14100dcc]",
          )}
        >
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />

          <div className="grid gap-4 p-5 lg:grid-cols-[1.25fr_220px] lg:p-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-orange-300">Executive Summary</p>
              <h2 className="mt-2 text-lg font-semibold text-white lg:text-xl">{title}</h2>
              <p className="mt-1 text-sm text-slate-300">{subtitle}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = activeStep === index;
                  return (
                    <m.div
                      key={step.key}
                      variants={scrollStorySteps}
                      initial="inactive"
                      animate={isActive ? "active" : "inactive"}
                      className={cn(
                        "relative rounded-xl border p-4 backdrop-blur-md transition-colors",
                        isActive ? "border-white/20 bg-white/[0.06]" : "border-white/10 bg-white/[0.03]",
                      )}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className={cn("rounded-lg border p-2", isActive ? "border-orange-400/30 bg-orange-500/12 text-orange-200" : "border-white/10 bg-white/5 text-slate-300")}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={cn("text-[10px] font-semibold tracking-[0.2em]", isActive ? "text-orange-200" : "text-slate-500")}>
                          {`0${index + 1}`}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-white">{step.title}</p>
                      <ul className="mt-2 space-y-1.5">
                        {step.lines.map(line => (
                          <li key={line} className="text-xs leading-relaxed text-slate-300">
                            {line}
                          </li>
                        ))}
                      </ul>
                      {index === 2 ? (
                        <button
                          type="button"
                          onClick={onCtaClick}
                          className="mt-3 inline-flex items-center gap-1 rounded-md border border-orange-400/20 bg-orange-500/10 px-2.5 py-1.5 text-xs font-semibold text-orange-200 hover:bg-orange-500/15"
                        >
                          Ver alertas ativos
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      ) : null}
                    </m.div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Progresso</p>
              <div className="mt-4 flex gap-4">
                <div className="relative w-1 rounded-full bg-white/10">
                  <m.div style={{ scaleY: railScale }} className="origin-top absolute inset-0 rounded-full bg-gradient-to-b from-orange-400 via-orange-300 to-cyan-300" />
                </div>
                <div className="space-y-5">
                  {steps.map((step, index) => {
                    const isActive = index === activeStep;
                    const passed = index < activeStep;
                    return (
                      <div key={`dot-${step.key}`} className="flex items-center gap-2">
                        <m.span
                          animate={isActive ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                          transition={isActive ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : undefined}
                          className={cn(
                            "block h-2.5 w-2.5 rounded-full border",
                            isActive
                              ? "border-orange-200 bg-orange-400 shadow-[0_0_14px_rgba(251,146,60,0.5)]"
                              : passed
                                ? "border-cyan-200/70 bg-cyan-300"
                                : "border-white/20 bg-transparent",
                          )}
                        />
                        <span className={cn("text-xs", isActive ? "text-white" : "text-slate-400")}>{step.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </m.div>
      </div>
    </div>
  );
}
