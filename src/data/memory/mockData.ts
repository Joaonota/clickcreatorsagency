/* ============================================================
   SAVE YOUR MEMORY — DADOS DE DEMONSTRAÇÃO (MOCK)
   ------------------------------------------------------------
   ⚠️  MOCK DATA — Phase 1 (sem backend)
   - Todos os eventos, categorias e fotografias nesta pasta são
     FALCOS (dados de demonstração) e vivem apenas em memória.
   - Imagens de capa/galeria reutilizam ficheiros existentes do
     projecto (public/camapnhas e public/img) — apenas para
     teste visual; o backend trará as fotografias reais.
   - Uploads feitos no painel admin demo criam blob URLs de
     sessão — nada é gravado num servidor.
   - Para integrar o backend real: substituir store/mock por
     chamadas de API mantendo a mesma interface (memoryApi).
   ============================================================ */

import type { MemoryCategory, MemoryEvent, MemoryPhoto } from "./types";

/* ---------- Helpers de imagens de demonstração -------------- */

/** Pool de imagens existentes do projecto — só para teste. */
const TEST_IMAGES: string[] = [
  "/camapnhas/Casting.jpeg",
  "/camapnhas/entretenimento.jpeg",
  "/camapnhas/MoveRun.jpeg",
  "/camapnhas/MOYO%20BIZ.jpeg",
  "/img/Default_img.jpeg",
  "/img/filmmaker-fotografo.jpeg",
  "/img/Modelos2.jpeg",
  "/img/modelo.jpeg",
];

/** Escolhe ciclicamente uma imagem do pool de teste. */
const testImage = (index: number) => TEST_IMAGES[index % TEST_IMAGES.length];

const demoTimestamp = (dayOffset: number) =>
  new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000).toISOString();

interface DemoPhotoSpec {
  eventId: string;
  slug: string;
  count: number;
}

/** Gera N fotografias demo para um evento, com imagens do pool local e tempo real de render reproduzível. */
function buildDemoPhotos(
  spec: DemoPhotoSpec,
  baseDaysAgo: number,
  poolOffset: number
): MemoryPhoto[] {
  const shortTitle = spec.slug
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");

  return Array.from({ length: spec.count }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: `ph-${spec.slug}-${number}`,
      eventId: spec.eventId,
      src: testImage(poolOffset + index),
      alt: `${shortTitle} — fotografia ${number}`,
      order: index,
      createdAt: demoTimestamp(baseDaysAgo * 24 - index),
    };
  });
}

/* ------------ Categorias demo ------------------------------- */

export const demoCategories: MemoryCategory[] = [
  { id: "cat-marca", slug: "marca-produtos", name: "Marca & Produtos", createdAt: demoTimestamp(400) },
  { id: "cat-corporativo", slug: "eventos-corporativos", name: "Eventos Corporativos", createdAt: demoTimestamp(380) },
  { id: "cat-cultura", slug: "cultura-entretenimento", name: "Cultura & Entretenimento", createdAt: demoTimestamp(350) },
  { id: "cat-desporto", slug: "desporto-lifestyle", name: "Desporto & Lifestyle", createdAt: demoTimestamp(320) },
  { id: "cat-casting", slug: "casting-talentos", name: "Casting & Talentos", createdAt: demoTimestamp(300) },
];

/* ------------ Eventos demo ---------------------------------- */

export const demoEvents: MemoryEvent[] = [
  {
    id: "evt-yango-beira",
    slug: "yango-lancamento-beira",
    title: "Yango — Lançamento na Beira",
    description:
      "Cobertura completa do lançamento da Yango na Beira: palco principal, convidados, test-drives e after-party. Uma noite em que a marca encontrou a cidade, registada ao segundo pela nossa equipa.",
    date: "2026-10-11",
    categoryId: "cat-marca",
    cover: testImage(1),
    coverAlt: "Capa — Yango, Lançamento na Beira",
    status: "published",
    createdAt: demoTimestamp(60),
    updatedAt: demoTimestamp(12),
  },
  {
    id: "evt-moyo-biz",
    slug: "moyo-biz-summit-2026",
    title: "Moyo Biz Summit 2026",
    description:
      "O maior summit de negócios e criatividade da Beira. Painéis, workshops de networking e cerimónia de prémios — fotografia corporativa com direção de luz e enquadramentos editoriais.",
    date: "2026-09-26",
    categoryId: "cat-corporativo",
    cover: testImage(3),
    coverAlt: "Capa — Moyo Biz Summit 2026",
    status: "published",
    createdAt: demoTimestamp(75),
    updatedAt: demoTimestamp(30),
  },
  {
    id: "evt-move-run",
    slug: "move-run-city-race",
    title: "Move Run — City Race Beira",
    description:
      "A corrida urbana que transformou a avenida principal numa festa. Largada, hidratação, meta e celebração — cobertura desportiva com fotógrafos posicionados ao longo do percurso.",
    date: "2026-08-02",
    categoryId: "cat-desporto",
    cover: testImage(2),
    coverAlt: "Capa — Move Run, City Race Beira",
    status: "published",
    createdAt: demoTimestamp(120),
    updatedAt: demoTimestamp(45),
  },
  {
    id: "evt-2m-sabores",
    slug: "2m-campanha-sabores",
    title: "2M — Sabores de Verão",
    description:
      "A campanha de verão da 2M levou produção fotográfica às praias e mercados da cidade. Direção de arte, modelos locais e finalização em editorial de lifestyle.",
    date: "2026-07-18",
    categoryId: "cat-marca",
    cover: testImage(6),
    coverAlt: "Capa — 2M, Sabores de Verão",
    status: "published",
    createdAt: demoTimestamp(140),
    updatedAt: demoTimestamp(90),
  },
  {
    id: "evt-casting-global",
    slug: "casting-global-lead",
    title: "Casting Global Lead",
    description:
      "Duas jornadas de casting para o novo rosto da Global Lead. Testes de câmara, polaroids, provas de figurino e momentos de bastidores com a equipa de direção criativa.",
    date: "2026-05-09",
    categoryId: "cat-casting",
    cover: testImage(0),
    coverAlt: "Capa — Casting Global Lead",
    status: "published",
    createdAt: demoTimestamp(200),
    updatedAt: demoTimestamp(160),
  },
  {
    id: "evt-noite-nova-era",
    slug: "noite-nova-era",
    title: "Noite Nova Era",
    description:
      "Aniversário da Nova Era com showcase musical, luzes de palco e energia de multidão. Reportagem fotográfica em baixa luz com toques de cor âmbar.",
    date: "2026-04-11",
    categoryId: "cat-cultura",
    cover: testImage(5),
    coverAlt: "Capa — Noite Nova Era",
    status: "published",
    createdAt: demoTimestamp(230),
    updatedAt: demoTimestamp(200),
  },
  // Evento em RASCUNHO — aparece só no painel admin, para demo do fluxo publicar/despublicar
  {
    id: "evt-turne-verao",
    slug: "turne-verao-2027",
    title: "Turné Verão 2027 — Preview",
    description:
      "Seleção preliminar das primeiras fotografias da turné de verão. Este evento está em rascunho — ainda não está visível na galeria pública. Revê a seleção e publica quando estiver pronto.",
    date: "2027-01-16",
    categoryId: "cat-cultura",
    cover: testImage(7),
    coverAlt: "Capa — Turné Verão 2027 (preview)",
    status: "draft",
    createdAt: demoTimestamp(6),
    updatedAt: demoTimestamp(1),
  },
];

/* ------------ Fotografias demo ------------------------------ */

const demoPhotoSpecs: DemoPhotoSpec[] = [
  { eventId: "evt-yango-beira", slug: "yango-beira", count: 14 },
  { eventId: "evt-moyo-biz", slug: "moyo-biz-26", count: 12 },
  { eventId: "evt-move-run", slug: "move-run", count: 10 },
  { eventId: "evt-2m-sabores", slug: "2m-sabores", count: 8 },
  { eventId: "evt-casting-global", slug: "casting-global", count: 16 },
  { eventId: "evt-noite-nova-era", slug: "noite-nova-era", count: 9 },
  { eventId: "evt-turne-verao", slug: "turne-verao", count: 6 },
];

export const demoPhotos: MemoryPhoto[] = demoPhotoSpecs.flatMap((spec, setIndex) =>
  buildDemoPhotos(spec, 10 + setIndex * 8, setIndex * 3)
);

/* ------------ Todo o conjunto demo (para restaurar) --------- */

export function createDemoMemoryDataset(): {
  events: MemoryEvent[];
  categories: MemoryCategory[];
  photos: MemoryPhoto[];
} {
  return {
    events: demoEvents.map((event) => ({ ...event })),
    categories: demoCategories.map((category) => ({ ...category })),
    photos: demoPhotos.map((photo) => ({ ...photo })),
  };
}
