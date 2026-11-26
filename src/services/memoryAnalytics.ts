/* ============================================================
   SAVE YOUR MEMORY — tracking anónimo das galerias públicas
   ------------------------------------------------------------
   Envia eventos para a função `track_memory_event` do Supabase
   (validada no servidor: só conteúdo publicado, data do servidor,
   repetições ignoradas). Nunca envia dados pessoais: apenas um
   identificador aleatório de visitante, renovado a cada 30 dias.
   O browser só guarda esse identificador — os números vivem no
   Supabase. Falhas de tracking nunca afectam a galeria.
   ============================================================ */

export type AnalyticsEventType = "gallery_view" | "photo_view" | "album_view" | "qr_scan" | "download";
export type DownloadKind = "single" | "multiple" | "album" | "all";

interface TrackOptions {
  photoId?: string;
  albumId?: string;
  downloadKind?: DownloadKind;
  itemCount?: number;
}

const VISITOR_KEY = "sym-visitor";
const VISITOR_TTL_MS = 30 * 24 * 60 * 60 * 1000;

let memoryVisitorId: string | null = null;

/** UUID v4 aleatório (crypto.randomUUID só existe em contextos seguros). */
function randomId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/** Identificador anónimo do visitante (sem dados pessoais; expira em 30 dias). */
function visitorId(): string {
  try {
    const stored = JSON.parse(localStorage.getItem(VISITOR_KEY) ?? "null") as { id?: string; exp?: number } | null;
    if (stored?.id && typeof stored.exp === "number" && stored.exp > Date.now()) return stored.id;
    const id = randomId();
    localStorage.setItem(VISITOR_KEY, JSON.stringify({ id, exp: Date.now() + VISITOR_TTL_MS }));
    return id;
  } catch {
    // Navegação privada / armazenamento bloqueado: identificador só desta página.
    memoryVisitorId ??= randomId();
    return memoryVisitorId;
  }
}

/** Evita pedidos duplicados na mesma página (o servidor também deduplica). */
const sentViews = new Set<string>();

/** Regista um evento de analytics. Nunca lança erros. */
export function trackMemoryEvent(type: AnalyticsEventType, publicId: string, options: TrackOptions = {}): void {
  if (!publicId) return;
  if (type !== "download") {
    const key = [type, publicId, options.photoId ?? "", options.albumId ?? ""].join(":");
    if (sentViews.has(key)) return;
    sentViews.add(key);
  }
  void (async () => {
    try {
      const { supabase } = await import("../lib/supabase");
      if (!supabase) return;
      await supabase.rpc("track_memory_event", {
        p_type: type,
        p_public_id: publicId,
        p_visitor_id: visitorId(),
        p_photo_id: options.photoId ?? null,
        p_album_id: options.albumId ?? null,
        p_download_kind: options.downloadKind ?? null,
        p_item_count: options.itemCount ?? null,
      });
    } catch {
      /* analytics é informativo */
    }
  })();
}
