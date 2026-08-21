export interface Creator {
  id: string;
  slug: string;
  name: string;
  username: string;
  category: "Lifestyle" | "Fashion" | "Beauty" | "Fitness" | "Entertainment" | "Food" | "Travel" | "Technology" | "Comedy" | "Music";
  image: string;
  coverImage?: string;
  bio: string;
  shortDescription: string;
  followers: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  stats: {
    engagementRate: string;
    totalReach: string;
    completedCampaigns: number;
  };
  redes: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
  };
  gallery: string[];
}

export const creators: Creator[] = [
  {
    id: "creator-01",
    slug: "marta-silva",
    name: "Marta Silva",
    username: "@martasilva",
    category: "Lifestyle",
    image: "/img/modelo.jpeg",
    coverImage: "/img/Default_img.jpeg",
    shortDescription: "Criadora de conteúdo focada em lifestyle, estética urbana e rotinas inspiradoras.",
    bio: "Marta Silva é uma das vozes mais autênticas do segmento de lifestyle em Portugal. Com uma estética cuidadosa e storytelling cativante, conecta marcas de prestígio a um público jovem altamente engajado.",
    followers: {
      instagram: "145K",
      tiktok: "220K",
      youtube: "45K"
    },
    stats: {
      engagementRate: "6.8%",
      totalReach: "1.2M /mês",
      completedCampaigns: 42
    },
    redes: {
      instagram: "https://instagram.com/martasilva",
      tiktok: "https://tiktok.com/@martasilva",
      youtube: "https://youtube.com/@martasilva"
    },
    gallery: [
      "/img/modelo.jpeg",
      "/img/filmmaker-fotografo.jpeg",
      "/img/Default_img.jpeg"
    ]
  },
  {
    id: "creator-02",
    slug: "joao-costa",
    name: "João Costa",
    username: "@joaocostafit",
    category: "Fitness",
    image: "/img/filmmaker-fotografo.jpeg",
    coverImage: "/img/Default_img.jpeg",
    shortDescription: "Atleta, personal trainer e motivador de hábitos saudáveis e superação.",
    bio: "João ajuda a transformar vidas através de treinos acessíveis, dicas de nutrição desportiva e desafios diários. Referência na comunidade de saúde e suplementação.",
    followers: {
      instagram: "98K",
      tiktok: "310K"
    },
    stats: {
      engagementRate: "8.2%",
      totalReach: "950K /mês",
      completedCampaigns: 28
    },
    redes: {
      instagram: "https://instagram.com/joaocostafit",
      tiktok: "https://tiktok.com/@joaocostafit"
    },
    gallery: [
      "/img/filmmaker-fotografo.jpeg",
      "/img/modelo.jpeg",
      "/img/Default_img.jpeg"
    ]
  },
  {
    id: "creator-03",
    slug: "sara-rocha",
    name: "Sara Rocha",
    username: "@sararocha.style",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    coverImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Fashion stylist, lookbooks minimalistas e curadoria de moda sustentável.",
    bio: "Especializada em tendências europeias de streetwear e alta-costura. Sara cria conteúdos de estilo, dicas de combinações e coberturas exclusivas de Fashion Weeks.",
    followers: {
      instagram: "180K",
      tiktok: "150K"
    },
    stats: {
      engagementRate: "7.1%",
      totalReach: "1.5M /mês",
      completedCampaigns: 56
    },
    redes: {
      instagram: "https://instagram.com/sararocha.style",
      tiktok: "https://tiktok.com/@sararocha.style"
    },
    gallery: [
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "creator-04",
    slug: "diogo-mendes",
    name: "Diogo Mendes",
    username: "@diogowanderer",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    coverImage: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Fotógrafo de viagens, explorador de destinos remotos e storyteller.",
    bio: "Diogo captura o mundo com lentes panorâmicas e roteiros cinematográficos. Parceiro ideal para cadeias hoteleiras, companhias aéreas e marcas de aventura.",
    followers: {
      instagram: "210K",
      youtube: "110K"
    },
    stats: {
      engagementRate: "9.4%",
      totalReach: "2.1M /mês",
      completedCampaigns: 34
    },
    redes: {
      instagram: "https://instagram.com/diogowanderer",
      youtube: "https://youtube.com/@diogowanderer"
    },
    gallery: [
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "creator-05",
    slug: "ana-lima",
    name: "Ana Lima",
    username: "@analimabeauty",
    category: "Beauty",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    coverImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Makeup artist, reviews honestas de skincare e tutoriais de beleza natural.",
    bio: "Com humor e técnica impecável, Ana desmistifica rotinas de beleza e testa lançamentos de cosmética. Conhecida pela sua transparência e reviews sem filtros.",
    followers: {
      instagram: "115K",
      tiktok: "450K"
    },
    stats: {
      engagementRate: "11.2%",
      totalReach: "3.4M /mês",
      completedCampaigns: 63
    },
    redes: {
      instagram: "https://instagram.com/analimabeauty",
      tiktok: "https://tiktok.com/@analimabeauty"
    },
    gallery: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ]
  },
  {
    id: "creator-06",
    slug: "rui-ferreira",
    name: "Rui Ferreira",
    username: "@ruigastro",
    category: "Food",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&q=80",
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Chef de cozinha, crítico gastronómico e especialista em receitas rápidas.",
    bio: "Rui transforma a culinária num espetáculo visual ritmado. Das tascas tradicionais à alta gastronomia, partilha segredos culinários com entusiasmo contagiante.",
    followers: {
      instagram: "85K",
      tiktok: "190K"
    },
    stats: {
      engagementRate: "7.9%",
      totalReach: "880K /mês",
      completedCampaigns: 22
    },
    redes: {
      instagram: "https://instagram.com/ruigastro",
      tiktok: "https://tiktok.com/@ruigastro"
    },
    gallery: [
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80"
    ]
  }
];