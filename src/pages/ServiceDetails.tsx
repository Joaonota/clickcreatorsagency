import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CTASection } from "../components/common/CTASection";
import { WorkItem } from "../components/portfolio/PortfolioGrid";
import { Reveal } from "../hooks/useReveal";
import { NotFound } from "./NotFound";
import { apiService } from "../services/api";
import { useTranslation } from "../i18n";
import type { Service } from "../data/services";
import type { PortfolioProject } from "../data/portfolio";

export const ServiceDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      apiService.getServiceBySlug(slug).then((data) => {
        if (!isMounted) return;
        if (data) {
          setService(data);
          document.title = `${data.title} | Click Creators Agency`;
          apiService.getPortfolioProjects().then((projects) => {
            if (isMounted) setRelatedProjects(projects.slice(0, 3));
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

  if (!service) return <NotFound />;

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[75svh] flex flex-col justify-end overflow-hidden force-dark">
        <div className="absolute inset-0 z-0 media-frame">
          <img src={service.image} alt={service.title} className="kenburns" />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[var(--background)] via-[var(--background)]/55 to-[var(--background)]/40" />

        <div className="container relative z-10 pb-14 pt-44">
          <Link
            to="/servicos"
            className="inline-flex items-center gap-2 text-[0.66rem] font-extrabold uppercase tracking-[0.2em] text-[var(--text-soft)] hover:text-[var(--primary)] mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>{t.services.pageHeroEyebrow}</span>
          </Link>

          <p className="eyebrow eyebrow-bare mb-5">
            {t.services.serviceNumber} {service.number}
          </p>
          <h1 className="display-xl max-w-5xl">{service.title}</h1>
        </div>
      </section>

      {/* Description */}
      <section className="section-y hairline-b">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-6">{t.services.overviewEyebrow}</p>
              <h2 className="display-sm text-outline">{t.services.overviewTitle1}</h2>
              <h2 className="display-sm mb-6">{t.services.overviewTitle2}</h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:pl-16">
            <Reveal delay={1}>
              <p className="lede">{service.fullDescription}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Deliverables & Benefits */}
      <section className="section-y">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)]">
          <Reveal className="bg-[var(--background)] p-8 lg:p-14">
            <p className="index-num mb-6">{t.services.deliverablesTitle}</p>
            <ul className="flex flex-col">
              {service.deliverables.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 hairline-t py-4 text-sm font-medium text-[var(--color-text-secondary)]">
                  <span className="text-[var(--primary)] shrink-0 font-display text-lg leading-none pt-0.5">
                    +
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={1} className="bg-[var(--background)] p-8 lg:p-14">
            <p className="index-num mb-6">{t.services.benefitsTitle}</p>
            <ul className="flex flex-col">
              {service.benefits.map((item, idx) => (
                <li key={idx} className="flex items-start gap-4 hairline-t py-4 text-sm font-medium text-[var(--color-text-secondary)]">
                  <span className="text-[var(--primary)] shrink-0 font-display text-lg leading-none pt-0.5">
                    ↳
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Process */}
      <section className="section-y bg-[var(--surface)] hairline-t hairline-b">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{t.services.processEyebrow}</p>
            <h2 className="display-lg mb-14">{t.services.processTitle}</h2>
          </Reveal>

          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {service.process.map((step, idx) => (
              <Reveal as="li" key={idx} delay={(idx % 4) as 0 | 1 | 2 | 3} className="hairline-t pt-6 flex flex-col gap-3">
                <span className="font-display text-4xl text-outline-lime leading-none">{step.step}</span>
                <h3 className="text-base font-extrabold uppercase tracking-wide">{step.title}</h3>
                <p className="text-xs muted leading-relaxed">{step.desc}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="section-y">
          <div className="container">
            <Reveal>
              <p className="eyebrow mb-12">{t.services.relatedTitle}</p>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
              {relatedProjects.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) as 0 | 1 | 2}>
                  <WorkItem project={p} aspect="aspect-[4/3]" />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection titleLines={t.services.ctaTitleLines} />
    </div>
  );
};
