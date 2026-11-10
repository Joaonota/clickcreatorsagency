# Memory Control: área privada do Save Your Memory

Rota base: `/memory-control` (definida em `config/routes.ts` e em `vercel.json`).
O código é carregado em lazy a partir de `App.tsx`, por isso nada do painel entra no bundle público.

## Estado actual

| Camada | Ficheiro | Estado |
| --- | --- | --- |
| Autenticação | `auth/provider.ts` | **Pendente**: não é possível iniciar sessão |
| Dados + Storage | `data/repository.ts` | **Pendente**: todas as operações devolvem `BackendNotConfiguredError` |
| Esquema SQL / RLS | `supabase/migrations/0001_save_your_memory.sql` | Rascunho, ainda não aplicado |

Não existem credenciais locais, sessões simuladas nem dados fictícios.

## Ligar o Supabase

1. `npm i @supabase/supabase-js`
2. Definir `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (ver `.env.example`), localmente e na Vercel.
   **Nunca** usar a service_role key no frontend.
3. Rever e aplicar a migração SQL. Em Auth → Providers, desactivar o registo público e convidar os administradores.
   Depois, inserir o perfil de cada um em `admin_profiles` com o role (`super_admin` | `memory_admin`).
4. Criar `auth/supabaseAuthProvider.ts` que implemente `AdminAuthProvider`:
   - `signIn` → `supabase.auth.signInWithPassword`; em seguida, ler `admin_profiles` do próprio utilizador.
   - `getSession` → `supabase.auth.getUser()`, que valida no servidor, mais o perfil.
   - `onSessionChange` → `supabase.auth.onAuthStateChange`.
   - A sessão é persistida pelo próprio supabase-js (tokens, nunca palavras-passe).
5. Criar `data/supabaseRepository.ts` que implemente `MemoryAdminRepository` com `supabase.from(...)` e
   `supabase.storage.from("memory-photos")`. As pré-visualizações no admin usam URLs assinados.
6. Exportar ambos em `auth/provider.ts` e `data/repository.ts`, com `configured: true`.

As permissões em `auth/permissions.ts` servem só para adaptar a interface.
Quem decide o acesso são as policies RLS e Storage.

## Pré-visualizar a interface (só em desenvolvimento)

`VITE_ADMIN_UI_PREVIEW=true npm run dev` mostra o painel sem sessão e sem dados.
Este modo é eliminado nos builds de produção (`import.meta.env.DEV`).
