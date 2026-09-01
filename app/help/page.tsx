"use client";

import { HelpCircle, BookOpen, Zap, Target, Shield, CheckCircle2 } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <HelpCircle size={18} className="text-[var(--brand-primary)]" />
          Caterpillar Smart Rental Intelligence — Documentation & Demo Guide
        </h1>
        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
          Hackathon evaluation walkthrough, core loop methodology, and demonstration guide
        </p>
      </div>

      {/* Hero Demo Script */}
      <div
        className="p-5 rounded-md border border-[var(--brand-muted-border)] space-y-4"
        style={{ background: "linear-gradient(135deg, var(--surface-secondary) 0%, rgba(245,184,0,0.04) 100%)" }}
      >
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-[var(--brand-primary)]" />
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            Primary Demonstration Scenario: EQX1007 Excavator Reassignment
          </h2>
        </div>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Follow this 5-step operational loop during the hackathon evaluation:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
          <div className="p-3 rounded border border-[var(--border-default)] bg-[var(--surface-primary)]">
            <span className="font-mono font-bold text-[var(--brand-primary)] block mb-1">1. SPOT</span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Control Tower flags EQX1007 as Critical: 0h runtime, 12h idle, unassigned.
            </span>
          </div>

          <div className="p-3 rounded border border-[var(--border-default)] bg-[var(--surface-primary)]">
            <span className="font-mono font-bold text-[var(--brand-primary)] block mb-1">2. EXPLAIN</span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Inspect AI recommendation signals: 144 total idle hours accumulating rental waste.
            </span>
          </div>

          <div className="p-3 rounded border border-[var(--border-default)] bg-[var(--surface-primary)]">
            <span className="font-mono font-bold text-[var(--brand-primary)] block mb-1">3. PREDICT</span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Forecasting indicates Site S003 has upcoming shortage (+2 Excavators needed).
            </span>
          </div>

          <div className="p-3 rounded border border-[var(--border-default)] bg-[var(--surface-primary)]">
            <span className="font-mono font-bold text-[var(--brand-primary)] block mb-1">4. ACT</span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Click <strong>Apply Now</strong> to reassign EQX1007 to S003 with 1-click execution.
            </span>
          </div>

          <div className="p-3 rounded border border-[var(--border-default)] bg-[var(--surface-primary)]">
            <span className="font-mono font-bold text-[var(--brand-primary)] block mb-1">5. MEASURE</span>
            <span className="text-[11px] text-[var(--text-secondary)]">
              Analytics reflects +19% utilization and $2,800 simulated cost avoided.
            </span>
          </div>
        </div>
      </div>

      {/* Core Loop Architecture */}
      <div
        className="p-5 rounded-md border border-[var(--border-default)] space-y-4"
        style={{ background: "var(--surface-secondary)" }}
      >
        <div className="flex items-center gap-2">
          <Target size={16} className="text-[var(--status-active-text)]" />
          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            Caterpillar Closed-Loop Intelligence Architecture
          </h2>
        </div>

        <div className="space-y-3 text-xs text-[var(--text-secondary)] leading-relaxed">
          <p>
            Unlike traditional tracking systems that merely report static coordinates, the Caterpillar Smart Rental Intelligence System closes the loop between sensory telemetry, machine learning forecasting, and operational dispatching.
          </p>
          <div className="flex items-center gap-2 flex-wrap font-mono text-[11px] font-bold text-[var(--text-primary)] bg-[var(--surface-primary)] p-3 rounded border border-[var(--border-subtle)]">
            <span>TRACK</span>
            <span className="text-[var(--text-disabled)]">→</span>
            <span>UNDERSTAND</span>
            <span className="text-[var(--text-disabled)]">→</span>
            <span>PREDICT</span>
            <span className="text-[var(--text-disabled)]">→</span>
            <span>RECOMMEND</span>
            <span className="text-[var(--text-disabled)]">→</span>
            <span className="text-[var(--brand-primary)]">ACT</span>
            <span className="text-[var(--text-disabled)]">→</span>
            <span className="text-[var(--status-active-text)]">MEASURE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
