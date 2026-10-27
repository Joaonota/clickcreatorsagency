import React, { useMemo } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "../../i18n";
import type { MemoryCategory } from "../../data/memory";

interface MemoryToolbarProps {
  categories: MemoryCategory[];
  activeCategory: string; // "all" | categoryId
  onCategoryChange: (categoryId: string) => void;
  query: string;
  onQueryChange: (query: string) => void;
  resultCount: number;
}

/** Pesquisa + filtros por categoria da galeria Save Your Memory. */
export const MemoryToolbar: React.FC<MemoryToolbarProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
  query,
  onQueryChange,
  resultCount,
}) => {
  const { t } = useTranslation();

  const filterItems = useMemo(
    () => [
      { id: "all", name: t.memory.filterAll },
      ...categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    ],
    [categories, t.memory.filterAll]
  );

  const resultLabel =
    resultCount === 1 ? t.memory.resultsSingular : t.memory.resultsPlural;

  return (
    <div className="mem-toolbar">
      {/* Pesquisa */}
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

      {/* Filtros por categoria */}
      <nav className="filter-bar" aria-label={t.memory.statsCategories}>
        {filterItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onCategoryChange(item.id)}
            className={`filter-btn ${activeCategory === item.id ? "active" : ""}`}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </div>
  );
};
