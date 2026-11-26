/* ============================================================
   MEMORY CONTROL — analytics (Supabase)
   ------------------------------------------------------------
   Lê os dados reais registados pelas galerias públicas através
   das funções SQL agregadas de 0005_analytics.sql. As funções
   verificam o role no servidor; a tabela tem RLS (só admins
   lêem). Nada é calculado sobre todas as fotografias no browser.
   ============================================================ */

import { supabase, MEMORY_BUCKET } from "../../lib/supabase";
import { BackendNotConfiguredError, fromSupabaseError } from "./errors";
import type {
  AnalyticsMetric,
  AnalyticsPoint,
  AnalyticsQuery,
  AnalyticsSnapshot,
  AnalyticsEventType,
  AnalyticsRange,
  AnalyticsSummary,
  DownloadKind,
  EventOption,
  EventStatus,
  MediaType,
  TopEvent,
  TopPhoto,
  VisitorActivity,
} from "./types";

type Num = number | string | null | undefined;
const n = (value: Num): number => Number(value ?? 0) || 0;

const timezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
};

function client() {
  if (!supabase) throw new BackendNotConfiguredError();
  return supabase;
}

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<T> {
  const { data, error } = await client().rpc(fn, args);
  if (error) throw fromSupabaseError(error);
  return data as T;
}

const values = (row: { gallery_views: Num; photo_views: Num; downloads: Num; qr_scans: Num }): Record<AnalyticsMetric, number> => ({
  gallery_views: n(row.gallery_views),
  photo_views: n(row.photo_views),
  downloads: n(row.downloads),
  qr_scans: n(row.qr_scans),
});

async function getSummary(query: AnalyticsQuery): Promise<AnalyticsSummary> {
  const raw = await rpc<Record<string, Num> | null>("memory_analytics_summary", {
    p_from: query.from,
    p_to: query.to,
    p_event_id: query.eventId,
  });
  const row = raw ?? {};
  return {
    galleryViews: n(row.gallery_views),
    photoViews: n(row.photo_views),
    albumViews: n(row.album_views),
    qrScans: n(row.qr_scans),
    downloads: n(row.downloads),
    downloadedFiles: n(row.downloaded_files),
    downloadsByKind: {
      single: n(row.downloads_single),
      multiple: n(row.downloads_multiple),
      album: n(row.downloads_album),
      all: n(row.downloads_all),
    },
    uniqueVisitors: n(row.unique_visitors),
    activeEvents: n(row.active_events),
  };
}

async function getSeries(query: AnalyticsQuery): Promise<AnalyticsPoint[]> {
  const rows = await rpc<Array<{ bucket: string; gallery_views: Num; photo_views: Num; downloads: Num; qr_scans: Num }>>(
    "memory_analytics_timeseries",
    { p_from: query.from, p_to: query.to, p_bucket: query.bucket, p_tz: timezone(), p_event_id: query.eventId }
  );
  return (rows ?? []).map((row) => ({ bucket: row.bucket, values: values(row) }));
}

async function getTopPhotos(query: AnalyticsQuery, limit = 8): Promise<TopPhoto[]> {
  const rows = await rpc<
    Array<{
      photo_id: string;
      storage_path: string;
      file_name: string;
      media_type: MediaType | null;
      event_id: string;
      event_title: string;
      views: Num;
      downloads: Num;
    }>
  >("memory_analytics_top_photos", { p_from: query.from, p_to: query.to, p_event_id: query.eventId, p_limit: limit });
  const list = rows ?? [];
  // Miniaturas: URLs assinados só para as poucas fotografias do ranking.
  const images = list.filter((row) => row.media_type !== "video").map((row) => row.storage_path);
  const urls = new Map<string, string>();
  if (images.length > 0) {
    const { data } = await client().storage.from(MEMORY_BUCKET).createSignedUrls(images, 60 * 60);
    data?.forEach((item) => {
      if (item.path && item.signedUrl) urls.set(item.path, item.signedUrl);
    });
  }
  return list.map((row) => ({
    photoId: row.photo_id,
    fileName: row.file_name,
    mediaType: row.media_type === "video" ? "video" : "image",
    previewUrl: urls.get(row.storage_path) ?? null,
    eventId: row.event_id,
    eventTitle: row.event_title,
    views: n(row.views),
    downloads: n(row.downloads),
  }));
}

export const analyticsRepository = {
  get configured() {
    return Boolean(supabase);
  },

  /** Totais, série temporal e fotografias mais populares de um período. */
  async getSnapshot(query: AnalyticsQuery): Promise<AnalyticsSnapshot> {
    const [summary, series, topPhotos] = await Promise.all([getSummary(query), getSeries(query), getTopPhotos(query)]);
    return { summary, series, topPhotos };
  },

  /** Ranking de eventos por métrica no período. */
  async getTopEvents(range: AnalyticsRange, metric: AnalyticsMetric, limit = 5): Promise<TopEvent[]> {
    const rows = await rpc<
      Array<{
        event_id: string;
        public_id: string;
        title: string;
        status: EventStatus;
        gallery_views: Num;
        photo_views: Num;
        downloads: Num;
        qr_scans: Num;
      }>
    >("memory_analytics_top_events", { p_from: range.from, p_to: range.to, p_metric: metric, p_limit: limit });
    return (rows ?? []).map((row) => ({
      eventId: row.event_id,
      publicId: row.public_id,
      title: row.title,
      status: row.status,
      values: values(row),
    }));
  },

  /** Últimos registos dos visitantes (RLS: só administradores lêem). */
  async getRecentActivity(eventId: string | null, limit = 12): Promise<VisitorActivity[]> {
    let request = client()
      .from("memory_analytics_events")
      .select("id, event_type, download_kind, item_count, event_id, created_at, memory_events(title), memory_photos(file_name)")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (eventId) request = request.eq("event_id", eventId);
    const { data, error } = await request;
    if (error) throw fromSupabaseError(error);
    type Row = {
      id: number;
      event_type: AnalyticsEventType;
      download_kind: DownloadKind | null;
      item_count: number | null;
      event_id: string;
      created_at: string;
      memory_events: { title: string } | { title: string }[] | null;
      memory_photos: { file_name: string } | { file_name: string }[] | null;
    };
    const one = <T,>(value: T | T[] | null): T | null => (Array.isArray(value) ? value[0] ?? null : value);
    return ((data ?? []) as unknown as Row[]).map((row) => ({
      id: String(row.id),
      type: row.event_type,
      downloadKind: row.download_kind,
      itemCount: row.item_count,
      eventId: row.event_id,
      eventTitle: one(row.memory_events)?.title ?? "Evento removido",
      fileName: one(row.memory_photos)?.file_name ?? null,
      createdAt: row.created_at,
    }));
  },

  /** Lista leve de eventos para o filtro (sem capas nem contagens). */
  async listEventOptions(): Promise<EventOption[]> {
    const { data, error } = await client().from("memory_events").select("id, title").order("event_date", { ascending: false });
    if (error) throw fromSupabaseError(error);
    return (data ?? []) as EventOption[];
  },
};
