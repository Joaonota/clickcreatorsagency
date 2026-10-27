/* ============================================================
   SAVE YOUR MEMORY — barrel de dados (mock)
   ============================================================ */

export type {
  MemoryCategory,
  MemoryEvent,
  MemoryEventInput,
  MemoryPhoto,
  EventStatus,
} from "./types";

export {
  demoCategories,
  demoEvents,
  demoPhotos,
  createDemoMemoryDataset,
} from "./mockData";

export { memoryStore, resetMemoryStore } from "./store";

export {
  normalizeText,
  slugify,
  ensureUniqueSlug,
  formatEventDate,
  placeholderCover,
  displayCover,
} from "./utils";
