import React, { useState } from "react";
import { Dialog } from "../../components/Dialog";
import { CoverPicker } from "../../components/CoverPicker";
import { Field } from "../../components/ui";
import { memoryAdminRepository } from "../../data/repository";
import { albumStatusMeta } from "../../data/labels";
import { useAdminAction } from "../../hooks/useAdminAction";
import type { AdminAlbum, AdminEvent, AlbumInput, AlbumStatus } from "../../data/types";

interface AlbumFormDrawerProps {
  album: AdminAlbum | null;
  events: AdminEvent[];
  defaultEventId: string;
  onClose: () => void;
  onSaved: () => void;
}

export const AlbumFormDrawer: React.FC<AlbumFormDrawerProps> = ({ album, events, defaultEventId, onClose, onSaved }) => {
  const isEdit = Boolean(album);
  const [form, setForm] = useState<AlbumInput>({
    eventId: album?.eventId ?? defaultEventId,
    title: album?.title ?? "",
    description: album?.description ?? "",
    status: album?.status ?? "published",
    coverFile: null,
  });
  const [errors, setErrors] = useState<{ title?: string; eventId?: string }>({});
  const { run, busy } = useAdminAction();

  const update = <K extends keyof AlbumInput>(key: K, value: AlbumInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!form.eventId) next.eventId = "Escolha o evento.";
    if (!form.title.trim()) next.title = "Indique o nome do álbum.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    const payload = { ...form, title: form.title.trim(), description: form.description.trim() };
    const ok = await run(
      () => (album ? memoryAdminRepository.updateAlbum(album.id, payload) : memoryAdminRepository.createAlbum(payload)),
      isEdit ? "Álbum actualizado." : "Álbum criado."
    );
    if (ok) onSaved();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      locked={busy}
      title={isEdit ? "Editar álbum" : "Novo álbum"}
      description="Os álbuns organizam as fotografias dentro de um evento."
      footer={
        <>
          <button type="button" className="mc-btn mc-btn-ghost" onClick={onClose} disabled={busy}>Cancelar</button>
          <button type="submit" form="mc-album-form" className="mc-btn mc-btn-primary" disabled={busy}>
            {busy ? "A guardar…" : isEdit ? "Guardar alterações" : "Criar álbum"}
          </button>
        </>
      }
    >
      <form id="mc-album-form" className="mc-form" onSubmit={handleSubmit} noValidate>
        <Field label="Evento" htmlFor="alb-event" required error={errors.eventId}>
          <select id="alb-event" className="mc-input mc-select" value={form.eventId} onChange={(e) => update("eventId", e.target.value)} disabled={isEdit}>
            <option value="">Escolher evento…</option>
            {events.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        </Field>
        <Field label="Nome do álbum" htmlFor="alb-title" required error={errors.title}>
          <input id="alb-title" className="mc-input" value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="Ex.: Cerimónia" />
        </Field>
        <Field label="Descrição" htmlFor="alb-desc">
          <textarea id="alb-desc" className="mc-input mc-textarea" rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </Field>
        <Field label="Visibilidade" htmlFor="alb-status" hint="Álbuns ocultos nunca aparecem na galeria pública.">
          <select id="alb-status" className="mc-input mc-select" value={form.status} onChange={(e) => update("status", e.target.value as AlbumStatus)}>
            {(Object.keys(albumStatusMeta) as AlbumStatus[]).map((status) => (
              <option key={status} value={status}>{albumStatusMeta[status].label}</option>
            ))}
          </select>
        </Field>
        <CoverPicker label="Capa do álbum" currentUrl={album?.coverUrl ?? null} onChange={(file) => update("coverFile", file)} />
      </form>
    </Dialog>
  );
};
