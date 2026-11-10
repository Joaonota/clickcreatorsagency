import React, { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCheck, Clock3, FilePen, Eye, Send, ShieldCheck } from "lucide-react";
import { adminRoutes } from "../../config/routes";
import { memoryAdminRepository } from "../../data/repository";
import { formatDate } from "../../data/labels";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useAdminAction } from "../../hooks/useAdminAction";
import { DataError } from "../../components/DataState";
import { EmptyState } from "../../components/EmptyState";
import { GridSkeleton, TableSkeleton } from "../../components/Skeleton";
import { PageHeader } from "../../components/ui";
import { PhotoGrid } from "../photos/PhotoGrid";
import type { PhotoStatus } from "../../data/types";

export const PublicationsPage: React.FC = () => {
  const pending = useAsyncResource(() => memoryAdminRepository.listPhotos({ status: "pending_review" }), "photos:pending");
  const drafts = useAsyncResource(
    async () => (await memoryAdminRepository.listEvents()).filter((event) => event.status === "draft"),
    "events:drafts"
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { run, busy } = useAdminAction();

  const pendingIds = pending.status === "success" ? pending.data.map((photo) => photo.id) : [];
  const selectedIds = pendingIds.filter((id) => selected.has(id));

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const review = async (status: PhotoStatus, message: string) => {
    const ok = await run(() => memoryAdminRepository.setPhotoStatus(selectedIds, status), message);
    if (ok) {
      setSelected(new Set());
      pending.reload();
    }
  };

  const publishEvent = async (id: string) => {
    const ok = await run(() => memoryAdminRepository.setEventStatus(id, "published"), "Evento publicado.");
    if (ok) drafts.reload();
  };

  return (
    <div className="mc-page">
      <PageHeader
        eyebrow="Publicação"
        title="Gestão de publicações"
        description="Reveja o que está pendente antes de chegar à galeria pública."
      />

      <section className="mc-rules" aria-label="Regras de publicação">
        <ShieldCheck size={18} aria-hidden="true" />
        <p>
          Uma fotografia só é visível publicamente quando <strong>o evento</strong>, <strong>o álbum</strong> e{" "}
          <strong>a própria fotografia</strong> estão publicados. Esta regra é aplicada no servidor (RLS),
          não apenas na interface.
        </p>
      </section>

      <section className="mc-stack" aria-labelledby="mc-pending-title">
        <div className="mc-section-bar">
          <h2 id="mc-pending-title" className="mc-section-title"><Clock3 size={16} aria-hidden="true" /> Fotografias pendentes de aprovação</h2>
          {selectedIds.length > 0 && (
            <div className="mc-bulkbar mc-bulkbar-inline" role="toolbar" aria-label="Rever selecção">
              <button type="button" className="mc-btn mc-btn-secondary mc-btn-sm" disabled={busy} onClick={() => void review("approved", "Fotografias aprovadas.")}>
                <CheckCheck size={14} aria-hidden="true" /> Aprovar ({selectedIds.length})
              </button>
              <button type="button" className="mc-btn mc-btn-primary mc-btn-sm" disabled={busy} onClick={() => void review("published", "Fotografias publicadas.")}>
                <Eye size={14} aria-hidden="true" /> Aprovar e publicar
              </button>
            </div>
          )}
        </div>
        {pending.status === "loading" && <GridSkeleton items={5} />}
        {pending.status === "error" && (
          <div className="mc-card"><DataError compact error={pending.error} subject="As fotografias pendentes" onRetry={pending.reload} /></div>
        )}
        {pending.status === "success" &&
          (pending.data.length === 0 ? (
            <div className="mc-card">
              <EmptyState compact icon={CheckCheck} title="Nada pendente" description="Todas as fotografias carregadas foram revistas." />
            </div>
          ) : (
            <PhotoGrid photos={pending.data} selected={selected} onToggle={toggle} />
          ))}
      </section>

      <section className="mc-stack" aria-labelledby="mc-drafts-title">
        <div className="mc-section-bar">
          <h2 id="mc-drafts-title" className="mc-section-title"><FilePen size={16} aria-hidden="true" /> Eventos em rascunho</h2>
        </div>
        {drafts.status === "loading" && <TableSkeleton rows={3} />}
        {drafts.status === "error" && (
          <div className="mc-card"><DataError compact error={drafts.error} subject="Os eventos em rascunho" onRetry={drafts.reload} /></div>
        )}
        {drafts.status === "success" &&
          (drafts.data.length === 0 ? (
            <div className="mc-card">
              <EmptyState compact icon={FilePen} title="Sem rascunhos" description="Não existem eventos por publicar." />
            </div>
          ) : (
            <ul className="mc-card mc-list">
              {drafts.data.map((event) => (
                <li key={event.id} className="mc-list-item">
                  <span className="mc-cell-text">
                    <Link to={adminRoutes.event(event.id)} className="mc-cell-title">{event.title}</Link>
                    <span className="mc-cell-sub">{formatDate(event.eventDate)} · {event.photoCount} fotografias</span>
                  </span>
                  <button type="button" className="mc-btn mc-btn-secondary mc-btn-sm" disabled={busy} onClick={() => void publishEvent(event.id)}>
                    <Send size={14} aria-hidden="true" /> Publicar
                  </button>
                </li>
              ))}
            </ul>
          ))}
      </section>
    </div>
  );
};
