import React from "react";
import { Reveal } from "../../hooks/useReveal";

export const Manifesto: React.FC = () => {
  return (
    <section className="section-y relative overflow-hidden">
      <div className="container grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sticky vertical label */}
        <div className="hidden lg:block lg:col-span-1">
          <span className="vertical-label">Manifesto</span>
        </div>

        <div className="lg:col-span-7">
          <h2 className="display-xl leading-[0.9]">
            <span className="block">WE ARE</span>
            <span className="block text-outline">CLICK</span>
            <span className="block">
              CREATORS<span className="text-[var(--primary)]">.</span>
            </span>
          </h2>
        </div>

        <div className="lg:col-span-4 flex flex-col justify-end gap-8">
          <Reveal>
            <p className="lede">
              Uma agência criativa que transforma ideias em conteúdo, experiências e
              estratégias capazes de aproximar marcas das pessoas.
            </p>
          </Reveal>
          <Reveal delay={2}>
            <p className="text-sm muted leading-relaxed">
              Trabalhamos na interseção da cultura digital, do conteúdo audiovisual e da
              estratégia de marca. Do primeiro briefing ao último frame — tudo pensado para
              ser visto, partilhado e lembrado.
            </p>
          </Reveal>
          <Reveal delay={3}>
            <div className="flex items-center gap-4 pt-2">
              <span className="font-display text-5xl text-[var(--primary)]">↳</span>
              <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-white/70">
                Marcas + Creators + Conteúdo
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
