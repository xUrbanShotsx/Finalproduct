"use client";
import { useState } from "react";
import { Plus, AlertTriangle, Clock, CheckCircle2, Building2, Shield } from "lucide-react";
import { StatutoryObligationsDrawer } from "./StatutoryObligationsDrawer";
import { PageShell, Stat, Badge } from "../shared";

const OBLIGATION_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Occupancy Certificate":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Annual ESM Report":      { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Notifiable Work":        { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Licence / Registration": { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Statutory Report":       { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Insurance":              { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "WHS Notice":             { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

type ObStatus = "Active" | "Pending" | "Closed";
const RECORDS: Array<{
  ref: string; obligation: string; oblType: string; building: string;
  authority: string; dueDate: string; submittedDate: string | null;
  submittedBy: string; status: ObStatus; overdue: boolean;
}> = [
  { ref: "SOB-011", obligation: "Annual ESM Report — HQ Tower",                    oblType: "Annual ESM Report",      building: "HQ Tower",    authority: "Building Surveyor",      dueDate: "31 Jul 2024", submittedDate: null,          submittedBy: "—",        status: "Pending", overdue: false },
  { ref: "SOB-010", obligation: "Annual ESM Report — Warehouse A",                 oblType: "Annual ESM Report",      building: "Warehouse A", authority: "Building Surveyor",      dueDate: "31 Jul 2024", submittedDate: null,          submittedBy: "—",        status: "Pending", overdue: false },
  { ref: "SOB-009", obligation: "Occupancy Certificate — Level 8 fitout",          oblType: "Occupancy Certificate",  building: "HQ Tower",    authority: "Local Council",           dueDate: "30 Jun 2024", submittedDate: null,          submittedBy: "—",        status: "Pending", overdue: false },
  { ref: "SOB-008", obligation: "WHS Act notifiable incident report — INC-039",    oblType: "WHS Notice",             building: "Site 01",     authority: "SafeWork NSW",            dueDate: "13 Jun 2024", submittedDate: "13 Jun 2024", submittedBy: "J. Smith", status: "Closed",  overdue: false },
  { ref: "SOB-007", obligation: "Workers Compensation Insurance renewal",           oblType: "Insurance",              building: "All",         authority: "EML Insurer",             dueDate: "01 Aug 2024", submittedDate: null,          submittedBy: "—",        status: "Active",  overdue: false },
  { ref: "SOB-006", obligation: "Public Liability Insurance renewal",               oblType: "Insurance",              building: "All",         authority: "Allianz",                 dueDate: "01 Sep 2024", submittedDate: null,          submittedBy: "—",        status: "Active",  overdue: false },
  { ref: "SOB-005", obligation: "Building registration — class 5 commercial",      oblType: "Licence / Registration", building: "HQ Tower",    authority: "Local Council",           dueDate: "01 Mar 2025", submittedDate: "01 Mar 2024", submittedBy: "K. Davis", status: "Active",  overdue: false },
  { ref: "SOB-004", obligation: "Annual WHS statistical report — WHS Reg s25",     oblType: "Statutory Report",       building: "All",         authority: "SafeWork NSW",            dueDate: "31 Aug 2024", submittedDate: null,          submittedBy: "—",        status: "Pending", overdue: false },
  { ref: "SOB-003", obligation: "Annual ESM Report — HQ Tower (FY2022-23)",        oblType: "Annual ESM Report",      building: "HQ Tower",    authority: "Building Surveyor",      dueDate: "31 Jul 2023", submittedDate: null,          submittedBy: "—",        status: "Pending", overdue: true  },
  { ref: "SOB-002", obligation: "Fire suppression notifiable work — Level 3 reno", oblType: "Notifiable Work",        building: "HQ Tower",    authority: "VBA / Building Surveyor", dueDate: "15 Apr 2024", submittedDate: "12 Apr 2024", submittedBy: "M. Jones", status: "Closed",  overdue: false },
  { ref: "SOB-001", obligation: "Annual ESM Report — Warehouse A (FY2022-23)",     oblType: "Annual ESM Report",      building: "Warehouse A", authority: "Building Surveyor",      dueDate: "31 Jul 2023", submittedDate: "29 Jul 2023", submittedBy: "K. Davis", status: "Closed",  overdue: false },
];

type Group = { key: string; label: string; accent: string; bg: string; icon: typeof AlertTriangle; items: typeof RECORDS };

function ObligationCard({ r }: { r: typeof RECORDS[number] }) {
  const oblStyle = OBLIGATION_TYPE_COLORS[r.oblType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
  return (
    <div
      className="border p-3 space-y-2.5 cursor-pointer"
      style={{
        borderColor: r.overdue ? "#f06060" : "var(--b-border)",
        background: r.overdue ? "rgba(240,96,96,0.02)" : "var(--b-bg)",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = r.overdue ? "#f06060" : "var(--b-border-hover)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = r.overdue ? "#f06060" : "var(--b-border)"}
    >
      {/* Ref + type */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.ref}</span>
          <Badge label={r.oblType} bg={oblStyle.bg} color={oblStyle.color} />
        </div>
      </div>
      {/* Obligation name */}
      <p className="text-[12.5px] font-[500] leading-snug" style={{ color: "var(--b-text)" }}>{r.obligation}</p>
      {/* Building + authority */}
      <div className="flex items-center gap-3 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{r.building}</span>
        <span className="flex items-center gap-1"><Shield className="w-3 h-3" />{r.authority}</span>
      </div>
      {/* Due / submitted */}
      <div className="flex items-center justify-between pt-1 border-t text-[11.5px]" style={{ borderColor: "var(--b-border)" }}>
        <div>
          <span style={{ color: "var(--b-text-muted)" }}>Due: </span>
          <span className={r.overdue ? "font-[600]" : ""} style={{ color: r.overdue ? "#f06060" : "var(--b-text-secondary)" }}>
            {r.dueDate}{r.overdue ? " — OVERDUE" : ""}
          </span>
        </div>
        {r.submittedDate && (
          <span style={{ color: "var(--b-text-muted)" }}>Submitted {r.submittedDate} · {r.submittedBy}</span>
        )}
      </div>
    </div>
  );
}

export function StatutoryObligationsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const overdue = RECORDS.filter(r => r.overdue).length;
  const pending = RECORDS.filter(r => r.status === "Pending").length;

  const groups: Group[] = [
    { key: "overdue",  label: "Overdue",          accent: "#f06060",                    bg: "rgba(240,96,96,0.08)",     icon: AlertTriangle, items: RECORDS.filter(r => r.overdue)                            },
    { key: "pending",  label: "Pending",           accent: "var(--b-badge-yellow-text)", bg: "var(--b-badge-yellow-bg)", icon: Clock,         items: RECORDS.filter(r => r.status === "Pending" && !r.overdue) },
    { key: "active",   label: "Active / Ongoing",  accent: "var(--b-badge-blue-text)",   bg: "var(--b-badge-blue-bg)",   icon: Clock,         items: RECORDS.filter(r => r.status === "Active")                },
    { key: "closed",   label: "Submitted / Closed",accent: "var(--b-badge-green-text)",  bg: "var(--b-badge-green-bg)",  icon: CheckCircle2,  items: RECORDS.filter(r => r.status === "Closed" && !r.overdue)  },
  ].filter(g => g.items.length > 0) as Group[];

  return (
    <>
    <PageShell
      back={{ href: "/compliance", label: "Compliance" }}
      title="Statutory Obligations"
      description="Occupancy certificates, annual ESM reports and other statutory compliance obligations."
      cta="Add Obligation"
      ctaSlot={
        <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
          <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          Add Obligation
        </button>
      }
      stats={
        <>
          <Stat label="Total Obligations" value={String(RECORDS.length)} sub="tracked"                              />
          <Stat label="Overdue"           value={String(overdue)}        sub="SOB-003 · ESM report" highlight="red"   />
          <Stat label="Pending"           value={String(pending)}        sub="due this quarter"     highlight="yellow"/>
          <Stat label="Closed (YTD)"      value={String(RECORDS.filter(r => r.status === "Closed").length)} sub="submitted on time" highlight="green" />
        </>
      }
      tabs={["All", "Overdue", "Pending", "Closed"]}
    >
      <div className="space-y-5">
        {groups.map(g => {
          const Icon = g.icon;
          return (
            <div key={g.key}>
              {/* Group header */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b" style={{ borderColor: "var(--b-border)" }}>
                <Icon className="w-3.5 h-3.5" style={{ color: g.accent }} />
                <span className="text-[11.5px] font-[600] uppercase tracking-wide" style={{ color: g.accent }}>{g.label}</span>
                <span className="text-[11px] font-[600] px-1.5 py-0.5" style={{ background: g.bg, color: g.accent }}>{g.items.length}</span>
              </div>
              {/* Cards */}
              <div className="grid grid-cols-2 gap-3">
                {g.items.map(r => <ObligationCard key={r.ref} r={r} />)}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
    <StatutoryObligationsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
