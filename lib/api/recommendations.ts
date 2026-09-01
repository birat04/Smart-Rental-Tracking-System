import type { Recommendation } from "@/types";
import { RECOMMENDATIONS } from "@/lib/mock-data/recommendations";

export async function getRecommendations(): Promise<Recommendation[]> {
  await new Promise((r) => setTimeout(r, 250));
  const severityOrder = { CRITICAL: 0, HIGH: 1, WARNING: 2, INFO: 3 };
  return [...RECOMMENDATIONS]
    .filter((r) => r.status === "PENDING")
    .sort((a, b) => (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4));
}

export async function getRecommendationById(id: string): Promise<Recommendation | null> {
  await new Promise((r) => setTimeout(r, 100));
  return RECOMMENDATIONS.find((r) => r.id === id) ?? null;
}

export async function getRecommendationsForAsset(assetId: string): Promise<Recommendation[]> {
  await new Promise((r) => setTimeout(r, 100));
  return RECOMMENDATIONS.filter((r) => r.assetId === assetId && r.status === "PENDING");
}

export async function applyRecommendation(id: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 500));
  const idx = RECOMMENDATIONS.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  RECOMMENDATIONS[idx].status = "APPLIED";
  RECOMMENDATIONS[idx].appliedAt = new Date().toISOString();
  return true;
}

export async function dismissRecommendation(id: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 200));
  const idx = RECOMMENDATIONS.findIndex((r) => r.id === id);
  if (idx === -1) return false;
  RECOMMENDATIONS[idx].status = "DISMISSED";
  return true;
}
