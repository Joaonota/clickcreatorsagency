import React from "react";
import { Link } from "react-router-dom";
import type { Partner } from "../../data/partners";
import { PartnerLogo } from "./PartnerLogo";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

/* Secção de Parceiros na Home — credibilidade e marcas que confiam */
export const TrustedBy: React.FC<{ partners: Partner[] }> = ({ partners }) => {
  const { t } = useTranslation();

  return (
    <section className="hairline-t hairline-b bg-[var(--background-secondary)] overflow-hidden">
      <div className="container pt-12 pb-14 lg:pt-16 lg:pb-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between mb-12">
          <Reveal>
            <p className="eyebrow">{t.partners.trustedByEyebrow}</p>
            <h2 className="display-md mt-5 max-w-xl">
              {t.partners.trustedByTitle}
              <span className="text-[var(--primary)]">.</span>
            </h2>
          </Reveal>
          <Reveal delay={2} className="shrink-0">
            <Link to="/partners" className="arrow-link">
              <span>{t.partners.viewAll}</span>
              <span className="arrow-line" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>

      {/* Marquee de logos dos parceiros */}
      <div className="partner-marquee-wrap hairline-t py-9 -mx-5 sm:-mx-10 xl:-mx-16 px-5 sm:px-10 xl:px-16">
        <div className="partner-marquee gap-24 pr-24" aria-hidden="false">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex gap-24 shrink-0 pr-24">
              {partners.map((p) => (
                <PartnerLogo key={`${dup}-${p.id}`} partner={{ ...p, website: undefined }} size="sm" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
