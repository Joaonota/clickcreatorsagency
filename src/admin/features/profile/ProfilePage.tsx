import React, { useState } from "react";
import { KeyRound, LogOut, UserRound } from "lucide-react";
import { useAdminAuth } from "../../auth/context";
import { roleLabels } from "../../auth/permissions";
import { useAdminAction } from "../../hooks/useAdminAction";
import { Field, PageHeader } from "../../components/ui";

const MIN_PASSWORD = 12;

export const ProfilePage: React.FC = () => {
  const { session, profile, status, signOut, updatePassword } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const { run, busy } = useAdminAction();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < MIN_PASSWORD) return setError(`A palavra-passe deve ter pelo menos ${MIN_PASSWORD} caracteres.`);
    if (password !== confirm) return setError("As palavras-passe não coincidem.");
    setError("");
    const ok = await run(() => updatePassword(password), "Palavra-passe actualizada.");
    if (ok) {
      setPassword("");
      setConfirm("");
    }
  };

  const rows = [
    { label: "Nome", value: profile?.displayName },
    { label: "Email", value: session?.user.email },
    { label: "Role", value: profile ? roleLabels[profile.role] : undefined },
  ];

  return (
    <div className="mc-page">
      <PageHeader eyebrow="Conta" title="Perfil" description="Dados da sua conta de administrador." />

      <div className="mc-split">
        <section className="mc-card" aria-labelledby="mc-profile-data">
          <header className="mc-card-header">
            <h2 id="mc-profile-data" className="mc-card-title"><UserRound size={16} aria-hidden="true" /> Identificação</h2>
          </header>
          <dl className="mc-meta-list">
            {rows.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value ?? <span className="mc-text-muted">{status === "preview" ? "Sem sessão (pré-visualização)" : "—"}</span>}</dd>
              </div>
            ))}
          </dl>
          <div className="mc-card-body">
            <button type="button" className="mc-btn mc-btn-secondary" onClick={() => void signOut()}>
              <LogOut size={14} aria-hidden="true" /> Terminar sessão
            </button>
          </div>
        </section>

        <section className="mc-card" aria-labelledby="mc-password">
          <header className="mc-card-header">
            <h2 id="mc-password" className="mc-card-title"><KeyRound size={16} aria-hidden="true" /> Alterar palavra-passe</h2>
          </header>
          <form className="mc-form mc-card-body" onSubmit={handleSubmit} noValidate>
            <Field label="Nova palavra-passe" htmlFor="pf-new" hint={`Mínimo ${MIN_PASSWORD} caracteres.`}>
              <input id="pf-new" type="password" className="mc-input" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Field label="Confirmar palavra-passe" htmlFor="pf-confirm" error={error}>
              <input id="pf-confirm" type="password" className="mc-input" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </Field>
            <div className="mc-form-actions">
              <button type="submit" className="mc-btn mc-btn-primary" disabled={busy || !password}>
                {busy ? "A actualizar…" : "Actualizar palavra-passe"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};
