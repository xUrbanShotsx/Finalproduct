"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, Users, Settings, AlertTriangle, CheckSquare, Building2, BarChart3,
  GraduationCap, Map, Lock, X, ChevronRight, ArrowLeft, LayoutDashboard,
  Building, Users2, Activity, CreditCard, SlidersHorizontal, LogOut,
  type LucideIcon,
} from "lucide-react";
import { getSubModules, CORE_MODULES, type Industry, type ModuleKey } from "@/config/modules";

const MODULE_ICONS: Record<string, LucideIcon> = {
  Shield, Users, Settings, AlertTriangle, CheckSquare, Building2, BarChart3, GraduationCap, Map,
};

const BLUEPRINT_SUBS = [
  { id: "store",        name: "Blueprint Store" },
  { id: "builder",      name: "Blueprint Builder" },
  { id: "library",      name: "Document Library" },
  { id: "gap-analysis", name: "Gap Analysis" },
  { id: "renewals",     name: "Renewal & Updates" },
];

const MODULES_WITH_SUBMODULES: ModuleKey[] = ["safety", "people", "operations", "risk", "compliance", "insights", "training"];

const WORKSPACE = [
  { href: "/organisation", label: "Organisation", icon: Building },
  { href: "/team",         label: "Team",         icon: Users2 },
  { href: "/usage",        label: "Usage",        icon: Activity },
  { href: "/billing",      label: "Billing",      icon: CreditCard },
  { href: "/settings",     label: "Settings",     icon: SlidersHorizontal },
];

interface Props {
  open: boolean;
  onClose: () => void;
  industry: Industry;
  isDemo: boolean;
}

export function MobileMenu({ open, onClose, industry, isDemo }: Props) {
  const pathname = usePathname();
  const [active, setActive] = useState<ModuleKey | null>(null);

  // Close (and reset) on navigation.
  useEffect(() => { onClose(); setActive(null); /* eslint-disable-next-line */ }, [pathname]);

  const locked: ModuleKey[] = isDemo ? ["blueprints", "governance"] : ["governance"];

  function subsFor(key: ModuleKey): { id: string; name: string }[] {
    if (key === "blueprints") return BLUEPRINT_SUBS;
    if (MODULES_WITH_SUBMODULES.includes(key)) return getSubModules(key, industry).map((s) => ({ id: s.id, name: s.name }));
    return [];
  }

  const activeMod = active ? CORE_MODULES.find((m) => m.key === active) : null;
  const activeSubs = active ? subsFor(active) : [];

  return (
    <div
      className="md:hidden fixed inset-0 z-[70] flex flex-col"
      style={{
        background: "var(--b-bg-canvas)",
        transform: open ? "translateY(0)" : "translateY(100%)",
        opacity: open ? 1 : 0,
        pointerEvents: open ? "auto" : "none",
        transition: "transform 240ms ease, opacity 240ms ease",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
        {activeMod ? (
          <button onClick={() => setActive(null)} className="flex items-center gap-2 text-[15px] font-semibold" style={{ color: "var(--b-text)" }}>
            <ArrowLeft className="w-5 h-5" /> {activeMod.name}
          </button>
        ) : (
          <span className="text-[15px] font-semibold" style={{ color: "var(--b-text)" }}>Menu</span>
        )}
        <button onClick={onClose} aria-label="Close" className="w-9 h-9 flex items-center justify-center" style={{ color: "var(--b-text-muted)" }}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!activeMod ? (
          <>
            {/* Quick: Dashboard */}
            <Link href="/dashboard" className="flex items-center gap-3 border px-4 py-3.5 mb-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
              <LayoutDashboard className="w-[18px] h-[18px]" style={{ color: "var(--b-accent-text)" }} />
              <span className="text-[14px] font-semibold" style={{ color: "var(--b-text)" }}>Dashboard</span>
            </Link>

            {/* Core modules grid */}
            <div className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-0.5" style={{ color: "var(--b-text-muted)" }}>Modules</div>
            <div className="grid grid-cols-2 gap-2.5">
              {CORE_MODULES.map((mod) => {
                const Icon = MODULE_ICONS[mod.icon] ?? Shield;
                const isLocked = locked.includes(mod.key);
                const subs = subsFor(mod.key);
                const content = (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-5 h-5" style={{ color: isLocked ? "var(--b-text-muted)" : "var(--b-accent-text)" }} />
                      {isLocked
                        ? <Lock className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
                        : subs.length > 0 ? <ChevronRight className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} /> : null}
                    </div>
                    <div className="text-[13.5px] font-semibold" style={{ color: isLocked ? "var(--b-text-muted)" : "var(--b-text)" }}>{mod.name}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
                      {isLocked ? "Coming soon" : subs.length > 0 ? `${subs.length} tools` : "Open"}
                    </div>
                  </>
                );
                const boxStyle: React.CSSProperties = { borderColor: "var(--b-border)", background: "var(--b-bg)", opacity: isLocked ? 0.5 : 1 };
                if (isLocked) {
                  return <div key={mod.key} className="border p-4 text-left" style={boxStyle}>{content}</div>;
                }
                if (subs.length > 0) {
                  return <button key={mod.key} onClick={() => setActive(mod.key)} className="border p-4 text-left" style={boxStyle}>{content}</button>;
                }
                return <Link key={mod.key} href={`/${mod.key}`} className="border p-4 text-left block" style={boxStyle}>{content}</Link>;
              })}
            </div>

            {/* Workspace */}
            <div className="text-[10px] font-semibold uppercase tracking-widest mt-6 mb-2 px-0.5" style={{ color: "var(--b-text-muted)" }}>Workspace</div>
            <div className="border" style={{ borderColor: "var(--b-border)" }}>
              {WORKSPACE.map(({ href, label, icon: Icon }) => (
                <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3 border-b last:border-b-0" style={{ borderColor: "var(--b-border)", color: "var(--b-text-secondary)" }}>
                  <Icon className="w-[16px] h-[16px]" style={{ color: "var(--b-text-muted)" }} />
                  <span className="text-[13.5px]">{label}</span>
                </Link>
              ))}
            </div>

            {/* Sign out */}
            <form action="/auth/signout" method="post" className="mt-4">
              <button type="submit" className="flex items-center gap-2 px-1 text-[13px]" style={{ color: "var(--b-text-muted)" }}>
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </form>
          </>
        ) : (
          /* Submodule list */
          <div className="space-y-2">
            {activeSubs.map((sm) => (
              <Link
                key={sm.id}
                href={`/${active}/${sm.id}`}
                className="flex items-center justify-between border px-4 py-3.5"
                style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
              >
                <span className="text-[14px]" style={{ color: "var(--b-text)" }}>{sm.name}</span>
                <ChevronRight className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
