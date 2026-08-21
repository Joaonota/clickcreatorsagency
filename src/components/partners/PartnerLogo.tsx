import React from "react";
import type { Partner } from "../../data/partners";

interface PartnerLogoProps {
  partner: Partner;
  /* Tamanho do logo real quando existir */
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { img: "max-h-9 max-w-[110px]", name: "text-xl" },
  md: { img: "max-h-11 max-w-[150px]", name: "pw-name" },
  lg: { img: "max-h-16 max-w-[220px]", name: "text-3xl lg:text-4xl" },
};

/* Apresenta um parceiro:
   - com logo real (SVG/PNG/WebP/JPG) — grayscale → cor no hover
   - sem logo — fallback em wordmark tipográfico
   - com website — envolvido em link externo acessível */
export const PartnerLogo: React.FC<PartnerLogoProps> = ({ partner, size = "md" }) => {
  const s = sizes[size];

  const inner = (
    <span className="partner-wordmark group/pl">
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={partner.name}
          loading="lazy"
          className={s.img}
        />
      ) : (
        <>
          <span className={`${s.name} font-display uppercase tracking-[0.06em] whitespace-nowrap`}>
            {partner.name}
          </span>
          {partner.category && (
            <span className="pw-cat">{partner.category}</span>
          )}
        </>
      )}
    </span>
  );

  if (partner.website) {
    return (
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${partner.name} — visitar website`}
        className="block"
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
