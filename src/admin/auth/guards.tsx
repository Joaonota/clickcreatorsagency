import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { adminRoutes } from "../config/routes";
import { AdminBootScreen } from "../components/AdminBootScreen";
import { EmptyState } from "../components/EmptyState";
import { useAdminAuth } from "./context";
import type { AdminRole } from "./types";

/**
 * Protege todas as rotas internas: só apresenta o conteúdo depois de a
 * sessão ser verificada. Sem sessão → redirecciona para o login,
 * guardando o destino pretendido.
 */
export const RequireAdmin: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status, signOut } = useAdminAuth();
  const location = useLocation();

  if (status === "loading") return <AdminBootScreen label="A verificar sessão…" />;

  if (status === "authenticated" || status === "preview") return <>{children}</>;

  if (status === "forbidden") {
    return (
      <div className="mc-fullscreen-center">
        <EmptyState
          icon={ShieldAlert}
          title="Acesso não autorizado"
          description="A sua conta não tem permissões de administração do Save Your Memory. Contacte um super administrador."
          action={
            <button type="button" className="mc-btn mc-btn-secondary" onClick={() => void signOut()}>
              Terminar sessão
            </button>
          }
        />
      </div>
    );
  }

  return <Navigate to={adminRoutes.login} replace state={{ from: location.pathname }} />;
};

/** Restringe uma secção a determinados roles (validação final: RLS no servidor). */
export const RequireRole: React.FC<{ roles: AdminRole[]; children: React.ReactNode }> = ({
  roles,
  children,
}) => {
  const { status, profile } = useAdminAuth();
  if (status === "preview") return <>{children}</>;
  if (profile && roles.includes(profile.role)) return <>{children}</>;
  return (
    <EmptyState
      icon={ShieldAlert}
      title="Secção reservada"
      description="Esta área está disponível apenas para super administradores."
    />
  );
};
