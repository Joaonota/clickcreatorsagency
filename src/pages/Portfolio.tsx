import React, { useEffect, useState } from "react";
import { PortfolioCard } from "../components/portfolio/PortfolioCard";
import { CTASection } from "../components/common/CTASection";
import { apiService } from "../services/api";
import type { PortfolioProject } from "../data/portfolio";

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    document.title = "Portfólio | Click Creators Agency";
    apiService.getPortfolioProjects().then(setProjects);
  }, []);

  const categories = ["Todos", "Vídeo", "Fotografia", "Social Media", "Branding", "Campanhas"];

  const filteredProjects =
    activeCategory === "Todos"
      ? projects
      : projects.filter((p) => p.categoria.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex flex-col gap-0">
      {/* PAGE HERO */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden border-b border-white/10">
        <div className="container relative z-10 text-center flex flex-col items-center">
          <span className="badge mb-4">Galeria de Trabalhos</span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Projetos que transformam <br />
            <span className="gradient-text">visões em resultados.</span>
          </h1>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
            Conheça o nosso portfólio de vídeos comerciais, fotografia editorial, campanhas de redes sociais e branding.
          </p>

          {/* Category Filters */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40 scale-105"
                    : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS MASONRY GRID */}
      <section className="section-padding bg-slate-900/40">
        <div className="container">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              Nenhum projeto encontrado nesta categoria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProjects.map((project) => (
                <PortfolioCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};
