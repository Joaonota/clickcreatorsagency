import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { EventForm } from "./EventForm";
import { useTranslation } from "../../../i18n";
import { memoryApi } from "../../../services/memoryApi";
import { displayCover, formatEventDate } from "../../../data/memory";
import type { MemoryCategory, MemoryEvent, MemoryPhoto } from "../../../data/memory";

interface EventsManagerProps {
  events: MemoryEvent[];
  categories: MemoryCategory[];
  photos: MemoryPhoto[];
  onDataChanged: () => Promise<void>;
  onNotice: (message: string) => void;
}

type View =
  | { mode: "list" }
  | { mode: "create" }
  | { mode: "edit"; eventId: string };

type StatusFilter = "all" | "published" | "draft";
type SortKey = "newest" | "oldest" | "title";

const normalizeStr = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

/** Lista + edição de eventos do painel Save Your Memory (dados MOCK). */
export const EventsManager: React.FC<EventsManagerProps> = ({
  events,
  categories,
  photos,
  onDataChanged,
  onNotice,
}) => {
  const { t, lang } = useTranslation();
  const [view, setView] = useState<View>({ mode: "list" });
  const [deletePendingId, setDeletePendingId] = useState<string | null>(null);
  const [statusBusyId, setStatusBusyId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");

  const categoryName = (categoryId: string) =>
    categoryId
      ? categories.find((category) => category.id === categoryId)?.name
      : t.memory.admin.uncategorized;

  const photoCount = (eventId: string) =>
    photos.filter((photo) => photo.eventId === eventId).length;

  // Depois de criar, o formulário passa a editar o evento recém-criado
  // (snapshot usado até a lista refrescar — evita piscar para a lista)
  const [createdSnapshot, setCreatedSnapshot] = useState<MemoryEvent | null>(null);

  const activeEventId = view.mode === "edit" ? view.eventId : null;

  useEffect(() => {
    // Ao entrar/sair do formulário, volta ao topo
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [view.mode, activeEventId]);

  const handleSaved = (event: MemoryEvent, isNew: boolean) => {
    if (isNew) {
      setCreatedSnapshot(event);
      setView({ mode: "edit", eventId: event.id });
    } else if (view.mode === "edit") {
      setView({ mode: "edit", eventId: event.id });
    }
    void onDataChanged();
  };

  const handleStatus = async (event: MemoryEvent) => {
    setStatusBusyId(event.id);
    try {
      await memoryApi.setEventStatus(event.id, event.status === "published" ? "draft" : "published");
      await onDataChanged();
      onNotice(t.memory.admin.savedNote);
    } finally {
      setStatusBusyId(null);
    }
  };

  const handleDelete = async (event: MemoryEvent) => {
    await memoryApi.deleteEvent(event.id);
    await onDataChanged();
    onNotice(t.memory.admin.savedNote);
    setDeletePendingId(null);
  };

  const visibleEvents = useMemo(() => {
    const query = normalizeStr(search.trim());
    const filtered = events.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (categoryFilter !== "all" && item.categoryId !== categoryFilter) return false;
      if (query) {
        const haystack = normalizeStr(`${item.title} ${item.description ?? ""}`);
        if (!haystack.includes(query)) return false;
      }
      return true;
    });
    const sorted = [...filtered];
    if (sortBy === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title, lang));
    } else {
      sorted.sort((a, b) =>
        sortBy === "newest"
          ? (b.date ?? "").localeCompare(a.date ?? "")
          : (a.date ?? "").localeCompare(b.date ?? "")
      );
    }
    return sorted;
  }, [events, search, statusFilter, categoryFilter, sortBy, lang]);

  const filtersActive =
    search.trim() !== "" || statusFilter !== "all" || categoryFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
  };

  if (view.mode !== "list") {
    const editing =
      view.mode === "edit"
        ? events.find((item) => item.id === view.eventId) ?? createdSnapshot
        : null;
    if (view.mode === "edit" && !editing) {
      return (
        <div>
          <p className="muted">{t.memory.admin.eventsEmpty}</p>
        </div>
      );
    }
    return (
      <EventForm
        key={editing?.id ?? "create"}
        event={editing ?? null}
        categories={categories}
        onCancel={() => {
          setCreatedSnapshot(null);
          setView({ mode: "list" });
        }}
        onSaved={handleSaved}
        onDataChanged={onDataChanged}
        onNotice={onNotice}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[var(--text-muted)]">
          {t.memory.statsEvents} · {visibleEvents.length}
          {filtersActive && events.length !== visibleEvents.length
            ? ` / ${events.length}`
            : ""}
        </p>
        <button
          type="button"
          onClick={() => {
            setCreatedSnapshot(null);
            setView({ mode: "create" });
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus size={14} aria-hidden="true" />
          <span>{t.memory.admin.newEvent}</span>
        </button>
      </div>

      {/* Pesquisa, filtros e ordenação */}
      {events.length > 0 && (
        <div className="adm-filters mt-6">
          <div className="adm-search-wrap">
            <Search size={14} className="adm-search-icon" aria-hidden="true" />
            <input
              type="search"
              role="searchbox"
              aria-label={t.memory.admin.searchLabel}
              placeholder={t.memory.admin.searchPlaceholder}
              className="field"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                type="button"
                onClick={clearFilters}
                aria-label={t.memory.admin.clearFilters}
                className="adm-search-clear"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <div className="adm-tabs" role="group" aria-label={t.memory.admin.colStatus}>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              aria-pressed={statusFilter === "all"}
              className={`adm-chip ${statusFilter === "all" ? "active" : ""}`}
            >
              {t.memory.admin.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              aria-pressed={statusFilter === "published"}
              className={`adm-chip ${statusFilter === "published" ? "active" : ""}`}
            >
              {t.memory.admin.filterPublished}
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("draft")}
              aria-pressed={statusFilter === "draft"}
              className={`adm-chip ${statusFilter === "draft" ? "active" : ""}`}
            >
              {t.memory.admin.filterDrafts}
            </button>
          </div>

          <span className="adm-filters-spacer" />

          <select
            className="adm-select-mini"
            aria-label={t.memory.admin.filterCategory}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">{t.memory.admin.filterCategory}: {t.memory.admin.filterAll}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            className="adm-select-mini"
            aria-label={t.memory.admin.sortBy}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
          >
            <option value="newest">{t.memory.admin.sortNewest}</option>
            <option value="oldest">{t.memory.admin.sortOldest}</option>
            <option value="title">{t.memory.admin.sortTitle}</option>
          </select>
        </div>
      )}

      {events.length === 0 ? (
        <p className="muted mt-8">{t.memory.admin.eventsEmpty}</p>
      ) : visibleEvents.length === 0 ? (
        <div className="adm-empty mt-8">
          <Search size={18} className="text-[var(--primary)]" aria-hidden="true" />
          <p className="muted">{t.memory.admin.noResults}</p>
          <button type="button" onClick={clearFilters} className="btn btn-outline btn-sm">
            <X size={13} aria-hidden="true" />
            <span>{t.memory.admin.clearFilters}</span>
          </button>
        </div>
      ) : (
        <ul className="mt-2">
          {visibleEvents.map((event) => (
            <li key={event.id} className="adm-row">
              {/* Capa */}
              <Link to={`/memoria/${event.slug}`} className="adm-cover-thumb media-frame" tabIndex={-1}>
                <img src={displayCover(event)} alt="" loading="lazy" />
              </Link>

              {/* Nome + categoria + extra */}
              <div className="adm-row-main">
                <p className="adm-row-title">
                  <Link to={`/memoria/${event.slug}`} className="link-sweep">
                    {event.title}
                  </Link>
                </p>
                <span className="adm-row-meta-line text-[var(--primary)]">
                  {categoryName(event.categoryId)}
                </span>
                <span className="adm-row-meta-line">
                  {formatEventDate(event.date, lang)}
                </span>
                <span className="adm-row-meta-line">
                  {photoCount(event.id)} {t.memory.admin.colPhotos}
                </span>
                <span
                  className={`adm-status ${
                    event.status === "published" ? "adm-status-published" : "adm-status-draft"
                  }`}
                >
                  {event.status === "published"
                    ? t.memory.admin.published
                    : t.memory.admin.draft}
                </span>
              </div>

              {/* Ações */}
              {deletePendingId === event.id ? (
                <div className="adm-row-actions">
                  <button
                    type="button"
                    onClick={() => void handleDelete(event)}
                    aria-label={t.memory.admin.confirmYes}
                    className="adm-icon-btn adm-icon-btn-danger"
                  >
                    <Check size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletePendingId(null)}
                    aria-label={t.memory.admin.cancel}
                    className="adm-icon-btn"
                  >
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div className="adm-row-actions">
                  <button
                    type="button"
                    onClick={() => void handleStatus(event)}
                    disabled={statusBusyId === event.id}
                    aria-label={
                      event.status === "published"
                        ? t.memory.admin.unpublish
                        : t.memory.admin.publish
                    }
                    title={
                      event.status === "published"
                        ? t.memory.admin.unpublish
                        : t.memory.admin.publish
                    }
                    className={`adm-icon-btn ${
                      event.status === "published" ? "adm-icon-btn-active" : ""
                    }`}
                  >
                    {event.status === "published" ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCreatedSnapshot(null);
                      setView({ mode: "edit", eventId: event.id });
                    }}
                    aria-label={t.memory.admin.edit}
                    title={t.memory.admin.edit}
                    className="adm-icon-btn"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletePendingId(event.id)}
                    aria-label={t.memory.admin.delete}
                    title={t.memory.admin.delete}
                    className="adm-icon-btn adm-icon-btn-danger"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
