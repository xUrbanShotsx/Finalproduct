"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { ReturnToWorkDrawer } from "./ReturnToWorkDrawer";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td, matchesTab, matchesSite, siteOptionsOf } from "../shared";

type RTWStatus   = "On Track" | "Behind Schedule" | "Completed" | "Suspended";
type Capacity    = "Full Duties" | "50% Capacity" | "25% Capacity" | "Office Duties Only";

const STATUS_COLORS: Record<RTWStatus, { bg: string; color: string }> = {
  "On Track":        { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Behind Schedule": { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Completed":       { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Suspended":       { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
};

const CAPACITY_COLORS: Record<Capacity, { bg: string; color: string }> = {
  "Full Duties":         { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "50% Capacity":        { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "25% Capacity":        { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Office Duties Only":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const RECORDS: Array<{
  ref: string; worker: string; incidentRef: string; rtwStart: string;
  goalReturn: string; capacity: Capacity; currentMilestone: string;
  status: RTWStatus; coordinator: string;
}> = [
  {
    ref: "RTW-006", worker: "David Huang",   incidentRef: "INC-041", rtwStart: "03 Jun 2024",
    goalReturn: "01 Jul 2024",  capacity: "50% Capacity",       currentMilestone: "Week 2 — light duties", status: "On Track",        coordinator: "S. Walsh",
  },
  {
    ref: "RTW-005", worker: "Ryan O'Brien",  incidentRef: "INC-039", rtwStart: "27 May 2024",
    goalReturn: "24 Jun 2024",  capacity: "25% Capacity",       currentMilestone: "Week 3 — physio clearance pending", status: "Behind Schedule", coordinator: "M. Jones",
  },
  {
    ref: "RTW-004", worker: "Amy Foster",    incidentRef: "INC-036", rtwStart: "08 Apr 2024",
    goalReturn: "03 Jun 2024",  capacity: "Full Duties",        currentMilestone: "Clearance received — plan closed", status: "Completed",       coordinator: "S. Walsh",
  },
  {
    ref: "RTW-003", worker: "Tom Barker",    incidentRef: "INC-033", rtwStart: "18 Mar 2024",
    goalReturn: "13 May 2024",  capacity: "Full Duties",        currentMilestone: "Final review — returned full duties", status: "Completed",     coordinator: "K. Davis",
  },
  {
    ref: "RTW-002", worker: "Lisa Nguyen",   incidentRef: "INC-028", rtwStart: "05 Feb 2024",
    goalReturn: "04 Mar 2024",  capacity: "Office Duties Only", currentMilestone: "Reassessment scheduled — site restrictions", status: "Suspended", coordinator: "M. Jones",
  },
];

export function ReturnToWorkPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/people", label: "People" }}
      title="Return to Work"
      description="RTW plans, capacity milestones and coordinator records for injured workers."
      cta="New RTW Plan"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New RTW Plan
          </button>
        }
      stats={
        <>
          <Stat label="Active RTW Plans"   value="3"  sub="currently active"          />
          <Stat label="On Track"            value="2"  sub="meeting milestones" highlight="green"  />
          <Stat label="Behind Schedule"     value="1"  sub="requires intervention" highlight="red" />
          <Stat label="Completed (Qtr)"     value="5"  sub="this quarter"       highlight="green"  />
        </>
      }
      tabs={["All", "Active", "On Track", "Behind Schedule", "Completed"]}
      onTabChange={setTab}
      siteOptions={siteOptionsOf(rows)}
      onSiteChange={setSite}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Worker</Th>
          <Th>Incident</Th>
          <Th>RTW Start</Th>
          <Th>Goal Return</Th>
          <Th>Capacity</Th>
          <Th>Current Milestone</Th>
          <Th>Status</Th>
          <Th>Coordinator</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r) && matchesSite(site, r)).map((r) => {
            const statusStyle   = STATUS_COLORS[r.status];
            const capacityStyle = CAPACITY_COLORS[r.capacity];
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.worker}</span></Td>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-accent-text)" }}>{r.incidentRef}</span></Td>
                <Td muted>{r.rtwStart}</Td>
                <Td muted>{r.goalReturn}</Td>
                <Td><Badge label={r.capacity} bg={capacityStyle.bg} color={capacityStyle.color} /></Td>
                <Td muted>{r.currentMilestone}</Td>
                <Td><Badge label={r.status} bg={statusStyle.bg} color={statusStyle.color} /></Td>
                <Td muted>{r.coordinator}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <ReturnToWorkDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}