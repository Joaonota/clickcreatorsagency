/* ============================================================
   MEMORY CONTROL — períodos e rótulos de analytics
   ============================================================ */

import type { AnalyticsBucket, AnalyticsEventType, AnalyticsMetric, AnalyticsRange, DownloadKind } from "../../data/types";

export type PeriodPreset = "today" | "7d" | "30d" | "90d" | "custom";

export const periodOptions: Array<{ id: PeriodPreset; label: string; description: string }> = [
  { id: "today", label: "Hoje", description: "Hoje" },
  { id: "7d", label: "7 dias", description: "Últimos 7 dias" },
  { id: "30d", label: "30 dias", description: "Últimos 30 dias" },
  { id: "90d", label: "3 meses", description: "Últimos 3 meses" },
  { id: "custom", label: "Personalizado", description: "Período personalizado" },
];

export const MAX_CUSTOM_DAYS = 400;
const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
/** Início da próxima hora: o período fica estável durante a hora corrente. */
const nextHour = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() + 1);

/** yyyy-mm-dd na hora local (para <input type="date">). */
export const toDateInput = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const fromDateInput = (value: string): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
};

/** Momento de referência dos períodos (actualizado ao carregar em "Actualizar"). */
export const currentTime = () => Date.now();

/** Valores iniciais do período personalizado (últimos 30 dias). */
export function defaultCustomRange(): { from: string; to: string } {
  const today = new Date();
  return { from: toDateInput(addDays(today, -29)), to: toDateInput(today) };
}

export type RangeResult = { ok: true; range: AnalyticsRange } | { ok: false; message: string };

/** Converte o filtro escolhido num intervalo [from, to) e na granularidade do gráfico. */
export function resolveRange(preset: PeriodPreset, custom: { from: string; to: string }, reference: number): RangeResult {
  const now = new Date(reference);
  const end = nextHour(now);
  const today = startOfDay(now);
  const build = (from: Date, to: Date, bucket: AnalyticsBucket): RangeResult => ({
    ok: true,
    range: { from: from.toISOString(), to: to.toISOString(), bucket },
  });

  switch (preset) {
    case "today":
      return build(today, end, "hour");
    case "7d":
      return build(addDays(today, -6), end, "day");
    case "30d":
      return build(addDays(today, -29), end, "day");
    case "90d":
      return build(new Date(today.getFullYear(), today.getMonth() - 3, today.getDate() + 1), end, "day");
    case "custom": {
      const from = fromDateInput(custom.from);
      const to = fromDateInput(custom.to);
      if (!from || !to) return { ok: false, message: "Escolha as datas de início e de fim." };
      if (from > to) return { ok: false, message: "A data de início tem de ser anterior à data de fim." };
      if (from >= end) return { ok: false, message: "O período escolhido ainda não começou." };
      const days = Math.round((to.getTime() - from.getTime()) / DAY_MS) + 1;
      if (days > MAX_CUSTOM_DAYS) return { ok: false, message: `Escolha um período até ${MAX_CUSTOM_DAYS} dias.` };
      const exclusiveEnd = addDays(to, 1) < end ? addDays(to, 1) : end;
      return build(from, exclusiveEnd, days <= 2 ? "hour" : days <= 120 ? "day" : "week");
    }
  }
}

/* ------------------------------------------------------------ rótulos */
export const metricMeta: Record<AnalyticsMetric, { label: string; one: string; many: string }> = {
  gallery_views: { label: "Acessos", one: "acesso", many: "acessos" },
  photo_views: { label: "Visualizações", one: "visualização", many: "visualizações" },
  downloads: { label: "Downloads", one: "download", many: "downloads" },
  qr_scans: { label: "QR Code", one: "leitura", many: "leituras" },
};

export const formatCount = (value: number) => value.toLocaleString("pt-PT");
export const formatMetric = (metric: AnalyticsMetric, value: number) =>
  `${formatCount(value)} ${value === 1 ? metricMeta[metric].one : metricMeta[metric].many}`;

export const downloadKindLabels: Record<DownloadKind, string> = {
  single: "Fotografia individual",
  multiple: "Várias fotografias",
  album: "Álbum (ZIP)",
  all: "Todas as fotografias (ZIP)",
};

export function activityLabel(type: AnalyticsEventType, kind: DownloadKind | null, items: number | null): string {
  switch (type) {
    case "gallery_view":
      return "Galeria visualizada";
    case "photo_view":
      return "Fotografia visualizada";
    case "album_view":
      return "Álbum aberto";
    case "qr_scan":
      return "QR Code escaneado";
    case "download": {
      if (kind === "single" || !kind) return "Fotografia descarregada";
      const files = items ? ` · ${formatCount(items)} ${items === 1 ? "ficheiro" : "ficheiros"}` : "";
      if (kind === "album") return `Álbum descarregado (ZIP)${files}`;
      if (kind === "all") return `Todas as fotografias descarregadas (ZIP)${files}`;
      return `Várias fotografias descarregadas${files}`;
    }
  }
}

/* ------------------------------------------------------------ datas da série */
/** "yyyy-mm-ddThh:mm:ss" (hora local devolvida pela BD) → Date local. */
export function parseBucket(value: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2})/.exec(value);
  if (!match) return new Date(value);
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]));
}

const shortDay = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "short" });
const longDay = new Intl.DateTimeFormat("pt-PT", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export function bucketAxisLabel(value: string, bucket: AnalyticsBucket): string {
  const date = parseBucket(value);
  if (bucket === "hour") return `${String(date.getHours()).padStart(2, "0")}h`;
  return shortDay.format(date).replace(".", "");
}

export function bucketTooltipLabel(value: string, bucket: AnalyticsBucket): string {
  const date = parseBucket(value);
  if (bucket === "hour") {
    const hour = String(date.getHours()).padStart(2, "0");
    return `${shortDay.format(date)} · ${hour}:00–${hour}:59`;
  }
  if (bucket === "week") return `Semana de ${shortDay.format(date)}`;
  return longDay.format(date);
}
