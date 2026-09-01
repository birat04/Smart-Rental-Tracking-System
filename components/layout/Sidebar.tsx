"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Activity,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  MapPin,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: string | number;
  badgeVariant?: "critical" | "warning" | "info";
}

const PRIMARY_NAV: NavItem[] = [
  { href: "/dashboard",        icon: LayoutDashboard, label: "Control Tower" },
  { href: "/assets",           icon: Package,         label: "Assets" },
  { href: "/rentals",          icon: ClipboardList,   label: "Rental Operations" },
  { href: "/usage",            icon: Activity,        label: "Usage & Telemetry" },
  { href: "/forecasting",      icon: TrendingUp,      label: "Forecasting" },
  { href: "/anomalies",        icon: AlertTriangle,   label: "Anomalies",       badge: 6, badgeVariant: "critical" },
  { href: "/recommendations",  icon: Lightbulb,       label: "AI Recommendations", badge: 5, badgeVariant: "warning" },
  { href: "/map",              icon: MapPin,          label: "Fleet Map" },
  { href: "/analytics",        icon: BarChart3,       label: "Analytics" },
];

const SECONDARY_NAV: NavItem[] = [
  { href: "/settings", icon: Settings,   label: "Settings" },
  { href: "/help",     icon: HelpCircle, label: "Help & Docs" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const NavLink = ({ item }: { item: NavItem }) => {
    const Icon = item.icon;
    const isActive =
      item.href === "/dashboard"
        ? pathname === "/" || pathname === "/dashboard"
        : pathname.startsWith(item.href);

    const linkEl = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
          "hover:bg-[var(--interactive-hover)]",
          "focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]",
          isActive
            ? "bg-[var(--brand-muted)] text-[var(--text-accent)] border border-[var(--brand-muted-border)]"
            : "text-[var(--text-secondary)]",
          collapsed && "justify-center px-2"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon
          size={16}
          className={cn(
            "shrink-0",
            isActive ? "text-[var(--brand-primary)]" : "text-[var(--text-tertiary)]"
          )}
        />
        {!collapsed && (
          <span className="truncate flex-1">{item.label}</span>
        )}
        {!collapsed && item.badge != null && (
          <span
            className={cn(
              "text-label text-[10px] px-1.5 py-0.5 rounded-sm min-w-[20px] text-center",
              item.badgeVariant === "critical"
                ? "bg-[var(--status-critical-bg)] text-[var(--status-critical-text)] border border-[var(--status-critical-border)]"
                : item.badgeVariant === "warning"
                ? "bg-[var(--status-warning-bg)] text-[var(--status-warning-text)] border border-[var(--status-warning-border)]"
                : "bg-[var(--status-info-bg)] text-[var(--status-info-text)]"
            )}
          >
            {item.badge}
          </span>
        )}
        {collapsed && item.badge != null && (
          <span
            className={cn(
              "absolute -top-1 -right-1 w-4 h-4 text-[9px] font-bold rounded-full flex items-center justify-center",
              item.badgeVariant === "critical"
                ? "bg-[var(--status-critical-dot)] text-white"
                : "bg-[var(--status-warning-dot)] text-white"
            )}
          >
            {item.badge}
          </span>
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip>
          <TooltipTrigger
            className="w-full"
            render={<div />}
          >
            {linkEl}
          </TooltipTrigger>
          <TooltipContent side="right">
            {item.label}
            {item.badge != null && ` (${item.badge})`}
          </TooltipContent>
        </Tooltip>
      );
    }

    return linkEl;
  };

  return (
    <aside
      style={{
        width: collapsed ? "var(--sidebar-collapsed)" : "var(--sidebar-width)",
        background: "var(--surface-sidebar)",
        borderRight: "1px solid var(--border-default)",
        transition: "width 200ms cubic-bezier(0.2, 0, 0, 1)",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ── Brand ─────────────────────────────────────────── */}
      <div
        className={cn(
          "flex items-center gap-3 px-3 border-b",
          "border-[var(--border-default)]"
        )}
        style={{ height: "var(--header-height)", flexShrink: 0 }}
      >
        <div
          className="flex items-center justify-center rounded-sm shrink-0"
          style={{
            width: 28,
            height: 28,
            background: "var(--brand-primary)",
          }}
        >
          <Zap size={14} color="#0A0C0F" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span
              className="font-bold leading-tight text-[var(--text-primary)] truncate"
              style={{ fontSize: "0.8125rem" }}
            >
              SMART RENTAL
            </span>
            <span
              className="text-[var(--text-tertiary)] truncate"
              style={{ fontSize: "0.625rem", letterSpacing: "0.12em" }}
            >
              INTELLIGENCE
            </span>
          </div>
        )}
      </div>

      {/* ── Live indicator ─────────────────────────────────── */}
      {!collapsed && (
        <div
          className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border-subtle)]"
          style={{ flexShrink: 0 }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full pulse-dot"
            style={{ background: "var(--status-active-dot)" }}
          />
          <span className="text-label text-[10px] text-[var(--text-tertiary)]">
            LIVE — SIMULATED TELEMETRY
          </span>
        </div>
      )}

      {/* ── Primary nav ────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto"
        style={{ padding: "12px 8px" }}
        aria-label="Main navigation"
      >
        {!collapsed && (
          <p className="text-label text-[10px] text-[var(--text-disabled)] px-3 mb-2">
            OPERATIONS
          </p>
        )}
        <ul className="space-y-0.5">
          {PRIMARY_NAV.map((item) => (
            <li key={item.href}>
              <NavLink item={item} />
            </li>
          ))}
        </ul>

        <div className="my-3 border-t border-[var(--border-subtle)]" />

        {!collapsed && (
          <p className="text-label text-[10px] text-[var(--text-disabled)] px-3 mb-2">
            SYSTEM
          </p>
        )}
        <ul className="space-y-0.5">
          {SECONDARY_NAV.map((item) => (
            <li key={item.href}>
              <NavLink item={item} />
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Collapse toggle ────────────────────────────────── */}
      <div
        className="border-t border-[var(--border-default)] p-2"
        style={{ flexShrink: 0 }}
      >
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md",
            "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]",
            "hover:bg-[var(--interactive-hover)] transition-colors",
            "text-xs focus-visible:outline-2 focus-visible:outline-[var(--brand-primary)]"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={14} />
          ) : (
            <>
              <ChevronLeft size={14} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
