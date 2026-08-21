export interface ClientBrand {
  id: string;
  name: string;
  category: string;
  logo: string;
  website?: string;
}

export const clientBrands: ClientBrand[] = [
  {
    id: "brand-1",
    name: "UrbanAura Apparel",
    category: "Fashion & Lifestyle",
    logo: "/logo/logo.PNG",
    website: "https://example.com",
  },
  {
    id: "brand-2",
    name: "Vortex Energy",
    category: "Beverage & Sport",
    logo: "/logo/logo.PNG",
    website: "https://example.com",
  },
  {
    id: "brand-3",
    name: "Lumina Skin",
    category: "Beauty & Wellness",
    logo: "/logo/logo.PNG",
    website: "https://example.com",
  },
  {
    id: "brand-4",
    name: "Pulse Fit Club",
    category: "Fitness & Health",
    logo: "/logo/logo.PNG",
    website: "https://example.com",
  },
  {
    id: "brand-5",
    name: "Nova Dining",
    category: "Gastronomy",
    logo: "/logo/logo.PNG",
    website: "https://example.com",
  },
  {
    id: "brand-6",
    name: "Krypton Tech",
    category: "Technology",
    logo: "/logo/logo.PNG",
    website: "https://example.com",
  },
];
