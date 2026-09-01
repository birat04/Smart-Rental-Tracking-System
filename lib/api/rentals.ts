import type { Rental, RentalEvent, RentalFilters } from "@/types";
import { RENTALS, RENTAL_EVENTS } from "@/lib/mock-data/rentals";
import { updateAssetStatus } from "./assets";

export async function getRentals(filters?: Partial<RentalFilters>): Promise<Rental[]> {
  await new Promise((r) => setTimeout(r, 200));
  let list = [...RENTALS];

  if (filters?.status && filters.status !== "ALL") {
    list = list.filter((r) => r.status === filters.status);
  }

  if (filters?.siteId) {
    list = list.filter((r) => r.siteId === filters.siteId);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.assetId.toLowerCase().includes(q) ||
        (r.siteName?.toLowerCase().includes(q) ?? false) ||
        (r.operatorName?.toLowerCase().includes(q) ?? false)
    );
  }

  return list;
}

export async function getRentalById(id: string): Promise<Rental | null> {
  await new Promise((r) => setTimeout(r, 100));
  return RENTALS.find((r) => r.id === id) ?? null;
}

export async function getRentalEvents(rentalId?: string): Promise<RentalEvent[]> {
  await new Promise((r) => setTimeout(r, 150));
  let events = [...RENTAL_EVENTS];
  if (rentalId) {
    events = events.filter((e) => e.rentalId === rentalId);
  }
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export interface CheckoutPayload {
  assetId: string;
  siteId: string;
  siteName: string;
  operatorId: string;
  operatorName: string;
  startDate: string;
  expectedReturnDate: string;
  initialCondition: "EXCELLENT" | "GOOD" | "FAIR" | "DAMAGED";
  dailyCostUsd: number;
  notes?: string;
}

export async function checkoutAsset(payload: CheckoutPayload): Promise<Rental> {
  await new Promise((r) => setTimeout(r, 400));
  const newRental: Rental = {
    id: `RNT-${new Date().getFullYear()}-${String(RENTALS.length + 1).padStart(3, "0")}`,
    assetId: payload.assetId,
    siteId: payload.siteId,
    siteName: payload.siteName,
    operatorId: payload.operatorId,
    operatorName: payload.operatorName,
    startDate: payload.startDate,
    expectedReturnDate: payload.expectedReturnDate,
    actualReturnDate: null,
    status: "ACTIVE",
    initialCondition: payload.initialCondition,
    finalCondition: null,
    startEngineHours: 0,
    endEngineHours: null,
    dailyCostUsd: payload.dailyCostUsd,
    totalCostUsd: payload.dailyCostUsd * 7,
    extensionRiskPct: 15,
    notes: payload.notes ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  RENTALS.unshift(newRental);

  // Update asset status
  await updateAssetStatus(payload.assetId, {
    status: "ACTIVE",
    siteId: payload.siteId,
    siteName: payload.siteName,
    operatorId: payload.operatorId,
    operatorName: payload.operatorName,
  });

  // Log event
  RENTAL_EVENTS.unshift({
    id: `EVT-${String(RENTAL_EVENTS.length + 1).padStart(3, "0")}`,
    rentalId: newRental.id,
    assetId: payload.assetId,
    type: "CHECKOUT",
    title: `Asset ${payload.assetId} Checked Out`,
    description: `Dispatched to ${payload.siteName} with operator ${payload.operatorName}.`,
    timestamp: new Date().toISOString(),
    severity: "INFO",
  });

  return newRental;
}

export interface CheckinPayload {
  rentalId: string;
  assetId: string;
  actualReturnDate: string;
  finalCondition: "EXCELLENT" | "GOOD" | "FAIR" | "DAMAGED";
  endEngineHours: number;
  damageReported?: boolean;
  notes?: string;
}

export async function checkinAsset(payload: CheckinPayload): Promise<Rental | null> {
  await new Promise((r) => setTimeout(r, 400));
  const rental = RENTALS.find((r) => r.id === payload.rentalId);
  if (!rental) return null;

  rental.status = "RETURNED";
  rental.actualReturnDate = payload.actualReturnDate;
  rental.finalCondition = payload.finalCondition;
  rental.endEngineHours = payload.endEngineHours;
  rental.updatedAt = new Date().toISOString();

  // Reset asset status
  await updateAssetStatus(payload.assetId, {
    status: "IDLE",
  });

  // Log event
  RENTAL_EVENTS.unshift({
    id: `EVT-${String(RENTAL_EVENTS.length + 1).padStart(3, "0")}`,
    rentalId: payload.rentalId,
    assetId: payload.assetId,
    type: "CHECKIN",
    title: `Asset ${payload.assetId} Returned & Checked In`,
    description: `Final Condition: ${payload.finalCondition}. Final Engine Hours: ${payload.endEngineHours}h.`,
    timestamp: new Date().toISOString(),
    severity: "INFO",
  });

  return rental;
}
