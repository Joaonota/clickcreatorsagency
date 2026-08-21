import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioProject } from "../../data/portfolio";

interface PortfolioCardProps {
  project: PortfolioProject;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({ project }) => {
  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className="group relative block overflow-hidden rounded-3xl border border-zinc-800 bg-slate-900 aspect-[4/3] sm:aspect-[16/10] transition-all duration-500 hover:border-lime-400/50 hover:shadow-2xl hover:shadow-lime-950/40"
    >
      {/* Background Image with Zoom Effect */}
      <img
        src={project.imagem}
        alt={project.title}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out filter brightness-90 group-hover:brightness-100"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

      {/* Top Badge */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-lime-400/30 text-xs font-extrabold text-lime-400">
          {project.categoria}
        </span>
      </div>

      {/* Card Body Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10 flex flex-col justify-end">
        <span className="text-xs font-bold uppercase tracking-wider text-lime-400 mb-1">
          {project.cliente}
        </span>

        <div className="flex items-end justify-between gap-4">
          <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-snug group-hover:text-lime-300 transition-colors">
            {project.title}
          </h3>

          <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-lime-400 group-hover:text-slate-950 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shrink-0 transition-all duration-300 group-hover:rotate-45 font-bold">
            <ArrowUpRight size={20} />
          </div>
        </div>
      </div>
    </Link>
  );
};
