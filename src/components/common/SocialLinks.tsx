import React from "react";
import { socialLinks } from "../../config/social";
import { InstagramIcon, LinkedinIcon, YoutubeIcon, FacebookIcon, TiktokIcon } from "./SocialIcons";

interface SocialLinksProps {
  className?: string;
  iconSize?: number;
  showLabels?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className = "",
  iconSize = 20,
  showLabels = false,
}) => {
  const links = [
    { name: "Instagram", url: socialLinks.instagram, icon: <InstagramIcon size={iconSize} /> },
    { name: "TikTok", url: socialLinks.tiktok, icon: <TiktokIcon size={iconSize} /> },
    { name: "YouTube", url: socialLinks.youtube, icon: <YoutubeIcon size={iconSize} /> },
    { name: "LinkedIn", url: socialLinks.linkedin, icon: <LinkedinIcon size={iconSize} /> },
    { name: "Facebook", url: socialLinks.facebook, icon: <FacebookIcon size={iconSize} /> },
  ];

  return (
    <div className={`flex items-center gap-3 flex-wrap ${className}`}>
      {links.map(
        (link) =>
          link.url && (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.name}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-400 border border-white/10 hover:border-purple-500/40 transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
            >
              {link.icon}
              {showLabels && <span className="text-xs font-semibold">{link.name}</span>}
            </a>
          )
      )}
    </div>
  );
};
