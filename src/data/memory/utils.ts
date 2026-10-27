/* ============================================================
   SAVE YOUR MEMORY — Utils partilhados
   ============================================================ */

/** Normaliza texto para pesquisa: minúsculas, sem acentos. */
export const normalizeText = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Gera slug URL-safe a partir de um título. */
export const slugify = (value: string): string =>
  normalizeText(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

/** Garante slug único dentro da coleção (excluindo um id). */
export const ensureUniqueSlug = (
  base: string,
  collection: Array<{ id: string; slug: string }>,
  excludeId?: string
): string => {
  let slug = base || "evento";
  let suffix = 2;
  while (collection.some((item) => item.slug === slug && item.id !== excludeId)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
};

/** Formata data do evento (ISO) conforme o idioma ativo. */
export const formatEventDate = (isoDate: string, lang: "pt" | "en"): string => {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(lang === "pt" ? "pt-PT" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

/* ============================================================
   DEMO: capa de fallback para eventos sem imagem definida
   (reutiliza a imagem default do projecto; o backend trará
   as capas reais).
   ============================================================ */
export const placeholderCover = (): string => "/img/Default_img.jpeg";

/** Capa efetiva de um evento (faz fallback para placeholder demo). */
export const displayCover = (event: { cover: string }): string =>
  event.cover || placeholderCover();
