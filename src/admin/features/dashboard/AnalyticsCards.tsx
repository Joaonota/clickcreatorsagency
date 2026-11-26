import React from "react";
import { Link } from "react-router-dom";
import { Download, Eye, FolderOpen, Image as ImageIcon, LayoutGrid, Play, QrCode } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { adminRoutes } from "../../config/routes";
import { formatDateTime } from "../../data/labels";
import type { AnalyticsEventType, AnalyticsMetric, AnalyticsSummary, DownloadKind, TopEvent, TopPhoto, VisitorActivity } from "../../data/types";
import { activityLabel, downloadKindLabels, formatCount, formatMetric } from "./analyticsPeriod";

/* ------------------------------------------------------------ eventos mais populares */
export const TopEventsList: React.FC<{ events: TopEvent[]; metric: AnalyticsMetric }> = ({ events, metric }) => {
  const max = Math.max(1, ...events.map((event) => event.values[metric]));
  return (
    <ol className="mc-rank">
      {events.map((event, index) => (
        <li key={event.eventId} className="mc-rank-item">
          <span className="mc-rank-pos" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div className="mc-rank-main">
            <div className="mc-rank-row">
              <Link to={adminRoutes.event(event.eventId)} className="mc-rank-title mc-truncate">
                {event.title}
              </Link>
              <span className="mc-rank-value">{formatMetric(metric, event.values[metric])}</span>
            </div>
            <span className="mc-rank-track" aria-hidden="true">
              <span style={{ width: `${(event.values[metric] / max) * 100}%` }} />
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
};

/* ------------------------------------------------------------ fotografias mais populares */
export const TopPhotosTable: React.FC<{ photos: TopPhoto[] }> = ({ photos }) => (
  <table className="mc-table mc-top-photos">
    <thead>
      <tr>
        <th scope="col">Fotografia</th>
        <th scope="col">Evento</th>
        <th scope="col" className="mc-text-right">Visualizações</th>
        <th scope="col" className="mc-text-right">Downloads</th>
      </tr>
    </thead>
    <tbody>
      {photos.map((photo) => (
        <tr key={photo.photoId}>
          <td data-label="Fotografia">
            <span className="mc-cell-media">
              <span className="mc-thumb mc-thumb-sm">
                {photo.previewUrl ? (
                  <img src={photo.previewUrl} alt="" loading="lazy" />
                ) : photo.mediaType === "video" ? (
                  <Play size={14} aria-hidden="true" />
                ) : (
                  <ImageIcon size={14} aria-hidden="true" />
                )}
              </span>
              <span className="mc-cell-title mc-truncate" title={photo.fileName}>{photo.fileName}</span>
            </span>
          </td>
          <td data-label="Evento">
            <Link to={adminRoutes.event(photo.eventId)} className="mc-cell-sub mc-link-muted">{photo.eventTitle}</Link>
          </td>
          <td data-label="Visualizações" className="mc-text-right mc-num">{formatCount(photo.views)}</td>
          <td data-label="Downloads" className="mc-text-right mc-num">{formatCount(photo.downloads)}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/* ------------------------------------------------------------ downloads por tipo */
const KIND_ORDER: DownloadKind[] = ["single", "multiple", "album", "all"];

export const DownloadsBreakdown: React.FC<{ summary: AnalyticsSummary }> = ({ summary }) => {
  const max = Math.max(1, ...KIND_ORDER.map((kind) => summary.downloadsByKind[kind]));
  return (
    <div className="mc-breakdown">
      <ul className="mc-rank">
        {KIND_ORDER.map((kind) => (
          <li key={kind} className="mc-rank-item mc-rank-item-flat">
            <div className="mc-rank-main">
              <div className="mc-rank-row">
                <span className="mc-rank-title">{downloadKindLabels[kind]}</span>
                <span className="mc-rank-value">{formatCount(summary.downloadsByKind[kind])}</span>
              </div>
              <span className="mc-rank-track" aria-hidden="true">
                <span style={{ width: `${(summary.downloadsByKind[kind] / max) * 100}%` }} />
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mc-breakdown-foot">
        <strong>{formatCount(summary.downloadedFiles)}</strong> {summary.downloadedFiles === 1 ? "ficheiro descarregado" : "ficheiros descarregados"} no período
      </p>
    </div>
  );
};

/* ------------------------------------------------------------ actividade dos visitantes */
const activityIcons: Record<AnalyticsEventType, LucideIcon> = {
  gallery_view: LayoutGrid,
  photo_view: Eye,
  album_view: FolderOpen,
  qr_scan: QrCode,
  download: Download,
};

export const VisitorFeed: React.FC<{ items: VisitorActivity[] }> = ({ items }) => (
  <ul className="mc-activity">
    {items.map((item) => {
      const Icon = activityIcons[item.type];
      return (
        <li key={item.id} className="mc-activity-item">
          <span className="mc-activity-icon" aria-hidden="true">
            <Icon size={14} strokeWidth={1.9} />
          </span>
          <div className="mc-activity-body">
            <p className="mc-activity-text">{activityLabel(item.type, item.downloadKind, item.itemCount)}</p>
            <p className="mc-activity-meta">
              <Link to={adminRoutes.event(item.eventId)} className="mc-link-muted">{item.eventTitle}</Link>
              {item.fileName && <> · <span className="mc-truncate-inline">{item.fileName}</span></>}
              {" · "}
              <time dateTime={item.createdAt}>{formatDateTime(item.createdAt)}</time>
            </p>
          </div>
        </li>
      );
    })}
  </ul>
);
