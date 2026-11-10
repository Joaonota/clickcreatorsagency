import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowUp, Eye, EyeOff, FolderPlus, Library, Pencil, Trash2 } from "lucide-react";
import { memoryAdminRepository } from "../../data/repository";
import { albumStatusMeta } from "../../data/labels";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useAdminAction } from "../../hooks/useAdminAction";
import { DataError } from "../../components/DataState";
import { EmptyState } from "../../components/EmptyState";
import { TableSkeleton } from "../../components/Skeleton";
import { ConfirmDialog } from "../../components/Dialog";
import { PageHeader, StatusBadge } from "../../components/ui";
import { AlbumFormDrawer } from "./AlbumFormDrawer";
import type { AdminAlbum, AdminEvent } from "../../data/types";

export const AlbumsPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const eventId = params.get("event") ?? "";
  const events = useAsyncResource(() => memoryAdminRepository.listEvents(), "events");

  const selectEvent = (id: string) => setParams(id ? { event: id } : {}, { replace: true });

  return (
    <div className="mc-page">
      <PageHeader eyebrow="Conteúdo" title="Álbuns" description="Organize as fotografias de cada evento em álbuns ordenáveis." />

      {events.status === "loading" && <TableSkeleton rows={4} />}
      {events.status === "error" && (
        <div className="mc-card">
          <DataError error={events.error} subject="Os eventos e respectivos álbuns" onRetry={events.reload} />
        </div>
      )}
      {events.status === "success" &&
        (events.data.length === 0 ? (
          <div className="mc-card">
            <EmptyState icon={Library} title="Ainda não existem eventos" description="Crie um evento antes de adicionar álbuns." />
          </div>
        ) : (
          <>
            <div className="mc-toolbar">
              <label className="mc-inline-field">
                <span className="mc-label">Evento</span>
                <select className="mc-input mc-select" value={eventId} onChange={(e) => selectEvent(e.target.value)}>
                  <option value="">Escolher evento…</option>
                  {events.data.map((event) => (
                    <option key={event.id} value={event.id}>{event.title}</option>
                  ))}
                </select>
              </label>
            </div>
            {eventId ? (
              <EventAlbums key={eventId} eventId={eventId} events={events.data} />
            ) : (
              <div className="mc-card">
                <EmptyState icon={Library} title="Escolha um evento" description="Seleccione um evento para ver e ordenar os seus álbuns." />
              </div>
            )}
          </>
        ))}
    </div>
  );
};

const EventAlbums: React.FC<{ eventId: string; events: AdminEvent[] }> = ({ eventId, events }) => {
  const albums = useAsyncResource(() => memoryAdminRepository.listAlbums(eventId), `albums:${eventId}`);
  const [editing, setEditing] = useState<AdminAlbum | null | "new">(null);
  const [deleting, setDeleting] = useState<AdminAlbum | null>(null);
  const { run, busy } = useAdminAction();

  const sorted = albums.status === "success" ? [...albums.data].sort((a, b) => a.position - b.position) : [];

  const move = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const ids = sorted.map((album) => album.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    const ok = await run(() => memoryAdminRepository.reorderAlbums(eventId, ids), "Ordem actualizada.");
    if (ok) albums.reload();
  };

  const toggleVisibility = async (album: AdminAlbum) => {
    const next = album.status === "published" ? "hidden" : "published";
    const ok = await run(
      () => memoryAdminRepository.setAlbumStatus(album.id, next),
      next === "published" ? "Álbum publicado." : "Álbum ocultado."
    );
    if (ok) albums.reload();
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    const ok = await run(() => memoryAdminRepository.deleteAlbum(deleting.id), "Álbum eliminado.");
    if (ok) {
      setDeleting(null);
      albums.reload();
    }
  };

  return (
    <>
      <div className="mc-section-bar">
        <p className="mc-section-label">{albums.status === "success" ? `${sorted.length} álbuns` : "Álbuns"}</p>
        <button type="button" className="mc-btn mc-btn-primary" onClick={() => setEditing("new")}>
          <FolderPlus size={15} aria-hidden="true" /> Novo álbum
        </button>
      </div>

      {albums.status === "loading" && <TableSkeleton rows={4} />}
      {albums.status === "error" && (
        <div className="mc-card"><DataError error={albums.error} subject="Os álbuns" onRetry={albums.reload} /></div>
      )}
      {albums.status === "success" &&
        (sorted.length === 0 ? (
          <div className="mc-card">
            <EmptyState icon={Library} title="Sem álbuns neste evento" description="Ex.: Cerimónia, Bastidores, Convidados, After Party." />
          </div>
        ) : (
          <ol className="mc-card mc-album-list">
            {sorted.map((album, index) => (
              <li key={album.id} className="mc-album-row">
                <span className="mc-album-pos" aria-label={`Posição ${index + 1}`}>{String(index + 1).padStart(2, "0")}</span>
                <span className="mc-thumb">{album.coverUrl && <img src={album.coverUrl} alt="" loading="lazy" />}</span>
                <span className="mc-cell-text">
                  <span className="mc-cell-title">{album.title}</span>
                  <span className="mc-cell-sub">{album.photoCount} fotografias{album.description ? ` · ${album.description}` : ""}</span>
                </span>
                <StatusBadge {...albumStatusMeta[album.status]} />
                <span className="mc-cell-actions">
                  <button type="button" className="mc-icon-btn" onClick={() => void move(index, -1)} disabled={busy || index === 0} aria-label={`Subir ${album.title}`} title="Subir">
                    <ArrowUp size={15} aria-hidden="true" />
                  </button>
                  <button type="button" className="mc-icon-btn" onClick={() => void move(index, 1)} disabled={busy || index === sorted.length - 1} aria-label={`Descer ${album.title}`} title="Descer">
                    <ArrowDown size={15} aria-hidden="true" />
                  </button>
                  <button type="button" className="mc-icon-btn" onClick={() => void toggleVisibility(album)} disabled={busy} aria-label={album.status === "published" ? `Ocultar ${album.title}` : `Publicar ${album.title}`} title={album.status === "published" ? "Ocultar" : "Publicar"}>
                    {album.status === "published" ? <EyeOff size={15} aria-hidden="true" /> : <Eye size={15} aria-hidden="true" />}
                  </button>
                  <button type="button" className="mc-icon-btn" onClick={() => setEditing(album)} aria-label={`Editar ${album.title}`} title="Editar">
                    <Pencil size={15} aria-hidden="true" />
                  </button>
                  <button type="button" className="mc-icon-btn mc-icon-btn-danger" onClick={() => setDeleting(album)} aria-label={`Eliminar ${album.title}`} title="Eliminar">
                    <Trash2 size={15} aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ol>
        ))}

      {editing && (
        <AlbumFormDrawer
          album={editing === "new" ? null : editing}
          events={events}
          defaultEventId={eventId}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            albums.reload();
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleting)}
        tone="danger"
        title="Eliminar álbum?"
        description={`"${deleting?.title ?? ""}" e as suas fotografias serão eliminados permanentemente.`}
        confirmLabel="Eliminar álbum"
        busy={busy}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setDeleting(null)}
      />
    </>
  );
};
