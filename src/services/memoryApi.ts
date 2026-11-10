/* ============================================================
   SAVE YOUR MEMORY — API MOCK PÚBLICA (só leitura)
   ------------------------------------------------------------
   ⚠️  MOCK SERVICE — leituras da galeria pública sobre
   `memoryStore` (src/data/memory/store.ts). Só devolve eventos
   publicados. A gestão (escritas) vive na área privada
   /memory-control (src/admin), que usará o Supabase.
   ============================================================ */

import { memoryStore } from "../data/memory";
import type { MemoryCategory, MemoryEvent, MemoryPhoto } from "../data/memory";

const DELAY_MS = 120;

const delay = (ms: number = DELAY_MS) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

/* ------------------------------------------------------------
   LEITURA PÚBLICA
   ------------------------------------------------------------ */

export const memoryApi = {
  /** Todos os eventos publicados (mais recentes primeiro). */
  async getPublicEvents(): Promise<MemoryEvent[]> {
    await delay();
    return memoryStore.events
      .filter((event) => event.status === "published")
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  /** Evento publicado por slug (para a página pública). */
  async getPublicEventBySlug(slug: string): Promise<MemoryEvent | undefined> {
    await delay();
    return memoryStore.events.find(
      (event) => event.slug === slug && event.status === "published"
    );
  },

  /** Todas as categorias (ordenadas alfabeticamente). */
  async getCategories(): Promise<MemoryCategory[]> {
    await delay();
    return [...memoryStore.categories].sort((a, b) =>
      a.name.localeCompare(b.name, "pt")
    );
  },

  /** Fotografias de um evento, pela ordem definida no admin. */
  async getEventPhotos(eventId: string): Promise<MemoryPhoto[]> {
    await delay();
    return memoryStore.photos
      .filter((photo) => photo.eventId === eventId)
      .sort((a, b) => a.order - b.order);
  },

  /** Fotografias (as páginas públicas cruzam-nas com eventos publicados). */
  async getAllPhotos(): Promise<MemoryPhoto[]> {
    await delay();
    return [...memoryStore.photos];
  },
};
