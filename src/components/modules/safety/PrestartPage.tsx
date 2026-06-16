"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PrestartDrawer } from "./PrestartDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const RECORDS = [
  {
    ref: "PRE-240613-018",
    asset: "Tower Crane TC-04",
    operator: "M. Chen",
    site: "Site 01",
    time: "06:30",
    result: "Pass" as const,
    defects: 0,
    actions: 0,
  },
  {
    ref: "PRE-240613-017",
    asset: "Excavator CAT 320",
    operator: "T. Walsh",
    site: "Site 02",
    time: "06:45",
    result: "Pass" as const,
    defects: 1,
    actions: 1,
  },
  {
    ref: "PRE-240613-016",
    asset: "Telehandler JLG 4017",
    operator: "R. Kim",
    site: "Site 01",
    time: "07:00",
    result: "Pass" as const,
    defects: 0,
    actions: 0,
  },
  {
    ref: "PRE-240613-015",
    asset: "Mobile Scaffold — Bay 3",
    operator: "J. Park",
    site: "Site 03",
    time: "07:15",
    result: "Fail" as const,
    defects: 2,
    actions: 2,
  },
  {
    ref: "PRE-240613-014",
    asset: "Concrete Pump",
    operator: "D. Wong",
    site: "Site 01",
    time: "07:30",
    result: "Pass" as const,
    defects: 0,
    actions: 0,
  },
  {
    ref: "PRE-240613-013",
    asset: "Skid Steer Loader",
    operator: "S. Lee",
    site: "Site 02",
    time: "07:45",
    result: "Pass" as const,
    defects: 0,
    actions: 0,
  },
  {
    ref: "PRE-240613-012",
    asset: "EWP — Boom Lift",
    operator: "P. Nguyen",
    site: "Site 01",
    time: "08:00",
    result: "Pass" as const,
    defects: 1,
    actions: 1,
  },
];

export function PrestartPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
    <PageShell
      back={{ href: "/safety", label: "Safety" }}
      title="Prestart"
      description="Daily prestart safety checklists for plant, equipment and site readiness."
      cta="Start Prestart"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Start Prestart
          </button>
        }
      stats={
        <>
          <Stat label="Today" value="18" sub="of 20 expected" />
          <Stat label="Pass Rate" value="94%" sub="+2% vs last week" highlight="green" />
          <Stat label="Defects Raised" value="4" sub="3 actions open" highlight="yellow" />
          <Stat label="Outstanding" value="2" sub="not yet submitted" highlight="red" />
        </>
      }
      tabs={["Today", "This Week", "Pass", "Fail", "Defects"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Asset / Equipment</Th>
          <Th>Operator</Th>
          <Th>Site</Th>
          <Th>Time</Th>
          <Th>Result</Th>
          <Th right>Defects</Th>
          <Th right>Actions</Th>
        </TableHead>
        <tbody>
          {RECORDS.map((r) => (
            <Tr key={r.ref}>
              <Td>
                <span className="font-mono text-[11px]" style={{ color: "var(--b-text)" }}>
                  {r.ref}
                </span>
              </Td>
              <Td>
                <span style={{ color: "var(--b-text)" }}>{r.asset}</span>
              </Td>
              <Td muted>{r.operator}</Td>
              <Td muted>{r.site}</Td>
              <Td muted mono>{r.time}</Td>
              <Td><StatusBadge v={r.result} /></Td>
              <Td right>
                {r.defects > 0 ? (
                  <Badge
                    label={String(r.defects)}
                    bg="rgba(240,96,96,0.1)"
                    color="#f06060"
                  />
                ) : (
                  <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>
                )}
              </Td>
              <Td right>
                {r.actions > 0 ? (
                  <Badge
                    label={String(r.actions)}
                    bg="var(--b-badge-yellow-bg)"
                    color="var(--b-badge-yellow-text)"
                  />
                ) : (
                  <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>
                )}
              </Td>
            </Tr>
          ))}
        </tbody>
      </table>
    </PageShell>
    <PrestartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}