"use client";

import { useEffect, useState } from "react";
import { getRentals, getRentalEvents } from "@/lib/api/rentals";
import { CheckoutDialog } from "@/components/rentals/CheckoutDialog";
import { CheckinDialog } from "@/components/rentals/CheckinDialog";
import { RentalTimeline } from "@/components/rentals/RentalTimeline";
import type { Rental, RentalEvent, RentalStatus } from "@/types";
import { formatCurrency, formatDate, formatHours } from "@/lib/utils/formatting";
import {
  ClipboardList,
  Plus,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RentalsPage() {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [events, setEvents] = useState<RentalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkinRental, setCheckinRental] = useState<Rental | null>(null);
  const [statusFilter, setStatusFilter] = useState<RentalStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  async function load() {
    setLoading(true);
    const [r, ev] = await Promise.all([getRentals(), getRentalEvents()]);
    setRentals(r);
    setEvents(ev);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filteredRentals = rentals.filter((r) => {
    if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.id.toLowerCase().includes(q) ||
        r.assetId.toLowerCase().includes(q) ||
        (r.siteName?.toLowerCase().includes(q) ?? false) ||
        (r.operatorName?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const statusStyles: Record<RentalStatus, { bg: string; text: string; border: string }> = {
    ACTIVE:   { bg: "var(--status-active-bg)",   text: "var(--status-active-text)",   border: "var(--status-active-border)" },
    OVERDUE:  { bg: "var(--status-critical-bg)", text: "var(--status-critical-text)", border: "var(--status-critical-border)" },
    RETURNED: { bg: "var(--surface-tertiary)",   text: "var(--text-tertiary)",        border: "var(--border-default)" },
    EXTENDED: { bg: "var(--status-info-bg)",     text: "var(--status-info-text)",     border: "var(--status-info-border)" },
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <ClipboardList size={18} className="text-[var(--brand-primary)]" />
            Rental Operations & Lifecycle
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Full checkout dispatch, active contract tracking, return inspection, and liability audit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--interactive-hover)] transition-colors"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[var(--brand-primary)] text-[var(--text-inverse)] hover:bg-[var(--brand-hover)] transition-colors"
          >
            <Plus size={13} />
            New Equipment Checkout
          </button>
        </div>
      </div>

      {/* ── Operational Summary Strip ────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div
          className="p-3.5 rounded-md border border-[var(--border-default)]"
          style={{ background: "var(--surface-secondary)" }}
        >
          <span className="text-label text-[10px] text-[var(--text-tertiary)]">ACTIVE CONTRACTS</span>
          <p className="text-kpi text-lg font-mono font-bold text-[var(--status-active-text)] mt-1">
            {rentals.filter((r) => r.status === "ACTIVE").length}
          </p>
        </div>
        <div
          className="p-3.5 rounded-md border border-[var(--border-default)]"
          style={{ background: "var(--surface-secondary)" }}
        >
          <span className="text-label text-[10px] text-[var(--text-tertiary)]">OVERDUE DISPATCHES</span>
          <p className="text-kpi text-lg font-mono font-bold text-[var(--status-critical-text)] mt-1">
            {rentals.filter((r) => r.status === "OVERDUE").length}
          </p>
        </div>
        <div
          className="p-3.5 rounded-md border border-[var(--border-default)]"
          style={{ background: "var(--surface-secondary)" }}
        >
          <span className="text-label text-[10px] text-[var(--text-tertiary)]">RETURNED & VERIFIED</span>
          <p className="text-kpi text-lg font-mono font-bold text-[var(--text-secondary)] mt-1">
            {rentals.filter((r) => r.status === "RETURNED").length}
          </p>
        </div>
        <div
          className="p-3.5 rounded-md border border-[var(--border-default)]"
          style={{ background: "var(--surface-secondary)" }}
        >
          <span className="text-label text-[10px] text-[var(--text-tertiary)]">ESTIMATED DAILY RENTAL COST</span>
          <p className="text-kpi text-lg font-mono font-bold text-[var(--brand-primary)] mt-1">
            {formatCurrency(rentals.reduce((sum, r) => sum + (r.status === "ACTIVE" ? (r.dailyCostUsd ?? 0) : 0), 0))}
          </p>
        </div>
      </div>

      {/* ── Main Split View ──────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Contracts Table */}
        <div className="xl:col-span-8 space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div
              className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border-default)]"
              style={{ background: "var(--surface-secondary)" }}
            >
              <Search size={14} className="text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contract ID, asset, or site..."
                className="w-full bg-transparent border-none outline-none text-xs text-[var(--text-primary)] placeholder:text-[var(--text-disabled)]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              {(["ALL", "ACTIVE", "OVERDUE", "RETURNED"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "text-label text-[10px] px-2.5 py-1.5 rounded-sm border transition-colors",
                    statusFilter === st
                      ? "bg-[var(--brand-muted)] text-[var(--text-accent)] border-[var(--brand-muted-border)]"
                      : "border-[var(--border-default)] text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                  )}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div
            className="rounded-md border border-[var(--border-default)] overflow-hidden shadow-sm"
            style={{ background: "var(--surface-secondary)" }}
          >
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>CONTRACT</th>
                    <th>ASSET</th>
                    <th>STATUS</th>
                    <th>SITE / OPERATOR</th>
                    <th>RETURN DUE</th>
                    <th>DAILY COST</th>
                    <th className="text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRentals.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-[var(--text-tertiary)]">
                        No rental agreements match the filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredRentals.map((r) => {
                      const st = statusStyles[r.status] ?? statusStyles.ACTIVE;
                      return (
                        <tr key={r.id}>
                          <td>
                            <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
                              {r.id}
                            </span>
                          </td>
                          <td>
                            <Link
                              href={`/assets/${r.assetId}`}
                              className="font-mono text-xs text-[var(--brand-primary)] hover:underline flex items-center gap-1"
                            >
                              {r.assetId}
                            </Link>
                          </td>
                          <td>
                            <span
                              className="text-label text-[9px] px-1.5 py-0.5 rounded-sm border font-semibold"
                              style={{
                                background: st.bg,
                                color: st.text,
                                borderColor: st.border,
                              }}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td>
                            <div className="flex flex-col text-xs">
                              <span className="text-[var(--text-primary)]">{r.siteName ?? "Unassigned"}</span>
                              <span className="text-[10px] text-[var(--text-tertiary)]">
                                {r.operatorName ?? "No operator assigned"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span
                              className={cn(
                                "font-mono text-xs",
                                r.status === "OVERDUE" ? "text-[var(--status-critical-text)] font-semibold" : "text-[var(--text-secondary)]"
                              )}
                            >
                              {formatDate(r.expectedReturnDate)}
                            </span>
                          </td>
                          <td>
                            <span className="font-mono text-xs text-[var(--text-primary)]">
                              {formatCurrency(r.dailyCostUsd)}/d
                            </span>
                          </td>
                          <td className="text-right">
                            {r.status !== "RETURNED" ? (
                              <button
                                onClick={() => setCheckinRental(r)}
                                className="px-2.5 py-1 rounded text-xs font-semibold bg-[var(--surface-tertiary)] text-[var(--text-primary)] hover:bg-[var(--status-active-bg)] hover:text-[var(--status-active-text)] border border-[var(--border-default)] transition-colors"
                              >
                                Check-in
                              </button>
                            ) : (
                              <span className="text-[10px] text-[var(--text-disabled)] font-mono">
                                Closed
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Auditable Rental Event Stream */}
        <div className="xl:col-span-4 space-y-4">
          <div
            className="p-4 rounded-md border border-[var(--border-default)]"
            style={{ background: "var(--surface-secondary)" }}
          >
            <RentalTimeline events={events} />
          </div>
        </div>
      </div>

      {/* ── Dialog Modals ────────────────────────────────────── */}
      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={load}
      />

      <CheckinDialog
        rental={checkinRental}
        isOpen={!!checkinRental}
        onClose={() => setCheckinRental(null)}
        onSuccess={load}
      />
    </div>
  );
}
