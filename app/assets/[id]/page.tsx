"use client";

import { useEffect, useState, use } from "react";
import { getAsset } from "@/lib/api/assets";
import { getAnomaliesForAsset } from "@/lib/api/anomalies";
import { getRecommendationsForAsset, applyRecommendation } from "@/lib/api/recommendations";
import { AssetStatusBadge } from "@/components/assets/AssetStatusBadge";
import { RiskBadge } from "@/components/assets/RiskBadge";
import { AssetTelemetryChart } from "@/components/assets/AssetTelemetryChart";
import { AnomalyCard } from "@/components/dashboard/AnomalyCard";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import type { Asset, Anomaly, Recommendation } from "@/types";
import {
  formatDate,
  formatHours,
  formatPct,
  getDaysOverdue,
  getDaysRemaining,
} from "@/lib/utils/formatting";
import {
  Package,
  MapPin,
  User,
  Calendar,
  Fuel,
  Gauge,
  Clock,
  AlertTriangle,
  ArrowLeft,
  Zap,
  CheckCircle2,
  FileText,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface AssetDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AssetDetailPage({ params }: AssetDetailPageProps) {
  const { id } = use(params);
  const [asset, setAsset] = useState<Asset | null>(null);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const [a, anom, recs] = await Promise.all([
      getAsset(id),
      getAnomaliesForAsset(id),
      getRecommendationsForAsset(id),
    ]);
    setAsset(a);
    setAnomalies(anom);
    setRecommendations(recs);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, [id]);

  async function handleApply(recId: string) {
    setApplying(recId);
    const ok = await applyRecommendation(recId);
    if (ok) {
      toast.success("Recommendation applied", {
        description: `Asset ${id} reassignment action executed successfully.`,
      });
      await loadData();
    } else {
      toast.error("Failed to apply recommendation");
    }
    setApplying(null);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-md" />
          ))}
        </div>
        <div className="skeleton h-72 w-full rounded-md" />
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package size={48} className="text-[var(--text-disabled)] mb-4" />
        <h1 className="text-base font-bold text-[var(--text-primary)]">Asset Not Found</h1>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">
          No equipment matches identifier <span className="font-mono">{id}</span>.
        </p>
        <Link
          href="/assets"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-[var(--brand-primary)] hover:underline"
        >
          <ArrowLeft size={13} />
          Return to Asset Fleet
        </Link>
      </div>
    );
  }

  const isHero = asset.id === "EQX1007";
  const daysOverdue = getDaysOverdue(asset.expectedReturnDate);
  const daysRemaining = getDaysRemaining(asset.expectedReturnDate);

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb & Navigation ─────────────────────────── */}
      <div className="flex items-center justify-between">
        <Link
          href="/assets"
          className="inline-flex items-center gap-1.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
        >
          <ArrowLeft size={13} />
          Back to Asset Directory
        </Link>

        <div className="flex items-center gap-2">
          {isHero && (
            <span className="text-label text-[10px] px-2 py-0.5 rounded bg-[var(--status-critical-bg)] text-[var(--status-critical-text)] border border-[var(--status-critical-border)]">
              HERO DEMONSTRATION ASSET
            </span>
          )}
          <span className="text-[10px] font-mono text-[var(--text-disabled)]">
            ID: {asset.id}
          </span>
        </div>
      </div>

      {/* ── Header Card ─────────────────────────────────────── */}
      <div
        className="p-5 rounded-md border border-[var(--border-default)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        style={{ background: "var(--surface-secondary)" }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-md flex items-center justify-center font-mono font-bold text-base shrink-0"
            style={{
              background: "var(--brand-muted)",
              border: "1px solid var(--brand-muted-border)",
              color: "var(--brand-primary)",
            }}
          >
            {asset.id.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[var(--text-primary)] font-mono">
                {asset.id}
              </h1>
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                · {asset.equipmentTypeName}
              </span>
              <AssetStatusBadge status={asset.status} pulse={isHero} />
              <RiskBadge risk={asset.riskLevel} />
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-[var(--text-disabled)]" />
                {asset.siteId ? `${asset.siteId} (${asset.siteName})` : "Unassigned Site"}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <User size={12} className="text-[var(--text-disabled)]" />
                {asset.operatorName ?? "No Assigned Operator"}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Link
            href={`/rentals`}
            className="px-3 py-1.5 rounded-md border border-[var(--border-default)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--interactive-hover)] transition-colors"
          >
            View Rental Contract
          </Link>
          {recommendations.length > 0 && (
            <button
              onClick={() => handleApply(recommendations[0].id)}
              disabled={applying === recommendations[0].id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--brand-primary)] text-[var(--text-inverse)] hover:bg-[var(--brand-hover)] transition-colors"
            >
              <Zap size={13} />
              Apply Recommendation
            </button>
          )}
        </div>
      </div>

      {/* ── Key Metrics Strip ────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          className="p-3.5 rounded-md border border-[var(--border-default)] flex flex-col gap-1"
          style={{ background: "var(--surface-secondary)" }}
        >
          <span className="text-label text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
            <Gauge size={12} />
            UTILIZATION
          </span>
          <span
            className="text-kpi text-lg font-mono font-bold"
            style={{
              color:
                asset.utilizationPct > 65
                  ? "var(--status-active-text)"
                  : asset.utilizationPct > 30
                  ? "var(--status-warning-text)"
                  : "var(--status-critical-text)",
            }}
          >
            {formatPct(asset.utilizationPct)}
          </span>
          <span className="text-[10px] text-[var(--text-disabled)]">
            Target benchmark: 70%
          </span>
        </div>

        <div
          className="p-3.5 rounded-md border border-[var(--border-default)] flex flex-col gap-1"
          style={{ background: "var(--surface-secondary)" }}
        >
          <span className="text-label text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
            <Clock size={12} />
            ENGINE / IDLE (DAILY)
          </span>
          <div className="flex items-baseline gap-1.5 text-lg font-mono font-bold">
            <span className="text-[var(--status-active-text)]">{formatHours(asset.engineHoursPerDay)}</span>
            <span className="text-xs text-[var(--text-disabled)] font-normal">/</span>
            <span className="text-[var(--status-warning-text)]">{formatHours(asset.idleHoursPerDay)}</span>
          </div>
          <span className="text-[10px] text-[var(--text-disabled)]">
            Total idle: {formatHours(asset.totalIdleHours)}
          </span>
        </div>

        <div
          className="p-3.5 rounded-md border border-[var(--border-default)] flex flex-col gap-1"
          style={{ background: "var(--surface-secondary)" }}
        >
          <span className="text-label text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
            <Fuel size={12} />
            FUEL LEVEL
          </span>
          <span
            className="text-kpi text-lg font-mono font-bold"
            style={{
              color:
                (asset.fuelLevelPct ?? 0) > 40
                  ? "var(--text-primary)"
                  : (asset.fuelLevelPct ?? 0) > 20
                  ? "var(--status-warning-text)"
                  : "var(--status-critical-text)",
            }}
          >
            {asset.fuelLevelPct != null ? `${asset.fuelLevelPct}%` : "—"}
          </span>
          <span className="text-[10px] text-[var(--text-disabled)]">
            Condition: {asset.condition}
          </span>
        </div>

        <div
          className="p-3.5 rounded-md border border-[var(--border-default)] flex flex-col gap-1"
          style={{ background: "var(--surface-secondary)" }}
        >
          <span className="text-label text-[10px] text-[var(--text-tertiary)] flex items-center gap-1">
            <Calendar size={12} />
            RETURN TIMELINE
          </span>
          <span
            className="text-sm font-mono font-bold"
            style={{
              color: daysOverdue > 0 ? "var(--status-critical-text)" : "var(--text-primary)",
            }}
          >
            {formatDate(asset.expectedReturnDate)}
          </span>
          <span className="text-[10px] text-[var(--text-disabled)] font-mono">
            {daysOverdue > 0
              ? `Overdue by ${daysOverdue} days`
              : `${daysRemaining} days remaining`}
          </span>
        </div>
      </div>

      {/* ── Active Intelligence Row ──────────────────────────── */}
      {(anomalies.length > 0 || recommendations.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Anomalies */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-[var(--status-critical-dot)]" />
              <h2 className="text-label text-[11px] text-[var(--text-secondary)]">
                ACTIVE ANOMALIES ({anomalies.length})
              </h2>
            </div>
            {anomalies.map((anom) => (
              <AnomalyCard key={anom.id} anomaly={anom} isHero />
            ))}
          </div>

          {/* Recommendations */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-[var(--brand-primary)]" />
              <h2 className="text-label text-[11px] text-[var(--text-secondary)]">
                AI RECOMMENDATIONS ({recommendations.length})
              </h2>
            </div>
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                rec={rec}
                isHero
                isApplying={applying === rec.id}
                onApply={handleApply}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Telemetry Deep-dive Chart ────────────────────────── */}
      <div
        className="p-5 rounded-md border border-[var(--border-default)]"
        style={{ background: "var(--surface-secondary)" }}
      >
        <AssetTelemetryChart
          engineHoursPerDay={asset.engineHoursPerDay}
          idleHoursPerDay={asset.idleHoursPerDay}
          operatingDays={asset.operatingDays}
        />
      </div>

      {/* ── Technical Specifications & Rental Record ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Specs */}
        <div
          className="p-4 rounded-md border border-[var(--border-default)] space-y-3"
          style={{ background: "var(--surface-secondary)" }}
        >
          <span className="text-label text-[10px] text-[var(--text-tertiary)] flex items-center gap-1.5">
            <FileText size={12} />
            EQUIPMENT SPECIFICATIONS
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-tertiary)]">Asset ID</span>
              <span className="font-mono text-[var(--text-primary)]">{asset.id}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-tertiary)]">Equipment Class</span>
              <span className="text-[var(--text-primary)]">{asset.equipmentTypeName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-tertiary)]">Operating Days Logged</span>
              <span className="font-mono text-[var(--text-primary)]">{asset.operatingDays} days</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[var(--border-subtle)]">
              <span className="text-[var(--text-tertiary)]">Total Lifetime Engine Hours</span>
              <span className="font-mono text-[var(--text-primary)]">{asset.totalEngineHours}h</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[var(--text-tertiary)]">Condition Assessment</span>
              <span className="font-semibold text-[var(--status-active-text)]">{asset.condition}</span>
            </div>
          </div>
        </div>

        {/* Operational Notes */}
        <div
          className="p-4 rounded-md border border-[var(--border-default)] space-y-3"
          style={{ background: "var(--surface-secondary)" }}
        >
          <span className="text-label text-[10px] text-[var(--text-tertiary)] flex items-center gap-1.5">
            <Activity size={12} />
            OPERATIONAL LOGS & ANNOTATIONS
          </span>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {asset.notes ?? "No operational anomalies or maintenance incidents reported for this rental cycle."}
          </p>
          {isHero && (
            <div
              className="p-2.5 rounded border border-[var(--status-critical-border)] text-xs text-[var(--status-critical-text)]"
              style={{ background: "var(--status-critical-bg)" }}
            >
              <p className="font-semibold mb-1">Critical Anomaly Flagged:</p>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Telemetry indicates unit is running in idle mode for 12 hours daily without active job site binding. Immediate allocation to S003 recommended.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
