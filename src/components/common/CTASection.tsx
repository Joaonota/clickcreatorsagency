import React from "react";
import { Link } from "react-router-dom";
import { getWhatsAppUrl } from "../../config/contact";
import { socialLinks } from "../../config/social";
import { useTranslation } from "../../i18n";

interface CTASectionProps {
  titleLines?: string[];
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = ({
  titleLines,
  className = "",
}) => {
  const { t } = useTranslation();
  const effectiveLines = titleLines || t.cta.titleLines;
  const waUrl = getWhatsAppUrl(t.whatsapp.defaultMessage);

  return (
    <section className={`relative overflow-hidden hairline-t ${className}`}>
      <div className="container section-y">
        <div className="flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-8">{t.cta.eyebrow}</p>
            <h2 className="display-xl">
              {effectiveLines.map((line, i) => (
                <span key={i} className={`block ${i === effectiveLines.length - 1 ? "text-outline" : ""}`}>
                  {line}
                </span>
              ))}
            </h2>
          </div>

          <div className="flex flex-col gap-6 lg:items-end lg:pb-4 shrink-0">
            <Link to="/contactos" className="btn btn-primary btn-lg w-full sm:w-auto justify-center">
              <span>{t.cta.startProject} →</span>
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg w-full sm:w-auto justify-center"
            >
              <span>{t.cta.whatsapp}</span>
            </a>

            <div className="flex items-center gap-5 pt-2">
              <a
                href={socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-[0.62rem] font-extrabold uppercase tracking-[0.22em] muted hover:text-[var(--primary)] transition-colors"
              >
                IG
              </a>
              <a
                href={socialLinks.tiktok}
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="text-[0.62rem] font-extrabold uppercase tracking-[0.22em] muted hover:text-[var(--primary)] transition-colors"
              >
                TK
              </a>
              <a
                href={socialLinks.youtube}
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="text-[0.62rem] font-extrabold uppercase tracking-[0.22em] muted hover:text-[var(--primary)] transition-colors"
              >
                YT
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
