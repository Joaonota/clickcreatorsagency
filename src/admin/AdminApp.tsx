/* ============================================================
   MEMORY CONTROL — área administrativa privada do Save Your Memory
   ------------------------------------------------------------
   Carregada em lazy a partir de App.tsx: nenhum código do painel
   entra no bundle público. Rotas relativas a ADMIN_BASE.
   ============================================================ */

import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Compass } from "lucide-react";
import "./admin.css";
import { AdminAuthProvider } from "./auth/AdminAuthContext";
import { RequireAdmin, RequireRole } from "./auth/guards";
import { ToastProvider } from "./components/toast";
import { AdminLayout } from "./components/AdminLayout";
import { EmptyState } from "./components/EmptyState";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { EventsPage } from "./features/events/EventsPage";
import { EventDetailsPage } from "./features/events/EventDetailsPage";
import { AlbumsPage } from "./features/albums/AlbumsPage";
import { PhotosPage } from "./features/photos/PhotosPage";
import { PublicationsPage } from "./features/publications/PublicationsPage";
import { SettingsPage } from "./features/settings/SettingsPage";
import { ProfilePage } from "./features/profile/ProfilePage";

/** Impede indexação da área privada enquanto está montada (complementa o header X-Robots-Tag). */
function useNoIndex() {
  useEffect(() => {
    const previousTitle = document.title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousContent = meta?.content ?? null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "robots";
      document.head.appendChild(meta);
    }
    meta.content = "noindex, nofollow";
    document.title = "Memory Control · Click Creators";
    return () => {
      document.title = previousTitle;
      if (previousContent === null) meta?.remove();
      else if (meta) meta.content = previousContent;
    };
  }, []);
}

const AdminNotFound: React.FC = () => (
  <EmptyState icon={Compass} title="Página não encontrada" description="Esta secção do painel não existe." />
);

const AdminApp: React.FC = () => {
  useNoIndex();

  return (
    <div className="mc-root">
      <ToastProvider>
        <AdminAuthProvider>
          <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route
              element={
                <RequireAdmin>
                  <AdminLayout />
                </RequireAdmin>
              }
            >
              <Route index element={<DashboardPage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:eventId" element={<EventDetailsPage />} />
              <Route path="albums" element={<AlbumsPage />} />
              <Route path="photos" element={<PhotosPage />} />
              <Route path="publications" element={<PublicationsPage />} />
              <Route
                path="settings"
                element={
                  <RequireRole roles={["super_admin"]}>
                    <SettingsPage />
                  </RequireRole>
                }
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<AdminNotFound />} />
            </Route>
          </Routes>
        </AdminAuthProvider>
      </ToastProvider>
    </div>
  );
};

export default AdminApp;
