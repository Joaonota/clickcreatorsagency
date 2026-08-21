import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "../components/home/HeroSection";
import { SectionTitle } from "../components/common/SectionTitle";
import { ServiceCard } from "../components/services/ServiceCard";
import { PortfolioCard } from "../components/portfolio/PortfolioCard";
import { CreatorCard } from "../components/creators/CreatorCard";
import { BlogCard } from "../components/blog/BlogCard";
import { CTASection } from "../components/common/CTASection";
import { Button } from "../components/common/Button";
import { apiService } from "../services/api";
import type { Service } from "../data/services";
import type { PortfolioProject } from "../data/portfolio";
import type { Creator } from "../data/creators";
import type { BlogPost } from "../data/blog";
import type { ClientBrand } from "../data/clients";

export const Home: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [clients, setClients] = useState<ClientBrand[]>([]);
  const [activeCategory, setActiveCategory] = useState("Todos");

  useEffect(() => {
    document.title = "Click Creators Agency | Marketing Digital & Audiovisual";
    const loadData = async () => {
      const [sData, pData, cData, bData, clData] = await Promise.all([
        apiService.getServices(),
        apiService.getFeaturedPortfolio(),
        apiService.getCreators(),
        apiService.getBlogPosts(),
        apiService.getClients(),
      ]);
      setServices(sData);
      setProjects(pData);
      setCreators(cData.slice(0, 3));
      setPosts(bData.slice(0, 3));
      setClients(clData);
    };
    loadData();
  }, []);

  const categories = ["Todos", "Vídeo", "Fotografia", "Social Media", "Branding", "Campanhas"];

  const filteredProjects =
    activeCategory === "Todos"
      ? projects
      : projects.filter((p) => p.categoria.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="flex flex-col gap-0">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. AGENCY INTRO SECTION */}
      <section className="section-padding bg-slate-950 relative border-t border-zinc-800">
        <div className="container">
          <div className="glass-card p-8 sm:p-12 lg:p-16 rounded-3xl border border-lime-400/20 bg-gradient-to-r from-slate-950 via-zinc-900 to-slate-950 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-2xl text-left">
              <span className="badge mb-4">Quem Somos</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
                Mais do que conteúdo. <br />
                <span className="gradient-text">Criamos impacto.</span>
              </h2>
              <p className="text-base md:text-lg text-zinc-300 leading-relaxed">
                A Click Creators é uma agência de profissionais apaixonados por marketing digital e audiovisual. Trabalhamos para transformar ideias em conteúdos, experiências e estratégias que fortalecem marcas e aproximam empresas do seu público.
              </p>
            </div>

            <div className="shrink-0 w-full lg:w-auto">
              <Button
                to="/sobre"
                variant="primary"
                size="lg"
                icon={<ArrowRight size={18} />}
              >
                Conheça a Click Creators
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SERVICES SECTION */}
      <section className="section-padding bg-slate-900/40 relative">
        <div className="container">
          <SectionTitle
            badge="O Que Fazemos"
            title="Estratégias que posicionam a sua marca"
            subtitle="Soluções integradas de marketing, produção e criação para alavancar a sua presença no ambiente digital."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button to="/servicos" variant="outline" size="md" icon={<ArrowRight size={16} />}>
              Ver todos os serviços
            </Button>
          </div>
        </div>
      </section>

      {/* 4. PORTFOLIO SHOWCASE SECTION */}
      <section className="section-padding bg-slate-950 relative border-t border-zinc-800">
        <div className="container">
          <SectionTitle
            badge="Portfólio"
            title="Alguns trabalhos que falam por nós."
            subtitle="Explore casos de sucesso em vídeo, fotografia, branding e campanhas digitais de alto impacto."
          />

          {/* Category Filter Buttons */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-lime-400 text-slate-950 shadow-lg shadow-lime-500/20 scale-105"
                    : "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {filteredProjects.map((project) => (
              <PortfolioCard key={project.id} project={project} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button to="/portfolio" variant="primary" size="lg" icon={<ArrowRight size={18} />}>
              Explorar todos os projetos
            </Button>
          </div>
        </div>
      </section>

      {/* 5. CREATORS SHOWCASE SECTION */}
      <section className="section-padding bg-slate-900/40 relative">
        <div className="container">
          <SectionTitle
            badge="Creators & Influencers"
            title="Creators que dão vida às ideias."
            subtitle="Conheça os criadores associados à Click Creators e descubra diferentes vozes, estilos e comunidades."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {creators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button to="/creators" variant="outline" size="lg" icon={<ArrowRight size={18} />}>
              Ver todos os creators
            </Button>
          </div>
        </div>
      </section>

      {/* 6. CLIENT BRANDS SHOWCASE SECTION */}
      <section className="section-padding bg-slate-950 border-t border-zinc-800">
        <div className="container text-center">
          <span className="badge mb-4">Confiança & Parcerias</span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-10">
            Marcas que confiaram em nós
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
            {clients.map((client) => (
              <div
                key={client.id}
                className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center gap-2 group border border-zinc-800 hover:border-lime-400/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border border-zinc-700 mb-2 p-1">
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold text-white group-hover:text-lime-300 transition-colors">
                  {client.name}
                </span>
                <span className="text-[10px] text-zinc-400">{client.category}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. LATEST BLOG POSTS SECTION */}
      <section className="section-padding bg-slate-900/40 relative">
        <div className="container">
          <SectionTitle
            badge="Notícias & Tendências"
            title="Conteúdo que inspira e transforma"
            subtitle="Artigos, análises e dicas exclusivas da nossa equipa sobre marketing digital e tendências audiovisuais."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button to="/blog" variant="outline" size="md" icon={<ArrowRight size={16} />}>
              Aceder ao blog
            </Button>
          </div>
        </div>
      </section>

      {/* 8. CTA SECTION */}
      <CTASection />
    </div>
  );
};
