import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, Eye, EyeOff, MapPin, Pencil, Search, Send, Trash2 } from "lucide-react";
import { normalizeText } from "../../../data/memory/utils";
import { adminRoutes } from "../../config/routes";
import { memoryAdminRepository } from "../../data/repository";
import { eventStatusMeta, formatDate } from "../../data/labels";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useAdminAction } from "../../hooks/useAdminAction";
import { DataError } from "../../components/DataState";
import { EmptyState } from "../../components/EmptyState";
import { TableSkeleton } from "../../components/Skeleton";
import { ConfirmDialog } from "../../components/Dialog";
import { PageHeader, StatusBadge } from "../../components/ui";
import { EventFormDrawer } from "./EventFormDrawer";
import type { AdminEvent, EventStatus } from "../../data/types";

type StatusFilter = EventStatus | "all";

export const EventsPage: React.FC = () => {
  const events = useAsyncResource(() => memoryAdminRepository.listEvents(), "events");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [editing, setEditing] = useState<AdminEvent | null | "new">(null);
  const [deleting, setDeleting] = useState<AdminEvent | null>(null);
  const { run, busy } = useAdminAction();

  const visible = useMemo(() => {
    if (events.status !== "success") return [];
    const needle = normalizeText(query.trim());
    return events.data.filter(
      (event) =>
        (statusFilter === "all" || event.status === statusFilter) &&
        (!needle || normalizeText(`${event.title} ${event.location}`).includes(needle))
    );
  }, [events, query, statusFilter]);

  const togglePublish = async (event: AdminEvent) => {
    const next: EventStatus = event.status === "published" ? "draft" : "published";
    const ok = await run(
      () => memoryAdminRepository.setEventStatus(event.id, next),
      next === "published" ? "Evento publicado." : "Evento despublicado."
    );
    if (ok) events.reload();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const ok = await run(() => memoryAdminRepository.deleteEvent(deleting.id), "Evento eliminado.");
    if (ok) {
      setDeleting(null);
      events.reload();
    }
  };

  return (
    <div className="mc-page">
      <PageHeader
        eyebrow="Conteúdo"
        title="Eventos"
        description="Crie, edite e publique os eventos da galeria Save Your Memory."
        actions={
          <button type="button" className="mc-btn mc-btn-primary" onClick={() => setEditing("new")}>
            <CalendarPlus size={15} aria-hidden="true" /> Novo evento
          </button>
        }
      />

      <div className="mc-toolbar">
        <div className="mc-search">
          <Search size={15} aria-hidden="true" />
          <input
            type="search"
            className="mc-input"
            placeholder="Pesquisar por título ou local"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Pesquisar eventos"
          />
        </div>
        <div className="mc-segmented" role="group" aria-label="Filtrar por estado">
          {(["all", "published", "draft", "archived"] as StatusFilter[]).map((value) => (
            <button
              key={value}
              type="button"
              className={statusFilter === value ? "active" : ""}
              aria-pressed={statusFilter === value}
              onClick={() => setStatusFilter(value)}
            >
              {value === "all" ? "Todos" : eventStatusMeta[value].label}
            </button>
          ))}
        </div>
      </div>

      {events.status === "loading" && <TableSkeleton />}
      {events.status === "error" && (
        <div className="mc-card">
          <DataError error={events.error} subject="Os eventos" onRetry={events.reload} />
        </div>
      )}
      {events.status === "success" &&
        (visible.length === 0 ? (
          <div className="mc-card">
            <EmptyState
              icon={CalendarPlus}
              title={events.data.length === 0 ? "Ainda não existem eventos" : "Nenhum evento encontrado"}
              description={events.data.length === 0 ? "Crie o primeiro evento para começar a organizar álbuns e fotografias." : "Ajuste a pesquisa ou o filtro de estado."}
            />
          </div>
        ) : (
          <div className="mc-card mc-table-wrap">
            <table className="mc-table">
              <thead>
                <tr>
                  <th scope="col">Evento</th>
                  <th scope="col">Data</th>
                  <th scope="col">Conteúdo</th>
                  <th scope="col">Estado</th>
                  <th scope="col"><span className="mc-visually-hidden">Acções</span></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((event) => (
                  <tr key={event.id}>
                    <td data-label="Evento">
                      <div className="mc-cell-media">
                        <span className="mc-thumb">{event.coverUrl && <img src={event.coverUrl} alt="" loading="lazy" />}</span>
                        <span className="mc-cell-text">
                          <Link to={adminRoutes.event(event.id)} className="mc-cell-title">{event.title}</Link>
                          <span className="mc-cell-sub"><MapPin size={12} aria-hidden="true" /> {event.location}</span>
                        </span>
                      </div>
                    </td>
                    <td data-label="Data">{formatDate(event.eventDate)}</td>
                    <td data-label="Conteúdo">{event.albumCount} álbuns · {event.photoCount} fotos</td>
                    <td data-label="Estado"><StatusBadge {...eventStatusMeta[event.status]} /></td>
                    <td className="mc-cell-actions">
                      <Link to={adminRoutes.event(event.id)} className="mc-icon-btn" aria-label={`Ver detalhes de ${event.title}`} title="Ver detalhes">
                        <Eye size={15} aria-hidden="true" />
                      </Link>
                      <button type="button" className="mc-icon-btn" onClick={() => setEditing(event)} aria-label={`Editar ${event.title}`} title="Editar">
                        <Pencil size={15} aria-hidden="true" />
                      </button>
                      {event.status !== "archived" && (
                        <button
                          type="button"
                          className="mc-icon-btn"
                          onClick={() => void togglePublish(event)}
                          disabled={busy}
                          aria-label={event.status === "published" ? `Despublicar ${event.title}` : `Publicar ${event.title}`}
                          title={event.status === "published" ? "Despublicar" : "Publicar"}
                        >
                          {event.status === "published" ? <EyeOff size={15} aria-hidden="true" /> : <Send size={15} aria-hidden="true" />}
                        </button>
                      )}
                      <button type="button" className="mc-icon-btn mc-icon-btn-danger" onClick={() => setDeleting(event)} aria-label={`Eliminar ${event.title}`} title="Eliminar">
                        <Trash2 size={15} aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {editing && (
        <EventFormDrawer
          event={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            events.reload();
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        tone="danger"
        title="Eliminar evento?"
        description={`"${deleting?.title ?? ""}" e todos os seus álbuns e fotografias serão eliminados permanentemente.`}
        confirmLabel="Eliminar evento"
        busy={busy}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
};
