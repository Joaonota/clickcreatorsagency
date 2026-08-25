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
    slug: "placeholder-creator",
    name: "Nome do Creator",
    username: "@username",
    category: "Lifestyle",
    image: "",
    coverImage: "",
    shortDescription: "Descrição do creator",
    bio: "Bio do creator",
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
    id: "creator-02",
    slug: "placeholder-creator-2",
    name: "Nome do Creator",
    username: "@username",
    category: "Fitness",
    image: "",
    coverImage: "",
    shortDescription: "Descrição do creator",
    bio: "Bio do creator",
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
    id: "creator-03",
    slug: "placeholder-creator-3",
    name: "Nome do Creator",
    username: "@username",
    category: "Fashion",
    image: "",
    coverImage: "",
    shortDescription: "Descrição do creator",
    bio: "Bio do creator",
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
    id: "creator-04",
    slug: "placeholder-creator-4",
    name: "Nome do Creator",
    username: "@username",
    category: "Travel",
    image: "",
    coverImage: "",
    shortDescription: "Descrição do creator",
    bio: "Bio do creator",
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
    id: "creator-05",
    slug: "placeholder-creator-5",
    name: "Nome do Creator",
    username: "@username",
    category: "Beauty",
    image: "",
    coverImage: "",
    shortDescription: "Descrição do creator",
    bio: "Bio do creator",
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
    id: "creator-06",
    slug: "placeholder-creator-6",
    name: "Nome do Creator",
    username: "@username",
    category: "Food",
    image: "",
    coverImage: "",
    shortDescription: "Descrição do creator",
    bio: "Bio do creator",
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