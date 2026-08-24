import { useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import type { LanguageContextType } from "./types";
import { pt } from "../locales/pt";

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: "pt",
      setLanguage: () => {},
      toggleLanguage: () => {},
      t: pt,
    };
  }
  return context;
};
