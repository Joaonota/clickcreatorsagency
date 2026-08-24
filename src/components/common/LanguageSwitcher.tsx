import React from "react";
import { useTranslation } from "../../i18n";

interface LanguageSwitcherProps {
  className?: string;
  variant?: "header" | "mobile" | "footer";
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = "",
  variant = "header",
}) => {
  const { lang, setLanguage } = useTranslation();

  if (variant === "mobile") {
    return (
      <div
        className={`flex items-center gap-2 p-1 bg-[var(--surface)] border border-[var(--border)] rounded-full ${className}`}
        role="group"
        aria-label="Selecionar idioma"
      >
        <button
          type="button"
          onClick={() => setLanguage("pt")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            lang === "pt"
              ? "bg-[var(--primary)] text-black font-extrabold shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--color-text)]"
          }`}
          aria-pressed={lang === "pt"}
        >
          PT
        </button>
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            lang === "en"
              ? "bg-[var(--primary)] text-black font-extrabold shadow-sm"
              : "text-[var(--text-secondary)] hover:text-[var(--color-text)]"
          }`}
          aria-pressed={lang === "en"}
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${className}`}
      role="group"
      aria-label="Selecionar idioma"
    >
      <button
        type="button"
        onClick={() => setLanguage("pt")}
        className={`transition-colors duration-200 px-1 py-0.5 rounded cursor-pointer ${
          lang === "pt"
            ? "text-[var(--primary)] font-extrabold"
            : "text-[var(--text-muted)] hover:text-[var(--color-text)]"
        }`}
        aria-pressed={lang === "pt"}
        title="Português"
      >
        PT
      </button>
      <span className="text-[var(--border-strong)] select-none text-[0.65rem]">/</span>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`transition-colors duration-200 px-1 py-0.5 rounded cursor-pointer ${
          lang === "en"
            ? "text-[var(--primary)] font-extrabold"
            : "text-[var(--text-muted)] hover:text-[var(--color-text)]"
        }`}
        aria-pressed={lang === "en"}
        title="English"
      >
        EN
      </button>
    </div>
  );
};
