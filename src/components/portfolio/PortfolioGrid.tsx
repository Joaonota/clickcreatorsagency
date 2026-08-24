import React from "react";
import { Link } from "react-router-dom";
import type { PortfolioProject } from "../../data/portfolio";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

interface FilterBarProps {
  active: string;
  onChange: (cat: string) => void;
  counts: Record<string, number>;
}

export const FilterBar: React.FC<FilterBarProps> = ({ active, onChange, counts }) => {
  const { t } = useTranslation();

  const categoryKeys = [
    { key: "all", label: t.portfolio.categories.all, dataMatch: "Todos" },
    { key: "video", label: t.portfolio.categories.video, dataMatch: "Vídeo" },
    { key: "photo", label: t.portfolio.categories.photo, dataMatch: "Fotografia" },
    { key: "social", label: t.portfolio.categories.social, dataMatch: "Social Media" },
    { key: "branding", label: t.portfolio.categories.branding, dataMatch: "Branding" },
    { key: "campaigns", label: t.portfolio.categories.campaigns, dataMatch: "Campanhas" },
  ];

  return (
    <div className="filter-bar mb-12 lg:mb-16 overflow-x-auto" role="tablist" aria-label="Filtrar projetos">
      {categoryKeys.map((cat) => (
        <button
          key={cat.key}
          role="tab"
          aria-selected={active === cat.dataMatch}
          className={`filter-btn whitespace-nowrap ${active === cat.dataMatch ? "active" : ""}`}
          onClick={() => onChange(cat.dataMatch)}
        >
          {cat.label}
          <sup>{counts[cat.dataMatch] ?? 0}</sup>
        </button>
      ))}
    </div>
  );
};

export const WorkItem: React.FC<{
  project: PortfolioProject;
  aspect?: string;
}> = ({ project, aspect = "aspect-[4/3]" }) => {
  const { t } = useTranslation();

  return (
    <Link to={`/portfolio/${project.slug}`} className="work-item group">
      <div className={`media-frame ${aspect}`}>
        <img src={project.imagem} alt={project.title} loading="lazy" />
        <span className="absolute top-4 left-4 z-10 flex items-center gap-2 text-[0.58rem] font-extrabold uppercase tracking-[0.22em]">
          <span className="text-white/50">01 /</span>
          <span className="text-[var(--primary)] bg-black/60 backdrop-blur px-2.5 py-1">
            {project.categoria}
          </span>
        </span>
      </div>
      <div className="work-meta">
        <div className="flex flex-col gap-1">
          <h3 className="work-title">{project.title}</h3>
          <span className="work-client">{project.cliente}</span>
        </div>
        <span className="work-tag">{t.portfolio.viewCase} ↗</span>
      </div>
    </Link>
  );
};

export const PortfolioGrid: React.FC<{ projects: PortfolioProject[] }> = ({ projects }) => {
  const { t } = useTranslation();

  if (projects.length === 0) {
    return (
      <p className="py-20 text-center text-sm muted uppercase tracking-[0.2em]">
        {t.portfolio.empty}
      </p>
    );
  }

  /* Editorial rhythm: full-width feature → offset pair → alternating sizes */
  const [first, ...rest] = projects;

  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      {first && (
        <Reveal className="reveal-clip">
          <WorkItem project={first} aspect="aspect-video lg:aspect-[21/9]" />
        </Reveal>
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
          {rest.slice(0, 2).map((p, i) => (
            <Reveal key={p.id} delay={(i + 1) as 1 | 2} className={i === 1 ? "md:mt-16" : ""}>
              <WorkItem project={p} aspect="aspect-[4/5]" />
            </Reveal>
          ))}
        </div>
      )}

      {rest.length > 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {rest.slice(2).map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) as 0 | 1 | 2}>
              <WorkItem project={p} aspect={i % 2 === 0 ? "aspect-square" : "aspect-[4/5]"} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
};
