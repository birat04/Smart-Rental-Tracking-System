"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AssetStatusBadge } from "./AssetStatusBadge";
import { RiskBadge } from "./RiskBadge";
import type { Asset, AssetStatus, RiskLevel } from "@/types";
import { formatHours, formatPct, formatDateShort } from "@/lib/utils/formatting";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ExternalLink,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssetTableProps {
  assets: Asset[];
}

type SortField = "id" | "equipmentTypeName" | "status" | "utilizationPct" | "operatingDays" | "riskLevel";

export function AssetTable({ assets }: AssetTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AssetStatus | "ALL">("ALL");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "ALL">("ALL");
  const [siteFilter, setSiteFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<SortField>("riskLevel");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Extract unique filter lists
  const sites = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => { if (a.siteId) set.add(a.siteId); });
    return Array.from(set).sort();
  }, [assets]);

  const equipmentTypes = useMemo(() => {
    const set = new Set<string>();
    assets.forEach((a) => set.add(a.equipmentTypeName));
    return Array.from(set).sort();
  }, [assets]);

  // Filtering
  const filtered = useMemo(() => {
    return assets.filter((a) => {
      if (search) {
        const q = search.toLowerCase();
        const matches =
          a.id.toLowerCase().includes(q) ||
          a.equipmentTypeName.toLowerCase().includes(q) ||
          (a.siteId?.toLowerCase().includes(q) ?? false) ||
          (a.siteName?.toLowerCase().includes(q) ?? false) ||
          (a.operatorName?.toLowerCase().includes(q) ?? false);
        if (!matches) return false;
      }
      if (statusFilter !== "ALL" && a.status !== statusFilter) return false;
      if (riskFilter !== "ALL" && a.riskLevel !== riskFilter) return false;
      if (siteFilter !== "ALL" && a.siteId !== siteFilter) return false;
      if (typeFilter !== "ALL" && a.equipmentTypeName !== typeFilter) return false;
      return true;
    });
  }, [assets, search, statusFilter, riskFilter, siteFilter, typeFilter]);

  // Sorting
  const sorted = useMemo(() => {
    const list = [...filtered];
    const riskOrder: Record<RiskLevel, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

    list.sort((a, b) => {
      let comparison = 0;
      if (sortField === "riskLevel") {
        comparison = (riskOrder[a.riskLevel] ?? 4) - (riskOrder[b.riskLevel] ?? 4);
      } else if (sortField === "utilizationPct" || sortField === "operatingDays") {
        comparison = a[sortField] - b[sortField];
      } else {
        const valA = String(a[sortField] || "");
        const valB = String(b[sortField] || "");
        comparison = valA.localeCompare(valB);
      }
      return sortAsc ? comparison : -comparison;
    });
    return list;
  }, [filtered, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page]);

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
    setPage(1);
  }

  return (
    <div className="space-y-4">
      {/* ── Filter Controls ─────────────────────────────────── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border-default)]"
          style={{ background: "var(--surface-secondary)" }}
        >
          <Search size={14} className="text-[var(--text-tertiary)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by Asset ID, type, site, or operator..."
            className="w-full bg-transparent border-none outline-none text-xs text-[var(--text-primary)] placeholder:text-[var(--text-disabled)]"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); }}
              className="text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
            className="px-2.5 py-2 rounded-md border border-[var(--border-default)] text-xs text-[var(--text-secondary)] bg-[var(--surface-secondary)] outline-none focus:border-[var(--brand-primary)]"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="IDLE">Idle</option>
            <option value="OVERDUE">Overdue</option>
            <option value="UNASSIGNED">Unassigned</option>
            <option value="RETURN_DUE">Return Due</option>
          </select>

          {/* Risk Filter */}
          <select
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value as any); setPage(1); }}
            className="px-2.5 py-2 rounded-md border border-[var(--border-default)] text-xs text-[var(--text-secondary)] bg-[var(--surface-secondary)] outline-none focus:border-[var(--brand-primary)]"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>

          {/* Site Filter */}
          <select
            value={siteFilter}
            onChange={(e) => { setSiteFilter(e.target.value); setPage(1); }}
            className="px-2.5 py-2 rounded-md border border-[var(--border-default)] text-xs text-[var(--text-secondary)] bg-[var(--surface-secondary)] outline-none focus:border-[var(--brand-primary)]"
          >
            <option value="ALL">All Sites</option>
            {sites.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Equipment Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            className="px-2.5 py-2 rounded-md border border-[var(--border-default)] text-xs text-[var(--text-secondary)] bg-[var(--surface-secondary)] outline-none focus:border-[var(--brand-primary)]"
          >
            <option value="ALL">All Equipment Types</option>
            {equipmentTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table View ──────────────────────────────────────── */}
      <div
        className="rounded-md border border-[var(--border-default)] overflow-hidden shadow-sm"
        style={{ background: "var(--surface-secondary)" }}
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1.5">
                    ASSET ID
                    <ArrowUpDown size={11} className="text-[var(--text-disabled)]" />
                  </div>
                </th>
                <th onClick={() => handleSort("equipmentTypeName")} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1.5">
                    EQUIPMENT TYPE
                    <ArrowUpDown size={11} className="text-[var(--text-disabled)]" />
                  </div>
                </th>
                <th onClick={() => handleSort("status")} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1.5">
                    STATUS
                    <ArrowUpDown size={11} className="text-[var(--text-disabled)]" />
                  </div>
                </th>
                <th>SITE</th>
                <th>OPERATOR</th>
                <th>RUNTIME / IDLE (D)</th>
                <th onClick={() => handleSort("utilizationPct")} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1.5">
                    UTILIZATION
                    <ArrowUpDown size={11} className="text-[var(--text-disabled)]" />
                  </div>
                </th>
                <th>RETURN DATE</th>
                <th onClick={() => handleSort("riskLevel")} className="cursor-pointer select-none">
                  <div className="flex items-center gap-1.5">
                    RISK
                    <ArrowUpDown size={11} className="text-[var(--text-disabled)]" />
                  </div>
                </th>
                <th className="text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-[var(--text-tertiary)]">
                    No assets found matching the specified filter criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((asset) => {
                  const isHero = asset.id === "EQX1007";
                  return (
                    <tr
                      key={asset.id}
                      className={cn(
                        "transition-colors",
                        isHero && "bg-[rgba(242,82,82,0.06)] hover:bg-[rgba(242,82,82,0.1)]"
                      )}
                    >
                      <td>
                        <Link
                          href={`/assets/${asset.id}`}
                          className="font-mono text-xs font-semibold text-[var(--text-accent)] hover:underline flex items-center gap-1"
                        >
                          {asset.id}
                          {isHero && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--status-critical-bg)] text-[var(--status-critical-text)] border border-[var(--status-critical-border)]">
                              HERO
                            </span>
                          )}
                        </Link>
                      </td>
                      <td className="text-xs text-[var(--text-primary)] font-medium">
                        {asset.equipmentTypeName}
                      </td>
                      <td>
                        <AssetStatusBadge status={asset.status} pulse={isHero} />
                      </td>
                      <td>
                        {asset.siteId ? (
                          <div className="flex flex-col">
                            <span className="font-mono text-xs text-[var(--text-secondary)]">{asset.siteId}</span>
                            <span className="text-[10px] text-[var(--text-tertiary)] truncate max-w-[120px]">
                              {asset.siteName}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-[var(--status-critical-text)] italic">Unassigned</span>
                        )}
                      </td>
                      <td>
                        {asset.operatorName ? (
                          <span className="text-xs text-[var(--text-secondary)]">{asset.operatorName}</span>
                        ) : (
                          <span className="text-xs text-[var(--status-critical-text)] italic">Unassigned</span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-[var(--status-active-text)]">{formatHours(asset.engineHoursPerDay)}</span>
                          <span className="text-[var(--text-disabled)]">/</span>
                          <span className="font-mono text-[var(--status-warning-text)]">{formatHours(asset.idleHoursPerDay)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 rounded-full bg-[var(--surface-tertiary)] overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${asset.utilizationPct}%`,
                                background:
                                  asset.utilizationPct > 65
                                    ? "var(--status-active-dot)"
                                    : asset.utilizationPct > 30
                                    ? "var(--status-warning-dot)"
                                    : "var(--status-critical-dot)",
                              }}
                            />
                          </div>
                          <span className="font-mono text-xs font-semibold">
                            {formatPct(asset.utilizationPct)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {formatDateShort(asset.expectedReturnDate)}
                        </span>
                      </td>
                      <td>
                        <RiskBadge risk={asset.riskLevel} />
                      </td>
                      <td className="text-right">
                        <Link
                          href={`/assets/${asset.id}`}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--interactive-hover)] transition-colors"
                        >
                          Inspect
                          <ExternalLink size={10} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Table Pagination & Summary ─────────────────────── */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-default)] text-xs text-[var(--text-tertiary)]">
          <div>
            Showing <span className="font-mono text-[var(--text-primary)]">{filtered.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{" "}
            <span className="font-mono text-[var(--text-primary)]">{Math.min(page * pageSize, filtered.length)}</span> of{" "}
            <span className="font-mono text-[var(--text-primary)]">{filtered.length}</span> assets
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded border border-[var(--border-default)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--interactive-hover)]"
            >
              Previous
            </button>
            <span className="px-2 font-mono">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded border border-[var(--border-default)] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[var(--interactive-hover)]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
