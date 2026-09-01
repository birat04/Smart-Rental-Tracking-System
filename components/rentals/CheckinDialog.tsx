"use client";

import { useState } from "react";
import { checkinAsset } from "@/lib/api/rentals";
import type { Rental } from "@/types";
import { X, CheckCircle2, AlertTriangle, ShieldCheck, ClipboardCheck } from "lucide-react";
import { toast } from "sonner";

interface CheckinDialogProps {
  rental: Rental | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckinDialog({ rental, isOpen, onClose, onSuccess }: CheckinDialogProps) {
  const [finalCondition, setFinalCondition] = useState<"EXCELLENT" | "GOOD" | "FAIR" | "DAMAGED">("GOOD");
  const [endHours, setEndHours] = useState(rental ? rental.startEngineHours + 48 : 100);
  const [damageReported, setDamageReported] = useState(false);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !rental) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rental) return;
    setIsSubmitting(true);

    try {
      await checkinAsset({
        rentalId: rental.id,
        assetId: rental.assetId,
        actualReturnDate: new Date().toISOString(),
        finalCondition,
        endEngineHours: Number(endHours),
        damageReported,
        notes,
      });

      toast.success("Equipment Return Verified", {
        description: `Asset ${rental.assetId} successfully checked in. Status updated to IDLE.`,
      });
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to complete check-in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-0 duration-150">
      <div
        className="w-full max-w-lg rounded-lg border border-[var(--border-default)] shadow-2xl overflow-hidden"
        style={{ background: "var(--surface-secondary)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-default)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[var(--status-active-bg)] border border-[var(--status-active-border)] flex items-center justify-center text-[var(--status-active-text)]">
              <ClipboardCheck size={14} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                Equipment Return Inspection & Check-in
              </h2>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                Contract: <span className="font-mono text-[var(--text-secondary)]">{rental.id}</span> · Asset: <span className="font-mono text-[var(--brand-primary)]">{rental.assetId}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--interactive-hover)]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Summary Box */}
          <div
            className="p-3 rounded border border-[var(--border-subtle)] grid grid-cols-3 gap-2 text-[11px]"
            style={{ background: "var(--surface-primary)" }}
          >
            <div>
              <span className="text-[var(--text-disabled)] block text-[10px]">CURRENT SITE</span>
              <span className="font-medium text-[var(--text-secondary)]">{rental.siteName ?? "Unassigned"}</span>
            </div>
            <div>
              <span className="text-[var(--text-disabled)] block text-[10px]">OPERATOR</span>
              <span className="font-medium text-[var(--text-secondary)]">{rental.operatorName ?? "Unassigned"}</span>
            </div>
            <div>
              <span className="text-[var(--text-disabled)] block text-[10px]">START HOURS</span>
              <span className="font-mono text-[var(--text-secondary)]">{rental.startEngineHours}h</span>
            </div>
          </div>

          {/* Condition Grading */}
          <div className="space-y-1.5">
            <label className="text-label text-[10px] text-[var(--text-tertiary)]">
              POST-RENTAL CONDITION ASSESSMENT
            </label>
            <select
              value={finalCondition}
              onChange={(e) => setFinalCondition(e.target.value as any)}
              className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
            >
              <option value="EXCELLENT">Excellent — Clean, fully operational</option>
              <option value="GOOD">Good — Normal operational wear</option>
              <option value="FAIR">Fair — Requires maintenance servicing</option>
              <option value="DAMAGED">Damaged — Flag for damage inspection report</option>
            </select>
          </div>

          {/* Final Engine Hours */}
          <div className="space-y-1.5">
            <label className="text-label text-[10px] text-[var(--text-tertiary)]">
              FINAL ENGINE RUNTIME HOURS
            </label>
            <input
              type="number"
              value={endHours}
              onChange={(e) => setEndHours(Number(e.target.value))}
              required
              className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] font-mono outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          {/* Damage Checkbox */}
          <div className="flex items-center gap-2 p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-primary)]">
            <input
              type="checkbox"
              id="damage"
              checked={damageReported}
              onChange={(e) => setDamageReported(e.target.checked)}
              className="rounded border-[var(--border-default)] text-[var(--brand-primary)] focus:ring-0"
            />
            <label htmlFor="damage" className="text-xs text-[var(--text-secondary)] cursor-pointer select-none">
              Report mechanical anomaly or body damage during this rental
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-label text-[10px] text-[var(--text-tertiary)]">
              INSPECTION NOTES & FUEL LEVEL
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Fuel at 85%. Hydraulic pressure normal. Cleaned and parked at bay 3."
              className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] text-[11px]">
              <ShieldCheck size={13} className="text-[var(--status-active-text)]" />
              <span>Closes rental liability ledger</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-md border border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--interactive-hover)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md font-semibold bg-[var(--status-active-dot)] text-white hover:opacity-90 disabled:opacity-50"
              >
                <CheckCircle2 size={13} />
                {isSubmitting ? "Verifying..." : "Confirm Return"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
