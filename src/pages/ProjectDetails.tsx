import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Video, Images } from "lucide-react";
import { ImageGallery } from "../components/common/ImageGallery";
import { CTASection } from "../components/common/CTASection";
import { PortfolioCard } from "../components/portfolio/PortfolioCard";
import { NotFound } from "./NotFound.tsx";
import { apiService } from "../services/api";
import type { PortfolioProject } from "../data/portfolio";

export const ProjectDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<PortfolioProject | null>(null);
  const [related, setRelated] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      apiService.getProjectBySlug(slug).then((data) => {
        if (!isMounted) return;
        if (data) {
          setProject(data);
          document.title = `${data.title} | Click Creators Agency`;
          apiService.getPortfolioProjects().then((all) => {
            if (isMounted) setRelated(all.filter((p) => p.slug !== slug).slice(0, 2));
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
        <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col gap-0">
      {/* HERO SECTION */}
      <section className="relative py-16 lg:py-24 bg-slate-950 border-b border-zinc-800">
        <div className="container">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-lime-400 mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Voltar ao Portfólio</span>
          </Link>

          <div className="flex flex-col gap-4 mb-8">
            <span className="badge w-fit">{project.categoria}</span>
            <h1 className="text-3xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {project.title}
            </h1>
            <p className="text-base md:text-xl text-zinc-300 max-w-3xl leading-relaxed">
              {project.descricao}
            </p>
          </div>

          {/* PROJECT META BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl glass-card border border-zinc-800 mb-10">
            <div>
              <span className="block text-xs font-semibold text-zinc-400 uppercase">Cliente</span>
              <span className="text-sm font-bold text-white">{project.cliente}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-zinc-400 uppercase">Categoria</span>
              <span className="text-sm font-bold text-lime-400">{project.categoria}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-zinc-400 uppercase">Ano</span>
              <span className="text-sm font-bold text-white">2025</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-zinc-400 uppercase">Agência</span>
              <span className="text-sm font-bold text-white">Click Creators</span>
            </div>
          </div>

          {/* MAIN HERO IMAGE */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 aspect-video shadow-2xl bg-slate-900">
            <img src={project.imagem} alt={project.title} className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* STRATEGY & RESULTS */}
      <section className="section-padding bg-slate-900/40">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="glass-card p-8 md:p-12 rounded-3xl border border-zinc-800 flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-white">O Desafio & Objetivo</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{project.objetivo}</p>
            </div>

            <div className="glass-card p-8 md:p-12 rounded-3xl border border-zinc-800 flex flex-col gap-4">
              <h3 className="text-2xl font-bold text-white">A Solução Criativa</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{project.solucao}</p>
            </div>
          </div>

          {/* RESULTS */}
          {project.resultados && project.resultados.length > 0 && (
            <div className="glass-card p-8 md:p-12 rounded-3xl border border-lime-400/20 bg-lime-950/10 mb-16">
              <h3 className="text-2xl font-bold text-white mb-6">Resultados Alcançados</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {project.resultados.map((res, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-zinc-200">
                    <CheckCircle2 size={20} className="text-lime-400 shrink-0 mt-0.5" />
                    <span className="font-semibold">{res}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIDEO PLAYER (IF VIDEO EXISTS) */}
          {project.videos && project.videos.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Video className="text-lime-400" />
                <span>Vídeo do Projeto</span>
              </h3>
              <div className="overflow-hidden rounded-3xl border border-zinc-800 aspect-video bg-black shadow-2xl">
                <video src={project.videos[0]} controls className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* IMAGE GALLERY */}
          {project.galeria && project.galeria.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Images className="text-lime-400" />
                <span>Galeria de Imagens</span>
              </h3>
              <ImageGallery images={project.galeria} columns={3} aspectRatio="video" />
            </div>
          )}
        </div>
      </section>

      {/* RELATED PROJECTS */}
      {related.length > 0 && (
        <section className="section-padding bg-slate-950 border-t border-zinc-800">
          <div className="container">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
              Outros Projetos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((p) => (
                <PortfolioCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection title="Gostou deste trabalho?" subtitle="Vamos transformar a sua ideia numa história de sucesso." />
    </div>
  );
};
