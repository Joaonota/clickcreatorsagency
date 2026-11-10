-- ============================================================
-- SAVE YOUR MEMORY — esquema inicial
-- ------------------------------------------------------------
-- Base de dados, roles e Row Level Security para a área privada
-- /memory-control. Rever antes de aplicar no projecto Supabase.
--
-- Princípios:
--   • O role de administrador vive em `admin_profiles` e é lido no
--     servidor — o frontend nunca decide sozinho quem é admin.
--   • O público só lê evento + álbum + fotografia PUBLICADOS.
--   • Sem registo público: desactivar "Allow new users to sign up"
--     em Auth → Providers e criar admins por convite.
--   • A service_role key nunca sai do servidor.
-- ============================================================

-- ------------------------------------------------------------ tipos
create type public.admin_role   as enum ('super_admin', 'memory_admin');
create type public.event_status as enum ('draft', 'published', 'archived');
create type public.album_status as enum ('published', 'hidden');
create type public.photo_status as enum ('pending_review', 'approved', 'published', 'hidden');

-- ------------------------------------------------------------ tabelas
create table public.admin_profiles (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role         public.admin_role not null,
  created_at   timestamptz not null default now()
);

create table public.memory_events (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title       text not null check (char_length(title) between 1 and 160),
  description text not null default '',
  event_date  date not null,
  location    text not null default '',
  cover_path  text,
  status      public.event_status not null default 'draft',
  created_by  uuid default auth.uid() references auth.users (id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.memory_albums (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references public.memory_events (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 120),
  description text not null default '',
  cover_path  text,
  position    integer not null default 0,
  status      public.album_status not null default 'hidden',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index memory_albums_event_idx on public.memory_albums (event_id, position);

create table public.memory_photos (
  id           uuid primary key default gen_random_uuid(),
  album_id     uuid not null references public.memory_albums (id) on delete cascade,
  storage_path text not null unique,
  file_name    text not null,
  size_bytes   bigint not null check (size_bytes > 0),
  width        integer,
  height       integer,
  status       public.photo_status not null default 'pending_review',
  uploaded_by  uuid default auth.uid() references auth.users (id) on delete set null,
  created_at   timestamptz not null default now()
);
create index memory_photos_album_idx on public.memory_photos (album_id, status);

create table public.memory_settings (
  id                     boolean primary key default true check (id),
  allow_downloads        boolean not null default true,
  allow_zip_downloads    boolean not null default true,
  require_photo_approval boolean not null default true,
  updated_at             timestamptz not null default now()
);
insert into public.memory_settings (id) values (true);

create table public.memory_activity (
  id         bigint generated always as identity primary key,
  kind       text not null,
  summary    text not null,
  actor_id   uuid default auth.uid() references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

-- Contagem de downloads: inserida por uma Edge Function (service role),
-- nunca directamente pelo browser.
create table public.memory_downloads (
  id         bigint generated always as identity primary key,
  photo_id   uuid references public.memory_photos (id) on delete set null,
  album_id   uuid references public.memory_albums (id) on delete set null,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------ updated_at
create function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger memory_events_touch   before update on public.memory_events   for each row execute function public.touch_updated_at();
create trigger memory_albums_touch   before update on public.memory_albums   for each row execute function public.touch_updated_at();
create trigger memory_settings_touch before update on public.memory_settings for each row execute function public.touch_updated_at();

-- ------------------------------------------------------------ autorização
-- security definer + search_path vazio: evita recursão de RLS e hijacking.
create function public.is_memory_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_profiles where user_id = auth.uid());
$$;

create function public.is_super_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.admin_profiles where user_id = auth.uid() and role = 'super_admin'
  );
$$;

-- Uma fotografia é pública apenas se evento, álbum e fotografia estiverem publicados.
create function public.is_public_photo_path(path text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1
    from public.memory_photos p
    join public.memory_albums a on a.id = p.album_id
    join public.memory_events e on e.id = a.event_id
    where p.storage_path = path
      and p.status = 'published' and a.status = 'published' and e.status = 'published'
  )
  or exists (select 1 from public.memory_events e where e.cover_path = path and e.status = 'published')
  or exists (
    select 1 from public.memory_albums a join public.memory_events e on e.id = a.event_id
    where a.cover_path = path and a.status = 'published' and e.status = 'published'
  );
$$;

-- ------------------------------------------------------------ RLS
alter table public.admin_profiles   enable row level security;
alter table public.memory_events    enable row level security;
alter table public.memory_albums    enable row level security;
alter table public.memory_photos    enable row level security;
alter table public.memory_settings  enable row level security;
alter table public.memory_activity  enable row level security;
alter table public.memory_downloads enable row level security;

-- admin_profiles: cada um lê o seu perfil; só super_admin gere a equipa.
create policy "profiles: read own" on public.admin_profiles
  for select to authenticated using (user_id = auth.uid() or public.is_super_admin());
create policy "profiles: super admin manages" on public.admin_profiles
  for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- Eventos
create policy "events: public reads published" on public.memory_events
  for select to anon, authenticated using (status = 'published');
create policy "events: admins manage" on public.memory_events
  for all to authenticated using (public.is_memory_admin()) with check (public.is_memory_admin());

-- Álbuns
create policy "albums: public reads published" on public.memory_albums
  for select to anon, authenticated using (
    status = 'published'
    and exists (select 1 from public.memory_events e where e.id = event_id and e.status = 'published')
  );
create policy "albums: admins manage" on public.memory_albums
  for all to authenticated using (public.is_memory_admin()) with check (public.is_memory_admin());

-- Fotografias
create policy "photos: public reads published" on public.memory_photos
  for select to anon, authenticated using (
    status = 'published'
    and exists (
      select 1 from public.memory_albums a join public.memory_events e on e.id = a.event_id
      where a.id = album_id and a.status = 'published' and e.status = 'published'
    )
  );
create policy "photos: admins manage" on public.memory_photos
  for all to authenticated using (public.is_memory_admin()) with check (public.is_memory_admin());

-- Definições: leitura pública (flags de download), alteração só super_admin.
create policy "settings: public read" on public.memory_settings
  for select to anon, authenticated using (true);
create policy "settings: super admin updates" on public.memory_settings
  for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- Actividade e downloads: só administradores lêem.
create policy "activity: admins read" on public.memory_activity
  for select to authenticated using (public.is_memory_admin());
create policy "activity: admins insert" on public.memory_activity
  for insert to authenticated with check (public.is_memory_admin() and actor_id = auth.uid());
create policy "downloads: admins read" on public.memory_downloads
  for select to authenticated using (public.is_memory_admin());

-- ------------------------------------------------------------ Storage
-- Bucket PRIVADO: o acesso público passa sempre pela policy abaixo.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('memory-photos', 'memory-photos', false, 26214400,
        array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']);

create policy "storage: public reads published files" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'memory-photos' and public.is_public_photo_path(name));

create policy "storage: admins read all" on storage.objects
  for select to authenticated
  using (bucket_id = 'memory-photos' and public.is_memory_admin());
create policy "storage: admins upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'memory-photos' and public.is_memory_admin());
create policy "storage: admins update" on storage.objects
  for update to authenticated
  using (bucket_id = 'memory-photos' and public.is_memory_admin());
create policy "storage: admins delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'memory-photos' and public.is_memory_admin());
