/* ============================================================
   MEMORY CONTROL — repositório Supabase (Database + Storage)
   ------------------------------------------------------------
   Todas as operações correm com a sessão do administrador; a
   autorização é verificada pelas policies RLS e Storage.
   Os ficheiros vivem no bucket PRIVADO `memory-photos` e são
   mostrados no painel através de URLs assinados temporários.
   ============================================================ */

import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseEnv } from "../config/env";
import { MEMORY_BUCKET } from "../lib/supabase";
import { PermissionDeniedError, UserFacingError, fromSupabaseError } from "./errors";
import type { MemoryAdminRepository } from "./repository";
import type {
  ActivityItem,
  ActivityKind,
  AdminAlbum,
  AdminEvent,
  AdminPhoto,
  AlbumInput,
  AlbumStatus,
  EventInput,
  EventStatus,
  GallerySettings,
  PhotoStatus,
} from "./types";

const SIGNED_URL_TTL = 60 * 60; // 1 hora

/* ------------------------------------------------------------ linhas da BD */
interface EventRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  cover_path: string | null;
  status: EventStatus;
  created_at: string;
  updated_at: string;
  memory_albums?: Array<{ id: string; memory_photos: Array<{ count: number }> }>;
}

interface AlbumRow {
  id: string;
  event_id: string;
  title: string;
  description: string;
  cover_path: string | null;
  position: number;
  status: AlbumStatus;
  created_at: string;
  updated_at: string;
  memory_photos?: Array<{ count: number }>;
}

interface PhotoRow {
  id: string;
  album_id: string;
  storage_path: string;
  file_name: string;
  size_bytes: number;
  width: number | null;
  height: number | null;
  status: PhotoStatus;
  created_at: string;
  memory_albums: { event_id: string } | null;
}

const EVENT_SELECT = "*, memory_albums(id, memory_photos(count))";

/* ------------------------------------------------------------ utilitários */
function unwrap<T>(result: { data: T | null; error: { code?: string; message?: string } | null }): T {
  if (result.error) throw fromSupabaseError(result.error);
  if (result.data === null) throw new UserFacingError("Registo não encontrado.");
  return result.data;
}

const extensionOf = (file: File) => {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  return file.type.split("/")[1] ?? "jpg";
};

async function readDimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return { width: null, height: null }; // ex.: HEIC em browsers sem suporte
  }
}

const chunk = <T,>(items: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));

export function createSupabaseRepository(client: SupabaseClient): MemoryAdminRepository {
  const storage = () => client.storage.from(MEMORY_BUCKET);

  async function currentUserId(): Promise<string> {
    const { data } = await client.auth.getSession();
    const id = data.session?.user.id;
    if (!id) throw new PermissionDeniedError();
    return id;
  }

  /** URLs assinados (bucket privado) para uma lista de caminhos. */
  async function signPaths(paths: Array<string | null>): Promise<Map<string, string>> {
    const unique = [...new Set(paths.filter((path): path is string => Boolean(path)))];
    const map = new Map<string, string>();
    for (const group of chunk(unique, 100)) {
      const { data, error } = await storage().createSignedUrls(group, SIGNED_URL_TTL);
      if (error) throw fromSupabaseError(error);
      data?.forEach((item) => {
        if (item.path && item.signedUrl) map.set(item.path, item.signedUrl);
      });
    }
    return map;
  }

  async function removeFiles(paths: Array<string | null | undefined>) {
    const valid = paths.filter((path): path is string => Boolean(path));
    // Melhor esforço: a linha da BD já foi eliminada; um ficheiro órfão não é exposto (bucket privado).
    for (const group of chunk(valid, 100)) await storage().remove(group);
  }

  async function uploadCover(kind: "events" | "albums", id: string, file: File): Promise<string> {
    const path = `covers/${kind}/${id}/${crypto.randomUUID()}.${extensionOf(file)}`;
    const { error } = await storage().upload(path, file, { contentType: file.type, upsert: false });
    if (error) throw fromSupabaseError(error);
    return path;
  }

  /** Regista actividade (não bloqueia a operação principal se falhar). */
  async function log(kind: ActivityKind, summary: string) {
    try {
      await client.from("memory_activity").insert({ kind, summary, actor_id: await currentUserId() });
    } catch {
      /* actividade é informativa */
    }
  }

  async function mapEvents(rows: EventRow[]): Promise<AdminEvent[]> {
    const urls = await signPaths(rows.map((row) => row.cover_path));
    return rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      eventDate: row.event_date,
      location: row.location,
      coverUrl: row.cover_path ? urls.get(row.cover_path) ?? null : null,
      status: row.status,
      albumCount: row.memory_albums?.length ?? 0,
      photoCount: (row.memory_albums ?? []).reduce((sum, album) => sum + (album.memory_photos[0]?.count ?? 0), 0),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async function mapAlbums(rows: AlbumRow[]): Promise<AdminAlbum[]> {
    const urls = await signPaths(rows.map((row) => row.cover_path));
    return rows.map((row) => ({
      id: row.id,
      eventId: row.event_id,
      title: row.title,
      description: row.description,
      coverUrl: row.cover_path ? urls.get(row.cover_path) ?? null : null,
      position: row.position,
      status: row.status,
      photoCount: row.memory_photos?.[0]?.count ?? 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async function getEventRow(id: string): Promise<EventRow> {
    return unwrap(await client.from("memory_events").select(EVENT_SELECT).eq("id", id).single<EventRow>());
  }

  async function getAlbumRow(id: string): Promise<AlbumRow> {
    return unwrap(await client.from("memory_albums").select("*, memory_photos(count)").eq("id", id).single<AlbumRow>());
  }

  async function count(table: string, filter?: [string, string]): Promise<number> {
    let query = client.from(table).select("*", { count: "exact", head: true });
    if (filter) query = query.eq(filter[0], filter[1]);
    const { count: total, error } = await query;
    if (error) throw fromSupabaseError(error);
    return total ?? 0;
  }

  async function readSettings(): Promise<GallerySettings> {
    const row = unwrap(
      await client
        .from("memory_settings")
        .select("allow_downloads, allow_zip_downloads, require_photo_approval")
        .eq("id", true)
        .single<{ allow_downloads: boolean; allow_zip_downloads: boolean; require_photo_approval: boolean }>()
    );
    return {
      allowDownloads: row.allow_downloads,
      allowZipDownloads: row.allow_zip_downloads,
      requirePhotoApproval: row.require_photo_approval,
    };
  }

  /** Envio com progresso real (XHR para a API de Storage com o token da sessão). */
  async function uploadWithProgress(path: string, file: File, onProgress: (fraction: number) => void) {
    const { data } = await client.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new PermissionDeniedError();
    const url = `${supabaseEnv.url}/storage/v1/object/${MEMORY_BUCKET}/${path.split("/").map(encodeURIComponent).join("/")}`;
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.setRequestHeader("apikey", supabaseEnv.anonKey);
      xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
      xhr.setRequestHeader("x-upsert", "false");
      xhr.setRequestHeader("cache-control", "max-age=3600");
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) onProgress(event.loaded / event.total);
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) return resolve();
        reject(fromSupabaseError({ status: xhr.status, message: `Upload falhou (${xhr.status})` }));
      };
      xhr.onerror = () => reject(new UserFacingError("Falha de rede durante o envio. Tente novamente."));
      xhr.send(file);
    });
  }

  return {
    configured: true,

    /* ---------------------------------------------------- dashboard */
    async getDashboard() {
      const [totalEvents, publishedEvents, draftEvents, totalPhotos, pendingPhotos, downloads] = await Promise.all([
        count("memory_events"),
        count("memory_events", ["status", "published"]),
        count("memory_events", ["status", "draft"]),
        count("memory_photos"),
        count("memory_photos", ["status", "pending_review"]),
        count("memory_downloads"),
      ]);
      const activityRows = unwrap(
        await client
          .from("memory_activity")
          .select("id, kind, summary, actor_id, created_at")
          .order("created_at", { ascending: false })
          .limit(8)
      ) as Array<{ id: number; kind: ActivityKind; summary: string; actor_id: string | null; created_at: string }>;

      const actorIds = [...new Set(activityRows.map((row) => row.actor_id).filter(Boolean))] as string[];
      const names = new Map<string, string>();
      if (actorIds.length > 0) {
        // memory_admin só vê o próprio perfil (RLS); os restantes aparecem como "Equipa".
        const { data } = await client.from("admin_profiles").select("user_id, display_name").in("user_id", actorIds);
        data?.forEach((row) => names.set(row.user_id as string, row.display_name as string));
      }
      const recentActivity: ActivityItem[] = activityRows.map((row) => ({
        id: String(row.id),
        kind: row.kind,
        summary: row.summary,
        actorName: (row.actor_id && names.get(row.actor_id)) || "Equipa",
        createdAt: row.created_at,
      }));

      return {
        stats: { totalEvents, publishedEvents, draftEvents, totalPhotos, pendingPhotos, downloads },
        recentActivity,
      };
    },

    /* ---------------------------------------------------- eventos */
    async listEvents() {
      const rows = unwrap(await client.from("memory_events").select(EVENT_SELECT).order("event_date", { ascending: false })) as EventRow[];
      return mapEvents(rows);
    },

    async getEvent(id) {
      const result = await client.from("memory_events").select(EVENT_SELECT).eq("id", id).maybeSingle<EventRow>();
      if (result.error) throw fromSupabaseError(result.error);
      return result.data ? (await mapEvents([result.data]))[0] : null;
    },

    async createEvent(input: EventInput) {
      const row = unwrap(
        await client
          .from("memory_events")
          .insert({
            slug: input.slug,
            title: input.title,
            description: input.description,
            event_date: input.eventDate,
            location: input.location,
            status: input.status,
          })
          .select("id")
          .single<{ id: string }>()
      );
      if (input.coverFile) {
        const coverPath = await uploadCover("events", row.id, input.coverFile);
        const { error } = await client.from("memory_events").update({ cover_path: coverPath }).eq("id", row.id);
        if (error) throw fromSupabaseError(error);
      }
      await log("event_created", `Evento "${input.title}" criado`);
      return (await mapEvents([await getEventRow(row.id)]))[0];
    },

    async updateEvent(id, input) {
      const previous = await getEventRow(id);
      const coverPath = input.coverFile ? await uploadCover("events", id, input.coverFile) : previous.cover_path;
      const { error } = await client
        .from("memory_events")
        .update({
          slug: input.slug,
          title: input.title,
          description: input.description,
          event_date: input.eventDate,
          location: input.location,
          status: input.status,
          cover_path: coverPath,
        })
        .eq("id", id);
      if (error) {
        if (input.coverFile && coverPath) await removeFiles([coverPath]);
        throw fromSupabaseError(error);
      }
      if (input.coverFile && previous.cover_path) await removeFiles([previous.cover_path]);
      if (previous.status !== "published" && input.status === "published") {
        await log("event_published", `Evento "${input.title}" publicado`);
      }
      return (await mapEvents([await getEventRow(id)]))[0];
    },

    async setEventStatus(id, status) {
      const row = unwrap(
        await client.from("memory_events").update({ status }).eq("id", id).select(EVENT_SELECT).single<EventRow>()
      );
      if (status === "published") await log("event_published", `Evento "${row.title}" publicado`);
      return (await mapEvents([row]))[0];
    },

    async deleteEvent(id) {
      const event = await getEventRow(id);
      const albums = unwrap(await client.from("memory_albums").select("id, cover_path").eq("event_id", id)) as Array<{ id: string; cover_path: string | null }>;
      const albumIds = albums.map((album) => album.id);
      const photos = albumIds.length
        ? (unwrap(await client.from("memory_photos").select("storage_path").in("album_id", albumIds)) as Array<{ storage_path: string }>)
        : [];
      const { error } = await client.from("memory_events").delete().eq("id", id);
      if (error) throw fromSupabaseError(error);
      await removeFiles([event.cover_path, ...albums.map((album) => album.cover_path), ...photos.map((photo) => photo.storage_path)]);
      await log("deleted", `Evento "${event.title}" eliminado`);
    },

    /* ---------------------------------------------------- álbuns */
    async listAlbums(eventId) {
      const rows = unwrap(
        await client.from("memory_albums").select("*, memory_photos(count)").eq("event_id", eventId).order("position")
      ) as AlbumRow[];
      return mapAlbums(rows);
    },

    async createAlbum(input: AlbumInput) {
      const last = await client
        .from("memory_albums")
        .select("position")
        .eq("event_id", input.eventId)
        .order("position", { ascending: false })
        .limit(1)
        .maybeSingle<{ position: number }>();
      if (last.error) throw fromSupabaseError(last.error);
      const row = unwrap(
        await client
          .from("memory_albums")
          .insert({
            event_id: input.eventId,
            title: input.title,
            description: input.description,
            status: input.status,
            position: (last.data?.position ?? -1) + 1,
          })
          .select("id")
          .single<{ id: string }>()
      );
      if (input.coverFile) {
        const coverPath = await uploadCover("albums", row.id, input.coverFile);
        const { error } = await client.from("memory_albums").update({ cover_path: coverPath }).eq("id", row.id);
        if (error) throw fromSupabaseError(error);
      }
      await log("album_created", `Álbum "${input.title}" criado`);
      return (await mapAlbums([await getAlbumRow(row.id)]))[0];
    },

    async updateAlbum(id, input) {
      const previous = await getAlbumRow(id);
      const coverPath = input.coverFile ? await uploadCover("albums", id, input.coverFile) : previous.cover_path;
      const { error } = await client
        .from("memory_albums")
        .update({ title: input.title, description: input.description, status: input.status, cover_path: coverPath })
        .eq("id", id);
      if (error) {
        if (input.coverFile && coverPath) await removeFiles([coverPath]);
        throw fromSupabaseError(error);
      }
      if (input.coverFile && previous.cover_path) await removeFiles([previous.cover_path]);
      return (await mapAlbums([await getAlbumRow(id)]))[0];
    },

    async setAlbumStatus(id, status) {
      const row = unwrap(
        await client.from("memory_albums").update({ status }).eq("id", id).select("*, memory_photos(count)").single<AlbumRow>()
      );
      return (await mapAlbums([row]))[0];
    },

    async reorderAlbums(eventId, orderedIds) {
      const results = await Promise.all(
        orderedIds.map((albumId, position) =>
          client.from("memory_albums").update({ position }).eq("id", albumId).eq("event_id", eventId)
        )
      );
      const failed = results.find((result) => result.error);
      if (failed?.error) throw fromSupabaseError(failed.error);
    },

    async deleteAlbum(id) {
      const album = await getAlbumRow(id);
      const photos = unwrap(await client.from("memory_photos").select("storage_path").eq("album_id", id)) as Array<{ storage_path: string }>;
      const { error } = await client.from("memory_albums").delete().eq("id", id);
      if (error) throw fromSupabaseError(error);
      await removeFiles([album.cover_path, ...photos.map((photo) => photo.storage_path)]);
      await log("deleted", `Álbum "${album.title}" eliminado`);
    },

    /* ---------------------------------------------------- fotografias */
    async listPhotos(filter) {
      let query = client
        .from("memory_photos")
        .select("*, memory_albums!inner(event_id)")
        .order("created_at", { ascending: false })
        .limit(500);
      if (filter.albumId) query = query.eq("album_id", filter.albumId);
      if (filter.eventId) query = query.eq("memory_albums.event_id", filter.eventId);
      if (filter.status) query = query.eq("status", filter.status);
      const rows = unwrap(await query) as PhotoRow[];
      const urls = await signPaths(rows.map((row) => row.storage_path));
      return rows.map<AdminPhoto>((row) => ({
        id: row.id,
        eventId: row.memory_albums?.event_id ?? "",
        albumId: row.album_id,
        fileName: row.file_name,
        storagePath: row.storage_path,
        previewUrl: urls.get(row.storage_path) ?? "",
        sizeBytes: row.size_bytes,
        width: row.width,
        height: row.height,
        status: row.status,
        createdAt: row.created_at,
      }));
    },

    async uploadPhoto(albumId, file, onProgress) {
      const album = await getAlbumRow(albumId);
      const settings = await readSettings();
      const path = `events/${album.event_id}/${albumId}/${crypto.randomUUID()}.${extensionOf(file)}`;
      await uploadWithProgress(path, file, onProgress);
      const { width, height } = await readDimensions(file);
      const result = await client
        .from("memory_photos")
        .insert({
          album_id: albumId,
          storage_path: path,
          file_name: file.name,
          size_bytes: file.size,
          width,
          height,
          status: settings.requirePhotoApproval ? "pending_review" : "approved",
        })
        .select("*, memory_albums!inner(event_id)")
        .single<PhotoRow>();
      if (result.error || !result.data) {
        await removeFiles([path]); // não deixar ficheiros sem registo
        throw result.error ? fromSupabaseError(result.error) : new UserFacingError("Não foi possível registar a fotografia.");
      }
      const row = result.data;
      return {
        id: row.id,
        eventId: album.event_id,
        albumId,
        fileName: row.file_name,
        storagePath: row.storage_path,
        previewUrl: "",
        sizeBytes: row.size_bytes,
        width: row.width,
        height: row.height,
        status: row.status,
        createdAt: row.created_at,
      };
    },

    async setPhotoStatus(ids, status) {
      if (ids.length === 0) return;
      const { error } = await client.from("memory_photos").update({ status }).in("id", ids);
      if (error) throw fromSupabaseError(error);
      if (status === "published") await log("photos_published", `${ids.length} fotografia(s) publicada(s)`);
    },

    async deletePhotos(ids) {
      if (ids.length === 0) return;
      const rows = unwrap(await client.from("memory_photos").select("storage_path").in("id", ids)) as Array<{ storage_path: string }>;
      const { error } = await client.from("memory_photos").delete().in("id", ids);
      if (error) throw fromSupabaseError(error);
      await removeFiles(rows.map((row) => row.storage_path));
      await log("deleted", `${ids.length} fotografia(s) eliminada(s)`);
    },

    /* ---------------------------------------------------- definições */
    getSettings: readSettings,

    async updateSettings(settings: GallerySettings) {
      const { data, error } = await client
        .from("memory_settings")
        .update({
          allow_downloads: settings.allowDownloads,
          allow_zip_downloads: settings.allowZipDownloads,
          require_photo_approval: settings.requirePhotoApproval,
        })
        .eq("id", true)
        .select("id");
      if (error) throw fromSupabaseError(error);
      // RLS sem permissão devolve 0 linhas em vez de erro.
      if (!data || data.length === 0) throw new PermissionDeniedError();
      return settings;
    },
  };
}
