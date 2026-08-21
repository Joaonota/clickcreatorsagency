import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "../../data/services";
import { SectionHeader } from "../common/SectionHeader";
import { Reveal } from "../../hooks/useReveal";

export const ServiceList: React.FC<{ services: Service[] }> = ({ services }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = previewRef.current;
    if (!el || window.innerWidth < 1024) return;
    el.style.transform = `translate(${e.clientX + 32}px, ${e.clientY - 120}px)`;
  };

  return (
    <section className="section-y" onMouseMove={handleMouseMove}>
      <div className="container">
        <SectionHeader
          index="(01)"
          eyebrow="What We Do"
          titleLines={["WHAT", "WE DO"]}
          description="Quatro disciplinas integradas. Uma só equipa. Da estratégia à produção, cuidamos de tudo o que faz a sua marca ser vista."
          linkTo="/servicos"
          linkLabel="Todos os serviços"
        />

        <div className="svc-list">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={(i % 3) as 0 | 1 | 2}>
              <Link
                to={`/servicos/${service.slug}`}
                className="svc-row group"
                onMouseEnter={() => setActiveImage(service.image)}
                onMouseLeave={() => setActiveImage(null)}
                onFocus={() => setActiveImage(service.image)}
                onBlur={() => setActiveImage(null)}
              >
                <span className="svc-num">{service.number}</span>
                <span>
                  <span className="svc-title block">{service.title}</span>
                  <span className="svc-desc block text-sm muted leading-relaxed">
                    {service.shortDescription}
                  </span>
                </span>
                <ArrowUpRight size={34} strokeWidth={1.5} className="svc-arrow" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Floating image preview (desktop) */}
      <div
        ref={previewRef}
        className={`svc-preview ${activeImage ? "visible" : ""}`}
        style={{ transform: "translate(-500px, -500px)" }}
        aria-hidden="true"
      >
        {activeImage && <img src={activeImage} alt="" />}
      </div>
    </section>
  );
};
