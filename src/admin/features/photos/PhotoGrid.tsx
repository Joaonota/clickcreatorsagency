import React from "react";
import { Check, Play } from "lucide-react";
import { formatBytes, photoStatusMeta } from "../../data/labels";
import { StatusBadge } from "../../components/ui";
import type { AdminPhoto } from "../../data/types";

interface PhotoGridProps {
  photos: AdminPhoto[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}

/** Grelha seleccionável de fotografias com identificação do ficheiro e estado. */
export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos, selected, onToggle }) => (
  <ul className="mc-photo-grid">
    {photos.map((photo) => {
      const isSelected = selected.has(photo.id);
      return (
        <li key={photo.id} className={`mc-photo ${isSelected ? "selected" : ""}`}>
          <label className="mc-photo-hit">
            <input
              type="checkbox"
              className="mc-visually-hidden"
              checked={isSelected}
              onChange={() => onToggle(photo.id)}
              aria-label={`Seleccionar ${photo.fileName}`}
            />
            {photo.mediaType === "video" ? (
              <>
                <video src={`${photo.previewUrl}#t=0.1`} muted preload="metadata" aria-label={photo.fileName} />
                <span className="mc-photo-play" aria-hidden="true"><Play size={16} /></span>
              </>
            ) : (
              <img src={photo.previewUrl} alt={photo.fileName} loading="lazy" />
            )}
            <span className="mc-photo-check" aria-hidden="true">{isSelected && <Check size={13} strokeWidth={3} />}</span>
            <span className="mc-photo-status"><StatusBadge {...photoStatusMeta[photo.status]} /></span>
          </label>
          <span className="mc-photo-meta">
            <span className="mc-truncate" title={photo.fileName}>{photo.fileName}</span>
            <span>{formatBytes(photo.sizeBytes)}</span>
          </span>
        </li>
      );
    })}
  </ul>
);
