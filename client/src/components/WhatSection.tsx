import { motion } from "framer-motion";
import { TrendingUp, Settings, BarChart3, Scissors } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function WhatSection() {
  const { language } = useLanguage();

  const content = {
    pt: {
      badge: "O Que Fazemos",
      title: "Performance onde realmente importa.",
      subtitle: "Atuamos na interseção entre saúde, estratégia e tecnologia para gerar clareza, escalabilidade e resultados mensuráveis.",
      metricsLabel: "Métricas-Chave",
      services: [
        {
          icon: TrendingUp,
          title: "Growth & Aquisição",
          description: "Estruturamos funil, canais e mensagem para aumentar demanda qualificada com CAC controlado.",
          metrics: ["CAC", "Conversão", "Receita"]
        },
        {
          icon: Settings,
          title: "Otimização & Design Operacional",
          description: "Desenhamos a operação para escalar. Reduzimos filas, tempos de ciclo e gargalos com Lean.",
          metrics: ["Tempo de Ciclo", "Capacidade", "NPS"]
        },
        {
          icon: BarChart3,
          title: "KPIs & Sprints de Execução",
          description: "Transformamos estratégia em rotina: painel de indicadores + sprints semanais de melhoria.",
          metrics: ["Metas Batidas", "Velocidade", "Aderência"]
        },
        {
          icon: Scissors,
          title: "Eliminação de Desperdícios",
          description: "Cortamos custo 'invisível' (espera, retrabalho, glosas) e recuperamos margem operacional.",
          metrics: ["Margem Líquida", "Redução de Custo", "EBITDA"]
        }
      ]
    },
    en: {
      badge: "What We Do",
      title: "Performance where it really matters.",
      subtitle: "We operate at the intersection of healthcare, strategy, and technology to generate clarity, scalability, and measurable results.",
      metricsLabel: "Key Metrics",
      services: [
        {
          icon: TrendingUp,
          title: "Growth & Acquisition",
          description: "We structure funnel, channels, and messaging to increase qualified demand with controlled CAC.",
          metrics: ["CAC", "Conversion", "Revenue"]
        },
        {
          icon: Settings,
          title: "Optimization & Operational Design",
          description: "We design operations to scale. We reduce queues, cycle times, and bottlenecks with Lean.",
          metrics: ["Cycle Time", "Capacity", "NPS"]
        },
        {
          icon: BarChart3,
          title: "KPIs & Execution Sprints",
          description: "We transform strategy into routine: indicator dashboard + weekly improvement sprints.",
          metrics: ["Goals Met", "Speed", "Adherence"]
        },
        {
          icon: Scissors,
          title: "Waste Elimination",
          description: "We cut 'invisible' costs (waiting, rework, denials) and recover operating margin.",
          metrics: ["Net Margin", "Cost Reduction", "EBITDA"]
        }
      ]
    },
    es: {
      badge: "Qué Hacemos",
      title: "Rendimiento donde realmente importa.",
      subtitle: "Actuamos en la intersección entre salud, estrategia y tecnología para generar claridad, escalabilidad y resultados medibles.",
      metricsLabel: "Métricas Clave",
      services: [
        {
          icon: TrendingUp,
          title: "Growth & Adquisición",
          description: "Estructuramos embudo, canales y mensaje para aumentar demanda calificada con CAC controlado.",
          metrics: ["CAC", "Conversión", "Ingresos"]
        },
        {
          icon: Settings,
          title: "Optimización & Diseño Operacional",
          description: "Diseñamos la operación para escalar. Reducimos colas, tiempos de ciclo y cuellos de botella con Lean.",
          metrics: ["Tiempo de Ciclo", "Capacidad", "NPS"]
        },
        {
          icon: BarChart3,
          title: "KPIs & Sprints de Ejecución",
          description: "Transformamos estrategia en rutina: panel de indicadores + sprints semanales de mejora.",
          metrics: ["Metas Cumplidas", "Velocidad", "Adherencia"]
        },
        {
          icon: Scissors,
          title: "Eliminación de Desperdicios",
          description: "Cortamos costo 'invisible' (espera, retrabajo, glosas) y recuperamos margen operacional.",
          metrics: ["Margen Neto", "Reducción de Costo", "EBITDA"]
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section id="what" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
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
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white tracking-tight leading-[1.1]"
          >
            {t.title}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
            className="text-gray-400 text-xl font-light leading-relaxed"
          >
            {t.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 perspective-1000">
          {t.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, type: "spring", stiffness: 100, damping: 20 }}
              className="h-full bg-[#0A0A0B] border border-white/5 hover:border-orange-500/40 rounded-xl transition-all duration-500 group relative overflow-hidden flex flex-col"
            >
              <div className="p-8 lg:p-10 flex-grow relative z-10">
                <div className="w-16 h-16 rounded-xl bg-orange-500/10 flex items-center justify-center mb-8 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-500 border border-orange-500/20 shadow-[0_0_30px_rgba(255,122,0,0.1)] group-hover:shadow-[0_0_40px_rgba(255,122,0,0.4)]">
                  <service.icon className="h-8 w-8 text-orange-500 group-hover:text-white transition-colors duration-500" />
                </div>
                
                <h4 className="text-2xl font-bold text-white mb-4 tracking-tight">{service.title}</h4>
                <p className="text-gray-400 font-light leading-relaxed mb-8">{service.description}</p>
                
                <div className="mt-auto">
                  <div className="h-[1px] w-full bg-gradient-to-r from-white/10 to-transparent mb-6" />
                  <p className="text-[10px] uppercase tracking-[0.25em] text-orange-500 mb-4 font-bold">{t.metricsLabel}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.metrics.map((metric, i) => (
                      <span key={i} className="text-xs bg-[#111113] text-gray-300 border border-white/5 px-3 py-1.5 rounded-sm font-medium">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
