import React, { useState, useEffect } from "react";
import { LanguageContext } from "./LanguageContext";
import {
  type Language,
  type LanguageContextType,
  STORAGE_KEY,
  translations,
  getInitialLanguage,
} from "./types";
import { pt } from "../locales/pt";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(getInitialLanguage);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang === "pt" ? "pt-MZ" : "en";
    } catch {
      // Ignora erro de storage
    }
  };

  const toggleLanguage = () => {
    setLanguage(lang === "pt" ? "en" : "pt");
  };

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-MZ" : "en";
  }, [lang]);

  const value: LanguageContextType = {
    lang,
    setLanguage,
    toggleLanguage,
    t: translations[lang] || pt,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};
