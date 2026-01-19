import { Button } from "@/components/ui/button";
import { Linkedin, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/images/logo-white-on-black.jpg" 
              alt="GLX Partners" 
              className="h-12 w-auto mb-6 mix-blend-screen" 
            />
            <p className="text-muted-foreground max-w-md mb-6">
              Ajudamos empresas de saúde a se tornarem mais enxutas, inteligentes e impactantes. 
              Growth. Lean. Execution.
            </p>
            <div className="flex gap-4">
              <a href="https://linkedin.com/company/glxpartners" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://instagram.com/glxpartners" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold uppercase tracking-widest mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:contato@glxpartners.io" className="hover:text-white transition-colors">contato@glxpartners.io</a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+5511944223257" className="hover:text-white transition-colors">(11) 94422-3257</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold uppercase tracking-widest mb-6">Menu</h4>
            <ul className="space-y-2">
              <li><button onClick={() => document.getElementById('why')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">Why</button></li>
              <li><button onClick={() => document.getElementById('what')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">What</button></li>
              <li><button onClick={() => document.getElementById('how')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">How</button></li>
              <li><button onClick={() => document.getElementById('results')?.scrollIntoView({behavior: 'smooth'})} className="text-muted-foreground hover:text-primary transition-colors">Resultados</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GLX Partners. Todos os direitos reservados.
          </p>
          <Button 
            variant="outline" 
            className="rounded-none border-primary text-primary hover:bg-primary hover:text-primary-foreground uppercase tracking-wider text-xs"
            onClick={() => window.open("https://calendly.com/", "_blank")}
          >
            Agendar Diagnóstico
          </Button>
        </div>
      </div>
    </footer>
  );
}
