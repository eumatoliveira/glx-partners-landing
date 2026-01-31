import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <img 
            src="/images/logo-white-on-black.jpg" 
            alt="GLX Partners" 
            className="h-28 w-auto mix-blend-screen" 
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection("why")} className="text-base font-medium text-white hover:text-primary transition-colors tracking-wide">
            A GLX
          </button>
          <button onClick={() => scrollToSection("what")} className="text-base font-medium text-white hover:text-primary transition-colors tracking-wide">
            O Que Fazemos
          </button>
          <button onClick={() => scrollToSection("cases")} className="text-base font-medium text-white hover:text-primary transition-colors tracking-wide">
            Cases
          </button>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-transparent">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Português</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">English</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Español</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/login">
            <Button 
              variant="outline"
              className="hidden md:flex border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-wider rounded-none px-6"
            >
              Área de Membros
            </Button>
          </Link>
          <Button 
            onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider rounded-none px-6"
          >
            Agendar Diagnóstico
          </Button>
        </div>
      </div>
    </nav>
  );
}
