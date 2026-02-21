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
    <section id="results" className="py-24 bg-[#0A0A0B] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="bg-[#111113] border border-orange-500/20 p-10 md:p-20 relative overflow-hidden rounded-2xl shadow-[0_0_50px_rgba(255,122,0,0.05)]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 text-white tracking-tight leading-[1.1]">
              {t.title}
            </h2>
            <p className="text-xl md:text-2xl text-gray-400 font-light mb-12 leading-relaxed">
              {t.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="group relative bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest h-16 px-12 text-base transition-all duration-300 w-full sm:w-auto overflow-hidden shadow-[0_0_30px_rgba(255,122,0,0.3)] hover:shadow-[0_0_40px_rgba(255,122,0,0.5)]"
                onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
              >
                <span className="relative z-10 flex items-center gap-3">
                  {t.cta}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </Button>
            </div>
            
            <p className="mt-8 text-sm text-gray-500 font-medium tracking-wide uppercase">
              {t.note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
