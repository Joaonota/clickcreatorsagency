import React from "react";
import { getWhatsAppUrl } from "../../config/contact";
import { useTranslation } from "../../i18n";

export const WhatsAppButton: React.FC = () => {
  const { t } = useTranslation();

  const url = getWhatsAppUrl(t.whatsapp.defaultMessage);

  return (
    <div
      className="fixed z-50 group flex items-center gap-3"
      style={{
        bottom: "max(16px, env(safe-area-inset-bottom, 16px))",
        right: "max(16px, env(safe-area-inset-right, 16px))",
      }}
    >
      {/* Tooltip — Desktop apenas (hover e foco de teclado) */}
      <div
        id="wa-tooltip"
        role="tooltip"
        aria-hidden="true"
        className="hidden md:flex items-center bg-[#ffffff] text-[#050505] text-[0.74rem] font-bold tracking-wide px-3.5! py-2! rounded-lg border border-[#25D366]/50 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.45)] pointer-events-none opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0"
      >
        <span className="relative z-10">{t.whatsapp.tooltip}</span>
      </div>

      {/* Botão flutuante — círculo no telemóvel, pílula no desktop */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t.whatsapp.ariaLabel}
        aria-describedby="wa-tooltip"
        className="group/wa relative flex items-center justify-center gap-2.5 rounded-full text-[#ffffff]! w-14 h-14 md:w-auto md:h-11 md:px-4! bg-[#25D366] hover:bg-[#20BA5A] shadow-[0_10px_30px_-6px_rgba(37,211,102,0.5),0_4px_12px_-2px_rgba(0,0,0,0.35)] transition-[transform,background-color,box-shadow] duration-200 ease-out hover:scale-[1.06] active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/60"
      >
        {/* Pulso discreto — só 2 repetições ao carregar */}
        <span
          className="absolute inset-0 rounded-full bg-[#25D366]/70 pointer-events-none animate-ping motion-reduce:animate-none"
          style={{ animationIterationCount: 2 }}
          aria-hidden="true"
        />

        {/* Ícone Oficial WhatsApp (simple-icons, recorte da coma via evenodd) */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          fillRule="evenodd"
          clipRule="evenodd"
          className="relative w-7 h-7 md:w-6 md:h-6 shrink-0 transition-transform duration-200 group-hover/wa:scale-110"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>

        {/* Texto — Desktop */}
        <span className="relative hidden md:inline-block text-[0.72rem] font-extrabold uppercase tracking-wider select-none whitespace-nowrap">
          {t.whatsapp.buttonText}
        </span>
      </a>
    </div>
  );
};
