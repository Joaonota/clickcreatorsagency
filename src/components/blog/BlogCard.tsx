import React from "react";
import { Link } from "react-router-dom";
import type { BlogPost } from "../../data/blog";

export const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <article className="group flex flex-col h-full">
    <Link to={`/blog/${post.slug}`} className="media-frame aspect-[16/10] block">
      <img src={post.imagem} alt={post.title} loading="lazy" />
    </Link>

    <div className="flex items-center gap-3 pt-5 pb-3">
      <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.22em] text-[var(--primary)]">
        {post.categoria}
      </span>
      <span className="w-4 h-px bg-zinc-600" aria-hidden="true" />
      <span className="text-[0.62rem] font-semibold uppercase tracking-widest muted">
        {post.data}
      </span>
    </div>

    <Link to={`/blog/${post.slug}`}>
      <h3 className="display-sm group-hover:text-[var(--primary)] transition-colors duration-300 line-clamp-2">
        {post.title}
      </h3>
    </Link>

    <p className="text-xs muted leading-relaxed mt-3 line-clamp-2">{post.resumo}</p>

    <div className="hairline-t mt-auto pt-4 mt-5 flex items-center justify-between">
      <span className="text-[0.62rem] font-semibold uppercase tracking-widest muted">
        {post.autor} · {post.tempoLeitura}
      </span>
      <Link
        to={`/blog/${post.slug}`}
        aria-label={`Ler artigo: ${post.title}`}
        className="arrow-link !text-[0.6rem]"
      >
        <span>Ler</span>
        <span className="arrow-line" aria-hidden="true" />
      </Link>
    </div>
  </article>
);
