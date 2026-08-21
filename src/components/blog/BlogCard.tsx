import React from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import type { BlogPost } from "../../data/blog";

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <article className="glass-card group p-6 rounded-3xl flex flex-col justify-between h-full border border-zinc-800 hover:border-lime-400/50 transition-all duration-300">
      <div>
        {/* Post Image Container */}
        <Link
          to={`/blog/${post.slug}`}
          className="block relative overflow-hidden rounded-2xl aspect-[16/10] mb-5 bg-slate-900 border border-zinc-800"
        >
          <img
            src={post.imagem}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-extrabold text-lime-400 border border-lime-400/30">
              {post.categoria}
            </span>
          </div>
        </Link>

        {/* Post Meta */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 mb-3">
          <span>{post.data}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {post.tempoLeitura}
          </span>
        </div>

        {/* Title */}
        <Link to={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-lime-300 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>
        </Link>

        {/* Summary */}
        <p className="text-zinc-300 text-xs leading-relaxed line-clamp-3 mb-6">
          {post.resumo}
        </p>
      </div>

      {/* Footer Author & Link */}
      <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
        <span className="text-xs font-medium text-zinc-400">
          {post.autor}
        </span>

        <Link
          to={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white hover:text-lime-400 transition-colors"
        >
          <span>Ler artigo</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};
