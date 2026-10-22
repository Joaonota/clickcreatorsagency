import React, { useEffect } from "react";
import { CampaignsSection } from "../components/portfolio/CampaignsSection";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
import { useTranslation } from "../i18n";

export const PortfolioPage: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t.portfolio.pageTitle;
  }, [t]);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{t.portfolio.pageHeroEyebrow}</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">{t.portfolio.pageHeroLines[0]}</span>
            <span className="block text-outline">{t.portfolio.pageHeroLines[1]}</span>
            <span className="block">
              {t.portfolio.pageHeroLines[2].replace(".", "")}
              <span className="text-[var(--primary)]">.</span>
            </span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              {t.portfolio.pageHeroLede}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Campanhas em vídeo — ficheiros reais de public/Videos */}
      <CampaignsSection />

      <CTASection />
    </div>
  );
};
