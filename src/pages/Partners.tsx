import React, { useEffect, useState } from "react";
import { PartnersShowcase } from "../components/partners/PartnersShowcase";
import { PillarNarrative } from "../components/partners/PillarNarrative";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
import { apiService } from "../services/api";
import { useTranslation } from "../i18n";
import type { Partner } from "../data/partners";

export const PartnersPage: React.FC = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t.partners.pageTitle;
    apiService.getPartners().then(setPartners);
  }, [t]);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{t.partners.pageHeroEyebrow}</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">{t.partners.pageHeroLines[0]}</span>
            <span className="block text-outline">{t.partners.pageHeroLines[1]}</span>
            <span className="block">
              {t.partners.pageHeroLines[2].replace(".", "")}
              <span className="text-[var(--primary)]">.</span>
            </span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              {t.partners.pageHeroLede}
            </p>
          </Reveal>

          {/* Narrativa Work / Partners / Creators */}
          <PillarNarrative />
        </div>
      </section>

      {/* Grid de parceiros */}
      <PartnersShowcase partners={partners} />

      <CTASection titleLines={t.partners.ctaTitleLines} />
    </div>
  );
};
