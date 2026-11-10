import React from "react";
import { Play, ZoomIn } from "lucide-react";
import type { MemoryMedia } from "../../data/memory";

interface PhotoMasonryProps {
  media: MemoryMedia[];
  onOpen: (index: number) => void;
}

/** Grelha masonry de fotografias e vídeos de um evento (clique abre o lightbox). */
export const PhotoMasonry: React.FC<PhotoMasonryProps> = ({ media, onOpen }) => {
  return (
    <div className="mem-masonry">
      {media.map((item, index) => (
        <button
          key={item.id}
          type="button"
          className="mem-photo"
          onClick={() => onOpen(index)}
          aria-label={`${item.type === "video" ? "Vídeo" : "Fotografia"} ${index + 1} — abrir`}
        >
          {item.type === "video" ? (
            <video src={`${item.src}#t=0.1`} muted playsInline preload="metadata" />
          ) : (
            <img src={item.src} alt="" loading="lazy" />
          )}
          <span className="mem-photo-index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={`mem-photo-zoom ${item.type === "video" ? "mem-photo-zoom-video" : ""}`} aria-hidden="true">
            {item.type === "video" ? <Play size={18} /> : <ZoomIn size={18} />}
          </span>
        </button>
      ))}
    </div>
  );
};
