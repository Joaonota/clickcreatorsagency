export interface Partner {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  category?: string;
  description?: string;
}

/* ============================================================
   PARCEIROS — CLICK CREATORS AGENCY
   
   COMO ADICIONAR NOVOS PARCEIROS E LOGOTIPOS:
   1. Coloque o ficheiro SVG / PNG / WebP em: public/images/partners/
      (Ex.: public/images/partners/empresa-01.svg)
   2. Adicione ou edite o parceiro abaixo com o caminho do logo:
      {
        id: "partner-01",
        name: "Nome da Empresa",
        logo: "/images/partners/empresa-01.svg",
        website: "https://empresa.com",
      }
   3. Se `logo` não for fornecido ou estiver vazio, será automaticamente
      renderizado um wordmark tipográfico elegante com o nome da marca.
   ============================================================ */
export const partners: Partner[] = [
  {
    id: "partner-01",
    name: "Vortex Brands",
    logo: "/images/partners/partner-01.svg",
    website: "",
    category: "Bebidas & Lifestyle",
  },
  {
    id: "partner-02",
    name: "UrbanAura",
    logo: "/images/partners/partner-02.svg",
    website: "",
    category: "Moda & Cultura Urbana",
  },
  {
    id: "partner-03",
    name: "Lumina Skin",
    logo: "/images/partners/partner-03.svg",
    website: "",
    category: "Beleza & Cosmética",
  },
  {
    id: "partner-04",
    name: "Pulse Fit Club",
    logo: "/images/partners/partner-04.svg",
    website: "",
    category: "Desporto & Bem-Estar",
  },
  {
    id: "partner-05",
    name: "Nova Hospitality",
    logo: "/images/partners/partner-05.svg",
    website: "",
    category: "Hotelaria & Gastronomia",
  },
  {
    id: "partner-06",
    name: "Krypton Tech",
    logo: "/images/partners/partner-06.svg",
    website: "",
    category: "Tecnologia & Inovação",
  },
  {
    id: "partner-07",
    name: "Aura Media Group",
    logo: "/images/partners/partner-07.svg",
    website: "",
    category: "Entretenimento & Mídia",
  },
  {
    id: "partner-08",
    name: "Norde Retail",
    logo: "/images/partners/partner-08.svg",
    website: "",
    category: "Retalho & E-Commerce",
  },
];
