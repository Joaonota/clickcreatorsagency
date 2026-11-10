import React from "react";

export const Skeleton: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span className={`mc-skel ${className}`} aria-hidden="true" />
);

/** Linhas de tabela em carregamento. */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="mc-card mc-table-skel" role="status" aria-label="A carregar">
    {Array.from({ length: rows }, (_, index) => (
      <div key={index} className="mc-table-skel-row">
        <Skeleton className="mc-skel-thumb" />
        <span className="mc-table-skel-lines">
          <Skeleton className="mc-skel-line" />
          <Skeleton className="mc-skel-line mc-skel-line-short" />
        </span>
        <Skeleton className="mc-skel-pill" />
      </div>
    ))}
  </div>
);

/** Grelha de fotografias em carregamento. */
export const GridSkeleton: React.FC<{ items?: number }> = ({ items = 10 }) => (
  <div className="mc-photo-grid" role="status" aria-label="A carregar">
    {Array.from({ length: items }, (_, index) => (
      <Skeleton key={index} className="mc-skel-photo" />
    ))}
  </div>
);
