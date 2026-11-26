import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Download, ExternalLink, EyeOff, Lock, QrCode, Send, Share2 } from "lucide-react";
import { memoryEventQrUrl, memoryEventUrl } from "../../../lib/memoryLinks";
import { useToast } from "../../components/toast";
import { StatusBadge } from "../../components/ui";
import { eventStatusMeta } from "../../data/labels";
import type { AdminEvent } from "../../data/types";

interface ShareGalleryProps {
  event: AdminEvent;
  busy: boolean;
  onTogglePublish: () => void;
}

const QR_OPTIONS = { errorCorrectionLevel: "M" as const, margin: 1, color: { dark: "#090909", light: "#ffffff" } };

/** Gera o PNG para impressão: QR Code grande + nome do evento, fundo branco. */
async function buildQrPng(qrUrl: string, url: string, title: string): Promise<Blob> {
  const qr = document.createElement("canvas");
  await QRCode.toCanvas(qr, qrUrl, { ...QR_OPTIONS, width: 1000 });

  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1420;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponível");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(qr, 100, 90, 1000, 1000);

  ctx.textAlign = "center";
  ctx.fillStyle = "#090909";
  ctx.font = "700 54px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  let label = title.trim();
  while (label.length > 4 && ctx.measureText(label).width > 1040) label = `${label.slice(0, -2).trimEnd()}…`;
  ctx.fillText(label, 600, 1188);

  ctx.fillStyle = "#707070";
  ctx.font = "600 30px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("SAVE YOUR MEMORY · CLICK CREATORS AGENCY", 600, 1250);
  ctx.font = "400 28px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText(url.replace(/^https?:\/\//, ""), 600, 1310);

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Falha ao gerar PNG"))), "image/png")
  );
}

/**
 * Partilha da galeria pública de um evento: link estável /memoria/e/{publicId}
 * e QR Code gerado no browser (nada é guardado no Storage). O QR Code nunca
 * muda — novas fotografias aparecem na mesma galeria.
 */
export const ShareGallery: React.FC<ShareGalleryProps> = ({ event, busy, onTogglePublish }) => {
  const toast = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const url = memoryEventUrl(event.publicId);
  /* O QR Code leva o marcador ?src=qr para contar as leituras no Dashboard. */
  const qrUrl = memoryEventQrUrl(event.publicId);
  const isPublished = event.status === "published";
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const isLocal = /^https?:\/\/(localhost|127\.|\[::1\])/.test(url);

  useEffect(() => {
    if (canvasRef.current) void QRCode.toCanvas(canvasRef.current, qrUrl, { ...QR_OPTIONS, width: 440 });
  }, [qrUrl]);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.push({ tone: "success", title: "Link copiado." });
    } catch {
      toast.push({ tone: "error", title: "Não foi possível copiar", description: "Seleccione o link e copie manualmente." });
    }
  };

  const downloadPng = async () => {
    setDownloading(true);
    try {
      const blob = await buildQrPng(qrUrl, url, event.title);
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = `qr-galeria-${event.publicId}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(href), 1000);
    } catch {
      toast.push({ tone: "error", title: "Não foi possível gerar o PNG", description: "Tente novamente." });
    } finally {
      setDownloading(false);
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title: event.title, text: `Veja as fotografias de ${event.title}`, url });
    } catch (error) {
      if ((error as DOMException)?.name !== "AbortError") void copyLink();
    }
  };

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`Veja as fotografias de ${event.title}: ${url}`)}`;

  return (
    <section className="mc-card mc-share" aria-labelledby="mc-share-title">
      <header className="mc-card-header">
        <h2 id="mc-share-title" className="mc-card-title"><QrCode size={16} aria-hidden="true" /> Partilhar Galeria</h2>
        <StatusBadge {...eventStatusMeta[event.status]} />
      </header>

      <div className="mc-card-body mc-share-body">
        <div className={`mc-share-qr ${isPublished ? "" : "is-locked"}`}>
          <canvas ref={canvasRef} role="img" aria-label={`QR Code da galeria ${event.title}`} />
          {!isPublished && (
            <span className="mc-share-lock">
              <Lock size={16} aria-hidden="true" /> Inactivo até publicar
            </span>
          )}
        </div>

        <div className="mc-share-side">
          <p className="mc-text-muted">
            {isPublished
              ? "Quem ler o QR Code ou abrir o link vê as fotografias e os vídeos publicados. O QR Code nunca muda: as novas fotografias aparecem na mesma galeria."
              : "O link e o QR Code já estão reservados para este evento, mas só abrem a galeria depois de publicar. Pode imprimir o QR Code antes."}
          </p>

          <div className="mc-share-link">
            <input className="mc-input mc-mono" value={url} readOnly aria-label="Link público da galeria" onFocus={(e) => e.currentTarget.select()} />
            <button type="button" className="mc-btn mc-btn-secondary" onClick={() => void copyLink()}>
              {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
          {isLocal && (
            <p className="mc-field-hint">
              Está a usar o painel localmente: o link aponta para este computador. No site publicado usa o domínio real.
            </p>
          )}

          <div className="mc-share-actions">
            <button type="button" className="mc-btn mc-btn-secondary mc-btn-sm" onClick={() => void downloadPng()} disabled={downloading}>
              <Download size={14} aria-hidden="true" /> {downloading ? "A gerar…" : "Baixar PNG"}
            </button>
            {canShare && (
              <button type="button" className="mc-btn mc-btn-secondary mc-btn-sm" onClick={() => void share()} disabled={!isPublished}>
                <Share2 size={14} aria-hidden="true" /> Partilhar
              </button>
            )}
            {isPublished && (
              <>
                <a className="mc-btn mc-btn-secondary mc-btn-sm" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <Send size={14} aria-hidden="true" /> WhatsApp
                </a>
                <a className="mc-btn mc-btn-ghost mc-btn-sm" href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} aria-hidden="true" /> Abrir galeria
                </a>
              </>
            )}
          </div>

          {event.status !== "archived" && (
            <div className="mc-share-publish">
              <button
                type="button"
                className={`mc-btn ${isPublished ? "mc-btn-ghost" : "mc-btn-primary"}`}
                onClick={onTogglePublish}
                disabled={busy}
              >
                {isPublished ? <EyeOff size={15} aria-hidden="true" /> : <Send size={15} aria-hidden="true" />}
                {isPublished ? "Despublicar galeria" : "Publicar galeria"}
              </button>
              <span className="mc-field-hint">
                {isPublished ? "Ao despublicar, o link e o QR Code deixam de abrir a galeria." : "Ao publicar, o link e o QR Code ficam activos."}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
