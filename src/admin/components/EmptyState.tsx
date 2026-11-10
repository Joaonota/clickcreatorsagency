import React from "react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action, compact }) => (
  <div className={`mc-empty ${compact ? "mc-empty-compact" : ""}`}>
    <span className="mc-empty-icon" aria-hidden="true">
      <Icon size={compact ? 18 : 22} strokeWidth={1.75} />
    </span>
    <p className="mc-empty-title">{title}</p>
    <p className="mc-empty-desc">{description}</p>
    {action && <div className="mc-empty-action">{action}</div>}
  </div>
);
