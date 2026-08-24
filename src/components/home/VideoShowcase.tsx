import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";
import { VideoModal } from "../common/VideoModal";

interface VideoItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  src: string;
  poster: string;
}

const agencyVideos: VideoItem[] = [
  {
    id: "apresentacao",
    title: "Apresentação Oficial Click Creators",
    subtitle: "Vídeo Institucional & Posicionamento",
    category: "Showreel Principal",
    src: "/videos/apresentacao-click.mp4",
    poster: "/img/filmmaker-fotografo.jpeg",
  },
  {
    id: "casting",
    title: "Casting Audiovisual — Global Lead",
    subtitle: "Parceria Estratégica & Formação de Criadores",
    category: "Produção & Talentos",
    src: "/videos/casting-global-lead.mp4",
    poster: "/img/Default_img.jpeg",
  },
  {
    id: "whitesunset",
    title: "Campanha White Sunset Beira",
    subtitle: "Contagem Decrescente & Cobertura de Festival",
    category: "Eventos & Experiências",
    src: "/videos/white-sunset-beira.mp4",
    poster: "/img/modelo.jpeg",
  },
];

export const VideoShowcase: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(agencyVideos[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [modalVideo, setModalVideo] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { lang } = useTranslation();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.muted = isMuted;
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [selectedVideo]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section className="section-y bg-[var(--background-secondary)] hairline-t hairline-b relative overflow-hidden">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <Reveal>
            <p className="eyebrow">{lang === "pt" ? "PRODUÇÃO AUDIOVISUAL" : "AUDIOVISUAL PRODUCTION"}</p>
            <h2 className="display-lg mt-4">
              <span>{lang === "pt" ? "PROJETOS & SHOWREEL" : "PROJECTS & SHOWREEL"}</span>
              <span className="text-[var(--primary)]">.</span>
            </h2>
          </Reveal>
          <Reveal delay={1}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--text-soft)] max-w-md">
              {lang === "pt"
                ? "Produções cinematográficas, campanhas de impacto e narrativas visuais desenvolvidas pela Click Creators."
                : "Cinematic productions, high-impact campaigns and visual storytelling by Click Creators."}
            </p>
          </Reveal>
        </div>

        {/* Video selector tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {agencyVideos.map((v, i) => {
            const isCurrent = selectedVideo.id === v.id;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedVideo(v)}
                className={`text-left p-5 border transition-all duration-300 rounded-sm relative overflow-hidden cursor-pointer ${
                  isCurrent
                    ? "bg-[var(--surface)] border-[var(--primary)] shadow-lg"
                    : "bg-[var(--surface)]/40 border-[var(--border)] hover:border-[var(--text-muted)] hover:bg-[var(--surface)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[0.62rem] font-extrabold uppercase tracking-[0.2em] ${isCurrent ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`}>
                    0{i + 1} / {v.category}
                  </span>
                  {isCurrent && (
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
                  )}
                </div>
                <h3 className="font-display text-xl uppercase tracking-wide text-[var(--color-text)]">
                  {v.title}
                </h3>
                <p className="text-xs muted mt-1 truncate">
                  {v.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Main interactive player */}
        <Reveal className="relative bg-black rounded-lg overflow-hidden border border-[var(--border)] shadow-2xl group">
          <div className="aspect-video relative w-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              src={selectedVideo.src}
              poster={selectedVideo.poster}
              playsInline
              loop
              muted={isMuted}
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
            />

            {/* In-video overlay controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
              {/* Top info */}
              <div className="flex items-center justify-between">
                <span className="bg-black/70 backdrop-blur px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-widest text-[var(--primary)] rounded">
                  {selectedVideo.category}
                </span>
                <button
                  onClick={() => setModalVideo(selectedVideo.src)}
                  className="pointer-events-auto p-2.5 rounded-full bg-black/60 hover:bg-[var(--primary)] hover:text-black text-white backdrop-blur transition-all"
                  title="Ecrã completo"
                >
                  <Maximize2 size={18} />
                </button>
              </div>

              {/* Bottom controls */}
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-4">
                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-[var(--primary)] text-black hover:scale-105 transition-all shadow-lg cursor-pointer"
                    aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="p-3 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur transition-all cursor-pointer"
                    aria-label={isMuted ? "Ativar som" : "Desativar som"}
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                  <span className="text-xs font-bold text-white uppercase tracking-wider hidden sm:inline-block">
                    {selectedVideo.title}
                  </span>
                </div>

                <button
                  onClick={() => setModalVideo(selectedVideo.src)}
                  className="btn btn-sm btn-outline text-white border-white/40 hover:border-[var(--primary)]"
                >
                  <span>{lang === "pt" ? "Ecrã Inteiro" : "Fullscreen"} ↗</span>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Modal */}
      {modalVideo && (
        <VideoModal
          isOpen={true}
          videoSrc={modalVideo}
          title={selectedVideo.title}
          onClose={() => setModalVideo(null)}
        />
      )}
    </section>
  );
};
