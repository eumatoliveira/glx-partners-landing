import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
        <Link href="/">
          <a className="flex items-center gap-2">
            <img 
              src="/images/logo-white-on-black.jpg" 
              alt="GLX Partners" 
              className="h-14 w-auto mix-blend-screen" 
            />
          </a>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection("why")} className="text-sm font-medium text-white hover:text-primary transition-colors uppercase tracking-widest">
            A GLX
          </button>
          <button onClick={() => scrollToSection("what")} className="text-sm font-medium text-white hover:text-primary transition-colors uppercase tracking-widest">
            O Que Fazemos
          </button>
          <button onClick={() => scrollToSection("cases")} className="text-sm font-medium text-white hover:text-primary transition-colors uppercase tracking-widest">
            Cases
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={() => window.open("https://calendly.com/", "_blank")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider rounded-none px-6"
          >
            Agendar Diagnóstico
          </Button>
        </div>
      </div>
    </nav>
  );
}
