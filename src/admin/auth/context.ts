import { createContext, useContext } from "react";
import type { AdminCredentials, AdminProfile, AdminSession } from "./types";

/**
 * - loading         → a validar a sessão junto do servidor
 * - unconfigured    → Supabase Auth ainda não integrado (sem login possível)
 * - unauthenticated → sem sessão
 * - forbidden       → sessão válida mas sem perfil de administrador
 * - authenticated   → sessão + perfil com role
 * - preview         → só em desenvolvimento: interface sem sessão nem dados
 */
export type AdminAuthStatus =
  | "loading"
  | "unconfigured"
  | "unauthenticated"
  | "forbidden"
  | "authenticated"
  | "preview";

export interface AdminAuthValue {
  status: AdminAuthStatus;
  session: AdminSession | null;
  profile: AdminProfile | null;
  authConfigured: boolean;
  signIn(credentials: AdminCredentials): Promise<AdminSession>;
  signOut(): Promise<void>;
  updatePassword(password: string): Promise<void>;
}

export const AdminAuthContext = createContext<AdminAuthValue | null>(null);

export function useAdminAuth(): AdminAuthValue {
  const value = useContext(AdminAuthContext);
  if (!value) throw new Error("useAdminAuth deve ser usado dentro de <AdminAuthProvider>.");
  return value;
}
