import type { AdminRole } from "./types";

/* Permissões por role — usadas APENAS para adaptar a interface
   (esconder acções). A autorização efectiva é feita pelas policies
   RLS e Storage no Supabase. */
export type AdminPermission =
  | "events:write"
  | "photos:write"
  | "photos:publish"
  | "settings:manage"
  | "admins:manage";

const rolePermissions: Record<AdminRole, readonly AdminPermission[]> = {
  super_admin: [
    "events:write",
    "photos:write",
    "photos:publish",
    "settings:manage",
    "admins:manage",
  ],
  memory_admin: ["events:write", "photos:write", "photos:publish", "settings:manage"],
};

export const roleLabels: Record<AdminRole, string> = {
  super_admin: "Super administrador",
  memory_admin: "Administrador de memória",
};

export const roleHasPermission = (role: AdminRole, permission: AdminPermission): boolean =>
  rolePermissions[role].includes(permission);
