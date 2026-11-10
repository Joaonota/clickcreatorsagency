import React from "react";
import { Link } from "react-router-dom";
import { Camera, ArrowRight } from "lucide-react";
import type { MemoryEvent } from "../../data/memory";
import { displayCover, formatEventDate } from "../../data/memory";
import { useTranslation } from "../../i18n";

interface EventCardProps {
  event: MemoryEvent;
  compact?: boolean;
}

/** Cartão de evento publicado da galeria **Save Your Memory**. */
export const EventCard: React.FC<EventCardProps> = ({ event, compact = false }) => {
  const { t, lang } = useTranslation();

  return (
    <Link
      to={`/memoria/${event.slug}`}
      className={`mem-card group ${compact ? "mem-card-compact" : ""}`}
      aria-label={`${event.title} — ${t.memory.viewGallery}`}
    >
      <div className="mem-card-media">
        <img src={displayCover(event)} alt={event.coverAlt || event.title} loading="lazy" />
        {event.location && (
          <span className="mem-card-chip" title={event.location}>
            {event.location}
          </span>
        )}
        <span className="mem-card-count">
          <Camera size={13} strokeWidth={2.4} aria-hidden="true" />
          <span>{event.mediaCount}</span>
        </span>
      </div>

      <div className="mem-card-body">
        <span className="mem-card-date">{formatEventDate(event.date, lang)}</span>
        <h3 className="mem-card-title">{event.title}</h3>
        {!compact && (
          <p className="mem-card-desc">{event.description}</p>
        )}
        <div className="mem-card-foot">
          <span className="mem-card-cta">
            {t.memory.viewGallery}
            <ArrowRight size={14} strokeWidth={2.6} aria-hidden="true" />
          </span>
          <span className="mem-card-count-inline">
            <Camera size={12} aria-hidden="true" />
            {event.mediaCount} {t.memory.photosCount}
          </span>
        </div>
      </div>
    </Link>
  );
};
