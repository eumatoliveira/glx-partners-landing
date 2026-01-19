import { motion } from "framer-motion";
import { TrendingUp, Settings, BarChart3, Scissors } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
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
];

export default function WhatSection() {
  return (
    <section id="what" className="py-24 bg-background relative">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">O Que Fazemos</h2>
          <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Performance onde realmente importa.
          </h3>
          <p className="text-muted-foreground text-lg">
            Atuamos na interseção entre saúde, estratégia e tecnologia para gerar clareza, escalabilidade e resultados mensuráveis.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
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
                  <p className="text-muted-foreground mb-6 h-20">{service.description}</p>
                  <div className="border-t border-border/50 pt-4">
                    <p className="text-xs uppercase tracking-widest text-primary mb-2 font-bold">Métricas-Chave</p>
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
