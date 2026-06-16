"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { HealthMonitoringDrawer } from "./HealthMonitoringDrawer";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td } from "../shared";

type HazardType = "Noise" | "Dust" | "Fumes" | "Vibration" | "Chemicals";
type MonitorResult = "Below WES" | "Above WES" | "At Limit" | "Pending";

const HAZARD_COLORS: Record<HazardType, { bg: string; color: string }> = {
  "Noise":      { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Dust":       { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Fumes":      { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Vibration":  { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Chemicals":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const RESULT_COLORS: Record<MonitorResult, { bg: string; color: string }> = {
  "Below WES":  { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "At Limit":   { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Above WES":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Pending":    { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  ref: string; worker: string; area: string; hazard: HazardType;
  exposure: string; wesLimit: string; date: string;
  result: MonitorResult; nextDue: string; action: string;
}> = [
  { ref: "HM-034", worker: "Marcus Chen",   area: "Pressing Line 2",  hazard: "Noise",     exposure: "91 dB(A)",    wesLimit: "85 dB(A)", date: "10 Jun 2024", result: "Above WES", nextDue: "10 Dec 2024", action: "Hearing protection review" },
  { ref: "HM-033", worker: "James Tran",    area: "Welding Bay",       hazard: "Fumes",     exposure: "0.08 mg/m³",  wesLimit: "0.1 mg/m³",date: "07 Jun 2024", result: "At Limit",  nextDue: "07 Sep 2024", action: "Ventilation assessment ordered" },
  { ref: "HM-032", worker: "Priya Patel",   area: "Grinding Area",     hazard: "Dust",      exposure: "1.2 mg/m³",   wesLimit: "2.0 mg/m³",date: "05 Jun 2024", result: "Below WES", nextDue: "05 Dec 2024", action: "—" },
  { ref: "HM-031", worker: "Tom Barker",    area: "Grinding Area",     hazard: "Dust",      exposure: "1.8 mg/m³",   wesLimit: "2.0 mg/m³",date: "05 Jun 2024", result: "At Limit",  nextDue: "05 Sep 2024", action: "RPE upgrade recommended" },
  { ref: "HM-030", worker: "David Huang",   area: "Silica Processing", hazard: "Dust",      exposure: "0.022 mg/m³", wesLimit: "0.025 mg/m³",date:"03 Jun 2024", result: "At Limit",  nextDue: "03 Sep 2024", action: "Increase monitoring frequency" },
  { ref: "HM-029", worker: "Lisa Nguyen",   area: "Paint Booth",       hazard: "Chemicals", exposure: "12 ppm",      wesLimit: "20 ppm",   date: "01 Jun 2024", result: "Below WES", nextDue: "01 Dec 2024", action: "—" },
  { ref: "HM-028", worker: "Ryan O'Brien",  area: "Pressing Line 1",   hazard: "Noise",     exposure: "87 dB(A)",    wesLimit: "85 dB(A)", date: "30 May 2024", result: "Above WES", nextDue: "30 Nov 2024", action: "Audiometric test scheduled" },
  { ref: "HM-027", worker: "Natalie Kim",   area: "Assembly Line",     hazard: "Vibration", exposure: "4.2 m/s²",    wesLimit: "5.0 m/s²", date: "28 May 2024", result: "Below WES", nextDue: "28 Nov 2024", action: "—" },
  { ref: "HM-026", worker: "Sophie Walsh",  area: "Maintenance Bay",   hazard: "Fumes",     exposure: "—",           wesLimit: "0.1 mg/m³",date: "—",           result: "Pending",   nextDue: "20 Jun 2024", action: "Baseline monitoring due" },
];

export function HealthMonitoringPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
    <PageShell
      back={{ href: "/people", label: "People" }}
      title="Health Monitoring"
      description="Occupational exposure surveillance for noise, dust, fumes and hazardous substances."
      cta="Log Exposure"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Log Exposure
          </button>
        }
      stats={
        <>
          <Stat label="Workers Monitored" value="34"  sub="enrolled in program"              />
          <Stat label="Above WES"          value="2"   sub="immediate review"    highlight="red"    />
          <Stat label="At WES Limit"       value="3"   sub="increased monitoring" highlight="yellow" />
          <Stat label="Audiometry Due"     value="5"   sub="within 30 days"      highlight="yellow" />
        </>
      }
      tabs={["All", "Above WES", "At Limit", "Below WES", "Pending"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Worker</Th>
          <Th>Area</Th>
          <Th>Hazard</Th>
          <Th>Exposure</Th>
          <Th>WES Limit</Th>
          <Th>Date</Th>
          <Th>Result</Th>
          <Th>Next Due</Th>
          <Th>Action</Th>
        </TableHead>
        <tbody>
          {RECORDS.map((r) => {
            const hazardStyle = HAZARD_COLORS[r.hazard];
            const resultStyle = RESULT_COLORS[r.result];
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.worker}</span></Td>
                <Td muted>{r.area}</Td>
                <Td><Badge label={r.hazard} bg={hazardStyle.bg} color={hazardStyle.color} /></Td>
                <Td mono>
                  <span style={{ color: r.result === "Above WES" ? "#f06060" : "var(--b-text-secondary)", fontWeight: r.result === "Above WES" ? 600 : undefined, fontSize: "12.5px" }}>
                    {r.exposure}
                  </span>
                </Td>
                <Td mono muted>{r.wesLimit}</Td>
                <Td muted>{r.date}</Td>
                <Td><Badge label={r.result} bg={resultStyle.bg} color={resultStyle.color} /></Td>
                <Td>
                  <span style={{ color: r.result === "Pending" ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)", fontSize: "12.5px" }}>
                    {r.nextDue}
                  </span>
                </Td>
                <Td muted>{r.action}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <HealthMonitoringDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}