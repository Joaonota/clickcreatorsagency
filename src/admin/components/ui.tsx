import React from "react";
import type { LucideIcon } from "lucide-react";
import type { StatusTone } from "../data/labels";

export const StatusBadge: React.FC<{ label: string; tone: StatusTone }> = ({ label, tone }) => (
  <span className={`mc-badge mc-badge-${tone}`}>
    <span className="mc-badge-dot" aria-hidden="true" />
    {label}
  </span>
);

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, description, actions }) => (
  <header className="mc-page-header">
    <div className="mc-page-header-text">
      {eyebrow && <p className="mc-eyebrow">{eyebrow}</p>}
      <h1 className="mc-page-title">{title}</h1>
      {description && <p className="mc-page-desc">{description}</p>}
    </div>
    {actions && <div className="mc-page-actions">{actions}</div>}
  </header>
);

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  /** null = dado indisponível (nunca inventar números). */
  value: number | null;
  loading?: boolean;
  accent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, loading, accent }) => (
  <div className={`mc-stat ${accent ? "mc-stat-accent" : ""}`}>
    <div className="mc-stat-top">
      <span className="mc-stat-label">{label}</span>
      <span className="mc-stat-icon" aria-hidden="true">
        <Icon size={16} strokeWidth={1.9} />
      </span>
    </div>
    {loading ? (
      <span className="mc-skel mc-skel-stat" aria-hidden="true" />
    ) : value === null ? (
      <div>
        <span className="mc-stat-value mc-stat-value-empty" aria-label="Sem dados">—</span>
        <span className="mc-stat-caption">Sem dados disponíveis</span>
      </div>
    ) : (
      <span className="mc-stat-value">{value.toLocaleString("pt-PT")}</span>
    )}
  </div>
);

interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Field: React.FC<FieldProps> = ({ label, htmlFor, hint, error, required, children, className = "" }) => (
  <div className={`mc-field ${error ? "mc-field-invalid" : ""} ${className}`}>
    <label htmlFor={htmlFor} className="mc-label">
      {label}
      {required && <span className="mc-required" aria-hidden="true"> *</span>}
    </label>
    {children}
    {error ? (
      <p className="mc-field-error" role="alert">{error}</p>
    ) : (
      hint && <p className="mc-field-hint">{hint}</p>
    )}
  </div>
);

/** Aviso inline (ex.: backend pendente dentro de um formulário). */
export const Notice: React.FC<{ tone?: "info" | "warning"; icon: LucideIcon; children: React.ReactNode }> = ({
  tone = "info",
  icon: Icon,
  children,
}) => (
  <div className={`mc-notice mc-notice-${tone}`}>
    <Icon size={16} aria-hidden="true" className="mc-notice-icon" />
    <div>{children}</div>
  </div>
);
