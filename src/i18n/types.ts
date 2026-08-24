import { pt } from "../locales/pt";
import { en } from "../locales/en";

export type Language = "pt" | "en";
export type TranslationDict = typeof pt;

export interface LanguageContextType {
  lang: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: TranslationDict;
}

export const STORAGE_KEY = "clickcreators-language";

export const translations: Record<Language, TranslationDict> = {
  pt,
  en,
};

export const getInitialLanguage = (): Language => {
  if (typeof window === "undefined") return "pt";

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "pt" || saved === "en") {
      return saved;
    }

    const browserLang = navigator.language?.toLowerCase() || "";
    if (browserLang.startsWith("pt")) {
      return "pt";
    }
    if (browserLang.startsWith("en")) {
      return "en";
    }
  } catch {
    // Fallback se localStorage estiver bloqueado
  }

  // Padrão obrigatório: Português
  return "pt";
};
