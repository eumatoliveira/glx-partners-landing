import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ResultsSection() {
  const { language } = useLanguage();

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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[8%] top-[18%] h-60 w-60 rounded-full bg-orange-500/10 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[6%] bottom-[12%] h-56 w-56 rounded-full bg-cyan-400/8 blur-[120px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />

      <div className="container relative z-10">
        <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-[#111113] p-6 shadow-[0_0_50px_rgba(255,122,0,0.05)] md:p-20">
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500/10 blur-[100px]" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-10 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-400/60 to-transparent"
          />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-300">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              <span>{t.eyebrow}</span>
            </div>
            <h2 className="mb-8 text-3xl font-extrabold leading-[1.1] tracking-tight text-white md:text-5xl lg:text-6xl">
              <span className="mx-auto block text-center">{t.title}</span>
            </h2>

            <div className="mx-auto mb-12 max-w-3xl text-center text-lg font-light leading-relaxed md:text-2xl">
              <p className="text-gray-300">{t.subtitle}</p>
            </div>

            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <Button
                size="lg"
                className="h-16 w-full bg-orange-500 px-6 text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_30px_rgba(255,122,0,0.3)] sm:w-auto sm:px-12 sm:text-base sm:tracking-widest"
                onClick={() => window.open("https://calendly.com/glxpartners", "_blank", "noopener,noreferrer")}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {t.cta}
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
            </div>

            <p className="mt-8 text-sm font-medium uppercase tracking-wide text-gray-500">
              {t.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
