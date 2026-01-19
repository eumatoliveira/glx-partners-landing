import { motion } from "framer-motion";

export default function WhySection() {
  return (
    <section id="why" className="py-32 bg-background relative border-t border-white/5">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white"
          >
            Não vendemos marketing.<br />
            <span className="text-white/40">Construímos sistemas de crescimento.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            Em um mercado cheio de "gurus" e fórmulas genéricas, a GLX se diferencia pela engenharia. 
            Nossa abordagem combina crescimento guiado por dados, otimização de processos e automação inteligente.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Growth Strategy",
              desc: "Aquisição de clientes com CAC controlado e previsibilidade de receita."
            },
            {
              title: "Lean Six Sigma",
              desc: "Eliminação implacável de desperdícios e variabilidade operacional."
            },
            {
              title: "Inteligência Artificial",
              desc: "Automação de processos repetitivos para escalar sem inflar a equipe."
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + (index * 0.1) }}
              className="bg-card p-10 border border-white/5 hover:border-primary/30 transition-colors duration-500 group"
            >
              <div className="w-12 h-1 bg-primary mb-8 group-hover:w-24 transition-all duration-500" />
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
