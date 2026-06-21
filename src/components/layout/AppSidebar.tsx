"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, Users, Settings, AlertTriangle, CheckSquare,
  Building2, BarChart3, GraduationCap, Map, LayoutDashboard,
  ChevronDown, ChevronRight, LogOut, Lock,
  Building, Users2, Activity, CreditCard, SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getSubModules, CORE_MODULES, type Industry, type ModuleKey } from "@/config/modules";

const MODULE_ICONS: Record<string, LucideIcon> = {
  Shield, Users, Settings, AlertTriangle, CheckSquare,
  Building2, BarChart3, GraduationCap, Map,
};

const MODULES_WITH_SUBMODULES: ModuleKey[] = ["safety", "people", "operations", "risk", "compliance", "insights", "training"];

const BLUEPRINT_SUBS = [
  { id: "store",        name: "Blueprint Store" },
  { id: "builder",      name: "Blueprint Builder" },
  { id: "library",      name: "Document Library" },
  { id: "gap-analysis", name: "Gap Analysis" },
  { id: "renewals",     name: "Renewal & Updates" },
];

const WORKSPACE_ITEMS = [
  { href: "/organisation", label: "Organisation", icon: Building },
  { href: "/team",         label: "Team",         icon: Users2 },
  { href: "/usage",        label: "Usage",        icon: Activity },
  { href: "/billing",      label: "Billing",      icon: CreditCard },
  { href: "/settings",     label: "Settings",     icon: SlidersHorizontal },
];

interface AppSidebarProps {
  industry: Industry;
  orgName: string;
  userName: string;
  isDemo?: boolean;
}

export function AppSidebar({ industry, userName, isDemo = false }: AppSidebarProps) {
  // Blueprints is a paid add-on: locked in the prospect demo, unlocked for customers.
  const COMING_SOON: ModuleKey[] = isDemo ? ["blueprints", "governance"] : ["governance"];
  const pathname = usePathname();
  const activeModule = pathname.split("/")[1] as ModuleKey | "dashboard" | "";

  const [openModules, setOpenModules] = useState<Set<ModuleKey>>(() => {
    const s = new Set<ModuleKey>();
    if (activeModule && activeModule !== "dashboard") s.add(activeModule as ModuleKey);
    return s;
  });

  useEffect(() => {
    if (activeModule && activeModule !== "dashboard") {
      setOpenModules((p) => new Set(p).add(activeModule as ModuleKey));
    }
  }, [activeModule]);

  function toggle(key: ModuleKey) {
    setOpenModules((p) => {
      const n = new Set(p);
      n.has(key) ? n.delete(key) : n.add(key);
      return n;
    });
  }

  const navItem = (href: string, isActive: boolean) =>
    cn(
      "flex items-center gap-2.5 px-2.5 py-[7px] text-[12.5px] font-[450] transition-colors select-none",
      isActive
        ? "bg-[var(--b-bg-active)] text-[var(--b-text)]"
        : "text-[var(--b-text-tertiary)] hover:bg-[var(--b-bg-hover)] hover:text-[var(--b-text-secondary)]"
    );

  return (
    <aside
      className="flex flex-col w-[214px] min-h-full border-r flex-shrink-0"
      style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}
    >
      <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-px">
        {/* Dashboard */}
        <Link href="/dashboard" className={navItem("/dashboard", pathname === "/dashboard")}>
          <LayoutDashboard className="w-[15px] h-[15px] flex-shrink-0" />
          Dashboard
        </Link>

        {/* MODULES section */}
        <div className="pt-4 pb-1 px-2.5">
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", color: "var(--b-text-muted)", textTransform: "uppercase" }}>
            Modules
          </span>
        </div>

        {CORE_MODULES.map((mod) => {
          const Icon = MODULE_ICONS[mod.icon] ?? Shield;
          const comingSoon = COMING_SOON.includes(mod.key);
          const subModules: { id: string; name: string }[] =
            mod.key === "blueprints"
              ? (comingSoon ? [] : BLUEPRINT_SUBS)
              : MODULES_WITH_SUBMODULES.includes(mod.key)
                ? getSubModules(mod.key, industry).map((s) => ({ id: s.id, name: s.name }))
                : [];
          const isActive = pathname.startsWith(`/${mod.key}`);
          const isOpen = openModules.has(mod.key);

          return (
            <div key={mod.key} id={`tour-nav-${mod.key}`}>
              <div
                className={cn(
                  navItem(`/${mod.key}`, isActive),
                  comingSoon ? "opacity-40 cursor-default" : "cursor-pointer"
                )}
                onClick={() => !comingSoon && subModules.length > 0 && toggle(mod.key)}
              >
                <Link
                  href={comingSoon ? "#" : `/${mod.key}`}
                  className="flex items-center gap-2.5 flex-1 min-w-0"
                  onClick={(e) => { if (comingSoon) e.preventDefault(); else e.stopPropagation(); }}
                >
                  <Icon className="w-[15px] h-[15px] flex-shrink-0" />
                  <span className="flex-1 truncate">{mod.name}</span>
                </Link>
                {comingSoon
                  ? <Lock className="w-3 h-3 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                  : subModules.length > 0
                    ? isOpen
                      ? <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                      : <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                    : null}
              </div>

              {!comingSoon && subModules.length > 0 && isOpen && (
                <div
                  className="ml-[18px] pl-3 border-l mt-px mb-1 space-y-px"
                  style={{ borderColor: "var(--b-border)" }}
                >
                  {subModules.map((sm) => {
                    const href = `/${mod.key}/${sm.id}`;
                    const isSmActive = pathname === href;
                    return (
                      <Link
                        key={sm.id}
                        href={href}
                        className={cn(
                          "flex items-center px-2.5 py-[6px] text-[12px] font-[450] transition-colors",
                          isSmActive
                            ? "bg-[var(--b-bg-active)] text-[var(--b-text)]"
                            : "text-[var(--b-text-muted)] hover:bg-[var(--b-bg-hover)] hover:text-[var(--b-text-secondary)]"
                        )}
                      >
                        {sm.name}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* WORKSPACE section */}
        <div className="pt-4 pb-1 px-2.5">
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.12em", color: "var(--b-text-muted)", textTransform: "uppercase" }}>
            Workspace
          </span>
        </div>

        {WORKSPACE_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={navItem(href, pathname === href)}>
            <Icon className="w-[15px] h-[15px] flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        className="flex items-center justify-between px-3 py-2.5 border-t"
        style={{ borderColor: "var(--b-border)" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-6 h-6 flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
            style={{ background: "var(--b-bg-active)", color: "var(--b-text-secondary)" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-[12px] truncate" style={{ color: "var(--b-text-tertiary)" }}>
            {userName.split(" ")[0]}
          </span>
        </div>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            title="Sign out"
            className="p-1.5 transition-colors"
            style={{ color: "var(--b-text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--b-text-tertiary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--b-text-muted)")}
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </aside>
  );
}
