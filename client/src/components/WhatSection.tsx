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
    <section id="what" className="py-24 bg-background relative">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">{t.badge}</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            {t.title}
          </h3>
          <p className="text-muted-foreground text-lg">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-card border-border/50 hover:border-primary/50 transition-colors duration-300 group">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <service.icon className="h-6 w-6 text-primary group-hover:text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 min-h-[5rem]">{service.description}</p>
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs uppercase tracking-widest text-primary mb-2 font-bold">{t.metricsLabel}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.metrics.map((metric, i) => (
                        <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 font-medium">
                          {metric}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
