/* ============================================================
   SUPABASE — cliente partilhado (apenas chave pública)
   ------------------------------------------------------------
   Usado pela área privada /memory-control e pela galeria
   pública Save Your Memory (que o carrega em lazy). A sessão é
   persistida pelo supabase-js (tokens com refresh automático),
   nunca palavras-passe. Todo o acesso é limitado por RLS.
   ============================================================ */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./supabaseEnv";

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
