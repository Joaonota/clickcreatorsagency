import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, LogOut, RotateCcw } from "lucide-react";
import { LoginView } from "../../components/memory/admin/LoginView";
import { EventsManager } from "../../components/memory/admin/EventsManager";
import { CategoriesManager } from "../../components/memory/admin/CategoriesManager";
import { Reveal } from "../../hooks/useReveal";
import { useTranslation } from "../../i18n";
import { memoryApi } from "../../services/memoryApi";
import { memoryAuth, type DemoUser } from "../../services/memoryAuth";
import type { MemoryCategory, MemoryEvent, MemoryPhoto } from "../../data/memory";

type AdminTab = "events" | "categories";

/**
 * SAVE YOUR MEMORY — Painel administrativo (DEMO).
 * Autenticação local simulada; operações sobre dados mockados
 * em memória — nada é gravado num servidor / base de dados.
 */
export const MemoryAdminPage: React.FC = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<DemoUser | null>(() => memoryAuth.getUser());
  const [tab, setTab] = useState<AdminTab>("events");

  const [events, setEvents] = useState<MemoryEvent[]>([]);
  const [categories, setCategories] = useState<MemoryCategory[]>([]);
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    document.title = t.memory.admin.pageTitle;
  }, [t]);

  /* --------- Carregar (e recarregar) dados mockados --------- */
  const refreshData = useCallback(async () => {
    const [eventsData, categoriesData, photosData] = await Promise.all([
      memoryApi.getAllEvents(),
      memoryApi.getAllCategories(),
      memoryApi.getAllPhotos(),
    ]);
    setEvents(eventsData);
    setCategories(categoriesData);
    setPhotos(photosData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    (async () => {
      await refreshData();
    })();
    return undefined;
  }, [user, refreshData]);

  /* Toast — desaparece sozinho */
  useEffect(() => {
    if (!notice) return undefined;
    const timer = window.setTimeout(() => setNotice(""), 3400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const photoCount = useMemo(() => {
    const counts: Record<string, number> = {};
    photos.forEach((photo) => {
      counts[photo.eventId] = (counts[photo.eventId] ?? 0) + 1;
    });
    return counts;
  }, [photos]);

  /* ------------------------- Login demo --------------------- */
  if (!user) {
    return (
      <div className="min-h-screen">
        <LoginView
          onLogin={(loggedUser) => {
            setUser(loggedUser);
            setLoading(true);
          }}
        />
      </div>
    );
  }

  const handleRestoreDemo = () => {
    if (window.confirm(`${t.memory.admin.restoreDemo}?`)) {
      void memoryApi
        .resetDemoData()
        .then(() => refreshData())
        .then(() => setNotice(t.memory.admin.restoreDemoDone));
    }
  };

  const handleLogout = () => {
    memoryAuth.logout();
    setUser(null);
  };

  return (
    <div className="flex flex-col pb-24">
      {/* Cabeçalho do painel */}
      <section className="pt-32 lg:pt-40">
        <div className="container">
          <Reveal>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="eyebrow mb-4">
                  {t.memory.pageHeroEyebrow} — {t.memory.admin.loginEyebrow}
                </p>
                <span className="mem-note">
                  <span className="mem-note-dot" aria-hidden="true" />
                  {t.memory.admin.loginDemoHintTitle}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link to="/memoria" className="arrow-link">
                  {t.memory.admin.backToGallery}
                  <span className="arrow-line" aria-hidden="true" />
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                <button
                  type="button"
                  onClick={handleRestoreDemo}
                  className="btn btn-outline btn-sm"
                >
                  <RotateCcw size={13} aria-hidden="true" />
                  <span>{t.memory.admin.restoreDemo}</span>
                </button>
                <button type="button" onClick={handleLogout} className="btn btn-outline btn-sm">
                  <LogOut size={13} aria-hidden="true" />
                  <span>{t.memory.admin.logout}</span>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <h1 className="display-md">
                <span className="block">{t.memory.admin.loginTitleLine1}</span>
                <span className="block text-outline-lime">{t.memory.admin.loginTitleLine2}</span>
              </h1>
            </div>
            <p className="flex flex-wrap items-center gap-3 text-[0.72rem] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
              <span className="text-[var(--primary)]">
                {t.memory.admin.welcome}, {user.displayName}!
              </span>
              <span aria-hidden="true">·</span>
              <span>{t.memory.admin.subtitle}</span>
              <span aria-hidden="true">·</span>
              <span>
                {events.length} {t.memory.statsEvents} ·{" "}
                {Object.values(photoCount).reduce((a, b) => a + b, 0)} {t.memory.statsPhotos}
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Abas + conteúdo */}
      <section className="pt-10">
        <div className="container">
          <div className="adm-header-line" />

          <div className="adm-toolbar mt-8">
            <div className="adm-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={tab === "events"}
                onClick={() => setTab("events")}
                className={`adm-tab ${tab === "events" ? "active" : ""}`}
              >
                {t.memory.admin.navEvents} · {events.length}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "categories"}
                onClick={() => setTab("categories")}
                className={`adm-tab ${tab === "categories" ? "active" : ""}`}
              >
                {t.memory.admin.navCategories} · {categories.length}
              </button>
            </div>
          </div>

          {loading ? (
            <p className="eyebrow eyebrow-bare muted mt-12">{t.common.loading}</p>
          ) : (
            <div className="mt-8">
              {tab === "events" ? (
                <EventsManager
                  events={events}
                  categories={categories}
                  photos={photos}
                  onDataChanged={refreshData}
                  onNotice={setNotice}
                />
              ) : (
                <CategoriesManager
                  categories={categories}
                  events={events}
                  onChanged={refreshData}
                  onNotice={setNotice}
                />
              )}
            </div>
          )}
        </div>
      </section>

      {/* Toast de avisos */}
      {notice && (
        <p className="adm-toast" role="status">
          <Check size={13} aria-hidden="true" />
          {notice}
        </p>
      )}
    </div>
  );
};
