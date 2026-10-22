import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { PortfolioProject } from "../../data/portfolio";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

export const WorkItem: React.FC<{
  project: PortfolioProject;
  aspect?: string;
}> = ({ project, aspect = "aspect-[4/3]" }) => {
  const { t } = useTranslation();

  /* Projetos com vídeo → player inline (padrão "Campanhas"): play com som,
     controlos completos, sem navegação para outra página */
  if (project.video) {
    return <VideoWorkCard project={project} />;
  }

  return (
    <Link
      to={`/portfolio/${project.slug}`}
      className="work-item group"
    >
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

/** Proporção detetada após carregar os metadados do vídeo */
export type AspectKind = "landscape" | "portrait" | "square" | "unknown";

export function detectKind(w: number, h: number): AspectKind {
  if (w === 0 || h === 0) return "unknown";
  const ratio = w / h;
  if (ratio > 1.2) return "landscape";
  if (ratio < 0.85) return "portrait";
  return "square";
}

const ratioLabelText = (kind: AspectKind): string =>
  kind === "landscape"
    ? "Horiz."
    : kind === "portrait"
    ? "Vert."
    : kind === "square"
    ? "1:1"
    : "—";

const VideoWorkCard: React.FC<{ project: PortfolioProject }> = ({ project }) => {
  const [kind, setKind] = useState<AspectKind>("unknown");
  const [aspectRatio, setAspectRatio] = useState<string | undefined>(undefined);

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const w = e.currentTarget.videoWidth;
    const h = e.currentTarget.videoHeight;
    setKind(detectKind(w, h));
    if (w && h) setAspectRatio(`${w} / ${h}`);
  };

  /*
   * Container adaptado à proporção real do vídeo (mesma estratégia
   * da secção Campanhas): landscape/square ocupam a largura total e
   * portrait fica centrado com altura máxima limitada.
   */
  const containerStyle: React.CSSProperties = (() => {
    if (aspectRatio) {
      if (kind === "portrait") {
        return {
          aspectRatio,
          maxHeight: "72vh",
          width: "auto",
          maxWidth: "100%",
          margin: "0 auto",
        };
      }
      return {
        aspectRatio,
        width: "100%",
        maxHeight: "70vh",
      };
    }
    return {
      minHeight: "10rem",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
  })();

  return (
    <article className="work-item">
      <div
        className="relative overflow-hidden bg-black flex items-center justify-center"
        style={containerStyle}
      >
        <video
          src={project.video}
          className="block w-full h-full object-contain bg-black"
          controls
          preload="auto"
          playsInline
          aria-label={project.title}
          onLoadedMetadata={handleMetadata}
        />
        <span className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-2 text-[0.58rem] font-extrabold uppercase tracking-[0.22em]">
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
        <span className="work-tag">{ratioLabelText(kind)}</span>
      </div>
    </article>
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

  /* Editorial rhythm: par deslocado + grelha alternada — sem bloco gigante vazio */
  const featured = projects.slice(0, 2);
  const remaining = projects.slice(2);

  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      {featured.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 items-start">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) as 0 | 1 | 2} className={i === 1 ? "md:mt-16" : ""}>
              <WorkItem project={p} aspect="aspect-[4/3]" />
            </Reveal>
          ))}
        </div>
      )}

      {remaining.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {remaining.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) as 0 | 1 | 2}>
              <WorkItem project={p} aspect={i % 2 === 0 ? "aspect-square" : "aspect-[4/5]"} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
};
