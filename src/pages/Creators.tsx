import React, { useEffect, useState } from "react";
import { CreatorCard } from "../components/creators/CreatorCard";
import { CTASection } from "../components/common/CTASection";
import { apiService } from "../services/api";
import type { Creator } from "../data/creators";

export const CreatorsPage: React.FC = () => {
  const [creatorsList, setCreatorsList] = useState<Creator[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    document.title = "Creators | Click Creators Agency";
    apiService.getCreators().then(setCreatorsList);
  }, []);

  const categories = [
    "Todos",
    "Lifestyle",
    "Fashion",
    "Beauty",
    "Fitness",
    "Travel",
    "Food",
  ];

  const filteredCreators =
    activeCategory === "Todos"
      ? creatorsList
      : creatorsList.filter((c) => c.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex flex-col gap-0">
      {/* PAGE HERO */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden border-b border-white/10">
        <div className="container relative z-10 text-center flex flex-col items-center">
          <span className="badge mb-4">Casting & Influencers</span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Creators que dão <br />
            <span className="gradient-text">vida às ideias.</span>
          </h1>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
            Conheça os criadores associados à Click Creators e descubra diferentes vozes, estilos e comunidades para a sua marca.
          </p>

          {/* Category Filter */}
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

      {/* CREATORS GRID */}
      <section className="section-padding bg-slate-900/40">
        <div className="container">
          {filteredCreators.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              Nenhum creator encontrado nesta categoria.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection
        title="É um criador de conteúdo?"
        subtitle="Junte-se à Click Creators e colabore com marcas de topo em campanhas desafiadoras."
      />
    </div>
  );
};
