import React, { useEffect, useRef, useCallback } from "react";

type RevealOptions = { threshold?: number; once?: boolean };

// eslint-disable-next-line react-refresh/only-export-components
export function useReveal(options: RevealOptions = {}) {
  const { threshold = 0.15, once = true } = options;
  const ref = useRef<HTMLElement | null>(null);

  const setRef = useCallback((node: HTMLElement | null) => {
    ref.current = node;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          if (once) observer.disconnect();
        } else if (!once) {
          el.classList.remove("visible");
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return setRef;
}

// A generic wrapper component that applies the reveal class
export const Reveal: React.FC<{
  children: React.ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
  as?: "div" | "span" | "li" | "ol" | "ul" | "p";
}> = ({ children, delay = 0, className = "", as: Tag = "div" }) => {
  const ref = useReveal();
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : "";
  return (
    <Tag
      ref={ref as React.RefCallback<HTMLElement>}
      className={`reveal ${delayClass} ${className}`.trim()}
    >
      {children}
    </Tag>
  );
};
