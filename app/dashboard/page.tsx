"use client";

import { useState, useEffect } from "react";
import { getFleetSummary } from "@/lib/api/assets";
import { getAnomalies } from "@/lib/api/anomalies";
import { getRecommendations } from "@/lib/api/recommendations";
import { applyRecommendation } from "@/lib/api/recommendations";
import { resolveAnomaly } from "@/lib/api/anomalies";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { AnomalyCard } from "@/components/dashboard/AnomalyCard";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import { FleetCompositionChart } from "@/components/dashboard/FleetCompositionChart";
import { UtilizationTrendChart } from "@/components/dashboard/UtilizationTrendChart";
import type { Anomaly, Recommendation } from "@/types";
import { formatCurrency, formatPct } from "@/lib/utils/formatting";
import { AlertTriangle, Lightbulb, Package, TrendingUp, RefreshCw, ExternalLink, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── SECTION HEADER ─────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  badge,
  badgeVariant = "critical",
  href,
  className,
  id,
}: {
  icon: React.ElementType;
  title: string;
  badge?: number;
  badgeVariant?: "critical" | "warning" | "info";
  href?: string;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={cn("flex items-center justify-between mb-3", className)}>
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-[var(--text-tertiary)]" />
        <h2 className="text-label text-[11px] text-[var(--text-secondary)]">
          {title}
        </h2>
        {badge != null && (
          <span
            className={cn(
              "text-label text-[9px] px-1.5 py-0.5 rounded-sm border",
              badgeVariant === "critical"
                ? "bg-[var(--status-critical-bg)] text-[var(--status-critical-text)] border-[var(--status-critical-border)]"
                : badgeVariant === "warning"
                ? "bg-[var(--status-warning-bg)] text-[var(--status-warning-text)] border-[var(--status-warning-border)]"
                : "bg-[var(--status-info-bg)] text-[var(--status-info-text)] border-[var(--status-info-border)]"
            )}
          >
            {badge}
          </span>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-[10px] text-[var(--text-tertiary)] hover:text-[var(--text-accent)] transition-colors"
        >
          View all
          <ExternalLink size={9} />
        </Link>
      )}
    </div>
  );
}

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [fleet, setFleet] = useState<Awaited<ReturnType<typeof getFleetSummary>> | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [activeRec, setActiveRec] = useState<string | null>(null);

  async function loadData() {
    const [f, a, r] = await Promise.all([
      getFleetSummary(),
      getAnomalies(),
      getRecommendations(),
    ]);
    setFleet(f);
    setAnomalies(a);
    setRecommendations(r);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleApply(id: string) {
    setApplying(id);
    const ok = await applyRecommendation(id);
    if (ok) {
      toast.success("Recommendation applied successfully", {
        description: "Asset reassignment has been initiated.",
      });
      // Find the linked anomaly and resolve it too
      const rec = recommendations.find((r) => r.id === id);
      if (rec?.linkedAnomalyId) {
        await resolveAnomaly(rec.linkedAnomalyId);
      }
      await loadData();
    } else {
      toast.error("Failed to apply recommendation");
    }
    setApplying(null);
    setActiveRec(null);
  }

  async function handleDismiss(id: string) {
    await loadData();
    toast("Recommendation dismissed");
  }

  function handleViewRecommendation(recommendationId: string) {
    setActiveRec(recommendationId);
    // Scroll to recommendations section
    document.getElementById("recommendations-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  // Hero items: highest severity
  const heroAnomaly = anomalies[0];
  const heroRec = activeRec
    ? recommendations.find((r) => r.id === activeRec)
    : recommendations[0];

  return (
    <div className="space-y-6">
      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Zap size={18} className="text-[var(--brand-primary)]" />
            Control Tower
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Real-time fleet intelligence · {fleet?.total ?? "—"} assets across all sites
          </p>
        </div>
        <button
          onClick={loadData}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs",
            "border border-[var(--border-default)]",
            "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            "hover:bg-[var(--interactive-hover)] transition-colors"
          )}
          disabled={loading}
          aria-label="Refresh dashboard data"
        >
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── KPI Strip ────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-md" />
          ))}
        </div>
      ) : fleet ? (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
          role="region"
          aria-label="Fleet KPI metrics"
        >
          <KpiCard
            label="TOTAL ASSETS"
            value={fleet.total}
            sublabel="Active fleet"
            variant="default"
          />
          <KpiCard
            label="ACTIVE"
            value={fleet.active}
            unit="assets"
            trend="neutral"
            trendLabel={`${formatPct(fleet.active / fleet.total * 100)} of fleet`}
            variant="positive"
          />
          <KpiCard
            label="IDLE"
            value={fleet.idle}
            unit="assets"
            variant={fleet.idle > 4 ? "warning" : "default"}
          />
          <KpiCard
            label="OVERDUE"
            value={fleet.overdue}
            unit="assets"
            trend="up"
            trendLabel="action required"
            variant={fleet.overdue > 0 ? "critical" : "default"}
          />
          <KpiCard
            label="AVG UTILIZATION"
            value={fleet.avgUtilization}
            unit="%"
            trend={fleet.avgUtilization < 50 ? "up" : "down"}
            trendLabel={fleet.avgUtilization < 50 ? "below target" : "on target"}
            variant={fleet.avgUtilization < 50 ? "warning" : "default"}
          />
          <KpiCard
            label="COST AT RISK"
            value={formatCurrency(fleet.potentialCostAtRisk)}
            trend="up"
            trendLabel="action required"
            variant={fleet.potentialCostAtRisk > 0 ? "critical" : "positive"}
          />
        </div>
      ) : null}

      {/* ── Main Grid ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left column: Anomalies + Recommendations */}
        <div className="xl:col-span-7 space-y-6">

          {/* ── ANOMALIES PANEL ─────────────────────────── */}
          <section aria-labelledby="anomalies-heading">
            <SectionHeader
              id="anomalies-heading"
              icon={AlertTriangle}
              title="ACTIVE ANOMALIES"
              badge={anomalies.length}
              badgeVariant="critical"
              href="/anomalies"
            />
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-28 rounded-md" />
                ))}
              </div>
            ) : anomalies.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-10 rounded-md border border-dashed border-[var(--border-default)]"
              >
                <AlertTriangle size={24} className="text-[var(--text-disabled)] mb-2" />
                <p className="text-sm text-[var(--text-tertiary)]">No active anomalies</p>
                <p className="text-xs text-[var(--text-disabled)] mt-0.5">Fleet operating normally</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Hero anomaly: full detail */}
                {heroAnomaly && (
                  <AnomalyCard
                    key={heroAnomaly.id}
                    anomaly={heroAnomaly}
                    isHero
                    onViewRecommendation={handleViewRecommendation}
                  />
                )}
                {/* Rest: compact */}
                {anomalies.slice(1, 4).map((a) => (
                  <AnomalyCard
                    key={a.id}
                    anomaly={a}
                    onViewRecommendation={handleViewRecommendation}
                  />
                ))}
                {anomalies.length > 4 && (
                  <Link
                    href="/anomalies"
                    className={cn(
                      "flex items-center justify-center gap-1.5 py-2 rounded-md text-xs",
                      "border border-dashed border-[var(--border-default)]",
                      "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:border-[var(--border-strong)]",
                      "transition-colors"
                    )}
                  >
                    +{anomalies.length - 4} more anomalies
                    <ExternalLink size={10} />
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* ── RECOMMENDATIONS PANEL ───────────────────── */}
          <section id="recommendations-section" aria-labelledby="recs-heading">
            <SectionHeader
              id="recs-heading"
              icon={Lightbulb}
              title="AI RECOMMENDATIONS"
              badge={recommendations.length}
              badgeVariant="warning"
              href="/recommendations"
            />
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="skeleton h-40 rounded-md" />
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 rounded-md border border-dashed border-[var(--border-default)]">
                <Lightbulb size={24} className="text-[var(--text-disabled)] mb-2" />
                <p className="text-sm text-[var(--text-tertiary)]">No pending recommendations</p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Hero recommendation: full detail */}
                {heroRec && (
                  <RecommendationCard
                    key={heroRec.id}
                    rec={heroRec}
                    isHero
                    isApplying={applying === heroRec.id}
                    onApply={handleApply}
                    onDismiss={handleDismiss}
                  />
                )}
                {/* Remaining recs: compact */}
                {recommendations
                  .filter((r) => r.id !== heroRec?.id)
                  .slice(0, 3)
                  .map((r) => (
                    <RecommendationCard
                      key={r.id}
                      rec={r}
                      isApplying={applying === r.id}
                      onApply={handleApply}
                      onDismiss={handleDismiss}
                    />
                  ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column: Charts + Asset List */}
        <div className="xl:col-span-5 space-y-6">
          {/* ── FLEET COMPOSITION ───────────────────────── */}
          <section aria-labelledby="fleet-composition-heading">
            <SectionHeader
              id="fleet-composition-heading"
              icon={Package}
              title="FLEET COMPOSITION"
              href="/assets"
            />
            <div
              className="rounded-md border border-[var(--border-default)] p-4"
              style={{ background: "var(--surface-secondary)" }}
            >
              {loading ? (
                <div className="skeleton h-48 rounded" />
              ) : fleet ? (
                <FleetCompositionChart fleet={fleet} />
              ) : null}
            </div>
          </section>

          {/* ── UTILIZATION TREND ───────────────────────── */}
          <section aria-labelledby="util-trend-heading">
            <SectionHeader
              id="util-trend-heading"
              icon={TrendingUp}
              title="UTILIZATION TREND — LAST 14 DAYS"
            />
            <div
              className="rounded-md border border-[var(--border-default)] p-4"
              style={{ background: "var(--surface-secondary)" }}
            >
              {loading ? (
                <div className="skeleton h-40 rounded" />
              ) : (
                <UtilizationTrendChart />
              )}
            </div>
          </section>

          {/* ── CRITICAL ASSETS TABLE ───────────────────── */}
          <section aria-labelledby="critical-assets-heading">
            <SectionHeader
              id="critical-assets-heading"
              icon={AlertTriangle}
              title="CRITICAL ASSETS"
              href="/assets"
            />
            <div
              className="rounded-md border border-[var(--border-default)] overflow-hidden"
              style={{ background: "var(--surface-secondary)" }}
            >
              <CriticalAssetsTable />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── CRITICAL ASSETS TABLE ───────────────────────────────────────────────────

function CriticalAssetsTable() {
  const criticalAssets = [
    { id: "EQX1007", type: "Excavator",        status: "UNASSIGNED", util: 0,   risk: "CRITICAL" },
    { id: "EQX1002", type: "Crane Manipulator", status: "OVERDUE",   util: 0,   risk: "CRITICAL" },
    { id: "EQX1009", type: "Roller",            status: "OVERDUE",   util: 48,  risk: "HIGH" },
    { id: "EQX1012", type: "Tanker",            status: "OVERDUE",   util: 50,  risk: "HIGH" },
    { id: "EQX1001", type: "Excavator",         status: "IDLE",      util: 13,  risk: "HIGH" },
  ];

  const statusColors: Record<string, { text: string; bg: string; border: string }> = {
    UNASSIGNED: { text: "var(--status-critical-text)", bg: "var(--status-critical-bg)", border: "var(--status-critical-border)" },
    OVERDUE:    { text: "var(--status-critical-text)", bg: "var(--status-critical-bg)", border: "var(--status-critical-border)" },
    IDLE:       { text: "var(--status-warning-text)",  bg: "var(--status-warning-bg)",  border: "var(--status-warning-border)"  },
  };

  const riskColors: Record<string, string> = {
    CRITICAL: "var(--status-critical-text)",
    HIGH:     "var(--status-critical-text)",
    MEDIUM:   "var(--status-warning-text)",
    LOW:      "var(--status-active-text)",
  };

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>ASSET</th>
          <th>TYPE</th>
          <th>STATUS</th>
          <th>UTIL</th>
          <th>RISK</th>
        </tr>
      </thead>
      <tbody>
        {criticalAssets.map((a) => {
          const sc = statusColors[a.status] ?? {};
          return (
            <tr key={a.id}>
              <td>
                <Link
                  href={`/assets/${a.id}`}
                  className="font-mono text-xs text-[var(--text-accent)] hover:underline"
                >
                  {a.id}
                </Link>
              </td>
              <td className="text-xs text-[var(--text-secondary)]">{a.type}</td>
              <td>
                <span
                  className="text-label text-[9px] px-1.5 py-0.5 rounded-sm border"
                  style={{
                    color: sc.text,
                    background: sc.bg,
                    borderColor: sc.border,
                  }}
                >
                  {a.status}
                </span>
              </td>
              <td>
                <span
                  className="text-mono text-xs font-semibold"
                  style={{
                    color: a.util < 20
                      ? "var(--status-critical-text)"
                      : a.util < 50
                      ? "var(--status-warning-text)"
                      : "var(--text-primary)",
                  }}
                >
                  {a.util}%
                </span>
              </td>
              <td>
                <span
                  className="text-label text-[9px] font-bold"
                  style={{ color: riskColors[a.risk] }}
                >
                  {a.risk}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
