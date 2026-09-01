import type { DemandForecast, ForecastPoint } from "@/types";

// Generate 30 days of history + 7 days of forecast
function generateForecastPoints(
  baseValue: number,
  forecastValue: number,
  days = 37
): ForecastPoint[] {
  const today = new Date("2025-09-01");
  const points: ForecastPoint[] = [];

  for (let i = -30; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const isForecasted = i > 0;

    let value: number;
    if (!isForecasted) {
      // Historical: slightly vary around baseValue
      const noise = (Math.sin(i * 0.7) * 0.8 + Math.cos(i * 0.4) * 0.5);
      value = Math.max(0, Math.round((baseValue + noise) * 10) / 10);
    } else {
      // Forecast: ramp toward forecastValue
      const progress = i / 7;
      value = baseValue + (forecastValue - baseValue) * progress;
      value = Math.round(value * 10) / 10;
    }

    points.push({
      date: date.toISOString().split("T")[0],
      value,
      isForecasted,
      confidenceLow: isForecasted ? value * 0.82 : undefined,
      confidenceHigh: isForecasted ? value * 1.18 : undefined,
    });
  }

  return points;
}

export const FORECASTS: DemandForecast[] = [
  // ── PRIMARY SCENARIO: S003 Excavator shortage ─────────────────────────────
  {
    id: "FCST-001",
    siteId: "S003",
    siteName: "Eastfield Construction Hub",
    equipmentTypeId: 1,
    equipmentTypeName: "Excavator",
    currentDemand: 4,
    forecastedDemand: 6,
    forecastHorizonDays: 7,
    expectedShortage: 2,
    confidencePct: 87,
    signals: [
      "Historical demand at S003 peaks in construction weeks 3–4",
      "Active excavation contract begins Sep 8 at S003",
      "Two excavators currently at underutilized sites (EQX1004, EQX1007)",
      "Weather forecast: dry conditions → high equipment activity",
      "S003 site manager confirmed additional excavation scope",
    ],
    generatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    dataPoints: generateForecastPoints(4, 6),
  },
  // ── S001 Grader — stable demand ───────────────────────────────────────────
  {
    id: "FCST-002",
    siteId: "S001",
    siteName: "Riverside Quarry",
    equipmentTypeId: 2,
    equipmentTypeName: "Motor Grader",
    currentDemand: 2,
    forecastedDemand: 2,
    forecastHorizonDays: 7,
    expectedShortage: 0,
    confidencePct: 91,
    signals: [
      "Stable grading operations at S001",
      "No contract changes expected this week",
    ],
    generatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    dataPoints: generateForecastPoints(2, 2),
  },
  // ── S005 Roller — slight increase ─────────────────────────────────────────
  {
    id: "FCST-003",
    siteId: "S005",
    siteName: "Lakefront Development",
    equipmentTypeId: 3,
    equipmentTypeName: "Roller",
    currentDemand: 1,
    forecastedDemand: 2,
    forecastHorizonDays: 7,
    expectedShortage: 1,
    confidencePct: 74,
    signals: [
      "Paving phase begins at Lakefront Development in ~5 days",
      "One additional roller will likely be required",
      "Current roller (EQX1009) is overdue — replacement needed",
    ],
    generatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    dataPoints: generateForecastPoints(1, 2),
  },
  // ── S002 Bulldozer — stable ───────────────────────────────────────────────
  {
    id: "FCST-004",
    siteId: "S002",
    siteName: "Highland Cut Site",
    equipmentTypeId: 10,
    equipmentTypeName: "Bulldozer",
    currentDemand: 2,
    forecastedDemand: 2,
    forecastHorizonDays: 7,
    expectedShortage: 0,
    confidencePct: 88,
    signals: [
      "EQX1003 and EQX1005 covering current demand",
      "No new excavation phases expected",
    ],
    generatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    dataPoints: generateForecastPoints(2, 2),
  },
];
