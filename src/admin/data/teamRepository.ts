/* ============================================================
   MEMORY CONTROL — gestão da equipa (contas de administrador)
   ------------------------------------------------------------
   Criar contas exige privilégios de servidor, por isso tudo passa
   pela Edge Function `admin-users` (supabase/functions). O browser
   só envia a sessão do utilizador; a função confirma no servidor
   que ele é super_admin antes de fazer qualquer alteração.
   ============================================================ */

import { supabase } from "../../lib/supabase";
import type { AdminRole } from "../auth/types";
import { BackendNotConfiguredError, PermissionDeniedError, UserFacingError } from "./errors";

export interface TeamMember {
  userId: string;
  email: string;
  displayName: string;
  role: AdminRole;
  createdAt: string;
  lastSignInAt: string | null;
  isSelf: boolean;
}

export interface NewTeamMember {
  email: string;
  password: string;
  displayName: string;
  role: AdminRole;
}

export interface TeamMemberChanges {
  displayName?: string;
  role?: AdminRole;
  password?: string;
}

const FUNCTION_NAME = "admin-users";

async function call<T>(body: Record<string, unknown>): Promise<T> {
  if (!supabase) throw new BackendNotConfiguredError();
  const { data, error } = await supabase.functions.invoke<T>(FUNCTION_NAME, { body });
  if (!error) return data as T;

  // FunctionsHttpError traz a resposta original: lemos a mensagem da função.
  const response = (error as { context?: Response }).context;
  if (response instanceof Response) {
    if (response.status === 404) {
      throw new UserFacingError("A função admin-users ainda não está publicada no Supabase (Edge Functions).");
    }
    let message: string | undefined;
    try {
      message = ((await response.clone().json()) as { error?: string }).error;
    } catch {
      /* resposta sem JSON */
    }
    if (message) throw new UserFacingError(message);
    if (response.status === 401 || response.status === 403) throw new PermissionDeniedError();
  }
  throw new UserFacingError(
    "Não foi possível contactar a função admin-users. Confirme que está publicada no Supabase."
  );
}

export const teamRepository = {
  configured: Boolean(supabase),
  async list(): Promise<TeamMember[]> {
    const result = await call<{ members: TeamMember[] }>({ action: "list" });
    return result.members;
  },
  async create(input: NewTeamMember): Promise<void> {
    await call({ action: "create", ...input });
  },
  async update(userId: string, changes: TeamMemberChanges): Promise<void> {
    await call({ action: "update", userId, ...changes });
  },
  async remove(userId: string): Promise<void> {
    await call({ action: "delete", userId });
  },
};
