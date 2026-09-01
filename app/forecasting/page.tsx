"use client";

import { useEffect, useState } from "react";
import { getForecasts } from "@/lib/api/forecasts";
import { DemandForecastChart } from "@/components/forecasting/DemandForecastChart";
import type { DemandForecast } from "@/types";
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ForecastingPage() {
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [selectedId, setSelectedId] = useState<string>("FCST-001");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getForecasts().then((data) => {
      setForecasts(data);
      setLoading(false);
    });
  }, []);

  const activeForecast = forecasts.find((f) => f.id === selectedId) ?? forecasts[0];

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <TrendingUp size={18} className="text-[var(--brand-primary)]" />
            Demand Forecasting & Capacity Planning
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Predictive machine-learning projections for heavy equipment utilization across project sites
          </p>
        </div>

        <Link
          href="/recommendations"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[var(--brand-primary)] text-[var(--text-inverse)] hover:bg-[var(--brand-hover)] transition-colors self-start sm:self-auto"
        >
          <Zap size={13} />
          View Linked AI Recommendations
        </Link>
      </div>

      {/* ── Main Layout ─────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-4">
          <div className="skeleton h-20 w-full rounded-md" />
          <div className="skeleton h-80 w-full rounded-md" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column: Forecast Scenarios List */}
          <div className="xl:col-span-4 space-y-3">
            <span className="text-label text-[10px] text-[var(--text-tertiary)]">
              ACTIVE SITE DEMAND SCENARIOS
            </span>

            <div className="space-y-2">
              {forecasts.map((f) => {
                const isSelected = f.id === selectedId;
                const hasShortage = f.expectedShortage > 0;

                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedId(f.id)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-md border transition-all flex flex-col gap-2",
                      isSelected
                        ? "border-[var(--brand-primary)] bg-[rgba(245,184,0,0.05)] shadow-md"
                        : "border-[var(--border-default)] bg-[var(--surface-secondary)] hover:border-[var(--border-strong)]"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <Building2 size={12} className="text-[var(--text-tertiary)]" />
                          <span className="text-xs font-bold text-[var(--text-primary)]">
                            {f.siteName}
                          </span>
                        </div>
                        <span className="text-[11px] text-[var(--text-secondary)]">
                          {f.equipmentTypeName}
                        </span>
                      </div>

                      {hasShortage ? (
                        <span className="text-label text-[9px] px-1.5 py-0.5 rounded bg-[var(--status-critical-bg)] text-[var(--status-critical-text)] border border-[var(--status-critical-border)]">
                          SHORTAGE +{f.expectedShortage}
                        </span>
                      ) : (
                        <span className="text-label text-[9px] px-1.5 py-0.5 rounded bg-[var(--status-active-bg)] text-[var(--status-active-text)] border border-[var(--status-active-border)]">
                          BALANCED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[var(--border-subtle)]">
                      <span className="text-[var(--text-tertiary)]">
                        Current: <strong className="text-[var(--text-primary)] font-mono">{f.currentDemand}</strong> → Forecast: <strong className="text-[var(--brand-primary)] font-mono">{f.forecastedDemand}</strong>
                      </span>
                      <span className="text-[10px] text-[var(--status-active-text)] font-mono font-semibold">
                        {f.confidencePct}% Conf.
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Deep-dive Chart & AI Explainability */}
          {activeForecast && (
            <div className="xl:col-span-8 space-y-6">
              {/* Chart Card */}
              <div
                className="p-5 rounded-md border border-[var(--border-default)] space-y-4"
                style={{ background: "var(--surface-secondary)" }}
              >
                <DemandForecastChart
                  dataPoints={activeForecast.dataPoints}
                  equipmentTypeName={activeForecast.equipmentTypeName}
                  siteName={activeForecast.siteName}
                />
              </div>

              {/* Underlying Signals & Justification Box */}
              <div
                className="p-5 rounded-md border border-[var(--border-default)] space-y-4"
                style={{ background: "var(--surface-secondary)" }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-[var(--brand-primary)]" />
                  <h2 className="text-label text-[11px] text-[var(--text-secondary)]">
                    PREDICTIVE SIGNALS & CAPACITY RATIONALE
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-label text-[9px] text-[var(--text-disabled)]">
                      DETECTED DRIVERS
                    </span>
                    <ul className="space-y-1.5 text-xs">
                      {activeForecast.signals.map((signal, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--text-secondary)]">
                          <ArrowRight size={11} className="text-[var(--brand-primary)] shrink-0 mt-0.5" />
                          <span>{signal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-primary)] flex flex-col justify-between gap-3 text-xs">
                    <div>
                      <span className="text-label text-[9px] text-[var(--brand-primary)]">
                        RECOMMENDED ACTION BINDING
                      </span>
                      <p className="text-xs text-[var(--text-primary)] font-medium mt-1">
                        Pre-position or reassign idle Excavator EQX1007 to S003 immediately to satisfy next week's shortage.
                      </p>
                    </div>

                    <Link
                      href="/recommendations"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-primary)] hover:underline"
                    >
                      Inspect REC-001 Action
                      <ArrowRight size={11} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
