-- ============================================================
-- SAVE YOUR MEMORY — identificador público por evento
-- ------------------------------------------------------------
-- • Cada evento recebe um `public_id` aleatório (12 caracteres
--   [a-z0-9]) usado na URL pública /memoria/e/{public_id} e no
--   QR Code. Não revela o UUID interno nem dados administrativos.
-- • O `public_id` é gerado pela base de dados e NUNCA muda, mesmo
--   que o evento seja editado, despublicado ou receba novas
--   fotografias — o QR Code impresso continua sempre válido.
-- • A visibilidade continua a depender do estado de publicação
--   (`status`) e das policies RLS já existentes: eventos em
--   rascunho/arquivados não são acessíveis publicamente.
-- Pode ser executado mais do que uma vez.
-- ============================================================

create or replace function public.generate_public_id() returns text
language sql volatile set search_path = '' as $$
  select substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
$$;

alter table public.memory_events add column if not exists public_id text;

update public.memory_events set public_id = public.generate_public_id() where public_id is null;

alter table public.memory_events
  alter column public_id set default public.generate_public_id(),
  alter column public_id set not null;

create unique index if not exists memory_events_public_id_key on public.memory_events (public_id);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'memory_events_public_id_format') then
    alter table public.memory_events
      add constraint memory_events_public_id_format check (public_id ~ '^[a-z0-9]{12}$');
  end if;
end;
$$;

-- O public_id é imutável: qualquer tentativa de o alterar é ignorada.
create or replace function public.keep_event_public_id() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.public_id := old.public_id;
  return new;
end;
$$;

drop trigger if exists memory_events_keep_public_id on public.memory_events;
create trigger memory_events_keep_public_id
  before update of public_id on public.memory_events
  for each row execute function public.keep_event_public_id();

notify pgrst, 'reload schema';
