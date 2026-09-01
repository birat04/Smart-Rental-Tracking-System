"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "button" | "select" | "compact";
  className?: string;
}

export function ThemeToggle({ variant = "button", className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "w-8 h-8 rounded-md border border-[var(--border-default)] bg-[var(--surface-secondary)] animate-pulse",
          className
        )}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "compact") {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "relative flex items-center justify-center w-8 h-8 rounded-md border border-[var(--border-default)] transition-colors",
          "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--interactive-hover)]",
          "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]",
          className
        )}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? (
          <Sun size={15} className="text-[var(--brand-primary)] transition-transform duration-200 rotate-0 scale-100" />
        ) : (
          <Moon size={15} className="text-[var(--text-primary)] transition-transform duration-200 rotate-0 scale-100" />
        )}
      </button>
    );
  }

  if (variant === "select") {
    return (
      <div className={cn("grid grid-cols-3 gap-2", className)}>
        {[
          { id: "dark", label: "Dark Mode", icon: Moon },
          { id: "light", label: "Light Mode", icon: Sun },
          { id: "system", label: "System", icon: Monitor },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = theme === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setTheme(item.id)}
              className={cn(
                "p-3 rounded-md border text-xs font-medium flex flex-col items-center gap-2 transition-all",
                isSelected
                  ? "border-[var(--brand-primary)] bg-[var(--brand-muted)] text-[var(--brand-primary)] font-bold shadow-sm"
                  : "border-[var(--border-default)] bg-[var(--surface-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)]"
              )}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[var(--border-default)] text-xs font-medium transition-colors",
        "bg-[var(--surface-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--interactive-hover)]",
        "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]",
        className
      )}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <>
          <Sun size={14} className="text-[var(--brand-primary)]" />
          <span className="hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon size={14} className="text-[var(--text-primary)]" />
          <span className="hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
}
