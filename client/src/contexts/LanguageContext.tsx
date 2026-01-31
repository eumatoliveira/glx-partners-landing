import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Language, translations, Translations } from "@/i18n";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "glx-language";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Tenta recuperar do localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === "pt" || saved === "en" || saved === "es")) {
        return saved as Language;
      }
    }
    return "pt"; // Português como padrão
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  };

  // Sincroniza com localStorage quando o idioma muda
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, language);
    }
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
