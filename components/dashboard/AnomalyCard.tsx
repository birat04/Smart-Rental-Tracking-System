"use client";

import { cn } from "@/lib/utils";
import { getSeverityConfig } from "@/lib/utils/status";
import type { Anomaly } from "@/types";
import { AlertTriangle, Lightbulb, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatRelative } from "@/lib/utils/formatting";

interface AnomalyCardProps {
  anomaly: Anomaly;
  onViewRecommendation?: (recommendationId: string) => void;
  isHero?: boolean;
}

export function AnomalyCard({ anomaly, onViewRecommendation, isHero }: AnomalyCardProps) {
  const config = getSeverityConfig(anomaly.severity);

  const signalSeverityColor: Record<string, string> = {
    neutral:  "text-[var(--text-tertiary)]",
    warning:  "text-[var(--status-warning-text)]",
    critical: "text-[var(--status-critical-text)]",
  };

  return (
    <article
      className={cn(
        "rounded-md border overflow-hidden",
        isHero && anomaly.severity === "CRITICAL"
          ? "border-[var(--status-critical-border)] shadow-lg"
          : "border-[var(--border-default)]",
      )}
      style={{
        background: isHero && anomaly.severity === "CRITICAL"
          ? "var(--status-critical-bg)"
          : "var(--surface-secondary)",
        borderLeft: `3px solid ${
          anomaly.severity === "CRITICAL" ? "var(--status-critical-dot)"
          : anomaly.severity === "HIGH"   ? "var(--status-critical-dot)"
          : anomaly.severity === "WARNING" ? "var(--status-warning-dot)"
          : "var(--status-info-dot)"
        }`,
      }}
      aria-label={`${anomaly.severity} anomaly: ${anomaly.title}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div
          className="flex items-center justify-center w-7 h-7 rounded shrink-0 mt-0.5"
          style={{ background: config.bgColor as string }}
        >
          <AlertTriangle size={13} className={config.textColor as string} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "text-label text-[9px] px-1.5 py-0.5 rounded-sm border",
                  config.bgColor, config.textColor, config.borderColor
                )}
              >
                {anomaly.severity}
              </span>
              <Link
                href={`/assets/${anomaly.assetId}`}
                className="font-mono text-xs text-[var(--text-accent)] hover:underline"
              >
                {anomaly.assetId}
              </Link>
              <span className="text-xs text-[var(--text-tertiary)]">
                {anomaly.assetName}
              </span>
            </div>
            <time
              className="text-[10px] text-[var(--text-disabled)] shrink-0"
              dateTime={anomaly.detectedAt}
            >
              {formatRelative(anomaly.detectedAt)}
            </time>
          </div>

          <h3
            className={cn(
              "text-sm font-semibold leading-tight",
              anomaly.severity === "CRITICAL" || anomaly.severity === "HIGH"
                ? "text-[var(--status-critical-text)]"
                : "text-[var(--text-primary)]"
            )}
          >
            {anomaly.title}
          </h3>

          {isHero && (
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              {anomaly.description}
            </p>
          )}
        </div>
      </div>

      {/* Signal grid */}
      {isHero && anomaly.signals.length > 0 && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-2 px-4 pb-3"
          aria-label="Anomaly signals"
        >
          {anomaly.signals.slice(0, 6).map((signal, i) => (
            <div
              key={i}
              className="flex flex-col gap-0.5 p-2 rounded"
              style={{
                background: "var(--surface-tertiary)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <span className="text-label text-[9px] text-[var(--text-disabled)]">
                {signal.label}
              </span>
              <span
                className={cn(
                  "text-mono text-xs font-semibold",
                  signalSeverityColor[signal.severity] ?? "text-[var(--text-primary)]"
                )}
              >
                {signal.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        className="flex items-center justify-between gap-2 px-4 py-2.5 border-t"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <Link
          href={`/assets/${anomaly.assetId}`}
          className="flex items-center gap-1 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        >
          View asset
          <ExternalLink size={10} />
        </Link>

        {anomaly.recommendationId && (
          <button
            onClick={() => onViewRecommendation?.(anomaly.recommendationId!)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold",
              "transition-colors",
              anomaly.severity === "CRITICAL"
                ? "bg-[var(--brand-primary)] text-[var(--text-inverse)] hover:bg-[var(--brand-hover)]"
                : "bg-[var(--brand-muted)] text-[var(--text-accent)] border border-[var(--brand-muted-border)] hover:bg-[var(--brand-primary)] hover:text-[var(--text-inverse)]"
            )}
          >
            <Lightbulb size={11} />
            View AI Recommendation
          </button>
        )}
      </div>
    </article>
  );
}
