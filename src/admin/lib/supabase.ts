/* ============================================================
   MEMORY CONTROL — cliente Supabase (apenas chave pública)
   ------------------------------------------------------------
   A sessão é persistida pelo supabase-js (tokens com refresh
   automático) — nunca palavras-passe. Todo o acesso a dados é
   limitado pelas policies RLS/Storage no servidor.
   ============================================================ */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseEnv } from "../config/env";

export const MEMORY_BUCKET = "memory-photos";

export const supabase: SupabaseClient | null = supabaseEnv.hasPublicConfig
  ? createClient(supabaseEnv.url, supabaseEnv.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: "cc-memory-control-auth",
      },
    })
  : null;
