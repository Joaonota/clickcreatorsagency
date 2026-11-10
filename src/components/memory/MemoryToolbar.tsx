import React from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "../../i18n";

interface MemoryToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
}

/** Pesquisa da galeria Save Your Memory. */
export const MemoryToolbar: React.FC<MemoryToolbarProps> = ({ query, onQueryChange, resultCount }) => {
  const { t } = useTranslation();
  const resultLabel = resultCount === 1 ? t.memory.resultsSingular : t.memory.resultsPlural;

  return (
    <div className="mem-toolbar">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="mem-search">
          <Search size={15} aria-hidden="true" className="mem-search-icon" />
          <input
            type="search"
            className="field mem-search-field"
            placeholder={t.memory.searchPlaceholder}
            aria-label={t.memory.searchLabel}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              aria-label="Limpar pesquisa"
              className="mem-search-clear"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <p className="mem-result-count" role="status">
          <strong>{resultCount}</strong> {resultLabel}
        </p>
      </div>
    </div>
  );
};
