"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { LotoDrawer } from "./LotoDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab } from "../shared";

const ENERGY_COLORS: Record<string, { bg: string; color: string }> = {
  "Electrical": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Hydraulic":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Pneumatic":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Thermal":    { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Chemical":   { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Mechanical": { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Gravity":    { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  ref: string; equipment: string; energy: string; points: string;
  lockHolder: string; applied: string; permit: string;
  status: "Active" | "Closed" | "Overdue"; overdue: boolean;
}> = [
  { ref: "LOTO-019", equipment: "Reactor R-2 agitator",  energy: "Electrical", points: "MDB-04 breaker, local isolator", lockHolder: "M. Jones", applied: "13 Jun 06:00", permit: "PTW-034", status: "Active",  overdue: false },
  { ref: "LOTO-018", equipment: "Conveyor B drive",       energy: "Electrical", points: "MCC-2 starter, guard interlock", lockHolder: "J. Smith", applied: "13 Jun 05:30", permit: "PTW-032", status: "Active",  overdue: false },
  { ref: "LOTO-017", equipment: "Hydraulic press HP-1",   energy: "Hydraulic",  points: "Pump isolation, accumulator dump",lockHolder: "K. Davis", applied: "13 Jun 07:15", permit: "—",       status: "Active",  overdue: false },
  { ref: "LOTO-016", equipment: "Caustic dosing pump",    energy: "Chemical",   points: "Suction valve V-12, drain",      lockHolder: "T. Walsh", applied: "10 Jun 08:00", permit: "PTW-031", status: "Overdue", overdue: true  },
  { ref: "LOTO-015", equipment: "Steam line — Boiler 1",  energy: "Thermal",    points: "Main steam valve, condensate",   lockHolder: "L. Brown", applied: "12 Jun 06:00", permit: "PTW-028", status: "Closed",  overdue: false },
  { ref: "LOTO-014", equipment: "Compressor A",           energy: "Pneumatic",  points: "Receiver isolation, bleed valve", lockHolder: "D. Wong",  applied: "11 Jun 09:30", permit: "—",       status: "Closed",  overdue: false },
  { ref: "LOTO-021", equipment: "Tank T-04 mixer",        energy: "Mechanical", points: "Drive isolator, brake pin",      lockHolder: "M. Jones", applied: "20 Jun 06:00", permit: "PTW-035", status: "Active",  overdue: false },
];

export function LotoPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/safety", label: "Safety" }}
      title="LOTO"
      description="Lockout/tagout procedures applied at the point of work to isolate hazardous energy."
      cta="New LOTO Record"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New LOTO Record
          </button>
        }
      stats={
        <>
          <Stat label="Active Lockouts"   value="4" sub="energy isolated"      highlight="yellow" />
          <Stat label="Overdue Clearance" value="1" sub="LOTO-016 · 3 days"    highlight="red"    />
          <Stat label="Lock Holders"      value="6" sub="authorised persons"                      />
          <Stat label="Cleared This Week" value="2" sub="energy restored"      highlight="green"  />
        </>
      }
      tabs={["All", "Active", "Overdue", "Closed"]}
      onTabChange={setTab}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Equipment</Th>
          <Th>Energy Source</Th>
          <Th>Isolation Points</Th>
          <Th>Lock Holder</Th>
          <Th>Applied</Th>
          <Th>Permit</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r)).map((r) => {
            const e = ENERGY_COLORS[r.energy] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.equipment}</span></Td>
                <Td><Badge label={r.energy} bg={e.bg} color={e.color} /></Td>
                <Td muted>{r.points}</Td>
                <Td muted>{r.lockHolder}</Td>
                <Td muted>
                  <span style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)", fontWeight: r.overdue ? 600 : undefined }}>
                    {r.applied}
                  </span>
                </Td>
                <Td>
                  {r.permit !== "—"
                    ? <span className="font-mono text-[11px]" style={{ color: "var(--b-accent-text)" }}>{r.permit}</span>
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <LotoDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => [{
      ref: `LOTO-${22 + prev.length}`,
      equipment: f.equipment || "Equipment",
      energy: f.energySource || "Electrical",
      points: f.isolationPoints || "—",
      lockHolder: f.lockHolder || "—",
      applied: f.appliedAt ? f.appliedAt.slice(5).replace("T", " ") : "Today",
      permit: f.permit || "—",
      status: "Active" as const,
      overdue: false,
    } as (typeof RECORDS)[number], ...prev])} />
    </>
  );
}
