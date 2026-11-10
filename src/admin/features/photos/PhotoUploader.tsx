import React, { useEffect, useId, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Clock3, Loader2, UploadCloud, X } from "lucide-react";
import { memoryAdminRepository } from "../../data/repository";
import { toUserMessage } from "../../data/errors";
import { formatBytes } from "../../data/labels";
import { ACCEPTED_IMAGE_TYPES, ACCEPTED_VIDEO_TYPES, isVideoFile, validateMediaFile } from "../../hooks/useFilePreview";
import { useToast } from "../../components/toast";

type QueueStatus = "queued" | "uploading" | "done" | "error" | "invalid";

interface QueueItem {
  id: string;
  file: File;
  previewUrl: string;
  status: QueueStatus;
  progress: number;
  message?: string;
}

const statusText: Record<QueueStatus, string> = {
  queued: "Em fila",
  uploading: "A enviar",
  done: "Enviada",
  error: "Falhou",
  invalid: "Inválida",
};

interface PhotoUploaderProps {
  /** Álbum de destino; vazio = ainda não escolhido. */
  albumId: string;
  albumLabel?: string;
  onUploaded: () => void;
}

let sequence = 0;

/**
 * Upload múltiplo para o Supabase Storage (via repositório).
 * A pré-visualização é local; o envio só acontece quando o backend
 * existir — até lá, cada ficheiro reporta o erro real devolvido.
 */
export const PhotoUploader: React.FC<PhotoUploaderProps> = ({ albumId, albumLabel, onUploaded }) => {
  const inputId = useId();
  const toast = useToast();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const urls = useRef(new Set<string>());

  useEffect(() => {
    const tracked = urls.current;
    return () => {
      tracked.forEach((url) => URL.revokeObjectURL(url));
      tracked.clear();
    };
  }, []);

  const patch = (id: string, changes: Partial<QueueItem>) =>
    setQueue((current) => current.map((item) => (item.id === id ? { ...item, ...changes } : item)));

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const items = Array.from(files).map<QueueItem>((file) => {
      const problem = validateMediaFile(file);
      const previewUrl = problem ? "" : URL.createObjectURL(file);
      if (previewUrl) urls.current.add(previewUrl);
      return {
        id: `q${++sequence}`,
        file,
        previewUrl,
        status: problem ? "invalid" : "queued",
        progress: 0,
        message: problem ?? undefined,
      };
    });
    setQueue((current) => [...current, ...items]);
  };

  const remove = (item: QueueItem) => {
    if (item.previewUrl) {
      URL.revokeObjectURL(item.previewUrl);
      urls.current.delete(item.previewUrl);
    }
    setQueue((current) => current.filter((entry) => entry.id !== item.id));
  };

  const clearFinished = () => queue.filter((item) => item.status === "done" || item.status === "invalid").forEach(remove);

  const pending = queue.filter((item) => item.status === "queued" || item.status === "error");

  const startUpload = async () => {
    if (!albumId || pending.length === 0) return;
    setUploading(true);
    let succeeded = 0;
    for (const item of pending) {
      patch(item.id, { status: "uploading", progress: 0, message: undefined });
      try {
        await memoryAdminRepository.uploadPhoto(albumId, item.file, (fraction) => patch(item.id, { progress: fraction }));
        patch(item.id, { status: "done", progress: 1 });
        succeeded += 1;
      } catch (error) {
        patch(item.id, { status: "error", progress: 0, message: toUserMessage(error) });
      }
    }
    setUploading(false);
    if (succeeded > 0) {
      toast.push({ tone: "success", title: `${succeeded} ficheiro(s) enviado(s).`, description: "Reveja-os em Gestão de publicações para os publicar." });
      onUploaded();
    }
    if (succeeded < pending.length) {
      toast.push({ tone: "error", title: "Alguns ficheiros não foram enviados", description: "Consulte o estado de cada ficheiro." });
    }
  };

  return (
    <section className="mc-card" aria-labelledby="mc-upload-title">
      <header className="mc-card-header">
        <h2 id="mc-upload-title" className="mc-card-title"><UploadCloud size={16} aria-hidden="true" /> Carregar fotografias e vídeos</h2>
        <span className="mc-card-hint">{albumId ? `Destino: ${albumLabel ?? "álbum seleccionado"}` : "Escolha um álbum de destino"}</span>
      </header>

      <div className="mc-card-body">
        <label
          htmlFor={inputId}
          className={`mc-dropzone ${dragOver ? "over" : ""}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragOver(false);
            addFiles(event.dataTransfer.files);
          }}
        >
          <UploadCloud size={26} strokeWidth={1.6} aria-hidden="true" />
          <span className="mc-dropzone-title">Arraste fotografias ou vídeos para aqui ou <u>escolha no dispositivo</u></span>
          <span className="mc-dropzone-hint">Fotos JPG, PNG, WebP, HEIC (até 25 MB) · vídeos MP4, MOV, WebM (até 50 MB) · múltiplos ficheiros</span>
        </label>
        <input
          id={inputId}
          type="file"
          multiple
          accept={[...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_VIDEO_TYPES].join(",")}
          className="mc-visually-hidden"
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />

        {queue.length > 0 && (
          <>
            <ul className="mc-upload-list">
              {queue.map((item) => (
                <li key={item.id} className={`mc-upload-item mc-upload-${item.status}`}>
                  <span className="mc-thumb">
                    {item.previewUrl &&
                      (isVideoFile(item.file) ? (
                        <video src={item.previewUrl} muted preload="metadata" />
                      ) : (
                        <img src={item.previewUrl} alt="" />
                      ))}
                  </span>
                  <span className="mc-cell-text">
                    <span className="mc-cell-title mc-truncate" title={item.file.name}>{item.file.name}</span>
                    <span className="mc-cell-sub">
                      {formatBytes(item.file.size)} · {item.file.type || "tipo desconhecido"}
                    </span>
                    {item.status === "uploading" && (
                      <span className="mc-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(item.progress * 100)}>
                        <span style={{ width: `${Math.max(4, item.progress * 100)}%` }} />
                      </span>
                    )}
                    {item.message && <span className="mc-upload-msg">{item.message}</span>}
                  </span>
                  <span className="mc-upload-state">
                    {item.status === "queued" && <Clock3 size={14} aria-hidden="true" />}
                    {item.status === "uploading" && <Loader2 size={14} className="mc-spin" aria-hidden="true" />}
                    {item.status === "done" && <CheckCircle2 size={14} aria-hidden="true" />}
                    {(item.status === "error" || item.status === "invalid") && <AlertCircle size={14} aria-hidden="true" />}
                    {statusText[item.status]}
                  </span>
                  <button type="button" className="mc-icon-btn mc-icon-btn-sm" onClick={() => remove(item)} disabled={item.status === "uploading"} aria-label={`Remover ${item.file.name}`}>
                    <X size={14} aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="mc-upload-actions">
              <button type="button" className="mc-btn mc-btn-ghost mc-btn-sm" onClick={clearFinished} disabled={uploading}>
                Limpar concluídos
              </button>
              <button type="button" className="mc-btn mc-btn-primary" onClick={() => void startUpload()} disabled={uploading || !albumId || pending.length === 0}>
                {uploading ? <Loader2 size={15} className="mc-spin" aria-hidden="true" /> : <UploadCloud size={15} aria-hidden="true" />}
                {uploading ? "A enviar…" : `Enviar ${pending.length} ficheiro(s)`}
              </button>
            </div>
            {!albumId && <p className="mc-field-hint mc-text-right">Seleccione evento e álbum acima para activar o envio.</p>}
          </>
        )}
      </div>
    </section>
  );
};
