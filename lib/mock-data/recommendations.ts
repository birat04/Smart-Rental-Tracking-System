import type { Recommendation } from "@/types";

export const RECOMMENDATIONS: Recommendation[] = [
  // ── HERO: Reassign EQX1007 → S003 ─────────────────────────────────────────
  {
    id: "REC-001",
    type: "REASSIGN",
    severity: "CRITICAL",
    assetId: "EQX1007",
    assetName: "Excavator EQX1007",
    title: "Reassign EQX1007 to Site S003 — Eastfield Construction Hub",
    description:
      "EQX1007 is an unassigned excavator generating zero productive output. Site S003 has high forecasted excavator demand next week. Reassigning will eliminate idle cost and satisfy site demand.",
    rationale:
      "EQX1007 has accumulated 144 hours of idle time with no engine usage across 12 days. Concurrently, S003 is forecasted to require 6 excavators next week (+2 above current capacity). Reassigning EQX1007 eliminates idle cost and positions the asset for high-demand deployment.",
    signals: [
      "EQX1007 has no site or operator assignment",
      "EQX1007: 0 engine hours/day, 12h idle/day for 12 days",
      "S003 current excavator demand: 4 units",
      "S003 forecasted demand next week: 6 units (+2 shortage)",
      "No other unassigned excavators within 50km of S003",
    ],
    confidencePct: 87,
    expectedImpacts: [
      { metric: "EQX1007 Idle Hours",    before: "144h total",  after: "Eliminated",    delta: "-144h",    positive: true  },
      { metric: "S003 Excavator Demand", before: "Shortfall 2", after: "Satisfied",      delta: "+2 units", positive: true  },
      { metric: "Fleet Utilization",     before: "62%",          after: "81%",            delta: "+19%",     positive: true  },
      { metric: "Rental Extension Risk", before: "HIGH",         after: "LOW",            delta: "Reduced",  positive: true  },
    ],
    estimatedCostAvoidedUsd: 2800,
    status: "PENDING",
    linkedAnomalyId: "ANO-001",
    generatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    appliedAt: null,
  },
  // ── Investigate EQX1002 (overdue, unassigned crane) ────────────────────────
  {
    id: "REC-002",
    type: "INVESTIGATE",
    severity: "HIGH",
    assetId: "EQX1002",
    assetName: "Crane Manipulator EQX1002",
    title: "Investigate EQX1002 — Overdue, Unassigned, Zero Runtime",
    description:
      "EQX1002 is 155 days overdue with no site, no operator, and zero engine hours logged. Location is unknown. Immediate investigation required.",
    rationale:
      "The combination of overdue status, missing assignment, and unknown location creates significant asset visibility risk. This asset may be lost, misplaced, or improperly documented.",
    signals: [
      "Return date was 155 days ago",
      "No site or operator assignment on record",
      "Zero engine hours across 20 operating days",
      "Telemetry last received 3 days ago",
      "Location unknown — no GPS data",
    ],
    confidencePct: 95,
    expectedImpacts: [
      { metric: "Asset Visibility",     before: "Unknown",     after: "Located",       delta: "Resolved",   positive: true  },
      { metric: "Overdue Risk",          before: "CRITICAL",    after: "Managed",       delta: "Reduced",    positive: true  },
    ],
    estimatedCostAvoidedUsd: 4200,
    status: "PENDING",
    linkedAnomalyId: "ANO-002",
    generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
    appliedAt: null,
  },
  // ── Contact S005 to return EQX1009 ─────────────────────────────────────────
  {
    id: "REC-003",
    type: "RETURN",
    severity: "HIGH",
    assetId: "EQX1009",
    assetName: "Roller EQX1009",
    title: "Initiate Return of EQX1009 from S005",
    description:
      "EQX1009 at Lakefront Development is 5 days overdue. Contact site manager to coordinate immediate return or formally extend the rental period.",
    rationale:
      "Rental overrun by 5 days is generating unauthorized charges. Site manager must confirm return timeline or request a formal extension to stop cost accumulation.",
    signals: [
      "5 days past expected return date",
      "No return confirmation from site",
      "Equipment still operational at site",
      "Daily cost accumulating without authorization",
    ],
    confidencePct: 98,
    expectedImpacts: [
      { metric: "Overdue Days",          before: "5 days",      after: "0 days",        delta: "-5 days",    positive: true  },
      { metric: "Unauthorized Cost",     before: "Accumulating", after: "Stopped",       delta: "Stopped",    positive: true  },
    ],
    estimatedCostAvoidedUsd: 750,
    status: "PENDING",
    linkedAnomalyId: "ANO-003",
    generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expiresAt: null,
    appliedAt: null,
  },
  // ── Pre-position excavators at S003 ────────────────────────────────────────
  {
    id: "REC-004",
    type: "PRE_POSITION",
    severity: "HIGH",
    assetId: "EQX1007",
    assetName: "Fleet — Excavator",
    title: "Pre-Position 2 Excavators at S003 for Next Week",
    description:
      "S003 demand forecast shows a shortage of 2 excavators next week (6 required, 4 available). Pre-positioning EQX1007 and one additional unit will prevent operational disruption.",
    rationale:
      "Historical patterns at S003 confirm increased excavator demand in weeks 3–4 of active construction phases. The current forecast has 87% confidence. Acting now prevents a reactive scramble next week.",
    signals: [
      "S003 current excavator fleet: 4 units",
      "7-day demand forecast: 6 units (87% confidence)",
      "EQX1007 unassigned and available",
      "Next-nearest available excavator: EQX1004 at S004 (low demand)",
    ],
    confidencePct: 87,
    expectedImpacts: [
      { metric: "S003 Excavator Supply", before: "4 units",     after: "6 units",       delta: "+2 units",   positive: true  },
      { metric: "Demand Coverage",       before: "67%",          after: "100%",           delta: "+33%",       positive: true  },
      { metric: "Operational Risk",      before: "HIGH",         after: "LOW",            delta: "Reduced",    positive: true  },
    ],
    estimatedCostAvoidedUsd: 1800,
    status: "PENDING",
    linkedAnomalyId: null,
    generatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    appliedAt: null,
  },
  // ── Monitor EQX1034 — return due tomorrow ──────────────────────────────────
  {
    id: "REC-005",
    type: "MONITOR",
    severity: "WARNING",
    assetId: "EQX1034",
    assetName: "Excavator EQX1034",
    title: "Monitor EQX1034 — Return Due Tomorrow, 72% Extension Probability",
    description:
      "EQX1034 is due back tomorrow. Historical patterns indicate 72% probability of extension requests for this site and equipment type combination. Proactively contact site S003.",
    rationale:
      "S003 typically extends excavator rentals during active phases. EQX1034 has been productive (60% utilization) and the site may resist returning it mid-project.",
    signals: [
      "Return due in less than 24 hours",
      "S003 historically requests excavator extensions 72% of the time",
      "Current utilization: 60% (asset in use)",
      "S003 demand is forecasted to stay HIGH next week",
    ],
    confidencePct: 72,
    expectedImpacts: [
      { metric: "Extension Risk",        before: "72%",          after: "Managed",       delta: "Reduced",    positive: true  },
      { metric: "Rental Cost Clarity",   before: "Uncertain",    after: "Confirmed",     delta: "Resolved",   positive: true  },
    ],
    estimatedCostAvoidedUsd: 420,
    status: "PENDING",
    linkedAnomalyId: null,
    generatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    appliedAt: null,
  },
];
