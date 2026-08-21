import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { contactConfig } from "../../config/contact";

export const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Olá Click Creators! Gostaria de saber mais sobre os vossos serviços."
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip on Desktop */}
      <div
        className={`hidden md:block bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold px-3.5 py-2 rounded-xl border border-emerald-500/30 shadow-xl transition-all duration-300 pointer-events-none ${
          showTooltip ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        }`}
      >
        Fale Connosco no WhatsApp
      </div>

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar no WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all duration-300 hover:scale-110 active:scale-95 group relative"
        style={{ animation: "pulseGlow 3s infinite" }}
      >
        <MessageCircle className="w-7 h-7 fill-slate-950 group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
        </span>
      </a>
    </div>
  );
};
