import { Settings, Sliders, Shield, Bell, Database, Radio, Sun } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Settings size={18} className="text-[var(--brand-primary)]" />
          System Settings & Telemetry Configuration
        </h1>
        <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
          Control tower polling intervals, anomaly sensitivity thresholds, and API connection status
        </p>
      </div>

      <div className="space-y-4">
        {/* Appearance & Color Theme */}
        <div
          className="p-5 rounded-md border border-[var(--border-default)] space-y-4"
          style={{ background: "var(--surface-secondary)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sun size={16} className="text-[var(--brand-primary)]" />
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                Appearance & Color Theme
              </h2>
            </div>
            <span className="text-[11px] text-[var(--text-tertiary)]">
              Caterpillar Safety High-Contrast & Dark Mode
            </span>
          </div>
          <ThemeToggle variant="select" />
        </div>

        {/* Telemetry Polling */}
        <div
          className="p-5 rounded-md border border-[var(--border-default)] space-y-4"
          style={{ background: "var(--surface-secondary)" }}
        >
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-[var(--status-active-text)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Simulated Telemetry Stream Frequency
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded border border-[var(--brand-muted-border)] bg-[var(--brand-muted)] text-[var(--brand-primary)]">
              <span className="font-bold block">Real-time Fast (5s)</span>
              <span className="text-[10px] opacity-80">High-frequency live simulation</span>
            </div>
            <div className="p-3 rounded border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-secondary)]">
              <span className="font-bold block">Operational (60s)</span>
              <span className="text-[10px] text-[var(--text-tertiary)]">Standard production rate</span>
            </div>
            <div className="p-3 rounded border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-secondary)]">
              <span className="font-bold block">Batch Ingestion (15m)</span>
              <span className="text-[10px] text-[var(--text-tertiary)]">Low-bandwidth remote sites</span>
            </div>
          </div>
        </div>

        {/* Anomaly Detection Sensitivity */}
        <div
          className="p-5 rounded-md border border-[var(--border-default)] space-y-4"
          style={{ background: "var(--surface-secondary)" }}
        >
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-[var(--brand-primary)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Anomaly Threshold Configuration
            </h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]">
              <div>
                <span className="font-medium text-[var(--text-primary)] block">Excessive Idle Alert Threshold</span>
                <span className="text-[11px] text-[var(--text-tertiary)]">Flag asset if daily idle ratio exceeds threshold</span>
              </div>
              <span className="font-mono font-bold text-[var(--text-accent)]">&gt; 8.0 hours / day</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--border-subtle)]">
              <div>
                <span className="font-medium text-[var(--text-primary)] block">Unassigned Asset Discovery Window</span>
                <span className="text-[11px] text-[var(--text-tertiary)]">Raise Critical severity if unassigned asset runs in idle</span>
              </div>
              <span className="font-mono font-bold text-[var(--status-critical-text)]">Immediate (0h lag)</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <span className="font-medium text-[var(--text-primary)] block">Demand Forecast Horizon</span>
                <span className="text-[11px] text-[var(--text-tertiary)]">Lookahead window for site capacity shortages</span>
              </div>
              <span className="font-mono font-bold text-[var(--text-primary)]">7 Days (Weekly cycle)</span>
            </div>
          </div>
        </div>

        {/* Backend API Integration Readiness */}
        <div
          className="p-5 rounded-md border border-[var(--border-default)] space-y-3"
          style={{ background: "var(--surface-secondary)" }}
        >
          <div className="flex items-center gap-2">
            <Database size={16} className="text-[var(--status-info-text)]" />
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              Backend Integration Readiness
            </h2>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Data layer is structured via <code className="text-[var(--brand-primary)]">lib/api/*</code> boundaries. Replacing mock endpoints with production REST or WebSocket endpoints requires zero UI component refactoring.
          </p>
        </div>
      </div>
    </div>
  );
}
