import React, { useEffect, useMemo, useState } from "react";
import { EventCard } from "../../components/memory/EventCard";
import { MemoryToolbar } from "../../components/memory/MemoryToolbar";
import { CTASection } from "../../components/common/CTASection";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";
import { memoryApi } from "../../services/memoryApi";
import { normalizeText } from "../../data/memory";
import type { MemoryCategory, MemoryEvent, MemoryPhoto } from "../../data/memory";

/**
 * SAVE YOUR MEMORY — Galeria pública dos eventos (fase MOCK).
 * Dados de demonstração em memória (src/data/memory).
 */
export const MemoryPage: React.FC = () => {
  const { t } = useTranslation();

  const [events, setEvents] = useState<MemoryEvent[]>([]);
  const [categories, setCategories] = useState<MemoryCategory[]>([]);
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    document.title = t.memory.pageTitle;
  }, [t]);

  useEffect(() => {
    let active = true;
    (async () => {
      const [eventsData, categoriesData, photosData] = await Promise.all([
        memoryApi.getPublicEvents(),
        memoryApi.getCategories(),
        memoryApi.getAllPhotos(),
      ]);
      if (!active) return;
      setEvents(eventsData);
      setCategories(categoriesData);
      setPhotos(photosData);
      setLoaded(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const photoCountByEvent = useMemo(() => {
    const counts: Record<string, number> = {};
    photos.forEach((photo) => {
      counts[photo.eventId] = (counts[photo.eventId] ?? 0) + 1;
    });
    return counts;
  }, [photos]);

  const countsByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach((event) => {
      counts[event.categoryId] = (counts[event.categoryId] ?? 0) + 1;
    });
    return counts;
  }, [events]);

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => map.set(category.id, category.name));
    return map;
  }, [categories]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim());
    return events.filter((event) => {
      const matchesCategory = category === "all" || event.categoryId === category;
      if (!matchesCategory) return false;
      if (!normalizedQuery) return true;
      const haystack = normalizeText(
        [
          event.title,
          event.description,
          categoryNameById.get(event.categoryId) ?? "",
        ]
          .join(" ")
      );
      return haystack.includes(normalizedQuery);
    });
  }, [events, category, query, categoryNameById]);

  const totalPhotos = useMemo(
    () =>
      events.reduce((sum, event) => sum + (photoCountByEvent[event.id] ?? 0), 0),
    [events, photoCountByEvent]
  );

  const stats = useMemo(
    () => [
      { value: String(events.length), label: t.memory.statsEvents },
      { value: String(totalPhotos), label: t.memory.statsPhotos },
      { value: String(categories.length), label: t.memory.statsCategories },
    ],
    [events.length, totalPhotos, categories.length, t.memory.statsEvents, t.memory.statsPhotos, t.memory.statsCategories]
  );

  const resetFilters = () => {
    setQuery("");
    setCategory("all");
  };

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
          <Reveal delay={3}>
            <p className="mem-note mt-8">
              <span className="mem-note-dot" aria-hidden="true" />
              {t.memory.demoNote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Números da memória */}
      <section className="pb-4" aria-label={t.memory.statsEvents}>
        <div className="container">
          <div className="mem-stats" style={{ visibility: loaded ? "visible" : "hidden" }}>
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
          <MemoryToolbar
            categories={categories}
            countsByCategory={countsByCategory}
            activeCategory={category}
            onCategoryChange={setCategory}
            query={query}
            onQueryChange={setQuery}
            resultCount={filteredEvents.length}
          />

          {loaded && filteredEvents.length === 0 ? (
            <div className="mem-empty">
              <p className="display-sm">{t.memory.emptyTitle}</p>
              <p className="muted mt-3 max-w-md">{t.memory.emptyBody}</p>
              <button type="button" onClick={resetFilters} className="btn btn-outline btn-sm mt-6">
                <span>{t.memory.emptyReset}</span>
              </button>
            </div>
          ) : (
            <div className="mem-grid">
              {filteredEvents.map((event, index) => (
                <Reveal key={event.id} delay={(index % 3) as 0 | 1 | 2}>
                  <EventCard
                    event={event}
                    categoryName={categoryNameById.get(event.categoryId)}
                    photoCount={photoCountByEvent[event.id] ?? 0}
                  />
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
