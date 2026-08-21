import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, BarChart3, Users, Award } from "lucide-react";
import { ImageGallery } from "../components/common/ImageGallery";
import { Button } from "../components/common/Button";
import { NotFound } from "./NotFound.tsx";
import { apiService } from "../services/api";
import type { Creator } from "../data/creators";
import { InstagramIcon, YoutubeIcon } from "../components/common/SocialIcons";

export const CreatorDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (slug) {
      apiService.getCreatorBySlug(slug).then((data) => {
        if (!isMounted) return;
        if (data) {
          setCreator(data);
          document.title = `${data.name} (${data.username}) | Click Creators Agency`;
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
        <div className="w-10 h-10 border-4 border-lime-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!creator) {
    return <NotFound />;
  }

  const whatsappUrl = `https://wa.me/351912345678?text=${encodeURIComponent(
    `Olá Click Creators! Gostaria de agendar uma campanha com o(a) creator ${creator.name} (${creator.username}).`
  )}`;

  return (
    <div className="flex flex-col gap-0">
      {/* COVER & HERO HEADER */}
      <section className="relative bg-slate-950 border-b border-zinc-800 pb-16 pt-8">
        <div className="container">
          <Link
            to="/creators"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-lime-400 mb-6 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Voltar aos Creators</span>
          </Link>

          {/* COVER BANNER */}
          <div className="relative overflow-hidden rounded-3xl h-64 md:h-80 border border-zinc-800 mb-8 bg-slate-900">
            <img
              src={creator.coverImage || creator.image}
              alt={creator.name}
              className="w-full h-full object-cover filter brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          {/* PROFILE INFO ROW */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-20 relative z-10 px-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-slate-950 shadow-2xl bg-slate-900 shrink-0">
                <img src={creator.image} alt={creator.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="badge w-fit">{creator.category}</span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white">{creator.name}</h1>
                <span className="text-base font-semibold text-lime-400">{creator.username}</span>
              </div>
            </div>

            <Button
              href={whatsappUrl}
              variant="whatsapp"
              size="lg"
              icon={<MessageCircle size={20} />}
            >
              Trabalhar com este Creator
            </Button>
          </div>
        </div>
      </section>

      {/* STATS & BIOGRAPHY */}
      <section className="section-padding bg-slate-900/40">
        <div className="container">
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border border-zinc-800 hover:border-lime-400/50 transition-colors">
              <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-400/30">
                <BarChart3 size={24} />
              </div>
              <div>
                <span className="block text-xs font-semibold text-zinc-400">Taxa de Engajamento</span>
                <span className="text-xl font-extrabold text-white">{creator.stats.engagementRate}</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border border-zinc-800 hover:border-lime-400/50 transition-colors">
              <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-400/30">
                <Users size={24} />
              </div>
              <div>
                <span className="block text-xs font-semibold text-zinc-400">Alcance Mensal</span>
                <span className="text-xl font-extrabold text-white">{creator.stats.totalReach}</span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl flex items-center gap-4 border border-zinc-800 hover:border-lime-400/50 transition-colors">
              <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400 border border-lime-400/30">
                <Award size={24} />
              </div>
              <div>
                <span className="block text-xs font-semibold text-zinc-400">Campanhas Realizadas</span>
                <span className="text-xl font-extrabold text-white">{creator.stats.completedCampaigns}+</span>
              </div>
            </div>
          </div>

          {/* BIO SECTION */}
          <div className="glass-card p-8 md:p-12 rounded-3xl border border-zinc-800 mb-12">
            <h3 className="text-2xl font-bold text-white mb-4">Sobre {creator.name}</h3>
            <p className="text-zinc-300 text-base leading-relaxed mb-6">{creator.bio}</p>

            <div className="flex items-center gap-3 flex-wrap pt-6 border-t border-zinc-800">
              <span className="text-xs font-bold text-zinc-400 uppercase">Redes Sociais:</span>
              {creator.redes.instagram && (
                <a
                  href={creator.redes.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-lime-500/10 text-zinc-200 hover:text-lime-400 border border-zinc-800 hover:border-lime-400/30 text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <InstagramIcon size={16} />
                  <span>Instagram ({creator.followers.instagram})</span>
                </a>
              )}
              {creator.redes.youtube && (
                <a
                  href={creator.redes.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-lime-500/10 text-zinc-200 hover:text-lime-400 border border-zinc-800 hover:border-lime-400/30 text-xs font-semibold flex items-center gap-2 transition-all"
                >
                  <YoutubeIcon size={16} />
                  <span>YouTube ({creator.followers.youtube})</span>
                </a>
              )}
            </div>
          </div>

          {/* GALLERY OF WORK */}
          {creator.gallery && creator.gallery.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Trabalhos & Conteúdos Recentes</h3>
              <ImageGallery images={creator.gallery} columns={3} aspectRatio="square" />
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="section-padding bg-slate-950 border-t border-zinc-800 text-center">
        <div className="container flex flex-col items-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">
            Quer contratar o(a) {creator.name} para a sua marca?
          </h2>
          <p className="text-zinc-300 text-base max-w-2xl mb-8">
            Entre em contacto direto com a equipa da Click Creators Agency para consultar disponibilidade e formatos de parceria.
          </p>
          <Button href={whatsappUrl} variant="whatsapp" size="lg" icon={<MessageCircle size={20} />}>
            Falar connosco sobre {creator.name}
          </Button>
        </div>
      </section>
    </div>
  );
};
