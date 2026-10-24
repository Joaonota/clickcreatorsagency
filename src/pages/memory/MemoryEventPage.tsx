import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CalendarDays,
  Download,
  FolderOpen,
  Loader2,
} from "lucide-react";
import { EventCard } from "../../components/memory/EventCard";
import { PhotoMasonry } from "../../components/memory/PhotoMasonry";
import { Lightbox } from "../../components/common/Lightbox";
import { NotFound } from "../NotFound";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";
import { memoryApi } from "../../services/memoryApi";
import {
  downloadEventPhotosZip,
  downloadSinglePhoto,
} from "../../services/memoryZip";
import { formatEventDate } from "../../data/memory";
import type { MemoryCategory, MemoryEvent, MemoryPhoto } from "../../data/memory";

type ZipStatus = "idle" | "busy" | "done" | "partial" | "failed";

/**
 * SAVE YOUR MEMORY — Galeria de fotografia de um evento (fase MOCK).
 * Dados de demonstração em memória (src/data/memory).
 */
export const MemoryEventPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useTranslation();

  const [event, setEvent] = useState<MemoryEvent | null>(null);
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [categories, setCategories] = useState<MemoryCategory[]>([]);
  const [otherEvents, setOtherEvents] = useState<MemoryEvent[]>([]);
  const [photoCounts, setPhotoCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [zipStatus, setZipStatus] = useState<ZipStatus>("idle");
  const [zipMessage, setZipMessage] = useState("");
  const [zipProgress, setZipProgress] = useState(0);

  useEffect(() => {
    document.title = slug ? t.memory.pageTitle : t.notFound.pageTitle;
  }, [t, slug]);  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setEvent(null);
      setPhotos([]);
      setLightboxIndex(null);
      setZipStatus("idle");
      setZipMessage("");
      if (!slug) {
        setLoading(false);
        return;
      }
      const [eventData, categoriesData, allEvents, allPhotos] = await Promise.all([
        memoryApi.getPublicEventBySlug(slug),
        memoryApi.getCategories(),
        memoryApi.getPublicEvents(),
        memoryApi.getAllPhotos(),
      ]);
      if (!active) return;
      setCategories(categoriesData);
      const counts: Record<string, number> = {};
      allPhotos.forEach((photo) => {
        counts[photo.eventId] = (counts[photo.eventId] ?? 0) + 1;
      });
      setPhotoCounts(counts);
      if (!eventData) {
        setEvent(null);
      } else {
        document.title = `${eventData.title} — Save Your Memory | Click Creators Agency`;
        setEvent(eventData);
        const eventPhotos = allPhotos
          .filter((photo) => photo.eventId === eventData.id)
          .sort((a, b) => a.order - b.order);
        setPhotos(eventPhotos);
        setOtherEvents(
          allEvents
            .filter((item) => item.id !== eventData.id)
            .sort((a, b) => {
              const aSame = a.categoryId === eventData.categoryId ? 1 : 0;
              const bSame = b.categoryId === eventData.categoryId ? 1 : 0;
              if (aSame !== bSame) return bSame - aSame;
              return b.date.localeCompare(a.date);
            })
            .slice(0, 3)
        );
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [slug]);
  const categoryName = useMemo(
    () => categories.find((category) => category.id === event?.categoryId)?.name,
    [categories, event]
  );

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const stepLightbox = useCallback(
    (delta: number) => {
      setLightboxIndex((current) => {
        if (current === null || photos.length === 0) return current;
        return (current + delta + photos.length) % photos.length;
      });
    },
    [photos.length]
  );

  const handleDownloadSingle = useCallback(async () => {
    if (lightboxIndex === null || !event) return;
    const photo = photos[lightboxIndex];
    if (!photo) return;
    setPhotoBusy(true);
    try {
      await downloadSinglePhoto(photo, event.title);
    } finally {
      setPhotoBusy(false);
    }
  }, [lightboxIndex, photos, event]);

  const handleDownloadAll = useCallback(async () => {
    if (!event || photos.length === 0 || zipStatus === "busy") return;
    setZipStatus("busy");
    setZipProgress(0);
    setZipMessage(t.memory.event.preparing);
    try {
      const included = await downloadEventPhotosZip(photos, event.title, (progress) => {
        setZipProgress(Math.round((progress.done / progress.total) * 100));
        if (progress.done > 0) setZipMessage(t.memory.event.downloading);
      });
      if (included === photos.length) {
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
  }, [event, photos, zipStatus, t]);

  /* -------- Estado de carregamento / não encontrado -------- */
  if (loading) {
    return (
      <div className="container pt-44 pb-24 flex justify-center">
        <p className="eyebrow eyebrow-bare muted">{t.common.loading}</p>
      </div>
    );
  }
  if (!event) {
    return <NotFound />;
  }

  const meta = [
    {
      icon: CalendarDays,
      label: formatEventDate(event.date, lang),
    },
    {
      icon: FolderOpen,
      label: categoryName ?? t.memory.admin.uncategorized,
    },
    {
      icon: Camera,
      label: `${photos.length} ${t.memory.event.photosLabel}`,
    },
  ];

  const zipBlocked = zipStatus === "busy" || photos.length === 0;

  return (
    <div className="flex flex-col">
      {/* Cabeçalho do evento */}
      <section className="pt-32 pb-10 lg:pt-44 lg:pb-14">
        <div className="container">
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
          <p className="lede mt-6 max-w-2xl">{event.description}</p>

          <div className="mem-actions mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:flex-wrap">
            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={zipBlocked}
              className="btn btn-primary btn-lg"
            >
              {zipStatus === "busy" ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <Download size={16} aria-hidden="true" />
              )}
              <span>
                {zipStatus === "busy"
                  ? zipMessage || t.memory.event.preparing
                  : `${t.memory.event.downloadAll} · ZIP`}
              </span>
            </button>
            {zipStatus !== "busy" && zipMessage && (
              <p
                className={`mem-zip-note ${zipStatus === "failed" ? "mem-zip-note-error" : ""}`}
                role="status"
              >
                {zipMessage}
              </p>
            )}
            {!zipMessage && (
              <p className="muted text-[0.68rem] uppercase tracking-[0.18em]">
                {t.memory.event.zoomHint}
              </p>
            )}
          </div>

          {zipStatus === "busy" && (
            <div className="mem-zip-progress mt-4" aria-hidden="true">
              <span style={{ width: `${zipProgress}%` }} />
            </div>
          )}

          <p className="mem-note mt-8">
            <span className="mem-note-dot" aria-hidden="true" />
            {t.memory.demoNote}
          </p>
        </div>
      </section>

      {/* Grelha de fotografias */}
      <section className="pb-24 lg:pb-28" aria-label={event.title}>
        <div className="container">
          {photos.length === 0 ? (
            <p className="muted">{t.memory.event.photosLabel}: 0</p>
          ) : (
            <PhotoMasonry photos={photos} onOpen={setLightboxIndex} />
          )}
        </div>
      </section>

      {/* Mais eventos */}
      {otherEvents.length > 0 && (
        <section className="hairline-t pb-24 lg:pb-32" aria-label={t.memory.moreEvents}>
          <div className="container section-y">
            <Reveal>
              <p className="eyebrow mb-6">{t.memory.pageHeroEyebrow}</p>
              <h2 className="display-md max-w-3xl">
                {t.memory.moreEvents}
              </h2>
            </Reveal>
            <div className="mem-grid mem-grid-tight mt-12">
              {otherEvents.map((item) => (
                <EventCard
                  key={item.id}
                  event={item}
                  categoryName={categories.find((c) => c.id === item.categoryId)?.name}
                  photoCount={photoCounts[item.id] ?? 0}
                  compact
                />
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

      {/* Lightbox reutilizado, com descarga individual */}
      <Lightbox
        isOpen={lightboxIndex !== null}
        images={photos.map((photo) => photo.src)}
        currentIndex={lightboxIndex ?? 0}
        titles={photos.map((photo) => photo.alt || event.title)}
        onSelect={setLightboxIndex}
        onClose={closeLightbox}
        onPrev={() => stepLightbox(-1)}
        onNext={() => stepLightbox(1)}
        onDownload={handleDownloadSingle}
        downloadLabel={t.memory.event.downloadPhoto}
        downloadDisabled={photoBusy}
      />
    </div>
  );
};
