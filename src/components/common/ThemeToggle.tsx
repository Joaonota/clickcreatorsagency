import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
      aria-pressed={!isDark}
      title={isDark ? "Modo claro" : "Modo escuro"}
      className={`group flex items-center justify-center w-9 h-9 border border-[var(--color-border)] hover:border-[var(--primary)] text-[var(--color-text-secondary)] hover:text-[var(--primary)] transition-colors duration-300 ${className}`}
    >
      {isDark ? (
        <Sun size={15} strokeWidth={2} className="transition-transform duration-500 group-hover:rotate-45" />
      ) : (
        <Moon size={15} strokeWidth={2} className="transition-transform duration-500 group-hover:-rotate-12" />
      )}
    </button>
  );
};
