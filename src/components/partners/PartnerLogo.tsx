import React from "react";
import type { Partner } from "../../data/partners";

interface PartnerLogoProps {
  partner: Partner;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { img: "max-h-12 max-w-[140px]", name: "text-xl" },
  md: { img: "max-h-[92px] max-w-[220px]", name: "pw-name" },
  lg: { img: "max-h-[120px] max-w-[260px]", name: "text-3xl lg:text-4xl" },
};

/* Peso visual equilibrado por parceiro — calibrado com a proporção real de cada asset
   (2M vertical 90×190 · Yango 240×240 · Nova Era 2000×2000 · GLN 1080×1080 · Move 1080×308) */
const fitOverrides: Record<string, Record<"sm" | "md" | "lg", string>> = {
  "partner-2m": {
    sm: "max-h-16 max-w-[84px]",
    md: "max-h-[112px] max-w-[120px]",
    lg: "max-h-[130px] max-w-[140px]",
  },
  "partner-yango": {
    sm: "max-h-16 max-w-[100px]",
    md: "max-h-[112px] max-w-[160px]",
    lg: "max-h-[130px] max-w-[180px]",
  },
  "partner-novaera": {
    sm: "max-h-[72px] max-w-[110px]",
    md: "max-h-[124px] max-w-[190px]",
    lg: "max-h-[136px] max-w-[210px]",
  },
  "partner-gln": {
    sm: "max-h-16 max-w-[100px]",
    md: "max-h-[112px] max-w-[160px]",
    lg: "max-h-[130px] max-w-[180px]",
  },
  "partner-move": {
    sm: "max-h-9 max-w-[140px]",
    md: "max-h-[64px] max-w-[220px]",
    lg: "max-h-[76px] max-w-[250px]",
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
