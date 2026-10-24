/* ============================================================
   SAVE YOUR MEMORY — STORE IN-MEMORY (MOCK)
   ------------------------------------------------------------
   ⚠️  MOCK STORE — substituir por backend real (API + base de
   dados) na próxima fase. Mantém a mesma forma dos dados.
   Os dados vivem apenas nesta sessão de browser. Para testes
   de demonstração, o admin pode restaurar o conjunto demo.
   ============================================================ */

import type { MemoryCategory, MemoryEvent, MemoryPhoto } from "./types";
import { createDemoMemoryDataset } from "./mockData";

interface MemoryStore {
  events: MemoryEvent[];
  categories: MemoryCategory[];
  photos: MemoryPhoto[];
}

/** Dados iniciais (cópia dos demo em mockData.ts) */
export const memoryStore: MemoryStore = createDemoMemoryDataset();

/** Repõe o conjunto de dados de demonstração original. */
export function resetMemoryStore(): void {
  const dataset = createDemoMemoryDataset();
  memoryStore.events = dataset.events;
  memoryStore.categories = dataset.categories;
  memoryStore.photos = dataset.photos;
}
