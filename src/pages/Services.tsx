import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CTASection } from "../components/common/CTASection";
import { Button } from "../components/common/Button";
import { apiService } from "../services/api";
import type { Service } from "../data/services";

export const ServicesPage: React.FC = () => {
  const [servicesList, setServicesList] = useState<Service[]>([]);

  useEffect(() => {
    document.title = "Serviços | Click Creators Agency";
    apiService.getServices().then(setServicesList);
  }, []);

  return (
    <div className="flex flex-col gap-0">
      {/* PAGE HERO */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden border-b border-white/10">
        <div className="container relative z-10 text-center flex flex-col items-center">
          <span className="badge mb-4">Nossas Soluções</span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Soluções completas para <br />
            <span className="gradient-text">destacar a sua marca.</span>
          </h1>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
            Do planeamento estratégico à produção de conteúdo cinematográfico e gestão de comunidades digitais.
          </p>
        </div>
      </section>

      {/* SERVICES DETAILED SHOWCASE */}
      <section className="section-padding bg-slate-900/40">
        <div className="container flex flex-col gap-16 lg:gap-24">
          {servicesList.map((service, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={service.id}
                id={service.slug}
                className={`flex flex-col ${
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-10 lg:gap-16 items-center`}
              >
                {/* Media Image Box */}
                <div className="w-full lg:w-1/2 relative overflow-hidden rounded-3xl border border-white/10 aspect-video shadow-2xl group bg-slate-900">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-sm font-mono font-extrabold text-purple-400 border border-purple-500/30">
                      {service.number}
                    </span>
                  </div>
                </div>

                {/* Content Box */}
                <div className="w-full lg:w-1/2 flex flex-col items-start">
                  <span className="badge mb-3">{service.title}</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
                    {service.title}
                  </h2>
                  <p className="text-slate-300 text-base leading-relaxed mb-6">
                    {service.fullDescription}
                  </p>

                  {/* Deliverables checklist */}
                  <div className="w-full mb-8">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Entregáveis Principais:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {service.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                          <CheckCircle2 size={14} className="text-purple-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    to={`/servicos/${service.slug}`}
                    variant="primary"
                    size="md"
                    icon={<ArrowRight size={16} />}
                  >
                    Ver detalhes do serviço
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <CTASection />
    </div>
  );
};
