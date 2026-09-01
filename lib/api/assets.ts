// ============================================================
// API Layer — Assets
// Currently mock-backed. Replace with real API calls later:
//   GET /api/assets
//   GET /api/assets/:id
// ============================================================
import type { Asset, AssetFilters, PaginatedResponse } from "@/types";
import { ASSETS } from "@/lib/mock-data/assets";

export async function getAssets(filters?: Partial<AssetFilters>): Promise<Asset[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300));

  let result = [...ASSETS];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.id.toLowerCase().includes(q) ||
        a.equipmentTypeName.toLowerCase().includes(q) ||
        (a.siteId?.toLowerCase().includes(q) ?? false) ||
        (a.siteName?.toLowerCase().includes(q) ?? false) ||
        (a.operatorName?.toLowerCase().includes(q) ?? false)
    );
  }

  if (filters?.status && filters.status !== "ALL") {
    result = result.filter((a) => a.status === filters.status);
  }

  if (filters?.equipmentTypeId != null) {
    result = result.filter((a) => a.equipmentTypeId === filters.equipmentTypeId);
  }

  if (filters?.siteId) {
    result = result.filter((a) => a.siteId === filters.siteId);
  }

  if (filters?.riskLevel && filters.riskLevel !== "ALL") {
    result = result.filter((a) => a.riskLevel === filters.riskLevel);
  }

  // Sort: CRITICAL first, then HIGH, MEDIUM, LOW
  const riskOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  result.sort((a, b) => (riskOrder[a.riskLevel] ?? 4) - (riskOrder[b.riskLevel] ?? 4));

  return result;
}

export async function getAsset(id: string): Promise<Asset | null> {
  await new Promise((r) => setTimeout(r, 150));
  return ASSETS.find((a) => a.id === id) ?? null;
}

export async function getAssetsPaginated(
  filters: Partial<AssetFilters>,
  page: number,
  pageSize: number
): Promise<PaginatedResponse<Asset>> {
  const all = await getAssets(filters);
  const total = all.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = all.slice(start, start + pageSize);
  return { data, total, page, pageSize, totalPages };
}

export async function updateAssetStatus(
  id: string,
  updates: Partial<Pick<Asset, "status" | "siteId" | "siteName" | "operatorId" | "operatorName">>
): Promise<Asset | null> {
  await new Promise((r) => setTimeout(r, 200));
  const idx = ASSETS.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  Object.assign(ASSETS[idx], updates);
  return ASSETS[idx];
}

export async function getFleetSummary() {
  await new Promise((r) => setTimeout(r, 200));
  const total = ASSETS.length;
  const active = ASSETS.filter((a) => a.status === "ACTIVE").length;
  const idle = ASSETS.filter((a) => a.status === "IDLE").length;
  const overdue = ASSETS.filter((a) => a.status === "OVERDUE").length;
  const unassigned = ASSETS.filter((a) => a.status === "UNASSIGNED").length;
  const returnDue = ASSETS.filter((a) => a.status === "RETURN_DUE").length;
  const avgUtilization = Math.round(
    ASSETS.reduce((sum, a) => sum + a.utilizationPct, 0) / total
  );
  const criticalRisk = ASSETS.filter((a) => a.riskLevel === "CRITICAL").length;
  const highRisk = ASSETS.filter((a) => a.riskLevel === "HIGH").length;
  const potentialCostAtRisk = (overdue + unassigned) * 1400 + criticalRisk * 800;

  return {
    total,
    active,
    idle,
    overdue,
    unassigned,
    returnDue,
    avgUtilization,
    criticalRisk,
    highRisk,
    anomalyCount: criticalRisk + highRisk,
    potentialCostAtRisk,
    updatedAt: new Date().toISOString(),
  };
}
