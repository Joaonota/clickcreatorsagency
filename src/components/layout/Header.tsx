import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { contactConfig } from "../../config/contact";

const navLinks = [
  { name: "Início", path: "/" },
  { name: "Sobre", path: "/sobre" },
  { name: "Serviços", path: "/servicos" },
  { name: "Portfólio", path: "/portfolio" },
  { name: "Creators", path: "/creators" },
  { name: "Blog", path: "/blog" },
  { name: "Contactos", path: "/contactos" },
];

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const waUrl = `https://wa.me/${contactConfig.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
    "Olá Click Creators! Quero iniciar um projeto."
  )}`;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0c]/90 backdrop-blur-xl hairline-b"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between py-4 md:py-5">
          {/* Logo */}
          <Link to="/" className="flex items-baseline gap-1 z-10 group">
            <span className="font-display text-2xl md:text-3xl uppercase tracking-wide text-white leading-none">
              Click
            </span>
            <span className="font-display text-2xl md:text-3xl uppercase tracking-wide text-[var(--primary)] leading-none">
              Creators
            </span>
            <span className="hidden sm:inline-block font-display text-xl text-white/40 ml-2">
              Agency
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navegação principal">
            {navLinks.map((link) => {
              const active =
                link.path === "/"
                  ? location.pathname === "/"
                  : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={active ? "page" : undefined}
                  className={`text-[0.68rem] font-extrabold uppercase tracking-[0.18em] transition-colors duration-200 link-sweep ${
                    active ? "is-active text-[var(--primary)]" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* CTA + burger */}
          <div className="flex items-center gap-3">
            <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm hidden md:inline-flex">
              <span>Start a Project</span>
            </a>
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              aria-expanded={open}
              className="lg:hidden flex flex-col justify-center items-end gap-[6px] w-11 h-11"
            >
              <span
                className={`h-[2px] bg-white transition-all duration-300 ${
                  open ? "w-7 rotate-45 translate-y-[4px]" : "w-7"
                }`}
              />
              <span
                className={`h-[2px] bg-white transition-all duration-300 ${
                  open ? "w-7 -rotate-45 -translate-y-[4px]" : "w-5 group-hover:w-7"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={`lg:hidden fixed inset-0 z-40 flex flex-col bg-[#0a0a0c] transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="container flex-1 flex flex-col justify-center gap-1 pb-24 pt-24">
          {navLinks.map((link, i) => {
            const active =
              link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path);
            return (
              <div key={link.path} className="overflow-hidden border-b border-[var(--border)]">
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className={`font-display block py-4 uppercase leading-none transition-colors duration-200 ${
                    active ? "text-[var(--primary)]" : "text-white"
                  }`}
                  style={{
                    fontSize: "clamp(38px, 10vw, 72px)",
                    transform: open ? "translateY(0)" : "translateY(110%)",
                    opacity: open ? 1 : 0,
                    transition: "transform .6s cubic-bezier(0.16,1,0.3,1), opacity .4s",
                    transitionDelay: `${i * 55 + 80}ms`,
                  }}
                >
                  <span className="text-sm align-top text-white/40 mr-3">0{i + 1}</span>
                  {link.name}
                </Link>
              </div>
            );
          })}
        </div>

        <div className="container pb-10">
          <p className="eyebrow eyebrow-bare mb-4 text-white/40">{siteTagline}</p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="btn btn-primary btn-lg w-full justify-center"
          >
            <span>Start a Project →</span>
          </a>
        </div>
      </div>
    </>
  );
};

const siteTagline = "Social Media • Content • Creators • Audiovisual";
