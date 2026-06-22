"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert, AlertTriangle, XCircle, Clock,
  ChevronRight, ArrowRight, Plus,
} from "lucide-react";
import { RaiseRiskDrawer, type RaiseRiskSource } from "./RaiseRiskDrawer";

const YELLOW = "var(--b-accent-text)";
const RED    = "#f06060";

/* ── Cross-module feed items ─────────────────────────────── */
interface FeedItem {
  ref: string;
  source: string;
  sourceRoute: string;
  title: string;
  level: "Critical" | "High" | "Medium";
  flag: string;
  age: string;
}

const FEED: FeedItem[] = [
  { ref: "INC-044", source: "Incidents",             sourceRoute: "/safety/incidents",             title: "Near Miss — Site 01, Level 3",           level: "High",     flag: "Flagged for risk log",          age: "3d" },
  { ref: "CRC-014", source: "Critical Risk Controls", sourceRoute: "/risk/critical-risk-controls",  title: "Chemical containment — bund breach",      level: "Critical", flag: "Control Failed",                age: "1d" },
  { ref: "CRC-017", source: "Critical Risk Controls", sourceRoute: "/risk/critical-risk-controls",  title: "Excavation face support — partial",        level: "High",     flag: "Partial — engineer review",     age: "1d" },
  { ref: "HAZ-085", source: "Hazard Register",        sourceRoute: "/risk/hazard-register",         title: "Fatigue — extended shift workers",         level: "High",     flag: "Review overdue since Nov 2023", age: "7m" },
  { ref: "HAZ-084", source: "Hazard Register",        sourceRoute: "/risk/hazard-register",         title: "Noise — concrete saw and jackhammer",      level: "High",     flag: "Review overdue since Oct 2023", age: "8m" },
  { ref: "INC-041", source: "Incidents",             sourceRoute: "/safety/incidents",             title: "Near Miss — Site 03, Basement",           level: "Medium",   flag: "Open 16d — ICAM not started",   age: "16d" },
];

const LEVEL_CONFIG = {
  Critical: { color: RED,    bg: "rgba(240,96,96,0.08)",  border: "rgba(240,96,96,0.25)",  dot: RED },
  High:     { color: YELLOW, bg: "rgba(255,200,0,0.06)",  border: "rgba(255,200,0,0.2)",   dot: YELLOW },
  Medium:   { color: "var(--b-badge-blue-text)", bg: "rgba(80,130,255,0.06)", border: "rgba(80,130,255,0.18)", dot: "var(--b-badge-blue-text)" },
};

/* ── Sub-module quick links ──────────────────────────────── */
const SUB_MODULES = [
  { label: "Hazard Register",          href: "/risk/hazard-register",          count: "94 hazards",       countColor: RED },
  { label: "Risk Assessments",         href: "/risk/risk-assessments",         count: "12 active",        countColor: YELLOW },
  { label: "Critical Risk Controls",   href: "/risk/critical-risk-controls",   count: "1 failed today",   countColor: RED },
  { label: "HRCW Register",            href: "/risk/hrcw",                     count: "8 active tasks",   countColor: YELLOW },
  { label: "JSA / JSEA",               href: "/risk/jsa-jsea",                 count: "3 pending",        countColor: YELLOW },
  { label: "Psychosocial Risk",        href: "/risk/psychosocial-risk",        count: "up to date",       countColor: "var(--b-badge-green-text)" },
  { label: "Chemical & Process Risk",  href: "/risk/chemical-process-risk",    count: "SDS current",      countColor: "var(--b-badge-green-text)" },
  { label: "Slip, Trip & Fall",        href: "/risk/slip-trip-fall",           count: "2 active controls",countColor: "var(--b-text-muted)" },
  { label: "Emergency Response Plans", href: "/risk/emergency-response-plans", count: "reviewed Jun 2024",countColor: "var(--b-badge-green-text)" },
];

export function RiskHubPage() {
  const router = useRouter();
  const [raisedRefs, setRaisedRefs] = useState<Set<string>>(new Set());
  const [raiseSource, setRaiseSource] = useState<RaiseRiskSource | null>(null);

  const criticalCount = FEED.filter(f => f.level === "Critical").length;
  const highCount     = FEED.filter(f => f.level === "High").length;
  const totalItems    = FEED.length;

  function openRaise(item: FeedItem) {
    setRaiseSource({
      sourceRef:   item.ref,
      title:       item.title,
      riskLevel:   item.level,
      sourceRoute: item.sourceRoute,
    });
  }

  return (
    <div className="p-8 max-w-[1200px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <ShieldAlert className="w-5 h-5" style={{ color: RED }} />
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Risk Management</h1>
        </div>
        <p className="text-[13px]" style={{ color: "var(--b-text-muted)" }}>
          Central hub — all issues across the platform are logged, assessed and tracked here.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: "Items needing attention", value: String(totalItems), sub: "across all modules",       color: "var(--b-text)" },
          { label: "Critical",                value: String(criticalCount), sub: "immediate action",      color: RED },
          { label: "High",                    value: String(highCount),  sub: "review required",         color: YELLOW },
          { label: "Overdue reviews",         value: "2",                sub: "HAZ-085, HAZ-084",        color: YELLOW },
        ].map(s => (
          <div key={s.label} className="border px-4 py-3" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="text-[24px] font-[800] leading-none tracking-tight" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11.5px] font-[600] mt-1" style={{ color: "var(--b-text-secondary)" }}>{s.label}</div>
            <div className="text-[11px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Cross-module feed */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-[700] tracking-wide uppercase" style={{ color: "var(--b-text-secondary)", letterSpacing: "0.06em" }}>
            Items requiring risk action
          </h2>
          <button
            onClick={() => router.push("/risk/hazard-register")}
            className="flex items-center gap-1 text-[11.5px] font-[600]"
            style={{ color: YELLOW }}
          >
            View Hazard Register <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {FEED.map(item => {
            const cfg = LEVEL_CONFIG[item.level];
            const raised = raisedRefs.has(item.ref);
            return (
              <div
                key={item.ref}
                className="flex items-center gap-4 border px-4 py-3"
                style={{ borderColor: cfg.border, background: cfg.bg }}
              >
                {/* Level dot */}
                <div className="w-2 h-2 flex-shrink-0 rounded-full" style={{ background: cfg.dot }} />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[11px] font-[600]" style={{ color: cfg.color }}>{item.ref}</span>
                    <span className="text-[10.5px] font-[600] px-1.5 py-px" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>
                      {item.source}
                    </span>
                  </div>
                  <p className="text-[12.5px] font-[500]" style={{ color: "var(--b-text)" }}>{item.title}</p>
                  <p className="text-[11.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{item.flag}</p>
                </div>

                {/* Age */}
                <span className="text-[11px] flex-shrink-0" style={{ color: "var(--b-text-muted)" }}>{item.age}</span>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => router.push(item.sourceRoute)}
                    className="text-[10.5px] font-[600] px-2 py-0.5 border transition-colors"
                    style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-secondary)", background: "transparent" }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "var(--b-bg-active)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    View <ChevronRight className="inline w-3 h-3" />
                  </button>
                  {raised ? (
                    <span className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5" style={{ background: "rgba(240,96,96,0.08)", color: RED }}>
                      <ShieldAlert className="w-3 h-3" /> Logged
                    </span>
                  ) : (
                    <button
                      onClick={() => openRaise(item)}
                      className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 border transition-colors"
                      style={{ borderColor: "rgba(240,96,96,0.3)", color: RED, background: "rgba(240,96,96,0.05)" }}
                      onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "rgba(240,96,96,0.12)"; }}
                      onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "rgba(240,96,96,0.05)"; }}
                    >
                      <Plus className="w-3 h-3" /> Log Risk
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sub-module grid */}
      <div>
        <h2 className="text-[13px] font-[700] tracking-wide uppercase mb-3" style={{ color: "var(--b-text-secondary)", letterSpacing: "0.06em" }}>
          Risk modules
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {SUB_MODULES.map(sm => (
            <button
              key={sm.href}
              onClick={() => router.push(sm.href)}
              className="flex items-center justify-between border px-4 py-3 text-left transition-colors group"
              style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border-hover)"; (e.currentTarget as HTMLElement).style.background = "var(--b-bg-secondary)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"; (e.currentTarget as HTMLElement).style.background = "var(--b-bg)"; }}
            >
              <div>
                <p className="text-[12.5px] font-[600]" style={{ color: "var(--b-text)" }}>{sm.label}</p>
                <p className="text-[11px] mt-0.5" style={{ color: sm.countColor }}>{sm.count}</p>
              </div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
            </button>
          ))}
        </div>
      </div>

      <RaiseRiskDrawer
        open={raiseSource !== null}
        onClose={() => setRaiseSource(null)}
        source={raiseSource}
        onSaved={(ref) => {
          if (raiseSource) setRaisedRefs(prev => new Set([...prev, raiseSource.sourceRef]));
          setRaiseSource(null);
        }}
      />
    </div>
  );
}
