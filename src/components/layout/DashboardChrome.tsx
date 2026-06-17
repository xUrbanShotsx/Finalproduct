"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import type { Industry } from "@/config/modules";

interface Props {
  industry: Industry;
  orgName: string;
  userName: string;
  isDemo: boolean;
  children: React.ReactNode;
}

export function DashboardChrome({ industry, orgName, userName, isDemo, children }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile drawer whenever the route changes.
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "var(--b-bg-canvas)" }}>
      {/* Top row: hamburger (mobile) + topbar */}
      <div className="flex items-stretch flex-shrink-0">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="md:hidden flex items-center justify-center w-12 border-b border-r flex-shrink-0"
          style={{ background: "var(--b-bg)", borderColor: "var(--b-border)", color: "var(--b-text-tertiary)" }}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <TopBar industry={industry} orgName={orgName} userName={userName} />
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:flex">
          <AppSidebar industry={industry} orgName={orgName} userName={userName} isDemo={isDemo} />
        </div>

        {/* Mobile off-canvas sidebar */}
        <div className="b-mobile-overlay md:hidden" data-open={open} onClick={() => setOpen(false)} />
        <div className="b-mobile-sidebar md:hidden" data-open={open}>
          <AppSidebar industry={industry} orgName={orgName} userName={userName} isDemo={isDemo} />
        </div>

        <main className="flex-1 overflow-auto" style={{ background: "var(--b-bg-canvas)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
