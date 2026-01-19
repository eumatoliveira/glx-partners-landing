import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-background">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-card/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-background to-transparent" />
        
        {/* Grid Lines */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem'
        }} />
      </div>

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block mb-6 px-4 py-1 border border-primary/30 bg-primary/10 text-primary text-sm font-bold tracking-widest uppercase">
            Consultoria em Saúde
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            GROWTH.<br />
            <span className="text-muted-foreground">LEAN.</span><br />
            <span className="text-primary">EXECUTION.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed border-l-2 border-primary/50 pl-6">
            Ajudamos empresas de saúde a crescer mais rápido, com menos desperdício e mais previsibilidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider rounded-none h-14 px-8 text-lg"
              onClick={() => window.open("https://calendly.com/", "_blank")}
            >
              Agendar Diagnóstico
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/20 hover:bg-white/5 text-white font-medium uppercase tracking-wider rounded-none h-14 px-8"
              onClick={() => document.getElementById('what')?.scrollIntoView({behavior: 'smooth'})}
            >
              Conheça o Método
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 border border-white/10 bg-card/50 backdrop-blur-sm p-2">
            <img 
              src="/images/strategy-meeting.jpg" 
              alt="GLX Strategy Meeting" 
              className="w-full h-auto grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
            />
            
            {/* Floating Stats Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute -bottom-10 -left-10 bg-background border border-primary p-6 shadow-2xl max-w-xs"
            >
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Resultado Médio</p>
              <div className="text-4xl font-bold text-white mb-1">+35%</div>
              <p className="text-sm text-primary font-medium">Eficiência Operacional</p>
            </motion.div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border-t-2 border-r-2 border-primary/50" />
          <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-primary/50" />
        </motion.div>
      </div>
    </section>
  );
}
