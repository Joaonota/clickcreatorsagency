import React from "react";
import { AlertTriangle, DatabaseZap, RefreshCw } from "lucide-react";
import { EmptyState } from "./EmptyState";
import { isBackendPending, toUserMessage } from "../data/errors";

interface DataErrorProps {
  error: unknown;
  onRetry?: () => void;
  /** O que deveria aparecer aqui, ex.: "Os eventos". */
  subject: string;
  compact?: boolean;
}

/** Estado de erro de carregamento — distingue "backend pendente" de falha real. */
export const DataError: React.FC<DataErrorProps> = ({ error, onRetry, subject, compact }) => {
  if (isBackendPending(error)) {
    return (
      <EmptyState
        compact={compact}
        icon={DatabaseZap}
        title="Dados ainda indisponíveis"
        description={`${subject} serão apresentados aqui assim que o Supabase estiver ligado. Nenhum dado fictício é mostrado.`}
      />
    );
  }
  return (
    <EmptyState
      compact={compact}
      icon={AlertTriangle}
      title="Não foi possível carregar"
      description={toUserMessage(error)}
      action={
        onRetry && (
          <button type="button" className="mc-btn mc-btn-secondary" onClick={onRetry}>
            <RefreshCw size={14} aria-hidden="true" />
            Tentar novamente
          </button>
        )
      }
    />
  );
};
