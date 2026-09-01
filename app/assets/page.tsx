"use client";

import { useEffect, useState } from "react";
import { getAssets } from "@/lib/api/assets";
import { AssetTable } from "@/components/assets/AssetTable";
import type { Asset } from "@/types";
import { Package, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const data = await getAssets();
    setAssets(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Package size={18} className="text-[var(--brand-primary)]" />
            Asset Fleet Directory
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Complete inventory tracking, telemetry health, and real-time operational risk
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--interactive-hover)] transition-colors"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            href="/rentals"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-[var(--brand-primary)] text-[var(--text-inverse)] hover:bg-[var(--brand-hover)] transition-colors"
          >
            <Plus size={13} />
            New Rental Checkout
          </Link>
        </div>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="space-y-3">
          <div className="skeleton h-10 w-full rounded-md" />
          <div className="skeleton h-96 w-full rounded-md" />
        </div>
      ) : (
        <AssetTable assets={assets} />
      )}
    </div>
  );
}
