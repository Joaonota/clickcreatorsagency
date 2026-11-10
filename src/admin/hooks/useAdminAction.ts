import { useCallback, useState } from "react";
import { toUserMessage } from "../data/errors";
import { useToast } from "../components/toast";

/**
 * Executa uma operação do repositório com estado "busy" e feedback por
 * toast. Devolve `true` apenas quando o servidor confirmou a operação.
 */
export function useAdminAction() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const run = useCallback(
    async (operation: () => Promise<unknown>, successMessage: string): Promise<boolean> => {
      setBusy(true);
      try {
        await operation();
        toast.push({ tone: "success", title: successMessage });
        return true;
      } catch (error) {
        toast.push({ tone: "error", title: "Operação não concluída", description: toUserMessage(error) });
        return false;
      } finally {
        setBusy(false);
      }
    },
    [toast]
  );

  return { run, busy };
}
