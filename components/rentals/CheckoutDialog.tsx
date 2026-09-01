"use client";

import { useState } from "react";
import { checkoutAsset } from "@/lib/api/rentals";
import { SITES } from "@/lib/mock-data/sites";
import { OPERATORS } from "@/lib/mock-data/operators";
import { ASSETS } from "@/lib/mock-data/assets";
import { QrCode, Plus, X, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CheckoutDialog({ isOpen, onClose, onSuccess }: CheckoutDialogProps) {
  const [assetId, setAssetId] = useState("EQX1007");
  const [siteId, setSiteId] = useState("S003");
  const [operatorId, setOperatorId] = useState("OP101");
  const [expectedReturnDate, setExpectedReturnDate] = useState("2025-09-15");
  const [initialCondition, setInitialCondition] = useState<"EXCELLENT" | "GOOD" | "FAIR">("EXCELLENT");
  const [dailyCost, setDailyCost] = useState(450);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  function simulateScan() {
    setIsScanning(true);
    setTimeout(() => {
      setAssetId("EQX1007");
      setIsScanning(false);
      toast.success("QR/RFID Tag Scanned", {
        description: "Identified Asset: EQX1007 (Excavator)",
      });
    }, 600);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const site = SITES.find((s) => s.id === siteId);
    const op = OPERATORS.find((o) => o.id === operatorId);

    try {
      await checkoutAsset({
        assetId,
        siteId,
        siteName: site?.name ?? "Unknown Site",
        operatorId,
        operatorName: op?.name ?? "Unassigned Operator",
        startDate: new Date().toISOString(),
        expectedReturnDate: new Date(expectedReturnDate).toISOString(),
        initialCondition,
        dailyCostUsd: Number(dailyCost),
        notes,
      });

      toast.success("Asset Dispatched Successfully", {
        description: `${assetId} assigned to ${site?.name}. Rental contract activated.`,
      });
      onSuccess();
      onClose();
    } catch (err) {
      toast.error("Failed to complete checkout");
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
            <div className="w-7 h-7 rounded bg-[var(--brand-muted)] border border-[var(--brand-muted-border)] flex items-center justify-center text-[var(--brand-primary)]">
              <Plus size={14} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[var(--text-primary)]">
                Equipment Rental Checkout
              </h2>
              <p className="text-[10px] text-[var(--text-tertiary)]">
                Dispatch rented equipment and bind site/operator assignment
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
          {/* Asset Selection / QR Scan */}
          <div className="space-y-1.5">
            <label className="text-label text-[10px] text-[var(--text-tertiary)] flex items-center justify-between">
              <span>ASSET IDENTIFIER</span>
              <button
                type="button"
                onClick={simulateScan}
                disabled={isScanning}
                className="inline-flex items-center gap-1 text-[var(--brand-primary)] hover:underline"
              >
                <QrCode size={11} />
                {isScanning ? "Scanning RFID..." : "Simulate QR Scan"}
              </button>
            </label>
            <select
              value={assetId}
              onChange={(e) => setAssetId(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] font-mono outline-none focus:border-[var(--brand-primary)]"
            >
              {ASSETS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.id} — {a.equipmentTypeName} ({a.status})
                </option>
              ))}
            </select>
          </div>

          {/* Site & Operator Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-label text-[10px] text-[var(--text-tertiary)]">
                DESTINATION SITE
              </label>
              <select
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
              >
                {SITES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-label text-[10px] text-[var(--text-tertiary)]">
                ASSIGNED OPERATOR
              </label>
              <select
                value={operatorId}
                onChange={(e) => setOperatorId(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
              >
                {OPERATORS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Return Date & Initial Condition */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-label text-[10px] text-[var(--text-tertiary)]">
                EXPECTED RETURN DATE
              </label>
              <input
                type="date"
                value={expectedReturnDate}
                onChange={(e) => setExpectedReturnDate(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] font-mono outline-none focus:border-[var(--brand-primary)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-label text-[10px] text-[var(--text-tertiary)]">
                INITIAL CONDITION
              </label>
              <select
                value={initialCondition}
                onChange={(e) => setInitialCondition(e.target.value as any)}
                className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]"
              >
                <option value="EXCELLENT">Excellent (Certified inspection)</option>
                <option value="GOOD">Good (Operational standard)</option>
                <option value="FAIR">Fair (Minor wear logged)</option>
              </select>
            </div>
          </div>

          {/* Daily Rate & Notes */}
          <div className="space-y-1.5">
            <label className="text-label text-[10px] text-[var(--text-tertiary)]">
              ESTIMATED DAILY RENTAL RATE (USD)
            </label>
            <input
              type="number"
              value={dailyCost}
              onChange={(e) => setDailyCost(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] font-mono outline-none focus:border-[var(--brand-primary)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-label text-[10px] text-[var(--text-tertiary)]">
              DISPATCH NOTES / SAFETY CLEARANCE
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. Pre-shift inspection verified. Telemetry beacon active."
              className="w-full px-3 py-2 rounded-md border border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)] resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border-default)]">
            <div className="flex items-center gap-1.5 text-[var(--text-tertiary)] text-[11px]">
              <ShieldCheck size={13} className="text-[var(--status-active-text)]" />
              <span>Auditable event stream verified</span>
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
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md font-semibold bg-[var(--brand-primary)] text-[var(--text-inverse)] hover:bg-[var(--brand-hover)] disabled:opacity-50"
              >
                <Zap size={13} />
                {isSubmitting ? "Dispatching..." : "Confirm Checkout"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
