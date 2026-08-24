import React, { useState } from "react";
import { getWhatsAppUrl } from "../../config/contact";
import { useTranslation } from "../../i18n";

/* Verde oficial e universal do WhatsApp — nunca alterado por tema ou marca */
const WA_GREEN = "#25D366";
const WA_GREEN_HOVER = "#20BA5A";

export const WhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const url = getWhatsAppUrl(t.whatsapp.defaultMessage);

  return (
    <div
      className="fixed z-50 flex items-center gap-3 transition-all duration-300"
      style={{
        bottom: "clamp(18px, 3vw, 24px)",
        right: "clamp(18px, 3vw, 24px)",
      }}
    >
      {/* Tooltip — Desktop apenas */}
      <div
        id="wa-tooltip"
        role="tooltip"
        aria-hidden={!isHovered}
        className={`hidden md:flex items-center bg-[#111111]/95 text-white text-[0.72rem] font-bold tracking-wider px-3.5 py-2 rounded-lg border border-white/10 shadow-2xl backdrop-blur-md transition-all duration-300 pointer-events-none ${
          isHovered
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-2 scale-95"
        }`}
      >
        <span className="relative z-10">{t.whatsapp.tooltip}</span>
      </div>

      {/* Botão Oficial Flutuante WhatsApp */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.whatsapp.ariaLabel}
        aria-describedby="wa-tooltip"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsHovered(true)}
        onBlur={() => setIsHovered(false)}
        className="group relative flex items-center justify-center gap-2.5 rounded-full text-white shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/50"
        style={{
          backgroundColor: WA_GREEN,
          boxShadow: "0 8px 24px -4px rgba(37, 211, 102, 0.45), 0 4px 12px -2px rgba(0, 0, 0, 0.3)",
          padding: "12px 18px",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = WA_GREEN_HOVER)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = WA_GREEN)}
      >
        {/* Efeito suave de pulso ao carregar */}
        <span
          className="absolute inset-0 rounded-full opacity-70 pointer-events-none animate-ping duration-1000"
          style={{ backgroundColor: WA_GREEN, animationIterationCount: 2 }}
          aria-hidden="true"
        />

        {/* Ícone Oficial WhatsApp (SVG de alta precisão) */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 shrink-0 transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.956.564 3.78 1.542 5.322L2.2 21.8l4.63-1.314A9.957 9.957 0 0 0 12.004 22c5.524 0 10.004-4.48 10.004-9.996C22.008 6.48 17.528 2 12.004 2zm5.834 14.152c-.244.686-1.42 1.306-1.96 1.38-.49.068-1.124.1-3.26-.78-2.56-1.054-4.208-3.666-4.336-3.836-.128-.17-1.03-1.372-1.03-2.618 0-1.246.654-1.858.886-2.112.232-.254.508-.318.678-.318.17 0 .34.002.488.01.158.008.37-.06.578.44.214.512.73 1.782.794 1.91.064.128.106.278.022.448-.084.17-.128.276-.254.424-.128.148-.27.33-.386.442-.128.128-.26.266-.112.522.148.254.66 1.09 1.414 1.764.972.866 1.792 1.134 2.046 1.262.254.128.404.106.554-.064.148-.17.636-.742.806-.996.17-.254.34-.212.574-.128.234.084 1.48.698 1.734.826.254.128.424.19.488.298.064.106.064.614-.18 1.3z" />
        </svg>

        {/* Texto Desktop */}
        <span className="hidden md:inline-block text-xs font-extrabold uppercase tracking-wider text-white select-none whitespace-nowrap">
          {t.whatsapp.buttonText}
        </span>
      </a>
    </div>
  );
};
