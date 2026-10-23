import React, { useEffect, useState } from "react";
import { CampaignsSection } from "../components/portfolio/CampaignsSection";
import { CTASection } from "../components/common/CTASection";
import { Reveal } from "../hooks/useReveal";
import { useTranslation } from "../i18n";
import { detectKind, type AspectKind } from "../components/portfolio/PortfolioGrid";

/* Vídeos de destaque — entre o hero do Portfólio e as Campanhas em Vídeo */
const featuredVideos = [
  {
    id: "destaque-1",
    title: "Ana Yoice",
    src: "/Videos/ana-yoice.mp4",
    mime: "video/mp4",
  },
  {
    id: "destaque-2",
    title: "Yango",
    src: "https://firebasestorage.googleapis.com/v0/b/lamapp-b1125.firebasestorage.app/o/clik%2FYango.MP4?alt=media&token=12206e20-c415-44ed-a55b-b83f7606d030",
    mime: "video/mp4",
  },
];

const FeaturedVideoCard: React.FC<{
  title: string;
  src: string;
  mime: string;
  index: string;
}> = ({ title, src, mime, index }) => {
  const { t } = useTranslation();
  const [kind, setKind] = useState<AspectKind>("unknown");
  const [aspectRatio, setAspectRatio] = useState<string | undefined>(undefined);
  const [error, setError] = useState(false);

  const handleMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const w = e.currentTarget.videoWidth;
    const h = e.currentTarget.videoHeight;
    setKind(detectKind(w, h));
    if (w && h) setAspectRatio(`${w} / ${h}`);
  };

  const ratioLabel =
    kind === "landscape"
      ? "Horiz."
      : kind === "portrait"
      ? "Vert."
      : kind === "square"
      ? "1:1"
      : "—";

  /* Container adaptado à proporção real (padrão da secção Campanhas) */
  const containerStyle: React.CSSProperties = (() => {
    if (aspectRatio) {
      if (kind === "portrait") {
        return {
          aspectRatio,
          maxHeight: "72vh",
          width: "auto",
          maxWidth: "100%",
          margin: "0 auto",
        };
      }
      return {
        aspectRatio,
        width: "100%",
        maxHeight: "70vh",
      };
    }
    return {
      minHeight: "10rem",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    };
  })();

  return (
    <article className="group flex flex-col border border-[var(--border)] bg-[var(--surface)] transition-colors duration-300 hover:border-[var(--border-hover)]">
      <div
        className="relative overflow-hidden bg-black flex items-center justify-center"
        style={containerStyle}
      >
        <video
          className="block w-full h-full object-contain bg-black"
          controls
          preload="auto"
          playsInline
          aria-label={title}
          onLoadedMetadata={handleMetadata}
          onError={() => setError(true)}
        >
          <source src={src} type={mime} />
        </video>
        {error && (
          <span className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/80 px-4 text-center text-sm uppercase tracking-[0.2em] text-white/60">
            {t.portfolio.videoUnavailable}
          </span>
        )}
        <span className="pointer-events-none absolute top-4 left-4 z-10 text-[0.58rem] font-extrabold uppercase tracking-[0.22em] text-white/50">
          {index} /
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-4 px-5 py-4">
        <h3 className="font-display text-xl uppercase tracking-wide leading-none">{title}</h3>
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] muted whitespace-nowrap">
          {ratioLabel}
        </span>
      </div>
    </article>
  );
};

export const PortfolioPage: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = t.portfolio.pageTitle;
  }, [t]);

  return (
    <div className="flex flex-col">
      {/* Page hero */}
      <section className="pt-36 pb-14 lg:pt-48 lg:pb-20">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{t.portfolio.pageHeroEyebrow}</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">{t.portfolio.pageHeroLines[0]}</span>
            <span className="block text-outline">{t.portfolio.pageHeroLines[1]}</span>
            <span className="block">
              {t.portfolio.pageHeroLines[2].replace(".", "")}
              <span className="text-[var(--primary)]">.</span>
            </span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-xl">
              {t.portfolio.pageHeroLede}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Vídeos de destaque */}
      <section className="pb-24 lg:pb-32" aria-label={t.portfolio.featuredEyebrow}>
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{t.portfolio.featuredEyebrow}</p>
            <h2 className="display-lg max-w-5xl">
              {t.portfolio.featuredTitleLines.map((line, i) =>
                i === 0 ? (
                  <span key={line} className="block">
                    {line}
                  </span>
                ) : (
                  <span key={line} className="block text-outline">
                    {line}
                  </span>
                )
              )}
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10 mt-12 lg:mt-16 items-start">
            {featuredVideos.map((v, i) => (
              <Reveal key={v.id} delay={(i % 2) as 0 | 1}>
                <FeaturedVideoCard
                  title={v.title}
                  src={v.src}
                  mime={v.mime}
                  index={String(i + 1).padStart(2, "0")}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Campanhas em vídeo — ficheiros reais de public/Videos */}
      <CampaignsSection />

      <CTASection />
    </div>
  );
};
