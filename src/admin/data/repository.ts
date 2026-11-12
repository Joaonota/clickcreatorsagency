/* ============================================================
   MEMORY CONTROL — repositório de dados administrativo
   ------------------------------------------------------------
   Contrato único usado por todas as páginas do painel.
   Com o Supabase configurado usa supabaseRepository.ts; sem
   configuração, a implementação PENDENTE rejeita tudo com
   BackendNotConfiguredError (sem dados fictícios).
   ============================================================ */

import { supabase } from "../../lib/supabase";
import { BackendNotConfiguredError } from "./errors";
import { createSupabaseRepository } from "./supabaseRepository";
import type {
  AdminEvent,
  AdminPhoto,
  DashboardSnapshot,
  EventInput,
  EventStatus,
  GallerySettings,
  PhotoFilter,
  PhotoStatus,
  UploadProgressHandler,
} from "./types";

export interface MemoryAdminRepository {
  readonly configured: boolean;

  getDashboard(): Promise<DashboardSnapshot>;

  listEvents(): Promise<AdminEvent[]>;
  getEvent(id: string): Promise<AdminEvent | null>;
  createEvent(input: EventInput): Promise<AdminEvent>;
  updateEvent(id: string, input: EventInput): Promise<AdminEvent>;
  setEventStatus(id: string, status: EventStatus): Promise<AdminEvent>;
  deleteEvent(id: string): Promise<void>;

  listPhotos(filter: PhotoFilter): Promise<AdminPhoto[]>;
  /** Carrega um ficheiro directamente para o evento. */
  uploadPhoto(eventId: string, file: File, onProgress: UploadProgressHandler): Promise<AdminPhoto>;
  setPhotoStatus(ids: string[], status: PhotoStatus): Promise<void>;
  deletePhotos(ids: string[]): Promise<void>;

  getSettings(): Promise<GallerySettings>;
  updateSettings(settings: GallerySettings): Promise<GallerySettings>;
}

const reject = async (): Promise<never> => {
  throw new BackendNotConfiguredError();
};

const pendingRepository: MemoryAdminRepository = {
  configured: false,
  getDashboard: reject,
  listEvents: reject,
  getEvent: reject,
  createEvent: reject,
  updateEvent: reject,
  setEventStatus: reject,
  deleteEvent: reject,
  listPhotos: reject,
  uploadPhoto: reject,
  setPhotoStatus: reject,
  deletePhotos: reject,
  getSettings: reject,
  updateSettings: reject,
};

export const memoryAdminRepository: MemoryAdminRepository = supabase
  ? createSupabaseRepository(supabase)
  : pendingRepository;
