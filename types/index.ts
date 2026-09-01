// ============================================================
// CATERPILLAR SMART RENTAL TRACKING SYSTEM — TYPE DEFINITIONS
// All interfaces are backend-ready (swappable with real API)
// ============================================================

// ─── EQUIPMENT TYPES ─────────────────────────────────────────────────────────

export const EQUIPMENT_TYPE_MAP: Record<number, string> = {
  0: "Dump Truck",
  1: "Excavator",
  2: "Motor Grader",
  3: "Roller",
  4: "Crane Manipulator",
  5: "Gazelle",
  6: "Forklift Standard",
  7: "Bucket Loader Big",
  8: "Mixer",
  9: "Tanker",
  10: "Bulldozer",
  11: "Cleaning Equipment",
  12: "Truck",
  13: "Trailer",
  14: "Forklift Giraffe",
  15: "Bucket Loader Standard",
  16: "Autocrane",
};

export interface EquipmentType {
  id: number;
  name: string;
}

// ─── SITE ────────────────────────────────────────────────────────────────────

export interface Site {
  id: string;           // e.g. "S001"
  name: string;         // e.g. "North Quarry Alpha"
  location: string;     // human-readable city/region
  lat: number;
  lng: number;
  activeAssets: number;
  demandLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

// ─── OPERATOR ────────────────────────────────────────────────────────────────

export interface Operator {
  id: string;           // e.g. "OP101"
  name: string;
  role: string;
  site: string | null;
  contact: string;
}

// ─── ASSET STATUS & RISK ─────────────────────────────────────────────────────

export type AssetStatus =
  | "ACTIVE"
  | "IDLE"
  | "OVERDUE"
  | "UNASSIGNED"
  | "RETURN_DUE"
  | "UNKNOWN";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type AssetCondition = "EXCELLENT" | "GOOD" | "FAIR" | "DAMAGED";

// ─── ASSET ───────────────────────────────────────────────────────────────────

export interface Asset {
  id: string;                         // e.g. "EQX1007"
  equipmentTypeId: number;
  equipmentTypeName: string;
  status: AssetStatus;
  riskLevel: RiskLevel;
  siteId: string | null;
  siteName: string | null;
  operatorId: string | null;
  operatorName: string | null;
  rentalStartDate: string;            // ISO 8601
  expectedReturnDate: string;         // ISO 8601
  actualReturnDate: string | null;    // ISO 8601
  engineHoursPerDay: number;          // from telemetry
  idleHoursPerDay: number;
  operatingDays: number;
  totalEngineHours: number;
  totalIdleHours: number;
  utilizationPct: number;             // 0–100
  fuelLevelPct: number | null;        // 0–100
  condition: AssetCondition;
  lat: number | null;
  lng: number | null;
  lastTelemetryAt: string | null;     // ISO 8601
  notes: string | null;
}

// ─── RENTAL ──────────────────────────────────────────────────────────────────

export type RentalStatus = "ACTIVE" | "RETURNED" | "OVERDUE" | "EXTENDED";

export interface Rental {
  id: string;
  assetId: string;
  siteId: string | null;
  siteName: string | null;
  operatorId: string | null;
  operatorName: string | null;
  startDate: string;
  expectedReturnDate: string;
  actualReturnDate: string | null;
  status: RentalStatus;
  initialCondition: AssetCondition;
  finalCondition: AssetCondition | null;
  startEngineHours: number;
  endEngineHours: number | null;
  dailyCostUsd: number | null;
  totalCostUsd: number | null;
  extensionRiskPct: number;           // 0–100
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── RENTAL EVENT (timeline) ─────────────────────────────────────────────────

export type RentalEventType =
  | "CHECKOUT"
  | "ASSIGNMENT"
  | "LOCATION_UPDATE"
  | "USAGE_LOG"
  | "ALERT"
  | "ANOMALY"
  | "RECOMMENDATION"
  | "CHECKIN"
  | "EXTENSION"
  | "CONDITION_UPDATE";

export interface RentalEvent {
  id: string;
  rentalId: string;
  assetId: string;
  type: RentalEventType;
  title: string;
  description: string;
  timestamp: string;                  // ISO 8601
  severity?: "INFO" | "WARNING" | "HIGH" | "CRITICAL";
  metadata?: Record<string, unknown>;
}

// ─── TELEMETRY ───────────────────────────────────────────────────────────────

export interface TelemetryPoint {
  timestamp: string;                  // ISO 8601
  engineHours: number;
  idleHours: number;
  fuelLevelPct: number;
  lat: number | null;
  lng: number | null;
  speedKph: number | null;
}

export interface AssetTelemetry {
  assetId: string;
  points: TelemetryPoint[];           // ordered oldest→newest
  lastUpdatedAt: string;
  isSimulated: boolean;
}

// ─── ANOMALY ─────────────────────────────────────────────────────────────────

export type AnomalyType =
  | "UNASSIGNED_ASSET"
  | "EXCESSIVE_IDLE"
  | "ZERO_RUNTIME"
  | "MISSING_OPERATOR"
  | "MISSING_SITE"
  | "OVERDUE_RENTAL"
  | "UNUSUAL_MOVEMENT"
  | "UNEXPECTED_UTILIZATION"
  | "DATA_QUALITY";

export type AnomalySeverity = "INFO" | "WARNING" | "HIGH" | "CRITICAL";

export interface AnomalySignal {
  label: string;
  value: string;
  severity: "neutral" | "warning" | "critical";
}

export interface Anomaly {
  id: string;
  assetId: string;
  assetName: string;                  // equipment type display name
  type: AnomalyType;
  severity: AnomalySeverity;
  title: string;
  description: string;
  signals: AnomalySignal[];
  detectedAt: string;                 // ISO 8601
  resolvedAt: string | null;
  isResolved: boolean;
  recommendationId: string | null;    // linked recommendation
}

// ─── FORECAST ────────────────────────────────────────────────────────────────

export interface ForecastPoint {
  date: string;                       // ISO date
  value: number;
  isForecasted: boolean;
  confidenceLow?: number;
  confidenceHigh?: number;
}

export interface DemandForecast {
  id: string;
  siteId: string;
  siteName: string;
  equipmentTypeId: number;
  equipmentTypeName: string;
  currentDemand: number;
  forecastedDemand: number;
  forecastHorizonDays: number;
  expectedShortage: number;
  confidencePct: number;
  signals: string[];
  generatedAt: string;
  dataPoints: ForecastPoint[];
}

// ─── RECOMMENDATION ──────────────────────────────────────────────────────────

export type RecommendationType =
  | "REASSIGN"
  | "RETURN"
  | "EXTEND"
  | "PRE_POSITION"
  | "INVESTIGATE"
  | "MONITOR";

export type RecommendationStatus =
  | "PENDING"
  | "APPLIED"
  | "DISMISSED"
  | "EXPIRED";

export interface RecommendationImpact {
  metric: string;
  before: string;
  after: string;
  delta: string;
  positive: boolean;
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  severity: AnomalySeverity;
  assetId: string;
  assetName: string;
  title: string;
  description: string;
  rationale: string;
  signals: string[];
  confidencePct: number;
  expectedImpacts: RecommendationImpact[];
  estimatedCostAvoidedUsd: number | null;
  status: RecommendationStatus;
  linkedAnomalyId: string | null;
  generatedAt: string;
  expiresAt: string | null;
  appliedAt: string | null;
}

// ─── NOTIFICATION ────────────────────────────────────────────────────────────

export type NotificationType =
  | "ANOMALY"
  | "OVERDUE"
  | "RETURN_DUE"
  | "RECOMMENDATION"
  | "FORECAST"
  | "SYSTEM";

export interface Notification {
  id: string;
  type: NotificationType;
  severity: AnomalySeverity;
  title: string;
  description: string;
  assetId: string | null;
  linkHref: string | null;
  isRead: boolean;
  createdAt: string;
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

export interface FleetAnalytics {
  totalAssets: number;
  activeAssets: number;
  idleAssets: number;
  overdueAssets: number;
  unassignedAssets: number;
  averageUtilizationPct: number;
  totalAnomalies: number;
  potentialCostAtRiskUsd: number;
  estimatedCostAvoidedUsd: number;
  totalIdleHours: number;
  rentalOverruns: number;
  updatedAt: string;
}

export interface SiteAnalytics {
  siteId: string;
  siteName: string;
  assetCount: number;
  utilizationPct: number;
  idleHours: number;
  demandLevel: Site["demandLevel"];
}

export interface EquipmentAnalytics {
  equipmentTypeId: number;
  equipmentTypeName: string;
  assetCount: number;
  utilizationPct: number;
  avgIdleHoursPerDay: number;
  anomalyCount: number;
}

// ─── API RESPONSE WRAPPERS ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── FILTER STATE ────────────────────────────────────────────────────────────

export interface AssetFilters {
  search: string;
  status: AssetStatus | "ALL";
  equipmentTypeId: number | null;
  siteId: string | null;
  riskLevel: RiskLevel | "ALL";
  operatorId: string | null;
}

export interface RentalFilters {
  search: string;
  status: RentalStatus | "ALL";
  siteId: string | null;
  dateRange: { from: string | null; to: string | null };
}
