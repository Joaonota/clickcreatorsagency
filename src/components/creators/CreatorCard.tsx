import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Creator } from "../../data/creators";
import { InstagramIcon } from "../common/SocialIcons";

interface CreatorCardProps {
  creator: Creator;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({ creator }) => {
  return (
    <div className="glass-card group p-6 rounded-3xl flex flex-col justify-between h-full border border-zinc-800 hover:border-lime-400/50 transition-all duration-300">
      <div>
        {/* Creator Image Box */}
        <div className="relative overflow-hidden rounded-2xl aspect-[4/5] mb-5 bg-slate-900 border border-zinc-800">
          <img
            src={creator.image}
            alt={creator.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-extrabold text-lime-400 border border-lime-400/30">
              {creator.category}
            </span>
          </div>
        </div>

        {/* Creator Identity */}
        <div className="mb-3">
          <h3 className="text-xl font-extrabold text-white group-hover:text-lime-300 transition-colors">
            {creator.name}
          </h3>
          <span className="text-xs font-bold text-lime-400">
            {creator.username}
          </span>
        </div>

        {/* Bio */}
        <p className="text-zinc-300 text-xs leading-relaxed line-clamp-2 mb-6">
          {creator.shortDescription}
        </p>
      </div>

      {/* Footer Socials & Profile Link */}
      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-zinc-400">
          {creator.followers.instagram && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/5 px-2.5 py-1 rounded-lg">
              <InstagramIcon size={12} className="text-lime-400" />
              {creator.followers.instagram}
            </span>
          )}
        </div>

        <Link
          to={`/creators/${creator.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white hover:text-lime-400 transition-colors"
        >
          <span>Ver perfil</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
