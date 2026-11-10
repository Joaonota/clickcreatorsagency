/* ============================================================
   SAVE YOUR MEMORY — tipos da galeria pública
   (dados reais do Supabase: apenas conteúdo publicado)
   ============================================================ */

export type MediaType = "image" | "video";

export interface MemoryEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Data do evento — ISO yyyy-mm-dd */
  date: string;
  location: string;
  /** URL assinado temporário da capa ("" quando não existe). */
  cover: string;
  coverAlt: string;
  albumCount: number;
  mediaCount: number;
}

export interface MemoryAlbum {
  id: string;
  title: string;
  description: string;
  position: number;
}

export interface MemoryMedia {
  id: string;
  albumId: string;
  type: MediaType;
  /** URL assinado temporário para visualização. */
  src: string;
  storagePath: string;
  fileName: string;
  order: number;
}

export interface MemorySettings {
  allowDownloads: boolean;
  allowZipDownloads: boolean;
}

export interface MemoryEventDetail {
  event: MemoryEvent;
  albums: MemoryAlbum[];
  media: MemoryMedia[];
}
