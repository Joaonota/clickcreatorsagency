/* ============================================================
   MEMORY CONTROL — modelo de dados administrativo
   Espelha as tabelas em supabase/migrations/0001_save_your_memory.sql
   ============================================================ */

export type EventStatus = "draft" | "published" | "archived";
export type AlbumStatus = "published" | "hidden";
export type PhotoStatus = "pending_review" | "approved" | "published" | "hidden";
export type MediaType = "image" | "video";

export interface AdminEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** ISO yyyy-mm-dd */
  eventDate: string;
  location: string;
  coverUrl: string | null;
  status: EventStatus;
  albumCount: number;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  title: string;
  slug: string;
  description: string;
  eventDate: string;
  location: string;
  status: EventStatus;
  /** Novo ficheiro de capa a enviar para o Storage (opcional). */
  coverFile?: File | null;
}

export interface AdminAlbum {
  id: string;
  eventId: string;
  title: string;
  description: string;
  coverUrl: string | null;
  position: number;
  status: AlbumStatus;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumInput {
  eventId: string;
  title: string;
  description: string;
  status: AlbumStatus;
  coverFile?: File | null;
}

export interface AdminPhoto {
  id: string;
  eventId: string;
  albumId: string;
  mediaType: MediaType;
  fileName: string;
  /** Caminho no bucket do Supabase Storage. */
  storagePath: string;
  /** URL assinado/temporário para pré-visualização no admin. */
  previewUrl: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  status: PhotoStatus;
  createdAt: string;
}

export interface PhotoFilter {
  eventId?: string;
  albumId?: string;
  status?: PhotoStatus;
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  totalPhotos: number;
  pendingPhotos: number;
  downloads: number;
}

export type ActivityKind =
  | "event_created"
  | "event_published"
  | "album_created"
  | "photos_uploaded"
  | "photos_published"
  | "deleted"
  | "team";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  /** Texto já formatado pelo servidor, ex.: "Graduation 2026 publicado". */
  summary: string;
  actorName: string;
  createdAt: string;
}

export interface DashboardSnapshot {
  stats: DashboardStats;
  recentActivity: ActivityItem[];
}

export interface GallerySettings {
  allowDownloads: boolean;
  allowZipDownloads: boolean;
  requirePhotoApproval: boolean;
}

export type UploadProgressHandler = (fraction: number) => void;
