/* ============================================================
   SAVE YOUR MEMORY — Data types
   ============================================================ */

export type EventStatus = "published" | "draft";

export interface MemoryCategory {
  id: string;
  slug: string;
  name: string;
  createdAt: string;
}

export interface MemoryPhoto {
  id: string;
  eventId: string;
  /** URL da imagem (demo: placeholder service; uploads demo: blob URL de sessão) */
  src: string;
  alt: string;
  caption?: string;
  order: number;
  createdAt: string;
}

export interface MemoryEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** Data do evento — ISO yyyy-mm-dd */
  date: string;
  categoryId: string;
  cover: string;
  coverAlt: string;
  status: EventStatus;
  createdAt: string;
  updatedAt: string;
}

/** Dados usados para criar/atualizar um evento (sem campos derivados) */
export interface MemoryEventInput {
  title: string;
  description: string;
  date: string;
  categoryId: string;
  cover?: string;
  coverAlt?: string;
  status?: EventStatus;
}
