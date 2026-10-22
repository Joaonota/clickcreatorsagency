import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  titles?: string[];
  onSelect?: (index: number) => void;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const pad = (value: number) => String(value).padStart(2, "0");

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  currentIndex,
  titles,
  onSelect,
  onClose,
  onPrev,
  onNext,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0 || typeof document === "undefined") return null;

  const title = titles?.[currentIndex];

  return createPortal(
    <div className="lb-overlay fixed inset-0 z-50 overflow-hidden">
      {/* Barra superior */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <div className="flex min-w-0 items-baseline gap-3">
          <span className="text-[0.62rem] font-extrabold uppercase tracking-[0.3em] text-[var(--primary)]">
            {pad(currentIndex + 1)}
            <span className="text-[rgba(255,255,255,0.3)]"> / {pad(images.length)}</span>
          </span>
          {title && (
            <span className="truncate font-display text-xs uppercase tracking-[0.18em] text-[rgba(255,255,255,0.62)] sm:text-sm">
              {title}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          aria-label="Fechar Lightbox"
          className="lb-control lb-close group grid h-11 w-11 shrink-0 place-items-center rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      {/* Imagem */}
      <div
        className="absolute inset-0 flex items-center justify-center px-4 pt-20 pb-24 sm:px-24"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <figure key={currentIndex} className="lb-pop relative flex max-h-full max-w-full flex-col items-center">
          <span className="lb-frame" />
          <img
            src={images[currentIndex]}
            alt={title ?? `Visualização ${currentIndex + 1}`}
            className="max-h-[78vh] max-w-[92vw] rounded-xl object-contain shadow-[0_40px_140px_-30px_rgba(0,0,0,0.95)] select-none"
          />
        </figure>
      </div>

      {/* Navegação */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            aria-label="Imagem anterior"
            className="lb-control absolute top-1/2 left-3 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full sm:left-8"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={onNext}
            aria-label="Próxima imagem"
            className="lb-control absolute top-1/2 right-3 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full sm:right-8"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center px-4 pb-5 sm:pb-7">
          <div className="flex max-w-full items-center gap-2 overflow-x-auto rounded-full border border-[rgba(255,255,255,0.1)] bg-black/50 p-2 backdrop-blur-xl">
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                onClick={() => onSelect?.(index)}
                aria-label={`Ver imagem ${index + 1}`}
                aria-current={index === currentIndex}
                className="lb-thumb h-11 w-11 shrink-0 overflow-hidden rounded-full sm:h-12 sm:w-12"
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
};


