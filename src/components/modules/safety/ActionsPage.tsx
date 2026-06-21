"use client";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { ActionDrawer } from "./ActionDrawer";
import { PageShell, Stat, SeverityBadge, Badge, matchesTab, matchesSite, siteOptionsOf } from "../shared";
import { getExtraActions } from "@/lib/safetyActions";

const SOURCE_COLORS: Record<string, { bg: string; color: string }> = {
  "Incident":    { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Audit":       { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Prestart":    { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Inspection":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Toolbox":     { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Hazard":      { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

type ColKey = "Open" | "Overdue" | "Closed";
type ActionType = "Immediate" | "Systemic" | "Preventive" | undefined;
const RECORDS: Array<{
  ref: string; source: string; sourceRef: string; description: string;
  site: string; assignee: string; due: string; priority: "High" | "Medium" | "Low";
  status: ColKey; icamFactor?: string; taprootCategory?: string; actionType?: ActionType;
}> = [
  { ref: "ACT-089", source: "Incident",   sourceRef: "INC-044", description: "Install temporary edge protection — Level 3 north face, 2 m barriers with mid-rail",      site: "Site 01",   assignee: "J. Smith",  due: "18 Jun 2024", priority: "High"   as const, status: "Open"    as ColKey, icamFactor: "Absent/Failed Defence",    taprootCategory: "Procedure Difficulty", actionType: "Immediate" },
  { ref: "ACT-088", source: "Incident",   sourceRef: "INC-044", description: "Develop SWMS for slab edge works — mandatory edge protection requirements before commencement", site: "Office",  assignee: "M. Jones",  due: "21 Jun 2024", priority: "High"   as const, status: "Open"    as ColKey, icamFactor: "Organisational Factor",    taprootCategory: "Procedure Difficulty", actionType: "Systemic" },
  { ref: "ACT-087", source: "Prestart",   sourceRef: "PRE-240610-012", description: "Calibrate noise dosimeter — Site 02 excavation crew",                             site: "Site 02",   assignee: "K. Davis",  due: "12 Jun 2024", priority: "Low"    as const, status: "Overdue" as ColKey },
  { ref: "ACT-086", source: "Incident",   sourceRef: "INC-043", description: "Remove exposed reo bars; implement daily laydown inspection checklist",                   site: "All Sites", assignee: "L. Brown",  due: "10 Jun 2024", priority: "Low"    as const, status: "Closed"  as ColKey, icamFactor: "Absent/Failed Defence",    taprootCategory: "Work Direction",       actionType: "Immediate" },
  { ref: "ACT-085", source: "Inspection", sourceRef: "INS-031", description: "Repair damaged guardrail — Level 2 east walkway",                                         site: "Site 01",   assignee: "T. Walsh",  due: "08 Jun 2024", priority: "High"   as const, status: "Closed"  as ColKey },
  { ref: "ACT-084", source: "Incident",   sourceRef: "INC-044", description: "Competency assessment for all Level 3 workers — high-risk edge work induction required",  site: "Site 01",   assignee: "K. Davis",  due: "28 Jun 2024", priority: "Medium" as const, status: "Open"    as ColKey, icamFactor: "Organisational Factor",    taprootCategory: "Training Difficulty",  actionType: "Systemic" },
  { ref: "ACT-083", source: "Toolbox",    sourceRef: "TBX-240527-001", description: "Update traffic management plan — Site 02 entry",                                   site: "Site 02",   assignee: "D. Wong",   due: "30 May 2024", priority: "Medium" as const, status: "Overdue" as ColKey },
  { ref: "ACT-082", source: "Incident",   sourceRef: "INC-044", description: "Programme review with senior management — eliminate time pressure on safety-critical tasks", site: "All Sites", assignee: "Site Director", due: "30 Jun 2024", priority: "High" as const, status: "Open" as ColKey, icamFactor: "Organisational Factor", taprootCategory: "Management System",  actionType: "Preventive" },
];

const COLS: Array<{ key: ColKey; label: string; accent: string; bg: string }> = [
  { key: "Open",    label: "Open",    accent: "var(--b-badge-blue-text)",  bg: "var(--b-badge-blue-bg)" },
  { key: "Overdue", label: "Overdue", accent: "#f06060",                   bg: "rgba(240,96,96,0.08)" },
  { key: "Closed",  label: "Closed",  accent: "var(--b-badge-green-text)", bg: "var(--b-badge-green-bg)" },
];

const ACTION_TYPE_STYLE: Record<string, { bg: string; color: string }> = {
  Immediate:  { bg: "rgba(240,96,96,0.1)",     color: "#f06060" },
  Systemic:   { bg: "var(--b-badge-blue-bg)",  color: "var(--b-badge-blue-text)" },
  Preventive: { bg: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" },
};

function ActionCard({ r, isOverdue }: { r: typeof RECORDS[number]; isOverdue: boolean }) {
  const srcStyle = SOURCE_COLORS[r.source] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
  return (
    <div
      className="border p-3 space-y-2.5 cursor-pointer"
      style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border-hover)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[12.5px] font-[500] leading-snug flex-1" style={{ color: "var(--b-text)" }}>{r.description}</span>
        <SeverityBadge v={r.priority} />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Badge label={r.source} bg={srcStyle.bg} color={srcStyle.color} />
        <span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.sourceRef}</span>
        {r.actionType && (
          <span className="text-[10.5px] font-semibold px-1.5 py-0.5" style={ACTION_TYPE_STYLE[r.actionType]}>
            {r.actionType}
          </span>
        )}
        {r.icamFactor && (
          <span
            className="text-[10.5px] px-1.5 py-0.5"
            style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)", border: "1px solid var(--b-border)" }}
          >
            ICAM: {r.icamFactor}
          </span>
        )}
        {r.taprootCategory && (
          <span
            className="text-[10.5px] px-1.5 py-0.5"
            style={{ background: "var(--b-badge-blue-bg)", color: "var(--b-badge-blue-text)" }}
          >
            {r.taprootCategory}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
        <span>{r.assignee} · {r.site}</span>
        <span className={isOverdue ? "font-semibold" : ""} style={{ color: isOverdue ? "#f06060" : "var(--b-text-muted)" }}>
          {r.due}
        </span>
      </div>
    </div>
  );
}

export function ActionsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");

  // Merge actions pushed from other modules (e.g. Blueprints gap analysis).
  useEffect(() => {
    const extra = getExtraActions();
    if (!extra.length) return;
    setRows((prev) => {
      const existing = new Set(prev.map((r) => r.ref));
      const add = extra
        .filter((e) => !existing.has(e.ref))
        .map((e) => ({ ...e })) as unknown as typeof RECORDS;
      return [...add, ...prev];
    });
  }, []);

  return (
    <>
    <PageShell
      back={{ href: "/safety", label: "Safety" }}
      title="Actions"
      description="Corrective and preventive actions raised from incidents, audits and inspections."
      cta="New Action"
      ctaSlot={
        <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
          <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          New Action
        </button>
      }
      stats={
        <>
          <Stat label="Open"               value="12"  sub="across all sources"  />
          <Stat label="Overdue"            value="3"   sub="past due date"        highlight="red"   />
          <Stat label="Closed This Month"  value="8"   sub="+3 vs last month"     highlight="green" />
          <Stat label="Avg Days to Close"  value="6.4d" sub="rolling 90 days"    />
        </>
      }
      tabs={["All", "Open", "Overdue", "Closed", "My Actions"]}
      onTabChange={setTab}
      siteOptions={siteOptionsOf(rows)}
      onSiteChange={setSite}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:min-h-[300px]">
        {COLS.map(col => {
          const items = rows.filter(r => r.status === col.key).filter(r => matchesTab(tab, r) && matchesSite(site, r));
          return (
            <div key={col.key} className="flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 mb-2 border-b" style={{ borderColor: "var(--b-border)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-[11.5px] font-[600] uppercase tracking-wide" style={{ color: col.accent }}>{col.label}</span>
                  <span className="text-[11px] px-1.5 py-0.5 font-[600]" style={{ background: col.bg, color: col.accent }}>
                    {items.length}
                  </span>
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {items.map(r => <ActionCard key={r.ref} r={r} isOverdue={col.key === "Overdue"} />)}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
    <ActionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => [{
      ref: `ACT-${90 + prev.length}`,
      source: (["Incident","Audit","Prestart","Inspection","Toolbox","Hazard"].includes(f.source) ? f.source : "Incident") as keyof typeof SOURCE_COLORS,
      sourceRef: f.sourceRef || "—",
      description: f.title || "Untitled action",
      site: "Site 01",
      assignee: f.assignee || "Unassigned",
      due: f.dueDate || "TBC",
      priority: (["High","Medium","Low"].includes(f.priority) ? f.priority : "Medium") as "High" | "Medium" | "Low",
      status: "Open" as ColKey,
    }, ...prev])} />
    </>
  );
}
