import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, EyeOff, Library, MapPin, Pencil, Send, Trash2 } from "lucide-react";
import { adminRoutes } from "../../config/routes";
import { memoryAdminRepository } from "../../data/repository";
import { albumStatusMeta, eventStatusMeta, formatDate, formatDateTime } from "../../data/labels";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useAdminAction } from "../../hooks/useAdminAction";
import { DataError } from "../../components/DataState";
import { EmptyState } from "../../components/EmptyState";
import { TableSkeleton } from "../../components/Skeleton";
import { ConfirmDialog } from "../../components/Dialog";
import { PageHeader, StatusBadge } from "../../components/ui";
import { EventFormDrawer } from "./EventFormDrawer";

export const EventDetailsPage: React.FC = () => {
  const { eventId = "" } = useParams();
  const navigate = useNavigate();
  const detail = useAsyncResource(async () => {
    const [event, albums] = await Promise.all([
      memoryAdminRepository.getEvent(eventId),
      memoryAdminRepository.listAlbums(eventId),
    ]);
    return { event, albums };
  }, `event:${eventId}`);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { run, busy } = useAdminAction();

  const back = (
    <Link to={adminRoutes.events} className="mc-back-link">
      <ArrowLeft size={14} aria-hidden="true" /> Eventos
    </Link>
  );

  if (detail.status === "loading") {
    return (
      <div className="mc-page">
        {back}
        <TableSkeleton rows={3} />
      </div>
    );
  }

  if (detail.status === "error" || !detail.data.event) {
    return (
      <div className="mc-page">
        {back}
        <div className="mc-card">
          {detail.status === "error" ? (
            <DataError error={detail.error} subject="Os detalhes do evento" onRetry={detail.reload} />
          ) : (
            <EmptyState icon={CalendarDays} title="Evento não encontrado" description="O evento pode ter sido eliminado." />
          )}
        </div>
      </div>
    );
  }

  const { event, albums } = detail.data;
  const isPublished = event.status === "published";

  const togglePublish = async () => {
    const ok = await run(
      () => memoryAdminRepository.setEventStatus(event.id, isPublished ? "draft" : "published"),
      isPublished ? "Evento despublicado." : "Evento publicado."
    );
    if (ok) detail.reload();
  };

  const confirmDelete = async () => {
    const ok = await run(() => memoryAdminRepository.deleteEvent(event.id), "Evento eliminado.");
    if (ok) navigate(adminRoutes.events, { replace: true });
  };

  return (
    <div className="mc-page">
      {back}
      <PageHeader
        eyebrow="Detalhes do evento"
        title={event.title}
        actions={
          <>
            <button type="button" className="mc-btn mc-btn-secondary" onClick={() => setEditing(true)}>
              <Pencil size={14} aria-hidden="true" /> Editar
            </button>
            {event.status !== "archived" && (
              <button type="button" className="mc-btn mc-btn-secondary" onClick={() => void togglePublish()} disabled={busy}>
                {isPublished ? <EyeOff size={14} aria-hidden="true" /> : <Send size={14} aria-hidden="true" />}
                {isPublished ? "Despublicar" : "Publicar"}
              </button>
            )}
            <button type="button" className="mc-btn mc-btn-danger-ghost" onClick={() => setDeleting(true)}>
              <Trash2 size={14} aria-hidden="true" /> Eliminar
            </button>
          </>
        }
      />

      <div className="mc-split mc-split-detail">
        <section className="mc-card">
          {event.coverUrl && <img src={event.coverUrl} alt={`Capa de ${event.title}`} className="mc-detail-cover" />}
          <dl className="mc-meta-list">
            <div><dt>Estado</dt><dd><StatusBadge {...eventStatusMeta[event.status]} /></dd></div>
            <div><dt>Data</dt><dd><CalendarDays size={14} aria-hidden="true" /> {formatDate(event.eventDate)}</dd></div>
            <div><dt>Localização</dt><dd><MapPin size={14} aria-hidden="true" /> {event.location}</dd></div>
            <div><dt>Slug</dt><dd className="mc-mono">/memoria/{event.slug}</dd></div>
            <div><dt>Actualizado</dt><dd>{formatDateTime(event.updatedAt)}</dd></div>
          </dl>
          {event.description && <p className="mc-detail-desc">{event.description}</p>}
        </section>

        <section className="mc-card">
          <header className="mc-card-header">
            <h2 className="mc-card-title"><Library size={16} aria-hidden="true" /> Álbuns ({albums.length})</h2>
            <Link to={`${adminRoutes.albums}?event=${encodeURIComponent(event.id)}`} className="mc-btn mc-btn-ghost mc-btn-sm">
              Gerir álbuns
            </Link>
          </header>
          {albums.length === 0 ? (
            <EmptyState compact icon={Library} title="Sem álbuns" description="Crie álbuns como Cerimónia, Bastidores ou Convidados." />
          ) : (
            <ul className="mc-list">
              {albums.map((album) => (
                <li key={album.id} className="mc-list-item">
                  <span className="mc-cell-text">
                    <span className="mc-cell-title">{album.title}</span>
                    <span className="mc-cell-sub">{album.photoCount} fotografias</span>
                  </span>
                  <StatusBadge {...albumStatusMeta[album.status]} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {editing && (
        <EventFormDrawer
          event={event}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            detail.reload();
          }}
        />
      )}

      <ConfirmDialog
        open={deleting}
        tone="danger"
        title="Eliminar evento?"
        description={`"${event.title}" e todos os seus álbuns e fotografias serão eliminados permanentemente.`}
        confirmLabel="Eliminar evento"
        busy={busy}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleting(false)}
      />
    </div>
  );
};
