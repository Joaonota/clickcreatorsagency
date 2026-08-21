import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  isOpen,
  images,
  currentIndex,
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

  if (!isOpen || images.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in">
      {/* Close Button */}
      <button
        onClick={onClose}
        aria-label="Fechar Lightbox"
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200"
      >
        <X size={24} />
      </button>

      {/* Counter */}
      <div className="absolute top-6 left-6 z-50 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-semibold border border-white/10">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={onPrev}
          aria-label="Imagem anterior"
          className="absolute left-4 md:left-8 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Main Image View */}
      <div className="max-w-5xl max-h-[85vh] p-4 flex items-center justify-center">
        <img
          src={images[currentIndex]}
          alt={`Visualização ${currentIndex + 1}`}
          className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-all duration-300 select-none"
        />
      </div>

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={onNext}
          aria-label="Próxima imagem"
          className="absolute right-4 md:right-8 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  );
};
