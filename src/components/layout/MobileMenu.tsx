"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield, Users, Settings, AlertTriangle, CheckSquare, Building2, BarChart3,
  GraduationCap, Map, Lock, X, ChevronRight, LayoutDashboard, IdCard,
  Building, Users2, Activity, CreditCard, SlidersHorizontal, LogOut,
  type LucideIcon,
} from "lucide-react";
import { CORE_MODULES, type Industry, type ModuleKey } from "@/config/modules";

const MODULE_ICONS: Record<string, LucideIcon> = {
  Shield, Users, Settings, AlertTriangle, CheckSquare, Building2, BarChart3, GraduationCap, Map,
};

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

export function MobileMenu({ open, onClose, isDemo }: Props) {
  const pathname = usePathname();
  useEffect(() => { onClose(); /* eslint-disable-next-line */ }, [pathname]);

  const locked: ModuleKey[] = isDemo ? ["blueprints", "governance"] : ["governance"];

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
      <div className="flex items-center justify-between px-4 h-14 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
        <span className="text-[15px] font-semibold" style={{ color: "var(--b-text)" }}>Menu</span>
        <button onClick={onClose} aria-label="Close" className="w-9 h-9 flex items-center justify-center" style={{ color: "var(--b-text-muted)" }}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Wallet + Dashboard */}
        <Link href="/wallet" className="flex items-center gap-3 border px-4 py-3.5 mb-2" style={{ borderColor: "var(--b-accent-border)", background: "var(--b-accent-bg)" }}>
          <IdCard className="w-[18px] h-[18px]" style={{ color: "var(--b-accent-text)" }} />
          <div className="flex-1">
            <span className="text-[14px] font-semibold block" style={{ color: "var(--b-text)" }}>My Wallet</span>
            <span className="text-[11px]" style={{ color: "var(--b-text-secondary)" }}>Licences, tickets &amp; site pass</span>
          </div>
          <ChevronRight className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
        </Link>
        <Link href="/dashboard" className="flex items-center gap-3 border px-4 py-3.5 mb-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
          <LayoutDashboard className="w-[18px] h-[18px]" style={{ color: "var(--b-accent-text)" }} />
          <span className="text-[14px] font-semibold" style={{ color: "var(--b-text)" }}>Dashboard</span>
        </Link>

        {/* Core modules — tap goes straight to the module */}
        <div className="text-[10px] font-semibold uppercase tracking-widest mb-2 px-0.5" style={{ color: "var(--b-text-muted)" }}>Modules</div>
        <div className="grid grid-cols-2 gap-2.5">
          {CORE_MODULES.map((mod) => {
            const Icon = MODULE_ICONS[mod.icon] ?? Shield;
            const isLocked = locked.includes(mod.key);
            const content = (
              <>
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5" style={{ color: isLocked ? "var(--b-text-muted)" : "var(--b-accent-text)" }} />
                  {isLocked
                    ? <Lock className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
                    : <ChevronRight className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />}
                </div>
                <div className="text-[13.5px] font-semibold" style={{ color: isLocked ? "var(--b-text-muted)" : "var(--b-text)" }}>{mod.name}</div>
                <div className="text-[11px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{isLocked ? "Coming soon" : "Open"}</div>
              </>
            );
            const style: React.CSSProperties = { borderColor: "var(--b-border)", background: "var(--b-bg)", opacity: isLocked ? 0.5 : 1 };
            return isLocked
              ? <div key={mod.key} className="border p-4 text-left" style={style}>{content}</div>
              : <Link key={mod.key} href={`/${mod.key}`} className="border p-4 text-left block" style={style}>{content}</Link>;
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

        <form action="/auth/signout" method="post" className="mt-4">
          <button type="submit" className="flex items-center gap-2 px-1 text-[13px]" style={{ color: "var(--b-text-muted)" }}>
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
