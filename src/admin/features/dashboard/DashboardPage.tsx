import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  Flame,
  Images,
  LayoutGrid,
  QrCode,
  RefreshCw,
  Trophy,
  UserRound,
  Zap,
} from "lucide-react";
import { useAdminAuth } from "../../auth/context";
import { adminRoutes } from "../../config/routes";
import { supabaseEnv } from "../../config/env";
import { adminAuthProvider } from "../../auth/provider";
import { memoryAdminRepository } from "../../data/repository";
import { analyticsRepository } from "../../data/analyticsRepository";
import { UserFacingError } from "../../data/errors";
import { formatDateTime } from "../../data/labels";
import { useAsyncResource } from "../../hooks/useAsyncResource";
import { DataError } from "../../components/DataState";
import { EmptyState } from "../../components/EmptyState";
import { PageHeader, StatCard, StatusBadge } from "../../components/ui";
import { Skeleton } from "../../components/Skeleton";
import type { AnalyticsMetric } from "../../data/types";
import { ActivityChart } from "./ActivityChart";
import { DownloadsBreakdown, TopEventsList, TopPhotosTable, VisitorFeed } from "./AnalyticsCards";
import {
  currentTime,
  defaultCustomRange,
  formatCount,
  metricMeta,
  periodOptions,
  resolveRange,
  toDateInput,
  type PeriodPreset,
} from "./analyticsPeriod";

const CHART_METRICS: AnalyticsMetric[] = ["gallery_views", "photo_views", "downloads", "qr_scans"];
const RANK_METRICS: AnalyticsMetric[] = ["gallery_views", "downloads", "photo_views"];

const ListSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <ul className="mc-activity" aria-hidden="true">
    {Array.from({ length: rows }, (_, item) => (
      <li key={item} className="mc-activity-item">
        <Skeleton className="mc-skel-dot" />
        <span className="mc-table-skel-lines">
          <Skeleton className="mc-skel-line" />
          <Skeleton className="mc-skel-line mc-skel-line-short" />
        </span>
      </li>
    ))}
  </ul>
);

export const DashboardPage: React.FC = () => {
  const { profile } = useAdminAuth();

  /* ---------------------------------------------------- filtros */
  const [preset, setPreset] = useState<PeriodPreset>("30d");
  const [custom, setCustom] = useState(defaultCustomRange);
  const [eventId, setEventId] = useState("");
  const [reference, setReference] = useState(currentTime);
  const [chartMetric, setChartMetric] = useState<AnalyticsMetric>("gallery_views");
  const [rankMetric, setRankMetric] = useState<AnalyticsMetric>("gallery_views");
  const [feedTab, setFeedTab] = useState<"visitors" | "team">("visitors");

  const resolved = useMemo(() => resolveRange(preset, custom, reference), [preset, custom, reference]);
  const rangeKey = resolved.ok ? `${resolved.range.from}|${resolved.range.to}|${resolved.range.bucket}|${reference}` : "invalid";
  const periodLabel = periodOptions.find((option) => option.id === preset)?.description ?? "";

  /* ---------------------------------------------------- dados */
  const dashboard = useAsyncResource(() => memoryAdminRepository.getDashboard(), `dashboard|${reference}`);
  const eventOptions = useAsyncResource(() => analyticsRepository.listEventOptions(), "analytics-events");
  const analytics = useAsyncResource(
    () =>
      resolved.ok
        ? analyticsRepository.getSnapshot({ ...resolved.range, eventId: eventId || null })
        : Promise.reject(new UserFacingError(resolved.message)),
    `snapshot|${rangeKey}|${eventId}`
  );
  const topEvents = useAsyncResource(
    () => (resolved.ok ? analyticsRepository.getTopEvents(resolved.range, rankMetric) : Promise.resolve([])),
    `top-events|${rangeKey}|${rankMetric}`
  );
  const recent = useAsyncResource(() => analyticsRepository.getRecentActivity(eventId || null), `recent|${eventId}|${reference}`);

  const stats = dashboard.status === "success" ? dashboard.data.stats : null;
  const summary = analytics.status === "success" ? analytics.data.summary : null;
  const contentLoading = dashboard.status === "loading";
  const audienceLoading = analytics.status === "loading";
  const selectedEvent = eventOptions.status === "success" ? eventOptions.data.find((event) => event.id === eventId) : undefined;
  const scopeLabel = selectedEvent ? selectedEvent.title : "Todos os eventos";
  const chartTotals: Record<AnalyticsMetric, number> | null = summary
    ? { gallery_views: summary.galleryViews, photo_views: summary.photoViews, downloads: summary.downloads, qr_scans: summary.qrScans }
    : null;

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
        description="Conteúdo e audiência do Save Your Memory, com dados reais das galerias públicas."
        actions={
          <Link to={adminRoutes.events} className="mc-btn mc-btn-primary">
            Gerir eventos <ArrowRight size={15} aria-hidden="true" />
          </Link>
        }
      />

      {/* ---------------------------------------------------- filtros */}
      <div className="mc-analytics-filters" role="group" aria-label="Filtros de analytics">
        <div className="mc-segmented" role="tablist" aria-label="Período">
          {periodOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={preset === option.id}
              className={preset === option.id ? "active" : ""}
              onClick={() => setPreset(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {preset === "custom" && (
          <div className="mc-analytics-dates">
            <label className="mc-visually-hidden" htmlFor="mc-range-from">Data de início</label>
            <input
              id="mc-range-from"
              type="date"
              className="mc-input"
              value={custom.from}
              max={custom.to || toDateInput(new Date(reference))}
              onChange={(e) => setCustom((value) => ({ ...value, from: e.target.value }))}
            />
            <span className="mc-text-muted" aria-hidden="true">→</span>
            <label className="mc-visually-hidden" htmlFor="mc-range-to">Data de fim</label>
            <input
              id="mc-range-to"
              type="date"
              className="mc-input"
              value={custom.to}
              min={custom.from}
              max={toDateInput(new Date(reference))}
              onChange={(e) => setCustom((value) => ({ ...value, to: e.target.value }))}
            />
          </div>
        )}

        <div className="mc-analytics-filters-end">
          <label className="mc-visually-hidden" htmlFor="mc-analytics-event">Evento</label>
          <select
            id="mc-analytics-event"
            className="mc-input mc-select"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            disabled={eventOptions.status !== "success"}
          >
            <option value="">Todos os eventos</option>
            {eventOptions.status === "success" &&
              eventOptions.data.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
          </select>
          <button
            type="button"
            className="mc-icon-btn"
            onClick={() => setReference(Date.now())}
            aria-label="Actualizar dados"
            title="Actualizar dados"
          >
            <RefreshCw size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- conteúdo */}
      <section aria-labelledby="mc-content-title" className="mc-stack">
        <div className="mc-section-bar">
          <h2 id="mc-content-title" className="mc-section-label">Conteúdo · todos os eventos</h2>
        </div>
        {dashboard.status === "error" ? (
          <div className="mc-card">
            <DataError compact error={dashboard.error} subject="Os totais de conteúdo" onRetry={dashboard.reload} />
          </div>
        ) : (
          <div className="mc-stats-grid mc-stats-grid-5">
            <StatCard
              icon={Calendar}
              label="Total de eventos"
              loading={contentLoading}
              value={stats ? stats.totalEvents : null}
              caption={stats ? `${formatCount(stats.totalEvents - stats.publishedEvents)} por publicar` : undefined}
            />
            <StatCard icon={CheckCircle2} label="Eventos publicados" accent loading={contentLoading} value={stats ? stats.publishedEvents : null} caption="Visíveis na galeria" />
            <StatCard
              icon={Zap}
              label="Eventos activos"
              loading={audienceLoading}
              value={summary ? summary.activeEvents : null}
              caption="Com acessos no período"
            />
            <StatCard
              icon={Images}
              label="Total de fotografias"
              loading={contentLoading}
              value={stats ? stats.totalPhotos : null}
              caption={stats ? (stats.totalVideos > 0 ? `+ ${formatCount(stats.totalVideos)} vídeos` : "Sem vídeos") : undefined}
            />
            <StatCard icon={Clock3} label="Pendentes de aprovação" loading={contentLoading} value={stats ? stats.pendingPhotos : null} caption="Aguardam revisão" />
          </div>
        )}
      </section>

      {/* ---------------------------------------------------- audiência */}
      <section aria-labelledby="mc-audience-title" className="mc-stack">
        <div className="mc-section-bar">
          <h2 id="mc-audience-title" className="mc-section-label">
            Audiência · {periodLabel} · {scopeLabel}
          </h2>
        </div>
        {analytics.status === "error" ? (
          <div className="mc-card">
            <DataError compact error={analytics.error} subject="As estatísticas de audiência" onRetry={analytics.reload} />
          </div>
        ) : (
          <div className="mc-stats-grid mc-stats-grid-5">
            <StatCard icon={LayoutGrid} label="Acessos às galerias" accent loading={audienceLoading} value={summary ? summary.galleryViews : null} caption="Aberturas de galeria" />
            <StatCard
              icon={UserRound}
              label="Visitantes únicos"
              loading={audienceLoading}
              value={summary ? summary.uniqueVisitors : null}
              caption="Identificação anónima"
            />
            <StatCard icon={Eye} label="Visualizações de fotografias" loading={audienceLoading} value={summary ? summary.photoViews : null} caption="Fotografias e vídeos abertos" />
            <StatCard
              icon={Download}
              label="Downloads"
              loading={audienceLoading}
              value={summary ? summary.downloads : null}
              caption={summary ? `${formatCount(summary.downloadedFiles)} ${summary.downloadedFiles === 1 ? "ficheiro" : "ficheiros"}` : undefined}
            />
            <StatCard icon={QrCode} label="QR Codes escaneados" loading={audienceLoading} value={summary ? summary.qrScans : null} caption="Entradas pelo QR Code" />
          </div>
        )}
      </section>

      {/* ---------------------------------------------------- gráfico */}
      {analytics.status !== "error" && (
        <section className="mc-card" aria-labelledby="mc-chart-title">
          <header className="mc-card-header">
            <h2 id="mc-chart-title" className="mc-card-title">
              <Activity size={16} aria-hidden="true" /> Actividade
            </h2>
            <span className="mc-card-hint">{periodLabel}</span>
          </header>
          <div className="mc-metric-tabs" role="tablist" aria-label="Métrica do gráfico">
            {CHART_METRICS.map((metric) => (
              <button
                key={metric}
                type="button"
                role="tab"
                aria-selected={chartMetric === metric}
                className={`mc-metric-tab ${chartMetric === metric ? "active" : ""}`}
                onClick={() => setChartMetric(metric)}
              >
                <span className="mc-metric-tab-label">{metricMeta[metric].label}</span>
                <span className="mc-metric-tab-value">
                  {chartTotals ? formatCount(chartTotals[metric]) : <Skeleton className="mc-skel-line mc-skel-line-short" />}
                </span>
              </button>
            ))}
          </div>
          <div className="mc-card-body">
            {analytics.status === "loading" || !resolved.ok ? (
              <Skeleton className="mc-skel-chart" />
            ) : (
              <ActivityChart points={analytics.data.series} metric={chartMetric} bucket={resolved.range.bucket} />
            )}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------- rankings + actividade */}
      <div className="mc-split">
        <section className="mc-card" aria-labelledby="mc-top-events-title">
          <header className="mc-card-header">
            <h2 id="mc-top-events-title" className="mc-card-title">
              <Trophy size={16} aria-hidden="true" /> Eventos mais populares
            </h2>
            <div className="mc-segmented mc-segmented-sm" role="tablist" aria-label="Ordenar eventos por">
              {RANK_METRICS.map((metric) => (
                <button
                  key={metric}
                  type="button"
                  role="tab"
                  aria-selected={rankMetric === metric}
                  className={rankMetric === metric ? "active" : ""}
                  onClick={() => setRankMetric(metric)}
                >
                  {metricMeta[metric].label}
                </button>
              ))}
            </div>
          </header>
          <div className="mc-card-body">
            {topEvents.status === "loading" && <ListSkeleton />}
            {topEvents.status === "error" && (
              <DataError compact error={topEvents.error} subject="O ranking de eventos" onRetry={topEvents.reload} />
            )}
            {topEvents.status === "success" &&
              (topEvents.data.length === 0 ? (
                <EmptyState
                  compact
                  icon={Trophy}
                  title="Ainda sem ranking"
                  description={`Nenhum evento registou ${metricMeta[rankMetric].many} neste período.`}
                />
              ) : (
                <TopEventsList events={topEvents.data} metric={rankMetric} />
              ))}
          </div>
          <p className="mc-card-foot">{periodLabel} · todos os eventos</p>
        </section>

        <section className="mc-card" aria-labelledby="mc-activity-title">
          <header className="mc-card-header">
            <h2 id="mc-activity-title" className="mc-card-title">
              <Activity size={16} aria-hidden="true" /> Actividade recente
            </h2>
            <div className="mc-segmented mc-segmented-sm" role="tablist" aria-label="Tipo de actividade">
              <button type="button" role="tab" aria-selected={feedTab === "visitors"} className={feedTab === "visitors" ? "active" : ""} onClick={() => setFeedTab("visitors")}>
                Visitantes
              </button>
              <button type="button" role="tab" aria-selected={feedTab === "team"} className={feedTab === "team" ? "active" : ""} onClick={() => setFeedTab("team")}>
                Equipa
              </button>
            </div>
          </header>
          <div className="mc-card-body mc-activity-scroll">
            {feedTab === "visitors" ? (
              <>
                {recent.status === "loading" && <ListSkeleton />}
                {recent.status === "error" && (
                  <DataError compact error={recent.error} subject="A actividade dos visitantes" onRetry={recent.reload} />
                )}
                {recent.status === "success" &&
                  (recent.data.length === 0 ? (
                    <EmptyState
                      compact
                      icon={Flame}
                      title="Sem visitas registadas"
                      description="Quando alguém abrir uma galeria, ler o QR Code ou descarregar fotografias, aparece aqui."
                    />
                  ) : (
                    <VisitorFeed items={recent.data} />
                  ))}
              </>
            ) : (
              <>
                {dashboard.status === "loading" && <ListSkeleton />}
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
              </>
            )}
          </div>
          {feedTab === "visitors" && <p className="mc-card-foot">Últimos registos · {scopeLabel}</p>}
        </section>
      </div>

      {/* ---------------------------------------------------- fotografias + downloads */}
      <div className="mc-split">
        <section className="mc-card" aria-labelledby="mc-top-photos-title">
          <header className="mc-card-header">
            <h2 id="mc-top-photos-title" className="mc-card-title">
              <Images size={16} aria-hidden="true" /> Fotografias mais populares
            </h2>
            <span className="mc-card-hint">{scopeLabel}</span>
          </header>
          {analytics.status === "loading" && (
            <div className="mc-card-body">
              <ListSkeleton />
            </div>
          )}
          {analytics.status === "error" && (
            <DataError compact error={analytics.error} subject="O ranking de fotografias" onRetry={analytics.reload} />
          )}
          {analytics.status === "success" &&
            (analytics.data.topPhotos.length === 0 ? (
              <div className="mc-card-body">
                <EmptyState
                  compact
                  icon={Images}
                  title="Sem fotografias vistas"
                  description="As fotografias abertas ou descarregadas pelos visitantes aparecem aqui."
                />
              </div>
            ) : (
              <TopPhotosTable photos={analytics.data.topPhotos} />
            ))}
        </section>

        <div className="mc-stack">
          <section className="mc-card" aria-labelledby="mc-downloads-title">
            <header className="mc-card-header">
              <h2 id="mc-downloads-title" className="mc-card-title">
                <Download size={16} aria-hidden="true" /> Downloads por tipo
              </h2>
            </header>
            <div className="mc-card-body">
              {analytics.status === "loading" && <ListSkeleton rows={4} />}
              {analytics.status === "error" && (
                <DataError compact error={analytics.error} subject="Os downloads" onRetry={analytics.reload} />
              )}
              {analytics.status === "success" && <DownloadsBreakdown summary={analytics.data.summary} />}
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
              A galeria pública só mostra eventos, fotografias e vídeos publicados. As estatísticas são anónimas e só
              administradores as consultam — regras aplicadas no servidor por Row Level Security.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
