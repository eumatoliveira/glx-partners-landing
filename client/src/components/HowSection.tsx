import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HowSection() {
  const { language } = useLanguage();

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
          desc: "Mapeamos a verdade operacional da clínica para entender onde o dinheiro está vazando."
        },
        {
          step: "02",
          title: "Setup e Implementação",
          desc: "Instalamos os processos, dashboards e automações necessárias para a operação rodar."
        },
        {
          step: "03",
          title: "Execução & Sprints",
          desc: "Rotina de gestão semanal. Acompanhamento de metas e correção de rota rápida."
        },
        {
          step: "04",
          title: "Gestão Contínua / Partners",
          desc: "Acompanhamento de longo prazo para garantir escala sustentável e novos patamares."
        }
      ]
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
          desc: "We map the clinic's operational truth to understand where money is leaking."
        },
        {
          step: "02",
          title: "Setup & Implementation",
          desc: "We install the processes, dashboards, and automations needed for operations to run."
        },
        {
          step: "03",
          title: "Execution & Sprints",
          desc: "Weekly management routine. Goal tracking and quick course correction."
        },
        {
          step: "04",
          title: "Continuous Management / Partners",
          desc: "Long-term follow-up to ensure sustainable scale and new levels."
        }
      ]
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
          desc: "Mapeamos la verdad operacional de la clínica para entender dónde se está fugando el dinero."
        },
        {
          step: "02",
          title: "Setup e Implementación",
          desc: "Instalamos los procesos, dashboards y automatizaciones necesarias para que la operación funcione."
        },
        {
          step: "03",
          title: "Ejecución & Sprints",
          desc: "Rutina de gestión semanal. Seguimiento de metas y corrección de rumbo rápida."
        },
        {
          step: "04",
          title: "Gestión Continua / Partners",
          desc: "Acompañamiento a largo plazo para garantizar escala sostenible y nuevos niveles."
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section id="how" className="py-24 bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">{t.badge}</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-8 leading-tight text-white">
              <span className="text-muted-foreground">{t.title1}</span> <span className="text-white">{t.title2}</span>
            </h3>
            
            <div className="space-y-12">
              {t.steps.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="flex gap-6 group"
                >
                  <div className="text-4xl font-bold text-muted-foreground/20 group-hover:text-primary transition-colors duration-300 font-mono">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-white">{item.title}</h4>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12">
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider rounded-none px-8 py-6"
                onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
              >
                {t.cta}
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 border border-white/10 bg-background p-2 shadow-2xl">
              <img 
                src="/images/healthcare-dashboard.webp" 
                alt="GLX Dashboard Methodology" 
                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity grayscale contrast-110"
              />
            </div>
            

          </div>
        </div>
      </div>
    </section>
  );
}
