import React from "react";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "../common/Button";

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center overflow-hidden py-16 lg:py-24">
      {/* Background Media Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/img/Default_img.jpeg"
          alt="Click Creators Studio Background"
          className="w-full h-full object-cover scale-105 filter brightness-[0.35] contrast-125 opacity-75"
          onError={(e) => {
            // Fallback if local image has issue
            e.currentTarget.src = "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=2000&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lime-950/30 via-transparent to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="container relative z-10 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-lime-500/10 backdrop-blur-md border border-lime-400/30 text-lime-400 text-xs font-extrabold uppercase tracking-wider mb-8 animate-fade-in">
          <Sparkles size={14} className="text-lime-400 animate-pulse" />
          <span>Agência Criativa & Audiovisual</span>
        </div>

        {/* Big Creative Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase max-w-5xl leading-[1.05] mb-8">
          WE CREATE <br />
          <span className="gradient-text">WHAT PEOPLE</span> <br />
          REMEMBER.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed mb-10 text-balance">
          Estratégia, criatividade e conteúdo audiovisual para marcas que querem ser vistas, lembradas e relevantes no mundo digital.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Button
            to="/servicos"
            variant="primary"
            size="lg"
            icon={<ArrowRight size={18} />}
          >
            Conheça os nossos serviços
          </Button>

          <Button
            to="/portfolio"
            variant="glass"
            size="lg"
            icon={<Play size={16} className="fill-white" />}
          >
            Ver portfólio
          </Button>
        </div>

        {/* Stats Grid Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mt-16 pt-10 border-t border-zinc-800 max-w-4xl w-full text-center">
          <div>
            <span className="block text-2xl sm:text-4xl font-extrabold text-lime-400">
              150+
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 font-medium">Projetos Produzidos</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-4xl font-extrabold text-lime-400">
              15M+
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 font-medium">Visualizações Geradas</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-4xl font-extrabold text-lime-400">
              98%
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 font-medium">Satisfação dos Clientes</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-4xl font-extrabold text-lime-400">
              25+
            </span>
            <span className="text-xs sm:text-sm text-zinc-400 font-medium">Creators Associados</span>
          </div>
        </div>
      </div>
    </section>
  );
};
