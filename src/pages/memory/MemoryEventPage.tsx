import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Camera, CalendarDays, Download, Loader2, MapPin, Sparkles } from "lucide-react";
import { EventCard } from "../../components/memory/EventCard";
import { PhotoMasonry } from "../../components/memory/PhotoMasonry";
import { Lightbox } from "../../components/common/Lightbox";
import { NotFound } from "../NotFound";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";
import { memoryPublicApi } from "../../services/memoryPublicApi";
import { downloadEventPhotosZip, openDownloadUrl } from "../../services/memoryZip";
import { formatEventDate } from "../../data/memory";
import type { MemoryEvent, MemoryEventDetail, MemorySettings } from "../../data/memory";

/** O evento ainda não aconteceu (conta o dia inteiro do evento). */
const isUpcomingDate = (isoDate: string) => new Date(`${isoDate}T23:59:59`).getTime() > Date.now();

type ZipStatus = "idle" | "busy" | "done" | "partial" | "failed";
type LoadState = "loading" | "ready" | "missing" | "error";

/**
 * SAVE YOUR MEMORY — Galeria de um evento publicado.
 * Álbuns e media vêm do Supabase (só conteúdo publicado, via RLS).
 */
export const MemoryEventPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useTranslation();

  const [detail, setDetail] = useState<MemoryEventDetail | null>(null);
  const [settings, setSettings] = useState<MemorySettings>({ allowDownloads: false, allowZipDownloads: false });
  const [otherEvents, setOtherEvents] = useState<MemoryEvent[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [albumFilter, setAlbumFilter] = useState("all");

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [itemBusy, setItemBusy] = useState(false);
  const [zipStatus, setZipStatus] = useState<ZipStatus>("idle");
  const [zipMessage, setZipMessage] = useState("");
  const [zipProgress, setZipProgress] = useState(0);

  /* Repõe o estado ao navegar para outro evento. */
  const [loadedSlug, setLoadedSlug] = useState(slug);
  if (loadedSlug !== slug) {
    setLoadedSlug(slug);
    setState("loading");
    setDetail(null);
    setAlbumFilter("all");
    setLightboxIndex(null);
    setZipStatus("idle");
    setZipMessage("");
  }

  useEffect(() => {
    document.title = detail ? `${detail.event.title} — Save Your Memory | Click Creators Agency` : t.memory.pageTitle;
  }, [t, detail]);

  useEffect(() => {
    let active = true;
    if (!slug) return undefined;
    Promise.all([memoryPublicApi.getEventDetail(slug), memoryPublicApi.getSettings(), memoryPublicApi.getEvents()])
      .then(([eventDetail, gallerySettings, events]) => {
        if (!active) return;
        setDetail(eventDetail);
        setSettings(gallerySettings);
        setOtherEvents(events.filter((item) => item.slug !== slug).slice(0, 3));
        setState(eventDetail ? "ready" : "missing");
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const media = useMemo(() => {
    if (!detail) return [];
    return albumFilter === "all" ? detail.media : detail.media.filter((item) => item.albumId === albumFilter);
  }, [detail, albumFilter]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const stepLightbox = useCallback(
    (delta: number) => {
      setLightboxIndex((current) => {
        if (current === null || media.length === 0) return current;
        return (current + delta + media.length) % media.length;
      });
    },
    [media.length]
  );

  const handleDownloadSingle = useCallback(async () => {
    if (lightboxIndex === null) return;
    const item = media[lightboxIndex];
    if (!item) return;
    setItemBusy(true);
    try {
      const url = await memoryPublicApi.getDownloadUrl(item);
      if (url) openDownloadUrl(url);
    } finally {
      setItemBusy(false);
    }
  }, [lightboxIndex, media]);

  const photoCount = media.filter((item) => item.type === "image").length;

  const handleDownloadAll = useCallback(async () => {
    if (!detail || photoCount === 0 || zipStatus === "busy") return;
    setZipStatus("busy");
    setZipProgress(0);
    setZipMessage(t.memory.event.preparing);
    try {
      const included = await downloadEventPhotosZip(media, detail.event.title, (progress) => {
        setZipProgress(Math.round((progress.done / progress.total) * 100));
        if (progress.done > 0) setZipMessage(t.memory.event.downloading);
      });
      if (included === photoCount) {
        setZipStatus("done");
        setZipMessage(t.memory.event.zipDone);
      } else {
        setZipStatus("partial");
        setZipMessage(`${included} ${t.memory.event.zipPartial}`);
      }
    } catch {
      setZipStatus("failed");
      setZipMessage(t.memory.event.zipFailed);
    }
  }, [detail, media, photoCount, zipStatus, t]);

  if (state === "loading") {
    return (
      <div className="container pt-44 pb-24 flex justify-center">
        <p className="eyebrow eyebrow-bare muted">{t.common.loading}</p>
      </div>
    );
  }
  if (state === "error") {
    return (
      <div className="container pt-44 pb-24">
        <Link to="/memoria" className="mem-back-link">
          <ArrowLeft size={15} aria-hidden="true" />
          {t.memory.event.backLink}
        </Link>
        <p className="muted mt-8 max-w-md">{t.memory.loadError}</p>
      </div>
    );
  }
  if (!detail) {
    return <NotFound />;
  }

  const { event, albums } = detail;
  const hasMedia = detail.media.length > 0;
  const formattedDate = formatEventDate(event.date, lang);
  const isUpcoming = isUpcomingDate(event.date);
  const hasVideos = media.some((item) => item.type === "video");
  const meta = [
    { icon: CalendarDays, label: formattedDate },
    ...(event.location ? [{ icon: MapPin, label: event.location }] : []),
    hasMedia
      ? { icon: Camera, label: `${detail.media.length} ${t.memory.event.photosLabel}` }
      : { icon: Sparkles, label: t.memory.event.soonEyebrow },
  ];
  const zipBlocked = zipStatus === "busy" || photoCount === 0;

  return (
    <div className="flex flex-col">
      {/* Cabeçalho do evento */}
      <section className="pt-32 pb-10 lg:pt-44 lg:pb-14">
        <div className={`container ${event.cover ? "mem-event-hero" : ""}`}>
          {event.cover && (
            <figure className="mem-event-cover">
              <img src={event.cover} alt={event.coverAlt} />
            </figure>
          )}
          <div className="mem-event-head">
            <Link to="/memoria" className="mem-back-link">
              <ArrowLeft size={15} aria-hidden="true" />
              {t.memory.event.backLink}
            </Link>

            <div className="mem-event-meta mt-8">
              {meta.map((item) => (
                <span className="mem-meta-item" key={item.label}>
                  <item.icon size={14} aria-hidden="true" className="mem-meta-icon" />
                  {item.label}
                </span>
              ))}
            </div>

            <h1 className="display-lg mt-6 max-w-4xl">{event.title}</h1>
            {event.description && <p className="lede mt-6 max-w-2xl">{event.description}</p>}

            <div className="mem-actions mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
              {settings.allowZipDownloads && photoCount > 0 && (
                <button type="button" onClick={handleDownloadAll} disabled={zipBlocked} className="btn btn-primary btn-lg">
                  {zipStatus === "busy" ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  ) : (
                    <Download size={16} aria-hidden="true" />
                  )}
                  <span>
                    {zipStatus === "busy" ? zipMessage || t.memory.event.preparing : `${t.memory.event.downloadAll} · ZIP`}
                  </span>
                </button>
              )}
              {zipStatus !== "busy" && zipMessage && (
                <p className={`mem-zip-note ${zipStatus === "failed" ? "mem-zip-note-error" : ""}`} role="status">
                  {zipMessage}
                </p>
              )}
              {!zipMessage && media.length > 0 && (
                <p className="muted text-[0.68rem] uppercase tracking-[0.18em]">
                  {t.memory.event.zoomHint}
                  {hasVideos && settings.allowZipDownloads ? ` · ${t.memory.event.videoNote}` : ""}
                </p>
              )}
            </div>

            {zipStatus === "busy" && (
              <div className="mem-zip-progress mt-4" aria-hidden="true">
                <span style={{ width: `${zipProgress}%` }} />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Álbuns + grelha */}
      <section className="pb-24 lg:pb-28" aria-label={event.title}>
        <div className="container">
          {albums.length > 1 && (
            <nav className="filter-bar mb-8" aria-label="Álbuns">
              {[{ id: "all", title: t.memory.event.allAlbums }, ...albums].map((album) => (
                <button
                  key={album.id}
                  type="button"
                  onClick={() => {
                    setAlbumFilter(album.id);
                    setLightboxIndex(null);
                  }}
                  className={`filter-btn ${albumFilter === album.id ? "active" : ""}`}
                >
                  {album.title}
                </button>
              ))}
            </nav>
          )}
          {!hasMedia ? (
            <div className="mem-soon">
              <div className="mem-soon-ghosts" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => (
                  <span key={index} />
                ))}
              </div>
              <div className="mem-soon-card">
                <span className="mem-soon-icon" aria-hidden="true">
                  <Camera size={22} strokeWidth={1.6} />
                </span>
                <p className="eyebrow eyebrow-bare">{t.memory.event.soonEyebrow}</p>
                <h2 className="display-sm mem-soon-title">
                  {isUpcoming ? t.memory.event.soonUpcomingTitle : t.memory.event.soonPastTitle}
                </h2>
                <p className="muted mem-soon-body">
                  {isUpcoming
                    ? t.memory.event.soonUpcomingBody.replace("{date}", formattedDate)
                    : t.memory.event.soonPastBody}
                </p>
                {otherEvents.length > 0 && (
                  <a href="#mem-more-events" className="btn btn-outline btn-sm mem-soon-cta">
                    <span>{t.memory.event.soonCta}</span>
                  </a>
                )}
              </div>
            </div>
          ) : media.length === 0 ? (
            <p className="muted">{t.memory.event.emptyMedia}</p>
          ) : (
            <PhotoMasonry media={media} onOpen={setLightboxIndex} />
          )}
        </div>
      </section>

      {/* Mais eventos */}
      {otherEvents.length > 0 && (
        <section id="mem-more-events" className="hairline-t pb-24 lg:pb-32" aria-label={t.memory.moreEvents}>
          <div className="container section-y">
            <Reveal>
              <p className="eyebrow mb-6">{t.memory.pageHeroEyebrow}</p>
              <h2 className="display-md max-w-3xl">{t.memory.moreEvents}</h2>
            </Reveal>
            <div className="mem-grid mem-grid-tight mt-12">
              {otherEvents.map((item) => (
                <EventCard key={item.id} event={item} compact />
              ))}
            </div>
            <div className="mt-10">
              <Link to="/memoria" className="arrow-link">
                {t.memory.event.backLink}
                <span className="arrow-line" aria-hidden="true" />
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Lightbox reutilizado (fotos e vídeos), com descarga individual se permitida */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        images={media.map((item) => item.src)}
        mediaTypes={media.map((item) => item.type)}
        currentIndex={lightboxIndex ?? 0}
        titles={media.map(() => event.title)}
        onSelect={setLightboxIndex}
        onClose={closeLightbox}
        onPrev={() => stepLightbox(-1)}
        onNext={() => stepLightbox(1)}
        onDownload={settings.allowDownloads ? handleDownloadSingle : undefined}
        downloadLabel={t.memory.event.downloadPhoto}
        downloadDisabled={itemBusy}
      />
    </div>
  );
};
