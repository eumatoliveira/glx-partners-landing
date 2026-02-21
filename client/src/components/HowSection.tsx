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
    <section id="how" className="py-24 bg-[#0A0A0B] relative overflow-hidden border-t border-white/5">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute right-0 top-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[150px] -translate-y-1/2" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/10 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <h2 className="text-orange-500 font-bold tracking-[0.2em] uppercase text-xs">{t.badge}</h2>
            </motion.div>
            
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100, damping: 20 }}
              className="text-4xl md:text-5xl lg:text-5xl font-extrabold mb-10 leading-[1.1] tracking-tight"
            >
              <span className="text-gray-400 font-light">{t.title1}</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">{t.title2}</span>
            </motion.h3>
            
            <div className="space-y-4 relative">
              {/* Connecting Line */}
              <div className="absolute left-6 lg:left-8 top-10 bottom-10 w-[1px] bg-gradient-to-b from-orange-500 via-orange-500/20 to-transparent hidden sm:block" />

              {t.steps.map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.15, type: "spring", stiffness: 100, damping: 20 }}
                  className="flex gap-6 sm:gap-8 group relative bg-[#111113]/50 p-6 rounded-2xl border border-white/5 hover:border-orange-500/30 hover:bg-[#111113] transition-all duration-500"
                >
                  <div className="relative z-10 flex-shrink-0 w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#0A0A0B] border border-white/10 flex items-center justify-center text-xl lg:text-2xl font-bold text-gray-500 group-hover:text-orange-500 group-hover:border-orange-500/50 shadow-lg transition-all duration-500 font-mono">
                    {item.step}
                  </div>
                  <div className="pt-2 lg:pt-3">
                    <h4 className="text-xl font-bold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-colors">{item.title}</h4>
                    <p className="text-gray-400 font-light leading-relaxed text-sm md:text-base">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 20 }}
              className="mt-12"
            >
              <Button 
                size="lg"
                className="group relative bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest h-14 px-10 text-sm transition-all duration-300 w-full sm:w-auto overflow-hidden"
                onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
              >
                <span className="relative z-10">{t.cta}</span>
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              </Button>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, filter: "blur(10px)", scale: 0.95 }}
            whileInView={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative hidden lg:block [perspective:1000px]"
          >
            <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none" />
              <img 
                src="/images/healthcare-dashboard.webp" 
                alt="GLX Dashboard Methodology" 
                className="w-full h-auto object-cover grayscale-[0.8] contrast-[1.1] transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent z-10 pointer-events-none opacity-80" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
