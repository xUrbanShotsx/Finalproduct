"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { IsolationShutdownDrawer } from "./IsolationShutdownDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab } from "../shared";

const ISO_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Electrical":    { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Hydraulic":     { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Pneumatic":     { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Plumbing":      { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "HVAC":          { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Fire Suppression":{ bg: "rgba(240,96,96,0.1)",    color: "#f06060" },
  "Gas":           { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const RECORDS: Array<{
  ref: string; system: string; location: string; isoType: string;
  isoStart: string; plannedEnd: string; responsible: string;
  status: "Active" | "Pending" | "Closed" | "Overdue";
  overdue: boolean; permits: string;
}> = [
  { ref: "ISO-031", system: "Electrical MDB — Level 4", location: "Level 4 — Switchroom", isoType: "Electrical",       isoStart: "13 Jun 07:00", plannedEnd: "14 Jun 17:00", responsible: "M. Jones",  status: "Active"  as const, overdue: false, permits: "PTW-041" },
  { ref: "ISO-030", system: "HVAC AHU-3 Supply Fan",    location: "Plant Room — Roof",    isoType: "HVAC",             isoStart: "13 Jun 08:00", plannedEnd: "13 Jun 16:00", responsible: "K. Davis",  status: "Active"  as const, overdue: false, permits: "—"       },
  { ref: "ISO-029", system: "Fire Sprinkler Zone 7",     location: "Level 3 — West Wing", isoType: "Fire Suppression",  isoStart: "13 Jun 06:00", plannedEnd: "13 Jun 12:00", responsible: "J. Smith",  status: "Active"  as const, overdue: false, permits: "PTW-040" },
  { ref: "ISO-028", system: "Hydraulic Lift — Goods",   location: "B2 Plant Room",        isoType: "Hydraulic",        isoStart: "10 Jun 09:00", plannedEnd: "11 Jun 17:00", responsible: "T. Walsh",  status: "Overdue" as const, overdue: true,  permits: "PTW-039" },
  { ref: "ISO-027", system: "Gas Main — Canteen",       location: "Ground — Kitchen",     isoType: "Gas",              isoStart: "12 Jun 11:00", plannedEnd: "12 Jun 15:00", responsible: "L. Brown",  status: "Closed"  as const, overdue: false, permits: "PTW-038" },
  { ref: "ISO-026", system: "Plumbing Riser — Levels 1–4",location:"B1 Plant Room",       isoType: "Plumbing",         isoStart: "11 Jun 07:00", plannedEnd: "11 Jun 13:00", responsible: "D. Wong",   status: "Closed"  as const, overdue: false, permits: "—"       },
  { ref: "ISO-025", system: "Pneumatic Control Line",   location: "Level 2 — BMS Room",   isoType: "Pneumatic",        isoStart: "10 Jun 09:00", plannedEnd: "10 Jun 17:00", responsible: "M. Jones",  status: "Closed"  as const, overdue: false, permits: "—"       },
  { ref: "ISO-024", system: "Emergency Generator Feed",  location: "Roof — Generator Room",isoType: "Electrical",       isoStart: "20 Jun 06:00", plannedEnd: "20 Jun 18:00", responsible: "K. Davis",  status: "Pending" as const, overdue: false, permits: "PTW-042" },
];

export function IsolationShutdownPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/operations", label: "Operations" }}
      title="Isolation & Shutdown"
      description="Safe isolation of building systems during maintenance, repairs and upgrades."
      cta="New Isolation"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New Isolation
          </button>
        }
      stats={
        <>
          <Stat label="Active Isolations"    value="3"  sub="systems isolated"               highlight="yellow" />
          <Stat label="Overdue Restoration"  value="1"  sub="ISO-028 · 2 days"               highlight="red"    />
          <Stat label="Pending (Upcoming)"   value="1"  sub="ISO-024 · 20 Jun"                                  />
          <Stat label="Closed This Week"     value="3"  sub="systems restored"               highlight="green"  />
        </>
      }
      tabs={["All", "Active", "Pending", "Overdue", "Closed"]}
      onTabChange={setTab}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>System</Th>
          <Th>Location</Th>
          <Th>Type</Th>
          <Th>Isolation Start</Th>
          <Th>Planned End</Th>
          <Th>Responsible</Th>
          <Th>Permit</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r)).map((r) => {
            const typeStyle = ISO_TYPE_COLORS[r.isoType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.system}</span></Td>
                <Td muted>{r.location}</Td>
                <Td><Badge label={r.isoType} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td muted>{r.isoStart}</Td>
                <Td>
                  <span style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.overdue ? 600 : undefined }}>
                    {r.plannedEnd}{r.overdue ? " · overdue" : ""}
                  </span>
                </Td>
                <Td muted>{r.responsible}</Td>
                <Td>
                  {r.permits !== "—"
                    ? <span className="font-mono text-[11px]" style={{ color: "var(--b-accent-text)" }}>{r.permits}</span>
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <IsolationShutdownDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}