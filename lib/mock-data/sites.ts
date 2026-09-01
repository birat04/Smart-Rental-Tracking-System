// ============================================================
// SITES mock data
// ============================================================
import type { Site } from "@/types";

export const SITES: Site[] = [
  {
    id: "S001",
    name: "Riverside Quarry",
    location: "Springfield, IL",
    lat: 39.7817,
    lng: -89.6501,
    activeAssets: 4,
    demandLevel: "MEDIUM",
  },
  {
    id: "S002",
    name: "Highland Cut Site",
    location: "Peoria, IL",
    lat: 40.6936,
    lng: -89.5890,
    activeAssets: 3,
    demandLevel: "MEDIUM",
  },
  {
    id: "S003",
    name: "Eastfield Construction Hub",
    location: "Champaign, IL",
    lat: 40.1164,
    lng: -88.2434,
    activeAssets: 5,
    demandLevel: "HIGH",          // PRIMARY FORECAST SCENARIO
  },
  {
    id: "S004",
    name: "Northgate Infrastructure",
    location: "Rockford, IL",
    lat: 42.2711,
    lng: -89.0937,
    activeAssets: 2,
    demandLevel: "LOW",
  },
  {
    id: "S005",
    name: "Lakefront Development",
    location: "Waukegan, IL",
    lat: 42.3636,
    lng: -87.8448,
    activeAssets: 3,
    demandLevel: "MEDIUM",
  },
  {
    id: "S006",
    name: "Southern Corridor Project",
    location: "Carbondale, IL",
    lat: 37.7273,
    lng: -89.2168,
    activeAssets: 4,
    demandLevel: "LOW",
  },
];
