"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { OperationalReadinessDrawer } from "./OperationalReadinessDrawer";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td } from "../shared";

type ReadinessResult = "Pass" | "Fail" | "Hold" | "Conditional" | "Pending";
type CheckType = "Pre-Production" | "Pre-Task" | "Shift Start" | "Handover" | "Post-Maintenance";

const RESULT_COLORS: Record<ReadinessResult, { bg: string; color: string }> = {
  "Pass":        { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Fail":        { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Hold":        { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "Conditional": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Pending":     { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const CHECK_COLORS: Record<CheckType, { bg: string; color: string }> = {
  "Pre-Production":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Pre-Task":        { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Shift Start":     { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Handover":        { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Post-Maintenance":{ bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const RECORDS: Array<{
  ref: string; area: string; checkType: CheckType; plannedStart: string;
  completedBy: string; result: ReadinessResult; issuesFound: number;
  criticalHold: boolean; notes: string;
}> = [
  { ref: "OR-240613-008", area: "Pressing Line 2",     checkType: "Shift Start",     plannedStart: "06:00", completedBy: "M. Chen",   result: "Pass",        issuesFound: 0, criticalHold: false, notes: "—" },
  { ref: "OR-240613-007", area: "Welding Bay A",       checkType: "Pre-Task",        plannedStart: "06:30", completedBy: "T. Walsh",  result: "Conditional", issuesFound: 1, criticalHold: false, notes: "Ventilation damper stiff — maintenance notified" },
  { ref: "OR-240613-006", area: "Assembly Line 3",     checkType: "Shift Start",     plannedStart: "06:00", completedBy: "R. Kim",    result: "Pass",        issuesFound: 0, criticalHold: false, notes: "—" },
  { ref: "OR-240613-005", area: "Paint Booth B",       checkType: "Post-Maintenance",plannedStart: "05:30", completedBy: "S. Lee",    result: "Hold",        issuesFound: 2, criticalHold: true,  notes: "LEV system not restored to full flow — production hold" },
  { ref: "OR-240613-004", area: "CNC Machine Shop",    checkType: "Pre-Production",  plannedStart: "07:00", completedBy: "D. Wong",   result: "Pass",        issuesFound: 0, criticalHold: false, notes: "—" },
  { ref: "OR-240613-003", area: "Packaging Line 1",    checkType: "Shift Start",     plannedStart: "06:00", completedBy: "P. Nguyen", result: "Pass",        issuesFound: 0, criticalHold: false, notes: "—" },
  { ref: "OR-240613-002", area: "Compressor Room",     checkType: "Handover",        plannedStart: "05:45", completedBy: "J. Park",   result: "Conditional", issuesFound: 1, criticalHold: false, notes: "Pressure gauge #3 sticky — log and monitor" },
  { ref: "OR-240613-001", area: "Forklift Charging Bay",checkType:"Pre-Task",        plannedStart: "06:15", completedBy: "—",         result: "Pending",     issuesFound: 0, criticalHold: false, notes: "Awaiting operator" },
];

export function OperationalReadinessPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  return (
    <>
    <PageShell
      back={{ href: "/operations", label: "Operations" }}
      title="Operational Readiness"
      description="Pre-production and pre-task safety readiness checks before work commences."
      cta="Readiness Check"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Readiness Check
          </button>
        }
      stats={
        <>
          <Stat label="Checks Today"     value="8"   sub="scheduled"                          />
          <Stat label="Critical Hold"    value="1"   sub="Paint Booth B"    highlight="red"   />
          <Stat label="Conditional Pass" value="2"   sub="issues noted"     highlight="yellow"/>
          <Stat label="Pass Rate"        value="75%" sub="excl. pending"    highlight="green" />
        </>
      }
      tabs={["Today", "Pre-Production", "Pre-Task", "Shift Start", "Holds"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Area / Line</Th>
          <Th>Check Type</Th>
          <Th>Planned Start</Th>
          <Th>Completed By</Th>
          <Th>Result</Th>
          <Th right>Issues</Th>
          <Th>Critical Hold</Th>
          <Th>Notes</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => {
            const resultStyle = RESULT_COLORS[r.result];
            const checkStyle  = CHECK_COLORS[r.checkType];
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.area}</span></Td>
                <Td><Badge label={r.checkType} bg={checkStyle.bg} color={checkStyle.color} /></Td>
                <Td mono muted>{r.plannedStart}</Td>
                <Td muted>{r.completedBy}</Td>
                <Td><Badge label={r.result} bg={resultStyle.bg} color={resultStyle.color} /></Td>
                <Td right>
                  {r.issuesFound > 0
                    ? <Badge label={String(r.issuesFound)} bg="rgba(240,96,96,0.1)" color="#f06060" />
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td>
                  {r.criticalHold
                    ? <Badge label="HOLD" bg="rgba(220,38,38,0.15)" color="#f06060" />
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td muted>{r.notes}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <OperationalReadinessDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}