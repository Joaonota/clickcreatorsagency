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
    id: "partner-2m",
    name: "2M",
    logo: "/parceiros/2M.png.webp",
    website: "",
    category: "Bebidas & Lifestyle",
    description: "Parceria de conteúdos e ativações de marca para a icónica cerveja 2M.",
  },
  {
    id: "partner-yango",
    name: "Yango",
    logo: "/parceiros/yango Logo.webp",
    website: "https://yango.com",
    category: "Mobilidade & Tecnologia",
    description: "Campanhas dinâmicas de mobilidade urbana e ativações digitais com criadores.",
  },
  {
    id: "partner-novaera",
    name: "Nova Era",
    logo: "/parceiros/Novaeralogo.PNG",
    website: "",
    category: "Música & Entretenimento",
    description: "Cobertura e produção de conteúdo para grandes eventos e entretenimento.",
  },
  {
    id: "partner-move",
    name: "Move",
    logo: "/parceiros/logo_move.png",
    website: "",
    category: "Telecomunicações & Digital",
    description: "Produção audiovisual e estratégia digital para plataformas mobile.",
  },
  {
    id: "partner-gln",
    name: "Global Lead Network",
    logo: "/parceiros/betwiner.jpeg",
    website: "",
    category: "Formação & Networking",
    description: "Parceria de casting, formação e desenvolvimento de novos criadores audiovisuais.",
  },

];

