import type { Anomaly } from "@/types";
import { ANOMALIES } from "@/lib/mock-data/anomalies";

export async function getAnomalies(): Promise<Anomaly[]> {
  await new Promise((r) => setTimeout(r, 250));
  // Sort: CRITICAL > HIGH > WARNING > INFO, unresolved first
  const severityOrder = { CRITICAL: 0, HIGH: 1, WARNING: 2, INFO: 3 };
  return [...ANOMALIES]
    .filter((a) => !a.isResolved)
    .sort((a, b) => (severityOrder[a.severity] ?? 4) - (severityOrder[b.severity] ?? 4));
}

export async function getAnomalyById(id: string): Promise<Anomaly | null> {
  await new Promise((r) => setTimeout(r, 100));
  return ANOMALIES.find((a) => a.id === id) ?? null;
}

export async function getAnomaliesForAsset(assetId: string): Promise<Anomaly[]> {
  await new Promise((r) => setTimeout(r, 100));
  return ANOMALIES.filter((a) => a.assetId === assetId && !a.isResolved);
}

export async function resolveAnomaly(id: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 200));
  const idx = ANOMALIES.findIndex((a) => a.id === id);
  if (idx === -1) return false;
  ANOMALIES[idx].isResolved = true;
  ANOMALIES[idx].resolvedAt = new Date().toISOString();
  return true;
}
