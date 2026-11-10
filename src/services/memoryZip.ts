/* ============================================================
   SAVE YOUR MEMORY — Download ZIP (cliente)
   ------------------------------------------------------------
   Constrói no browser (JSZip) um ZIP com as fotografias
   publicadas de um evento, a partir dos URLs assinados do
   Supabase Storage. Os vídeos ficam de fora (ficheiros grandes)
   e descarregam-se individualmente.
   Não usa proxies externos: os URLs assinados são privados.
   ============================================================ */

import type { MemoryMedia } from "../data/memory";

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
  "image/heic": "heic",
  "image/heif": "heif",
};

const extensionFor = (blob: Blob, fileName: string): string => {
  const declared = EXT_BY_MIME[blob.type];
  if (declared) return declared;
  const match = /\.([a-z0-9]{2,5})$/i.exec(fileName);
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

/** Abre um URL de descarga (ex.: URL assinado com Content-Disposition). */
export const openDownloadUrl = (url: string) => {
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
};

const fetchBlob = async (src: string): Promise<Blob | null> => {
  try {
    const response = await fetch(src, { mode: "cors" });
    if (!response.ok) return null;
    return await response.blob();
  } catch {
    return null;
  }
};

const slugPrefix = (title: string) =>
  title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
    .slice(0, 48) || "evento";

/**
 * Compila e descarrega todas as fotografias de um evento em ZIP.
 * Devolve quantas fotografias foram incluídas com sucesso.
 */
export const downloadEventPhotosZip = async (
  media: MemoryMedia[],
  eventTitle: string,
  onProgress?: (progress: ZipProgress) => void
): Promise<number> => {
  const photos = media.filter((item) => item.type === "image");
  const JSZip = await loadJSZip();
  const zip = new JSZip();
  const folder = zip.folder("fotografias") ?? zip;
  let done = 0;
  let included = 0;

  for (const photo of photos) {
    const blob = await fetchBlob(photo.src);
    if (blob) {
      const ext = extensionFor(blob, photo.fileName);
      folder.file(`${String(included + 1).padStart(3, "0")}.${ext}`, blob);
      included += 1;
    }
    done += 1;
    onProgress?.({ done, total: photos.length });
  }

  if (included === 0) throw new Error("no-photos");

  zip.file(
    "leia-me.txt",
    [
      "Click Creators Agency — Save Your Memory",
      `Evento: ${eventTitle}`,
      `Fotografias incluídas: ${included} de ${photos.length}`,
      new Date().toISOString(),
      "",
    ].join("\n")
  );

  const blob = await zip.generateAsync({ type: "blob" });
  triggerBrowserDownload(blob, `${slugPrefix(eventTitle)}-fotografias.zip`);
  return included;
};
