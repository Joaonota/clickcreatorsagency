/* ============================================================
   SAVE YOUR MEMORY — Download ZIP (cliente)
   ------------------------------------------------------------
   Constrói um ZIP no browser (JSZip) com as fotografias de um
   evento. Sem servidor: as imagens são obtidas com fetch a
   partir das URLs do mock (placeholder service ou blob URLs
   de sessão). Na fase de backend isto pode passar a um link
   direto para um ZIP pré-compilado.
   ============================================================ */

import type { MemoryPhoto } from "../data/memory";

interface ZipProgress {
  done: number;
  total: number;
}

/** JSZip em chunk separado (carregado só quando descarrega um ZIP). */
const loadJSZip = async () => {
  const mod = await import("jszip");
  return mod.default;
};

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

const extensionFor = (blob: Blob, fallbackUrl: string): string => {
  const declared = EXT_BY_MIME[blob.type];
  if (declared) return declared;
  const match = /\.(jpe?g|png|webp|gif|avif)$/i.exec(fallbackUrl.split("?")[0]);
  return match ? match[1].toLowerCase() : "jpg";
};

/** Descarrega um ficheiro gerado no cliente. */
export const triggerBrowserDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
};

/** Obtém a imagem como blob, com fallback de proxy CORS quando disponível. */
export const fetchImageBlob = async (src: string): Promise<Blob | null> => {
  try {
    const response = await fetch(src, { mode: "cors" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.blob();
  } catch {
    // Fallback: proxy de imagens (disperso caso remotos sem CORS)
    try {
      const proxied = `https://images.weserv.nl/?url=${encodeURIComponent(
        src.replace(/^https?:\/\//, "")
      )}`;
      const response = await fetch(proxied, { mode: "cors" });
      if (!response.ok) return null;
      return await response.blob();
    } catch {
      return null;
    }
  }
};

/** Descarrega a fotografia individual que o utilizador está a ver. */
export const downloadSinglePhoto = async (photo: MemoryPhoto, eventTitle: string) => {
  const blob = await fetchImageBlob(photo.src);
  if (!blob) return false;
  const ext = extensionFor(blob, photo.src);
  const prefix = slugPrefix(eventTitle);
  triggerBrowserDownload(blob, `${prefix}-foto-${String(photo.order + 1).padStart(2, "0")}.${ext}`);
  return true;
};

const slugPrefix = (title: string) =>
  title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 48) || "evento";

/**
 * Compila e descarrega todas as fotografias de um evento em ZIP.
 * Devolve quantas fotografias foram incluídas com sucesso.
 */
export const downloadEventPhotosZip = async (
  photos: MemoryPhoto[],
  eventTitle: string,
  onProgress?: (progress: ZipProgress) => void
): Promise<number> => {
  const JSZip = await loadJSZip();
  const zip = new JSZip();
  const folder = zip.folder("fotografias") ?? zip;
  let done = 0;
  let included = 0;

  for (const photo of photos) {
    const blob = await fetchImageBlob(photo.src);
    if (blob) {
      const ext = extensionFor(blob, photo.src);
      folder.file(`${String(photo.order + 1).padStart(2, "0")}-${photo.id}.${ext}`, blob);
      included += 1;
    }
    done += 1;
    onProgress?.({ done, total: photos.length });
  }

  if (included === 0) throw new Error("no-photos");

  zip.file("leia-me.txt", buildReadmeText(eventTitle, photos.length, included));

  const blob = await zip.generateAsync({ type: "blob" });
  triggerBrowserDownload(blob, `${slugPrefix(eventTitle)}-fotografias.zip`);
  return included;
};

const buildReadmeText = (title: string, total: number, included: number) =>
  [
    `Click Creators Agency — Save Your Memory`,
    `Evento: ${title}`,
    `Fotografias incluídas: ${included} de ${total}`,
    "",
    "Nota: download gerado no browser a partir dos dados de demonstração (MOCK).",
    new Date().toISOString(),
    "",
  ].join("\n");
