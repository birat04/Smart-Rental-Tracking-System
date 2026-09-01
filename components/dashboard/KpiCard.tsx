// ─── KPI STAT CARD ─────────────────────────────────────────────────────────
// Used in the Control Tower header row
"use client";

import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  trendLabel?: string;
  variant?: "default" | "critical" | "warning" | "positive" | "info";
  sublabel?: string;
  className?: string;
}

export function KpiCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  variant = "default",
  sublabel,
  className,
}: KpiCardProps) {
  const variantStyles = {
    default: {
      card: "border-[var(--border-default)]",
      value: "text-[var(--text-primary)]",
      accent: "",
    },
    critical: {
      card: "border-[var(--status-critical-border)] bg-[var(--status-critical-bg)]",
      value: "text-[var(--status-critical-text)]",
      accent: "border-l-4 border-l-[var(--status-critical-dot)]",
    },
    warning: {
      card: "border-[var(--status-warning-border)] bg-[var(--status-warning-bg)]",
      value: "text-[var(--status-warning-text)]",
      accent: "border-l-4 border-l-[var(--status-warning-dot)]",
    },
    positive: {
      card: "border-[var(--status-active-border)] bg-[var(--status-active-bg)]",
      value: "text-[var(--status-active-text)]",
      accent: "border-l-4 border-l-[var(--status-active-dot)]",
    },
    info: {
      card: "border-[var(--status-info-border)] bg-[var(--status-info-bg)]",
      value: "text-[var(--status-info-text)]",
      accent: "border-l-4 border-l-[var(--status-info-dot)]",
    },
  };

  const styles = variantStyles[variant];

  const trendIcons = {
    up:      <TrendingUp size={11} />,
    down:    <TrendingDown size={11} />,
    neutral: <Minus size={11} />,
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-4 rounded-md border",
        "bg-[var(--surface-secondary)]",
        styles.card,
        styles.accent,
        className
      )}
    >
      <p className="text-label text-[10px] text-[var(--text-tertiary)]">
        {label}
      </p>

      <div className="flex items-baseline gap-1">
        <span className={cn("text-kpi leading-none", styles.value)}>
          {value}
        </span>
        {unit && (
          <span className="text-sm text-[var(--text-tertiary)] font-normal">
            {unit}
          </span>
        )}
      </div>

      {(trendLabel || sublabel) && (
        <div className="flex items-center gap-1">
          {trend && (
            <span
              className={cn(
                "flex items-center",
                trend === "down" ? "text-[var(--status-active-text)]" :
                trend === "up"   ? "text-[var(--status-critical-text)]" :
                                   "text-[var(--text-tertiary)]"
              )}
            >
              {trendIcons[trend]}
            </span>
          )}
          <span
            className="text-[var(--text-tertiary)]"
            style={{ fontSize: "0.6875rem" }}
          >
            {trendLabel ?? sublabel}
          </span>
        </div>
      )}
    </div>
  );
}
