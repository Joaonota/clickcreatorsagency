import React, { useId, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { useFilePreview, validateImageFile, ACCEPTED_IMAGE_TYPES } from "../hooks/useFilePreview";

interface CoverPickerProps {
  /** Capa actual guardada no servidor (se existir). */
  currentUrl: string | null;
  onChange: (file: File | null) => void;
  label?: string;
}

/** Selecção de imagem de capa com pré-visualização local. */
export const CoverPicker: React.FC<CoverPickerProps> = ({ currentUrl, onChange, label = "Imagem de capa" }) => {
  const inputId = useId();
  const { preview, setFile } = useFilePreview();
  const [error, setError] = useState("");
  const shownUrl = preview?.url ?? currentUrl;

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    const problem = validateImageFile(file);
    setError(problem ?? "");
    if (problem) return;
    setFile(file);
    onChange(file);
  };

  const clear = () => {
    setFile(null);
    onChange(null);
  };

  return (
    <div className="mc-field">
      <span className="mc-label">{label}</span>
      <div className="mc-cover">
        <div className="mc-cover-frame">
          {shownUrl ? (
            <img src={shownUrl} alt="Pré-visualização da capa" />
          ) : (
            <span className="mc-cover-empty">
              <ImagePlus size={20} aria-hidden="true" />
              Sem capa
            </span>
          )}
        </div>
        <div className="mc-cover-actions">
          <label htmlFor={inputId} className="mc-btn mc-btn-secondary mc-btn-sm">
            <ImagePlus size={14} aria-hidden="true" />
            {shownUrl ? "Substituir" : "Escolher imagem"}
          </label>
          <input
            id={inputId}
            type="file"
            accept={ACCEPTED_IMAGE_TYPES.join(",")}
            className="mc-visually-hidden"
            onChange={(event) => {
              handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          {preview && (
            <button type="button" className="mc-btn mc-btn-ghost mc-btn-sm" onClick={clear}>
              <Trash2 size={14} aria-hidden="true" /> Remover selecção
            </button>
          )}
          {preview && <p className="mc-field-hint">{preview.file.name} — será enviada ao guardar.</p>}
          {error && <p className="mc-field-error" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  );
};
