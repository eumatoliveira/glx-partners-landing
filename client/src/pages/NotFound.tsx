import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { m } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const COPY = {
  pt: {
    title: "Página não encontrada",
    description: "A página que você procura não existe ou pode ter sido movida.",
    goHome: "Página Inicial",
    goBack: "Voltar",
  },
  en: {
    title: "Page not found",
    description: "The page you are looking for doesn't exist or may have been moved.",
    goHome: "Go Home",
    goBack: "Go Back",
  },
  es: {
    title: "Página no encontrada",
    description: "La página que buscas no existe o puede haber sido movida.",
    goHome: "Inicio",
    goBack: "Volver",
  },
} as const;

export default function NotFound() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[20%] top-[30%] h-64 w-64 rounded-full bg-orange-500/8 blur-[120px]" />
        <div className="absolute right-[20%] top-[40%] h-52 w-52 rounded-full bg-cyan-400/6 blur-[100px]" />
      </div>

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Giant 404 */}
        <m.span
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-[10rem] font-extrabold leading-none tracking-tighter gradient-text sm:text-[14rem]"
        >
          404
        </m.span>

        <m.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mt-4 text-2xl font-bold text-foreground sm:text-3xl"
        >
          {t.title}
        </m.h1>

        <m.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mt-3 max-w-md text-muted-foreground text-base"
        >
          {t.description}
        </m.p>

        <m.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          id="not-found-button-group"
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="neon-btn-outline border-white/15 text-foreground px-6 h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.goBack}
          </Button>
          <Button
            onClick={() => setLocation("/")}
            className="neon-btn-solid bg-primary hover:bg-primary/90 text-primary-foreground px-6 h-12 font-semibold"
          >
            <Home className="w-4 h-4 mr-2" />
            {t.goHome}
          </Button>
        </m.div>
      </m.div>
    </div>
  );
}
