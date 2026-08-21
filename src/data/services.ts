export interface Service {
  id: string;
  number: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  deliverables: string[];
  process: { step: string; title: string; desc: string }[];
  benefits: string[];
}

export const services: Service[] = [
  {
    id: "1",
    number: "01",
    slug: "marketing-digital",
    title: "Marketing Digital",
    shortDescription: "Criamos estratégias para fortalecer a presença das marcas no ambiente digital, gerando resultados mensuráveis e crescimento sustentável.",
    fullDescription: "Desenvolvemos planos estratégicos de performance, gestão de campanhas de anúncios (Meta Ads, Google Ads, TikTok Ads) e otimização de funis de conversão. O nosso foco é transformar visitantes casuais em clientes fiéis através de comunicação altamente orientada a resultados.",
    image: "/img/Default_img.jpeg",
    deliverables: [
      "Estratégia de Campanhas Meta & Google Ads",
      "Funis de Vendas & Conversão",
      "SEO & Copywriting Estratégico",
      "Relatórios Semanais de Performance e ROI",
      "Automação de E-mail Marketing"
    ],
    process: [
      { step: "01", title: "Diagnóstico & Benchmarking", desc: "Análise profunda do mercado, concorrentes e público-alvo." },
      { step: "02", title: "Definição de Funil", desc: "Planeamento da jornada do cliente da atração à conversão." },
      { step: "03", title: "Execução & Mídia", desc: "Lançamento de campanhas segmentadas de alto impacto." },
      { step: "04", title: "Otimização Contínua", desc: "Testes A/B diários para maximizar o retorno do investimento." }
    ],
    benefits: [
      "Aumento mensurável do ROI",
      "Posicionamento de autoridade no mercado",
      "Geração constante de leads qualificados"
    ]
  },
  {
    id: "2",
    number: "02",
    slug: "producao-audiovisual",
    title: "Produção Audiovisual",
    shortDescription: "Produzimos fotografias, vídeos e conteúdos visuais que comunicam e geram impacto, contando histórias que conectam marcas e públicos.",
    fullDescription: "Da concepção do roteiro à pós-produção cinematográfica, criamos spots publicitários, reels dinâmicos, cobertura de eventos e ensaios fotográficos de produto. Equipada com tecnologia de ponta, a nossa equipa captura a essência da sua marca com estética contemporânea.",
    image: "/img/filmmaker-fotografo.jpeg",
    deliverables: [
      "Vídeos Promocionais & Comerciais",
      "Reels, Shorts & TikToks em Alta Resolução",
      "Fotografia Editorial & de Produto",
      "Cobertura de Eventos de Grande Porte",
      "Color Grading & Edição Profissional"
    ],
    process: [
      { step: "01", title: "Briefing & Storyboard", desc: "Criação do conceito visual e guião das filmagens." },
      { step: "02", title: "Produção & Gravação", desc: "Captação de imagem e áudio com iluminação de estúdio." },
      { step: "03", title: "Pós-Produção", desc: "Edição ritmada, sonoplastia, motion graphics e cor." },
      { step: "04", title: "Entrega Multiformato", desc: "Formatos otimizados para Instagram, YouTube, TV e web." }
    ],
    benefits: [
      "Retenção de atenção significativamente superior",
      "Estética de nível internacional",
      "Banco de imagens exclusivo para a sua marca"
    ]
  },
  {
    id: "3",
    number: "03",
    slug: "gestao-redes-sociais",
    title: "Gestão de Redes Sociais",
    shortDescription: "Planeamos e criamos conteúdos para aumentar o alcance e o envolvimento do público, construindo comunidades fiéis e engajadas.",
    fullDescription: "Transformamos o seu perfil nas redes sociais numa máquina de conexão e conversão. Cuidamos de todo o ecossistema: calendário editorial, design gráfico, redação de legendas, interação com a comunidade e análise contínua de métricas.",
    image: "/img/modelo.jpeg",
    deliverables: [
      "Calendário Editorial Mensal",
      "Criação de Conteúdos Estáticos e Animados",
      "Gestão de Comunidade e DMs",
      "Relatórios de Engajamento & Métricas",
      "Monitorização de Tendências e Trend-Jacking"
    ],
    process: [
      { step: "01", title: "Linha Editorial", desc: "Definição dos pilares de conteúdo e tom de voz." },
      { step: "02", title: "Criação de Conteúdo", desc: "Design de posts, carrosséis e carretéis de vídeo." },
      { step: "03", title: "Publicação & Agendamento", desc: "Distribuição nos horários de maior pico de audiência." },
      { step: "04", title: "Análise de Resultados", desc: "Ajustes estratégicos com base em dados reais." }
    ],
    benefits: [
      "Crescimento orgânico qualificado",
      "Fidelização e interação real com os seguidores",
      "Presença digital ativa 365 dias por ano"
    ]
  },
  {
    id: "4",
    number: "04",
    slug: "branding",
    title: "Branding & Identidade Visual",
    shortDescription: "Desenvolvemos elementos que ajudam a construir uma identidade forte e reconhecível para cada marca, diferenciando-a da concorrência.",
    fullDescription: "Criamos a alma visual da sua empresa. Do naming e logotipo ao manual de marca, tipografia, paleta de cores e aplicações físicas/digitais. Asseguramos que o seu negócio seja inesquecível e transmita valor premium em todos os pontos de contacto.",
    image: "/img/Default_img.jpeg",
    deliverables: [
      "Manual de Identidade Visual Completo",
      "Logotipo & Variações Responsivas",
      "Paleta de Cores & Tipografia Exclusiva",
      "Design de Embalagens & Stationery",
      "Brand Guidelines para Mídias Digitais"
    ],
    process: [
      { step: "01", title: "Imersão de Marca", desc: "Entendimento dos valores, propósito e essência." },
      { step: "02", title: "Moodboard & Conceitos", desc: "Exploração de caminhos visuais contemporâneos." },
      { step: "03", title: "Design & Refinamento", desc: "Construção dos símbolos, tipos e padrões gráficos." },
      { step: "04", title: "Brand Book Final", desc: "Entrega dos manuais e todos os ficheiros vetoriais." }
    ],
    benefits: [
      "Diferenciação imediata da concorrência",
      "Percepção de alto valor de mercado",
      "Consistência em todos os canais"
    ]
  }
];