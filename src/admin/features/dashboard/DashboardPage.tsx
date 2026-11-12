import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  FilePen,
  Images,
} from "lucide-react";
import { useAdminAuth } from "../../auth/context";
import { adminRoutes } from "../../config/routes";
import { supabaseEnv } from "../../config/env";
import { adminAuthProvider } from "../../auth/provider";
import { memoryAdminRepository } from "../../data/repository";
import { formatDateTime } from "../../data/labels";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { DataError } from "../../components/DataState";
import { EmptyState } from "../../components/EmptyState";
import { PageHeader, StatCard, StatusBadge } from "../../components/ui";
import { Skeleton } from "../../components/Skeleton";
import type { DashboardStats } from "../../data/types";

const statCards: Array<{ key: keyof DashboardStats; label: string; icon: typeof Calendar; accent?: boolean }> = [
  { key: "totalEvents", label: "Total de eventos", icon: Calendar },
  { key: "publishedEvents", label: "Eventos publicados", icon: CheckCircle2, accent: true },
  { key: "draftEvents", label: "Eventos em rascunho", icon: FilePen },
  { key: "totalPhotos", label: "Total de fotografias", icon: Images },
  { key: "pendingPhotos", label: "Pendentes de aprovação", icon: Clock3 },
  { key: "downloads", label: "Downloads realizados", icon: Download },
];

export const DashboardPage: React.FC = () => {
  const { profile } = useAdminAuth();
  const dashboard = useAsyncResource(() => memoryAdminRepository.getDashboard(), "dashboard");
  const stats = dashboard.status === "success" ? dashboard.data.stats : null;

  const integrations = [
    { label: "Supabase Auth", ready: adminAuthProvider.configured },
    { label: "Base de dados (PostgreSQL + RLS)", ready: memoryAdminRepository.configured },
    { label: "Storage de fotografias", ready: memoryAdminRepository.configured },
    { label: "Variáveis públicas do Supabase", ready: supabaseEnv.hasPublicConfig },
  ];

  return (
    <div className="mc-page">
      <PageHeader
        eyebrow="Visão geral"
        title={profile ? `Olá, ${profile.displayName.split(" ")[0]}` : "Dashboard"}
        description="Resumo da actividade do Save Your Memory."
        actions={
          <Link to={adminRoutes.events} className="mc-btn mc-btn-primary">
            Gerir eventos <ArrowRight size={15} aria-hidden="true" />
          </Link>
        }
      />

      <section className="mc-stats-grid" aria-label="Indicadores">
        {statCards.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            accent={card.accent}
            loading={dashboard.status === "loading"}
            value={stats ? stats[card.key] : null}
          />
        ))}
      </section>

      <div className="mc-split">
        <section className="mc-card" aria-labelledby="mc-activity-title">
          <header className="mc-card-header">
            <h2 id="mc-activity-title" className="mc-card-title">
              <Activity size={16} aria-hidden="true" /> Actividade recente
            </h2>
          </header>
          <div className="mc-card-body">
            {dashboard.status === "loading" && (
              <ul className="mc-activity" aria-hidden="true">
                {[0, 1, 2].map((item) => (
                  <li key={item} className="mc-activity-item">
                    <Skeleton className="mc-skel-dot" />
                    <span className="mc-table-skel-lines">
                      <Skeleton className="mc-skel-line" />
                      <Skeleton className="mc-skel-line mc-skel-line-short" />
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {dashboard.status === "error" && (
              <DataError compact error={dashboard.error} subject="Os registos de actividade" onRetry={dashboard.reload} />
            )}
            {dashboard.status === "success" &&
              (dashboard.data.recentActivity.length === 0 ? (
                <EmptyState compact icon={Activity} title="Sem actividade" description="As acções da equipa aparecerão aqui." />
              ) : (
                <ul className="mc-activity">
                  {dashboard.data.recentActivity.map((item) => (
                    <li key={item.id} className="mc-activity-item">
                      <span className="mc-activity-dot" aria-hidden="true" />
                      <div>
                        <p className="mc-activity-text">{item.summary}</p>
                        <p className="mc-activity-meta">
                          {item.actorName} · <time dateTime={item.createdAt}>{formatDateTime(item.createdAt)}</time>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ))}
          </div>
        </section>

        <section className="mc-card" aria-labelledby="mc-integration-title">
          <header className="mc-card-header">
            <h2 id="mc-integration-title" className="mc-card-title">Estado da integração</h2>
          </header>
          <ul className="mc-checklist">
            {integrations.map((item) => (
              <li key={item.label}>
                <span>{item.label}</span>
                <StatusBadge label={item.ready ? "Ligado" : "Pendente"} tone={item.ready ? "success" : "warning"} />
              </li>
            ))}
          </ul>
          <p className="mc-card-foot">
            A galeria pública só mostra eventos, fotografias e vídeos publicados — regra aplicada
            no servidor por Row Level Security.
          </p>
        </section>
      </div>
    </div>
  );
};
