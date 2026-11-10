import React, { useState } from "react";
import { Pencil, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { roleLabels } from "../../auth/permissions";
import { teamRepository, type TeamMember } from "../../data/teamRepository";
import { formatDate } from "../../data/labels";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useAdminAction } from "../../hooks/useAdminAction";
import { ConfirmDialog } from "../../components/Dialog";
import { DataError } from "../../components/DataState";
import { EmptyState } from "../../components/EmptyState";
import { TableSkeleton } from "../../components/Skeleton";
import { Notice, PageHeader, StatusBadge } from "../../components/ui";
import { TeamMemberDialog } from "./TeamMemberDialog";

/** Gestão de contas do painel — exclusiva do super administrador. */
export const TeamPage: React.FC = () => {
  const team = useAsyncResource(() => teamRepository.list(), "team");
  const [editing, setEditing] = useState<TeamMember | "new" | null>(null);
  const [removing, setRemoving] = useState<TeamMember | null>(null);
  const { run, busy } = useAdminAction();

  const confirmRemove = async () => {
    if (!removing) return;
    const ok = await run(() => teamRepository.remove(removing.userId), "Conta removida.");
    if (ok) {
      setRemoving(null);
      team.reload();
    }
  };

  return (
    <div className="mc-page">
      <PageHeader
        eyebrow="Conta"
        title="Utilizadores"
        description="Crie e gira as contas que têm acesso ao Memory Control."
        actions={
          <button type="button" className="mc-btn mc-btn-primary" onClick={() => setEditing("new")}>
            <UserPlus size={15} aria-hidden="true" /> Novo utilizador
          </button>
        }
      />

      <Notice icon={ShieldCheck}>
        <strong>Administrador de memória:</strong> cria e gere eventos, álbuns, fotografias e publicações, e altera as
        definições da galeria. <strong>Super administrador:</strong> tem também acesso a esta página para gerir contas.
      </Notice>

      {team.status === "loading" && <TableSkeleton rows={3} />}
      {team.status === "error" && (
        <div className="mc-card">
          <DataError error={team.error} subject="A lista de utilizadores" onRetry={team.reload} />
        </div>
      )}
      {team.status === "success" &&
        (team.data.length === 0 ? (
          <div className="mc-card">
            <EmptyState icon={Users} title="Sem utilizadores" description="Crie a primeira conta de administrador." />
          </div>
        ) : (
          <div className="mc-card mc-table-wrap">
            <table className="mc-table">
              <thead>
                <tr>
                  <th scope="col">Utilizador</th>
                  <th scope="col">Role</th>
                  <th scope="col">Último acesso</th>
                  <th scope="col"><span className="mc-visually-hidden">Acções</span></th>
                </tr>
              </thead>
              <tbody>
                {team.data.map((member) => (
                  <tr key={member.userId}>
                    <td data-label="Utilizador">
                      <span className="mc-cell-text">
                        <span className="mc-cell-title">
                          {member.displayName}
                          {member.isSelf && <span className="mc-text-muted"> (você)</span>}
                        </span>
                        <span className="mc-cell-sub">{member.email}</span>
                      </span>
                    </td>
                    <td data-label="Role">
                      <StatusBadge label={roleLabels[member.role]} tone={member.role === "super_admin" ? "info" : "neutral"} />
                    </td>
                    <td data-label="Último acesso">{member.lastSignInAt ? formatDate(member.lastSignInAt) : "Nunca entrou"}</td>
                    <td className="mc-cell-actions">
                      <button type="button" className="mc-icon-btn" onClick={() => setEditing(member)} aria-label={`Editar ${member.displayName}`} title="Editar">
                        <Pencil size={15} aria-hidden="true" />
                      </button>
                      {!member.isSelf && (
                        <button type="button" className="mc-icon-btn mc-icon-btn-danger" onClick={() => setRemoving(member)} aria-label={`Remover ${member.displayName}`} title="Remover">
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {editing && (
        <TeamMemberDialog
          member={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            team.reload();
          }}
        />
      )}

      <ConfirmDialog
        open={Boolean(removing)}
        title="Remover conta?"
        description={removing ? `${removing.displayName} (${removing.email}) deixa de ter acesso ao painel. Os eventos e fotografias que criou mantêm-se.` : ""}
        confirmLabel="Remover conta"
        tone="danger"
        busy={busy}
        onConfirm={() => void confirmRemove()}
        onCancel={() => setRemoving(null)}
      />
    </div>
  );
};
