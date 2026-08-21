export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  cliente: string;
  categoria: "Vídeo" | "Fotografia" | "Social Media" | "Branding" | "Campanhas";
  descricao: string;
  objetivo: string;
  solucao: string;
  resultados: string[];
  imagem: string;
  videos?: string[];
  galeria: string[];
  destaqueHome?: boolean;
}

export const portfolio: PortfolioProject[] = [
  {
    id: "1",
    slug: "campanha-urban-aura",
    title: "Campanha Summer Launch UrbanAura",
    cliente: "UrbanAura Apparel",
    categoria: "Campanhas",
    descricao: "Estratégia completa de branding e mídia social que transformou a presença digital da UrbanAura, aumentando a notoriedade e gerando recordes de vendas na nova coleção.",
    objetivo: "Lançar a coleção de verão da UrbanAura junto do público jovem urbano e aumentar a taxa de conversão no e-commerce em 200%.",
    solucao: "Desenvolvemos um conceito visual vibrante focado em streetwear, combinando gravações de vídeo em 4K no Porto, ativação com criadores de conteúdo e anúncios dinâmicos de alta performance.",
    resultados: [
      "+340% de alcance orgânico no Instagram & TikTok",
      "Recorde de vendas nas primeiras 48h de lançamento",
      "+2.5M de visualizações acumuladas nas redes sociais"
    ],
    imagem: "/img/modelo.jpeg",
    galeria: [
      "/img/modelo.jpeg",
      "/img/filmmaker-fotografo.jpeg",
      "/img/Default_img.jpeg"
    ],
    destaqueHome: true,
  },
  {
    id: "2",
    slug: "video-vortex-energy",
    title: "Commercial Film Vortex Energy",
    cliente: "Vortex Energy",
    categoria: "Vídeo",
    descricao: "Produção de vídeo comercial de alto impacto com estética dinâmica e sonoplastia envolvente para o lançamento do novo sabor tropical da bebida energética.",
    objetivo: "Capturar a energia jovem e desportiva da marca através de uma peça audiovisual com nível internacional para canais digitais.",
    solucao: "Produção cinematográfica com câmeras de alta velocidade, efeitos de motion graphics neons e ritmo de edição frenético alinhado às tendências do TikTok e Reels.",
    resultados: [
      "Mais de 1.8 Milhões de Impressões no YouTube & Meta",
      "Aumento de 85% na retenção média dos vídeos",
      "Prémio de destaque criativo em festival audiovisual digital"
    ],
    imagem: "/img/filmmaker-fotografo.jpeg",
    videos: ["https://www.w3schools.com/html/mov_bbb.mp4"],
    galeria: [
      "/img/filmmaker-fotografo.jpeg",
      "/img/Default_img.jpeg",
      "/img/modelo.jpeg"
    ],
    destaqueHome: true,
  },
  {
    id: "3",
    slug: "social-media-lumina",
    title: "Gestão Social Media & Estética Lumina Skin",
    cliente: "Lumina Skin",
    categoria: "Social Media",
    descricao: "Estratégia continuada de conteúdos minimalistas e tutoriais de dermocosmética que construíram uma comunidade altamente engajada.",
    objetivo: "Posicionar a Lumina Skin como autoridade em skincare limpo e sustentável no mercado nacional.",
    solucao: "Linha editorial focada em transparência de ingredientes, reels educativos de rotina e carrosséis com design editorial refinado.",
    resultados: [
      "Crescimento de +180% na comunidade do Instagram em 6 meses",
      "Taxa de engajamento 4.2x superior à média do setor",
      "+40% das vendas diretas atribuídas às redes sociais"
    ],
    imagem: "/img/Default_img.jpeg",
    galeria: [
      "/img/Default_img.jpeg",
      "/img/modelo.jpeg",
      "/img/filmmaker-fotografo.jpeg"
    ],
    destaqueHome: true,
  },
  {
    id: "4",
    slug: "rebranding-nova-dining",
    title: "Rebranding Completo Nova Dining",
    cliente: "Nova Dining",
    categoria: "Branding",
    descricao: "Criação de uma nova identidade de marca para o grupo gastronómico Nova Dining, unindo elegância clássica e modernidade arrojada.",
    objetivo: "Redefinir a percepção de valor do restaurante e alinhar a experiência física à presença digital.",
    solucao: "Desenvolvimento de símbolo tipográfico exclusivo, menus em papel tátil premium, sinalética e guia de estilo completo.",
    resultados: [
      "Percepção de marca premium consolidada",
      "Aumento de 50% na taxa de reservas online",
      "Destaque em revistas de design e gastronomia"
    ],
    imagem: "/img/modelo.jpeg",
    galeria: [
      "/img/modelo.jpeg",
      "/img/Default_img.jpeg"
    ],
    destaqueHome: true,
  },
  {
    id: "5",
    slug: "fotografia-pulse-fit",
    title: "Ensaio Fotográfico Editorial Pulse Fit",
    cliente: "Pulse Fit Club",
    categoria: "Fotografia",
    descricao: "Sessão fotográfica de alto rendimento com atletas e equipamentos de ponta para catálogo e outdoors digitais.",
    objetivo: "Gerar banco de imagens impactante para o novo ginásio conceito em Lisboa.",
    solucao: "Iluminação contraste dramático (chiaroscuro desportivo) valorizando a determinação, força e movimento dos atletas.",
    resultados: [
      "Mais de 100 imagens produzidas e tratadas em ultra-definição",
      "Imagens utilizadas em todas as campanhas nacionais de outdoor"
    ],
    imagem: "/img/filmmaker-fotografo.jpeg",
    galeria: [
      "/img/filmmaker-fotografo.jpeg",
      "/img/Default_img.jpeg"
    ],
    destaqueHome: false,
  },
  {
    id: "6",
    slug: "campanha-krypton-tech",
    title: "Lançamento Digital Krypton Smart App",
    cliente: "Krypton Tech",
    categoria: "Campanhas",
    descricao: "Campanha 360º de marketing digital e reels explicativos para atração de utilizadores para a nova aplicação de produtividade.",
    objetivo: "Alcançar 50,000 downloads na App Store e Google Play no primeiro mês de lançamento.",
    solucao: "Combinação de motion graphics futuristas, parcerias com influenciadores tech e estratégia de Paid Social de alta performance.",
    resultados: [
      "68,000+ Downloads alcançados no 1º mês",
      "Custo por Aquisição (CPA) 40% abaixo da estimativa inicial"
    ],
    imagem: "/img/Default_img.jpeg",
    galeria: [
      "/img/Default_img.jpeg",
      "/img/modelo.jpeg"
    ],
    destaqueHome: false,
  }
];