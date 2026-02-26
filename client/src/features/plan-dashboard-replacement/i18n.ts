import { useLanguage } from "@/contexts/LanguageContext";

type Dict = Record<string, string>;

// Compatibility shim for imported dashboard code that expects a local `useTranslation`.
// Falls back to the original text when no translation is provided.
const translationsByLanguage: Record<"pt" | "en" | "es", Dict> = {
  pt: {},
  en: {},
  es: {},
};

export function useTranslation() {
  const { language } = useLanguage();
  const dict = translationsByLanguage[language] ?? {};

  return {
    language,
    t: (key: string) => dict[key] ?? key,
  };
}

