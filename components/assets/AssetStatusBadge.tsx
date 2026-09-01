"use client";

import { cn } from "@/lib/utils";
import { getStatusConfig } from "@/lib/utils/status";
import type { AssetStatus } from "@/types";

interface AssetStatusBadgeProps {
  status: AssetStatus;
  showDot?: boolean;
  pulse?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function AssetStatusBadge({
  status,
  showDot = true,
  pulse = false,
  size = "sm",
  className,
}: AssetStatusBadgeProps) {
  const config = getStatusConfig(status);

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
      role="status"
      aria-label={`Status: ${config.label}`}
    >
      {showDot && (
        <span
          className={cn(
            "inline-block w-1.5 h-1.5 rounded-full shrink-0",
            config.dotColor,
            (pulse && (status === "OVERDUE" || status === "UNASSIGNED")) && "pulse-dot"
          )}
          aria-hidden="true"
        />
      )}
      {config.label}
    </span>
  );
}
