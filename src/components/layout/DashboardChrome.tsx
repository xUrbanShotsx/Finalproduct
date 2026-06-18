"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Menu, LayoutDashboard, Shield, CheckSquare, Map, GraduationCap } from "lucide-react";
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

  const seg = pathname.split("/")[1] || "dashboard";

  // Bottom-bar destinations (mobile). Blueprints only when unlocked.
  const navItems: { href: string; label: string; icon: typeof Shield; key: string }[] = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard, key: "dashboard" },
    { href: "/safety", label: "Safety", icon: Shield, key: "safety" },
    { href: "/compliance", label: "Compliance", icon: CheckSquare, key: "compliance" },
    isDemo
      ? { href: "/training", label: "Training", icon: GraduationCap, key: "training" }
      : { href: "/blueprints", label: "Blueprints", icon: Map, key: "blueprints" },
  ];

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

        <main className="flex-1 overflow-auto b-has-bottomnav" style={{ background: "var(--b-bg-canvas)" }}>
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch border-t"
        style={{ background: "var(--b-bg)", borderColor: "var(--b-border)", height: "60px", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {navItems.map(({ href, label, icon: Icon, key }) => {
          const active = seg === key;
          return (
            <Link
              key={key}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1"
              style={{ color: active ? "var(--b-accent-text)" : "var(--b-text-muted)" }}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setOpen(true)}
          aria-label="More"
          className="flex-1 flex flex-col items-center justify-center gap-1"
          style={{ color: "var(--b-text-muted)" }}
        >
          <Menu className="w-[18px] h-[18px]" />
          <span className="text-[10px] font-medium leading-none">More</span>
        </button>
      </nav>
    </div>
  );
}
