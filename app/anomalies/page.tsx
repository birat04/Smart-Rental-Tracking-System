"use client";

import { useState, useEffect } from "react";
import { getAnomalies } from "@/lib/api/anomalies";
import { AnomalyCard } from "@/components/dashboard/AnomalyCard";
import type { Anomaly, AnomalySeverity } from "@/types";
import { AlertTriangle, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const SEVERITY_FILTERS: Array<{ value: AnomalySeverity | "ALL"; label: string }> = [
  { value: "ALL",      label: "All" },
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH",     label: "High" },
  { value: "WARNING",  label: "Warning" },
  { value: "INFO",     label: "Info" },
];

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AnomalySeverity | "ALL">("ALL");

  useEffect(() => {
    getAnomalies().then((data) => {
      setAnomalies(data);
      setLoading(false);
    });
  }, []);

  const filtered = filter === "ALL"
    ? anomalies
    : anomalies.filter((a) => a.severity === filter);

  const counts: Record<string, number> = {
    ALL: anomalies.length,
    CRITICAL: anomalies.filter((a) => a.severity === "CRITICAL").length,
    HIGH:     anomalies.filter((a) => a.severity === "HIGH").length,
    WARNING:  anomalies.filter((a) => a.severity === "WARNING").length,
    INFO:     anomalies.filter((a) => a.severity === "INFO").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <AlertTriangle size={18} className="text-[var(--status-critical-dot)]" />
          Anomaly Detection
        </h1>
        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
          AI-detected patterns indicating risk, waste, or operational anomalies across the fleet
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <Filter size={13} className="text-[var(--text-tertiary)] shrink-0" />
        <div className="flex flex-wrap gap-1.5">
          {SEVERITY_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                "text-label text-[10px] px-2.5 py-1 rounded-sm border transition-colors",
                filter === value
                  ? "bg-[var(--brand-muted)] text-[var(--text-accent)] border-[var(--brand-muted-border)]"
                  : "border-[var(--border-default)] text-[var(--text-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--text-secondary)]"
              )}
            >
              {label}
              {counts[value] > 0 && (
                <span className="ml-1 opacity-70">{counts[value]}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Anomaly list */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-md" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-md border border-dashed border-[var(--border-default)]">
          <AlertTriangle size={32} className="text-[var(--text-disabled)] mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">No anomalies found</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">
            {filter !== "ALL" ? "Try a different severity filter" : "Fleet is operating normally"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {filtered.map((a, i) => (
            <AnomalyCard
              key={a.id}
              anomaly={a}
              isHero={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
