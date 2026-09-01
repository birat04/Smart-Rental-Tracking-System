import type { Anomaly } from "@/types";

export const ANOMALIES: Anomaly[] = [
  // ── HERO SCENARIO: EQX1007 ─────────────────────────────────────────────────
  {
    id: "ANO-001",
    assetId: "EQX1007",
    assetName: "Excavator",
    type: "UNASSIGNED_ASSET",
    severity: "CRITICAL",
    title: "Unassigned Asset with Excessive Idle Time",
    description:
      "EQX1007 has been running for 12 days with zero engine hours and 12 hours of idle time per day. No site assignment, no operator assignment. Asset is accumulating rental cost with zero productive output.",
    signals: [
      { label: "Site Assignment",  value: "None",         severity: "critical" },
      { label: "Operator",         value: "None",         severity: "critical" },
      { label: "Engine Hours/Day", value: "0h",           severity: "critical" },
      { label: "Idle Hours/Day",   value: "12h",          severity: "critical" },
      { label: "Operating Days",   value: "12 days",      severity: "warning"  },
      { label: "Total Idle Hours", value: "144h",         severity: "critical" },
    ],
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolvedAt: null,
    isResolved: false,
    recommendationId: "REC-001",
  },
  // ── EQX1002: Unassigned Crane ──────────────────────────────────────────────
  {
    id: "ANO-002",
    assetId: "EQX1002",
    assetName: "Crane Manipulator",
    type: "ZERO_RUNTIME",
    severity: "HIGH",
    title: "Zero Runtime — Crane with No Assignment",
    description:
      "EQX1002 has logged zero engine hours across 20 operating days. Both site and operator assignments are missing. Return was expected 155 days ago.",
    signals: [
      { label: "Site Assignment",  value: "None",         severity: "critical" },
      { label: "Operator",         value: "None",         severity: "critical" },
      { label: "Engine Hours/Day", value: "0h",           severity: "critical" },
      { label: "Idle Hours/Day",   value: "11h",          severity: "warning"  },
      { label: "Days Overdue",     value: "155 days",     severity: "critical" },
    ],
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: null,
    isResolved: false,
    recommendationId: "REC-002",
  },
  // ── EQX1009: Overdue Roller ────────────────────────────────────────────────
  {
    id: "ANO-003",
    assetId: "EQX1009",
    assetName: "Roller",
    type: "OVERDUE_RENTAL",
    severity: "HIGH",
    title: "Rental Return Overdue by 5 Days",
    description:
      "EQX1009 at Lakefront Development was due back 5 days ago. Site contact has not confirmed return. Risk of unauthorized rental extension.",
    signals: [
      { label: "Expected Return",  value: "5 days ago",   severity: "critical" },
      { label: "Site",             value: "S005",         severity: "neutral"  },
      { label: "Operator",         value: "Amos Kariuki", severity: "neutral"  },
      { label: "Fuel Level",       value: "28%",          severity: "warning"  },
    ],
    detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: null,
    isResolved: false,
    recommendationId: "REC-003",
  },
  // ── EQX1012: Overdue Tanker ────────────────────────────────────────────────
  {
    id: "ANO-004",
    assetId: "EQX1012",
    assetName: "Tanker",
    type: "OVERDUE_RENTAL",
    severity: "HIGH",
    title: "Rental Return Overdue — Critical Fuel Level",
    description:
      "EQX1012 is 3 days past return date and has only 15% fuel remaining. Risk of equipment damage if fuel is not replenished.",
    signals: [
      { label: "Expected Return",  value: "3 days ago",   severity: "critical" },
      { label: "Fuel Level",       value: "15% — critical", severity: "critical" },
      { label: "Utilization",      value: "50%",          severity: "warning"  },
      { label: "Idle Hours",       value: "152h total",   severity: "warning"  },
    ],
    detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: null,
    isResolved: false,
    recommendationId: "REC-004",
  },
  // ── EQX1001: High Idle ─────────────────────────────────────────────────────
  {
    id: "ANO-005",
    assetId: "EQX1001",
    assetName: "Excavator",
    type: "EXCESSIVE_IDLE",
    severity: "WARNING",
    title: "High Idle-to-Runtime Ratio",
    description:
      "EQX1001 has an unusual 87% idle time ratio (10h idle vs 1.5h engine per day). Equipment is assigned and at site but not being productive.",
    signals: [
      { label: "Engine Hours/Day", value: "1.5h",         severity: "warning"  },
      { label: "Idle Hours/Day",   value: "10h (87%)",    severity: "critical" },
      { label: "Utilization",      value: "13%",          severity: "critical" },
      { label: "Site",             value: "S003 — Eastfield", severity: "neutral" },
    ],
    detectedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    resolvedAt: null,
    isResolved: false,
    recommendationId: null,
  },
  // ── EQX1004: Low Utilization ───────────────────────────────────────────────
  {
    id: "ANO-006",
    assetId: "EQX1004",
    assetName: "Excavator",
    type: "UNEXPECTED_UTILIZATION",
    severity: "WARNING",
    title: "Below-Threshold Utilization (18%)",
    description:
      "EQX1004 at Northgate Infrastructure has only 18% utilization (2h/day engine, 9h/day idle) over 10 operating days. Site demand appears lower than expected.",
    signals: [
      { label: "Engine Hours/Day", value: "2h",           severity: "warning"  },
      { label: "Idle Hours/Day",   value: "9h",           severity: "warning"  },
      { label: "Utilization",      value: "18%",          severity: "critical" },
      { label: "Site Demand",      value: "LOW",          severity: "neutral"  },
    ],
    detectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    resolvedAt: null,
    isResolved: false,
    recommendationId: null,
  },
];
