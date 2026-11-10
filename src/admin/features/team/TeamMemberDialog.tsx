import React, { useState } from "react";
import { Dialog } from "../../components/Dialog";
import { Field } from "../../components/ui";
import { roleLabels } from "../../auth/permissions";
import { teamRepository, type TeamMember } from "../../data/teamRepository";
import { useAdminAction } from "../../hooks/useAdminAction";
import type { AdminRole } from "../../auth/types";

interface TeamMemberDialogProps {
  member: TeamMember | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const TeamMemberDialog: React.FC<TeamMemberDialogProps> = ({ member, onClose, onSaved }) => {
  const isEdit = Boolean(member);
  const [displayName, setDisplayName] = useState(member?.displayName ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>(member?.role ?? "memory_admin");
  const [errors, setErrors] = useState<{ displayName?: string; email?: string; password?: string }>({});
  const { run, busy } = useAdminAction();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const next: typeof errors = {};
    if (!displayName.trim()) next.displayName = "Indique o nome.";
    if (!isEdit && !EMAIL_RE.test(email.trim())) next.email = "Indique um email válido.";
    if ((!isEdit || password) && password.length < 8) next.password = "Mínimo de 8 caracteres.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const ok = await run(
      () =>
        member
          ? teamRepository.update(member.userId, {
              displayName: displayName.trim(),
              role,
              ...(password ? { password } : {}),
            })
          : teamRepository.create({ email: email.trim(), password, displayName: displayName.trim(), role }),
      isEdit ? "Conta actualizada." : "Conta criada. Partilhe o email e a palavra-passe com o utilizador."
    );
    if (ok) onSaved();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      locked={busy}
      title={isEdit ? "Editar utilizador" : "Novo utilizador"}
      description={isEdit ? member?.email : "A conta fica activa de imediato. Não é enviado nenhum email."}
      footer={
        <>
          <button type="button" className="mc-btn mc-btn-ghost" onClick={onClose} disabled={busy}>Cancelar</button>
          <button type="submit" form="mc-team-form" className="mc-btn mc-btn-primary" disabled={busy}>
            {busy ? "A guardar…" : isEdit ? "Guardar alterações" : "Criar conta"}
          </button>
        </>
      }
    >
      <form id="mc-team-form" className="mc-form" onSubmit={handleSubmit} noValidate>
        <Field label="Nome" htmlFor="tm-name" required error={errors.displayName}>
          <input id="tm-name" className="mc-input" value={displayName} onChange={(e) => setDisplayName(e.target.value)} autoComplete="off" />
        </Field>
        {!isEdit && (
          <Field label="Email" htmlFor="tm-email" required error={errors.email}>
            <input id="tm-email" type="email" className="mc-input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
          </Field>
        )}
        <Field
          label={isEdit ? "Nova palavra-passe" : "Palavra-passe"}
          htmlFor="tm-password"
          required={!isEdit}
          error={errors.password}
          hint={isEdit ? "Deixe vazio para manter a actual." : "O utilizador pode alterá-la depois em Perfil."}
        >
          <input id="tm-password" type="password" className="mc-input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </Field>
        <Field
          label="Role"
          htmlFor="tm-role"
          hint={member?.isSelf ? "Não pode alterar o seu próprio role." : "Administrador de memória: eventos, conteúdo e definições."}
        >
          <select id="tm-role" className="mc-input mc-select" value={role} onChange={(e) => setRole(e.target.value as AdminRole)} disabled={member?.isSelf}>
            {(Object.keys(roleLabels) as AdminRole[]).map((value) => (
              <option key={value} value={value}>{roleLabels[value]}</option>
            ))}
          </select>
        </Field>
      </form>
    </Dialog>
  );
};
