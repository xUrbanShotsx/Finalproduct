"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { EssentialSafetyMeasuresDrawer } from "./EssentialSafetyMeasuresDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const ESM_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Sprinkler System":        { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Fire Detection":          { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Emergency Lighting":      { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Exit Signs":              { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Hydrant System":          { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Hose Reel":               { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Portable Extinguishers":  { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Smoke Control":           { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Evacuation Diagrams":     { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Fire Doors":              { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const RECORDS: Array<{
  ref: string; measure: string; esmType: string; building: string;
  level: string; standard: string; inspFreq: string;
  lastInspected: string; nextInspection: string; inspector: string;
  status: "Active" | "Pending" | "Closed";
  overdue: boolean; defect: boolean;
}> = [
  { ref: "ESM-001", measure: "Sprinkler system — full building",        esmType: "Sprinkler System",       building: "HQ Tower",    level: "All",      standard: "AS 1851",    inspFreq: "Annual",    lastInspected: "01 Jun 2024", nextInspection: "01 Jun 2025", inspector: "Fireco Pty",    status: "Active",  overdue: false, defect: false },
  { ref: "ESM-002", measure: "Fire detection and alarm system",         esmType: "Fire Detection",         building: "HQ Tower",    level: "All",      standard: "AS 1851",    inspFreq: "6-monthly", lastInspected: "01 Mar 2024", nextInspection: "01 Sep 2024", inspector: "Fireco Pty",    status: "Active",  overdue: false, defect: false },
  { ref: "ESM-003", measure: "Emergency and exit lighting",             esmType: "Emergency Lighting",     building: "HQ Tower",    level: "All",      standard: "AS 2293.2",  inspFreq: "Annual",    lastInspected: "01 Jun 2024", nextInspection: "01 Jun 2025", inspector: "LightSafe Co",  status: "Active",  overdue: false, defect: false },
  { ref: "ESM-004", measure: "Exit signs",                               esmType: "Exit Signs",             building: "HQ Tower",    level: "All",      standard: "AS 2293.2",  inspFreq: "Annual",    lastInspected: "01 Jun 2024", nextInspection: "01 Jun 2025", inspector: "LightSafe Co",  status: "Active",  overdue: false, defect: false },
  { ref: "ESM-005", measure: "Hydrant system — external and internal",  esmType: "Hydrant System",         building: "HQ Tower",    level: "All",      standard: "AS 1851",    inspFreq: "Annual",    lastInspected: "01 Jun 2024", nextInspection: "01 Jun 2025", inspector: "Fireco Pty",    status: "Active",  overdue: false, defect: false },
  { ref: "ESM-006", measure: "Hose reels",                               esmType: "Hose Reel",              building: "HQ Tower",    level: "All",      standard: "AS 1851",    inspFreq: "6-monthly", lastInspected: "01 Jun 2024", nextInspection: "01 Dec 2024", inspector: "Fireco Pty",    status: "Active",  overdue: false, defect: false },
  { ref: "ESM-007", measure: "Portable fire extinguishers",             esmType: "Portable Extinguishers", building: "All",         level: "All",      standard: "AS 1851",    inspFreq: "6-monthly", lastInspected: "01 Jun 2024", nextInspection: "01 Dec 2024", inspector: "Fireco Pty",    status: "Active",  overdue: false, defect: true  },
  { ref: "ESM-008", measure: "Mechanical smoke control — Levels 3–8",   esmType: "Smoke Control",          building: "HQ Tower",    level: "L3–L8",   standard: "AS 1668.1",  inspFreq: "Annual",    lastInspected: "01 Jun 2023", nextInspection: "01 Jun 2024", inspector: "AirSafe Eng",   status: "Pending", overdue: true,  defect: false },
  { ref: "ESM-009", measure: "Evacuation diagrams — all floors",        esmType: "Evacuation Diagrams",    building: "HQ Tower",    level: "All",      standard: "AS 3745",    inspFreq: "Annual",    lastInspected: "01 Mar 2024", nextInspection: "01 Mar 2025", inspector: "Building Mgmt", status: "Active",  overdue: false, defect: false },
  { ref: "ESM-010", measure: "Fire doors — stairwells and corridors",   esmType: "Fire Doors",             building: "HQ Tower",    level: "All",      standard: "AS 1905.1",  inspFreq: "Annual",    lastInspected: "01 Jun 2024", nextInspection: "01 Jun 2025", inspector: "FireDoor Co",   status: "Active",  overdue: false, defect: false },
  { ref: "ESM-011", measure: "Sprinkler system — Warehouse A",          esmType: "Sprinkler System",       building: "Warehouse A", level: "All",      standard: "AS 1851",    inspFreq: "Annual",    lastInspected: "01 Jun 2024", nextInspection: "01 Jun 2025", inspector: "Fireco Pty",    status: "Active",  overdue: false, defect: false },
  { ref: "ESM-012", measure: "Emergency lighting — Warehouse A",        esmType: "Emergency Lighting",     building: "Warehouse A", level: "All",      standard: "AS 2293.2",  inspFreq: "Annual",    lastInspected: "01 Jun 2024", nextInspection: "01 Jun 2025", inspector: "LightSafe Co",  status: "Active",  overdue: false, defect: false },
];

export function EssentialSafetyMeasuresPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const overdue = RECORDS.filter(r => r.overdue).length;
  const defects = RECORDS.filter(r => r.defect).length;
  return (
    <>
    <PageShell
      back={{ href: "/compliance", label: "Compliance" }}
      title="Essential Safety Measures"
      description="Fire systems, emergency lighting and exit compliance records for annual ESM reporting."
      cta="Record Inspection"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Record Inspection
          </button>
        }
      stats={
        <>
          <Stat label="Total ESMs"         value={String(RECORDS.length)} sub="tracked across buildings"              />
          <Stat label="Inspection Overdue" value={String(overdue)}        sub="ESM-008 · smoke control" highlight="red"   />
          <Stat label="Defects Found"      value={String(defects)}        sub="ESM-007 · extinguisher"  highlight="yellow"/>
          <Stat label="Annual Report Due"  value="31 Jul"                 sub="to building surveyor"    highlight="green" />
        </>
      }
      tabs={["All", "Overdue", "Defects", "Due Soon", "Completed"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Essential Safety Measure</Th>
          <Th>Type</Th>
          <Th>Building</Th>
          <Th>Level</Th>
          <Th>Standard</Th>
          <Th>Frequency</Th>
          <Th>Last Inspected</Th>
          <Th>Next Inspection</Th>
          <Th>Inspector</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {RECORDS.map((r) => {
            const typeStyle = ESM_TYPE_COLORS[r.esmType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span style={{ color: "var(--b-text)" }}>{r.measure}</span>
                    {r.defect && <Badge label="Defect" bg="rgba(240,96,96,0.1)" color="#f06060" />}
                  </div>
                </Td>
                <Td><Badge label={r.esmType} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td muted>{r.building}</Td>
                <Td muted>{r.level}</Td>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.standard}</span></Td>
                <Td muted>{r.inspFreq}</Td>
                <Td muted>{r.lastInspected}</Td>
                <Td>
                  <span style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.overdue ? 600 : undefined }}>
                    {r.nextInspection}{r.overdue ? " · overdue" : ""}
                  </span>
                </Td>
                <Td muted>{r.inspector}</Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <EssentialSafetyMeasuresDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}