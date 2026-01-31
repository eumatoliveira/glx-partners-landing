import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TestimonialsSection() {
  const { language } = useLanguage();

  const content = {
    pt: {
      title: "Quem confia na",
      titleHighlight: "GLX",
      testimonials: [
        {
          quote: "A GLX transformou nossa operação. Saímos de um caos de planilhas para um sistema previsível de crescimento. O impacto na margem foi imediato.",
          author: "Dr. Felipe Roca Nacif",
          role: "CEO, MAKTUB MEDICINA DIAGNÓSTICA"
        },
        {
          quote: "Eles não entregam apenas relatórios, entregam execução. A disciplina do Lean Six Sigma aplicada à nossa realidade mudou o jogo.",
          author: "Dra. Izabela Brauer Pinho",
          role: "CEO, Healthtech Solutions"
        }
      ]
    },
    en: {
      title: "Who trusts",
      titleHighlight: "GLX",
      testimonials: [
        {
          quote: "GLX transformed our operation. We went from spreadsheet chaos to a predictable growth system. The impact on margin was immediate.",
          author: "Dr. Felipe Roca Nacif",
          role: "CEO, MAKTUB DIAGNOSTIC MEDICINE"
        },
        {
          quote: "They don't just deliver reports, they deliver execution. The Lean Six Sigma discipline applied to our reality changed the game.",
          author: "Dr. Izabela Brauer Pinho",
          role: "CEO, Healthtech Solutions"
        }
      ]
    },
    es: {
      title: "Quién confía en",
      titleHighlight: "GLX",
      testimonials: [
        {
          quote: "GLX transformó nuestra operación. Pasamos del caos de hojas de cálculo a un sistema de crecimiento predecible. El impacto en el margen fue inmediato.",
          author: "Dr. Felipe Roca Nacif",
          role: "CEO, MAKTUB MEDICINA DIAGNÓSTICA"
        },
        {
          quote: "No solo entregan informes, entregan ejecución. La disciplina Lean Six Sigma aplicada a nuestra realidad cambió el juego.",
          author: "Dra. Izabela Brauer Pinho",
          role: "CEO, Healthtech Solutions"
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-white">
          {t.title} <span className="text-primary">{t.titleHighlight}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
          {t.testimonials.map((item, index) => (
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
