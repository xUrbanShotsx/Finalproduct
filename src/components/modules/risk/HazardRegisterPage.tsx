"use client";
import { useState } from "react";
import { Plus, ChevronDown, ChevronRight } from "lucide-react";
import { HazardRegisterDrawer } from "./HazardRegisterDrawer";
import { PageShell, Stat, Badge } from "../shared";

const RECORDS = [
  { ref: "HAZ-094", hazard: "Working at heights — scaffold and edges",       type: "Physical",     location: "Site 01 — All levels",  inherentRisk: "Critical" as const, residualRisk: "Medium" as const, controls: "Perimeter barrier, harness, SWMS-103",    owner: "J. Smith",  lastReview: "01 Jun 2024", overdue: false },
  { ref: "HAZ-093", hazard: "Crane slewing into exclusion zone",             type: "Mechanical",   location: "Site 01 — Grid A-D",    inherentRisk: "Critical" as const, residualRisk: "Medium" as const, controls: "Exclusion barriers, lift plan, spotter",   owner: "M. Jones",  lastReview: "01 Jun 2024", overdue: false },
  { ref: "HAZ-092", hazard: "Struck by excavator — blind spots",             type: "Mechanical",   location: "Site 02 — Excavation",  inherentRisk: "Critical" as const, residualRisk: "High"   as const, controls: "Exclusion zone, spotter, hi-vis",          owner: "K. Davis",  lastReview: "15 May 2024", overdue: false },
  { ref: "HAZ-091", hazard: "Silica dust inhalation — concrete cutting",     type: "Chemical",     location: "Site 01 — L2-4",        inherentRisk: "High"     as const, residualRisk: "Low"    as const, controls: "Wet cutting, P2 mask, local exhaust",      owner: "T. Walsh",  lastReview: "10 May 2024", overdue: false },
  { ref: "HAZ-090", hazard: "Electric shock — live services underground",    type: "Physical",     location: "Site 02 — Excavation",  inherentRisk: "Critical" as const, residualRisk: "Medium" as const, controls: "Dial before dig, CAT scan, PTW",           owner: "M. Jones",  lastReview: "05 May 2024", overdue: false },
  { ref: "HAZ-089", hazard: "Falls on same level — wet access ways",         type: "Physical",     location: "All sites",             inherentRisk: "Medium"   as const, residualRisk: "Low"    as const, controls: "Non-slip matting, signage, housekeeping",  owner: "S. Lee",    lastReview: "01 Apr 2024", overdue: false },
  { ref: "HAZ-088", hazard: "Manual handling — formwork panels >20 kg",      type: "Ergonomic",    location: "Site 01 — Formwork",    inherentRisk: "Medium"   as const, residualRisk: "Low"    as const, controls: "Team lift, mechanical aid, SWP-028",       owner: "D. Wong",   lastReview: "01 Mar 2024", overdue: false },
  { ref: "HAZ-087", hazard: "Hazardous chemicals — concrete admixtures",     type: "Chemical",     location: "Site 01 — Batch plant", inherentRisk: "High"     as const, residualRisk: "Low"    as const, controls: "SDS, PPE, spill bund, SWP-027",            owner: "K. Davis",  lastReview: "01 Feb 2024", overdue: false },
  { ref: "HAZ-086", hazard: "Confined space — underground pits",             type: "Physical",     location: "Site 01, 02",           inherentRisk: "Critical" as const, residualRisk: "Medium" as const, controls: "Confined space permit, atmospheric test",  owner: "J. Smith",  lastReview: "15 Jan 2024", overdue: false },
  { ref: "HAZ-085", hazard: "Fatigue — extended shift workers",              type: "Psychosocial", location: "All sites",             inherentRisk: "High"     as const, residualRisk: "Medium" as const, controls: "Roster limits, supervisor check, FMP",     owner: "T. Walsh",  lastReview: "01 Nov 2023", overdue: true  },
  { ref: "HAZ-084", hazard: "Noise — concrete saw and jackhammer ops",       type: "Physical",     location: "Site 01 — Demo zone",   inherentRisk: "High"     as const, residualRisk: "Low"    as const, controls: "Hearing protection, <8h exposure, swap",   owner: "P. Nguyen", lastReview: "01 Oct 2023", overdue: true  },
];

type RiskLevel = "Critical" | "High" | "Medium" | "Low";
const RISK_CONFIG: Record<RiskLevel, { color: string; bg: string; border: string; dot: string }> = {
  Critical: { color: "#f06060",                    bg: "rgba(240,96,96,0.06)",     border: "rgba(240,96,96,0.3)",     dot: "#f06060" },
  High:     { color: "var(--b-badge-yellow-text)", bg: "rgba(255,200,0,0.05)",     border: "rgba(255,200,0,0.25)",    dot: "var(--b-badge-yellow-text)" },
  Medium:   { color: "var(--b-badge-blue-text)",   bg: "rgba(80,130,255,0.05)",    border: "rgba(80,130,255,0.2)",    dot: "var(--b-badge-blue-text)" },
  Low:      { color: "var(--b-badge-green-text)",  bg: "rgba(60,180,100,0.05)",    border: "rgba(60,180,100,0.2)",    dot: "var(--b-badge-green-text)" },
};
const HAZARD_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Physical":     { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Chemical":     { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Ergonomic":    { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Psychosocial": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Mechanical":   { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

function RiskBand({ level, items }: { level: RiskLevel; items: typeof RECORDS }) {
  const [open, setOpen] = useState(true);
  const cfg = RISK_CONFIG[level];
  if (items.length === 0) return null;
  return (
    <div className="border" style={{ borderColor: cfg.border }}>
      {/* Band header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-left"
        style={{ background: cfg.bg }}
      >
        <div className="w-2.5 h-2.5 flex-shrink-0" style={{ background: cfg.dot }} />
        <span className="text-[12.5px] font-[600] tracking-wide" style={{ color: cfg.color }}>
          {level} Residual Risk
        </span>
        <span className="text-[11px] font-[600] px-1.5 py-0.5" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
          {items.length}
        </span>
        <span className="ml-auto" style={{ color: cfg.color }}>
          {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </span>
      </button>

      {open && items.map((r, i) => {
        const typeStyle = HAZARD_TYPE_COLORS[r.type] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
        return (
          <div
            key={r.ref}
            className="px-4 py-3 flex items-start gap-4"
            style={{
              borderTop: `1px solid var(--b-border)`,
              background: i % 2 === 0 ? "var(--b-bg)" : "var(--b-bg-secondary)",
            }}
          >
            {/* Left: ref + hazard */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.ref}</span>
                <Badge label={r.type} bg={typeStyle.bg} color={typeStyle.color} />
                {r.overdue && (
                  <span className="text-[10.5px] font-[600] px-1.5" style={{ background: "rgba(240,96,96,0.1)", color: "#f06060" }}>
                    REVIEW OVERDUE
                  </span>
                )}
              </div>
              <p className="text-[12.5px] font-[500]" style={{ color: "var(--b-text)" }}>{r.hazard}</p>
              <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{r.controls}</p>
            </div>
            {/* Right: meta */}
            <div className="flex-shrink-0 text-right space-y-1">
              <p className="text-[11.5px]" style={{ color: "var(--b-text-secondary)" }}>{r.location}</p>
              <p className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.owner}</p>
              <p className="text-[11px]" style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)" }}>
                Reviewed {r.lastReview}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function HazardRegisterPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
    <PageShell
      back={{ href: "/risk", label: "Risk Management" }}
      title="Hazard Register"
      description="Identify, record and maintain controls for all identified workplace hazards."
      cta="Add Hazard"
      ctaSlot={
        <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
          <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          Add Hazard
        </button>
      }
      stats={
        <>
          <Stat label="Total Hazards"      value="94"  sub="in register"                          />
          <Stat label="Residual High/Crit" value="2"   sub="require further action" highlight="red"    />
          <Stat label="Review Overdue"     value="2"   sub="HAZ-085, HAZ-084"       highlight="yellow" />
          <Stat label="Reviewed (Month)"   value="8"   sub="controls verified"      highlight="green"  />
        </>
      }
      tabs={["All", "Critical", "High", "Overdue Review", "By Type"]}
    >
      <div className="space-y-2">
        {(["Critical","High","Medium","Low"] as RiskLevel[]).map(level => (
          <RiskBand
            key={level}
            level={level}
            items={RECORDS.filter(r => r.residualRisk === level)}
          />
        ))}
      </div>
    </PageShell>
    <HazardRegisterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
