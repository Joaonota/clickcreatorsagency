import React, { useState } from "react";
import { Maximize2 } from "lucide-react";
import { Lightbox } from "./Lightbox";

interface ImageGalleryProps {
  images: string[];
  columns?: 2 | 3 | 4;
  aspectRatio?: "square" | "video" | "auto";
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  aspectRatio = "video",
  className = "",
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleOpenImage = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  const gridColsClass = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }[columns];

  const aspectClass = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "h-64",
  }[aspectRatio];

  return (
    <>
      <div className={`grid ${gridColsClass} gap-4 md:gap-6 ${className}`}>
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            onClick={() => handleOpenImage(idx)}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer border border-white/10 bg-slate-900 ${aspectClass}`}
          >
            <img
              src={imgUrl}
              alt={`Galeria ${idx + 1}`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="p-3 rounded-full bg-purple-600/80 text-white backdrop-blur-md transform scale-75 group-hover:scale-100 transition-transform duration-300">
                <Maximize2 size={20} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <Lightbox
        isOpen={lightboxOpen}
        images={images}
        currentIndex={activeImageIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={() =>
          setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
        }
        onNext={() =>
          setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
        }
      />
    </>
  );
};
