import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { CTASection } from "../components/common/CTASection";
import { Button } from "../components/common/Button";
import { NotFound } from "./NotFound.tsx";
import { apiService } from "../services/api";
import type { Service } from "../data/services";
import type { PortfolioProject } from "../data/portfolio";
import { PortfolioCard } from "../components/portfolio/PortfolioCard";

export const ServiceDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      apiService.getServiceBySlug(slug).then((data) => {
        if (!isMounted) return;
        if (data) {
          setService(data);
          document.title = `${data.title} | Click Creators Agency`;
          apiService.getPortfolioProjects().then((projects) => {
            if (isMounted) setRelatedProjects(projects.slice(0, 2));
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

  if (!service) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col gap-0">
      {/* SERVICE DETAILS HERO */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden border-b border-zinc-800">
        <div className="container relative z-10">
          <Link
            to="/servicos"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-lime-400 mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Voltar aos Serviços</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="badge mb-4">Serviço {service.number}</span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                {service.title}
              </h1>
              <p className="text-lg text-zinc-300 leading-relaxed mb-8">
                {service.fullDescription}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  href={`https://wa.me/351912345678?text=${encodeURIComponent(
                    `Olá! Gostaria de orçamentar o serviço de ${service.title}.`
                  )}`}
                  variant="whatsapp"
                  size="lg"
                >
                  Solicitar Orçamento
                </Button>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-zinc-800 aspect-video shadow-2xl">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS & DELIVERABLES */}
      <section className="section-padding bg-slate-900/40">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Deliverables */}
            <div className="glass-card p-8 md:p-12 rounded-3xl border border-zinc-800">
              <h3 className="text-2xl font-bold text-white mb-6">O que está incluído:</h3>
              <div className="flex flex-col gap-4">
                {service.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-zinc-200">
                    <CheckCircle2 size={18} className="text-lime-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="glass-card p-8 md:p-12 rounded-3xl border border-lime-400/20 bg-lime-950/10">
              <h3 className="text-2xl font-bold text-white mb-6">Benefícios Reais:</h3>
              <div className="flex flex-col gap-4">
                {service.benefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-zinc-200">
                    <CheckCircle2 size={18} className="text-lime-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="mt-16 pt-16 border-t border-zinc-800">
            <h3 className="text-2xl md:text-4xl font-extrabold text-white text-center mb-12">
              Como Trabalhamos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.process.map((step, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col gap-3 border border-zinc-800 hover:border-lime-400/50 transition-colors">
                  <span className="text-3xl font-mono font-extrabold text-lime-400">
                    {step.step}
                  </span>
                  <h4 className="text-lg font-bold text-white">{step.title}</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED PROJECTS */}
      {relatedProjects.length > 0 && (
        <section className="section-padding bg-slate-950 border-t border-zinc-800">
          <div className="container">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-8">
              Trabalhos Relacionados
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((p) => (
                <PortfolioCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </div>
  );
};
