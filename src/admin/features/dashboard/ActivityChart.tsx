import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { EmptyState } from "../../components/EmptyState";
import type { AnalyticsBucket, AnalyticsMetric, AnalyticsPoint } from "../../data/types";
import { bucketAxisLabel, bucketTooltipLabel, formatCount, formatMetric, metricMeta } from "./analyticsPeriod";

interface ActivityChartProps {
  points: AnalyticsPoint[];
  metric: AnalyticsMetric;
  bucket: AnalyticsBucket;
}

const HEIGHT = 248;
const PAD = { top: 14, right: 6, bottom: 28, left: 40 };

/** Escala "bonita" com 4 divisões inteiras. */
function niceScale(max: number): { top: number; step: number } {
  if (max <= 4) return { top: 4, step: 1 };
  const raw = max / 4;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  return { top: step * 4, step };
}

/** Barra com as pontas superiores arredondadas (4px), assente na linha de base. */
function barPath(x: number, y: number, width: number, height: number): string {
  const r = Math.min(4, width / 2, height);
  const base = y + height;
  return `M${x},${base}V${y + r}Q${x},${y} ${x + r},${y}H${x + width - r}Q${x + width},${y} ${x + width},${y + r}V${base}Z`;
}

/** Largura de um elemento (callback ref: funciona mesmo quando o elemento só aparece mais tarde). */
function useElementWidth<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!element) return undefined;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);
  return [setElement, width] as const;
}

/** Gráfico de colunas de uma métrica ao longo do período (com tooltip e tabela acessível). */
export const ActivityChart: React.FC<ActivityChartProps> = ({ points, metric, bucket }) => {
  const [containerRef, width] = useElementWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const total = points.reduce((sum, point) => sum + point.values[metric], 0);
  const max = points.reduce((top, point) => Math.max(top, point.values[metric]), 0);
  const { top, step } = niceScale(max);
  const plotW = Math.max(0, width - PAD.left - PAD.right);
  const plotH = HEIGHT - PAD.top - PAD.bottom;
  const band = points.length > 0 ? plotW / points.length : 0;
  const barW = Math.max(1, Math.min(28, band - Math.max(2, band * 0.3)));
  const y = (value: number) => PAD.top + plotH * (1 - value / top);
  const ticks = Array.from({ length: 5 }, (_, index) => index * step);
  const labelEvery = Math.max(1, Math.ceil(points.length / Math.max(1, Math.floor(plotW / 64))));
  const hovered = hover !== null ? points[hover] : null;

  if (total === 0) {
    return (
      <div className="mc-chart-empty">
        <EmptyState
          compact
          icon={BarChart3}
          title="Sem registos neste período"
          description={`Ainda não há ${metricMeta[metric].many} no período escolhido. Os dados aparecem assim que os visitantes abrirem as galerias.`}
        />
      </div>
    );
  }

  return (
    <div className="mc-chart" ref={containerRef} onMouseLeave={() => setHover(null)}>
      {width > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`${metricMeta[metric].label}: ${formatMetric(metric, total)} no período`}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={y(tick)}
                y2={y(tick)}
                className={tick === 0 ? "mc-chart-baseline" : "mc-chart-grid"}
              />
              <text x={PAD.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="mc-chart-axis">
                {formatCount(tick)}
              </text>
            </g>
          ))}

          {points.map((point, index) => {
            const value = point.values[metric];
            const x = PAD.left + index * band;
            const barX = x + (band - barW) / 2;
            const height = plotH * (value / top);
            const dim = hover !== null && hover !== index;
            return (
              <g key={point.bucket}>
                {hover === index && <rect x={x} y={PAD.top} width={band} height={plotH} className="mc-chart-band" />}
                {value > 0 && (
                  <path d={barPath(barX, y(value), barW, height)} className={`mc-chart-bar ${dim ? "is-dim" : ""}`} />
                )}
                {index % labelEvery === 0 && (
                  <text x={x + band / 2} y={HEIGHT - 8} textAnchor="middle" className="mc-chart-axis">
                    {bucketAxisLabel(point.bucket, bucket)}
                  </text>
                )}
                {/* Área de toque maior do que a barra */}
                <rect
                  x={x}
                  y={PAD.top}
                  width={band}
                  height={plotH}
                  fill="transparent"
                  onMouseEnter={() => setHover(index)}
                  onClick={() => setHover(index)}
                />
              </g>
            );
          })}
        </svg>
      )}

      {hovered && hover !== null && (
        <div
          className="mc-chart-tooltip"
          style={{
            left: Math.min(Math.max(PAD.left + hover * band + band / 2, 70), width - 70),
            top: Math.max(y(hovered.values[metric]) - 10, 8),
          }}
          role="status"
        >
          <span className="mc-chart-tooltip-label">{bucketTooltipLabel(hovered.bucket, bucket)}</span>
          <strong>{formatMetric(metric, hovered.values[metric])}</strong>
        </div>
      )}

      <table className="mc-visually-hidden">
        <caption>{metricMeta[metric].label} por período</caption>
        <thead>
          <tr>
            <th scope="col">Período</th>
            <th scope="col">{metricMeta[metric].label}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.bucket}>
              <td>{bucketTooltipLabel(point.bucket, bucket)}</td>
              <td>{point.values[metric]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
