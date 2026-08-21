import React, { useEffect, useState } from "react";
import { BlogCard } from "../components/blog/BlogCard";
import { CTASection } from "../components/common/CTASection";
import { apiService } from "../services/api";
import type { BlogPost } from "../data/blog";

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    document.title = "Blog & Notícias | Click Creators Agency";
    apiService.getBlogPosts().then(setPosts);
  }, []);

  const categories = ["Todos", "Marketing Digital", "Design & Vídeo", "Branding", "Audiovisual"];

  const filteredPosts =
    activeCategory === "Todos"
      ? posts
      : posts.filter((p) => p.categoria.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="flex flex-col gap-0">
      {/* PAGE HERO */}
      <section className="relative py-20 lg:py-28 bg-slate-950 overflow-hidden border-b border-white/10">
        <div className="container relative z-10 text-center flex flex-col items-center">
          <span className="badge mb-4">Blog & Insights</span>
          <h1 className="text-4xl md:text-7xl font-extrabold text-white tracking-tight mb-6 max-w-4xl">
            Notícias, estratégias e <br />
            <span className="gradient-text">tendências digitais.</span>
          </h1>
          <p className="text-base md:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed mb-8">
            Mantenha-se atualizado com os artigos e análises exclusivas dos nossos especialistas.
          </p>

          {/* Category Filter */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/40 scale-105"
                    : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="section-padding bg-slate-900/40">
        <div className="container">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              Nenhum artigo encontrado nesta categoria.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};
