import React from "react";

const colors = {
  light: {
    background: "#f8f9fa",
    border: "#e2e8f0",
    icon: "#7ea600",
    text: "#334155",
  },
  dark: {
    background: "#151515",
    border: "1px dashed #333",
    icon: "#b7ff00",
    text: "#a0a0a0",
  },
};

interface MediaPlaceholderProps {
  type: "image" | "logo" | "creator" | "portfolio" | "blog" | "partner";
  size?: "sm" | "md" | "lg";
}

export const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({
  type,
  size = "md",
}) => {
  const theme = (document.documentElement.getAttribute("data-theme") as
    | "light"
    | "dark") || "light";
  const c = colors[theme];

  const sizeMap = {
    sm: "h-24 w-24",
    md: "h-32 w-32",
    lg: "h-40 w-40",
  };

  const iconMap = {
    image: "✨",
    logo: "📛",
    creator: "👤",
    portfolio: "🎬",
    blog: "📝",
    partner: "🤝",
  };

  const labelMap = {
    image: "Imagem a adicionar",
    logo: "LOGO DO PARCEIRO",
    creator: "FOTO DO CREATOR",
    portfolio: "IMAGEM DO PROJETO",
    blog: "ARTIGO",
    partner: "LOGO DO PARCEIRO",
  };

  const descMap = {
    image: "IMAGEM A ADICIONAR",
    logo: "LOGO A SER ADICIONADA",
    creator: "FOTO DO CREATOR",
    portfolio: "IMAGEM DO PROJETO",
    blog: "ARTIGO A SER PUBLICADO",
    partner: "LOGO DO PARCEIRO",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md ${sizeMap[size]} bg-${c.background} border border-${c.border} transition-colors duration-300`}
      aria-label={labelMap[type]}
    >
      <div className="w-6 h-6 text-2xl mb-2 text-${c.icon}">
        {iconMap[type as keyof typeof iconMap]}
      </div>
      <p className="text-[0.65rem] font-medium text-${c.text} whitespace-nowrap line-clamp-1">{descMap[type as keyof typeof descMap]}</p>
    </div>
  );
};