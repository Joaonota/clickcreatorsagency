import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { BlogCard } from "../components/blog/BlogCard";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
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
    }
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading && slug) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return <NotFound />;

  return (
    <div className="flex flex-col">
      {/* Article hero */}
      <section className="pt-36 pb-12 lg:pt-48">
        <div className="container max-w-4xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-[0.66rem] font-extrabold uppercase tracking-[0.2em] text-zinc-500 hover:text-[var(--primary)] mb-10 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Notes from the Studio</span>
          </Link>

          <Reveal>
            <p className="eyebrow eyebrow-bare mb-6">{post.categoria}</p>
            <h1 className="display-lg mb-10">{post.title}</h1>
          </Reveal>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[0.62rem] font-extrabold uppercase tracking-[0.22em] text-zinc-500 hairline-t pt-5">
            <span>{post.autor}</span>
            <span>{post.data}</span>
            <span>{post.tempoLeitura} de leitura</span>
          </div>
        </div>
      </section>

      {/* Featured image */}
      <section>
        <div className="container max-w-5xl">
          <Reveal className="reveal-clip">
            <div className="media-frame aspect-video">
              <img src={post.imagem} alt={post.title} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section className="section-y">
        <div className="container max-w-3xl flex flex-col gap-7">
          {post.conteudo.map((paragraph, idx) => (
            <Reveal key={idx} delay={Math.min(idx, 2) as 0 | 1 | 2}>
              <p className={`leading-relaxed ${idx === 0 ? "lede" : "text-base muted"}`}>
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="hairline-t section-y bg-[var(--surface)]">
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {related.map((p, i) => (
              <Reveal key={p.id} delay={(i % 2) as 0 | 1}>
                <BlogCard post={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CTASection />
    </div>
  );
};
