import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Calendar, User } from "lucide-react";
import { BlogCard } from "../components/blog/BlogCard";
import { CTASection } from "../components/common/CTASection";
import { NotFound } from "./NotFound.tsx";
import { apiService } from "../services/api";
import type { BlogPost } from "../data/blog";

export const BlogDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      apiService.getBlogPostBySlug(slug).then((data) => {
        if (!isMounted) return;
        if (data) {
          setPost(data);
          document.title = `${data.title} | Click Creators Agency`;
          apiService.getBlogPosts().then((all) => {
            if (isMounted) setRelated(all.filter((p) => p.slug !== slug).slice(0, 2));
          });
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading && slug) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col gap-0">
      {/* ARTICLE HEADER */}
      <section className="relative py-16 lg:py-24 bg-slate-950 border-b border-zinc-800">
        <div className="container max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-lime-400 mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Voltar ao Blog</span>
          </Link>

          <span className="badge mb-4">{post.categoria}</span>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-xs text-zinc-400 pb-8 border-b border-zinc-800 mb-8 flex-wrap">
            <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
              <User size={14} className="text-lime-400" />
              {post.autor}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {post.data}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {post.tempoLeitura}
            </span>
          </div>

          {/* FEATURED IMAGE */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 aspect-[16/9] mb-12 bg-slate-900 shadow-2xl">
            <img src={post.imagem} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* BODY PARAGRAPHS */}
          <div className="prose prose-invert max-w-none text-zinc-300 text-base md:text-lg leading-relaxed flex flex-col gap-6">
            {post.conteudo.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED ARTICLES */}
      {related.length > 0 && (
        <section className="section-padding bg-slate-900/40 border-t border-zinc-800">
          <div className="container max-w-4xl">
            <h3 className="text-2xl font-bold text-white mb-8">Artigos Relacionados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((p) => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </div>
  );
};
