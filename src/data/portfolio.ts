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
  galeria: string[];
  destaqueHome?: boolean;
}

export const portfolio: PortfolioProject[] = [
  {
    id: "1",
    slug: "apresentacao-click-creators",
    title: "Vídeo de Apresentação Oficial Click Creators",
    cliente: "Click Creators Agency",
    categoria: "Vídeo",
    descricao: "Apresentação oficial da Click Creators Agency. Produção cinematográfica que resume a nossa visão, produção audiovisual de ponta, rede de criadores e impacto para marcas inovadoras.",
    objetivo: "Apresentar a agência com estética internacional, comunicando autoridade em Social Media, Marketing Digital, Conteúdo e Audiovisual.",
    solucao: "Conceção, captação em alta definição, edição dinâmica, color grading e sonoplastia envolvente alinhadas às tendências contemporâneas.",
    resultados: [
      "Vídeo principal de posicionamento da marca Click Creators",
      "Apresentação oficial para clientes e parceiros estratégicos",
      "Estética audiovisual cinematográfica de alto impacto"
    ],
    imagem: "/img/filmmaker-fotografo.jpeg",
    galeria: [
      "/img/filmmaker-fotografo.jpeg",
      "/img/modelo.jpeg",
      "/img/Default_img.jpeg"
    ],
    destaqueHome: true,
  },
  {
    id: "2",
    slug: "casting-global-lead-networking",
    title: "Casting Audiovisual — Parceria Global Lead Networking",
    cliente: "Global Lead Networking",
    categoria: "Vídeo",
    descricao: "A Click Creators Agency, em parceria com a Global Lead Networking, na preparação do casting e desenvolvimento de novas oportunidades para quem quer crescer no mundo das produções audiovisuais.",
    objetivo: "Criar uma oportunidade única no setor audiovisual através de um processo estruturado de preparação e seleção de novos talentos.",
    solucao: "Cobertura completa dos bastidores, registo de casting em vídeo com ritmo envolvente e campanha promocional de atração.",
    resultados: [
      "Elevada participação e adesão de novos talentos audiovisuais",
      "Parceria estratégica de formação e casting consolidada",
      "Forte tração e partilha orgânica nas redes sociais"
    ],
    imagem: "/img/Default_img.jpeg",
    galeria: [
      "/img/Default_img.jpeg",
      "/img/filmmaker-fotografo.jpeg",
      "/img/modelo.jpeg"
    ],
    destaqueHome: true,
  },
  {
    id: "3",
    slug: "white-sunset-white-sensation-beira",
    title: "Campanha White Sunset — White Sensation Beira",
    cliente: "White Sensation Beira",
    categoria: "Vídeo",
    descricao: "Contagem decrescente e cobertura dos preparativos para a WHITE SUNSET – White Sensation Beira. Cada detalhe preparado para proporcionar uma experiência memorável.",
    objetivo: "Gerar antecipação, engajamento e dinamizar a venda de ingressos para um dos eventos mais aguardados da Beira.",
    solucao: "Produção de vídeo teaser de contagem decrescente com montagem enérgica, efeitos sonoros e identidade visual marcante.",
    resultados: [
      "Grande impacto e partilha nas comunidades locais e digitais",
      "Aumento exponencial na procura de bilhetes na fase de contagem decrescente",
      "Produção audiovisual com registo vibrante e imersivo"
    ],
    imagem: "/img/modelo.jpeg",
    galeria: [
      "/img/modelo.jpeg",
      "/img/Default_img.jpeg",
      "/img/filmmaker-fotografo.jpeg"
    ],
    destaqueHome: true,
  },
  {
    id: "4",
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
    id: "5",
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
    id: "6",
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
    id: "7",
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