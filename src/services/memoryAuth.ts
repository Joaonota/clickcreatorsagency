/* ============================================================
   SAVE YOUR MEMORY — AUTENTICAÇÃO DEMO (MOCK)
   ------------------------------------------------------------
   ⚠️  DEMO AUTH — login local apenas para proteger a demo do
   painel admin. Sem backend: as credenciais são constantes de
   demonstração e a sessão vive no sessionStorage desta aba.
   Substituir por autenticação real na fase de backend.
   ============================================================ */

const SESSION_KEY = "clickcreators-memory-admin-session";

export interface DemoUser {
  username: string;
  displayName: string;
}

/** Credenciais de demonstração — substituir por backend real. */
const DEMO_CREDENTIALS = {
  username: "admin",
  password: "clickcreators",
};

export const DEMO_LOGIN_HINT = {
  username: "admin",
  password: "clickcreators",
};

const isValidUser = (user: unknown): user is DemoUser =>
  Boolean(
    user &&
      typeof user === "object" &&
      typeof (user as DemoUser).username === "string" &&
      typeof (user as DemoUser).displayName === "string"
  );

export const memoryAuth = {
  /** Verifica credenciais (simulação). */
  async login(username: string, password: string): Promise<DemoUser | null> {
    await new Promise((resolve) => setTimeout(resolve, 450));
    const ok =
      username.trim().toLowerCase() === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password;
    if (!ok) return null;
    const user: DemoUser = { username: DEMO_CREDENTIALS.username, displayName: "Alex Homo" };
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch {
      /* storage indisponível — sessão apenas em memória */
    }
    return user;
  },

  logout(): void {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  },

  getUser(): DemoUser | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return isValidUser(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },
};
