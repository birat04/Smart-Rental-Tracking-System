"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "header" | "sidebar" | "select" | "compact" | "button";
  collapsed?: boolean;
  className?: string;
}

export function ThemeToggle({
  variant = "header",
  collapsed = false,
  className,
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-8 rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] animate-pulse",
          variant === "compact" || collapsed ? "w-8" : "w-28",
          className
        )}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  // ── Header High-Visibility Pill ──────────────────────────
  if (variant === "header") {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer",
          isDark
            ? "border-[var(--brand-muted-border)] bg-[var(--brand-muted)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[#0A0C0F]"
            : "border-[var(--border-default)] bg-[var(--surface-secondary)] text-[var(--text-primary)] hover:bg-[var(--interactive-hover)]",
          "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]",
          className
        )}
        title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      >
        {isDark ? (
          <>
            <Sun size={14} className="shrink-0 animate-spin-slow" />
            <span className="font-mono text-[11px] font-bold">LIGHT</span>
          </>
        ) : (
          <>
            <Moon size={14} className="shrink-0 text-[var(--brand-primary)]" />
            <span className="font-mono text-[11px] font-bold">DARK</span>
          </>
        )}
      </button>
    );
  }

  // ── Sidebar Switch Row ──────────────────────────────────
  if (variant === "sidebar") {
    if (collapsed) {
      return (
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          className={cn(
            "w-full flex items-center justify-center p-2 rounded-md transition-colors cursor-pointer",
            "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--interactive-hover)]",
            className
          )}
          title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
          aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {isDark ? (
            <Sun size={16} className="text-[var(--brand-primary)]" />
          ) : (
            <Moon size={16} className="text-[var(--text-primary)]" />
          )}
        </button>
      );
    }

    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 rounded-md border border-[var(--border-subtle)] text-xs transition-all cursor-pointer",
          "bg-[var(--surface-primary)] hover:bg-[var(--interactive-hover)] hover:border-[var(--border-default)]",
          className
        )}
        aria-label="Toggle visual theme"
      >
        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
          {isDark ? (
            <Moon size={14} className="text-[var(--brand-primary)]" />
          ) : (
            <Sun size={14} className="text-[var(--brand-primary)]" />
          )}
          <span className="font-medium text-[var(--text-primary)]">
            {isDark ? "Dark Theme" : "Light Theme"}
          </span>
        </div>

        {/* Mini Pill Switch Track */}
        <div
          className={cn(
            "w-8 h-4 rounded-full p-0.5 transition-colors flex items-center",
            isDark ? "bg-[var(--brand-primary)] justify-end" : "bg-[var(--border-strong)] justify-start"
          )}
        >
          <div
            className={cn(
              "w-3 h-3 rounded-full bg-white shadow-xs transition-transform",
              isDark ? "bg-[#0A0C0F]" : "bg-white"
            )}
          />
        </div>
      </button>
    );
  }

  // ── Settings 3-way selector ──────────────────────────────
  if (variant === "select") {
    return (
      <div className={cn("grid grid-cols-3 gap-3", className)}>
        {[
          { id: "dark", label: "Dark Mode", desc: "Industrial Carbon", icon: Moon },
          { id: "light", label: "Light Mode", desc: "High Contrast Steel", icon: Sun },
          { id: "system", label: "System Sync", desc: "OS Default", icon: Monitor },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = theme === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setTheme(item.id)}
              className={cn(
                "p-3.5 rounded-md border text-left flex flex-col gap-2 transition-all cursor-pointer",
                isSelected
                  ? "border-[var(--brand-primary)] bg-[var(--brand-muted)] text-[var(--brand-primary)] font-bold shadow-md ring-1 ring-[var(--brand-primary)]"
                  : "border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
              )}
            >
              <div className="flex items-center justify-between">
                <Icon size={18} className={isSelected ? "text-[var(--brand-primary)]" : "text-[var(--text-tertiary)]"} />
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[var(--brand-primary)]" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold block text-[var(--text-primary)]">{item.label}</span>
                <span className="text-[10px] text-[var(--text-tertiary)]">{item.desc}</span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Compact fallback
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative flex items-center justify-center w-8 h-8 rounded-md border border-[var(--border-default)] transition-colors cursor-pointer",
        "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--interactive-hover)]",
        className
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun size={15} className="text-[var(--brand-primary)]" />
      ) : (
        <Moon size={15} className="text-[var(--text-primary)]" />
      )}
    </button>
  );
}
