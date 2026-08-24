import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ImageGallery } from "../components/common/ImageGallery";
import { CTASection } from "../components/common/CTASection";
import { WorkItem } from "../components/portfolio/PortfolioGrid";
import { Reveal } from "../hooks/useReveal";
import { NotFound } from "./NotFound";
import { apiService } from "../services/api";
import { useTranslation } from "../i18n";
import type { PortfolioProject } from "../data/portfolio";

export const ProjectDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [related, setRelated] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      apiService.getProjectBySlug(slug).then((data) => {
        if (!isMounted) return;
        if (data) {
          setProject(data);
          document.title = `${data.title} | Click Creators Agency`;
          apiService.getPortfolioProjects().then((all) => {
            if (isMounted) setRelated(all.filter((p) => p.slug !== slug).slice(0, 3));
          });
        }
        setLoading(false);
      });
    }
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading && slug) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) return <NotFound />;

  return (
    <div className="flex flex-col">
      {/* Cinematic hero */}
      <section className="relative min-h-[85svh] flex flex-col justify-end overflow-hidden force-dark">
        <div className="absolute inset-0 z-0 media-frame !overflow-hidden">
          <img src={project.imagem} alt={project.title} className="kenburns" />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[var(--background)] via-[var(--background)]/50 to-[var(--background)]/40" />

        <div className="container relative z-10 pb-14 pt-44">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-[0.66rem] font-extrabold uppercase tracking-[0.2em] text-[var(--text-soft)] hover:text-[var(--primary)] mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>{t.portfolio.pageHeroEyebrow}</span>
          </Link>

          <p className="eyebrow eyebrow-bare mb-5">{project.categoria}</p>
          <h1 className="display-xl max-w-5xl">{project.title}</h1>
        </div>
      </section>

      {/* Meta bar */}
      <section className="hairline-b bg-[var(--surface)]">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-y-6 py-8 lg:py-10">
          {[
            { label: t.portfolio.details.client, value: project.cliente },
            { label: t.portfolio.details.category, value: project.categoria, accent: true },
            { label: t.portfolio.details.agency, value: "Click Creators" },
            { label: t.portfolio.details.year, value: "2025" },
          ].map((meta) => (
            <div key={meta.label} className="flex flex-col gap-1 pr-4 border-l border-[var(--border)] pl-4 first:border-l-0 first:pl-0">
              <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.24em] text-[var(--text-faint)]">
                {meta.label}
              </span>
              <span
                className={`font-display text-lg uppercase tracking-wide ${
                  meta.accent ? "text-[var(--primary)]" : "text-[var(--color-text)]"
                }`}
              >
                {meta.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Narrative */}
      <section className="section-y">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-6">{t.portfolio.details.aboutProject}</p>
              <p className="lede">{project.descricao}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-12 lg:pl-16">
            <Reveal delay={1}>
              <p className="index-num mb-3">{t.portfolio.details.objectiveStep}</p>
              <h2 className="display-sm mb-4">{t.portfolio.details.objectiveTitle}</h2>
              <p className="muted leading-relaxed max-w-2xl">{project.objetivo}</p>
            </Reveal>

            <Reveal delay={2}>
              <p className="index-num mb-3">{t.portfolio.details.executionStep}</p>
              <h2 className="display-sm mb-4">{t.portfolio.details.executionTitle}</h2>
              <p className="muted leading-relaxed max-w-2xl">{project.solucao}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {project.galeria && project.galeria.length > 0 && (
        <section className="pb-24">
          <div className="container">
            <Reveal>
              <p className="eyebrow mb-10">{t.portfolio.details.gallery}</p>
            </Reveal>
            <ImageGallery images={project.galeria} columns={3} aspectRatio="video" />
          </div>
        </section>
      )}

      {/* Results */}
      {project.resultados && project.resultados.length > 0 && (
        <section className="hairline-t hairline-b bg-[var(--surface)] section-y">
          <div className="container">
            <Reveal>
              <p className="eyebrow mb-10">{t.portfolio.details.results}</p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[var(--border)] border border-[var(--border)]">
              {project.resultados.map((res, idx) => (
                <Reveal
                  key={idx}
                  delay={(idx % 3) as 0 | 1 | 2}
                  className="bg-[var(--background)] p-8 lg:p-10 flex items-start gap-4 min-h-[140px]"
                >
                  <span className="font-display text-3xl text-[var(--primary)] leading-none">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-semibold leading-relaxed pt-1">{res}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related work */}
      {related.length > 0 && (
        <section className="section-y">
          <div className="container">
            <Reveal>
              <Link to="/portfolio" className="arrow-link mb-12 inline-flex">
                <span>{t.portfolio.details.moreWork}</span>
                <span className="arrow-line" aria-hidden="true" />
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) as 0 | 1 | 2}>
                  <WorkItem project={p} aspect="aspect-[4/3]" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection titleLines={t.portfolio.details.ctaTitleLines} />
    </div>
  );
};
