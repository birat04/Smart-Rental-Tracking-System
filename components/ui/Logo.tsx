"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

export function Logo({
  size = "md",
  showText = true,
  className,
  animate = false,
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 24, text: "text-xs", sub: "text-[8px]" },
    md: { icon: 30, text: "text-sm", sub: "text-[9px]" },
    lg: { icon: 40, text: "text-base", sub: "text-[10px]" },
    xl: { icon: 54, text: "text-xl", sub: "text-xs" },
  };

  const { icon, text, sub } = sizeMap[size];

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {/* ── Vector Industrial Emblem ──────────────────────────── */}
      <div
        className="relative shrink-0 flex items-center justify-center"
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 120 120"
          width="100%"
          height="100%"
          className={cn(
            "transition-transform duration-200",
            animate && "hover:rotate-6"
          )}
        >
          <defs>
            <linearGradient id="catYellowGrd" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD13B" />
              <stop offset="50%" stopColor="#F5B800" />
              <stop offset="100%" stopColor="#D49B00" />
            </linearGradient>
            <linearGradient id="catDarkGrd" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#222832" />
              <stop offset="100%" stopColor="#0B0E12" />
            </linearGradient>
          </defs>

          {/* Hexagonal Shield */}
          <polygon
            points="60,6 108,32 108,88 60,114 12,88 12,32"
            fill="url(#catDarkGrd)"
            stroke="#30363D"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Grid Connectors */}
          <line x1="12" y1="32" x2="60" y2="60" stroke="#F5B800" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="108" y1="32" x2="60" y2="60" stroke="#F5B800" strokeWidth="1" strokeOpacity="0.3" />
          <line x1="60" y1="114" x2="60" y2="60" stroke="#F5B800" strokeWidth="1" strokeOpacity="0.3" />

          {/* Main Safety Yellow Triangle Crest */}
          <polygon
            points="60,20 98,84 22,84"
            fill="url(#catYellowGrd)"
            stroke="#111418"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Telemetry Sensor Core */}
          <polygon
            points="60,42 82,78 38,78"
            fill="#0A0C0F"
            stroke="#F5B800"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* Sensor Pulse Dot */}
          <circle cx="60" cy="64" r="5" fill="#F5B800" />
          <circle cx="60" cy="64" r="8" fill="none" stroke="#F5B800" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.8" />
          <circle cx="60" cy="64" r="2.2" fill="#0A0C0F" />

          {/* Track Cutouts Base */}
          <rect x="28" y="94" width="14" height="3.5" rx="1.5" fill="#484F58" />
          <rect x="53" y="94" width="14" height="3.5" rx="1.5" fill="#F5B800" />
          <rect x="78" y="94" width="14" height="3.5" rx="1.5" fill="#484F58" />
        </svg>
      </div>

      {/* ── Brand Typography ─────────────────────────────────── */}
      {showText && (
        <div className="flex flex-col min-w-0 leading-tight">
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "font-black tracking-tight text-[var(--text-primary)] font-mono",
                text
              )}
            >
              SMART RENTAL
            </span>
          </div>
          <span
            className={cn(
              "font-bold tracking-widest text-[var(--brand-primary)] uppercase font-mono",
              sub
            )}
            style={{ letterSpacing: "0.14em" }}
          >
            INTELLIGENCE TOWER
          </span>
        </div>
      )}
    </div>
  );
}
