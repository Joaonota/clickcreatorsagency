import React from "react";
import { Link } from "react-router-dom";
import { contactConfig, getWhatsAppUrl } from "../../config/contact";
import { socialLinks } from "../../config/social";
import { useTranslation } from "../../i18n";

const socials = [
  { name: "Instagram", short: "IG", url: socialLinks.instagram },
  { name: "TikTok", short: "TK", url: socialLinks.tiktok },
  { name: "YouTube", short: "YT", url: socialLinks.youtube },
  { name: "Facebook", short: "FB", url: socialLinks.facebook },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  const { t } = useTranslation();

  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.about, path: "/sobre" },
    { name: t.nav.services, path: "/servicos" },
    { name: t.nav.portfolio, path: "/portfolio" },
    { name: t.nav.creators, path: "/creators" },
    { name: t.nav.partners, path: "/partners" },
    { name: t.nav.blog, path: "/blog" },
    { name: t.nav.contact, path: "/contactos" },
  ];

  const waUrl = getWhatsAppUrl(t.whatsapp.defaultMessage);

  return (
    <footer className="bg-[var(--background)] hairline-t relative overflow-hidden force-dark">
      {/* Big headline */}
      <div className="container pt-20 md:pt-28 pb-14 hairline-b">
        <p className="eyebrow mb-8">{t.footer.readyEyebrow}</p>
        <h2 className="display-xl mb-12">
          <span className="block">{t.footer.titleLine1}</span>
          <span className="block text-outline">{t.footer.titleLine2}</span>
          <span className="block">
            {t.footer.titleLine3.replace(".", "")}
            <span className="text-[var(--primary)]">.</span>
          </span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/contactos" className="btn btn-primary btn-lg">
            <span>{t.footer.startProject} →</span>
          </Link>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-lg"
          >
            <span>{t.footer.whatsapp}</span>
          </a>
        </div>
      </div>

      {/* Grid */}
      <div className="container py-14 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link
            to="/"
            aria-label="Click Creators Agency — Início"
            className="mb-6 inline-flex items-center group"
          >
            <span className="font-display text-2xl lg:text-3xl tracking-wider text-white group-hover:text-[var(--primary)] transition-colors">
              CLICK CREATORS<span className="text-[var(--primary)]">.</span>
            </span>
          </Link>
          <p className="text-sm muted leading-relaxed max-w-sm">
            {t.footer.description}
          </p>
          <div className="flex items-center gap-6 mt-7">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="link-sweep text-[0.62rem] font-extrabold uppercase tracking-[0.22em] muted hover:text-[var(--primary)] transition-colors"
              >
                {s.short}
              </a>
            ))}
          </div>
        </div>

        {/* Nav */}
        <nav aria-label={t.footer.navigationTitle}>
          <p className="eyebrow eyebrow-bare mb-6 text-[var(--text-faint)]">{t.footer.navigationTitle}</p>
          <ul className="grid grid-cols-2 md:grid-cols-1 gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="text-sm muted hover:text-[var(--primary)] transition-colors font-medium"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div>
          <p className="eyebrow eyebrow-bare mb-6 text-[var(--text-faint)]">{t.footer.contactTitle}</p>
          <ul className="flex flex-col gap-3 text-sm muted">
            <li>
              <a href={`tel:${contactConfig.phone.replace(/\s+/g, "")}`} className="hover:text-[var(--primary)] transition-colors">
                {contactConfig.phoneFormatted}
              </a>
            </li>
            <li>
              <a href={`mailto:${contactConfig.email}`} className="hover:text-[var(--primary)] transition-colors">
                {contactConfig.email}
              </a>
            </li>
            <li className="leading-relaxed">{contactConfig.address}</li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container pb-8 flex flex-col md:flex-row items-center justify-between gap-3 pt-6 hairline-t">
        <p className="text-xs text-[var(--text-faint)]">
          © {year} {t.footer.allRightsReserved}
        </p>
        <p className="text-[0.55rem] font-extrabold uppercase tracking-[0.3em] text-[var(--text-faint)]">
          {t.footer.tagline}
        </p>
      </div>
    </footer>
  );
};
