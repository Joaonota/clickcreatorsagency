import React, { useEffect, useState } from "react";
import { CreatorCard } from "../components/creators/CreatorGrid";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
import { apiService } from "../services/api";
import { useTranslation } from "../i18n";
import type { Creator } from "../data/creators";

export const CreatorsPage: React.FC = () => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t.creators.pageTitle;
    apiService.getCreators().then(setCreators);
  }, [t]);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{t.creators.pageHeroEyebrow}</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">{t.creators.pageHeroLines[0]}</span>
            <span className="block text-outline">{t.creators.pageHeroLines[1]}</span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              {t.creators.pageHeroLede}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Editorial grid */}
      <section className="pb-24 lg:pb-32">
        <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {creators.map((creator, i) => (
            <Reveal key={creator.id} delay={(i % 3) as 0 | 1 | 2} className={i % 3 === 1 ? "lg:mt-14" : i % 3 === 2 ? "lg:mt-7" : ""}>
              <CreatorCard creator={creator} aspect="aspect-[3/4]" />
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection titleLines={t.creators.pageCtaLines} />
    </div>
  );
};
