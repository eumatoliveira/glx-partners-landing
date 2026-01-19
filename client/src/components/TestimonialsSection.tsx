import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "A GLX transformou nossa operação. Saímos de um caos de planilhas para um sistema previsível de crescimento. O impacto na margem foi imediato.",
    author: "Dr. Felipe Roca Nacif",
    role: "CEO, MAKTUB MEDICINA DIAGNÓSTICA",
    logo: "MAKTUB"
  },
  {
    quote: "Eles não entregam apenas relatórios, entregam execução. A disciplina do Lean Six Sigma aplicada à nossa realidade mudou o jogo.",
    author: "Dra. Izabela Brauer Pinho",
    role: "CEO, Healthtech Solutions",
    logo: "HTS"
  }
];

const clientLogos = [
  "/images/logo-maktub.jpg",
  "/images/logo-healthtech.png",
  "/images/logo-maktub.jpg", 
  "/images/logo-healthtech.png"
];

export default function TestimonialsSection() {
  return (
    <section className="py-32 bg-background relative overflow-hidden">
      <div className="container relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-white">
          Quem confia na <span className="text-primary">GLX</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
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

        {/* Logos dos Clientes com Animação Marquee */}
        <div className="relative w-full overflow-hidden py-10 border-t border-white/5">
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />
          
          <div className="flex items-center gap-16 animate-scroll whitespace-nowrap">
            {/* Primeira cópia dos logos */}
            {clientLogos.map((logo, index) => (
              <div key={`logo-1-${index}`} className="flex-shrink-0 w-48 h-24 flex items-center justify-center grayscale opacity-50 blur-[0.5px] hover:grayscale-0 hover:opacity-100 hover:blur-0 transition-all duration-500">
                <img 
                  src={logo} 
                  alt="Client Logo" 
                  className="max-w-full max-h-full object-contain mix-blend-screen"
                />
              </div>
            ))}
            {/* Segunda cópia para loop infinito */}
            {clientLogos.map((logo, index) => (
              <div key={`logo-2-${index}`} className="flex-shrink-0 w-48 h-24 flex items-center justify-center grayscale opacity-50 blur-[0.5px] hover:grayscale-0 hover:opacity-100 hover:blur-0 transition-all duration-500">
                <img 
                  src={logo} 
                  alt="Client Logo" 
                  className="max-w-full max-h-full object-contain mix-blend-screen"
                />
              </div>
            ))}
             {/* Terceira cópia para garantir cobertura em telas largas */}
             {clientLogos.map((logo, index) => (
              <div key={`logo-3-${index}`} className="flex-shrink-0 w-48 h-24 flex items-center justify-center grayscale opacity-50 blur-[0.5px] hover:grayscale-0 hover:opacity-100 hover:blur-0 transition-all duration-500">
                <img 
                  src={logo} 
                  alt="Client Logo" 
                  className="max-w-full max-h-full object-contain mix-blend-screen"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
