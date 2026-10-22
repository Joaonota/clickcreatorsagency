export interface Creator {
  id: string;
  slug: string;
  name: string;
  username: string;
  category: "Lifestyle" | "Fashion" | "Beauty" | "Fitness" | "Entertainment" | "Food" | "Travel" | "Technology" | "Comedy" | "Music" | "Director Criativo" | "Social Mídia";
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
    id: "creator-gabriel",
    slug: "gabriel-vilanculo",
    name: "Gabriel Vilanculo",
    username: "",
    category: "Director Criativo",
    image: "/img/Team/Gabriel Vilanculo (Director Criativo).jpeg",
    shortDescription: "Director Criativo da Click Creators Agency.",
    bio: "Director Criativo da Click Creators Agency.",
    followers: {
      instagram: "",
      tiktok: "",
      youtube: ""
    },
    stats: {
      engagementRate: "",
      totalReach: "",
      completedCampaigns: 0
    },
    redes: {
      instagram: "",
      tiktok: "",
      youtube: ""
    },
    gallery: []
  },
  {
    id: "creator-nicole",
    slug: "nicole-do-rego",
    name: "Nicole dó Rego",
    username: "",
    category: "Social Mídia",
    image: "/img/Team/Nicole dó Rego (Social Mídia).jpg.jpeg",
    shortDescription: "Social Mídia da Click Creators Agency.",
    bio: "Social Mídia da Click Creators Agency.",
    followers: {
      instagram: "",
      tiktok: "",
      youtube: ""
    },
    stats: {
      engagementRate: "",
      totalReach: "",
      completedCampaigns: 0
    },
    redes: {
      instagram: "",
      tiktok: "",
      youtube: ""
    },
    gallery: []
  }
];
