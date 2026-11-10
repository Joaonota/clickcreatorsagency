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

/** Erro com mensagem já redigida para o utilizador. */
export class UserFacingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserFacingError";
  }
}

interface SupabaseLikeError {
  code?: string;
  message?: string;
  status?: number;
}

/** Converte erros do PostgREST/Storage/Auth em erros tipados (nunca JSON bruto). */
export function fromSupabaseError(error: SupabaseLikeError): Error {
  switch (error.code) {
    case "PGRST205":
    case "42P01":
      return new UserFacingError("O esquema da base de dados ainda não foi aplicado no Supabase.");
    case "42501":
    case "PGRST301":
      return new PermissionDeniedError();
    case "PGRST116":
      return new UserFacingError("Registo não encontrado ou sem permissão para o alterar.");
    case "23505":
      return new UserFacingError("Já existe um registo com esse valor (por exemplo, o mesmo slug).");
    case "23514":
    case "22P02":
      return new UserFacingError("Alguns dados são inválidos. Verifique o formulário.");
    case "23503":
      return new UserFacingError("O registo relacionado já não existe. Actualize a página.");
  }
  if (error.status === 401 || error.status === 403) return new PermissionDeniedError();
  if (error.status === 413) return new UserFacingError("Ficheiro demasiado grande para o armazenamento.");
  return new Error(error.message ?? "Erro desconhecido");
}

export const isBackendPending =(error: unknown): boolean =>
  error instanceof BackendNotConfiguredError || error instanceof AuthNotConfiguredError;

/** Converte qualquer erro numa mensagem compreensível (nunca JSON bruto). */
export function toUserMessage(error: unknown): string {
  if (error instanceof BackendNotConfiguredError) {
    return "O backend ainda não está ligado — nada foi guardado.";
  }
  if (
    error instanceof AuthNotConfiguredError ||
    error instanceof InvalidCredentialsError ||
    error instanceof PermissionDeniedError ||
    error instanceof UserFacingError
  ) {
    return error.message;
  }
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return "Sem ligação à internet. Verifique a rede e tente novamente.";
  }
  return "Ocorreu um erro inesperado. Tente novamente dentro de instantes.";
}
