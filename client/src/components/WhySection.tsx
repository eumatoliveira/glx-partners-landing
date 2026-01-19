import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function WhySection() {
  return (
    <section id="why" className="py-24 bg-card relative overflow-hidden">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="relative z-10">
              <img 
                src="/images/ceo-bw.webp" 
                alt="GLX Leadership" 
                className="w-full max-w-md mx-auto lg:mx-0 grayscale contrast-110 border-l-4 border-primary"
              />
            </div>
            <div className="absolute top-10 left-10 w-full h-full border-2 border-white/5 z-0 hidden lg:block" />
          </div>
          
          <div className="order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm">Why We Exist</h2>
              <h3 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
                A saúde merece <span className="text-white bg-primary/20 px-2">empresas melhores</span>.
              </h3>
              
              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  O futuro da saúde não será construído com processos inflados, métricas de vaidade e decisões reativas.
                </p>
                <p>
                  Ele será moldado por líderes ousados, que executam com clareza, medem o que importa e escalam com propósito.
                </p>
                <blockquote className="border-l-2 border-primary pl-6 py-2 my-8 text-white italic text-xl">
                  "Não vendemos ideias. Entregamos execução. Na GLX, a estratégia é apenas o começo."
                </blockquote>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {[
                  "Eliminação de Desperdícios",
                  "Decisões Baseadas em Dados",
                  "Crescimento Previsível",
                  "Execução Disciplinada"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-primary h-5 w-5" />
                    <span className="text-white font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
