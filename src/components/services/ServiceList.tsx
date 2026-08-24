import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "../../data/services";
import { SectionHeader } from "../common/SectionHeader";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

export const ServiceList: React.FC<{ services: Service[] }> = ({ services }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = previewRef.current;
    if (!el || window.innerWidth < 1024) return;
    el.style.transform = `translate(${e.clientX + 32}px, ${e.clientY - 120}px)`;
  };

  return (
    <section className="section-y" onMouseMove={handleMouseMove}>
      <div className="container">
        <SectionHeader
          index={t.services.index}
          eyebrow={t.services.eyebrow}
          titleLines={t.services.titleLines}
          description={t.services.description}
          linkTo="/servicos"
          linkLabel={t.services.linkLabel}
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
