import type { AlbumStatus, EventStatus, PhotoStatus } from "./types";

export type StatusTone = "success" | "warning" | "neutral" | "info" | "muted";

export const eventStatusMeta: Record<EventStatus, { label: string; tone: StatusTone }> = {
  draft: { label: "Rascunho", tone: "warning" },
  published: { label: "Publicado", tone: "success" },
  archived: { label: "Arquivado", tone: "muted" },
};

export const albumStatusMeta: Record<AlbumStatus, { label: string; tone: StatusTone }> = {
  published: { label: "Publicado", tone: "success" },
  hidden: { label: "Oculto", tone: "muted" },
};

export const photoStatusMeta: Record<PhotoStatus, { label: string; tone: StatusTone }> = {
  pending_review: { label: "Pendente", tone: "warning" },
  approved: { label: "Aprovada", tone: "info" },
  published: { label: "Publicada", tone: "success" },
  hidden: { label: "Despublicada", tone: "muted" },
};

export const formatDate = (iso: string): string => {
  const date = new Date(iso.length === 10 ? `${iso}T12:00:00` : iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", year: "numeric" }).format(date);
};

export const formatDateTime = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
