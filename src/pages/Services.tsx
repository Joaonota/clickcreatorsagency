import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
import { apiService } from "../services/api";
import { useTranslation } from "../i18n";
import type { Service } from "../data/services";

const TITLE_LINES: Record<string, string[]> = {
  "Marketing Digital": ["Marketing", "Digital"],
  "Produção Audiovisual": ["Produção", "Audiovisual"],
  "Gestão de Redes Sociais": ["Gestão de", "Redes Sociais"],
  "Branding & Identidade Visual": ["Branding &", "Identidade Visual"],
};

export const ServicesPage: React.FC = () => {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t.services.pageTitle;
    apiService.getServices().then(setServicesList);
  }, [t]);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{t.services.pageHeroEyebrow}</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">{t.services.pageHeroLines[0]}</span>
            <span className="block text-outline">{t.services.pageHeroLines[1]}</span>
            <span className="block">
              {t.services.pageHeroLines[2].replace(".", "")}
              <span className="text-[var(--primary)]">.</span>
            </span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              {t.services.pageHeroLede}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services — alternating editorial features */}
      <section aria-label={t.services.eyebrow}>
        {servicesList.map((service, index) => {
          const isEven = index % 2 === 0;
          const lines = TITLE_LINES[service.title] ?? [service.title];
          return (
            <article
              key={service.id}
              id={service.slug}
              className="svc-feature container scroll-mt-28 py-16 lg:py-24"
            >
              <div className="svc-feature-grid">
                {/* Number + Title */}
                <div className="svc-head lg:col-span-5">
                  <Reveal>
                    <span className="svc-num-xl">{service.number} /</span>
                  </Reveal>
                  <Reveal delay={1}>
                    <h2 className="display-md svc-title-xl mt-4">
                      {lines.map((line, i) => (
                        <span key={i} className="block">
                          {line}
                        </span>
                      ))}
                    </h2>
                  </Reveal>
                </div>

                {/* Media */}
                <Reveal
                  delay={2}
                  className={`reveal-clip svc-media-wrap ${
                    isEven ? "lg:col-span-7" : "lg:col-span-7 lg:order-first"
                  }`}
                >
                  <figure className="svc-media media-frame aspect-[4/3] rounded-sm">
                    <img
                      src={service.image}
                      alt={`${service.title} — Click Creators`}
                      loading="lazy"
                      width={1200}
                      height={900}
                    />
                  </figure>
                </Reveal>

                {/* Description + Deliverables + CTA */}
                <div className={`svc-body ${isEven ? "lg:col-span-5 lg:col-start-1" : "lg:col-span-5 lg:col-start-8"}`}>
                  <Reveal>
                    <p className="muted text-sm md:text-base leading-relaxed max-w-[600px]">
                      {service.shortDescription}
                    </p>
                  </Reveal>

                  <Reveal delay={1}>
                    <ul className="svc-lines mt-8 mb-10">
                      {service.deliverables.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="svc-line">
                          <span className="svc-plus" aria-hidden="true">
                            +
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>

                  <Reveal delay={2}>
                    <Link to={`/servicos/${service.slug}`} className="arrow-link svc-cta">
                      <span>{t.common.viewDetails}</span>
                      <span className="arrow-line" aria-hidden="true" />
                      <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
                    </Link>
                  </Reveal>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <CTASection />
    </div>
  );
};
