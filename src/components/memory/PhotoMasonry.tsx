import React from "react";
import { ZoomIn } from "lucide-react";
import type { MemoryPhoto } from "../../data/memory";

interface PhotoMasonryProps {
  photos: MemoryPhoto[];
  onOpen: (index: number) => void;
}

/** Grelha masonry das fotografias de um evento (clique abre o lightbox). */
export const PhotoMasonry: React.FC<PhotoMasonryProps> = ({ photos, onOpen }) => {
  return (
    <div className="mem-masonry">
      {photos.map((photo, index) => (
        <button
          key={photo.id}
          type="button"
          className="mem-photo"
          onClick={() => onOpen(index)}
          aria-label={`${photo.alt || `Fotografia ${index + 1}`} — ampliar`}
        >
          <img src={photo.src} alt={photo.alt} loading="lazy" />
          <span className="mem-photo-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="mem-photo-zoom" aria-hidden="true">
            <ZoomIn size={18} />
          </span>
        </button>
      ))}
    </div>
  );
};
