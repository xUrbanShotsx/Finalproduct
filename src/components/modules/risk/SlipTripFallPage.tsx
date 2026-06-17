"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SlipTripFallDrawer } from "./SlipTripFallDrawer";
import { PageShell, Stat, SeverityBadge, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const SURFACE_COLORS: Record<string, { bg: string; color: string }> = {
  "Wet Floor":          { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Uneven Surface":     { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Obstructed Path":    { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Poor Lighting":      { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Loose Mat / Rug":    { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Step / Level Change":{ bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Exterior — Rain":    { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Cluttered Area":     { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  ref: string; hazard: string; surface: string; location: string; building: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  controls: string; reportedBy: string; date: string;
  inspectionFreq: string; lastInspected: string;
  status: "Open" | "Active" | "Closed" | "Pending";
  overdue: boolean;
}> = [
  { ref: "STF-047", hazard: "Main entrance lobby — pooling after rain",         surface: "Wet Floor",          location: "Level G — Entrance",     building: "HQ Tower",    riskLevel: "High",   controls: "Wet weather mats, 'Caution' signage daily checks", reportedBy: "S. Lee",    date: "13 Jun", inspectionFreq: "Daily",   lastInspected: "Today",     status: "Active",  overdue: false },
  { ref: "STF-046", hazard: "Loose mat near kitchen entry — curled edge",       surface: "Loose Mat / Rug",   location: "Level 4 — Kitchen",       building: "HQ Tower",    riskLevel: "High",   controls: "Mat removed pending replacement",                  reportedBy: "P. Nguyen", date: "12 Jun", inspectionFreq: "Weekly",  lastInspected: "12 Jun",    status: "Open",    overdue: false },
  { ref: "STF-045", hazard: "Car park ramp — oil spill near bay 14",           surface: "Wet Floor",          location: "B1 Car Park",             building: "HQ Tower",    riskLevel: "High",   controls: "Absorbent compound applied, safety cones",         reportedBy: "D. Wong",   date: "11 Jun", inspectionFreq: "Weekly",  lastInspected: "11 Jun",    status: "Open",    overdue: false },
  { ref: "STF-044", hazard: "Stairwell — worn non-slip nosing Step 7",         surface: "Step / Level Change",location: "Stairwell B — Level 2-3", building: "HQ Tower",    riskLevel: "High",   controls: "Temporary tread tape — replacement WO raised",     reportedBy: "M. Chen",   date: "10 Jun", inspectionFreq: "Monthly", lastInspected: "10 Jun",    status: "Open",    overdue: false },
  { ref: "STF-043", hazard: "Loading dock — uneven pavers causing trip",        surface: "Uneven Surface",     location: "Ground — Loading Bay",    building: "Warehouse A", riskLevel: "Medium", controls: "Yellow hazard tape, repair scheduled Week 25",     reportedBy: "T. Walsh",  date: "07 Jun", inspectionFreq: "Monthly", lastInspected: "07 Jun",    status: "Active",  overdue: false },
  { ref: "STF-042", hazard: "Fire exit path — obstructed by stored boxes",     surface: "Obstructed Path",    location: "Level 2 — South Wing",    building: "HQ Tower",    riskLevel: "High",   controls: "Area cleared same day",                           reportedBy: "J. Park",   date: "05 Jun", inspectionFreq: "Weekly",  lastInspected: "10 Jun",    status: "Closed",  overdue: false },
  { ref: "STF-041", hazard: "Exterior path — poor lighting after 5pm",         surface: "Poor Lighting",      location: "East Building Entry",     building: "Warehouse A", riskLevel: "Medium", controls: "Temporary flood light installed",                 reportedBy: "R. Kim",    date: "01 Jun", inspectionFreq: "Monthly", lastInspected: "01 Jun",    status: "Active",  overdue: false },
  { ref: "STF-040", hazard: "Reception area — cluttered cable runs",            surface: "Cluttered Area",     location: "Level 1 — Reception",     building: "HQ Tower",    riskLevel: "Low",    controls: "Cable management tray ordered",                   reportedBy: "S. Lee",    date: "20 May", inspectionFreq: "Monthly", lastInspected: "20 May",    status: "Active",  overdue: false },
  { ref: "STF-039", hazard: "Exterior walkway — rain pooling at expansion joint",surface:"Exterior — Rain",   location: "Courtyard Path",          building: "All",         riskLevel: "Medium", controls: "Seasonal signage, anti-slip tape applied",        reportedBy: "K. Davis",  date: "01 Apr", inspectionFreq: "Monthly", lastInspected: "01 May",    status: "Open",    overdue: true  },
];

export function SlipTripFallPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  return (
    <>
    <PageShell
      back={{ href: "/risk", label: "Risk Management" }}
      title="Slip, Trip & Fall Risk"
      description="Identify and control slip, trip and fall hazards — the dominant risk category in facilities management."
      cta="Report Hazard"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Report Hazard
          </button>
        }
      stats={
        <>
          <Stat label="Open Hazards"      value="5"  sub="require action"                      />
          <Stat label="Inspection Overdue" value="1"  sub="STF-039"           highlight="red"   />
          <Stat label="High Risk"          value="4"  sub="open items"        highlight="yellow"/>
          <Stat label="Closed (Month)"     value="3"  sub="controlled"        highlight="green" />
        </>
      }
      tabs={["All", "Open", "High Risk", "Overdue Inspection", "Closed"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Hazard</Th>
          <Th>Surface Type</Th>
          <Th>Location</Th>
          <Th>Building</Th>
          <Th>Risk Level</Th>
          <Th>Controls</Th>
          <Th>Reported</Th>
          <Th>Last Inspected</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => {
            const surfStyle = SURFACE_COLORS[r.surface] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.hazard}</span></Td>
                <Td><Badge label={r.surface} bg={surfStyle.bg} color={surfStyle.color} /></Td>
                <Td muted>{r.location}</Td>
                <Td muted>{r.building}</Td>
                <Td><SeverityBadge v={r.riskLevel} /></Td>
                <Td muted>{r.controls}</Td>
                <Td muted>{r.date}</Td>
                <Td>
                  <span style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.overdue ? 600 : undefined }}>
                    {r.lastInspected}{r.overdue ? " · overdue" : ""}
                  </span>
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <SlipTripFallDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}