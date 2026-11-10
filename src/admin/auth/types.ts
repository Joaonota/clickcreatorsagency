/* ============================================================
   MEMORY CONTROL — contratos de autenticação
   ------------------------------------------------------------
   O role NUNCA é decidido pelo frontend: vem da tabela
   `admin_profiles`, lida sob Row Level Security com a sessão
   do Supabase Auth. Todas as escritas são novamente validadas
   no servidor pelas policies (ver supabase/migrations).
   ============================================================ */

export type AdminRole = "super_admin" | "memory_admin";

export interface AdminProfile {
  displayName: string;
  role: AdminRole;
}

export interface AdminSession {
  user: {
    id: string;
    email: string;
  };
  /** null quando o utilizador está autenticado mas não é administrador. */
  profile: AdminProfile | null;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

export interface AdminAuthProvider {
  /** true quando existe um backend de autenticação real ligado. */
  readonly configured: boolean;
  /** Sessão actual, validada junto do servidor (inclui o perfil/role). */
  getSession(): Promise<AdminSession | null>;
  signIn(credentials: AdminCredentials): Promise<AdminSession>;
  signOut(): Promise<void>;
  updatePassword(newPassword: string): Promise<void>;
  /** Notifica alterações de sessão (login, logout, expiração). Devolve unsubscribe. */
  onSessionChange(listener: (session: AdminSession | null) => void): () => void;
}
