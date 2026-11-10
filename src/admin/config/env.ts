/* ============================================================
   MEMORY CONTROL — configuração de ambiente
   ------------------------------------------------------------
   Nada aqui decide, por si só, quem é administrador: isso é
   verificado no Supabase (Auth + RLS).
   ============================================================ */

import { supabaseEnv } from "../../lib/supabaseEnv";

export { supabaseEnv };

/**
 * Modo de pré-visualização da interface — APENAS em `npm run dev`.
 * Em builds de produção `import.meta.env.DEV` é `false` e este ramo é
 * eliminado. Não cria sessão, não atribui roles e não fornece dados:
 * serve apenas para rever layout e navegação antes do Supabase.
 */
export const isUiPreviewMode =
  import.meta.env.DEV &&
  import.meta.env.VITE_ADMIN_UI_PREVIEW === "true" &&
  // Com o Supabase configurado, usa-se sempre a autenticação real.
  !supabaseEnv.hasPublicConfig;
