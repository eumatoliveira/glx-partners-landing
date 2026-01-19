import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-card/10 to-transparent" />
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '6rem 6rem'
        }} />
      </div>

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Coluna da Esquerda: Texto */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="order-1 lg:order-1"
        >
          <div className="inline-block mb-8 px-0 py-1 border-b border-primary text-white text-sm font-bold tracking-[0.2em] uppercase">
            Consultoria de Performance em Saúde
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tight text-white">
            Growth.<br />
            Lean.<br />
            <span className="text-white/50">Execution.</span>
          </h1>
          
          <p className="text-2xl text-white font-medium mb-6 leading-relaxed">
            Transformamos sua operação em <span className="text-primary">Lucro Líquido Previsível</span>.
          </p>

          <p className="text-lg text-muted-foreground mb-10 max-w-lg leading-relaxed font-light">
            Dashboards + Rotina de Gestão + Processos + Automações + IA + Treinamento + Metas. Tudo integrado em um único sistema.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-0">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider rounded-none h-16 px-10 text-base transition-all duration-300 w-full sm:w-auto"
              onClick={() => window.open("https://calendly.com/", "_blank")}
            >
              Agendar Diagnóstico
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/10 hover:bg-white/5 text-white font-medium uppercase tracking-wider rounded-none h-16 px-10 text-base backdrop-blur-sm w-full sm:w-auto"
              onClick={() => document.getElementById('cases')?.scrollIntoView({behavior: 'smooth'})}
            >
              Ver Cases
            </Button>
          </div>
        </motion.div>

        {/* Coluna da Direita: Imagem */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative order-2 lg:order-2 flex justify-center lg:justify-end"
        >
          <div className="relative z-10 w-full max-w-lg lg:max-w-full">
            {/* Imagem principal usando ImagemInicial.png conforme solicitado */}
            <img 
              src="/ImagemInicial.png" 
              alt="GLX Strategy Meeting" 
              className="w-full h-auto grayscale contrast-125 shadow-2xl border border-white/5 object-cover rounded-sm"
            />
            
            {/* Overlay sutil para integrar com o fundo escuro */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent opacity-40" />
          </div>
          
          {/* Elemento gráfico decorativo atrás da imagem */}
          <div className="absolute -bottom-6 -left-6 w-full h-full border border-white/5 -z-10 hidden lg:block" />
        </motion.div>
      </div>
    </section>
  );
}
