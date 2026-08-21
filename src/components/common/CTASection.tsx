import React from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "./Button";
import { contactConfig } from "../../config/contact";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  title = "Vamos criar algo incrível?",
  subtitle = "Transformamos ideias em estratégias e conteúdos audiovisuais de alto impacto que impulsionam a sua marca.",
  className = "",
}) => {
  const whatsappUrl = `https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Olá Click Creators! Quero iniciar um projeto com a vossa agência."
  )}`;

  return (
    <section className={`py-16 md:py-24 relative overflow-hidden ${className}`}>
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-lime-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="glass-card p-8 md:p-16 rounded-3xl border border-lime-400/30 bg-gradient-to-br from-slate-950 via-zinc-900 to-slate-950 text-center flex flex-col items-center shadow-2xl">
          <span className="badge mb-6">Pronto para começar?</span>
          
          <h2 className="text-3xl md:text-6xl font-extrabold text-white mb-6 tracking-tight max-w-3xl leading-tight">
            {title}
          </h2>

          <p className="text-base md:text-xl text-zinc-300 max-w-2xl mb-10 leading-relaxed font-normal">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Button
              href={whatsappUrl}
              variant="whatsapp"
              size="lg"
              icon={<MessageCircle className="w-5 h-5 fill-slate-950" />}
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Falar no WhatsApp
            </Button>

            <Button
              to="/contactos"
              variant="outline"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Ver Contactos
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
