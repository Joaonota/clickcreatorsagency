// ============================================================
// SAVE YOUR MEMORY — Edge Function `admin-users`
// ------------------------------------------------------------
// Gestão de contas do painel Memory Control. Corre no servidor
// do Supabase: a service role key é injectada pelo próprio
// Supabase (SUPABASE_SERVICE_ROLE_KEY) e nunca chega ao browser.
//
// Só um super_admin autenticado pode chamar esta função.
// Acções: list · create · update · delete
// ============================================================

import { createClient } from "npm:@supabase/supabase-js@2";

type Role = "super_admin" | "memory_admin";
const ROLES: Role[] = ["super_admin", "memory_admin"];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const fail = (status: number, error: string) => json(status, { error });

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return fail(405, "Método não suportado.");

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return fail(500, "Função mal configurada no servidor.");

  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  // 1) Quem está a chamar? (token da sessão do browser)
  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return fail(401, "Sessão em falta. Inicie sessão novamente.");
  const { data: caller, error: callerError } = await admin.auth.getUser(token);
  if (callerError || !caller.user) return fail(401, "Sessão inválida ou expirada. Inicie sessão novamente.");
  const callerId = caller.user.id;

  // 2) É super_admin? (decidido pela base de dados, nunca pelo browser)
  const { data: me } = await admin.from("admin_profiles").select("role").eq("user_id", callerId).maybeSingle();
  if (me?.role !== "super_admin") return fail(403, "Apenas super administradores podem gerir contas.");

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Pedido inválido.");
  }

  const countSuperAdmins = async () => {
    const { count } = await admin
      .from("admin_profiles")
      .select("user_id", { count: "exact", head: true })
      .eq("role", "super_admin");
    return count ?? 0;
  };

  const log = (summary: string) =>
    admin.from("memory_activity").insert({ kind: "team", summary, actor_id: callerId }).then(() => undefined);

  switch (body.action) {
    case "list": {
      const { data: profiles, error } = await admin
        .from("admin_profiles")
        .select("user_id, display_name, role, created_at")
        .order("created_at", { ascending: true });
      if (error) return fail(500, "Não foi possível ler a equipa.");
      const { data: users } = await admin.auth.admin.listUsers({ perPage: 1000 });
      const byId = new Map((users?.users ?? []).map((u) => [u.id, u]));
      return json(200, {
        members: (profiles ?? []).map((p) => ({
          userId: p.user_id,
          displayName: p.display_name,
          role: p.role,
          createdAt: p.created_at,
          email: byId.get(p.user_id)?.email ?? "",
          lastSignInAt: byId.get(p.user_id)?.last_sign_in_at ?? null,
          isSelf: p.user_id === callerId,
        })),
      });
    }

    case "create": {
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");
      const displayName = String(body.displayName ?? "").trim();
      const role = body.role as Role;
      if (!EMAIL_RE.test(email)) return fail(400, "Indique um email válido.");
      if (password.length < 8) return fail(400, "A palavra-passe deve ter pelo menos 8 caracteres.");
      if (!displayName) return fail(400, "Indique o nome.");
      if (!ROLES.includes(role)) return fail(400, "Role inválido.");

      const { data: created, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { display_name: displayName },
      });
      if (error || !created.user) {
        const exists = /already|registered|exists/i.test(error?.message ?? "");
        return fail(exists ? 409 : 400, exists ? "Já existe uma conta com este email." : "Não foi possível criar a conta.");
      }
      const { error: profileError } = await admin
        .from("admin_profiles")
        .insert({ user_id: created.user.id, display_name: displayName, role });
      if (profileError) {
        await admin.auth.admin.deleteUser(created.user.id);
        return fail(500, "Não foi possível criar o perfil de administrador.");
      }
      await log(`Conta criada: ${email} (${role})`);
      return json(200, { userId: created.user.id });
    }

    case "update": {
      const userId = String(body.userId ?? "");
      const { data: target } = await admin.from("admin_profiles").select("role").eq("user_id", userId).maybeSingle();
      if (!target) return fail(404, "Conta não encontrada.");

      const changes: { display_name?: string; role?: Role } = {};
      if (body.displayName !== undefined) {
        const name = String(body.displayName).trim();
        if (!name) return fail(400, "Indique o nome.");
        changes.display_name = name;
      }
      if (body.role !== undefined) {
        const role = body.role as Role;
        if (!ROLES.includes(role)) return fail(400, "Role inválido.");
        if (role !== target.role) {
          if (userId === callerId) return fail(400, "Não pode alterar o seu próprio role.");
          if (target.role === "super_admin" && (await countSuperAdmins()) <= 1)
            return fail(400, "Tem de existir pelo menos um super administrador.");
          changes.role = role;
        }
      }
      if (body.password) {
        const password = String(body.password);
        if (password.length < 8) return fail(400, "A palavra-passe deve ter pelo menos 8 caracteres.");
        const { error } = await admin.auth.admin.updateUserById(userId, { password });
        if (error) return fail(400, "Não foi possível alterar a palavra-passe.");
      }
      if (Object.keys(changes).length > 0) {
        const { error } = await admin.from("admin_profiles").update(changes).eq("user_id", userId);
        if (error) return fail(500, "Não foi possível guardar as alterações.");
      }
      await log("Conta de administrador actualizada");
      return json(200, { ok: true });
    }

    case "delete": {
      const userId = String(body.userId ?? "");
      if (userId === callerId) return fail(400, "Não pode remover a sua própria conta.");
      const { data: target } = await admin.from("admin_profiles").select("role").eq("user_id", userId).maybeSingle();
      if (!target) return fail(404, "Conta não encontrada.");
      if (target.role === "super_admin" && (await countSuperAdmins()) <= 1)
        return fail(400, "Tem de existir pelo menos um super administrador.");
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) return fail(500, "Não foi possível remover a conta.");
      await log("Conta de administrador removida");
      return json(200, { ok: true });
    }

    default:
      return fail(400, "Acção desconhecida.");
  }
});
