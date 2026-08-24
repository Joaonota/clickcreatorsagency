import React, { useEffect, useMemo, useState } from "react";
import { PortfolioGrid, FilterBar } from "../components/portfolio/PortfolioGrid";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
import { apiService } from "../services/api";
import { useTranslation } from "../i18n";
import type { PortfolioProject } from "../data/portfolio";

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t.portfolio.pageTitle;
    apiService.getPortfolioProjects().then(setProjects);
  }, [t]);

  const counts = useMemo(
    () =>
      projects.reduce<Record<string, number>>((acc, p) => {
        acc[p.categoria] = (acc[p.categoria] ?? 0) + 1;
        return acc;
      }, {}),
    [projects]
  );
  const allCounts = { ...counts, Todos: projects.length };

  const filteredProjects =
    activeCategory === "Todos"
      ? projects
      : projects.filter((p) => p.categoria === activeCategory);

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

      {/* Grid + filters */}
      <section className="pb-24 lg:pb-32">
        <div className="container">
          <FilterBar active={activeCategory} onChange={setActiveCategory} counts={allCounts} />
          <PortfolioGrid projects={filteredProjects} />
        </div>
      </section>

      <CTASection />
    </div>
  );
};
