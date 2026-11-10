/* ============================================================
   MEMORY CONTROL — erros tipados e mensagens para o utilizador
   ============================================================ */

/** O backend (Supabase Database/Storage) ainda não está ligado. */
export class BackendNotConfiguredError extends Error {
  constructor() {
    super("O backend do Save Your Memory ainda não está ligado.");
    this.name = "BackendNotConfiguredError";
  }
}

/** O sistema de autenticação (Supabase Auth) ainda não está ligado. */
export class AuthNotConfiguredError extends Error {
  constructor() {
    super("A autenticação ainda não está configurada.");
    this.name = "AuthNotConfiguredError";
  }
}

/** Credenciais rejeitadas pelo servidor de autenticação. */
export class InvalidCredentialsError extends Error {
  constructor() {
    super("Email ou palavra-passe incorrectos.");
    this.name = "InvalidCredentialsError";
  }
}

/** Utilizador autenticado mas sem permissão para a operação (RLS/role). */
export class PermissionDeniedError extends Error {
  constructor() {
    super("Não tem permissão para realizar esta operação.");
    this.name = "PermissionDeniedError";
  }
}

export const isBackendPending = (error: unknown): boolean =>
  error instanceof BackendNotConfiguredError || error instanceof AuthNotConfiguredError;

/** Converte qualquer erro numa mensagem compreensível (nunca JSON bruto). */
export function toUserMessage(error: unknown): string {
  if (error instanceof BackendNotConfiguredError) {
    return "O backend ainda não está ligado — nada foi guardado.";
  }
  if (
    error instanceof AuthNotConfiguredError ||
    error instanceof InvalidCredentialsError ||
    error instanceof PermissionDeniedError
  ) {
    return error.message;
  }
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "Sem ligação à internet. Verifique a rede e tente novamente.";
  }
  return "Ocorreu um erro inesperado. Tente novamente dentro de instantes.";
}
