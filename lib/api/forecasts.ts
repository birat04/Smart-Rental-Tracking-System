import type { DemandForecast } from "@/types";
import { FORECASTS } from "@/lib/mock-data/forecasts";

export async function getForecasts(): Promise<DemandForecast[]> {
  await new Promise((r) => setTimeout(r, 300));
  return [...FORECASTS].sort((a, b) => b.expectedShortage - a.expectedShortage);
}

export async function getForecastById(id: string): Promise<DemandForecast | null> {
  await new Promise((r) => setTimeout(r, 100));
  return FORECASTS.find((f) => f.id === id) ?? null;
}

export async function getForecastsForSite(siteId: string): Promise<DemandForecast[]> {
  await new Promise((r) => setTimeout(r, 100));
  return FORECASTS.filter((f) => f.siteId === siteId);
}
