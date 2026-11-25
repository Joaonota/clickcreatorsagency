/* ============================================================
   SAVE YOUR MEMORY — links públicos das galerias
   ------------------------------------------------------------
   A URL pública usa apenas o `public_id` do evento (aleatório e
   imutável), nunca o UUID interno. É a mesma URL que vai no QR Code.
   ============================================================ */

/** Caminho público da galeria de um evento. */
export const memoryEventPath = (publicId: string) => `/memoria/e/${encodeURIComponent(publicId)}`;

/** Domínio público do site (VITE_PUBLIC_SITE_URL ou o domínio actual). */
export function publicSiteOrigin(): string {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  return configured || window.location.origin;
}

/** URL absoluta da galeria, pronta para copiar, partilhar e codificar no QR Code. */
export const memoryEventUrl = (publicId: string) => `${publicSiteOrigin()}${memoryEventPath(publicId)}`;
