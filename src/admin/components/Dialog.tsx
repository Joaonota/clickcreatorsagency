import React, { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** "drawer" desliza da direita (formulários); "modal" fica centrado (confirmações). */
  variant?: "drawer" | "modal";
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /** Impede fechar (ex.: durante uma operação em curso). */
  locked?: boolean;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  variant = "drawer",
  footer,
  children,
  locked = false,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();
  const onCloseRef = useRef(onClose);
  const lockedRef = useRef(locked);

  useEffect(() => {
    onCloseRef.current = onClose;
    lockedRef.current = locked;
  });

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const panel = panelRef.current;
    // Foco inicial: primeiro campo do conteúdo; se não existir, primeiro controlo do painel.
    (panel?.querySelector<HTMLElement>(`.mc-dialog-body :is(${FOCUSABLE})`) ??
      panel?.querySelector<HTMLElement>(`.mc-dialog-footer :is(${FOCUSABLE})`) ??
      panel?.querySelector<HTMLElement>(FOCUSABLE))?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !lockedRef.current) onCloseRef.current();
      if (event.key !== "Tab" || !panel) return;
      const nodes = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className={`mc-dialog-root mc-dialog-${variant}`}>
      <div className="mc-dialog-backdrop" onClick={() => !locked && onClose()} aria-hidden="true" />
      <div
        ref={panelRef}
        className="mc-dialog-panel"
        role={variant === "modal" ? "alertdialog" : "dialog"}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
      >
        <header className="mc-dialog-header">
          <div>
            <h2 id={titleId} className="mc-dialog-title">{title}</h2>
            {description && <p id={descId} className="mc-dialog-desc">{description}</p>}
          </div>
          <button type="button" className="mc-icon-btn" onClick={onClose} disabled={locked} aria-label="Fechar">
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        {children && <div className="mc-dialog-body">{children}</div>}
        {footer && <footer className="mc-dialog-footer">{footer}</footer>}
      </div>
    </div>
  );
};

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: "danger" | "default";
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  confirmLabel,
  tone = "default",
  busy = false,
  onConfirm,
  onCancel,
}) => (
  <Dialog
    open={open}
    onClose={onCancel}
    title={title}
    description={description}
    variant="modal"
    locked={busy}
    footer={
      <>
        <button type="button" className="mc-btn mc-btn-ghost" onClick={onCancel} disabled={busy}>
          Cancelar
        </button>
        <button
          type="button"
          className={`mc-btn ${tone === "danger" ? "mc-btn-danger" : "mc-btn-primary"}`}
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? "A processar…" : confirmLabel}
        </button>
      </>
    }
  />
);
