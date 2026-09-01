import type { AssetStatus, RiskLevel, AnomalySeverity } from "@/types";

// ─── STATUS UTILITIES ─────────────────────────────────────────────────────────

export function getStatusConfig(status: AssetStatus) {
  const configs = {
    ACTIVE: {
      label: "Active",
      dotColor: "bg-green-500",
      textColor: "text-[var(--status-active-text)]",
      bgColor: "bg-[var(--status-active-bg)]",
      borderColor: "border-[var(--status-active-border)]",
      icon: "●",
    },
    IDLE: {
      label: "Idle",
      dotColor: "bg-amber-500",
      textColor: "text-[var(--status-warning-text)]",
      bgColor: "bg-[var(--status-warning-bg)]",
      borderColor: "border-[var(--status-warning-border)]",
      icon: "◐",
    },
    OVERDUE: {
      label: "Overdue",
      dotColor: "bg-red-500",
      textColor: "text-[var(--status-critical-text)]",
      bgColor: "bg-[var(--status-critical-bg)]",
      borderColor: "border-[var(--status-critical-border)]",
      icon: "◆",
    },
    UNASSIGNED: {
      label: "Unassigned",
      dotColor: "bg-red-500",
      textColor: "text-[var(--status-critical-text)]",
      bgColor: "bg-[var(--status-critical-bg)]",
      borderColor: "border-[var(--status-critical-border)]",
      icon: "○",
    },
    RETURN_DUE: {
      label: "Return Due",
      dotColor: "bg-amber-400",
      textColor: "text-[var(--status-warning-text)]",
      bgColor: "bg-[var(--status-warning-bg)]",
      borderColor: "border-[var(--status-warning-border)]",
      icon: "⏰",
    },
    UNKNOWN: {
      label: "Unknown",
      dotColor: "bg-blue-500",
      textColor: "text-[var(--status-info-text)]",
      bgColor: "bg-[var(--status-info-bg)]",
      borderColor: "border-[var(--status-info-border)]",
      icon: "?",
    },
  };
  return configs[status] ?? configs.UNKNOWN;
}

// ─── RISK UTILITIES ───────────────────────────────────────────────────────────

export function getRiskConfig(risk: RiskLevel) {
  const configs = {
    LOW: {
      label: "Low",
      textColor: "text-[var(--status-active-text)]",
      bgColor: "bg-[var(--status-active-bg)]",
      borderColor: "border-[var(--status-active-border)]",
    },
    MEDIUM: {
      label: "Medium",
      textColor: "text-[var(--status-warning-text)]",
      bgColor: "bg-[var(--status-warning-bg)]",
      borderColor: "border-[var(--status-warning-border)]",
    },
    HIGH: {
      label: "High",
      textColor: "text-[var(--status-critical-text)]",
      bgColor: "bg-[var(--status-critical-bg)]",
      borderColor: "border-[var(--status-critical-border)]",
    },
    CRITICAL: {
      label: "Critical",
      textColor: "text-[var(--status-critical-text)]",
      bgColor: "bg-[var(--status-critical-bg)]",
      borderColor: "border-[var(--status-critical-border)]",
    },
  };
  return configs[risk];
}

// ─── SEVERITY UTILITIES ───────────────────────────────────────────────────────

export function getSeverityConfig(severity: AnomalySeverity) {
  const configs = {
    INFO: {
      label: "Info",
      textColor: "text-[var(--status-info-text)]",
      bgColor: "bg-[var(--status-info-bg)]",
      borderColor: "border-[var(--status-info-border)]",
      leftBorderColor: "border-l-[var(--status-info-dot)]",
    },
    WARNING: {
      label: "Warning",
      textColor: "text-[var(--status-warning-text)]",
      bgColor: "bg-[var(--status-warning-bg)]",
      borderColor: "border-[var(--status-warning-border)]",
      leftBorderColor: "border-l-[var(--status-warning-dot)]",
    },
    HIGH: {
      label: "High",
      textColor: "text-[var(--status-critical-text)]",
      bgColor: "bg-[var(--status-critical-bg)]",
      borderColor: "border-[var(--status-critical-border)]",
      leftBorderColor: "border-l-[var(--status-critical-dot)]",
    },
    CRITICAL: {
      label: "Critical",
      textColor: "text-[var(--status-critical-text)]",
      bgColor: "bg-[var(--status-critical-bg)]",
      borderColor: "border-[var(--status-critical-border)]",
      leftBorderColor: "border-l-[var(--status-critical-dot)]",
    },
  };
  return configs[severity];
}
