import React, { useCallback, useEffect, useMemo, useState } from "react";
import { isUiPreviewMode } from "../config/env";
import { adminAuthProvider } from "./provider";
import { AdminAuthContext, type AdminAuthStatus, type AdminAuthValue } from "./context";
import type { AdminCredentials, AdminSession } from "./types";

const statusFromSession = (session: AdminSession | null): AdminAuthStatus => {
  if (!session) return "unauthenticated";
  return session.profile ? "authenticated" : "forbidden";
};

const initialStatus = (): AdminAuthStatus => {
  if (isUiPreviewMode) return "preview";
  if (!adminAuthProvider.configured) return "unconfigured";
  return "loading";
};

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AdminAuthStatus>(initialStatus);
  const [session, setSession] = useState<AdminSession | null>(null);

  const applySession = useCallback((next: AdminSession | null) => {
    setSession(next);
    setStatus(statusFromSession(next));
  }, []);

  /* Verificação inicial + subscrição a mudanças de sessão (expiração, logout noutra aba). */
  useEffect(() => {
    if (isUiPreviewMode || !adminAuthProvider.configured) return undefined;
    let active = true;
    adminAuthProvider
      .getSession()
      .then((current) => {
        if (active) applySession(current);
      })
      .catch(() => {
        if (active) applySession(null);
      });
    const unsubscribe = adminAuthProvider.onSessionChange((next) => {
      if (active) applySession(next);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [applySession]);

  const signIn = useCallback(
    async (credentials: AdminCredentials) => {
      const next = await adminAuthProvider.signIn(credentials);
      applySession(next);
      return next;
    },
    [applySession]
  );

  const signOut = useCallback(async () => {
    try {
      await adminAuthProvider.signOut();
    } finally {
      applySession(null);
      if (!adminAuthProvider.configured && !isUiPreviewMode) setStatus("unconfigured");
    }
  }, [applySession]);

  const value = useMemo<AdminAuthValue>(
    () => ({
      status,
      session,
      profile: session?.profile ?? null,
      authConfigured: adminAuthProvider.configured,
      signIn,
      signOut,
      updatePassword: (password: string) => adminAuthProvider.updatePassword(password),
    }),
    [status, session, signIn, signOut]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};
