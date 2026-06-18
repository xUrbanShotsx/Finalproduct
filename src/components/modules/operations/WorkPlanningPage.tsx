"use client";
import { useState } from "react";
import { Plus, CalendarDays, User } from "lucide-react";
import { WorkPlanningDrawer } from "./WorkPlanningDrawer";
import { PageShell, Stat, Badge, matchesTab } from "../shared";

type WorkStatus = "Active" | "Pending" | "Closed" | "Overdue";
type WorkType = "Structural" | "Electrical" | "Civil" | "Mechanical" | "Finish" | "Demolition" | "Inspection";

const TYPE_COLORS: Record<WorkType, { bg: string; color: string }> = {
  "Structural":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Electrical":  { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Civil":       { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Mechanical":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Finish":      { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Demolition":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Inspection":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const RECORDS: Array<{
  ref: string; task: string; type: WorkType; area: string;
  plannedStart: string; plannedEnd: string; controls: string[];
  lead: string; status: WorkStatus; overdue: boolean;
}> = [
  { ref: "WP-2024-042", task: "Level 3 concrete pour — North slab",        type: "Structural",  area: "Site 01 — L3",      plannedStart: "14 Jun 06:00", plannedEnd: "14 Jun 18:00", controls: ["SWMS-103","PTW-021"],     lead: "J. Smith",  status: "Active",  overdue: false },
  { ref: "WP-2024-041", task: "Substation switchboard installation",        type: "Electrical",  area: "Site 01 — B-Block", plannedStart: "13 Jun 07:00", plannedEnd: "15 Jun 17:00", controls: ["SWP-029","Isolation"],    lead: "M. Jones",  status: "Active",  overdue: false },
  { ref: "WP-2024-040", task: "Trenching — stormwater Grid H7",             type: "Civil",       area: "Site 02",            plannedStart: "13 Jun 06:30", plannedEnd: "13 Jun 16:00", controls: ["SWMS-098","PTW-020"],     lead: "K. Davis",  status: "Active",  overdue: false },
  { ref: "WP-2024-039", task: "Scaffold erection — Level 4 East",           type: "Structural",  area: "Site 01 — L4",      plannedStart: "14 Jun 06:00", plannedEnd: "16 Jun 12:00", controls: ["SWMS-103","SWP-034"],     lead: "T. Walsh",  status: "Pending", overdue: false },
  { ref: "WP-2024-038", task: "Roof membrane installation — Wing A",        type: "Finish",      area: "Site 01 — Roof",    plannedStart: "17 Jun 07:00", plannedEnd: "21 Jun 17:00", controls: ["SWP-034"],               lead: "J. Smith",  status: "Pending", overdue: false },
  { ref: "WP-2024-037", task: "Non load-bearing wall demolition — Wing C",  type: "Demolition",  area: "Site 03",            plannedStart: "10 Jun 06:00", plannedEnd: "12 Jun 17:00", controls: ["SWP-024","PTW"],          lead: "D. Wong",   status: "Overdue", overdue: true  },
  { ref: "WP-2024-036", task: "HVAC mechanical installation — Levels 5–7",  type: "Mechanical",  area: "Site 01 — L5–7",    plannedStart: "20 Jun 07:00", plannedEnd: "28 Jun 17:00", controls: ["SWP-030"],               lead: "M. Jones",  status: "Pending", overdue: false },
  { ref: "WP-2024-035", task: "Independent scaffold inspection — Site 02",   type: "Inspection",  area: "Site 02",            plannedStart: "12 Jun 10:00", plannedEnd: "12 Jun 12:00", controls: ["—"],                     lead: "K. Davis",  status: "Closed",  overdue: false },
  { ref: "WP-2024-034", task: "Formwork strike — Level 2 South slab",       type: "Structural",  area: "Site 01 — L2",      plannedStart: "07 Jun 06:00", plannedEnd: "07 Jun 16:00", controls: ["SWP-030","SWMS-087"],     lead: "J. Smith",  status: "Closed",  overdue: false },
];

const STATUS_CONFIG: Record<WorkStatus, { accent: string; bg: string; dot: string }> = {
  Active:  { accent: "var(--b-badge-green-text)",  bg: "var(--b-badge-green-bg)",  dot: "var(--b-badge-green-text)" },
  Pending: { accent: "var(--b-badge-blue-text)",   bg: "var(--b-badge-blue-bg)",   dot: "var(--b-badge-blue-text)" },
  Overdue: { accent: "#f06060",                    bg: "rgba(240,96,96,0.08)",      dot: "#f06060" },
  Closed:  { accent: "var(--b-text-muted)",        bg: "var(--b-bg-active)",        dot: "var(--b-text-muted)" },
};

const LANE_ORDER: WorkStatus[] = ["Overdue","Active","Pending","Closed"];

function WorkCard({ r }: { r: typeof RECORDS[number] }) {
  const typeStyle = TYPE_COLORS[r.type];
  const st = STATUS_CONFIG[r.status];
  return (
    <div
      className="border p-3 space-y-2.5 cursor-pointer"
      style={{
        background: r.status === "Overdue" ? "rgba(240,96,96,0.02)" : "var(--b-bg)",
        borderColor: r.status === "Overdue" ? "#f06060" : "var(--b-border)",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = r.status === "Overdue" ? "#f06060" : "var(--b-border-hover)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = r.status === "Overdue" ? "#f06060" : "var(--b-border)"}
    >
      {/* Ref + type */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.ref}</span>
        <Badge label={r.type} bg={typeStyle.bg} color={typeStyle.color} />
      </div>
      {/* Task name */}
      <p className="text-[12.5px] font-[500] leading-snug" style={{ color: "var(--b-text)" }}>{r.task}</p>
      {/* Controls */}
      <div className="flex items-center gap-1 flex-wrap">
        {r.controls.map(c => (
          <Badge key={c} label={c} bg="var(--b-bg-active)" color="var(--b-text-tertiary)" />
        ))}
      </div>
      {/* Footer */}
      <div className="flex items-start justify-between gap-2 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
        <div className="flex flex-col gap-0.5">
          <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{r.plannedStart.split(" ")[0]} → {r.plannedEnd.split(" ")[0]}</span>
          <span className="flex items-center gap-1"><User className="w-3 h-3" />{r.lead} · {r.area}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <div className="w-2 h-2 rounded-full" style={{ background: st.dot }} />
          <span className="font-[600]" style={{ color: st.accent }}>{r.status}</span>
        </div>
      </div>
    </div>
  );
}

export function WorkPlanningPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/operations", label: "Operations" }}
      title="Work Planning"
      description="Coordinate daily and weekly tasks with safety controls confirmed before work starts."
      cta="New Work Plan"
      ctaSlot={
        <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
          <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          New Work Plan
        </button>
      }
      stats={
        <>
          <Stat label="Active Tasks"      value="12"  sub="in progress"        highlight="green"  />
          <Stat label="Starting Today"    value="3"   sub="require sign-off"   highlight="yellow" />
          <Stat label="Overdue"           value="2"   sub="past planned end"   highlight="red"    />
          <Stat label="Completed (Week)"  value="5"   sub="closed this week"                      />
        </>
      }
      tabs={["All","Active","Starting Today","Pending","Overdue","Closed"]}
      onTabChange={setTab}
    >
      <div className="space-y-4">
        {LANE_ORDER.map(status => {
          const items = rows.filter(r => r.status === status).filter(r => matchesTab(tab, r));
          if (items.length === 0) return null;
          const st = STATUS_CONFIG[status];
          return (
            <div key={status}>
              {/* Lane header */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b" style={{ borderColor: "var(--b-border)" }}>
                <div className="w-2 h-2 rounded-full" style={{ background: st.dot }} />
                <span className="text-[11.5px] font-[600] uppercase tracking-wide" style={{ color: st.accent }}>{status}</span>
                <span className="text-[11px] font-[600] px-1.5 py-0.5" style={{ background: st.bg, color: st.accent }}>{items.length}</span>
              </div>
              {/* Cards row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {items.map(r => <WorkCard key={r.ref} r={r} />)}
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
    <WorkPlanningDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}
