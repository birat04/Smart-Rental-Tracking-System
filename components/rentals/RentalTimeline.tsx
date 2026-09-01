"use client";

import type { RentalEvent } from "@/types";
import { formatRelative, formatDate } from "@/lib/utils/formatting";
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RentalTimelineProps {
  events: RentalEvent[];
}

export function RentalTimeline({ events }: RentalTimelineProps) {
  const iconMap: Record<string, any> = {
    CHECKOUT:       CheckCircle2,
    ASSIGNMENT:     MapPin,
    USAGE_LOG:      Clock,
    ALERT:          AlertTriangle,
    ANOMALY:        AlertTriangle,
    RECOMMENDATION: Lightbulb,
    CHECKIN:        ShieldCheck,
  };

  const colorMap: Record<string, { dot: string; bg: string; text: string }> = {
    INFO:     { dot: "bg-[var(--status-info-dot)]",     bg: "var(--status-info-bg)",     text: "var(--status-info-text)" },
    WARNING:  { dot: "bg-[var(--status-warning-dot)]",  bg: "var(--status-warning-bg)",  text: "var(--status-warning-text)" },
    CRITICAL: { dot: "bg-[var(--status-critical-dot)]", bg: "var(--status-critical-bg)", text: "var(--status-critical-text)" },
    HIGH:     { dot: "bg-[var(--status-critical-dot)]", bg: "var(--status-critical-bg)", text: "var(--status-critical-text)" },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-label text-[10px] text-[var(--text-tertiary)]">
          AUDITABLE RENTAL EVENT STREAM
        </span>
        <span className="text-[10px] font-mono text-[var(--text-disabled)]">
          {events.length} Events Logged
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-default)]">
        {events.map((event) => {
          const Icon = iconMap[event.type] ?? Zap;
          const styling = colorMap[event.severity ?? "INFO"];

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Indicator Dot */}
              <div
                className={cn(
                  "absolute -left-6 top-1 w-5 h-5 rounded-full border-2 border-[var(--surface-secondary)] flex items-center justify-center text-white",
                  styling.dot
                )}
              >
                <Icon size={10} />
              </div>

              {/* Event Content Box */}
              <div
                className="p-3 rounded-md border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors"
                style={{ background: "var(--surface-secondary)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-label text-[9px] px-1.5 py-0.2 rounded font-semibold"
                      style={{ background: styling.bg, color: styling.text }}
                    >
                      {event.type}
                    </span>
                    <span className="text-xs font-semibold text-[var(--text-primary)]">
                      {event.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-[var(--text-disabled)] font-mono shrink-0">
                    {formatRelative(event.timestamp)}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
