import React from "react";

/** Ecrã neutro enquanto a sessão é verificada — não revela conteúdo do painel. */
export const AdminBootScreen: React.FC<{ label?: string }> = ({ label = "A carregar…" }) => (
  <div className="mc-fullscreen-center" role="status" aria-live="polite">
    <span className="mc-spinner" aria-hidden="true" />
    <p className="mc-boot-label">{label}</p>
  </div>
);
