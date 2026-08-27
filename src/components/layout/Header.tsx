import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getWhatsAppUrl } from "../../config/contact";
import { ThemeToggle } from "../common/ThemeToggle";
import { LanguageSwitcher } from "../common/LanguageSwitcher";
import { useTranslation } from "../../i18n";

export const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.about, path: "/sobre" },
    { name: t.nav.services, path: "/servicos" },
    { name: t.nav.portfolio, path: "/portfolio" },
    { name: t.nav.creators, path: "/creators" },
    { name: t.nav.partners, path: "/partners" },
    { name: t.nav.contact, path: "/contactos" },
  ];

  const handleCloseMenu = () => {
    (document.activeElement as HTMLElement)?.blur();
    setOpen(false);
  };

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

  useEffect(() => {
    handleCloseMenu();
  }, [location.pathname]);

  const waUrl = getWhatsAppUrl(t.whatsapp.defaultMessage);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? "bg-[var(--background)]/90 backdrop-blur-xl hairline-b"
            : "bg-transparent"
        }`}
      >
        <div className="container flex items-center justify-between py-4 md:py-5">
          {/* Logo oficial */}
          <Link
            to="/"
            aria-label="Click Creators Agency — Início"
            className="header-logo-container z-10 flex items-center shrink-0"
          >
            <img
              src="/logo/logo.PNG"
              alt="Click Creators Agency"
              width={52}
              height={40}
              className="header-logo"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8" aria-label="Navegação principal">
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
                    active ? "is-active text-[var(--primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Controls: Language Selector + Theme + WhatsApp CTA + Burger */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Seletor de Idioma Desktop Minimalista PT / EN */}
            <LanguageSwitcher className="hidden sm:inline-flex" />

            <ThemeToggle />

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm hidden md:inline-flex"
            >
              <span>{t.nav.startProject}</span>
            </a>

            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? t.common.closeMenu : t.common.openMenu}
              aria-expanded={open}
              className="lg:hidden flex flex-col justify-center items-end gap-[6px] w-11 h-11 cursor-pointer focus:outline-none"
            >
              <span
                className={`h-[2px] bg-[var(--color-text)] transition-all duration-300 ${
                  open ? "w-7 rotate-45 translate-y-[4px]" : "w-7"
                }`}
              />
              <span
                className={`h-[2px] bg-[var(--color-text)] transition-all duration-300 ${
                  open ? "w-7 -rotate-45 -translate-y-[4px]" : "w-5 group-hover:w-7"
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={`lg:hidden fixed inset-0 z-50 flex flex-col bg-[var(--background)] transition-all duration-500 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        inert={!open ? true : undefined}
      >
        {/* Mobile Header Bar with Close */}
        <div className="container flex items-center justify-between py-4 border-b border-[var(--border)]">
          <Link
            to="/"
            onClick={handleCloseMenu}
            aria-label="Click Creators Agency"
            className="flex items-center"
          >
            <img
              src="/logo/logo.PNG"
              alt="Click Creators Agency"
              width={46}
              height={35}
            />
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher variant="mobile" />
            <button
              onClick={handleCloseMenu}
              aria-label={t.common.closeMenu}
              className="w-10 h-10 flex items-center justify-center text-[var(--color-text)] cursor-pointer"
            >
              <span className="font-display text-2xl">✕</span>
            </button>
          </div>
        </div>

        {/* Links list */}
        <div className="container flex-1 overflow-y-auto flex flex-col justify-center gap-1 py-8">
          {navLinks.map((link, i) => {
            const active =
              link.path === "/" ? location.pathname === "/" : location.pathname.startsWith(link.path);
            return (
              <div key={link.path} className="overflow-hidden border-b border-[var(--border)]">
                <Link
                  to={link.path}
                  onClick={handleCloseMenu}
                  tabIndex={open ? 0 : -1}
                  className={`font-display block py-3.5 uppercase leading-none transition-colors duration-200 ${
                    active ? "text-[var(--primary)]" : "text-[var(--color-text)]"
                  }`}
                  style={{
                    fontSize: "clamp(32px, 8vw, 56px)",
                    transform: open ? "translateY(0)" : "translateY(110%)",
                    opacity: open ? 1 : 0,
                    transition: "transform .5s cubic-bezier(0.16,1,0.3,1), opacity .3s",
                    transitionDelay: `${i * 45 + 50}ms`,
                  }}
                >
                  <span className="text-xs align-top text-[var(--text-faint)] mr-3">0{i + 1}</span>
                  {link.name}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Mobile footer controls */}
        <div className="container pb-8 pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <p className="eyebrow eyebrow-bare text-[var(--text-faint)] text-[0.62rem]">
              {t.hero.subtext}
            </p>
            <ThemeToggle />
          </div>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={open ? 0 : -1}
            className="btn btn-primary btn-lg w-full justify-center"
          >
            <span>{t.nav.startProject} →</span>
          </a>
        </div>
      </div>
    </>
  );
};
