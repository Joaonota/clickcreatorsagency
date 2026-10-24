import React, { useState } from "react";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { Reveal } from "../../../hooks/useReveal";
import { useTranslation } from "../../../i18n";
import { memoryAuth, type DemoUser } from "../../../services/memoryAuth";

interface LoginViewProps {
  onLogin: (user: DemoUser) => void;
}

/** Ecrã de entrada do painel Save Your Memory (auth DEMO — sem backend). */
export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(false);
    const user = await memoryAuth.login(username, password);
    setBusy(false);
    if (user) {
      onLogin(user);
    } else {
      setError(true);
    }
  };

  return (
    <div className="adm-login">
      <div className="container">
        <Reveal className="adm-login-inner">
          <p className="eyebrow mb-6">{t.memory.admin.loginEyebrow}</p>
          <h1 className="display-md">
            <span className="block">{t.memory.admin.loginTitleLine1}</span>
            <span className="block text-outline-lime">{t.memory.admin.loginTitleLine2}</span>
          </h1>
          <p className="lede mt-6 max-w-xl">{t.memory.admin.loginLede}</p>

          <form onSubmit={handleSubmit} className="adm-login-form mt-10 max-w-xl">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">{t.memory.admin.loginUserLabel}</span>
                <input
                  type="text"
                  className="field"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </label>
              <label className="block">
                <span className="field-label">{t.memory.admin.loginPasswordLabel}</span>
                <input
                  type="password"
                  className="field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </label>
            </div>

            {error && (
              <p className="adm-login-error mt-6" role="alert">
                {t.memory.admin.loginError}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn btn-primary btn-lg mt-8">
              {busy ? (
                <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              ) : (
                <LogIn size={16} aria-hidden="true" />
              )}
              <span>{t.memory.admin.loginSubmit}</span>
            </button>
          </form>

          <div className="adm-demo-box mt-10 max-w-xl">
            <span className="flex items-center gap-2 font-display text-sm uppercase tracking-[0.14em]">
              <ShieldCheck size={15} aria-hidden="true" />
              {t.memory.admin.loginDemoHintTitle}
            </span>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {t.memory.admin.loginDemoHintBody}
            </p>
            <p className="mt-3 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-[var(--primary)]">
              {t.memory.admin.loginHintCreds}
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
