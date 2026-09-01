import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Smart Rental Intelligence | Caterpillar",
  description:
    "Caterpillar Smart Rental Tracking System — Real-time fleet visibility, demand forecasting, and AI-powered operational recommendations for heavy equipment rental operations.",
  keywords: ["Caterpillar", "rental tracking", "fleet management", "heavy equipment", "operations intelligence"],
  icons: {
    icon: "/cat-rental-logo.svg",
    shortcut: "/cat-rental-logo.svg",
    apple: "/cat-rental-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <TooltipProvider delay={300}>
            <AppShell>
              {children}
            </AppShell>
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: "var(--surface-secondary)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                  fontSize: "0.875rem",
                },
              }}
            />
          </TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
