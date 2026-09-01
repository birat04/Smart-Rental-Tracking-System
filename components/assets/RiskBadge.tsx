"use client";

import { cn } from "@/lib/utils";
import { getRiskConfig } from "@/lib/utils/status";
import type { RiskLevel } from "@/types";

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: "sm" | "md";
  className?: string;
}

export function RiskBadge({ risk, size = "sm", className }: RiskBadgeProps) {
  const config = getRiskConfig(risk);

  const icons: Record<RiskLevel, string> = {
    LOW: "▲",
    MEDIUM: "◆",
    HIGH: "◆",
    CRITICAL: "◆",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm font-semibold border leading-none",
        "text-label",
        size === "sm" ? "px-1.5 py-1 text-[10px]" : "px-2 py-1.5 text-[11px]",
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
      aria-label={`Risk level: ${config.label}`}
    >
      <span aria-hidden="true" style={{ fontSize: "0.5rem" }}>
        {icons[risk]}
      </span>
      {config.label}
    </span>
  );
}
