/// <reference types="vite/client" />

/* Variáveis de ambiente PÚBLICAS usadas pela área administrativa.
   Apenas a "anon key" do Supabase pode chegar ao frontend — nunca a
   service_role key (ver .env.example). */
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** Só em desenvolvimento: permite ver a interface sem sessão e sem dados. */
  readonly VITE_ADMIN_UI_PREVIEW?: string;
}
