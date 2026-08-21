import React from "react";
import { Link } from "react-router-dom";
import { contactConfig } from "../../config/contact";
import { socialLinks } from "../../config/social";

const navLinks = [
  { name: "Início", path: "/" },
  { name: "Sobre", path: "/sobre" },
  { name: "Serviços", path: "/servicos" },
  { name: "Portfólio", path: "/portfolio" },
  { name: "Creators", path: "/creators" },
  { name: "Blog", path: "/blog" },
  { name: "Contactos", path: "/contactos" },
];

const socials = [
  { name: "Instagram", short: "IG", url: socialLinks.instagram },
  { name: "TikTok", short: "TK", url: socialLinks.tiktok },
  { name: "YouTube", short: "YT", url: socialLinks.youtube },
  { name: "Facebook", short: "FB", url: socialLinks.facebook },
];

export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0c] hairline-t relative overflow-hidden">
      {/* Big headline */}
      <div className="container pt-20 md:pt-28 pb-14 hairline-b">
        <p className="eyebrow mb-8">Pronto para começar?</p>
        <h2 className="display-xl mb-12">
          <span className="block">LET'S MAKE</span>
          <span className="block text-outline">SOMETHING</span>
          <span className="block">
            MEMORABLE<span className="text-[var(--primary)]">.</span>
          </span>
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/contactos" className="btn btn-primary btn-lg">
            <span>Start a Project →</span>
          </Link>
          <a
            href={`https://wa.me/${contactConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
              "Olá Click Creators! Quero falar sobre um projeto."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-lg"
          >
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Grid */}
      <div className="container py-14 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-baseline gap-1 mb-5">
            <span className="font-display text-3xl uppercase tracking-wide leading-none">Click</span>
            <span className="font-display text-3xl uppercase tracking-wide text-[var(--primary)] leading-none">
              Creators
            </span>
          </Link>
          <p className="text-sm muted leading-relaxed max-w-sm">
            Agência criativa especializada em Social Media, Marketing Digital, Produção
            Audiovisual e Gestão de Creators.
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
        <nav aria-label="Navegação do rodapé">
          <p className="eyebrow eyebrow-bare mb-6 text-white/40">Navegação</p>
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
          <p className="eyebrow eyebrow-bare mb-6 text-white/40">Contacto</p>
          <ul className="flex flex-col gap-3 text-sm muted">
            <li>
              <a href={`tel:${contactConfig.phone}`} className="hover:text-[var(--primary)] transition-colors">
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
        <p className="text-xs text-zinc-600">© {year} Click Creators Agency — Todos os direitos reservados.</p>
        <p className="text-[0.55rem] font-extrabold uppercase tracking-[0.3em] text-zinc-600">
          We Create What People Remember
        </p>
      </div>
    </footer>
  );
};
