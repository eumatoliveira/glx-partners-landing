import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ResultsSection() {
  const { language } = useLanguage();

  const content = {
    pt: {
      title: "Pronto para escalar com previsibilidade?",
      subtitle: "Se você quer clareza sobre onde estão os maiores ganhos de margem e capacidade na sua operação, agende um Diagnóstico Executivo.",
      cta: "Agendar Agora",
      note: "Diagnóstico inicial de 30 minutos."
    },
    en: {
      title: "Ready to scale with predictability?",
      subtitle: "If you want clarity on where the biggest margin and capacity gains are in your operation, schedule an Executive Diagnosis.",
      cta: "Schedule Now",
      note: "Initial 30-minute diagnosis."
    },
    es: {
      title: "¿Listo para escalar con previsibilidad?",
      subtitle: "Si quieres claridad sobre dónde están las mayores ganancias de margen y capacidad en tu operación, agenda un Diagnóstico Ejecutivo.",
      cta: "Agendar Ahora",
      note: "Diagnóstico inicial de 30 minutos."
    }
  };

  const t = content[language];

  return (
    <section id="results" className="py-24 bg-background relative">
      <div className="container">
        <div className="bg-card border border-border p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">
              {t.title}
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              {t.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider rounded-none h-16 px-10 text-lg group"
                onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
              >
                {t.cta}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground">
              {t.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
