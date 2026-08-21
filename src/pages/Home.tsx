import React, { useState, useEffect } from "react";
import { HeroSection } from "../components/home/HeroSection";
import { Manifesto } from "../components/home/Manifesto";
import { ImpactNumbers } from "../components/home/ImpactNumbers";
import { ServiceList } from "../components/services/ServiceList";
import {
  PortfolioGrid,
  FilterBar,
} from "../components/portfolio/PortfolioGrid";
import { CreatorGrid } from "../components/creators/CreatorGrid";
import { PartnersShowcase } from "../components/partners/PartnersShowcase";
import { TeamGrid } from "../components/team/TeamGrid";
import { SocialFeed } from "../components/common/SocialFeed";
import { CTASection } from "../components/common/CTASection";
import { SectionHeader } from "../components/common/SectionHeader";
import { apiService } from "../services/api";
import type { Service } from "../data/services";
import type { PortfolioProject } from "../data/portfolio";
import type { Creator } from "../data/creators";
import type { Partner } from "../data/partners";
import type { TeamMember } from "../data/team";

export const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    document.title = "Click Creators Agency | Creative Agency — Social Media, Content & Audiovisual";
    const loadData = async () => {
      const [sData, pData, cData, paData, tData] = await Promise.all([
        apiService.getServices(),
        apiService.getFeaturedPortfolio(),
        apiService.getCreators(),
        apiService.getPartners(),
        apiService.getTeam(),
      ]);
      setServices(sData);
      setProjects(pData);
      setCreators(cData.slice(0, 6));
      setPartners(paData);
      setTeam(tData);
    };
    loadData();
  }, []);

  const counts = projects.reduce<Record<string, number>>((acc, p) => {
    acc[p.categoria] = (acc[p.categoria] ?? 0) + 1;
    return acc;
  }, {});
  counts["Todos"] = projects.length;

  const filteredProjects =
    activeCategory === "Todos"
      ? projects
      : projects.filter((p) => p.categoria === activeCategory);

  return (
    <div className="flex flex-col">
      {/* HERO */}
      <HeroSection />

      {/* MANIFESTO EDITORIAL */}
      <Manifesto />

      {/* IMPACT / NUMBERS */}
      <ImpactNumbers />

      {/* SERVICES */}
      <ServiceList services={services} />

      {/* SELECTED WORK */}
      <section className="section-y bg-[var(--surface)] hairline-t hairline-b">
        <div className="container">
          <SectionHeader
            index="(02)"
            eyebrow="Selected Work"
            titleLines={["SELECTED", "WORK"]}
            description="Projetos que provam o que dizemos. Vídeo, fotografia, social e branding para marcas que querem mais."
            linkTo="/portfolio"
            linkLabel="Todos os projetos"
          />
          <FilterBar active={activeCategory} onChange={setActiveCategory} counts={counts} />
          <PortfolioGrid projects={filteredProjects.slice(0, 6)} />
        </div>
      </section>

      {/* CREATORS */}
      <CreatorGrid creators={creators} />

      {/* PARTNERS */}
      <PartnersShowcase partners={partners} />

      {/* TEAM */}
      <TeamGrid members={team} />

      {/* SOCIAL MEDIA */}
      <SocialFeed />

      {/* CTA */}
      <CTASection />
    </div>
  );
};
