import React, { useEffect, useMemo, useState } from "react";
import { EventCard } from "../../components/memory/EventCard";
import { MemoryToolbar } from "../../components/memory/MemoryToolbar";
import { CTASection } from "../../components/common/CTASection";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";
import { memoryPublicApi } from "../../services/memoryPublicApi";
import { normalizeText } from "../../data/memory";
import type { MemoryEvent } from "../../data/memory";

type LoadState = "loading" | "ready" | "error";

/**
 * SAVE YOUR MEMORY — Galeria pública dos eventos.
 * Lê do Supabase apenas eventos publicados (garantido por RLS).
 */
export const MemoryPage: React.FC = () => {
  const { t } = useTranslation();

  const [events, setEvents] = useState<MemoryEvent[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = t.memory.pageTitle;
  }, [t]);

  useEffect(() => {
    let active = true;
    memoryPublicApi
      .getEvents()
      .then((data) => {
        if (!active) return;
        setEvents(data);
        setState("ready");
      })
      .catch(() => {
        if (active) setState("error");
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    if (!normalizedQuery) return events;
    return events.filter((event) =>
      normalizeText([event.title, event.description, event.location].join(" ")).includes(normalizedQuery)
    );
  }, [events, query]);

  const stats = useMemo(
    () => [
      { value: String(events.length), label: t.memory.statsEvents },
      { value: String(events.reduce((sum, event) => sum + event.mediaCount, 0)), label: t.memory.statsPhotos },
      { value: String(events.reduce((sum, event) => sum + event.albumCount, 0)), label: t.memory.statsAlbums },
    ],
    [events, t.memory.statsEvents, t.memory.statsPhotos, t.memory.statsAlbums]
  );

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="pt-36 pb-10 lg:pt-48 lg:pb-14">
        <div className="container">
          <Reveal>
            <p className="eyebrow mb-6">{t.memory.pageHeroEyebrow}</p>
          </Reveal>
          <h1 className="display-xl max-w-5xl">
            <span className="block">{t.memory.pageHeroLines[0]}</span>
            <span className="block text-outline">{t.memory.pageHeroLines[1]}</span>
            <span className="block">
              {t.memory.pageHeroLines[2].replace(".", "")}
              <span className="text-[var(--primary)]">.</span>
            </span>
          </h1>
          <Reveal delay={2}>
            <p className="lede mt-8 max-w-2xl">{t.memory.pageHeroLede}</p>
          </Reveal>
        </div>
      </section>

      {/* Números da memória */}
      <section className="pb-4" aria-label={t.memory.statsEvents}>
        <div className="container">
          <div className="mem-stats" style={{ visibility: state === "ready" ? "visible" : "hidden" }}>
            {stats.map((stat, index) => (
              <div className="mem-stat" key={stat.label}>
                <span className="mem-stat-num">{stat.value}</span>
                <span className="mem-stat-label">{stat.label}</span>
                <span className="mem-stat-tick" aria-hidden="true" data-index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="pb-24 lg:pb-32">
        <div className="container">
          <MemoryToolbar query={query} onQueryChange={setQuery} resultCount={filteredEvents.length} />

          {state === "loading" && (
            <p className="eyebrow eyebrow-bare muted mt-10">{t.common.loading}</p>
          )}

          {state === "error" && (
            <div className="mem-empty">
              <p className="muted max-w-md">{t.memory.loadError}</p>
            </div>
          )}

          {state === "ready" && events.length === 0 && (
            <div className="mem-empty">
              <p className="display-sm">{t.memory.noEventsTitle}</p>
              <p className="muted mt-3 max-w-md">{t.memory.noEventsBody}</p>
            </div>
          )}

          {state === "ready" && events.length > 0 && filteredEvents.length === 0 && (
            <div className="mem-empty">
              <p className="display-sm">{t.memory.emptyTitle}</p>
              <p className="muted mt-3 max-w-md">{t.memory.emptyBody}</p>
              <button type="button" onClick={() => setQuery("")} className="btn btn-outline btn-sm mt-6">
                <span>{t.memory.emptyReset}</span>
              </button>
            </div>
          )}

          {state === "ready" && filteredEvents.length > 0 && (
            <div className="mem-grid">
              {filteredEvents.map((event, index) => (
                <Reveal key={event.id} delay={(index % 3) as 0 | 1 | 2}>
                  <EventCard event={event} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};
