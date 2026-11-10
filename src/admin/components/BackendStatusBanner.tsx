import React from "react";
import { Eye, PlugZap } from "lucide-react";
import { useAdminAuth } from "../auth/context";
import { memoryAdminRepository } from "../data/repository";

/** Indica claramente que a integração com o backend ainda está pendente. */
export const BackendStatusBanner: React.FC = () => {
  const { status } = useAdminAuth();
  if (memoryAdminRepository.configured && status !== "preview") return null;

  return (
    <div className="mc-banner" role="note">
      {status === "preview" ? (
        <>
          <Eye size={15} aria-hidden="true" />
          <p>
            <strong>Pré-visualização de interface (apenas desenvolvimento).</strong> Sem sessão, sem
            dados e sem gravação — as operações devolvem erro até o Supabase estar ligado.
          </p>
        </>
      ) : (
        <>
          <PlugZap size={15} aria-hidden="true" />
          <p>
            <strong>Backend pendente.</strong> A base de dados e o armazenamento do Supabase ainda
            não estão ligados — nenhuma alteração é guardada.
          </p>
        </>
      )}
    </div>
  );
};
