"use client";

import { useState, useEffect } from "react";
import { getRecommendations, applyRecommendation, dismissRecommendation } from "@/lib/api/recommendations";
import { RecommendationCard } from "@/components/dashboard/RecommendationCard";
import type { Recommendation } from "@/types";
import { Lightbulb, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatting";
import { toast } from "sonner";

export default function RecommendationsPage() {
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  async function load() {
    const data = await getRecommendations();
    setRecs(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleApply(id: string) {
    setApplying(id);
    const ok = await applyRecommendation(id);
    if (ok) {
      toast.success("Recommendation applied");
      await load();
    } else {
      toast.error("Failed to apply");
    }
    setApplying(null);
  }

  async function handleDismiss(id: string) {
    await dismissRecommendation(id);
    toast("Recommendation dismissed");
    await load();
  }

  const totalSavings = recs.reduce(
    (sum, r) => sum + (r.estimatedCostAvoidedUsd ?? 0), 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Lightbulb size={18} className="text-[var(--brand-primary)]" />
            AI Recommendations
          </h1>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
            Intelligent actions to improve fleet utilization and eliminate waste
          </p>
        </div>
        {totalSavings > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md border"
            style={{
              background: "var(--status-active-bg)",
              borderColor: "var(--status-active-border)",
            }}
          >
            <TrendingDown size={14} className="text-[var(--status-active-text)]" />
            <div>
              <p className="text-label text-[9px] text-[var(--status-active-text)]">POTENTIAL SAVINGS</p>
              <p
                className="text-kpi text-[var(--status-active-text)]"
                style={{ fontSize: "1.25rem" }}
              >
                {formatCurrency(totalSavings)}
              </p>
            </div>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-40 rounded-md" />
          ))}
        </div>
      ) : recs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-md border border-dashed border-[var(--border-default)]">
          <Lightbulb size={32} className="text-[var(--text-disabled)] mb-3" />
          <p className="text-sm text-[var(--text-secondary)]">No pending recommendations</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-1">Fleet is optimally deployed</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {recs.map((r, i) => (
            <RecommendationCard
              key={r.id}
              rec={r}
              isHero={i === 0}
              isApplying={applying === r.id}
              onApply={handleApply}
              onDismiss={handleDismiss}
            />
          ))}
        </div>
      )}
    </div>
  );
}
