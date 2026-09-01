"use client";

import { useEffect, useState } from "react";
import { getAssets } from "@/lib/api/assets";
import { SITES } from "@/lib/mock-data/sites";
import type { Asset, Site } from "@/types";
import { AssetStatusBadge } from "@/components/assets/AssetStatusBadge";
import { formatHours, formatPct } from "@/lib/utils/formatting";
import {
  MapPin,
  Building2,
  Package,
  Layers,
  AlertTriangle,
  ExternalLink,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function FleetMapPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string>("S003");

  useEffect(() => {
    getAssets().then(setAssets);
  }, []);

  const selectedSite = SITES.find((s) => s.id === selectedSiteId) ?? SITES[0];
  const siteAssets = assets.filter((a) => a.siteId === selectedSiteId);
  const unassignedAssets = assets.filter((a) => !a.siteId);

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <MapPin size={18} className="text-[var(--brand-primary)]" />
            Geographic Fleet Distribution Map
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Regional site locations, active asset deployment, and unassigned equipment buffer
          </p>
        </div>

        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[var(--surface-secondary)] border border-[var(--border-default)] text-[var(--text-secondary)]">
          5 ACTIVE PROJECT SITES
        </span>
      </div>

      {/* ── Interactive Map Layout ───────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Visual Map Canvas Simulation */}
        <div className="xl:col-span-8 space-y-4">
          <div
            className="relative h-[480px] rounded-lg border border-[var(--border-default)] overflow-hidden shadow-inner p-6 flex flex-col justify-between"
            style={{
              background: "radial-gradient(circle at 50% 50%, #161B22 0%, #0A0C0F 100%)",
            }}
          >
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: "linear-gradient(#30363D 1px, transparent 1px), linear-gradient(90deg, #30363D 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Map Top Overlay Controls */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="px-3 py-1.5 rounded-md bg-[var(--surface-overlay)] border border-[var(--border-default)] text-xs text-[var(--text-secondary)] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--status-active-dot)] pulse-dot" />
                <span className="font-mono">EAST REGIONAL SECTOR (LIVE TELEMETRY)</span>
              </div>

              {unassignedAssets.length > 0 && (
                <div className="px-3 py-1.5 rounded-md bg-[var(--status-critical-bg)] border border-[var(--status-critical-border)] text-xs text-[var(--status-critical-text)] flex items-center gap-1.5">
                  <AlertTriangle size={13} />
                  <span>{unassignedAssets.length} Unassigned Assets Detected</span>
                </div>
              )}
            </div>

            {/* Map Interactive Site Markers */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {/* Site S001: Top Left */}
              <div className="absolute top-[18%] left-[20%]">
                <SiteMarker
                  site={SITES[0]}
                  isSelected={selectedSiteId === "S001"}
                  onClick={() => setSelectedSiteId("S001")}
                  assetCount={assets.filter((a) => a.siteId === "S001").length}
                />
              </div>

              {/* Site S002: Top Right */}
              <div className="absolute top-[25%] right-[22%]">
                <SiteMarker
                  site={SITES[1]}
                  isSelected={selectedSiteId === "S002"}
                  onClick={() => setSelectedSiteId("S002")}
                  assetCount={assets.filter((a) => a.siteId === "S002").length}
                />
              </div>

              {/* Site S003: Hero Center */}
              <div className="absolute top-[52%] left-[45%]">
                <SiteMarker
                  site={SITES[2]}
                  isSelected={selectedSiteId === "S003"}
                  onClick={() => setSelectedSiteId("S003")}
                  assetCount={assets.filter((a) => a.siteId === "S003").length}
                  isHero
                />
              </div>

              {/* Site S004: Bottom Left */}
              <div className="absolute bottom-[20%] left-[25%]">
                <SiteMarker
                  site={SITES[3]}
                  isSelected={selectedSiteId === "S004"}
                  onClick={() => setSelectedSiteId("S004")}
                  assetCount={assets.filter((a) => a.siteId === "S004").length}
                />
              </div>

              {/* Site S005: Bottom Right */}
              <div className="absolute bottom-[24%] right-[20%]">
                <SiteMarker
                  site={SITES[4]}
                  isSelected={selectedSiteId === "S005"}
                  onClick={() => setSelectedSiteId("S005")}
                  assetCount={assets.filter((a) => a.siteId === "S005").length}
                />
              </div>
            </div>

            {/* Map Legend */}
            <div className="relative z-10 flex items-center gap-4 text-[10px] text-[var(--text-tertiary)] bg-[var(--surface-overlay)] px-3 py-1.5 rounded border border-[var(--border-default)] self-start">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                <span>Demand Surge (S003)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--status-active-dot)]" />
                <span>Balanced Capacity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Site Asset Drawer */}
        <div className="xl:col-span-4 space-y-4">
          <div
            className="p-5 rounded-lg border border-[var(--border-default)] space-y-4"
            style={{ background: "var(--surface-secondary)" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-label text-[10px] text-[var(--text-tertiary)]">
                  SITE DETAILS
                </span>
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  {selectedSite.name}
                </h2>
                <p className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 mt-0.5">
                  <MapPin size={11} />
                  {selectedSite.location} · {selectedSite.id}
                </p>
              </div>

              {selectedSite.id === "S003" && (
                <span className="text-label text-[9px] px-1.5 py-0.5 rounded bg-[var(--brand-muted)] text-[var(--brand-primary)] border border-[var(--brand-muted-border)] font-bold">
                  HIGH DEMAND
                </span>
              )}
            </div>

            {/* Asset List for Selected Site */}
            <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-label text-[9px] text-[var(--text-disabled)] block">
                DEPLOYED EQUIPMENT ({siteAssets.length})
              </span>

              {siteAssets.length === 0 ? (
                <p className="text-xs text-[var(--text-tertiary)] py-4 text-center italic">
                  No active equipment assigned to this location.
                </p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {siteAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-primary)] flex items-center justify-between text-xs hover:border-[var(--border-default)] transition-colors"
                    >
                      <div>
                        <Link
                          href={`/assets/${asset.id}`}
                          className="font-mono font-bold text-[var(--text-accent)] hover:underline flex items-center gap-1"
                        >
                          {asset.id}
                        </Link>
                        <span className="text-[11px] text-[var(--text-secondary)] block">
                          {asset.equipmentTypeName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-[var(--text-tertiary)]">
                          {formatPct(asset.utilizationPct)} util
                        </span>
                        <AssetStatusBadge status={asset.status} size="sm" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action CTA */}
            {selectedSite.id === "S003" && (
              <div
                className="p-3 rounded border border-[var(--brand-muted-border)] bg-[var(--brand-muted)] text-xs text-[var(--brand-primary)] space-y-2"
              >
                <p className="font-medium text-[11px]">
                  Site S003 has forecasted excavator shortage (+2 needed). Reassign unassigned EQX1007 here.
                </p>
                <Link
                  href="/recommendations"
                  className="inline-flex items-center gap-1 font-bold text-xs hover:underline text-[var(--brand-primary)]"
                >
                  <Zap size={12} />
                  Execute S003 Reassignment
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteMarker({
  site,
  isSelected,
  onClick,
  assetCount,
  isHero,
}: {
  site: Site;
  isSelected: boolean;
  onClick: () => void;
  assetCount: number;
  isHero?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center cursor-pointer transition-transform duration-150 hover:scale-110",
        isSelected && "scale-110 z-20"
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs border-2 shadow-xl",
          isSelected
            ? "bg-[var(--brand-primary)] text-[var(--text-inverse)] border-white ring-4 ring-[rgba(245,184,0,0.3)]"
            : isHero
            ? "bg-[var(--surface-secondary)] text-[var(--brand-primary)] border-[var(--brand-primary)]"
            : "bg-[var(--surface-secondary)] text-[var(--text-primary)] border-[var(--border-strong)]"
        )}
      >
        {site.id}
      </div>

      <div
        className={cn(
          "mt-1 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap shadow-md border",
          isSelected
            ? "bg-[var(--surface-primary)] text-[var(--brand-primary)] border-[var(--brand-primary)] font-bold"
            : "bg-[var(--surface-overlay)] text-[var(--text-secondary)] border-[var(--border-default)]"
        )}
      >
        {site.name} ({assetCount})
      </div>
    </button>
  );
}
