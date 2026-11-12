import React, { useState } from "react";
import { normalizeText, slugify } from "../../../data/memory/utils";
import { Dialog } from "../../components/Dialog";
import { CoverPicker } from "../../components/CoverPicker";
import { Field } from "../../components/ui";
import { memoryAdminRepository } from "../../data/repository";
import { eventStatusMeta } from "../../data/labels";
import { useAdminAction } from "../../hooks/useAdminAction";
import type { AdminEvent, EventInput, EventStatus } from "../../data/types";

interface EventFormDrawerProps {
  event: AdminEvent | null;
  onClose: () => void;
  onSaved: () => void;
}

type Errors = Partial<Record<"title" | "slug" | "eventDate" | "location", string>>;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const EventFormDrawer: React.FC<EventFormDrawerProps> = ({ event, onClose, onSaved }) => {
  const isEdit = Boolean(event);
  const [form, setForm] = useState<EventInput>({
    title: event?.title ?? "",
    slug: event?.slug ?? "",
    description: event?.description ?? "",
    eventDate: event?.eventDate ?? "",
    location: event?.location ?? "",
    status: event?.status ?? "draft",
    coverFile: null,
  });
  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [errors, setErrors] = useState<Errors>({});
  const { run, busy } = useAdminAction();

  const update = <K extends keyof EventInput>(key: K, value: EventInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleTitle = (value: string) => {
    setForm((current) => ({ ...current, title: value, slug: slugTouched ? current.slug : slugify(value) }));
  };

  const validate = (): boolean => {
    const next: Errors = {};
    if (!form.title.trim()) next.title = "Indique o título do evento.";
    if (!form.slug) next.slug = "Indique um slug.";
    else if (!SLUG_PATTERN.test(form.slug)) next.slug = "Use apenas letras minúsculas, números e hífens.";
    if (!form.eventDate) next.eventDate = "Indique a data do evento.";
    if (!form.location.trim()) next.location = "Indique a localização.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault();
    if (!validate()) return;
    const payload: EventInput = { ...form, title: form.title.trim(), location: form.location.trim(), description: form.description.trim() };
    const ok = await run(
      () => (event ? memoryAdminRepository.updateEvent(event.id, payload) : memoryAdminRepository.createEvent(payload)),
      isEdit ? "Evento actualizado." : "Evento criado."
    );
    if (ok) onSaved();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      locked={busy}
      title={isEdit ? "Editar evento" : "Novo evento"}
      description="Depois de criar o evento, carregue as fotografias e os vídeos em Fotos e vídeos."
      footer={
        <>
          <button type="button" className="mc-btn mc-btn-ghost" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button type="submit" form="mc-event-form" className="mc-btn mc-btn-primary" disabled={busy}>
            {busy ? "A guardar…" : isEdit ? "Guardar alterações" : "Criar evento"}
          </button>
        </>
      }
    >
      <form id="mc-event-form" className="mc-form" onSubmit={handleSubmit} noValidate>
        <Field label="Título" htmlFor="evt-title" required error={errors.title}>
          <input id="evt-title" className="mc-input" value={form.title} onChange={(e) => handleTitle(e.target.value)} placeholder="Ex.: Graduation 2026" />
        </Field>

        <Field label="Slug (URL)" htmlFor="evt-slug" required error={errors.slug} hint={`/memoria/${form.slug || "slug-do-evento"}`}>
          <input
            id="evt-slug"
            className="mc-input mc-input-mono"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", normalizeText(e.target.value).replace(/[^a-z0-9-]+/g, "-").replace(/-{2,}/g, "-"));
            }}
          />
        </Field>

        <Field label="Descrição" htmlFor="evt-desc">
          <textarea id="evt-desc" className="mc-input mc-textarea" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </Field>

        <div className="mc-form-row">
          <Field label="Data do evento" htmlFor="evt-date" required error={errors.eventDate}>
            <input id="evt-date" type="date" className="mc-input" value={form.eventDate} onChange={(e) => update("eventDate", e.target.value)} />
          </Field>
          <Field label="Estado" htmlFor="evt-status">
            <select id="evt-status" className="mc-input mc-select" value={form.status} onChange={(e) => update("status", e.target.value as EventStatus)}>
              {(Object.keys(eventStatusMeta) as EventStatus[]).map((status) => (
                <option key={status} value={status}>{eventStatusMeta[status].label}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Localização" htmlFor="evt-location" required error={errors.location}>
          <input id="evt-location" className="mc-input" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="Ex.: Centro de Congressos, Lisboa" />
        </Field>

        <CoverPicker currentUrl={event?.coverUrl ?? null} onChange={(file) => update("coverFile", file)} />
      </form>
    </Dialog>
  );
};
