import React from "react";
import type { Partner } from "../../data/partners";
import { SectionHeader } from "../common/SectionHeader";
import { Reveal } from "../../hooks/useReveal";

const Wordmark: React.FC<{ partner: Partner }> = ({ partner }) => (
  <span className="partner-wordmark">
    {partner.logo ? (
      <img src={partner.logo} alt={partner.name} loading="lazy" />
    ) : (
      <>
        <span className="pw-name">{partner.name}</span>
        <span className="pw-cat">{partner.category}</span>
      </>
    )}
  </span>
);

export const PartnersShowcase: React.FC<{ partners: Partner[] }> = ({ partners }) => {
  return (
    <section className="section-y">
      <div className="container">
        <SectionHeader
          index="(03)"
          eyebrow="Our Partners"
          titleLines={["BRANDS WE", "WORK WITH"]}
          description="Trabalhamos com marcas que acreditam no poder da criatividade, do conteúdo e da comunicação relevante."
        />

        {/* Marquee — movimento horizontal discreto */}
        <div className="partner-marquee-wrap overflow-hidden hairline-t hairline-b py-8 -mx-5 sm:-mx-10 xl:-mx-16 px-5 sm:px-10 xl:px-16 mb-14 lg:mb-20">
          <div className="partner-marquee gap-20 pr-20" aria-hidden="false">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex gap-20 shrink-0 pr-20">
                {partners.map((p) => (
                  <Wordmark key={`${dup}-${p.id}`} partner={p} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Grid — estrutura pronta para logos reais */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)]">
          {partners.map((p, i) => (
            <Reveal
              key={p.id}
              delay={(i % 4) as 0 | 1 | 2 | 3}
              className="bg-[#0a0a0c] p-8 flex items-center justify-center min-h-[130px]"
            >
              <Wordmark partner={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
