import React from "react";
import type { Partner } from "../../data/partners";
import { PartnerLogo } from "./PartnerLogo";
import { SectionHeader } from "../common/SectionHeader";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

/* Grelha premium de parceiros — desktop 3 / tablet 3 / mobile 2.
   Última linha sempre completa: com 5 parceiros → 3 + 2 largos (desktop),
   2 + 2 + 1 em largura total (mobile). Sem células vazias. */
const cellSpan = (i: number, total: number): string => {
  const classes: string[] = [];
  if (total % 2 === 1 && i === total - 1) classes.push("col-span-2");
  if (total % 3 === 2 && i >= total - 2) classes.push("md:col-span-3");
  if (total % 3 === 1 && i === total - 1) classes.push("md:col-span-6");
  return classes.join(" ");
};

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
                  <PartnerLogo key={`${dup}-${p.id}`} partner={{ ...p, website: undefined }} size="sm" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Grid — estrutura editorial minimalista com hairlines discretas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-px bg-[var(--border)] border border-[var(--border)]">
          {partners.map((p, i) => (
            <Reveal
              key={p.id}
              delay={(i % 3) as 0 | 1 | 2}
              className={`bg-[var(--background)] ${cellSpan(i, partners.length)} px-4 py-8 sm:px-6 lg:px-10 lg:py-10 flex items-center justify-center min-h-[130px] lg:min-h-[210px]`}
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
