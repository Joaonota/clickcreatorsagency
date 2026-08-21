import React, { useState } from "react";
import { contactConfig } from "../../config/contact";

export const WhatsAppButton: React.FC = () => {
  const [tooltip, setTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Olá Click Creators! Quero saber mais sobre os vossos serviços."
  )}`;

  return (
    <div className="fixed bottom-6 right-5 md:right-8 z-50 flex items-center gap-3">
      {/* Tooltip — desktop */}
      <span
        aria-hidden="true"
        className={`hidden md:block text-[0.62rem] font-extrabold uppercase tracking-[0.2em] bg-[#111114]/95 backdrop-blur border border-[var(--border)] px-4 py-2.5 transition-all duration-300 pointer-events-none ${
          tooltip ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3"
        }`}
      >
        Chat with us
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar connosco no WhatsApp"
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        className="group relative flex items-center justify-center h-[52px] md:h-auto md:px-6 aspect-square md:aspect-auto bg-[var(--primary)] hover:bg-white text-black transition-colors duration-300"
      >
        <span
          className="absolute inset-0 border border-[var(--primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ animation: "ping-soft 1.8s cubic-bezier(0,0,0.2,1) infinite" }}
          aria-hidden="true"
        />
        {/* Mobile: dot only */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 md:hidden"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.2.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.2.1.4.2.4.3.1.1.1.6-.1 1Z" />
        </svg>
        {/* Desktop: CHAT WITH US */}
        <span className="hidden md:flex items-center gap-2.5 text-[0.66rem] font-extrabold uppercase tracking-[0.18em] py-4">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.5 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.2.1.3 0 .5l-.4.6c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.2.1.4.2.4.3.1.1.1.6-.1 1Z" />
          </svg>
          Chat with us
        </span>
      </a>
    </div>
  );
};
