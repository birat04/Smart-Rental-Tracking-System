"use client";

import { useEffect, useState } from "react";
import { getFleetSummary } from "@/lib/api/assets";
import { getRecommendations } from "@/lib/api/recommendations";
import { formatCurrency, formatPct, formatHours } from "@/lib/utils/formatting";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  ShieldCheck,
  Building2,
  Package,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const SITE_BENCHMARKS = [
  { name: "S001 Quarry",     util: 78, idleHours: 32, assets: 4 },
  { name: "S002 Highland",   util: 64, idleHours: 58, assets: 3 },
  { name: "S003 Eastfield",  util: 82, idleHours: 24, assets: 4 },
  { name: "S004 Northgate",  util: 42, idleHours: 94, assets: 2 },
  { name: "S005 Lakefront",  util: 51, idleHours: 76, assets: 1 },
];

export default function AnalyticsPage() {
  const [fleet, setFleet] = useState<Awaited<ReturnType<typeof getFleetSummary>> | null>(null);
  const [savingsTotal, setSavingsTotal] = useState(7450);

  useEffect(() => {
    getFleetSummary().then(setFleet);
  }, []);

  return (
    <div className="space-y-6">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <BarChart3 size={18} className="text-[var(--brand-primary)]" />
            Operational Analytics & Financial Impact
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Enterprise fleet telemetry efficiency metrics and simulated cost avoidance ledger
          </p>
        </div>

        <span className="text-[10px] font-mono px-2 py-1 rounded bg-[var(--surface-secondary)] border border-[var(--border-default)] text-[var(--text-tertiary)]">
          SIMULATION LEDGER · NON-PRODUCTION FINANCIALS
        </span>
      </div>

      {/* ── Financial Impact Strip ───────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="p-4 rounded-md border border-[var(--status-active-border)] bg-[var(--status-active-bg)] flex items-center justify-between"
        >
          <div>
            <span className="text-label text-[10px] text-[var(--status-active-text)]">
              ESTIMATED COST AVOIDED
            </span>
            <p className="text-kpi-lg text-2xl font-mono font-bold text-[var(--status-active-text)] mt-1">
              {formatCurrency(savingsTotal)}
            </p>
            <span className="text-[10px] text-[var(--status-active-text)] opacity-80">
              Via proactive AI reassignments & return alerts
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[rgba(63,182,108,0.2)] flex items-center justify-center text-[var(--status-active-text)]">
            <TrendingDown size={20} />
          </div>
        </div>

        <div
          className="p-4 rounded-md border border-[var(--status-critical-border)] bg-[var(--status-critical-bg)] flex items-center justify-between"
        >
          <div>
            <span className="text-label text-[10px] text-[var(--status-critical-text)]">
              POTENTIAL COST AT RISK
            </span>
            <p className="text-kpi-lg text-2xl font-mono font-bold text-[var(--status-critical-text)] mt-1">
              {formatCurrency(fleet?.potentialCostAtRisk ?? 3600)}
            </p>
            <span className="text-[10px] text-[var(--status-critical-text)] opacity-80">
              From {fleet?.overdue ?? 3} overdue rentals & unassigned assets
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[rgba(242,82,82,0.2)] flex items-center justify-center text-[var(--status-critical-text)]">
            <TrendingUp size={20} />
          </div>
        </div>

        <div
          className="p-4 rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] flex items-center justify-between"
        >
          <div>
            <span className="text-label text-[10px] text-[var(--text-tertiary)]">
              FLEET UTILIZATION EFFICIENCY
            </span>
            <p className="text-kpi-lg text-2xl font-mono font-bold text-[var(--text-primary)] mt-1">
              {fleet?.avgUtilization ?? 62}%
            </p>
            <span className="text-[10px] text-[var(--status-active-text)]">
              +14% projected with all actions applied
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[var(--surface-tertiary)] flex items-center justify-center text-[var(--brand-primary)]">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      {/* ── Visual Comparison Grid ──────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Site Benchmarks */}
        <div
          className="p-5 rounded-md border border-[var(--border-default)] space-y-4"
          style={{ background: "var(--surface-secondary)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-[var(--text-primary)]">
                Project Site Utilization Breakdown
              </h2>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                Operating efficiency percentage by construction site
              </p>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-disabled)]">Target: 70%</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SITE_BENCHMARKS} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262D" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 9, fill: "#8B949E" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "#8B949E", fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  formatter={(val: any) => [`${val}%`, "Utilization Rate"]}
                  contentStyle={{ background: "#1C2128", borderColor: "#30363D", fontSize: "12px", color: "#F0F6FC" }}
                />
                <Bar dataKey="util" radius={[4, 4, 0, 0]}>
                  {SITE_BENCHMARKS.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.util >= 70 ? "#3FB66C" : entry.util >= 50 ? "#F5A623" : "#F25252"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Before vs After Impact Table */}
        <div
          className="p-5 rounded-md border border-[var(--border-default)] space-y-4"
          style={{ background: "var(--surface-secondary)" }}
        >
          <div>
            <h2 className="text-xs font-bold text-[var(--text-primary)]">
              Before vs. After Operational Impact
            </h2>
            <p className="text-[10px] text-[var(--text-tertiary)]">
              Demonstrated value creation from intelligent Caterpillar control tower loop
            </p>
          </div>

          <div className="rounded overflow-hidden border border-[var(--border-subtle)] text-xs">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--surface-primary)] text-left">
                  <th className="p-2.5 text-label text-[9px] text-[var(--text-tertiary)]">OPERATIONAL KPI</th>
                  <th className="p-2.5 text-label text-[9px] text-[var(--text-tertiary)]">MANUAL BASELINE</th>
                  <th className="p-2.5 text-label text-[9px] text-[var(--text-tertiary)]">INTELLIGENCE TOWER</th>
                  <th className="p-2.5 text-label text-[9px] text-[var(--text-tertiary)]">NET DELTA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr>
                  <td className="p-2.5 text-[var(--text-primary)] font-medium">Average Idle Hours / Unit</td>
                  <td className="p-2.5 text-[var(--text-tertiary)] font-mono">11.4h / day</td>
                  <td className="p-2.5 text-[var(--text-primary)] font-mono">4.2h / day</td>
                  <td className="p-2.5 font-mono text-[var(--status-active-text)] font-semibold">-63% Idle Time</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-[var(--text-primary)] font-medium">Overdue Rental Discovery</td>
                  <td className="p-2.5 text-[var(--text-tertiary)] font-mono">7–14 days lag</td>
                  <td className="p-2.5 text-[var(--text-primary)] font-mono">Real-time alerts</td>
                  <td className="p-2.5 font-mono text-[var(--status-active-text)] font-semibold">Immediate Action</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-[var(--text-primary)] font-medium">S003 Excavator Shortage</td>
                  <td className="p-2.5 text-[var(--text-tertiary)] font-mono">Unplanned stoppage</td>
                  <td className="p-2.5 text-[var(--text-primary)] font-mono">EQX1007 Reassigned</td>
                  <td className="p-2.5 font-mono text-[var(--status-active-text)] font-semibold">100% Demand Covered</td>
                </tr>
                <tr>
                  <td className="p-2.5 text-[var(--text-primary)] font-medium">Estimated Monthly Waste</td>
                  <td className="p-2.5 text-[var(--text-tertiary)] font-mono">$18,400</td>
                  <td className="p-2.5 text-[var(--text-primary)] font-mono">$4,200</td>
                  <td className="p-2.5 font-mono text-[var(--status-active-text)] font-semibold">-$14,200 / mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
