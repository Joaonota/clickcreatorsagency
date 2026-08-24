import React, { useEffect, useRef, useState, useCallback } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  videoSrc: string;
  title?: string;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  videoSrc,
  title = "Vídeo de Apresentação — Click Creators Agency",
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Clean formatted time (mm:ss)
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlayToggle = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          // If browser blocks unmuted playback, try muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          }
        });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    videoRef.current.currentTime = newTime;
    setProgress(parseFloat(e.target.value));
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  // Keyboard navigation & lifecycle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === " " || e.key === "k") {
        e.preventDefault();
        handlePlayToggle();
      }
      if (e.key === "m") {
        e.preventDefault();
        handleMuteToggle();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setIsLoading(true);
      setHasError(false);

      // Give browser time to mount video DOM node
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            })
            .catch(() => {
              // Autoplay with audio was blocked by browser policy — show Play button overlay
              setIsPlaying(false);
              setIsLoading(false);
            });
        }
      }, 150);

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = "unset";
        window.removeEventListener("keydown", handleKeyDown);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      };
    }
  }, [isOpen, onClose, handlePlayToggle]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-3 sm:p-6 md:p-8 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Header */}
      <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 z-50 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] animate-pulse" />
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.18em] text-white truncate max-w-[200px] sm:max-w-md">
            {title}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Fechar vídeo"
          className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-[var(--primary)] hover:text-black text-white border border-white/20 transition-all duration-200 cursor-pointer shadow-xl hover:scale-105"
        >
          <X size={22} />
        </button>
      </div>

      {/* Main Video Box */}
      <div className="w-full max-w-5xl max-h-[85vh] aspect-video bg-zinc-950 rounded-xl overflow-hidden border border-white/15 shadow-2xl relative flex items-center justify-center group select-none">
        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm gap-3">
            <div className="w-10 h-10 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            <span className="text-[0.65rem] font-extrabold uppercase tracking-widest text-white/80">
              A carregar vídeo...
            </span>
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-zinc-950 p-6 text-center gap-4">
            <AlertCircle size={42} className="text-amber-400" />
            <div className="max-w-md">
              <h3 className="font-display text-xl uppercase text-white mb-1">
                Não foi possível carregar o vídeo
              </h3>
              <p className="text-xs text-white/60">
                Verifique se o ficheiro de vídeo está acessível no servidor ou tente recarregar a página.
              </p>
            </div>
            <a
              href={videoSrc}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary btn-sm mt-2"
            >
              <span>Abrir Ficheiro Diretamente ↗</span>
            </a>
          </div>
        )}

        {/* HTML5 Video Element */}
        <video
          ref={videoRef}
          src={videoSrc}
          playsInline
          preload="auto"
          onClick={handlePlayToggle}
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(videoRef.current.currentTime);
              setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
            }
          }}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(videoRef.current.duration);
              setIsLoading(false);
            }
          }}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => {
            setIsLoading(false);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className="w-full h-full object-contain cursor-pointer bg-black"
        />

        {/* Big Central Play Button (When Paused) */}
        {!isPlaying && !isLoading && !hasError && (
          <button
            onClick={handlePlayToggle}
            aria-label="Reproduzir vídeo"
            className="absolute z-30 p-6 sm:p-7 rounded-full bg-[var(--primary)] text-black hover:scale-110 active:scale-95 transition-transform duration-200 shadow-2xl shadow-[var(--primary)]/30 cursor-pointer flex items-center justify-center"
          >
            <Play size={32} fill="currentColor" className="ml-1" />
          </button>
        )}

        {/* Bottom Custom Control Bar */}
        <div
          className={`absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 sm:p-6 transition-opacity duration-300 ${
            isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          }`}
        >
          {/* Progress Bar Slider */}
          <div className="flex items-center gap-3 mb-3">
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={isNaN(progress) ? 0 : progress}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/25 rounded-lg appearance-none cursor-pointer accent-[var(--primary)] hover:h-2 transition-all"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Left Controls */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={handlePlayToggle}
                className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
                aria-label={isPlaying ? "Pausar" : "Reproduzir"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
              </button>

              <button
                onClick={handleMuteToggle}
                className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
                aria-label={isMuted ? "Ativar som" : "Silenciar"}
              >
                {isMuted ? <VolumeX size={20} className="text-amber-400" /> : <Volume2 size={20} />}
              </button>

              <span className="text-xs font-mono text-white/80 font-semibold tracking-wider">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleFullscreen}
                className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
                aria-label="Ecrã inteiro"
                title="Ecrã Inteiro"
              >
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
