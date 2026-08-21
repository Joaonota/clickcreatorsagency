export interface Partner {
  id: string;
  name: string;
  category: string;
  logo?: string;
  website?: string;
}

/* Placeholders até os logos reais serem fornecidos.
   Quando existir ficheiro real, basta preencher `logo` (ex.: "/images/partners/partner-01.svg")
   e opcionalmente `website`. Sem logo, é renderizado um wordmark tipográfico. */
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
