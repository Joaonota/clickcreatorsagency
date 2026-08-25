import React from "react";
import type { Partner } from "../../data/partners";

interface PartnerLogoProps {
  partner: Partner;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { img: "max-h-14 max-w-[160px]", name: "text-xl" },
  md: { img: "max-h-[110px] max-w-[240px]", name: "pw-name" },
  lg: { img: "max-h-[140px] max-w-[260px]", name: "text-3xl lg:text-4xl" },
};

/* Peso visual equilibrado por parceiro — calibrado com a proporção REAL de cada asset
   (2M 346×190 horizontal · Yango 240×240 · Nova Era 2000×2000 · GLN 1200×800 · Move 1080×308 ultra-larga).
   Logos quadradas/verticais ficam limitadas pela altura; horizontais pela largura,
   garantindo peso visual aproximado entre todas. */
const fitOverrides: Record<string, Record<"sm" | "md" | "lg", string>> = {
  "partner-2m": {
    sm: "max-h-[54px] max-w-[110px]",
    md: "max-h-[124px] max-w-[230px]",
    lg: "max-h-[138px] max-w-[252px]",
  },
  "partner-yango": {
    sm: "max-h-[58px] max-w-[92px]",
    md: "max-h-[122px] max-w-[170px]",
    lg: "max-h-[138px] max-w-[192px]",
  },
  "partner-novaera": {
    sm: "max-h-[62px] max-w-[98px]",
    md: "max-h-[128px] max-w-[180px]",
    lg: "max-h-[142px] max-w-[202px]",
  },
  "partner-gln": {
    sm: "max-h-[54px] max-w-[130px]",
    md: "max-h-[118px] max-w-[210px]",
    lg: "max-h-[134px] max-w-[222px]",
  },
  "partner-move": {
    sm: "max-h-[44px] max-w-[152px]",
    md: "max-h-[74px] max-w-[248px]",
    lg: "max-h-[82px] max-w-[262px]",
  },
};

/* Logos com fundo opaco precisam de integração visual dedicada */
const plateClass: Record<string, string> = {
  "partner-novaera": "partner-logo-dark",
  "partner-gln": "partner-logo-light",
};

/* Apresenta um parceiro:
   - com logo real SVG/PNG/WebP/JPG em public/parceiros/ — renderização nítida com opacidade suave → brilho no hover
   - sem logo — fallback em wordmark tipográfico elegante
   - com website — link acessível */
export const PartnerLogo: React.FC<PartnerLogoProps> = ({ partner, size = "md" }) => {
  const s = sizes[size];
  const fit = fitOverrides[partner.id]?.[size] ?? s.img;
  const plate = plateClass[partner.id] ?? "";

  const inner = (
    <span className="partner-wordmark group/pl flex items-center justify-center">
      {partner.logo ? (
        <img
          src={partner.logo}
          alt={`Logo da ${partner.name}`}
          loading="lazy"
          className={`${fit} w-auto object-contain transition-all duration-300 opacity-80 group-hover/pl:opacity-100 group-hover/pl:scale-[1.04] rounded-sm ${plate}`}
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
