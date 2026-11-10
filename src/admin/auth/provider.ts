/* ============================================================
   MEMORY CONTROL — fornecedor de autenticação activo
   ------------------------------------------------------------
   Com VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY definidas usa o
   Supabase Auth. Sem elas, fica PENDENTE: nenhum login é possível
   (sem credenciais locais nem sessões simuladas).
   ============================================================ */

import { AuthNotConfiguredError } from "../data/errors";
import { supabase } from "../../lib/supabase";
import { createSupabaseAuthProvider } from "./supabaseAuthProvider";
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

export const adminAuthProvider: AdminAuthProvider = supabase
  ? createSupabaseAuthProvider(supabase)
  : pendingAuthProvider;
