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
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-4xl md:text-5xl lg:text-5xl font-extrabold mb-24 text-center tracking-tight"
        >
          <span className="text-white">{t.title}</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300">{t.titleHighlight}</span>
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 mb-24 perspective-1000">
          {t.testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, rotateX: 5 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, type: "spring", stiffness: 100, damping: 20 }}
              className="relative pl-12 border-l border-white/10 group hover:border-orange-500/50 transition-colors duration-500"
            >
              <div className="absolute top-0 left-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-[#050505] flex items-center justify-center rounded-full border border-white/10 group-hover:border-orange-500/50 transition-colors duration-500">
                <Quote className="text-orange-500 w-4 h-4" />
              </div>
              <blockquote className="text-2xl lg:text-3xl text-gray-300 font-light leading-relaxed mb-10 group-hover:text-white transition-colors duration-500">
                "{item.quote}"
              </blockquote>
              <div className="flex flex-col gap-1">
                <cite className="not-italic font-bold text-white text-lg">{item.author}</cite>
                <span className="text-xs text-orange-500 uppercase tracking-widest font-bold">{item.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
