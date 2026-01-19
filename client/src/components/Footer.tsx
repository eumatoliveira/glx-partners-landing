import { Button } from "@/components/ui/button";
import { Linkedin, Instagram, Mail, Youtube } from "lucide-react";

// Ícone do WhatsApp SVG inline para garantir visualização correta
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-background border-t border-white/5 py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <img 
              src="/images/logo-white-on-black.jpg" 
              alt="GLX Partners" 
              className="h-32 w-auto mix-blend-screen mb-8" style={{width: '150px', height: '150px'}} 
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
              <a href="https://wa.me/5511944223257" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <WhatsAppIcon className="h-6 w-6" />
              </a>
              <a href="https://www.youtube.com/@glxpartners" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-6 w-6" />
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
            </ul>
            <Button 
              variant="outline" 
              className="w-full border-white/10 hover:bg-white/5 text-white rounded-none"
              onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
            >
              Agendar Reunião
            </Button>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            2026 GLX Partners Enablement LTDA. CNPJ 63944929/000199. Todos os direitos reservados.
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
