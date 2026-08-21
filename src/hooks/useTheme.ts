import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "clickcreators-theme";

function readStoredTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    /* storage indisponível */
  }
  return "dark";
}

let currentTheme: Theme = readStoredTheme();
const listeners = new Set<(theme: Theme) => void>();

function applyToDocument(theme: Theme) {
  const root = document.documentElement;
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
}

/* Transição suave: ativa .theming durante a troca e remove de seguida,
   para não penalizar animações permanentes. */
function applyWithTransition(theme: Theme) {
  const root = document.documentElement;
  root.classList.add("theming");
  applyToDocument(theme);
  window.setTimeout(() => root.classList.remove("theming"), 320);
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(currentTheme);

  useEffect(() => {
    applyToDocument(currentTheme);
    const listener = (t: Theme) => setThemeState(t);
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    if (next === currentTheme) return;
    currentTheme = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage indisponível */
    }
    applyWithTransition(next);
    listeners.forEach((listener) => listener(next));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  }, [setTheme]);

  return { theme, toggleTheme, setTheme };
}
