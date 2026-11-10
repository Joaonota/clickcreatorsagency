/* ============================================================
   MEMORY CONTROL — repositório de dados administrativo
   ------------------------------------------------------------
   Contrato único usado por todas as páginas do painel.
   Com o Supabase configurado usa supabaseRepository.ts; sem
   configuração, a implementação PENDENTE rejeita tudo com
   BackendNotConfiguredError (sem dados fictícios).
   ============================================================ */

import { supabase } from "../lib/supabase";
import { BackendNotConfiguredError } from "./errors";
import { createSupabaseRepository } from "./supabaseRepository";
import type {
  AdminAlbum,
  AdminEvent,
  AdminPhoto,
  AlbumInput,
  AlbumStatus,
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

  listAlbums(eventId: string): Promise<AdminAlbum[]>;
  createAlbum(input: AlbumInput): Promise<AdminAlbum>;
  updateAlbum(id: string, input: AlbumInput): Promise<AdminAlbum>;
  setAlbumStatus(id: string, status: AlbumStatus): Promise<AdminAlbum>;
  reorderAlbums(eventId: string, orderedIds: string[]): Promise<void>;
  deleteAlbum(id: string): Promise<void>;

  listPhotos(filter: PhotoFilter): Promise<AdminPhoto[]>;
  uploadPhoto(albumId: string, file: File, onProgress: UploadProgressHandler): Promise<AdminPhoto>;
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
  listAlbums: reject,
  createAlbum: reject,
  updateAlbum: reject,
  setAlbumStatus: reject,
  reorderAlbums: reject,
  deleteAlbum: reject,
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
