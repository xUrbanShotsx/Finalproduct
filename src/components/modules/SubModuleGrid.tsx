import Link from "next/link";
import { Smartphone, WifiOff } from "lucide-react";
import type { SubModule, ModuleKey } from "@/config/modules";

const MOBILE_LABELS = {
  full:       { label: "Full mobile",  bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  partial:    { label: "Partial",      bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "read-only":{ label: "Read only",   bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  none:       { label: "Web only",     bg: "var(--b-bg-active)",        color: "var(--b-text-muted)" },
};

interface SubModuleGridProps {
  subModules: SubModule[];
  moduleKey: ModuleKey;
}

export function SubModuleGrid({ subModules, moduleKey }: SubModuleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {subModules.map((sm) => {
        const mobile = MOBILE_LABELS[sm.mobileAccess];
        return (
          <Link key={sm.id} href={`/${moduleKey}/${sm.id}`} className="b-card block p-5 cursor-pointer">
            <div className="flex items-start justify-between gap-2 mb-3">
              <h3 className="text-[14px] font-semibold leading-snug" style={{ color: "var(--b-text)" }}>
                {sm.name}
              </h3>
              {sm.industries !== "shared" && (
                <span
                  className="text-[10.5px] font-medium capitalize border px-1.5 py-0.5 shrink-0"
                  style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}
                >
                  {Array.isArray(sm.industries) ? sm.industries[0] : sm.industries}
                </span>
              )}
            </div>
            <p className="text-[12.5px] leading-relaxed mb-4" style={{ color: "var(--b-text-muted)" }}>
              {sm.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 font-medium"
                style={{ background: mobile.bg, color: mobile.color }}
              >
                <Smartphone className="w-2.5 h-2.5" />
                {mobile.label}
              </span>
              {sm.offlineCapable && (
                <span
                  className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 font-medium"
                  style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}
                >
                  <WifiOff className="w-2.5 h-2.5" />
                  Offline
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
