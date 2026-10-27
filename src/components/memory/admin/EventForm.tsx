import React, { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ImagePlus,
  Loader2,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useTranslation } from "../../../i18n";
import { memoryApi } from "../../../services/memoryApi";
import type { MemoryCategory, MemoryEvent, MemoryPhoto } from "../../../data/memory";

interface EventFormProps {
  event: MemoryEvent | null;
  categories: MemoryCategory[];
  onCancel: () => void;
  onSaved: (event: MemoryEvent, isNew: boolean) => void;
  onDataChanged: () => Promise<void>;
  onNotice: (message: string) => void;
}

/**
 * Formulário de evento + gestor de fotografias do painel
 * Save Your Memory ( Operações MOCK — nada é gravado no servidor;
 * uploads de ficheiros viram blob URLs de sessão).
 */
export const EventForm: React.FC<EventFormProps> = ({
  event,
  categories,
  onCancel,
  onSaved,
  onDataChanged,
  onNotice,
}) => {
  const { t } = useTranslation();
  const isEdit = Boolean(event);

  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [date, setDate] = useState(event?.date ?? "");
  const [categoryId, setCategoryId] = useState(event?.categoryId ?? "");
  const [cover, setCover] = useState<string>(event?.cover ?? "");
  const [coverUrlInput, setCoverUrlInput] = useState("");

  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [photosBusy, setPhotosBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [replaceBusyId, setReplaceBusyId] = useState<string | null>(null);

  const [error, setError] = useState(false);
  const [saveBusy, setSaveBusy] = useState(false);

  const coverFileRef = useRef<HTMLInputElement | null>(null);
  const photosFileRef = useRef<HTMLInputElement | null>(null);
  const replaceFileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  /* -------- Carregar fotografias do evento (modo editar) -------- */
  useEffect(() => {
    let active = true;
    (async () => {
      const data = event ? await memoryApi.getEventPhotos(event.id) : [];
      if (active) setPhotos(data);
    })();
    return () => {
      active = false;
    };
  }, [event]);

  /* ---------------- Guardar dados do evento ------------------ */
  const handleSave = async () => {
    if (saveBusy) return;
    if (!title.trim() || !date || !categoryId) {
      setError(true);
      return;
    }
    setError(false);
    setSaveBusy(true);
    try {
      if (event) {
        const updated = await memoryApi.updateEvent(event.id, {
          title,
          description,
          date,
          categoryId,
          cover: cover || undefined,
          coverAlt: title,
        });
        if (updated) {
          onSaved(updated, false);
          onNotice(t.memory.admin.savedNote);
        }
      } else {
        const created = await memoryApi.createEvent({
          title,
          description,
          date,
          categoryId,
          cover: cover || undefined,
          coverAlt: title,
          status: "draft",
        });
        onSaved(created, true);
        onNotice(t.memory.admin.savedNote);
      }
    } finally {
      setSaveBusy(false);
    }
  };

  /* ------------------------ Capa ----------------------------- */
  const handleCoverFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    setCover(URL.createObjectURL(file));
    setCoverUrlInput("");
  };

  const handleCoverUrl = () => {
    const url = coverUrlInput.trim();
    if (!url) return;
    setCover(url);
    setCoverUrlInput("");
  };

  /* -------------------- Fotografias (MOCK) -------------------- */
  const persistOrder = async (list: MemoryPhoto[]) => {
    const ordered = [...list]
      .sort((a, b) => a.order - b.order)
      .map((photo) => photo.id);
    await memoryApi.reorderPhotos(event?.id ?? "", ordered);
  };

  const handleAddFiles = async (fileList: FileList | null) => {
    if (!event || !fileList || fileList.length === 0) return;
    const files = Array.from(fileList).filter((file) => file.type.startsWith("image/"));
    if (files.length === 0) return;
    setPhotosBusy(true);
    try {
      const items = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name.replace(/\.[^.]+$/, ""),
      }));
      const created = await memoryApi.addPhotos(event.id, items);
      setPhotos((prev) => [...prev, ...created]);
      await onDataChanged();
      onNotice(t.memory.admin.savedNote);
    } finally {
      setPhotosBusy(false);
    }
  };

  const movePhoto = async (index: number, delta: number) => {
    if (!event) return;
    const target = index + delta;
    if (target < 0 || target >= photos.length) return;
    const next = [...photos];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    const reindexed = next.map((photo, position) => ({ ...photo, order: position }));
    setPhotos(reindexed);
    await persistOrder(reindexed);
    // A capa segue a 1.ª fotografia
    await memoryApi.updateEvent(event.id, { cover: reindexed[0]?.src || undefined });
    await onDataChanged();
  };

  const reorderTo = async (from: number, to: number) => {
    if (!event || from === to) return;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const reindexed = next.map((photo, position) => ({ ...photo, order: position }));
    setPhotos(reindexed);
    await persistOrder(reindexed);
    await memoryApi.updateEvent(event.id, { cover: reindexed[0]?.src || undefined });
    await onDataChanged();
  };

  const handleReplace = async (photoId: string, file: File | undefined) => {
    if (!event || !file || !file.type.startsWith("image/")) return;
    setReplaceBusyId(photoId);
    try {
      const src = URL.createObjectURL(file);
      const alt = file.name.replace(/\.[^.]+$/, "");
      const updated = await memoryApi.replacePhoto(photoId, src, alt);
      if (updated) {
        setPhotos((prev) =>
          prev.map((photo) => (photo.id === photoId ? { ...photo, src, alt } : photo))
        );
        await onDataChanged();
        onNotice(t.memory.admin.savedNote);
      }
    } finally {
      setReplaceBusyId(null);
    }
  };

  const handleDeletePhoto = async (photo: MemoryPhoto) => {
    if (!event) return;
    const success = await memoryApi.deletePhoto(photo.id);
    if (success) {
      const remaining = photos
        .filter((item) => item.id !== photo.id)
        .map((item, position) => ({ ...item, order: position }));
      setPhotos(remaining);
      setPendingDeleteId(null);
      // Se a foto eliminada era a capa, promove a próxima
      if (event.cover && photo.src === event.cover) {
        await memoryApi.updateEvent(event.id, {
          cover: remaining[0]?.src || undefined,
        });
      }
      await onDataChanged();
      onNotice(t.memory.admin.savedNote);
    }
  };

  /* ------------------------- Render -------------------------- */
  return (
    <div className="max-w-3xl">
      <p className="eyebrow eyebrow-bare mb-2 text-[var(--primary)]">
        {isEdit ? t.memory.admin.formEditTitle : t.memory.admin.formCreateTitle}
      </p>

      <div className="adm-panel">
        {/* Campos */}
        <div className="adm-form-grid">
          <label className="block sm:col-span-2">
            <span className="field-label">
              {t.memory.admin.fieldTitle} <em>*</em>
            </span>
            <input
              type="text"
              className="field"
              placeholder={t.memory.admin.fieldTitlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="field-label">
              {t.memory.admin.fieldDate} <em>*</em>
            </span>
            <input
              type="date"
              className="field mem-date-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="field-label">
              {t.memory.admin.fieldCategory} <em>*</em>
            </span>
            <select
              className="field mem-select"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="" disabled={!event}>
                — {t.memory.admin.uncategorized} —
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="field-label">{t.memory.admin.fieldDescription}</span>
            <textarea
              className="field mem-textarea"
              rows={3}
              placeholder={t.memory.admin.fieldTitlePlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
        </div>

        {/* Capa */}
        <div className="mt-8">
          <span className="field-label">{t.memory.admin.fieldCover}</span>
          <div className="mt-3 flex flex-wrap items-start gap-4">
            {cover ? (
              <div className="adm-cover-preview media-frame">
                <img src={cover} alt="capa do evento" />
              </div>
            ) : (
              <div className="adm-cover-preview adm-cover-empty">
                <ImagePlus size={20} aria-hidden="true" />
              </div>
            )}
            <div className="flex min-w-[220px] flex-1 flex-col gap-2">
              <p className="muted text-xs leading-relaxed">{t.memory.admin.coverHint}</p>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={coverFileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleCoverFile(e.target.files?.[0])}
                />
                <button
                  type="button"
                  onClick={() => coverFileRef.current?.click()}
                  className="btn btn-outline btn-sm"
                >
                  <ImagePlus size={13} aria-hidden="true" />
                  <span>{t.memory.admin.selectImage}</span>
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="url"
                  className="field mem-url-field"
                  placeholder={t.memory.admin.coverUrlPlaceholder}
                  value={coverUrlInput}
                  onChange={(e) => setCoverUrlInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleCoverUrl}
                  className="btn btn-outline btn-sm shrink-0"
                >
                  <span>{t.memory.admin.coverUseUrl}</span>
                </button>
              </div>
              {!isEdit && (
                <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--text-faint)]">
                  {t.memory.admin.coverMissing}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ações do formulário */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saveBusy}
            className="btn btn-primary btn-sm"
          >
            {saveBusy ? (
              <Loader2 size={13} className="animate-spin" aria-hidden="true" />
            ) : (
              <Check size={14} aria-hidden="true" />
            )}
            <span>{saveBusy ? t.memory.admin.saving : t.memory.admin.save}</span>
          </button>
          <button type="button" onClick={onCancel} className="btn btn-outline btn-sm">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>{t.memory.admin.cancel}</span>
          </button>
          {error && <p className="adm-error">{t.memory.admin.invalidFields}</p>}
        </div>
      </div>

      {/* Fotografias — apenas em eventos existentes */}
      {event && (
        <div className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="font-display text-xl uppercase tracking-[0.08em]">
              {t.memory.admin.photosTitle}
              <span className="ml-3 text-sm text-[var(--text-muted)]">({photos.length})</span>
            </p>
            {photosBusy && (
              <p className="adm-busy-chip">
                <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                {t.memory.admin.uploadingLabel}
              </p>
            )}
          </div>

          {/* Zona de carregamento */}
          <div
            className={`adm-drop mt-4 ${dragOver ? "adm-drop-over" : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              void handleAddFiles(e.dataTransfer.files);
            }}
          >
            <ImagePlus size={22} aria-hidden="true" className="text-[var(--primary)]" />
            <p className="text-sm text-[var(--text-secondary)]">
              {t.memory.admin.dropHint}{" "}
              <button
                type="button"
                onClick={() => photosFileRef.current?.click()}
                className="adm-browse-label"
              >
                {t.memory.admin.browseLabel}
              </button>
            </p>
            <p className="adm-note max-w-md text-center">{t.memory.admin.demoUploadNote}</p>
            <input
              ref={photosFileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                void handleAddFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {photos.length > 0 && (
            <p className="mt-3 text-[0.64rem] uppercase tracking-[0.18em] text-[var(--text-muted)]">
              {t.memory.admin.reorderHint}
            </p>
          )}

          {/* Grelha de miniaturas */}
          {photos.length === 0 ? (
            <p className="muted mt-6">{t.memory.admin.noPhotosYet}</p>
          ) : (
            <ul className="adm-photos mt-4">
              {photos.map((photo, index) => (
                <li
                  key={photo.id}
                  className={`adm-thumb ${index === 0 ? "adm-thumb-cover" : ""} ${
                    dragOverIndex === index && dragFromIndex !== index
                      ? "adm-thumb-droptarget"
                      : ""
                  }`}
                  draggable
                  onDragStart={() => {
                    setDragFromIndex(index);
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(index);
                  }}
                  onDragEnd={() => {
                    setDragOverIndex(null);
                    setDragFromIndex(null);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    const from = dragFromIndex;
                    setDragOverIndex(null);
                    setDragFromIndex(null);
                    if (from !== null && from !== index) {
                      void reorderTo(from, index);
                    }
                  }}
                >
                  <img src={photo.src} alt={photo.alt} loading="lazy" />

                  <span className="adm-thumb-num">{String(index + 1).padStart(2, "0")}</span>
                  {index === 0 && (
                    <span className="adm-thumb-badge">
                      {t.memory.admin.isCover}
                    </span>
                  )}

                  {replaceBusyId === photo.id && (
                    <span className="adm-thumb-busy">
                      <Loader2 size={14} className="animate-spin" />
                    </span>
                  )}

                  {pendingDeleteId === photo.id ? (
                    <span className="adm-thumb-actions adm-thumb-actions-open">
                      <button
                        type="button"
                        onClick={() => void handleDeletePhoto(photo)}
                        aria-label="Confirmar"
                        className="adm-thumb-btn adm-thumb-btn-danger"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(null)}
                        aria-label="Cancelar"
                        className="adm-thumb-btn"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ) : (
                    <span className="adm-thumb-actions">
                      <button
                        type="button"
                        onClick={() => void movePhoto(index, -1)}
                        disabled={index === 0}
                        aria-label={t.memory.admin.moveUp}
                        title={t.memory.admin.moveUp}
                        className="adm-thumb-btn"
                      >
                        <ArrowUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => void movePhoto(index, 1)}
                        disabled={index === photos.length - 1}
                        aria-label={t.memory.admin.moveDown}
                        title={t.memory.admin.moveDown}
                        className="adm-thumb-btn"
                      >
                        <ArrowDown size={13} />
                      </button>
                      <input
                        ref={(node) => {
                          replaceFileRefs.current[photo.id] = node;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          void handleReplace(photo.id, e.target.files?.[0]);
                          e.target.value = "";
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => replaceFileRefs.current[photo.id]?.click()}
                        aria-label={t.memory.admin.replace}
                        title={t.memory.admin.replace}
                        className="adm-thumb-btn"
                      >
                        <RefreshCw size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDeleteId(photo.id)}
                        aria-label={t.memory.admin.remove}
                        title={t.memory.admin.remove}
                        className="adm-thumb-btn adm-thumb-btn-danger"
                      >
                        <Trash2 size={13} />
                      </button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
