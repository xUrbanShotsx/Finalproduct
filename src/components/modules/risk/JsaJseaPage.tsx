"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { JsaJseaDrawer } from "./JsaJseaDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const TASK_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Non-routine":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Maintenance":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Breakdown":    { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Modification": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Commissioning":{ bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Housekeeping": { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  ref: string; task: string; taskType: string; area: string;
  steps: number; hazardsId: number; preparedBy: string; date: string;
  approvedBy: string; status: "Active" | "Draft" | "Closed" | "Pending";
  workers: string[];
}> = [
  { ref: "JSA-2024-044", task: "Replace conveyor belt — Line 3 while adjacent line running",   taskType: "Maintenance",   area: "Belt Line 3",       steps: 12, hazardsId: 8,  preparedBy: "T. Walsh",  date: "13 Jun 2024", approvedBy: "M. Jones",  status: "Active",  workers: ["D. Wong", "S. Lee", "P. Nguyen"] },
  { ref: "JSA-2024-043", task: "Hydraulic press seal replacement — pressurised system",        taskType: "Breakdown",     area: "Pressing Line 2",   steps: 9,  hazardsId: 6,  preparedBy: "R. Kim",    date: "12 Jun 2024", approvedBy: "J. Smith",  status: "Active",  workers: ["R. Kim", "M. Chen"] },
  { ref: "JSA-2024-042", task: "Motor coupling change — overhead crane bridge",                 taskType: "Maintenance",   area: "Crane Bay A",       steps: 14, hazardsId: 9,  preparedBy: "J. Park",   date: "11 Jun 2024", approvedBy: "K. Davis",  status: "Active",  workers: ["J. Park", "T. Walsh"] },
  { ref: "JSA-2024-041", task: "Arc flash — electrical board modification Level 1 MDB",       taskType: "Modification",  area: "Level 1 Switchroom",steps: 11, hazardsId: 7,  preparedBy: "M. Jones",  date: "10 Jun 2024", approvedBy: "J. Smith",  status: "Active",  workers: ["M. Jones"] },
  { ref: "JSA-2024-040", task: "Non-routine tank cleaning — chemical residue present",         taskType: "Non-routine",   area: "Tank Farm",         steps: 16, hazardsId: 11, preparedBy: "K. Davis",  date: "07 Jun 2024", approvedBy: "M. Jones",  status: "Closed",  workers: ["K. Davis", "D. Wong", "P. Nguyen"] },
  { ref: "JSA-2024-039", task: "Commissioning — new CNC spindle assembly",                    taskType: "Commissioning", area: "CNC Machine Shop",  steps: 8,  hazardsId: 4,  preparedBy: "J. Smith",  date: "05 Jun 2024", approvedBy: "T. Walsh",  status: "Closed",  workers: ["J. Smith", "S. Lee"] },
  { ref: "JSA-2024-038", task: "Spill clean-up — solvent leak under packaging line",           taskType: "Housekeeping",  area: "Packaging Line 1",  steps: 6,  hazardsId: 3,  preparedBy: "D. Wong",   date: "03 Jun 2024", approvedBy: "K. Davis",  status: "Closed",  workers: ["D. Wong"] },
  { ref: "JSA-2024-037", task: "Forklift attachment change — drum clamp to pallet forks",     taskType: "Maintenance",   area: "Forklift Bay",      steps: 5,  hazardsId: 2,  preparedBy: "P. Nguyen", date: "14 Jun 2024", approvedBy: "—",         status: "Draft",   workers: [] },
];

export function JsaJseaPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
    <PageShell
      back={{ href: "/risk", label: "Risk Management" }}
      title="JSA / JSEA"
      description="Job Safety Analysis for non-routine, high-risk or maintenance tasks requiring step-by-step risk control."
      cta="New JSA"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New JSA
          </button>
        }
      stats={
        <>
          <Stat label="Active JSAs"      value="4"   sub="in progress today"                     />
          <Stat label="Draft / Pending"  value="1"   sub="JSA-2024-037"        highlight="yellow" />
          <Stat label="Closed (Week)"    value="3"   sub="task completed"      highlight="green"  />
          <Stat label="Avg Hazards"      value="6.5" sub="per JSA this week"                      />
        </>
      }
      tabs={["All", "Active", "Draft", "Closed"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Task</Th>
          <Th>Type</Th>
          <Th>Area</Th>
          <Th right>Steps</Th>
          <Th right>Hazards</Th>
          <Th>Prepared By</Th>
          <Th>Date</Th>
          <Th>Workers</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {RECORDS.map((r) => {
            const typeStyle = TASK_TYPE_COLORS[r.taskType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.task}</span></Td>
                <Td><Badge label={r.taskType} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td muted>{r.area}</Td>
                <Td right mono muted>{r.steps}</Td>
                <Td right>
                  <span className="font-mono text-[12.5px]" style={{ color: r.hazardsId >= 8 ? "#f06060" : "var(--b-text-muted)", fontWeight: r.hazardsId >= 8 ? 600 : undefined }}>
                    {r.hazardsId}
                  </span>
                </Td>
                <Td muted>{r.preparedBy}</Td>
                <Td muted>{r.date}</Td>
                <Td>
                  {r.workers.length > 0
                    ? <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>{r.workers.join(", ")}</span>
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <JsaJseaDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}