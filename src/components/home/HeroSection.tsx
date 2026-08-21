import React from "react";
import { Link } from "react-router-dom";
import { siteConfig } from "../../config/site";

export const HeroSection: React.FC = () => {
  const { heroVideo, heroPoster, heroLines } = siteConfig;

  return (
    <section className="relative min-h-\[100svh\] flex flex-col justify-end overflow-hidden force-dark">
      {/* Background media */}
      <div className="absolute inset-0 z-0">
        {heroVideo ? (
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={heroPoster}
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
        ) : (
          <img
            src={heroPoster}
            alt="Click Creators Agency — produção audiovisual"
            className="w-full h-full object-cover kenburns"
            fetchPriority="high"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/55 to-[var(--background)]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--background)]/80 via-transparent to-transparent" />
      </div>

      {/* Vertical side label */}
      <span className="vertical-label hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 z-10">
        Creative Agency — Porto
      </span>

      {/* Content */}
      <div className="container relative z-10 pb-14 pt-40 lg:pb-20">
        <p className="eyebrow anim-hero anim-hero-1 mb-8">Click Creators Agency</p>

        <h1 className="display-hero max-w-full">
          {heroLines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                className={`block anim-hero anim-hero-${Math.min(i + 2, 4)} ${
                  i === 1 ? "text-outline" : ""
                }`}
              >
                {line.endsWith(".") ? (
                  <>
                    {line.slice(0, -1)}
                    <span className="text-[var(--primary)]">.</span>
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="anim-hero anim-hero-3 flex flex-col gap-6 max-w-xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-[var(--text-soft)]">
              Social Media <span className="text-[var(--primary)] mx-1">•</span> Content{" "}
              <span className="text-[var(--primary)] mx-1">•</span> Creators{" "}
              <span className="text-[var(--primary)] mx-1">•</span> Audiovisual
            </p>
            <div className="flex items-center gap-3">
              <span className="pulse-dot" aria-hidden="true" />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">
                Disponíveis para novos projetos
              </span>
            </div>
          </div>

          <div className="anim-hero anim-hero-4 flex flex-col sm:flex-row gap-4">
            <Link to="/portfolio" className="btn btn-primary btn-lg">
              <span>Explore Our Work</span>
            </Link>
            <Link to="/contactos" className="btn btn-outline btn-lg">
              <span>Work With Us</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom marquee strip */}
      <div className="relative z-10 hairline-t bg-[var(--background)]/80 backdrop-blur-sm overflow-hidden py-4 partner-marquee-wrap">
        <div className="partner-marquee gap-16 pr-16" aria-hidden="true">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex gap-16 shrink-0">
              {["Branding", "Social Media", "Produção Audiovisual", "Gestão de Creators", "Marketing Digital", "Content Creation"].map(
                (word) => (
                  <span
                    key={word}
                    className="font-display text-lg tracking-[0.15em] uppercase text-[var(--text-faint)] whitespace-nowrap"
                  >
                    {word} <span className="text-[var(--primary)] ml-4">✦</span>
                  </span>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
