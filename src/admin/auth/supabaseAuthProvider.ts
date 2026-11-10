/* ============================================================
   MEMORY CONTROL — autenticação via Supabase Auth
   ------------------------------------------------------------
   • Sessão validada no servidor (auth.getUser), não só no browser.
   • O perfil/role é lido de `admin_profiles` sob RLS: cada
     utilizador só consegue ler o seu próprio registo.
   • Contas sem perfil de administrador são desligadas no login.
   ============================================================ */

import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  InvalidCredentialsError,
  PermissionDeniedError,
  UserFacingError,
  fromSupabaseError,
} from "../data/errors";
import type { AdminAuthProvider, AdminProfile, AdminRole, AdminSession } from "./types";

const ROLES: readonly AdminRole[] = ["super_admin", "memory_admin"];

async function loadProfile(client: SupabaseClient, userId: string): Promise<AdminProfile | null> {
  const { data, error } = await client
    .from("admin_profiles")
    .select("display_name, role")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw fromSupabaseError(error);
  if (!data || !ROLES.includes(data.role as AdminRole)) return null;
  return { displayName: data.display_name as string, role: data.role as AdminRole };
}

async function toSession(client: SupabaseClient, user: User): Promise<AdminSession> {
  return {
    user: { id: user.id, email: user.email ?? "" },
    profile: await loadProfile(client, user.id),
  };
}

export function createSupabaseAuthProvider(client: SupabaseClient): AdminAuthProvider {
  return {
    configured: true,

    async getSession() {
      const { data: local } = await client.auth.getSession();
      if (!local.session) return null;
      // Revalida o token junto do servidor (deteta sessões revogadas).
      const { data, error } = await client.auth.getUser();
      if (error || !data.user) return null;
      return toSession(client, data.user);
    },

    async signIn({ email, password }) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.code === "invalid_credentials" || error.status === 400) throw new InvalidCredentialsError();
        if (error.code === "email_not_confirmed") {
          throw new UserFacingError("Confirme primeiro o email através do convite recebido.");
        }
        if (error.status === 429) throw new UserFacingError("Demasiadas tentativas. Aguarde alguns minutos.");
        throw fromSupabaseError(error);
      }
      const session = await toSession(client, data.user);
      if (!session.profile) {
        // Autenticado mas sem role: termina a sessão de imediato.
        await client.auth.signOut();
        throw new UserFacingError("Esta conta não tem permissões de administração.");
      }
      return session;
    },

    async signOut() {
      await client.auth.signOut();
    },

    async updatePassword(newPassword) {
      const { error } = await client.auth.updateUser({ password: newPassword });
      if (!error) return;
      if (error.code === "same_password") throw new UserFacingError("A nova palavra-passe tem de ser diferente da actual.");
      if (error.code === "weak_password") throw new UserFacingError("Palavra-passe demasiado fraca. Use uma combinação mais longa.");
      if (error.code === "reauthentication_needed") {
        throw new UserFacingError("Por segurança, termine sessão e entre novamente antes de alterar a palavra-passe.");
      }
      if (error.status === 401) throw new PermissionDeniedError();
      throw fromSupabaseError(error);
    },

    onSessionChange(listener) {
      // Contador de sequência: só o evento mais recente é entregue
      // (evita que um SIGNED_IN lento sobreponha um SIGNED_OUT).
      let sequence = 0;
      const { data } = client.auth.onAuthStateChange((event, session) => {
        if (event === "INITIAL_SESSION" || event === "TOKEN_REFRESHED") return;
        const current = ++sequence;
        // Adiado: o supabase-js desaconselha chamadas à API dentro do callback.
        window.setTimeout(() => {
          const resolve = session?.user ? toSession(client, session.user) : Promise.resolve(null);
          resolve
            .then((next) => {
              if (current === sequence) listener(next);
            })
            .catch(() => {
              if (current === sequence) listener(null);
            });
        }, 0);
      });
      return () => data.subscription.unsubscribe();
    },
  };
}
