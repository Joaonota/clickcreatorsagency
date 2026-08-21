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
    id: "team-1",
    name: "Alexandre Silva",
    role: "Fundador & Diretor Criativo",
    bio: "Especialista em estratégia de conteúdo audiovisual e branding, com mais de 8 anos de experiência a transformar marcas na era digital.",
    image: "/img/Default_img.jpeg",
    socials: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "team-2",
    name: "Beatriz Santos",
    role: "Head of Social Media & Content",
    bio: "Mestre em Marketing Digital, apaixonada por estatísticas, tendências e construção de comunidades engajadas nas redes sociais.",
    image: "/img/modelo.jpeg",
    socials: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "team-3",
    name: "Carlos Ferreira",
    role: "Diretor de Fotografia & Vídeo",
    bio: "Filmmaker e fotógrafo profissional. Especialista em contar histórias através de lentes de alta precisão e iluminação cinematográfica.",
    image: "/img/filmmaker-fotografo.jpeg",
    socials: {
      instagram: "https://instagram.com",
    },
  },
  {
    id: "team-4",
    name: "Daniela Rocha",
    role: "Lead Creator Relations",
    bio: "Conecta marcas aos criadores de conteúdo certos. Gestora de campanhas de influenciadores com foco em ROI e autenticidade.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    socials: {
      instagram: "https://instagram.com",
      linkedin: "https://linkedin.com",
    },
  },
];
