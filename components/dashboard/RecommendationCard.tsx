"use client";

import { cn } from "@/lib/utils";
import type { Recommendation } from "@/types";
import { CheckCircle2, X, ArrowRight, TrendingDown, TrendingUp, Lightbulb, Zap } from "lucide-react";
import { formatCurrency, formatRelative } from "@/lib/utils/formatting";
import Link from "next/link";

interface RecommendationCardProps {
  rec: Recommendation;
  onApply?: (id: string) => void;
  onDismiss?: (id: string) => void;
  isHero?: boolean;
  isApplying?: boolean;
}

export function RecommendationCard({
  rec,
  onApply,
  onDismiss,
  isHero,
  isApplying,
}: RecommendationCardProps) {
  const typeLabels: Record<string, string> = {
    REASSIGN:     "REASSIGN",
    RETURN:       "RETURN",
    EXTEND:       "EXTEND",
    PRE_POSITION: "PRE-POSITION",
    INVESTIGATE:  "INVESTIGATE",
    MONITOR:      "MONITOR",
  };

  const typeColors: Record<string, { bg: string; text: string; border: string }> = {
    REASSIGN:     { bg: "var(--brand-muted)",        text: "var(--brand-primary)",             border: "var(--brand-muted-border)" },
    RETURN:       { bg: "var(--status-warning-bg)",  text: "var(--status-warning-text)",        border: "var(--status-warning-border)" },
    EXTEND:       { bg: "var(--status-info-bg)",     text: "var(--status-info-text)",           border: "var(--status-info-border)" },
    PRE_POSITION: { bg: "var(--status-info-bg)",     text: "var(--status-info-text)",           border: "var(--status-info-border)" },
    INVESTIGATE:  { bg: "var(--status-critical-bg)", text: "var(--status-critical-text)",       border: "var(--status-critical-border)" },
    MONITOR:      { bg: "var(--status-neutral-bg)",  text: "var(--status-neutral-text)",        border: "var(--status-neutral-border)" },
  };

  const typeStyle = typeColors[rec.type] ?? typeColors.MONITOR;

  return (
    <article
      className={cn(
        "rounded-md border overflow-hidden",
        isHero ? "border-[var(--brand-muted-border)]" : "border-[var(--border-default)]"
      )}
      style={{
        background: isHero ? "linear-gradient(135deg, var(--surface-secondary) 0%, rgba(245,184,0,0.03) 100%)" : "var(--surface-secondary)",
        borderLeft: isHero ? "3px solid var(--brand-primary)" : undefined,
      }}
      aria-label={`AI recommendation: ${rec.title}`}
    >
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div
          className="flex items-center justify-center w-7 h-7 rounded shrink-0 mt-0.5"
          style={{ background: "var(--brand-muted)", border: "1px solid var(--brand-muted-border)" }}
        >
          <Lightbulb size={13} color="var(--brand-primary)" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-label text-[9px] px-1.5 py-0.5 rounded-sm border"
                style={{
                  background: typeStyle.bg,
                  color: typeStyle.text,
                  borderColor: typeStyle.border,
                }}
              >
                {typeLabels[rec.type]}
              </span>
              <Link
                href={`/assets/${rec.assetId}`}
                className="font-mono text-xs text-[var(--text-accent)] hover:underline"
              >
                {rec.assetId}
              </Link>
            </div>
            <span className="text-[10px] text-[var(--text-disabled)] shrink-0">
              {formatRelative(rec.generatedAt)}
            </span>
          </div>

          <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
            {rec.title}
          </h3>

          {isHero && (
            <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
              {rec.description}
            </p>
          )}
        </div>
      </div>

      {/* Confidence + Cost */}
      <div
        className="flex items-center gap-4 px-4 pb-3"
      >
        <div className="flex items-center gap-2">
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ width: 60, background: "var(--border-default)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${rec.confidencePct}%`,
                background: rec.confidencePct >= 85 ? "var(--status-active-dot)" : "var(--status-warning-dot)",
              }}
            />
          </div>
          <span className="text-xs text-[var(--text-tertiary)]">
            {rec.confidencePct}% confidence
          </span>
        </div>
        {rec.estimatedCostAvoidedUsd != null && (
          <div className="flex items-center gap-1">
            <TrendingDown size={11} className="text-[var(--status-active-text)]" />
            <span
              className="text-xs font-semibold text-[var(--status-active-text)]"
            >
              {formatCurrency(rec.estimatedCostAvoidedUsd)} avoided
            </span>
          </div>
        )}
      </div>

      {/* Impact table (hero only) */}
      {isHero && rec.expectedImpacts.length > 0 && (
        <div
          className="mx-4 mb-3 rounded overflow-hidden border"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--surface-sidebar)" }}>
                <th className="text-label text-[9px] text-[var(--text-tertiary)] text-left px-2.5 py-1.5">
                  METRIC
                </th>
                <th className="text-label text-[9px] text-[var(--text-tertiary)] text-left px-2.5 py-1.5">
                  BEFORE
                </th>
                <th className="text-label text-[9px] text-[var(--text-tertiary)] text-left px-2.5 py-1.5">
                  AFTER
                </th>
                <th className="text-label text-[9px] text-[var(--text-tertiary)] text-left px-2.5 py-1.5">
                  Δ
                </th>
              </tr>
            </thead>
            <tbody>
              {rec.expectedImpacts.map((impact, i) => (
                <tr
                  key={i}
                  style={{ borderTop: i > 0 ? "1px solid var(--border-subtle)" : undefined }}
                >
                  <td className="px-2.5 py-1.5 text-[var(--text-secondary)]">
                    {impact.metric}
                  </td>
                  <td className="px-2.5 py-1.5 text-[var(--text-tertiary)] font-mono">
                    {impact.before}
                  </td>
                  <td className="px-2.5 py-1.5 text-[var(--text-primary)] font-mono">
                    {impact.after}
                  </td>
                  <td className="px-2.5 py-1.5">
                    <span
                      className={cn(
                        "flex items-center gap-0.5 font-semibold font-mono text-[10px]",
                        impact.positive
                          ? "text-[var(--status-active-text)]"
                          : "text-[var(--status-critical-text)]"
                      )}
                    >
                      {impact.positive
                        ? <TrendingDown size={9} />
                        : <TrendingUp size={9} />
                      }
                      {impact.delta}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Signals (hero only) */}
      {isHero && rec.signals.length > 0 && (
        <div className="px-4 pb-3">
          <p className="text-label text-[9px] text-[var(--text-disabled)] mb-1.5">
            SUPPORTING EVIDENCE
          </p>
          <ul className="space-y-1">
            {rec.signals.map((signal, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs text-[var(--text-secondary)]"
              >
                <ArrowRight
                  size={10}
                  className="text-[var(--brand-primary)] mt-0.5 shrink-0"
                />
                {signal}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div
        className="flex items-center justify-between gap-2 px-4 py-3 border-t"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <button
          onClick={() => onDismiss?.(rec.id)}
          className={cn(
            "flex items-center gap-1 text-xs text-[var(--text-tertiary)]",
            "hover:text-[var(--status-critical-text)] transition-colors"
          )}
          aria-label="Dismiss recommendation"
        >
          <X size={11} />
          Dismiss
        </button>

        <button
          onClick={() => onApply?.(rec.id)}
          disabled={isApplying}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold",
            "bg-[var(--brand-primary)] text-[var(--text-inverse)]",
            "hover:bg-[var(--brand-hover)] transition-colors",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-primary)]",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
          aria-label={`Apply recommendation: ${rec.title}`}
        >
          {isApplying ? (
            <>
              <span className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
              Applying…
            </>
          ) : (
            <>
              <Zap size={11} />
              Apply Now
            </>
          )}
        </button>
      </div>
    </article>
  );
}
