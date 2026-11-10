import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Calendar,
  CheckSquare,
  Images,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  Settings,
  UserRound,
  X,
} from "lucide-react";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { adminRoutes } from "../config/routes";
import { useAdminAuth } from "../auth/context";
import { roleLabels } from "../auth/permissions";
import { BackendStatusBanner } from "./BackendStatusBanner";

const navItems = [
  { to: adminRoutes.dashboard, label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: adminRoutes.events, label: "Eventos", icon: Calendar },
  { to: adminRoutes.albums, label: "Álbuns", icon: Library },
  { to: adminRoutes.photos, label: "Fotografias", icon: Images },
  { to: adminRoutes.publications, label: "Gestão de publicações", icon: CheckSquare },
] as const;

const accountItems = [
  { to: adminRoutes.settings, label: "Definições", icon: Settings },
  { to: adminRoutes.profile, label: "Perfil", icon: UserRound },
] as const;

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

export const AdminLayout: React.FC = () => {
  const { status, session, profile, signOut } = useAdminAuth();
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();

  /* Fecha o menu móvel ao navegar. */
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setNavOpen(false);
  }

  useEffect(() => {
    if (!navOpen) return undefined;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setNavOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  const isPreview = status === "preview";
  const displayName = profile?.displayName ?? (isPreview ? "Pré-visualização" : "Administrador");
  const subtitle = profile ? roleLabels[profile.role] : isPreview ? "Sem sessão · sem dados" : "";

  const renderLink = (item: { to: string; label: string; icon: typeof Calendar; end?: boolean }) => {
    const Icon = item.icon;
    return (
      <li key={item.to}>
        <NavLink
          to={item.to}
          end={item.end}
          className={({ isActive }) => `mc-nav-link ${isActive ? "active" : ""}`}
        >
          <Icon size={17} strokeWidth={1.9} aria-hidden="true" />
          <span>{item.label}</span>
        </NavLink>
      </li>
    );
  };

  return (
    <div className="mc-shell">
      <a href="#mc-main" className="mc-skip-link">Saltar para o conteúdo</a>

      <aside id="mc-sidebar" className={`mc-sidebar ${navOpen ? "open" : ""}`} aria-label="Navegação do painel">
        <div className="mc-sidebar-brand">
          <span className="header-logo-wrap">
            <img src="/logo/logo.PNG" alt="Click Creators Agency" className="mc-brand-logo" width={96} height={32} />
          </span>
          <div className="mc-brand-text">
            <span className="mc-brand-title">Memory Control</span>
            <span className="mc-brand-sub">Save Your Memory</span>
          </div>
          <button type="button" className="mc-icon-btn mc-sidebar-close" onClick={() => setNavOpen(false)} aria-label="Fechar menu">
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        <nav className="mc-nav">
          <p className="mc-nav-heading">Gestão</p>
          <ul>{navItems.map(renderLink)}</ul>
          <p className="mc-nav-heading">Conta</p>
          <ul>
            {accountItems.map(renderLink)}
            <li>
              <button type="button" className="mc-nav-link mc-nav-logout" onClick={() => void signOut()}>
                <LogOut size={17} strokeWidth={1.9} aria-hidden="true" />
                <span>Terminar sessão</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="mc-sidebar-foot">
          <span className="mc-private-tag">Área privada · noindex</span>
        </div>
      </aside>

      {navOpen && <div className="mc-sidebar-scrim" onClick={() => setNavOpen(false)} aria-hidden="true" />}

      <div className="mc-main-col">
        <header className="mc-topbar">
          <button
            type="button"
            className="mc-icon-btn mc-menu-btn"
            onClick={() => setNavOpen(true)}
            aria-label="Abrir menu"
            aria-expanded={navOpen}
            aria-controls="mc-sidebar"
          >
            <Menu size={18} aria-hidden="true" />
          </button>
          <span className="mc-topbar-title">Memory Control</span>
          <div className="mc-topbar-right">
            <ThemeToggle />
            <div className="mc-user">
              <span className="mc-avatar" aria-hidden="true">{initialsOf(displayName)}</span>
              <span className="mc-user-text">
                <span className="mc-user-name">{displayName}</span>
                <span className="mc-user-meta">{session?.user.email ?? subtitle}</span>
              </span>
            </div>
          </div>
        </header>

        <BackendStatusBanner />

        <main id="mc-main" className="mc-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
