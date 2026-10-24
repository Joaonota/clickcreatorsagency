import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Check,
  Eye,
  EyeOff,
  Pencil,
  Plus,
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
    if (!window.confirm(`${t.memory.admin.confirmDeleteEvent}\n\n${event.title}`)) {
      setDeletePendingId(null);
      return;
    }
    await memoryApi.deleteEvent(event.id);
    await onDataChanged();
    onNotice(t.memory.admin.savedNote);
    setDeletePendingId(null);
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
          {t.memory.statsEvents} · {events.length}
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

      {events.length === 0 ? (
        <p className="muted mt-8">{t.memory.admin.eventsEmpty}</p>
      ) : (
        <ul className="mt-2">
          {events.map((event) => (
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
                    aria-label="Confirmar eliminação"
                    title="Confirmar eliminação"
                    className="adm-icon-btn adm-icon-btn-danger"
                  >
                    <Check size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletePendingId(null)}
                    aria-label="Cancelar eliminação"
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
