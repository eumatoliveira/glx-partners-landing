import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Elements - Mais sutis */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-card/10 to-transparent" />
        
        {/* Grid Lines - Mais finas e escuras */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '6rem 6rem'
        }} />
      </div>

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block mb-8 px-0 py-1 border-b border-primary text-white text-sm font-bold tracking-[0.2em] uppercase">
            Consultoria de Performance em Saúde
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tight text-white">
            Growth.<br />
            Lean.<br />
            <span className="text-white/50">Intelligence.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed font-light">
            Construímos sistemas de operação e aquisição que funcionam no dia a dia. Unimos Estratégia, Lean Six Sigma e IA para gerar lucro previsível.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-0">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider rounded-none h-16 px-10 text-base transition-all duration-300"
              onClick={() => window.open("https://calendly.com/", "_blank")}
            >
              Agendar Diagnóstico
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/10 hover:bg-white/5 text-white font-medium uppercase tracking-wider rounded-none h-16 px-10 text-base backdrop-blur-sm"
              onClick={() => document.getElementById('cases')?.scrollIntoView({behavior: 'smooth'})}
            >
              Ver Cases
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10">
            {/* Imagem principal em P&B puro */}
            <img 
              src="/images/consulting-meeting.jpg" 
              alt="GLX Strategy Meeting" 
              className="w-full h-auto grayscale contrast-125 shadow-2xl"
            />
            
            {/* Overlay sutil para integrar com o fundo */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-60" />
          </div>
          
          {/* Elemento gráfico minimalista */}
          <div className="absolute -bottom-8 -left-8 w-64 h-64 border border-white/5 -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
