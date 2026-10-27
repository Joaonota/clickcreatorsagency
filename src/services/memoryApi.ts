/* ============================================================
   SAVE YOUR MEMORY — API MOCK (sem backend)
   ------------------------------------------------------------
   ⚠️  MOCK SERVICE — espelha a interface de uma API futura.
   As operações correm sobre `memoryStore` em memória (ver
   src/data/memory/store.ts). Persistência real, autenticação
   e armazenamento chegam na fase de backend.
   ============================================================ */

import {
  ensureUniqueSlug,
  memoryStore,
  resetMemoryStore,
  slugify,
} from "../data/memory";
import type {
  EventStatus,
  MemoryCategory,
  MemoryEvent,
  MemoryEventInput,
  MemoryPhoto,
} from "../data/memory";

const DELAY_MS = 120;

const delay = (ms: number = DELAY_MS) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const nowIso = () => new Date().toISOString();

export interface AddPhotoItem {
  src: string;
  alt?: string;
  caption?: string;
}

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

  /* ------------------------------------------------------------
     ADMIN — eventos
     ------------------------------------------------------------ */

  /** Lista completa de eventos (incluindo rascunhos) para o admin. */
  async getAllEvents(): Promise<MemoryEvent[]> {
    await delay();
    return [...memoryStore.events].sort((a, b) => {
      // Ativos recentes no topo: rascunhos/pré-visualização primeiro, depois data
      if (a.status !== b.status) return a.status === "draft" ? -1 : 1;
      return b.date.localeCompare(a.date);
    });
  },

  async getEventById(id: string): Promise<MemoryEvent | undefined> {
    await delay();
    return memoryStore.events.find((event) => event.id === id);
  },

  /** Cria um evento novo (rascunho ou já publicado). */
  async createEvent(input: MemoryEventInput): Promise<MemoryEvent> {
    await delay();
    const slug = ensureUniqueSlug(
      slugify(input.title),
      memoryStore.events
    );
    const timestamp = nowIso();
    const event: MemoryEvent = {
      id: uid("evt"),
      slug,
      title: input.title.trim(),
      description: input.description.trim(),
      date: input.date,
      categoryId: input.categoryId,
      // Sem capa definida → vazia por agora (a 1.ª foto carregada vira capa)
      cover: input.cover || "",
      coverAlt: input.coverAlt || input.title.trim(),
      status: input.status || "draft",
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    memoryStore.events.push(event);
    return event;
  },

  async updateEvent(id: string, patch: Partial<MemoryEventInput>): Promise<MemoryEvent | undefined> {
    await delay();
    const event = memoryStore.events.find((item) => item.id === id);
    if (!event) return undefined;
    if (patch.title !== undefined) {
      event.title = patch.title.trim();
      event.slug = ensureUniqueSlug(slugify(patch.title), memoryStore.events, id);
    }
    if (patch.description !== undefined) event.description = patch.description.trim();
    if (patch.date !== undefined) event.date = patch.date;
    if (patch.categoryId !== undefined) event.categoryId = patch.categoryId;
    if (patch.cover !== undefined) event.cover = patch.cover;
    if (patch.coverAlt !== undefined) event.coverAlt = patch.coverAlt;
    if (patch.status !== undefined) event.status = patch.status;
    event.updatedAt = nowIso();
    return event;
  },

  /** Publica ou despublica (por exemplo, volta a rascunho) um evento. */
  async setEventStatus(id: string, status: EventStatus): Promise<MemoryEvent | undefined> {
    return this.updateEvent(id, { status });
  },

  /** Elimina evento e as suas fotografias. */
  async deleteEvent(id: string): Promise<boolean> {
    await delay();
    const index = memoryStore.events.findIndex((event) => event.id === id);
    if (index === -1) return false;
    memoryStore.events.splice(index, 1);
    memoryStore.photos = memoryStore.photos.filter((photo) => photo.eventId !== id);
    return true;
  },

  /* ------------------------------------------------------------
     ADMIN — categorias
     ------------------------------------------------------------ */

  async getAllCategories(): Promise<MemoryCategory[]> {
    await delay();
    return [...memoryStore.categories].sort((a, b) =>
      a.name.localeCompare(b.name, "pt")
    );
  },

  async createCategory(name: string): Promise<MemoryCategory> {
    await delay();
    const category: MemoryCategory = {
      id: uid("cat"),
      slug: ensureUniqueSlug(slugify(name), memoryStore.categories),
      name: name.trim(),
      createdAt: nowIso(),
    };
    memoryStore.categories.push(category);
    return category;
  },

  async updateCategory(id: string, name: string): Promise<MemoryCategory | undefined> {
    await delay();
    const category = memoryStore.categories.find((item) => item.id === id);
    if (!category) return undefined;
    category.name = name.trim();
    category.slug = ensureUniqueSlug(slugify(name), memoryStore.categories, id);
    return category;
  },

  /** Elimina categoria — eventos associados ficam "sem categoria". */
  async deleteCategory(id: string): Promise<boolean> {
    await delay();
    const index = memoryStore.categories.findIndex((category) => category.id === id);
    if (index === -1) return false;
    memoryStore.categories.splice(index, 1);
    memoryStore.events.forEach((event) => {
      if (event.categoryId === id) event.categoryId = "";
    });
    return true;
  },

  /* ------------------------------------------------------------
     ADMIN — fotografias
     ------------------------------------------------------------ */

  async getAllPhotos(): Promise<MemoryPhoto[]> {
    await delay();
    return [...memoryStore.photos];
  },

  /** Adiciona fotografia(s) ao fim da galeria de um evento. */
  async addPhotos(eventId: string, items: AddPhotoItem[]): Promise<MemoryPhoto[]> {
    await delay(120 + items.length * 40);
    const created: MemoryPhoto[] = [];
    items.forEach((item) => {
      const photo: MemoryPhoto = {
        id: uid("ph"),
        eventId,
        src: item.src,
        alt: item.alt?.trim() || "",
        caption: item.caption,
        order: memoryStore.photos.filter((p) => p.eventId === eventId).length + created.length,
        createdAt: nowIso(),
      };
      created.push(photo);
      memoryStore.photos.push(photo);
    });
    // Se o evento ainda não tem capa, a primeira foto carregada torna-se capa
    const event = memoryStore.events.find((item) => item.id === eventId);
    if (event && !event.cover) {
      event.cover = created[0].src;
      event.updatedAt = nowIso();
    }
    return created;
  },

  /** Substitui o ficheiro de uma fotografia mantendo a posição. */
  async replacePhoto(photoId: string, src: string, alt?: string): Promise<MemoryPhoto | undefined> {
    await delay();
    const photo = memoryStore.photos.find((item) => item.id === photoId);
    if (!photo) return undefined;
    photo.src = src;
    if (alt !== undefined) photo.alt = alt.trim();
    const event = memoryStore.events.find((item) => item.id === photo.eventId);
    // Atualiza a capa se substituímos a primeira fotografia da galeria
    if (event) {
      const wasCover = memoryStore.photos.find(
        (p) => p.eventId === photo.eventId && p.order === 0
      );
      if (wasCover && wasCover.id === photo.id) {
        event.cover = photo.src;
      }
    }
    return photo;
  },

  async deletePhoto(photoId: string): Promise<boolean> {
    await delay();
    const index = memoryStore.photos.findIndex((photo) => photo.id === photoId);
    if (index === -1) return false;
    memoryStore.photos.splice(index, 1);
    normalizeEventOrders();
    return true;
  },

  /** Define a ordem completa de um evento a partir dos ids. */
  async reorderPhotos(eventId: string, photoIds: string[]): Promise<void> {
    await delay(200);
    photoIds.forEach((photoId, index) => {
      const photo = memoryStore.photos.find((p) => p.id === photoId);
      if (photo) photo.order = index;
    });
    // Sincroniza a capa com a primeira fotografia da lista
    const event = memoryStore.events.find((item) => item.id === eventId);
    const firstPhoto = memoryStore.photos
      .filter((p) => p.eventId === eventId)
      .sort((a, b) => a.order - b.order)[0];
    if (event && firstPhoto) {
      if (!event.cover || event.cover === "") event.cover = firstPhoto.src;
    }
  },

  /* ------------------------------------------------------------
     DEMO — utilitários
     ------------------------------------------------------------ */

  /** Restaura o conjunto de dados de demonstração (só no admin demo). */
  async resetDemoData(): Promise<void> {
    await delay(300);
    resetMemoryStore();
  },
};

/* Recompacta a ordem (0..n-1) das fotografias de todos os eventos. */
function normalizeEventOrders() {
  const grouped = new Map<string, MemoryPhoto[]>();
  memoryStore.photos.forEach((photo) => {
    const list = grouped.get(photo.eventId) ?? [];
    list.push(photo);
    grouped.set(photo.eventId, list);
  });
  grouped.forEach((list) => {
    list.sort((a, b) => a.order - b.order).forEach((photo, index) => {
      photo.order = index;
    });
  });
}
