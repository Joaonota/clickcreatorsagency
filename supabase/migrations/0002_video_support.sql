-- ============================================================
-- SAVE YOUR MEMORY — suporte a vídeo
-- ------------------------------------------------------------
-- • memory_photos passa a guardar fotografias E vídeos.
-- • O bucket aceita MP4/MOV/WebM e ficheiros até 50 MB
--   (limite por ficheiro do plano gratuito do Supabase).
-- Pode ser executado mais do que uma vez.
-- ============================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'media_type' and typnamespace = 'public'::regnamespace) then
    create type public.media_type as enum ('image', 'video');
  end if;
end;
$$;

alter table public.memory_photos
  add column if not exists media_type public.media_type not null default 'image',
  add column if not exists mime_type  text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'memory-photos', 'memory-photos', false, 52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif',
        'video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do update set
  public             = false,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Actualiza a cache de esquema da API (PostgREST).
notify pgrst, 'reload schema';
