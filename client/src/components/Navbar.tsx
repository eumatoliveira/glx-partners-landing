import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Globe, Check, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, languageNames } from "@/i18n";
import { useState } from "react";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const languages: Language[] = ["pt", "en", "es"];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container flex items-center justify-between h-16 md:h-20 px-4">
        {/* Logo - menor em mobile */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <img 
            src="/images/logo-transparent.png" 
            alt="GLX Partners" 
            className="h-16 md:h-28 w-auto" 
          />
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection("why")} className="text-base font-medium text-white hover:text-primary transition-colors tracking-wide">
            {t.nav.about}
          </button>
          <button onClick={() => scrollToSection("what")} className="text-base font-medium text-white hover:text-primary transition-colors tracking-wide">
            {t.nav.services}
          </button>
          <button onClick={() => scrollToSection("cases")} className="text-base font-medium text-white hover:text-primary transition-colors tracking-wide">
            {t.nav.cases}
          </button>
        </div>

        {/* Ações Desktop e Mobile */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Seletor de Idioma */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:text-primary hover:bg-transparent h-9 w-9 md:h-10 md:w-10">
                <Globe className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border-white/10 text-white">
              {languages.map((lang) => (
                <DropdownMenuItem 
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className="hover:bg-white/10 cursor-pointer flex items-center justify-between"
                >
                  {languageNames[lang]}
                  {language === lang && <Check className="h-4 w-4 ml-2 text-primary" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Botão Área de Membros - Desktop */}
          <Link href="/login">
            <Button 
              variant="outline"
              className="hidden md:flex neon-btn-outline border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-wider px-6"
            >
              {t.nav.membersArea}
            </Button>
          </Link>

          {/* Botão Agendar - Desktop */}
          <Button 
            onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
            className="hidden md:flex neon-btn-solid bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider px-6"
          >
            {t.nav.schedule}
          </Button>

          {/* Menu Hambúrguer - Mobile */}
          <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden text-white hover:text-primary hover:bg-transparent h-9 w-9"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/95 border-white/10 text-white w-56 mr-2">
              <DropdownMenuItem 
                onClick={() => scrollToSection("why")}
                className="hover:bg-white/10 cursor-pointer py-3"
              >
                {t.nav.about}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => scrollToSection("what")}
                className="hover:bg-white/10 cursor-pointer py-3"
              >
                {t.nav.services}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => scrollToSection("cases")}
                className="hover:bg-white/10 cursor-pointer py-3"
              >
                {t.nav.cases}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.location.href = "/login";
                }}
                className="hover:bg-white/10 cursor-pointer py-3 border-t border-white/10 mt-2"
              >
                {t.nav.membersArea}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.open("http://www.calendly.com/glxpartners", "_blank");
                }}
                className="hover:bg-primary/20 cursor-pointer py-3 text-primary font-bold"
              >
                {t.nav.schedule}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
