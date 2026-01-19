import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "A GLX transformou nossa operação. Saímos de um caos de planilhas para um sistema previsível de crescimento. O impacto na margem foi imediato.",
    author: "Dr. Felipe Roca Nacif",
    role: "CEO, Clínica Maktub",
    logo: "MAKTUB"
  },
  {
    quote: "Eles não entregam apenas relatórios, entregam execução. A disciplina do Lean Six Sigma aplicada à nossa realidade mudou o jogo.",
    author: "Izabela Brauer Pinho",
    role: "CEO, Healthtech Solutions",
    logo: "HTS"
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-white">
          Quem confia na <span className="text-primary">GLX</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative pl-12 border-l border-white/10"
            >
              <Quote className="absolute top-0 left-0 text-primary w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-background p-1" />
              <blockquote className="text-2xl text-white font-light leading-relaxed mb-8">
                "{item.quote}"
              </blockquote>
              <div>
                <cite className="not-italic font-bold text-white block mb-1">{item.author}</cite>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">{item.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
