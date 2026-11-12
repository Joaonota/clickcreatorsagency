import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCheck, Eye, EyeOff, Images, Trash2 } from "lucide-react";
import { memoryAdminRepository } from "../../data/repository";
import { photoStatusMeta } from "../../data/labels";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useAdminAction } from "../../hooks/useAdminAction";
import { DataError } from "../../components/DataState";
import { EmptyState } from "../../components/EmptyState";
import { GridSkeleton } from "../../components/Skeleton";
import { ConfirmDialog } from "../../components/Dialog";
import { PageHeader } from "../../components/ui";
import { PhotoUploader } from "./PhotoUploader";
import { PhotoGrid } from "./PhotoGrid";
import type { PhotoStatus } from "../../data/types";

export const PhotosPage: React.FC = () => {
  const [params, setParams] = useSearchParams();
  const eventId = params.get("event") ?? "";
  const status = (params.get("status") ?? "") as PhotoStatus | "";

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const events = useAsyncResource(() => memoryAdminRepository.listEvents(), "events");
  const photos = useAsyncResource(
    () =>
      memoryAdminRepository.listPhotos({
        eventId: eventId || undefined,
        status: status || undefined,
      }),
    `photos:${eventId}:${status}`
  );

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { run, busy } = useAdminAction();

  const photoIds = useMemo(() => (photos.status === "success" ? photos.data.map((photo) => photo.id) : []), [photos]);
  const selectedIds = photoIds.filter((id) => selected.has(id));
  const eventTitle = events.status === "success" ? events.data.find((event) => event.id === eventId)?.title : undefined;

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const bulk = async (next: PhotoStatus, message: string) => {
    const ok = await run(() => memoryAdminRepository.setPhotoStatus(selectedIds, next), message);
    if (ok) {
      setSelected(new Set());
      photos.reload();
    }
  };

  const removeSelected = async () => {
    const ok = await run(() => memoryAdminRepository.deletePhotos(selectedIds), "Fotografias eliminadas.");
    if (ok) {
      setConfirmDelete(false);
      setSelected(new Set());
      photos.reload();
    }
  };

  return (
    <div className="mc-page">
      <PageHeader eyebrow="Conteúdo" title="Fotos e vídeos" description="Escolha o evento e carregue as fotografias e os vídeos directamente." />

      <div className="mc-toolbar mc-toolbar-filters">
        <label className="mc-inline-field">
          <span className="mc-label">Evento</span>
          <select className="mc-input mc-select" value={eventId} onChange={(e) => setFilter("event", e.target.value)} disabled={events.status !== "success"}>
            <option value="">{events.status === "success" ? "Todos os eventos" : "Eventos indisponíveis"}</option>
            {events.status === "success" &&
              events.data.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
          </select>
        </label>
        <label className="mc-inline-field">
          <span className="mc-label">Estado</span>
          <select className="mc-input mc-select" value={status} onChange={(e) => setFilter("status", e.target.value)}>
            <option value="">Todos</option>
            {(Object.keys(photoStatusMeta) as PhotoStatus[]).map((value) => (
              <option key={value} value={value}>{photoStatusMeta[value].label}</option>
            ))}
          </select>
        </label>
      </div>

      <PhotoUploader eventId={eventId} eventLabel={eventTitle} onUploaded={photos.reload} />

      <section aria-label="Fotografias carregadas" className="mc-stack">
        <div className="mc-section-bar">
          <p className="mc-section-label">
            {photos.status === "success" ? `${photos.data.length} fotografias` : "Fotografias"}
            {selectedIds.length > 0 && ` · ${selectedIds.length} seleccionada(s)`}
          </p>
          {photoIds.length > 0 && (
            <button
              type="button"
              className="mc-btn mc-btn-ghost mc-btn-sm"
              onClick={() => setSelected(selectedIds.length === photoIds.length ? new Set() : new Set(photoIds))}
            >
              {selectedIds.length === photoIds.length ? "Limpar selecção" : "Seleccionar todas"}
            </button>
          )}
        </div>

        {selectedIds.length > 0 && (
          <div className="mc-bulkbar" role="toolbar" aria-label="Acções sobre a selecção">
            <button type="button" className="mc-btn mc-btn-secondary mc-btn-sm" disabled={busy} onClick={() => void bulk("approved", "Fotografias aprovadas.")}>
              <CheckCheck size={14} aria-hidden="true" /> Aprovar
            </button>
            <button type="button" className="mc-btn mc-btn-secondary mc-btn-sm" disabled={busy} onClick={() => void bulk("published", "Fotografias publicadas.")}>
              <Eye size={14} aria-hidden="true" /> Publicar
            </button>
            <button type="button" className="mc-btn mc-btn-secondary mc-btn-sm" disabled={busy} onClick={() => void bulk("hidden", "Fotografias despublicadas.")}>
              <EyeOff size={14} aria-hidden="true" /> Despublicar
            </button>
            <button type="button" className="mc-btn mc-btn-danger-ghost mc-btn-sm" disabled={busy} onClick={() => setConfirmDelete(true)}>
              <Trash2 size={14} aria-hidden="true" /> Eliminar
            </button>
          </div>
        )}

        {photos.status === "loading" && <GridSkeleton />}
        {photos.status === "error" && (
          <div className="mc-card"><DataError error={photos.error} subject="As fotografias" onRetry={photos.reload} /></div>
        )}
        {photos.status === "success" &&
          (photos.data.length === 0 ? (
            <div className="mc-card">
              <EmptyState icon={Images} title="Sem fotografias" description="Não existem fotografias para os filtros seleccionados." />
            </div>
          ) : (
            <PhotoGrid photos={photos.data} selected={selected} onToggle={toggle} />
          ))}
      </section>

      <ConfirmDialog
        open={confirmDelete}
        tone="danger"
        title={`Eliminar ${selectedIds.length} fotografia(s)?`}
        description="Os ficheiros serão removidos do armazenamento. Esta acção não pode ser anulada."
        confirmLabel="Eliminar"
        busy={busy}
        onConfirm={() => void removeSelected()}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
};
