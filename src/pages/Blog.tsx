import React, { useEffect, useState } from "react";
import { BlogCard } from "../components/blog/BlogCard";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
import { apiService } from "../services/api";
import type { BlogPost } from "../data/blog";

export const BlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    document.title = "Blog & Insights | Click Creators Agency";
    apiService.getBlogPosts().then(setPosts);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">Blog & Insights</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">NOTES FROM</span>
            <span className="block text-outline">THE STUDIO</span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              Estratégias, tendências e bastidores — escritos pela equipa que vive o
              digital todos os dias.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Articles */}
      <section className="pb-24 lg:pb-32">
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) as 0 | 1 | 2} className={i % 3 === 1 ? "lg:mt-14" : i % 3 === 2 ? "lg:mt-7" : ""}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  );
};
