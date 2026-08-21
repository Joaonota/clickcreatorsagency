export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  categoria: string;
  data: string;
  autor: string;
  resumo: string;
  conteudo: string[];
  imagem: string;
  tempoLeitura: string;
  destaque?: boolean;
}

export const blog: BlogPost[] = [
  {
    id: "1",
    slug: "5-dicas-marketing-digital",
    title: "5 Dicas de Marketing Digital para Pequenas e Médias Empresas",
    categoria: "Marketing Digital",
    data: "15 de Março de 2025",
    autor: "Equipa Click Creators",
    resumo: "Descubra cinco estratégias essenciais que podem transformar a presença online da sua empresa e gerar mais leads qualificados com investimento inteligente.",
    conteudo: [
      "No mercado altamente competitivo atual, ter apenas um website bonito já não é suficiente. As marcas precisam de uma presença ativa, relevante e estratégica para destacar-se e converter utilizadores em clientes leais.",
      "1. Conheça a fundo a sua Persona Digital: Não tente falar para todos. Mapeie os hábitos, dores e desejos do seu cliente ideal para personalizar anúncios e mensagens.",
      "2. Invista em Conteúdo de Formato Curto (Reels & TikTok): O vídeo curto domina a retenção de atenção. Crie tutoriais de 15 a 30 segundos demonstrando o valor prático dos seus produtos.",
      "3. Otimize a sua Presença para Conversão Móvel: Mais de 80% do tráfego web em Portugal provém de dispositivos móveis. Garanta que o seu site carrega em menos de 2 segundos.",
      "4. Faça Testes A/B em Anúncios Pagos: Varie os ganchos (hooks), imagens e chamadas para ação (CTA) para identificar o criativo que gera menor Custo por Aquisição (CPA).",
      "5. Construa Relacionamento com Micro-Influenciadores: Parcerias estratégicas com criadores locais costumam gerar taxas de conversão 3x superiores às campanhas tradicionais."
    ],
    imagem: "/img/Default_img.jpeg",
    tempoLeitura: "5 min",
    destaque: true,
  },
  {
    id: "2",
    slug: "tendencias-visuais-2025",
    title: "Tendências Visuais e Audiovisuais que Definem o Mercado",
    categoria: "Design & Vídeo",
    data: "22 de Fevereiro de 2025",
    autor: "Marta Silva",
    resumo: "As principais tendências de estética, iluminação, ritmo de edição e paletas de cor que estão a dominar o cenário digital global.",
    conteudo: [
      "A estética visual das marcas evolui a um ritmo vertiginoso. O minimalismo estéril está a dar lugar a composições mais vibrantes, texturizadas e autênticas.",
      "Neste artigo, analisamos o surgimento da estética Lo-Fi de alta definição, a utilização estratégica de luzes neon e o regresso da fotografia analógica como elemento de diferenciação editorial."
    ],
    imagem: "/img/filmmaker-fotografo.jpeg",
    tempoLeitura: "7 min",
    destaque: true,
  },
  {
    id: "3",
    slug: "poder-do-storytelling",
    title: "O Poder do Storytelling Autêntico nas Marcas",
    categoria: "Branding",
    data: "10 de Janeiro de 2025",
    autor: "João Costa",
    resumo: "Como narrativas autênticas e humanas podem fortalecer a identidade da sua marca e criar conexões emocionais profundas com a comunidade.",
    conteudo: [
      "As pessoas não compram apenas produtos; compram as histórias e valores que esses produtos representam.",
      "Aprenda como estruturar a jornada do herói no branding corporativo e transformar clientes passivos em verdadeiros embaixadores da sua marca."
    ],
    imagem: "/img/modelo.jpeg",
    tempoLeitura: "6 min",
    destaque: false,
  },
  {
    id: "4",
    slug: "producao-audiovisual-social",
    title: "Por que Investir em Produção Audiovisual Profissional?",
    categoria: "Audiovisual",
    data: "5 de Janeiro de 2025",
    autor: "Equipa Click Creators",
    resumo: "Por que vídeos de alta qualidade cinematográfica se tornaram o ativo mais valioso de vendas no ambiente digital saturado de hoje.",
    conteudo: [
      "No mar de conteúdos amadores, a qualidade de imagem, o design de som e a iluminação profissional transmitem autoridade instantânea.",
      "Descubra como um único vídeo comercial bem produzido pode ser desdobrado em dezenas de formatos estratégicos para Instagram, TikTok e campanhas de anúncios."
    ],
    imagem: "/img/filmmaker-fotografo.jpeg",
    tempoLeitura: "4 min",
    destaque: false,
  }
];