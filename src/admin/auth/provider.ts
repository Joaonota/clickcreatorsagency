/* ============================================================
   MEMORY CONTROL — fornecedor de autenticação activo
   ------------------------------------------------------------
   Estado actual: PENDENTE. Não existe sessão possível até ao
   Supabase Auth ser integrado — não há credenciais locais nem
   sessões simuladas.

   Integração futura (ver src/admin/README.md):
     1. npm i @supabase/supabase-js
     2. Criar `supabaseAuthProvider.ts` que implemente
        AdminAuthProvider com supabase.auth.* e leia o perfil em
        `admin_profiles` (RLS: cada utilizador só lê o seu).
     3. Exportar esse provider aqui quando supabaseEnv.hasPublicConfig.
   ============================================================ */

import { AuthNotConfiguredError } from "../data/errors";
import type { AdminAuthProvider } from "./types";

const pendingAuthProvider: AdminAuthProvider = {
  configured: false,
  async getSession() {
    return null;
  },
  async signIn() {
    throw new AuthNotConfiguredError();
  },
  async signOut() {
    /* Sem sessão para terminar. */
  },
  async updatePassword() {
    throw new AuthNotConfiguredError();
  },
  onSessionChange() {
    return () => undefined;
  },
};

export const adminAuthProvider: AdminAuthProvider = pendingAuthProvider;
