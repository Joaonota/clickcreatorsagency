/* Caminho base da área administrativa — alterar aqui (e em vercel.json)
   para mudar o endereço privado. */
export const ADMIN_BASE = "/memory-control";

export const adminRoutes = {
  login: `${ADMIN_BASE}/login`,
  dashboard: ADMIN_BASE,
  events: `${ADMIN_BASE}/events`,
  event: (id: string) => `${ADMIN_BASE}/events/${encodeURIComponent(id)}`,
  albums: `${ADMIN_BASE}/albums`,
  photos: `${ADMIN_BASE}/photos`,
  publications: `${ADMIN_BASE}/publications`,
  settings: `${ADMIN_BASE}/settings`,
  team: `${ADMIN_BASE}/team`,
  profile: `${ADMIN_BASE}/profile`,
} as const;
