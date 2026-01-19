import { Button } from "@/components/ui/button";
import { Linkedin, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/images/logo-white-on-black.jpg" 
              alt="GLX Partners" 
              className="h-24 w-auto mix-blend-screen mb-6" 
            />
            <p className="text-muted-foreground max-w-sm mb-6">
              Consultoria de Crescimento e Eficiência Operacional especializada no setor de saúde. Unimos Estratégia, Lean e Tecnologia.
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
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Menu</h4>
            <ul className="space-y-4">
              <li><a href="#why" className="text-muted-foreground hover:text-primary transition-colors">A GLX</a></li>
              <li><a href="#what" className="text-muted-foreground hover:text-primary transition-colors">O Que Fazemos</a></li>
              <li><a href="#how" className="text-muted-foreground hover:text-primary transition-colors">Método</a></li>
              <li><a href="#cases" className="text-muted-foreground hover:text-primary transition-colors">Cases</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest mb-6 text-sm">Contato</h4>
            <ul className="space-y-4 mb-6">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:contato@glxpartners.io" className="hover:text-white transition-colors">contato@glxpartners.io</a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+5511944223257" className="hover:text-white transition-colors">(11) 94422-3257</a>
              </li>
            </ul>
            <Button 
              variant="outline" 
              className="w-full border-white/10 hover:bg-white/5 text-white rounded-none"
              onClick={() => window.open("https://calendly.com/", "_blank")}
            >
              Agendar Reunião
            </Button>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} GLX Partners. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-muted-foreground hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="text-xs text-muted-foreground hover:text-white transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
