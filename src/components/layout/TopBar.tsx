"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Bell, HelpCircle, SlidersHorizontal, ChevronRight } from "lucide-react";
import type { Industry, ModuleKey } from "@/config/modules";

const MODULE_LABELS: Record<string, string> = {
  safety: "Safety", people: "People", operations: "Operations",
  risk: "Risk", compliance: "Compliance", governance: "Governance",
  insights: "Insights", training: "Training", blueprints: "Blueprints",
};

interface TopBarProps {
  industry: Industry;
  orgName: string;
  userName: string;
}

export function TopBar({ orgName, userName }: TopBarProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const moduleSegment = segments[0];
  const subSegment = segments[1];

  const moduleLabel = MODULE_LABELS[moduleSegment] ?? null;
  const subLabel = subSegment
    ? subSegment.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
    : null;

  return (
    <header
      className="flex items-center h-12 px-4 border-b flex-shrink-0 gap-2"
      style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center text-[11.4px] font-[500] min-w-0">
        {/* Org + OWNER */}
        <div className="flex items-center gap-2.5">
          <svg viewBox="0 0 400 425" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text)" }}>
            <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill="currentColor"/>
            <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill="currentColor"/>
          </svg>
          <div className="w-px h-4 flex-shrink-0" style={{ background: "var(--b-border-strong)" }} />
          <span className="text-[11.4px] font-[500]" style={{ color: "var(--b-text)" }}>{orgName}</span>
          <span
            className="text-[9px] font-[600] tracking-[0.05em] px-1.5 py-0.5"
            style={{
              background: "var(--b-badge-green-bg)",
              color: "var(--b-badge-green-text)",
            }}
          >
            OWNER
          </span>
        </div>

        {/* Module crumb */}
        {moduleLabel && moduleSegment !== "dashboard" && (
          <>
            <div className="w-px h-4 flex-shrink-0 mx-1.5" style={{ background: "var(--b-border-strong)" }} />
            <Link
              href={`/${moduleSegment}`}
              className="text-[11.4px] font-[500] transition-colors"
              style={{ color: "var(--b-text-tertiary)" }}
            >
              {moduleLabel}
            </Link>
          </>
        )}

        {/* Submodule crumb */}
        {subLabel && (
          <>
            <div className="w-px h-4 flex-shrink-0 mx-1.5" style={{ background: "var(--b-border-strong)" }} />
            <span className="text-[11.4px] font-[500]" style={{ color: "var(--b-text)" }}>
              {subLabel}
            </span>
          </>
        )}
      </div>

      {/* + New */}
      <button
        className="flex items-center gap-1.5 ml-2 px-3 h-[30px] border text-[11.4px] font-[500] transition-colors flex-shrink-0"
        style={{
          background: "var(--b-accent-bg)",
          borderColor: "var(--b-accent-border)",
          color: "var(--b-text)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)";
          (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)";
        }}
      >
        <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
        New
      </button>

      {/* Right actions */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          className="px-3 h-[30px] text-[11.4px] transition-colors"
          style={{ color: "var(--b-text-tertiary)" }}
        >
          Upgrade
        </button>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3 h-[30px] border text-[11.4px] cursor-pointer w-44 transition-colors"
          style={{
            background: "var(--b-bg-secondary)",
            borderColor: "var(--b-border-strong)",
            color: "var(--b-text-placeholder)",
          }}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="flex-1">Search…</span>
          <kbd
            className="text-[10px] px-1.5 h-[18px] border flex items-center font-[500]"
            style={{
              background: "var(--b-bg-secondary)",
              borderColor: "var(--b-border)",
              color: "var(--b-text-muted)",
            }}
          >
            ⌘K
          </kbd>
        </div>

        {[SlidersHorizontal, HelpCircle, Bell].map((Icon, i) => (
          <button
            key={i}
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ color: "var(--b-text-muted)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-tertiary)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--b-text-muted)")}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}

        {/* User */}
        <button
          className="flex items-center gap-2 px-2 h-[30px] border ml-1 text-[11.4px] font-[500] transition-colors"
          style={{
            background: "var(--b-bg-secondary)",
            borderColor: "var(--b-border-strong)",
            color: "var(--b-text-secondary)",
          }}
        >
          <div
            className="w-5 h-5 flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
            style={{ background: "var(--b-bg-active)", color: "var(--b-text-secondary)" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:block">{userName.split(" ")[0]}</span>
        </button>
      </div>
    </header>
  );
}
