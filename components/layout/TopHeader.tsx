"use client";

import { useState } from "react";
import { Bell, User, ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatRelative } from "@/lib/utils/formatting";
import { NOTIFICATIONS } from "@/lib/mock-data/notifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function TopHeader() {
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => !n.isRead).length;

  const severityDot: Record<string, string> = {
    CRITICAL: "var(--status-critical-dot)",
    HIGH:     "var(--status-critical-dot)",
    WARNING:  "var(--status-warning-dot)",
    INFO:     "var(--status-info-dot)",
  };

  return (
    <header
      className="flex items-center gap-4 px-6 shrink-0 border-b border-[var(--border-default)]"
      style={{
        height: "var(--header-height)",
        background: "var(--surface-primary)",
      }}
    >
      {/* Left: Context label */}
      <div className="flex-1 flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-label text-[10px] text-[var(--text-tertiary)]">
            FLEET OPERATIONS
          </span>
          <span className="text-[var(--border-strong)] text-xs">/</span>
          <span
            className="text-label text-[10px]"
            style={{ color: "var(--brand-primary)" }}
          >
            CONTROL TOWER
          </span>
        </div>
      </div>

      {/* Center: Data freshness */}
      <div
        className="hidden md:flex items-center gap-2 px-3 py-1 rounded-md border"
        style={{
          background: "var(--surface-secondary)",
          borderColor: "var(--border-default)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full pulse-dot shrink-0"
          style={{ background: "var(--status-active-dot)" }}
        />
        <span className="text-label text-[10px] text-[var(--text-tertiary)]">
          SIMULATED TELEMETRY
        </span>
        <span className="text-[var(--text-disabled)]" style={{ fontSize: "0.625rem" }}>·</span>
        <span className="text-[var(--text-tertiary)]" style={{ fontSize: "0.6875rem" }}>
          Updated just now
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 shrink-0">

        {/* Notifications */}
        <DropdownMenu open={notifOpen} onOpenChange={setNotifOpen}>
          <DropdownMenuTrigger
            className={cn(
              "relative flex items-center justify-center w-8 h-8 rounded-md",
              "hover:bg-[var(--interactive-hover)] transition-colors",
              "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]",
              "text-[var(--text-secondary)]"
            )}
            aria-label={`${unread} unread notifications`}
          >
            <Bell size={15} />
            {unread > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: "var(--status-critical-dot)", color: "#fff" }}
              >
                {unread}
              </span>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-80 border border-[var(--border-default)]"
            style={{ background: "var(--surface-secondary)" }}
          >
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="text-label text-[10px] text-[var(--text-tertiary)]">
                NOTIFICATIONS
              </span>
              {unread > 0 && (
                <span
                  className="text-label text-[9px] px-1.5 py-0.5 rounded-sm"
                  style={{
                    background: "var(--status-critical-bg)",
                    color: "var(--status-critical-text)",
                    border: "1px solid var(--status-critical-border)",
                  }}
                >
                  {unread} UNREAD
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto">
              {NOTIFICATIONS.slice(0, 6).map((n) => (
                <DropdownMenuItem
                  key={n.id}
                  className="px-3 py-2.5 cursor-pointer hover:bg-[var(--interactive-hover)]"
                  onClick={() => setNotifOpen(false)}
                  render={
                    <Link href={n.linkHref ?? "#"} className="flex items-start gap-2.5 w-full">
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{
                          background: severityDot[n.severity] ?? "var(--text-tertiary)",
                          opacity: n.isRead ? 0.3 : 1,
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "text-sm leading-tight",
                            n.isRead ? "text-[var(--text-tertiary)]" : "text-[var(--text-primary)]"
                          )}
                          style={{ fontWeight: n.isRead ? 400 : 500 }}
                        >
                          {n.title}
                        </p>
                        <p
                          className="text-xs text-[var(--text-tertiary)] mt-0.5 leading-tight"
                          style={{ fontSize: "0.6875rem" }}
                        >
                          {n.description}
                        </p>
                        <p
                          className="mt-1"
                          style={{ fontSize: "0.625rem", color: "var(--text-disabled)" }}
                        >
                          {formatRelative(n.createdAt)}
                        </p>
                      </div>
                    </Link>
                  }
                />
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="justify-center"
              onClick={() => setNotifOpen(false)}
              render={
                <Link
                  href="/anomalies"
                  className="flex items-center justify-center gap-1.5 text-[var(--text-accent)] text-xs py-2"
                >
                  View all alerts
                  <ExternalLink size={11} />
                </Link>
              }
            />
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex items-center gap-2 px-2 py-1 rounded-md",
              "hover:bg-[var(--interactive-hover)] transition-colors",
              "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]"
            )}
            aria-label="User menu"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: "var(--brand-muted)",
                border: "1px solid var(--brand-muted-border)",
                color: "var(--brand-primary)",
              }}
            >
              JO
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span
                className="text-[var(--text-primary)] leading-none"
                style={{ fontSize: "0.75rem", fontWeight: 500 }}
              >
                J. Operations
              </span>
              <span
                className="text-[var(--text-tertiary)] leading-none mt-0.5"
                style={{ fontSize: "0.625rem" }}
              >
                Fleet Manager
              </span>
            </div>
            <ChevronDown size={12} className="text-[var(--text-tertiary)] hidden sm:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 border border-[var(--border-default)]"
            style={{ background: "var(--surface-secondary)" }}
          >
            <DropdownMenuLabel className="text-[var(--text-secondary)] text-xs">
              Fleet Operations Manager
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm text-[var(--text-secondary)] cursor-pointer">
              <User size={13} className="mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-sm text-[var(--text-secondary)] cursor-pointer"
              render={<Link href="/settings">Settings</Link>}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
