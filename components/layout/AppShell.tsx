"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--surface-base)" }}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopHeader />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: "var(--surface-base)" }}
        >
          <div className="p-6 max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
