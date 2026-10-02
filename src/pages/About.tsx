import React, { useEffect, useState } from "react";
import { CTASection } from "../components/common/CTASection";
import { TeamGrid } from "../components/team/TeamGrid";
import { PartnersShowcase } from "../components/partners/PartnersShowcase";
import { MissionVision } from "../components/about/MissionVision";
import { AgencyIntro } from "../components/about/AgencyIntro";
import { HistoryTimeline } from "../components/about/HistoryTimeline";
import { Reveal } from "../hooks/useReveal";
import { apiService } from "../services/api";
import { useTranslation } from "../i18n";
import type { TeamMember } from "../data/team";
import type { Partner } from "../data/partners";

export const About: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t.about.pageTitle;
    Promise.all([apiService.getTeam(), apiService.getPartners()]).then(([tData, pData]) => {
      setTeam(tData);
      setPartners(pData);
    });
  }, [t]);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{t.about.pageHeroEyebrow}</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">{t.about.pageHeroLines[0]}</span>
            <span className="block text-outline">{t.about.pageHeroLines[1]}</span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              {t.about.pageHeroLede}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Story — editorial timeline */}
      <AgencyIntro />

      <HistoryTimeline />

      {/* Mission & Vision — editorial split */}
      <MissionVision />

      {/* Values */}
      <section className="section-y bg-[var(--surface)] hairline-t hairline-b">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{t.about.valuesEyebrow}</p>
            <h2 className="display-lg mb-14">{t.about.valuesTitle}</h2>
          </Reveal>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-0">
            {t.about.values.map((v, i) => (
              <Reveal as="li" key={v.num} delay={(i % 3) as 0 | 1 | 2} className="hairline-t py-7 flex flex-col gap-2.5">
                <span className="font-display text-lg text-[var(--primary)]">{v.num}</span>
                <h3 className="font-display text-2xl uppercase tracking-wide">{v.title}</h3>
                <p className="text-xs muted leading-relaxed max-w-xs">{v.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Team */}
      <TeamGrid members={team} />

      {/* Partners */}
      <PartnersShowcase partners={partners} />

      <CTASection />
    </div>
  );
};
