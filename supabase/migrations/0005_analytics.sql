-- ============================================================
-- SAVE YOUR MEMORY — analytics das galerias públicas
-- ------------------------------------------------------------
-- • Uma tabela unificada `memory_analytics_events` regista:
--     gallery_view · photo_view · album_view · qr_scan · download
-- • Sem dados pessoais: nada de IP, user-agent, email ou nome.
--   Cada visitante é um UUID aleatório gerado no browser
--   (`visitor_id`, renovado periodicamente) — serve apenas para
--   contar visitantes únicos.
-- • O público NÃO escreve na tabela directamente: usa a função
--   `track_memory_event`, que valida o evento/fotografia
--   (só conteúdo publicado), fixa a data no servidor, ignora
--   repetições (visualizações) e limita abusos.
-- • Ninguém altera nem apaga registos pela API. Só
--   administradores lêem (RLS) e consultam as funções agregadas.
-- • Visitas de administradores autenticados não são contadas.
-- Não altera dados existentes. Pode ser executado mais do que uma vez.
-- ============================================================

-- ------------------------------------------------------------ tipos
do $$
begin
  if not exists (select 1 from pg_type where typname = 'analytics_event_type' and typnamespace = 'public'::regnamespace) then
    create type public.analytics_event_type as enum ('gallery_view', 'photo_view', 'album_view', 'qr_scan', 'download');
  end if;
  if not exists (select 1 from pg_type where typname = 'download_kind' and typnamespace = 'public'::regnamespace) then
    -- single: uma fotografia · multiple: selecção · album: ZIP de um álbum · all: ZIP de todas
    create type public.download_kind as enum ('single', 'multiple', 'album', 'all');
  end if;
end;
$$;

-- ------------------------------------------------------------ tabela
create table if not exists public.memory_analytics_events (
  id            bigint generated always as identity primary key,
  event_type    public.analytics_event_type not null,
  event_id      uuid not null references public.memory_events (id) on delete cascade,
  album_id      uuid references public.memory_albums (id) on delete set null,
  photo_id      uuid references public.memory_photos (id) on delete set null,
  download_kind public.download_kind,
  item_count    integer check (item_count between 1 and 10000),
  visitor_id    uuid not null,
  created_at    timestamptz not null default now(),
  constraint memory_analytics_download_kind check ((event_type = 'download') = (download_kind is not null))
);

create index if not exists memory_analytics_created_idx on public.memory_analytics_events (created_at desc);
create index if not exists memory_analytics_event_created_idx on public.memory_analytics_events (event_id, created_at desc);
create index if not exists memory_analytics_photo_idx on public.memory_analytics_events (photo_id, created_at) where photo_id is not null;
create index if not exists memory_analytics_visitor_idx on public.memory_analytics_events (visitor_id, created_at desc);

-- ------------------------------------------------------------ RLS
alter table public.memory_analytics_events enable row level security;

-- Defesa em profundidade: a API nunca escreve directamente.
revoke insert, update, delete, truncate on public.memory_analytics_events from anon, authenticated;

drop policy if exists "analytics: admins read" on public.memory_analytics_events;
create policy "analytics: admins read" on public.memory_analytics_events
  for select to authenticated using ((select public.is_memory_admin()));

-- ------------------------------------------------------------ tracking (público)
create or replace function public.track_memory_event(
  p_type          public.analytics_event_type,
  p_public_id     text,
  p_visitor_id    uuid,
  p_photo_id      uuid default null,
  p_album_id      uuid default null,
  p_download_kind public.download_kind default null,
  p_item_count    integer default null
) returns void
language plpgsql volatile security definer set search_path = '' as $$
declare
  v_event uuid;
  v_album uuid;
  v_photo uuid;
  v_count integer;
begin
  if p_type is null or p_public_id is null or p_visitor_id is null then return; end if;

  -- Administradores autenticados não inflacionam as estatísticas.
  if auth.uid() is not null and public.is_memory_admin() then return; end if;

  -- Só eventos publicados.
  select e.id into v_event from public.memory_events e
   where e.public_id = p_public_id and e.status = 'published';
  if v_event is null then return; end if;

  -- Fotografia/álbum têm de pertencer ao evento e estar publicados.
  if p_photo_id is not null then
    select p.id, p.album_id into v_photo, v_album
      from public.memory_photos p join public.memory_albums a on a.id = p.album_id
     where p.id = p_photo_id and a.event_id = v_event and p.status = 'published' and a.status = 'published';
    if v_photo is null then return; end if;
  elsif p_album_id is not null then
    select a.id into v_album from public.memory_albums a
     where a.id = p_album_id and a.event_id = v_event and a.status = 'published';
    if v_album is null then return; end if;
  end if;

  if p_type = 'photo_view' and v_photo is null then return; end if;
  if p_type = 'album_view' and v_album is null then return; end if;

  if p_type = 'download' then
    if p_download_kind is null then return; end if;
    if p_download_kind = 'single' then
      if v_photo is null then return; end if;
      v_count := 1;
    else
      v_count := least(greatest(coalesce(p_item_count, 1), 1), 10000);
    end if;
    -- Respeita as definições de download da galeria.
    if not exists (
      select 1 from public.memory_settings s
       where s.id and (case when p_download_kind = 'single' then s.allow_downloads else s.allow_zip_downloads end)
    ) then return; end if;
  end if;

  -- Limite anti-abuso por visitante.
  if (select count(*) from public.memory_analytics_events a
       where a.visitor_id = p_visitor_id and a.created_at > now() - interval '10 minutes') >= 300 then
    return;
  end if;

  -- Visualizações repetidas do mesmo visitante em 30 minutos contam uma vez.
  -- Downloads contam sempre.
  if p_type <> 'download' and exists (
    select 1 from public.memory_analytics_events a
     where a.visitor_id = p_visitor_id
       and a.event_id = v_event
       and a.event_type = p_type
       and a.photo_id is not distinct from v_photo
       and a.album_id is not distinct from v_album
       and a.created_at > now() - interval '30 minutes'
  ) then
    return;
  end if;

  insert into public.memory_analytics_events (event_type, event_id, album_id, photo_id, download_kind, item_count, visitor_id)
  values (
    p_type, v_event, v_album, v_photo,
    case when p_type = 'download' then p_download_kind end,
    v_count, p_visitor_id
  );
end;
$$;

revoke all on function public.track_memory_event(public.analytics_event_type, text, uuid, uuid, uuid, public.download_kind, integer) from public;
grant execute on function public.track_memory_event(public.analytics_event_type, text, uuid, uuid, uuid, public.download_kind, integer) to anon, authenticated;

-- ------------------------------------------------------------ consultas agregadas (admin)
-- Todas verificam o role no servidor e só lêem a tabela de analytics
-- (com índices por data/evento) — nunca percorrem todas as fotografias.

create or replace function public.memory_analytics_summary(
  p_from timestamptz, p_to timestamptz, p_event_id uuid default null
) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare
  result jsonb;
begin
  if not public.is_memory_admin() then
    raise exception 'Sem permissão para consultar analytics.' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'gallery_views',    count(*) filter (where a.event_type = 'gallery_view'),
    'photo_views',      count(*) filter (where a.event_type = 'photo_view'),
    'album_views',      count(*) filter (where a.event_type = 'album_view'),
    'qr_scans',         count(*) filter (where a.event_type = 'qr_scan'),
    'downloads',        count(*) filter (where a.event_type = 'download'),
    'downloaded_files', coalesce(sum(a.item_count) filter (where a.event_type = 'download'), 0),
    'downloads_single',   count(*) filter (where a.download_kind = 'single'),
    'downloads_multiple', count(*) filter (where a.download_kind = 'multiple'),
    'downloads_album',    count(*) filter (where a.download_kind = 'album'),
    'downloads_all',      count(*) filter (where a.download_kind = 'all'),
    'unique_visitors',  count(distinct a.visitor_id),
    'active_events',    count(distinct a.event_id) filter (where a.event_type in ('gallery_view', 'qr_scan'))
  ) into result
  from public.memory_analytics_events a
  where a.created_at >= p_from and a.created_at < p_to
    and (p_event_id is null or a.event_id = p_event_id);

  return result;
end;
$$;

create or replace function public.memory_analytics_timeseries(
  p_from timestamptz, p_to timestamptz, p_bucket text default 'day', p_tz text default 'UTC', p_event_id uuid default null
) returns table (bucket timestamp, gallery_views bigint, photo_views bigint, downloads bigint, qr_scans bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_memory_admin() then
    raise exception 'Sem permissão para consultar analytics.' using errcode = '42501';
  end if;
  if p_bucket not in ('hour', 'day', 'week') then
    raise exception 'Intervalo inválido.' using errcode = '22023';
  end if;
  if p_to <= p_from or p_to - p_from > interval '400 days' then
    raise exception 'Período inválido.' using errcode = '22023';
  end if;

  return query
  with series as (
    select generate_series(
      date_trunc(p_bucket, p_from at time zone p_tz),
      date_trunc(p_bucket, (p_to - interval '1 microsecond') at time zone p_tz),
      ('1 ' || p_bucket)::interval
    ) as b
  ),
  agg as (
    select date_trunc(p_bucket, a.created_at at time zone p_tz) as b,
           count(*) filter (where a.event_type = 'gallery_view') as gv,
           count(*) filter (where a.event_type = 'photo_view')   as pv,
           count(*) filter (where a.event_type = 'download')     as dl,
           count(*) filter (where a.event_type = 'qr_scan')      as qr
      from public.memory_analytics_events a
     where a.created_at >= p_from and a.created_at < p_to
       and (p_event_id is null or a.event_id = p_event_id)
     group by 1
  )
  select s.b, coalesce(agg.gv, 0), coalesce(agg.pv, 0), coalesce(agg.dl, 0), coalesce(agg.qr, 0)
    from series s left join agg on agg.b = s.b
   order by s.b;
end;
$$;

create or replace function public.memory_analytics_top_events(
  p_from timestamptz, p_to timestamptz, p_metric text default 'gallery_views', p_limit integer default 5
) returns table (
  event_id uuid, public_id text, title text, status public.event_status,
  gallery_views bigint, photo_views bigint, downloads bigint, qr_scans bigint
)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_memory_admin() then
    raise exception 'Sem permissão para consultar analytics.' using errcode = '42501';
  end if;

  return query
  select e.id, e.public_id, e.title, e.status, x.gv, x.pv, x.dl, x.qr
    from (
      select a.event_id as eid,
             count(*) filter (where a.event_type = 'gallery_view') as gv,
             count(*) filter (where a.event_type = 'photo_view')   as pv,
             count(*) filter (where a.event_type = 'download')     as dl,
             count(*) filter (where a.event_type = 'qr_scan')      as qr
        from public.memory_analytics_events a
       where a.created_at >= p_from and a.created_at < p_to
       group by a.event_id
    ) x
    join public.memory_events e on e.id = x.eid
   where (case p_metric when 'downloads' then x.dl when 'photo_views' then x.pv when 'qr_scans' then x.qr else x.gv end) > 0
   order by (case p_metric when 'downloads' then x.dl when 'photo_views' then x.pv when 'qr_scans' then x.qr else x.gv end) desc,
            x.gv desc, e.title
   limit least(greatest(coalesce(p_limit, 5), 1), 50);
end;
$$;

create or replace function public.memory_analytics_top_photos(
  p_from timestamptz, p_to timestamptz, p_event_id uuid default null, p_limit integer default 8
) returns table (
  photo_id uuid, storage_path text, file_name text, media_type public.media_type,
  event_id uuid, event_title text, views bigint, downloads bigint
)
language plpgsql stable security definer set search_path = '' as $$
begin
  if not public.is_memory_admin() then
    raise exception 'Sem permissão para consultar analytics.' using errcode = '42501';
  end if;

  return query
  select p.id, p.storage_path, p.file_name, p.media_type, e.id, e.title, x.v, x.d
    from (
      select a.photo_id as pid,
             count(*) filter (where a.event_type = 'photo_view') as v,
             count(*) filter (where a.event_type = 'download')   as d
        from public.memory_analytics_events a
       where a.photo_id is not null
         and a.created_at >= p_from and a.created_at < p_to
         and (p_event_id is null or a.event_id = p_event_id)
       group by a.photo_id
    ) x
    join public.memory_photos p on p.id = x.pid
    join public.memory_albums al on al.id = p.album_id
    join public.memory_events e on e.id = al.event_id
   order by x.v desc, x.d desc
   limit least(greatest(coalesce(p_limit, 8), 1), 50);
end;
$$;

revoke all on function public.memory_analytics_summary(timestamptz, timestamptz, uuid) from public, anon;
revoke all on function public.memory_analytics_timeseries(timestamptz, timestamptz, text, text, uuid) from public, anon;
revoke all on function public.memory_analytics_top_events(timestamptz, timestamptz, text, integer) from public, anon;
revoke all on function public.memory_analytics_top_photos(timestamptz, timestamptz, uuid, integer) from public, anon;
grant execute on function public.memory_analytics_summary(timestamptz, timestamptz, uuid) to authenticated;
grant execute on function public.memory_analytics_timeseries(timestamptz, timestamptz, text, text, uuid) to authenticated;
grant execute on function public.memory_analytics_top_events(timestamptz, timestamptz, text, integer) to authenticated;
grant execute on function public.memory_analytics_top_photos(timestamptz, timestamptz, uuid, integer) to authenticated;

notify pgrst, 'reload schema';
