import { motion } from "framer-motion";

const stats = [
  { value: "+35%", label: "Eficiência Operacional" },
  { value: "3x", label: "ROI Médio em 12 Meses" },
  { value: "-40%", label: "Redução de No-Show" },
  { value: "100%", label: "Decisões Baseadas em Dados" }
];

const clientLogos = [
  "/images/logo-maktub-new.png",
  "/images/logo-healthtech-new.png",
  "/images/logo-maktub-new.png",
  "/images/logo-healthtech-new.png",
  "/images/logo-maktub-new.png",
  "/images/logo-healthtech-new.png"
];

export default function ImpactSection() {
  return (
    <section id="cases" className="py-24 bg-card border-y border-white/5 overflow-hidden">
      <div className="container mb-24">
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

      {/* Logos dos Clientes com Animação Marquee (Direita) */}
      <div className="relative w-full overflow-hidden py-10 border-t border-white/5 bg-background/50 backdrop-blur-sm">
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-background via-transparent to-background" />
        
        <div className="flex items-center gap-24 animate-scroll-right whitespace-nowrap">
          {/* Primeira cópia dos logos */}
          {clientLogos.map((logo, index) => (
            <div key={`logo-1-${index}`} className="flex-shrink-0 w-64 h-32 flex items-center justify-center grayscale opacity-60 blur-[1px] hover:grayscale-0 hover:opacity-100 hover:blur-0 transition-all duration-500">
              <img 
                src={logo} 
                alt="Client Logo" 
                className="max-w-full max-h-full object-contain mix-blend-screen"
              />
            </div>
          ))}
          {/* Segunda cópia para loop infinito */}
          {clientLogos.map((logo, index) => (
            <div key={`logo-2-${index}`} className="flex-shrink-0 w-64 h-32 flex items-center justify-center grayscale opacity-60 blur-[1px] hover:grayscale-0 hover:opacity-100 hover:blur-0 transition-all duration-500">
              <img 
                src={logo} 
                alt="Client Logo" 
                className="max-w-full max-h-full object-contain mix-blend-screen"
              />
            </div>
          ))}
           {/* Terceira cópia para garantir cobertura em telas largas */}
           {clientLogos.map((logo, index) => (
            <div key={`logo-3-${index}`} className="flex-shrink-0 w-64 h-32 flex items-center justify-center grayscale opacity-60 blur-[1px] hover:grayscale-0 hover:opacity-100 hover:blur-0 transition-all duration-500">
              <img 
                src={logo} 
                alt="Client Logo" 
                className="max-w-full max-h-full object-contain mix-blend-screen"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
