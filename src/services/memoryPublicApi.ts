/* ============================================================
   SAVE YOUR MEMORY — API pública (Supabase, só leitura)
   ------------------------------------------------------------
   Usa a chave pública: as policies RLS e Storage garantem que
   só chegam ao browser eventos, álbuns e media PUBLICADOS.
   O cliente Supabase é carregado em lazy (fora do bundle
   principal do site).
   ============================================================ */

import type {
  MediaType,
  MemoryAlbum,
  MemoryEvent,
  MemoryEventDetail,
  MemoryMedia,
  MemorySettings,
} from "../data/memory";

const SIGNED_URL_TTL = 60 * 60 * 2; // 2 horas

interface EventRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  cover_path: string | null;
  memory_albums: Array<{ id: string; memory_photos: Array<{ count: number }> }>;
}

const EVENT_SELECT =
  "id, slug, title, description, event_date, location, cover_path, memory_albums(id, memory_photos(count))";

export class MemoryUnavailableError extends Error {
  constructor() {
    super("A galeria não está disponível neste momento.");
    this.name = "MemoryUnavailableError";
  }
}

async function getClient() {
  const { supabase, MEMORY_BUCKET } = await import("../lib/supabase");
  if (!supabase) throw new MemoryUnavailableError();
  return { client: supabase, bucket: MEMORY_BUCKET };
}

async function signPaths(paths: Array<string | null>): Promise<Map<string, string>> {
  const { client, bucket } = await getClient();
  const unique = [...new Set(paths.filter((path): path is string => Boolean(path)))];
  const map = new Map<string, string>();
  for (let index = 0; index < unique.length; index += 100) {
    const { data } = await client.storage.from(bucket).createSignedUrls(unique.slice(index, index + 100), SIGNED_URL_TTL);
    data?.forEach((item) => {
      if (item.path && item.signedUrl) map.set(item.path, item.signedUrl);
    });
  }
  return map;
}

function toEvents(rows: EventRow[], covers: Map<string, string>): MemoryEvent[] {
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: row.event_date,
    location: row.location,
    cover: row.cover_path ? covers.get(row.cover_path) ?? "" : "",
    coverAlt: row.title,
    albumCount: row.memory_albums.length,
    mediaCount: row.memory_albums.reduce((sum, album) => sum + (album.memory_photos[0]?.count ?? 0), 0),
  }));
}

export const memoryPublicApi = {
  /** Eventos publicados (mais recentes primeiro), com contagens de media publicada. */
  async getEvents(): Promise<MemoryEvent[]> {
    const { client } = await getClient();
    const { data, error } = await client
      .from("memory_events")
      .select(EVENT_SELECT)
      .eq("status", "published")
      .order("event_date", { ascending: false });
    if (error) throw new MemoryUnavailableError();
    const rows = (data ?? []) as EventRow[];
    return toEvents(rows, await signPaths(rows.map((row) => row.cover_path)));
  },

  /** Evento publicado por slug, com álbuns e media publicados. null = não existe/não publicado. */
  async getEventDetail(slug: string): Promise<MemoryEventDetail | null> {
    const { client } = await getClient();
    const { data, error } = await client
      .from("memory_events")
      .select(EVENT_SELECT)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new MemoryUnavailableError();
    if (!data) return null;
    const row = data as EventRow;

    const albumsResult = await client
      .from("memory_albums")
      .select("id, title, description, position")
      .eq("event_id", row.id)
      .eq("status", "published")
      .order("position");
    if (albumsResult.error) throw new MemoryUnavailableError();
    const albums = (albumsResult.data ?? []) as MemoryAlbum[];

    let mediaRows: Array<{ id: string; album_id: string; storage_path: string; file_name: string; media_type: MediaType | null }> = [];
    if (albums.length > 0) {
      const mediaResult = await client
        .from("memory_photos")
        .select("id, album_id, storage_path, file_name, media_type")
        .in("album_id", albums.map((album) => album.id))
        .eq("status", "published")
        .order("created_at");
      if (mediaResult.error) throw new MemoryUnavailableError();
      mediaRows = mediaResult.data ?? [];
    }

    const urls = await signPaths([row.cover_path, ...mediaRows.map((media) => media.storage_path)]);
    const albumOrder = new Map(albums.map((album, index) => [album.id, index]));
    const media: MemoryMedia[] = mediaRows
      .sort((a, b) => (albumOrder.get(a.album_id) ?? 0) - (albumOrder.get(b.album_id) ?? 0))
      .map<MemoryMedia>((item, index) => ({
        id: item.id,
        albumId: item.album_id,
        type: item.media_type === "video" ? "video" : "image",
        src: urls.get(item.storage_path) ?? "",
        storagePath: item.storage_path,
        fileName: item.file_name,
        order: index,
      }))
      .filter((item) => item.src);

    return { event: toEvents([row], urls)[0], albums, media };
  },

  /** Preferências públicas de download. */
  async getSettings(): Promise<MemorySettings> {
    const { client } = await getClient();
    const { data } = await client
      .from("memory_settings")
      .select("allow_downloads, allow_zip_downloads")
      .eq("id", true)
      .maybeSingle();
    return {
      allowDownloads: Boolean(data?.allow_downloads),
      allowZipDownloads: Boolean(data?.allow_zip_downloads),
    };
  },

  /** URL assinado de curta duração que força a descarga com o nome original. */
  async getDownloadUrl(media: MemoryMedia): Promise<string | null> {
    const { client, bucket } = await getClient();
    const { data } = await client.storage.from(bucket).createSignedUrl(media.storagePath, 300, { download: media.fileName });
    return data?.signedUrl ?? null;
  },
};
