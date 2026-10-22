import React, { useRef, useState } from "react";
import { Maximize2 } from "lucide-react";
import { campaignPhotos, campaignVideos } from "../../data/campaigns";
import { Lightbox } from "../common/Lightbox";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";

/** Proporção detetada após carregar os metadados do vídeo */
type AspectKind = "landscape" | "portrait" | "square" | "unknown";

function detectKind(w: number, h: number): AspectKind {
  if (w === 0 || h === 0) return "unknown";
  const ratio = w / h;
  if (ratio > 1.2) return "landscape";
  if (ratio < 0.85) return "portrait";
  return "square";
}

const CampaignCard: React.FC<{
  title: string;
  src: string;
  mime: string;
  index: string;
}> = ({ title, src, mime, index }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [kind, setKind] = useState<AspectKind>("unknown");
  const [aspectRatio, setAspectRatio] = useState<string | undefined>(undefined);

  const handleMetadata = () => {
    const v = videoRef.current;
    if (!v) return;
    const w = v.videoWidth;
    const h = v.videoHeight;
    setKind(detectKind(w, h));
    if (w && h) setAspectRatio(`${w} / ${h}`);
  };

  /* Etiqueta da proporção visível no rodapé do card */
  const ratioLabel =
    kind === "landscape"
      ? "Horiz."
      : kind === "portrait"
      ? "Vert."
      : kind === "square"
      ? "1:1"
      : "—";

  /*
   * Estratégia do container do vídeo:
   *  - Landscape : ocupa 100% da largura; altura ditada pela proporção natural.
   *  - Portrait  : largura automática com max-height para não ficar enorme;
   *                centrado horizontalmente.
   *  - Square    : largura total, sem forçar altura.
   *  - Unknown   : placeholder neutro enquanto os metadados não chegam.
   */
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
      {/* Wrapper do player — dimensões adaptadas à proporção real */}
      <div
        className="relative overflow-hidden bg-black flex items-center justify-center"
        style={containerStyle}
      >
        <video
          ref={videoRef}
          className="block w-full h-full object-contain bg-black"
          controls
          preload="metadata"
          playsInline
          disablePictureInPicture={false}
          aria-label={title}
          onLoadedMetadata={handleMetadata}
        >
          <source src={src} type={mime} />
        </video>

        {/* Badge */}
        <span className="pointer-events-none absolute top-4 left-4 z-10 flex items-center gap-2 text-[0.58rem] font-extrabold uppercase tracking-[0.22em]">
          <span className="text-white/50">{index} /</span>
          <span className="text-[var(--primary)] bg-black/60 backdrop-blur px-2.5 py-1">
            {t.portfolio.campaignsBadge}
          </span>
        </span>
      </div>

      {/* Rodapé */}
      <div className="flex items-baseline justify-between gap-4 px-5 py-4">
        <h3 className="font-display text-xl uppercase tracking-wide leading-none">
          {title}
        </h3>
        <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] muted whitespace-nowrap">
          {ratioLabel}
        </span>
      </div>
      <p className="px-5 pb-5 text-xs muted">{t.portfolio.campaignsHint}</p>
    </article>
  );
};

export const CampaignsSection: React.FC = () => {
  const { t } = useTranslation();
  const [activePhoto, setActivePhoto] = useState<number | null>(null);

  return (
    <section
      className="section-y hairline-t bg-[var(--surface)]"
      aria-label={t.portfolio.campaignsTitleLines[0]}
    >
      <div className="container">
        <Reveal>
          <p className="eyebrow mb-6">{t.portfolio.campaignsEyebrow}</p>
          <h2 className="display-lg max-w-5xl">
            {t.portfolio.campaignsTitleLines.map((line, i) =>
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
        <Reveal delay={1}>
          <p className="lede mt-6 max-w-xl">{t.portfolio.campaignsDesc}</p>
        </Reveal>

        {/*
          Grelha responsiva que respeita formatos mistos:
          – Mobile  : 1 coluna (vídeo ocupa ~100% da largura)
          – Tablet  : 2 colunas quando há espaço
          – Desktop : até 3 colunas; cards não se esticam para igualar altura
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10 mt-12 lg:mt-16 items-start">
          {campaignVideos.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) as 0 | 1 | 2}>
              <CampaignCard
                title={v.title}
                src={v.src}
                mime={v.mime}
                index={String(i + 1).padStart(2, "0")}
              />
            </Reveal>
          ))}
        </div>

        {/* Fotografias de campanhas */}
        <div className="mt-20 lg:mt-28">
          <Reveal>
            <p className="eyebrow mb-4">{t.portfolio.campaignsPhotosEyebrow}</p>
            <h3 className="font-display text-3xl lg:text-4xl uppercase tracking-wide leading-none">
              {t.portfolio.campaignsPhotosTitle}
            </h3>
            <p className="lede mt-4 max-w-xl">{t.portfolio.campaignsPhotosDesc}</p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mt-10">
            {campaignPhotos.map((photo, i) => (
              <Reveal key={photo.id} delay={(i % 3) as 0 | 1 | 2}>
                <article className="group flex flex-col border border-[var(--border)] bg-[var(--surface)] transition-colors duration-300 hover:border-[var(--border-hover)]">
                  <button
                    type="button"
                    onClick={() => setActivePhoto(i)}
                    aria-label={`${photo.title} — ${t.portfolio.campaignsPhotosHint}`}
                    className="relative block aspect-[3/4] w-full overflow-hidden bg-black"
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="bg-[var(--primary)] p-3 text-black">
                        <Maximize2 size={18} />
                      </span>
                    </div>
                    <span className="absolute top-4 left-4 bg-black/60 px-2.5 py-1 text-[0.58rem] font-extrabold uppercase tracking-[0.22em] text-[var(--primary)] backdrop-blur">
                      {t.portfolio.campaignsBadge}
                    </span>
                  </button>
                  <div className="flex items-baseline justify-between gap-4 px-5 py-4">
                    <h4 className="font-display text-lg uppercase tracking-wide leading-none">
                      {photo.title}
                    </h4>
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] muted whitespace-nowrap">
                      {t.portfolio.campaignsPhotosHint}
                    </span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        isOpen={activePhoto !== null}
        images={campaignPhotos.map((photo) => photo.src)}
        titles={campaignPhotos.map((photo) => photo.title)}
        currentIndex={activePhoto ?? 0}
        onSelect={setActivePhoto}
        onClose={() => setActivePhoto(null)}
        onPrev={() =>
          setActivePhoto((prev) =>
            prev === null
              ? null
              : prev === 0
              ? campaignPhotos.length - 1
              : prev - 1
          )
        }
        onNext={() =>
          setActivePhoto((prev) =>
            prev === null
              ? null
              : prev === campaignPhotos.length - 1
              ? 0
              : prev + 1
          )
        }
      />
    </section>
  );
};
