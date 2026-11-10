/* ============================================================
   SUPABASE — configuração pública (partilhada)
   ------------------------------------------------------------
   Lê apenas variáveis públicas (VITE_*). A segurança real é
   garantida no Supabase (Auth + RLS + Storage Policies).
   ============================================================ */
const rawUrl = (import.meta.env.VITE_SUPABASE_URL ?? "").trim();
const rawAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? "").trim();

/** Lê o "role" de um JWT do Supabase sem o validar (apenas para detectar erros de configuração). */
function readJwtRole(token: string): string | null {
  const payload = token.split(".")[1];
  if (!payload) return null;
  try {
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const role = (JSON.parse(json) as { role?: unknown }).role;
    return typeof role === "string" ? role : null;
  } catch {
    return null;
  }
}

/* Protecção contra fugas: se alguém colocar a service_role key no
   frontend, recusamos usá-la e sinalizamos o erro de configuração. */
const leakedServiceRole = readJwtRole(rawAnonKey) === "service_role";

if (leakedServiceRole) {
  console.error(
    "[supabase] VITE_SUPABASE_ANON_KEY contém uma service_role key. " +
      "Esta chave NUNCA deve estar no frontend. Remova-a e rode a chave no Supabase."
  );
}

export const supabaseEnv = {
  url: rawUrl,
  /** Chave pública (anon/publishable) — segura no frontend; o acesso é limitado por RLS. */
  anonKey: leakedServiceRole ? "" : rawAnonKey,
  /** true quando URL e anon key estão definidas (e a chave não é service_role). */
  hasPublicConfig: Boolean(rawUrl && rawAnonKey && !leakedServiceRole),
  leakedServiceRole,
} as const;

