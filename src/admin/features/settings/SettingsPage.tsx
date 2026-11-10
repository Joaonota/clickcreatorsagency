import React from "react";
import { KeyRound, PlugZap, SlidersHorizontal, Users } from "lucide-react";
import { supabaseEnv } from "../../config/env";
import { adminAuthProvider } from "../../auth/provider";
import { roleLabels } from "../../auth/permissions";
import { memoryAdminRepository } from "../../data/repository";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { useAdminAction } from "../../hooks/useAdminAction";
import { DataError } from "../../components/DataState";
import { Skeleton } from "../../components/Skeleton";
import { Notice, PageHeader, StatusBadge } from "../../components/ui";
import type { GallerySettings } from "../../data/types";

const settingRows: Array<{ key: keyof GallerySettings; label: string; hint: string }> = [
  { key: "requirePhotoApproval", label: "Exigir aprovação antes de publicar", hint: "Novas fotografias ficam pendentes até serem revistas." },
  { key: "allowDownloads", label: "Permitir download individual", hint: "Visitantes podem descarregar cada fotografia publicada." },
  { key: "allowZipDownloads", label: "Permitir download em ZIP", hint: "Visitantes podem descarregar um álbum completo." },
];

export const SettingsPage: React.FC = () => {
  const settings = useAsyncResource(() => memoryAdminRepository.getSettings(), "settings");

  return (
    <div className="mc-page">
      <PageHeader eyebrow="Sistema" title="Definições" description="Preferências da galeria e estado da infra-estrutura." />

      <div className="mc-split">
        <section className="mc-card" aria-labelledby="mc-gallery-settings">
          <header className="mc-card-header">
            <h2 id="mc-gallery-settings" className="mc-card-title"><SlidersHorizontal size={16} aria-hidden="true" /> Galeria pública</h2>
          </header>
          <div className="mc-card-body">
            {settings.status === "loading" && (
              <div className="mc-stack">
                {settingRows.map((row) => <Skeleton key={row.key} className="mc-skel-line" />)}
              </div>
            )}
            {settings.status === "error" && <DataError compact error={settings.error} subject="As preferências da galeria" onRetry={settings.reload} />}
            {settings.status === "success" && <SettingsForm initial={settings.data} />}
          </div>
        </section>

        <div className="mc-stack">
          <section className="mc-card" aria-labelledby="mc-infra">
            <header className="mc-card-header">
              <h2 id="mc-infra" className="mc-card-title"><PlugZap size={16} aria-hidden="true" /> Ligação ao Supabase</h2>
            </header>
            <ul className="mc-checklist">
              <li><span>VITE_SUPABASE_URL</span><StatusBadge label={supabaseEnv.url ? "Definida" : "Em falta"} tone={supabaseEnv.url ? "success" : "warning"} /></li>
              <li><span>Anon key (pública)</span><StatusBadge label={supabaseEnv.hasPublicConfig ? "Definida" : "Em falta"} tone={supabaseEnv.hasPublicConfig ? "success" : "warning"} /></li>
              <li><span>Cliente de autenticação</span><StatusBadge label={adminAuthProvider.configured ? "Ligado" : "Pendente"} tone={adminAuthProvider.configured ? "success" : "warning"} /></li>
              <li><span>Base de dados e Storage</span><StatusBadge label={memoryAdminRepository.configured ? "Ligado" : "Pendente"} tone={memoryAdminRepository.configured ? "success" : "warning"} /></li>
            </ul>
            {supabaseEnv.leakedServiceRole && (
              <div className="mc-card-body">
                <Notice tone="warning" icon={KeyRound}>
                  <strong>Chave incorrecta detectada.</strong> A variável contém uma service_role key, que nunca
                  pode estar no frontend. Foi ignorada — remova-a e rode a chave no Supabase.
                </Notice>
              </div>
            )}
          </section>

          <section className="mc-card" aria-labelledby="mc-team">
            <header className="mc-card-header">
              <h2 id="mc-team" className="mc-card-title"><Users size={16} aria-hidden="true" /> Equipa de administração</h2>
            </header>
            <div className="mc-card-body">
              <p className="mc-text-muted">
                Não existe registo público. Novos administradores são convidados por um super administrador
                no Supabase Auth e recebem um dos roles:
              </p>
              <ul className="mc-role-list">
                {Object.entries(roleLabels).map(([role, label]) => (
                  <li key={role}><code>{role}</code> — {label}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const SettingsForm: React.FC<{ initial: GallerySettings }> = ({ initial }) => {
  const [values, setValues] = React.useState(initial);
  const { run, busy } = useAdminAction();
  const dirty = settingRows.some((row) => values[row.key] !== initial[row.key]);

  return (
    <form
      className="mc-form"
      onSubmit={(event) => {
        event.preventDefault();
        void run(() => memoryAdminRepository.updateSettings(values), "Definições guardadas.");
      }}
    >
      {settingRows.map((row) => (
        <label key={row.key} className="mc-switch-row">
          <span>
            <span className="mc-switch-label">{row.label}</span>
            <span className="mc-field-hint">{row.hint}</span>
          </span>
          <input
            type="checkbox"
            role="switch"
            className="mc-switch"
            checked={values[row.key]}
            onChange={(e) => setValues((current) => ({ ...current, [row.key]: e.target.checked }))}
          />
        </label>
      ))}
      <div className="mc-form-actions">
        <button type="submit" className="mc-btn mc-btn-primary" disabled={!dirty || busy}>
          {busy ? "A guardar…" : "Guardar definições"}
        </button>
      </div>
    </form>
  );
};
