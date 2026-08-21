import React from "react";
import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { contactConfig } from "../../config/contact";
import { SocialLinks } from "../common/SocialLinks";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-zinc-800 pt-16 pb-12 relative overflow-hidden">
      {/* Background Subtle Lime Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-lime-500/5 blur-[140px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-16">
          {/* Column 1: Brand Info & Logo */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="h-10 flex items-center">
                <img
                  src="/logo/logo.PNG"
                  alt="Click Creators Agency Logo"
                  className="h-full w-auto object-contain filter brightness-110"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xl tracking-tight text-white leading-none">
                  CLICK<span className="text-lime-400">CREATORS</span>
                </span>
                <span className="text-[9px] font-extrabold tracking-widest text-zinc-400 uppercase">
                  Agency
                </span>
              </div>
            </Link>

            <p className="text-zinc-400 text-sm leading-relaxed">
              Agência especializada em Social Media, Marketing Digital e Produção Audiovisual. Transformamos ideias em conteúdo e estratégias marcantes.
            </p>

            <SocialLinks />
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              Navegação
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/" className="hover:text-lime-400 transition-colors flex items-center gap-1 group">
                  <span>Início</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="hover:text-lime-400 transition-colors flex items-center gap-1 group">
                  <span>Sobre Nós</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="hover:text-lime-400 transition-colors flex items-center gap-1 group">
                  <span>Serviços</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-lime-400 transition-colors flex items-center gap-1 group">
                  <span>Portfólio</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/creators" className="hover:text-lime-400 transition-colors flex items-center gap-1 group">
                  <span>Creators</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-lime-400 transition-colors flex items-center gap-1 group">
                  <span>Blog / Notícias</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/contactos" className="hover:text-lime-400 transition-colors flex items-center gap-1 group">
                  <span>Contactos</span>
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              Serviços
            </h3>
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <Link to="/servicos/marketing-digital" className="hover:text-lime-400 transition-colors">
                  Marketing Digital
                </Link>
              </li>
              <li>
                <Link to="/servicos/producao-audiovisual" className="hover:text-lime-400 transition-colors">
                  Produção Audiovisual
                </Link>
              </li>
              <li>
                <Link to="/servicos/gestao-redes-sociais" className="hover:text-lime-400 transition-colors">
                  Gestão de Redes Sociais
                </Link>
              </li>
              <li>
                <Link to="/servicos/branding" className="hover:text-lime-400 transition-colors">
                  Branding & Identidade Visual
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-white font-bold text-base mb-5 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              Contactos
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-zinc-400 mb-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-lime-400 shrink-0 mt-1" />
                <a href={`tel:${contactConfig.phone}`} className="hover:text-white transition-colors">
                  {contactConfig.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-lime-400 shrink-0 mt-1" />
                <a href={`mailto:${contactConfig.email}`} className="hover:text-white transition-colors">
                  {contactConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-lime-400 shrink-0 mt-1" />
                <span>{contactConfig.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {currentYear} Click Creators Agency. Todos os direitos reservados.</p>
          <p className="flex items-center gap-2">
            <span>WE CREATE WHAT PEOPLE REMEMBER.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
