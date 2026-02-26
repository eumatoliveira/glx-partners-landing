import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { m } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const COPY = {
  pt: {
    title: "Agendamento Confirmado!",
    subtitle: "Obrigado por agendar seu diagnóstico com a GLX Partners. Enviamos os detalhes da reunião para o seu e-mail.",
    nextSteps: "Próximos Passos",
    steps: [
      "Verifique seu e-mail para confirmar o convite.",
      "Se possível, tenha em mãos os principais KPIs da sua operação.",
      "A reunião será realizada via Google Meet ou Zoom.",
    ],
    backHome: "Voltar para a Home",
  },
  en: {
    title: "Booking Confirmed!",
    subtitle: "Thank you for scheduling your diagnostic with GLX Partners. We've sent the meeting details to your email.",
    nextSteps: "Next Steps",
    steps: [
      "Check your email to confirm the invite.",
      "If possible, have your main operational KPIs ready.",
      "The meeting will be held via Google Meet or Zoom.",
    ],
    backHome: "Back to Home",
  },
  es: {
    title: "¡Reserva Confirmada!",
    subtitle: "Gracias por agendar tu diagnóstico con GLX Partners. Enviamos los detalles de la reunión a tu correo.",
    nextSteps: "Próximos Pasos",
    steps: [
      "Verifica tu correo para confirmar la invitación.",
      "Si es posible, ten a mano los principales KPIs de tu operación.",
      "La reunión será por Google Meet o Zoom.",
    ],
    backHome: "Volver al Inicio",
  },
} as const;

export default function ThankYou() {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      {/* Ambient glows */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[30%] top-[20%] h-72 w-72 rounded-full bg-orange-500/8 blur-[140px]" />
        <div className="absolute right-[25%] bottom-[20%] h-56 w-56 rounded-full bg-cyan-400/6 blur-[110px]" />
      </div>

      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 max-w-md w-full space-y-8"
      >
        {/* Success Icon */}
        <m.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.5, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="w-24 h-24 glass-card rounded-full flex items-center justify-center border-orange-500/20">
            <CheckCircle className="w-12 h-12 text-primary" strokeWidth={1.5} />
          </div>
        </m.div>

        {/* Title + Subtitle */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.45 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight sm:text-4xl">
            {t.title}
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            {t.subtitle}
          </p>
        </m.div>

        {/* Next Steps Card */}
        <m.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
          className="glass-card p-6 rounded-xl text-left space-y-4"
        >
          <h3 className="text-foreground font-bold uppercase tracking-wider text-sm border-b border-white/8 pb-3">
            {t.nextSteps}
          </h3>
          <ul className="space-y-3.5 text-sm text-muted-foreground">
            {t.steps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-primary font-bold tabular-nums shrink-0">
                  {String(i + 1).padStart(2, "0")}.
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </m.div>

        {/* Back Home */}
        <m.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="pt-2"
        >
          <Link href="/">
            <Button
              variant="outline"
              className="w-full neon-btn-outline border-white/10 text-foreground py-6 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.backHome}
            </Button>
          </Link>
        </m.div>
      </m.div>
    </div>
  );
}
