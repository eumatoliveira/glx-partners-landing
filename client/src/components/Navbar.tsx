import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language, languageNames } from "@/i18n";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const languages: Language[] = ["pt", "en", "es"];

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
            {t.nav.about}
          </button>
          <button onClick={() => scrollToSection("what")} className="text-base font-medium text-white hover:text-primary transition-colors tracking-wide">
            {t.nav.services}
          </button>
          <button onClick={() => scrollToSection("cases")} className="text-base font-medium text-white hover:text-primary transition-colors tracking-wide">
            {t.nav.cases}
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

          <Link href="/login">
            <Button 
              variant="outline"
              className="hidden md:flex border-white/20 text-white hover:bg-white/10 font-bold uppercase tracking-wider rounded-none px-6"
            >
              {t.nav.membersArea}
            </Button>
          </Link>
          <Button 
            onClick={() => window.open("http://www.calendly.com/glxpartners", "_blank")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold uppercase tracking-wider rounded-none px-6"
          >
            {t.nav.schedule}
          </Button>
        </div>
      </div>
    </nav>
  );
}
