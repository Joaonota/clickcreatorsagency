import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { contactConfig } from "../../config/contact";
import { Button } from "../common/Button";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Início", path: "/" },
    { name: "Sobre Nós", path: "/sobre" },
    { name: "Serviços", path: "/servicos" },
    { name: "Portfólio", path: "/portfolio" },
    { name: "Creators", path: "/creators" },
    { name: "Blog", path: "/blog" },
    { name: "Contactos", path: "/contactos" },
  ];

  const whatsappUrl = `https://wa.me/${contactConfig.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
    "Olá Click Creators! Gostaria de falar com a equipa da agência."
  )}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-zinc-800 py-3 shadow-2xl shadow-lime-950/20"
          : "bg-transparent py-5 md:py-6"
      }`}
    >
      <div className="container flex items-center justify-between">
        {/* OFFICIAL LOGO */}
        <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 group">
          <div className="h-10 md:h-12 flex items-center">
            <img
              src="/logo/logo.PNG"
              alt="Click Creators Agency Logo"
              className="h-full w-auto object-contain group-hover:scale-105 transition-transform duration-300 filter brightness-110"
              onError={(e) => {
                // Fallback to text logo if image fails to render
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg md:text-xl tracking-tight text-white leading-none">
              CLICK<span className="text-lime-400">CREATORS</span>
            </span>
            <span className="text-[9px] font-extrabold tracking-widest text-zinc-400 uppercase">
              Agency
            </span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-zinc-900/80 border border-zinc-800 rounded-full px-4 py-1.5 backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-lime-400 text-slate-950 shadow-md shadow-lime-500/20"
                    : "text-zinc-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* DESKTOP CTA BUTTON */}
        <div className="hidden lg:block">
          <Button
            href={whatsappUrl}
            variant="primary"
            size="sm"
            icon={<MessageCircle size={15} />}
          >
            Fale Connosco
          </Button>
        </div>

        {/* MOBILE MENU TOGGLE BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir Menu"
          className="lg:hidden p-2.5 rounded-xl bg-zinc-900 text-white border border-zinc-800 hover:border-lime-400 transition-all duration-200"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[65px] bg-slate-950/98 backdrop-blur-2xl z-50 flex flex-col p-6 border-t border-zinc-800 animate-fade-in justify-between">
          <nav className="flex flex-col gap-2 mt-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-5 py-3.5 rounded-2xl text-base font-extrabold transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? "bg-lime-400 text-slate-950 shadow-lg shadow-lime-500/30"
                      : "text-zinc-200 hover:bg-white/5 border border-transparent hover:border-zinc-800"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-slate-950" />}
                </Link>
              );
            })}
          </nav>

          <div className="mb-8 pt-6 border-t border-zinc-800 flex flex-col gap-4">
            <Button
              href={whatsappUrl}
              variant="whatsapp"
              size="lg"
              fullWidth
              icon={<MessageCircle size={20} />}
            >
              WhatsApp
            </Button>
            <p className="text-center text-xs text-zinc-500 font-medium">
              Click Creators Agency © 2026
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
