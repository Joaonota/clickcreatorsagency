-- ============================================================
-- SAVE YOUR MEMORY — equipa e definições
-- ------------------------------------------------------------
-- • Administradores de memória (memory_admin) passam a poder
--   alterar as definições da galeria.
-- • A gestão de contas (criar/editar/remover administradores)
--   continua exclusiva do super_admin e é feita pela Edge Function
--   `admin-users` (a única peça que usa a service role, no servidor).
-- Pode ser executado mais do que uma vez.
-- ============================================================

drop policy if exists "settings: super admin updates" on public.memory_settings;
drop policy if exists "settings: admins update" on public.memory_settings;
create policy "settings: admins update" on public.memory_settings
  for update to authenticated using (public.is_memory_admin()) with check (public.is_memory_admin());

-- Os perfis só são escritos pela Edge Function (service role).
-- Remove a escrita directa pelo browser para impedir, por exemplo,
-- que um super_admin retire o próprio acesso por engano.
drop policy if exists "profiles: super admin manages" on public.admin_profiles;

-- Todos os administradores vêem os nomes da equipa (ex.: autor na actividade).
drop policy if exists "profiles: read own" on public.admin_profiles;
drop policy if exists "profiles: admins read" on public.admin_profiles;
create policy "profiles: admins read" on public.admin_profiles
  for select to authenticated using (user_id = auth.uid() or public.is_memory_admin());

notify pgrst, 'reload schema';
