import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ImageGallery } from "../components/common/ImageGallery";
import { Reveal } from "../hooks/useReveal";
import { NotFound } from "./NotFound.tsx";
import { apiService } from "../services/api";
import type { Creator } from "../data/creators";

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
        <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!creator) return <NotFound />;

  const whatsappUrl = `https://wa.me/351912345678?text=${encodeURIComponent(
    `Olá Click Creators! Gostaria de agendar uma campanha com o(a) creator ${creator.name} (${creator.username}).`
  )}`;

  const socialChips = [
    creator.redes.instagram && {
      label: "Instagram",
      extra: creator.followers.instagram,
      url: creator.redes.instagram,
    },
    creator.redes.tiktok && {
      label: "TikTok",
      extra: creator.followers.tiktok,
      url: creator.redes.tiktok,
    },
    creator.redes.youtube && {
      label: "YouTube",
      extra: creator.followers.youtube,
      url: creator.redes.youtube,
    },
  ].filter(Boolean) as { label: string; extra?: string; url: string }[];

  return (
    <div className="flex flex-col">
      {/* Hero — fotografia grande */}
      <section className="relative min-h-[90svh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 z-0 media-frame">
          <img src={creator.coverImage || creator.image} alt={creator.name} className="kenburns" />
        </div>
        <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/45 to-[#0a0a0c]/40" />

        <div className="container relative z-10 pb-14 pt-44">
          <Link
            to="/creators"
            className="inline-flex items-center gap-2 text-[0.66rem] font-extrabold uppercase tracking-[0.2em] text-white/70 hover:text-[var(--primary)] mb-8 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Our Creators</span>
          </Link>

          <p className="eyebrow eyebrow-bare mb-5">{creator.category}</p>
          <h1 className="display-xl">{creator.name}</h1>
          <p className="text-lg font-bold text-[var(--primary)] tracking-wide mt-3">
            {creator.username}
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <section className="hairline-b bg-[var(--surface)]">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-y-8 py-10 lg:py-12">
          {[
            { value: creator.stats.engagementRate, label: "Engagement", accent: true },
            { value: creator.stats.totalReach, label: "Reach / mês" },
            { value: `${creator.stats.completedCampaigns}+`, label: "Campanhas" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1.5 md:border-l md:pl-5 border-[var(--border)]"
            >
              <span
                className={`font-display text-3xl lg:text-4xl leading-none ${
                  stat.accent ? "text-[var(--primary)]" : ""
                }`}
              >
                {stat.value}
              </span>
              <span className="text-[0.58rem] font-extrabold uppercase tracking-[0.24em] text-zinc-500">
                {stat.label}
              </span>
            </div>
          ))}
          <div className="col-span-2 md:col-span-1 flex items-end md:justify-end">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm w-full sm:w-auto justify-center"
            >
              <span>Work With This Creator →</span>
            </a>
          </div>
        </div>
      </section>

      {/* About + socials */}
      <section className="section-y">
        <div className="container grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow mb-6">About</p>
              <h2 className="display-sm mb-6">Sobre {creator.name.split(" ")[0]}</h2>
              <p className="lede">{creator.bio}</p>
            </Reveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-8 lg:pt-16">
            <Reveal delay={1}>
              <p className="index-num mb-4">Socials</p>
              <div className="flex flex-wrap gap-3">
                {socialChips.map((chip) => (
                  <a
                    key={chip.label}
                    href={chip.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 border border-[var(--border-strong)] px-5 py-3 transition-colors duration-300 hover:border-[var(--primary)]"
                  >
                    <span className="text-[0.66rem] font-extrabold uppercase tracking-[0.18em] group-hover:text-[var(--primary)] transition-colors">
                      {chip.label}
                    </span>
                    {chip.extra && (
                      <span className="text-xs muted">{chip.extra}</span>
                    )}
                    <span aria-hidden="true" className="text-[var(--primary)] text-xs">↗</span>
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={2}>
              <p className="index-num mb-4">Collaborations</p>
              <p className="muted text-sm leading-relaxed max-w-lg">
                {creator.name} já colaborou em {creator.stats.completedCampaigns} campanhas
                com marcas nacionais e internacionais — de lançamentos de produto a
                parcerias continuadas de conteúdo.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Selected content */}
      {creator.gallery && creator.gallery.length > 0 && (
        <section className="pb-24 hairline-t pt-16">
          <div className="container">
            <Reveal>
              <p className="eyebrow mb-10">Selected Content</p>
            </Reveal>
            <ImageGallery images={creator.gallery} columns={3} aspectRatio="square" />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="hairline-t bg-[var(--surface)] section-y">
        <div className="container flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow mb-6">Collaboration</p>
            <h2 className="display-lg max-w-3xl">
              QUER O(A) {creator.name.split(" ")[0].toUpperCase()} NA SUA MARCA?
            </h2>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg shrink-0">
            <span>Start a Collaboration →</span>
          </a>
        </div>
      </section>
    </div>
  );
};
