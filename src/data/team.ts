export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  socials: {
    instagram?: string;
    linkedin?: string;
    tiktok?: string;
  };
}

export const teamMembers: TeamMember[] = [
  {
    id: "team-gabriel",
    name: "Gabriel Vilanculo",
    role: "Director Criativo",
    bio: "Director Criativo da Click Creators Agency.",
    image: "/img/Team/Gabriel Vilanculo (Director Criativo).jpeg",
    socials: {},
  },
  {
    id: "team-alex",
    name: "Alex Homo",
    role: "Vice Diretor",
    bio: "Vice Diretor da Click Creators Agency.",
    image: "/img/Team/Alex Homo (Vice Diretor).jpeg",
    socials: {},
  },
  {
    id: "team-lorena",
    name: "Lorena Madeira",
    role: "Relações Públicas",
    bio: "Relações Públicas da Click Creators Agency.",
    image: "/img/Team/Lorena Madeira (Relações Públicas).jpeg",
    socials: {},
  },
  {
    id: "team-nicole",
    name: "Nicole do Rego",
    role: "Social Mídia",
    bio: "Social Mídia da Click Creators Agency.",
    image: "/img/Team/Nicole dó Rego (Social Mídia).jpg.jpeg",
    socials: {},
  },
  {
    id: "team-all",
    name: "All Team",
    role: "Equipa Completa",
    bio: "A equipa completa da Click Creators Agency.",
    image: "/img/Team/All_Teams.jpeg",
    socials: {},
  },
];
