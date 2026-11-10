import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastTone = "success" | "error" | "info";

interface ToastInput {
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastItem extends ToastInput {
  id: number;
}

interface ToastApi {
  push(toast: ToastInput): void;
}

const ToastContext = createContext<ToastApi | null>(null);

const icons = { success: CheckCircle2, error: AlertCircle, info: Info } as const;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const push = useCallback(
    (toast: ToastInput) => {
      const id = nextId.current++;
      setItems((current) => [...current.slice(-3), { ...toast, id }]);
      window.setTimeout(() => dismiss(id), toast.tone === "error" ? 7000 : 4200);
    },
    [dismiss]
  );

  const api = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="mc-toasts" aria-live="polite" aria-relevant="additions">
        {items.map((item) => {
          const Icon = icons[item.tone];
          return (
            <div key={item.id} className={`mc-toast mc-toast-${item.tone}`} role={item.tone === "error" ? "alert" : "status"}>
              <Icon size={17} aria-hidden="true" className="mc-toast-icon" />
              <div className="mc-toast-body">
                <p className="mc-toast-title">{item.title}</p>
                {item.description && <p className="mc-toast-desc">{item.description}</p>}
              </div>
              <button type="button" className="mc-icon-btn mc-icon-btn-sm" onClick={() => dismiss(item.id)} aria-label="Fechar notificação">
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast deve ser usado dentro de <ToastProvider>.");
  return api;
}
