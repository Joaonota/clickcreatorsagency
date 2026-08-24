import React from "react";
import type { Partner } from "../../data/partners";

interface PartnerLogoProps {
  partner: Partner;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { img: "max-h-9 max-w-[120px]", name: "text-xl" },
  md: { img: "max-h-12 max-w-[160px]", name: "pw-name" },
  lg: { img: "max-h-16 max-w-[220px]", name: "text-3xl lg:text-4xl" },
};

/* Apresenta um parceiro:
   - com logo real SVG/PNG/WebP/JPG em public/images/partners/ — renderização nítida com grayscale / opacidade suave → brilho no hover
   - sem logo — fallback em wordmark tipográfico elegante
   - com website — link acessível */
export const PartnerLogo: React.FC<PartnerLogoProps> = ({ partner, size = "md" }) => {
  const s = sizes[size];

  const inner = (
    <span className="partner-wordmark group/pl flex items-center justify-center">
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          loading="lazy"
          className={`${s.img} w-auto object-contain transition-all duration-300 opacity-80 group-hover/pl:opacity-100 group-hover/pl:scale-105 rounded-sm`}
        />
      ) : (
        <div className="flex flex-col items-center justify-center">
          <span className={`${s.name} font-display uppercase tracking-[0.08em] whitespace-nowrap text-[var(--color-text)] group-hover/pl:text-[var(--primary)] transition-colors duration-300`}>
            {partner.name}
          </span>
          {partner.category && (
            <span className="pw-cat text-[0.55rem] font-bold uppercase tracking-widest text-[var(--text-faint)] mt-0.5">
              {partner.category}
            </span>
          )}
        </div>
      )}
    </span>
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${partner.name} — website`}
        className="block group"
      >
        {inner}
      </a>
    );
  }

  return (
    <div role="img" aria-label={partner.name}>
      {inner}
    </div>
  );
};
