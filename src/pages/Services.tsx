import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
import { apiService } from "../services/api";
import type { Service } from "../data/services";

export const ServicesPage: React.FC = () => {
  const [servicesList, setServicesList] = useState<Service[]>([]);

  useEffect(() => {
    document.title = "What We Do | Click Creators Agency";
    apiService.getServices().then(setServicesList);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">What We Do</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">EVERYTHING</span>
            <span className="block text-outline">YOUR BRAND</span>
            <span className="block">
              NEEDS<span className="text-[var(--primary)]">.</span>
            </span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              Da estratégia à produção cinematográfica, da gestão de comunidades ao
              branding — quatro disciplinas, uma só equipa.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Services — alternating editorial rows */}
      <section className="pb-24 lg:pb-32 flex flex-col gap-24 lg:gap-36">
        {servicesList.map((service, index) => {
          const isEven = index % 2 === 0;
          return (
            <div key={service.id} id={service.slug} className="container scroll-mt-28">
              <div
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center ${
                  isEven ? "" : "lg:[direction:rtl]"
                }`}
              >
                {/* Media */}
                <Reveal className="reveal-clip lg:col-span-7 lg:[direction:ltr]">
                  <Link to={`/servicos/${service.slug}`} className="media-frame aspect-[16/10] group block">
                    <img src={service.image} alt={service.title} loading="lazy" />
                    <span className="absolute top-5 left-5 font-display text-2xl text-white bg-black/60 backdrop-blur px-3 py-1 leading-none">
                      {service.number}
                    </span>
                  </Link>
                </Reveal>

                {/* Content */}
                <div className={`lg:col-span-5 flex flex-col items-start lg:[direction:ltr] ${isEven ? "" : "lg:justify-self-end"}`}>
                  <Reveal>
                    <span className="index-num block mb-4">{service.number} /</span>
                    <h2 className="display-md mb-5">{service.title}</h2>
                    <p className="muted text-sm leading-relaxed mb-8 max-w-md">
                      {service.shortDescription}
                    </p>

                    <ul className="flex flex-col gap-2.5 mb-9 w-full">
                      {service.deliverables.slice(0, 4).map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-xs font-medium text-white/85 hairline-t py-2.5"
                        >
                          <span className="text-[var(--primary)] shrink-0">+</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to={`/servicos/${service.slug}`} className="arrow-link">
                      <span>Ver detalhes</span>
                      <ArrowUpRight size={16} strokeWidth={2} />
                    </Link>
                  </Reveal>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <CTASection />
    </div>
  );
};
