import React, { useState } from "react";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { useTranslation } from "../../../i18n";
import { slugify } from "../../../data/memory";
import { memoryApi } from "../../../services/memoryApi";
import type { MemoryCategory, MemoryEvent } from "../../../data/memory";

interface CategoriesManagerProps {
  categories: MemoryCategory[];
  events: MemoryEvent[];
  onChanged: () => Promise<void> | void;
  onNotice: (message: string) => void;
}

type Editor =
  | { mode: "create" }
  | { mode: "edit"; category: MemoryCategory }
  | null;

/** Gestão de categorias da galeria Save Your Memory (dados MOCK). */
export const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  events,
  onChanged,
  onNotice,
}) => {
  const { t } = useTranslation();
  const [editor, setEditor] = useState<Editor>(null);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const eventsByCategory = (categoryId: string) =>
    events.filter((event) => event.categoryId === categoryId);

  const openCreate = () => {
    setEditor({ mode: "create" });
    setName("");
    setError(false);
  };

  const openEdit = (category: MemoryCategory) => {
    setEditor({ mode: "edit", category });
    setName(category.name);
    setError(false);
  };

  const closeEditor = () => {
    setEditor(null);
    setName("");
    setError(false);
  };

  const handleSave = async () => {
    if (busy) return;
    if (!name.trim()) {
      setError(true);
      return;
    }
    setBusy(true);
    try {
      if (editor?.mode === "edit") {
        await memoryApi.updateCategory(editor.category.id, name);
      } else {
        await memoryApi.createCategory(name);
      }
      await onChanged();
      onNotice(t.memory.admin.savedNote);
      closeEditor();
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (category: MemoryCategory) => {
    const related = eventsByCategory(category.id).length;
    const message = t.memory.admin.confirmDeleteCategory.replace("{count}", String(related));
    if (!window.confirm(`${message} — ${category.name}`)) {
      setPendingDeleteId(null);
      return;
    }
    await memoryApi.deleteCategory(category.id);
    await onChanged();
    onNotice(t.memory.admin.savedNote);
    setPendingDeleteId(null);
  };

  return (
    <div>
      {/* Cabeça da lista */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-[var(--text-muted)]">
          {t.memory.admin.categoriesTitle} · {categories.length}
        </p>
        {!editor && (
          <button type="button" onClick={openCreate} className="btn btn-primary btn-sm">
            <Plus size={14} aria-hidden="true" />
            <span>{t.memory.admin.newCategory}</span>
          </button>
        )}
      </div>

      {/* Editor inline */}
      {editor && (
        <div className="adm-panel mt-6">
          <p className="font-display text-xl uppercase tracking-[0.08em]">
            {editor.mode === "create" ? t.memory.admin.newCategory : t.memory.admin.editCategory}
          </p>
          <div className="mt-5 max-w-md">
            <label className="block">
              <span className="field-label">{t.memory.admin.fieldName}</span>
              <input
                type="text"
                className="field"
                placeholder={t.memory.admin.fieldNamePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </label>
            <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-[var(--text-faint)]">
              slug: {slugify(name) || "—"}
            </p>
            {error && <p className="adm-error mt-3">{t.memory.admin.invalidFields}</p>}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={busy}
              className="btn btn-primary btn-sm"
            >
              {busy ? (
                <Loader2 size={13} className="animate-spin" aria-hidden="true" />
              ) : (
                <Check size={14} aria-hidden="true" />
              )}
              <span>{busy ? t.memory.admin.saving : t.memory.admin.saveCategory}</span>
            </button>
            <button type="button" onClick={closeEditor} className="btn btn-outline btn-sm">
              <span>{t.memory.admin.cancel}</span>
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {categories.length === 0 && !editor ? (
        <p className="muted mt-8">{t.memory.admin.categoriesEmpty}</p>
      ) : (
        <ul className="mt-2">
          {categories.map((category) => {
            const related = eventsByCategory(category.id);
            return (
              <li key={category.id} className="adm-row adm-row-simple">
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg uppercase tracking-[0.06em] leading-tight">
                    {category.name}
                  </p>
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-[var(--text-faint)]">
                    {category.slug} ·{" "}
                    {t.memory.admin.usedBy.replace("{count}", String(related.length))}
                  </p>
                </div>
                <div className="adm-row-meta">
                  {related.length > 0 && (
                    <span className="text-[0.6rem] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                      {related
                        .slice(0, 2)
                        .map((event) => event.title)
                        .join(" · ")}
                      {related.length > 2 ? " +" : ""}
                    </span>
                  )}
                </div>
                {pendingDeleteId === category.id ? (
                  <div className="adm-row-actions">
                    <button
                      type="button"
                      onClick={() => void handleDelete(category)}
                      aria-label="Confirmar eliminação"
                      className="adm-icon-btn adm-icon-btn-danger"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(null)}
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
                      onClick={() => openEdit(category)}
                      aria-label={t.memory.admin.edit}
                      title={t.memory.admin.edit}
                      className="adm-icon-btn"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(category.id)}
                      aria-label={t.memory.admin.delete}
                      title={t.memory.admin.delete}
                      className="adm-icon-btn adm-icon-btn-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <p className="adm-note mt-8">{t.memory.admin.categoriesDemoNote}</p>
    </div>
  );
};
