import React, { useEffect, useState } from "react";
import { PartnersShowcase } from "../components/partners/PartnersShowcase";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
import { apiService } from "../services/api";
import type { Partner } from "../data/partners";

export const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);

  useEffect(() => {
    document.title = "Our Partners | Click Creators Agency";
    apiService.getPartners().then(setPartners);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">Our Partners</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">A NETWORK OF</span>
            <span className="block text-outline">BRANDS &amp;</span>
            <span className="block">
              ORGANIZATIONS<span className="text-[var(--primary)]">.</span>
            </span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              Marcas e organizações com quem tivemos a oportunidade de criar — campanhas,
              conteúdo, estratégia e experiências que aproximam marcas das pessoas.
            </p>
          </Reveal>

          {/* Narrativa Work / Partners / Creators */}
          <Reveal delay={3}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)] mt-16 max-w-4xl">
              {[
                { k: "Our Work", v: "O que fazemos." },
                { k: "Our Partners", v: "Para quem trabalhamos." },
                { k: "Our Creators", v: "Com quem criamos." },
              ].map((item) => (
                <div key={item.k} className="bg-[var(--background)] p-6 lg:p-8">
                  <p className="font-display text-xl uppercase tracking-wide text-[var(--primary)]">
                    {item.k}
                  </p>
                  <p className="text-xs muted mt-1.5">{item.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Grid de parceiros */}
      <PartnersShowcase partners={partners} />

      <CTASection titleLines={["YOUR BRAND", "COULD BE", "NEXT."]} />
    </div>
  );
};
