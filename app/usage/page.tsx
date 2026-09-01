"use client";

import { useEffect, useState } from "react";
import { getAssets } from "@/lib/api/assets";
import type { Asset } from "@/types";
import { AssetTelemetryChart } from "@/components/assets/AssetTelemetryChart";
import { formatHours, formatPct } from "@/lib/utils/formatting";
import { Activity, Gauge, Clock, Fuel, Search } from "lucide-react";
import Link from "next/link";

export default function UsagePage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState("EQX1007");

  useEffect(() => {
    getAssets().then(setAssets);
  }, []);

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) ?? assets[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Activity size={18} className="text-[var(--brand-primary)]" />
          Fleet Usage & Telemetry Stream
        </h1>
        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
          Sensor-level operating runtime vs. idle metrics across all active and unassigned equipment
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Asset Selector */}
        <div className="xl:col-span-4 space-y-3">
          <span className="text-label text-[10px] text-[var(--text-tertiary)]">
            SELECT ASSET FOR TELEMETRY INSPECTION
          </span>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {assets.map((asset) => {
              const isSelected = asset.id === selectedAssetId;
              const isHero = asset.id === "EQX1007";

              return (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAssetId(asset.id)}
                  className={`w-full text-left p-3 rounded-md border transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-[var(--brand-primary)] bg-[rgba(245,184,0,0.05)]"
                      : "border-[var(--border-default)] bg-[var(--surface-secondary)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-[var(--text-primary)]">
                        {asset.id}
                      </span>
                      {isHero && (
                        <span className="text-[9px] px-1 rounded bg-[var(--status-critical-bg)] text-[var(--status-critical-text)] border border-[var(--status-critical-border)]">
                          CRITICAL IDLE
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[var(--text-tertiary)] block mt-0.5">
                      {asset.equipmentTypeName} · {asset.siteId ?? "No Site"}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-xs font-semibold block text-[var(--text-primary)]">
                      {formatPct(asset.utilizationPct)}
                    </span>
                    <span className="text-[10px] text-[var(--text-disabled)] font-mono">
                      {asset.engineHoursPerDay}h run / {asset.idleHoursPerDay}h idle
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Telemetry Chart & Detailed Breakdown */}
        {selectedAsset && (
          <div className="xl:col-span-8 space-y-6">
            <div
              className="p-5 rounded-md border border-[var(--border-default)] space-y-4"
              style={{ background: "var(--surface-secondary)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-[var(--text-primary)] font-mono">
                    {selectedAsset.id} Telemetry Analysis
                  </h2>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {selectedAsset.equipmentTypeName} · Site: {selectedAsset.siteName ?? "Unassigned"}
                  </p>
                </div>
                <Link
                  href={`/assets/${selectedAsset.id}`}
                  className="text-xs text-[var(--brand-primary)] hover:underline font-semibold"
                >
                  View Full Asset Profile →
                </Link>
              </div>

              <AssetTelemetryChart
                engineHoursPerDay={selectedAsset.engineHoursPerDay}
                idleHoursPerDay={selectedAsset.idleHoursPerDay}
                operatingDays={selectedAsset.operatingDays}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
