import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function HowSection() {
  return (
    <section id="how" className="py-24 bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-primary/20 blur-3xl" />
      </div>

      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">How We Do It</h2>
            <h3 className="text-3xl md:text-4xl font-bold mb-8 leading-tight text-white">
              <span className="text-muted-foreground">Método</span> <span className="text-white">GLX</span>
            </h3>
            
            <div className="space-y-12">
              {[
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
              ].map((item, index) => (
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
                onClick={() => window.open("https://calendly.com/", "_blank")}
              >
                Começar Transformação
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
            
            {/* Certifications Badge */}
            <div className="absolute -bottom-8 -right-8 bg-white text-black p-6 max-w-xs shadow-xl">
              <p className="font-bold uppercase tracking-wider text-xs mb-2 border-b border-black/10 pb-2">Certificações</p>
              <p className="font-medium text-sm">
                Equipe certificada Black Belt e Master Black Belt pelos maiores conselhos de Lean Health do mundo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
