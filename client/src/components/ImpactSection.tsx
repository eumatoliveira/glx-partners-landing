import { motion } from "framer-motion";

const stats = [
  { value: "+35%", label: "Eficiência Operacional" },
  { value: "3x", label: "ROI Médio em 12 Meses" },
  { value: "-40%", label: "Redução de No-Show" },
  { value: "100%", label: "Decisões Baseadas em Dados" }
];

export default function ImpactSection() {
  return (
    <section id="cases" className="py-24 bg-card border-y border-white/5">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm uppercase tracking-widest text-muted-foreground font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
