export interface Partner {
  id: string;
  name: string;
  /* Caminho do logo real — ex.: "/images/partners/empresa-x.svg"
     Aceita SVG, PNG, WebP ou JPG. Enquanto estiver vazio,
     é renderizado um wordmark tipográfico elegante. */
  logo?: string;
  website?: string;
  description?: string;
  category?: string;
}

/* ============================================================
   PARCEIROS — PLACEHOLDERS DE DESENVOLVIMENTO
   (marcas fictícias alinhadas ao portfólio mockado)

   COMO ADICIONAR LOGOS REAIS:
   1. Colocar o ficheiro em: public/images/partners/
   2. Preencher `logo` abaixo (ex.: "/images/partners/vortex.svg")
   3. Opcionalmente preencher `website` e `description`
   Não é preciso alterar nenhum componente visual.
   ============================================================ */
export const partners: Partner[] = [
  { id: "p01", name: "Vortex Energy",  category: "Bebidas & Desporto" },
  { id: "p02", name: "UrbanAura",      category: "Fashion & Lifestyle" },
  { id: "p03", name: "Lumina Skin",    category: "Beleza & Bem-Estar" },
  { id: "p04", name: "Pulse Fit Club", category: "Fitness & Saúde" },
  { id: "p05", name: "Nova Dining",    category: "Gastronomia" },
  { id: "p06", name: "Krypton Tech",   category: "Tecnologia" },
  { id: "p07", name: "Aura Studio",    category: "Entretenimento" },
  { id: "p08", name: "Norde Market",   category: "Retalho & E-Commerce" },
];
