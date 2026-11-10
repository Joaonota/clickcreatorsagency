# Memory Control: área privada do Save Your Memory

Rota base: `/memory-control` (definida em `config/routes.ts` e em `vercel.json`).
O código é carregado em lazy a partir de `App.tsx`, por isso nada do painel entra no bundle público.

## Estado actual

Com `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` definidas (`.env.local` / Vercel):

| Camada | Ficheiro |
| --- | --- |
| Cliente | `lib/supabase.ts`: só a chave pública; a sessão é gerida pelo supabase-js |
| Autenticação | `auth/supabaseAuthProvider.ts`: login, sessão validada no servidor, role lido de `admin_profiles` |
| Dados + Storage | `data/supabaseRepository.ts`: CRUD, upload com progresso, URLs assinados (bucket privado) |
| Esquema SQL / RLS | `supabase/migrations/0001_save_your_memory.sql` |

Sem essas variáveis, o painel usa as implementações pendentes: não há login possível e as operações são rejeitadas.

## Configurar um projecto Supabase

1. Aplicar `supabase/migrations/0001_save_your_memory.sql` no *SQL Editor*.
2. Em *Authentication → Sign In / Providers*, desactivar "Allow new users to sign up".
3. Convidar cada administrador (*Authentication → Users → Invite user*) e atribuir-lhe o role:
   ```sql
   insert into public.admin_profiles (user_id, display_name, role)
   select id, 'Nome', 'super_admin' from auth.users where email = 'email@exemplo.com';
   ```
4. Definir as duas variáveis na Vercel (Production e Preview).

**Nunca** usar a service_role key no frontend: o código recusa-a se for colocada por engano.

## Pré-visualizar a interface (só em desenvolvimento)

`VITE_ADMIN_UI_PREVIEW=true npm run dev` mostra o painel sem sessão e sem dados.
Este modo é eliminado nos builds de produção (`import.meta.env.DEV`).

## Gestão de utilizadores (Edge Function `admin-users`)

Criar contas exige privilégios de servidor, por isso a página **Utilizadores**
(`/memory-control/team`, só super_admin) usa a Edge Function
`supabase/functions/admin-users/index.ts`. A service role key é fornecida pelo
próprio Supabase à função (`SUPABASE_SERVICE_ROLE_KEY`) e nunca vai para o frontend.

1. Executar `supabase/migrations/0003_team_and_settings.sql` no SQL Editor.
2. Publicar a função — no painel: *Edge Functions → Deploy a new function → Via Editor*,
   nome `admin-users`, colar o conteúdo de `index.ts` e fazer *Deploy*
   (ou, com a CLI: `supabase functions deploy admin-users`).
   Manter "Verify JWT" activo.

Roles:
- `memory_admin` — eventos, álbuns, fotografias, publicações e definições da galeria.
- `super_admin` — tudo o anterior + gestão de contas.
