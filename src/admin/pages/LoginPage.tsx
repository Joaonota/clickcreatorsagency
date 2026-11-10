import React, { useId, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, PlugZap, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "../../components/common/ThemeToggle";
import { adminRoutes, ADMIN_BASE } from "../config/routes";
import { useAdminAuth } from "../auth/context";
import { toUserMessage } from "../data/errors";
import { Notice } from "../components/ui";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const LoginPage: React.FC = () => {
  const { status, authConfigured, signIn } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const from = (location.state as { from?: string } | null)?.from;
  const target = from && from.startsWith(ADMIN_BASE) && from !== adminRoutes.login ? from : adminRoutes.dashboard;

  if (status === "authenticated" || status === "preview") return <Navigate to={target} replace />;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (busy || !authConfigured) return;
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Introduza um endereço de email válido.");
      return;
    }
    if (!password) {
      setError("Introduza a palavra-passe.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const session = await signIn({ email: email.trim(), password });
      setPassword("");
      if (session.profile) navigate(target, { replace: true });
      else setError("Esta conta não tem permissões de administração.");
    } catch (err) {
      setError(toUserMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mc-login">
      <div className="mc-login-theme">
        <ThemeToggle />
      </div>

      <section className="mc-login-aside" aria-hidden="true">
        <div className="mc-login-aside-inner">
          <span className="header-logo-wrap">
            <img src="/logo/logo.PNG" alt="" className="mc-brand-logo" width={110} height={38} />
          </span>
          <p className="mc-login-display">
            Save Your
            <br />
            <span className="mc-text-accent">Memory</span>
          </p>
          <p className="mc-login-tagline">Gestão privada de eventos, álbuns e fotografias.</p>
        </div>
      </section>

      <section className="mc-login-panel">
        <div className="mc-login-card">
          <p className="mc-eyebrow">
            <Lock size={12} aria-hidden="true" /> Área reservada
          </p>
          <h1 className="mc-login-title">Memory Control</h1>
          <p className="mc-page-desc">Inicie sessão com a sua conta de administrador.</p>

          {!authConfigured && (
            <Notice tone="warning" icon={PlugZap}>
              <strong>Autenticação pendente.</strong> A ligação ao Supabase Auth ainda não foi
              configurada, pelo que não é possível iniciar sessão. Nenhuma credencial local é aceite.
            </Notice>
          )}

          <form className="mc-form mc-login-form" onSubmit={handleSubmit} noValidate>
            <div className="mc-field">
              <label htmlFor={emailId} className="mc-label">Email</label>
              <input
                id={emailId}
                type="email"
                className="mc-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                inputMode="email"
                disabled={!authConfigured || busy}
                required
              />
            </div>
            <div className="mc-field">
              <label htmlFor={passwordId} className="mc-label">Palavra-passe</label>
              <div className="mc-input-wrap">
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  className="mc-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={!authConfigured || busy}
                  required
                />
                <button
                  type="button"
                  className="mc-input-addon"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
                  disabled={!authConfigured}
                >
                  {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
                </button>
              </div>
            </div>

            {error && <p className="mc-form-error" role="alert">{error}</p>}

            <button type="submit" className="mc-btn mc-btn-primary mc-btn-block" disabled={!authConfigured || busy}>
              {busy ? <Loader2 size={16} className="mc-spin" aria-hidden="true" /> : <ShieldCheck size={16} aria-hidden="true" />}
              {busy ? "A verificar…" : "Entrar"}
            </button>
          </form>

          <p className="mc-login-foot">
            Acesso exclusivo por convite. Não existe registo público de administradores.
          </p>
          <p className="mc-credit">Desenvolvido por <strong>BYTEMOZ</strong></p>
        </div>
      </section>
    </div>
  );
};
