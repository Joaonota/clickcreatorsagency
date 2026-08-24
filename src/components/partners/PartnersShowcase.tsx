import React from "react";
import type { Partner } from "../../data/partners";
import { PartnerLogo } from "./PartnerLogo";
import { SectionHeader } from "../common/SectionHeader";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

/* Grelha premium de parceiros — desktop 4 / tablet 3 / mobile 2 */
export const PartnersShowcase: React.FC<{ partners: Partner[] }> = ({ partners }) => {
  const { t } = useTranslation();

  return (
    <section className="section-y">
      <div className="container">
        <SectionHeader
          index={t.partners.index}
          eyebrow={t.partners.eyebrow}
          titleLines={t.partners.titleLines}
          description={t.partners.description}
        />

        {/* Marquee — movimento horizontal contínuo */}
        <div className="partner-marquee-wrap overflow-hidden hairline-t py-10 -mx-5 sm:-mx-10 xl:-mx-16 px-5 sm:px-10 xl:px-16 mb-12">
          <div className="partner-marquee gap-24 pr-24" aria-hidden="true">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex gap-24 shrink-0 pr-24">
                {partners.map((p) => (
                  <PartnerLogo key={`${dup}-${p.id}`} partner={{ ...p, website: undefined }} />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Grid — estrutura minimalista com hairlines */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--border)] border border-[var(--border)]">
          {partners.map((p, i) => (
            <Reveal
              key={p.id}
              delay={(i % 4) as 0 | 1 | 2 | 3}
              className="bg-[var(--background)] p-8 lg:p-12 flex items-center justify-center min-h-[130px] lg:min-h-[160px]"
            >
              <PartnerLogo partner={p} />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="text-[0.6rem] font-bold uppercase tracking-[0.22em] muted mt-6 text-right">
            {t.partners.updatedNotice}
          </p>
        </Reveal>
      </div>
    </section>
  );
};
