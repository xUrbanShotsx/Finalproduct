"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { FatigueDrawer } from "./FatigueDrawer";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td } from "../shared";

type ShiftType   = "Day" | "Night" | "Overtime" | "Split";
type RiskLevel   = "Low" | "Moderate" | "High" | "Critical";

const SHIFT_COLORS: Record<ShiftType, { bg: string; color: string }> = {
  "Day":      { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Night":    { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Overtime": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Split":    { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const RISK_COLORS: Record<RiskLevel, { bg: string; color: string }> = {
  "Low":      { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Moderate": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "High":     { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Critical": { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
};

const RECORDS: Array<{
  ref: string; worker: string; site: string; date: string;
  start: string; hours: number; shiftType: ShiftType;
  consecutiveDays: number; fatigueRisk: RiskLevel; action: string;
}> = [
  { ref: "FAT-240613-018", worker: "Marcus Chen",   site: "Site 01", date: "13 Jun", start: "05:00", hours: 13.5, shiftType: "Overtime",  consecutiveDays: 6, fatigueRisk: "Critical", action: "Stood down — exceeded 13h limit" },
  { ref: "FAT-240613-017", worker: "Tom Barker",    site: "Site 01", date: "13 Jun", start: "06:00", hours: 12.0, shiftType: "Overtime",  consecutiveDays: 5, fatigueRisk: "High",     action: "Supervisor notified"            },
  { ref: "FAT-240613-016", worker: "James Tran",    site: "Site 02", date: "13 Jun", start: "06:30", hours: 10.0, shiftType: "Day",       consecutiveDays: 5, fatigueRisk: "Moderate", action: "Monitoring"                     },
  { ref: "FAT-240613-015", worker: "Natalie Kim",   site: "Site 02", date: "13 Jun", start: "06:30", hours:  9.5, shiftType: "Day",       consecutiveDays: 4, fatigueRisk: "Low",      action: "—"                              },
  { ref: "FAT-240613-014", worker: "David Huang",   site: "Site 01", date: "13 Jun", start: "07:00", hours:  9.0, shiftType: "Day",       consecutiveDays: 3, fatigueRisk: "Low",      action: "—"                              },
  { ref: "FAT-240613-013", worker: "Sophie Walsh",  site: "All",     date: "13 Jun", start: "07:30", hours:  8.0, shiftType: "Day",       consecutiveDays: 2, fatigueRisk: "Low",      action: "—"                              },
  { ref: "FAT-240613-012", worker: "Ryan O'Brien",  site: "Site 03", date: "13 Jun", start: "18:00", hours: 11.0, shiftType: "Night",     consecutiveDays: 3, fatigueRisk: "Moderate", action: "Monitoring"                     },
  { ref: "FAT-240613-011", worker: "Lisa Nguyen",   site: "Site 03", date: "13 Jun", start: "18:00", hours:  9.5, shiftType: "Night",     consecutiveDays: 2, fatigueRisk: "Low",      action: "—"                              },
  { ref: "FAT-240613-010", worker: "Priya Patel",   site: "Site 01", date: "13 Jun", start: "06:00", hours: 12.5, shiftType: "Split",     consecutiveDays: 4, fatigueRisk: "High",     action: "Reviewed with supervisor"       },
];

export function FatigueManagementPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  return (
    <>
    <PageShell
      back={{ href: "/people", label: "People" }}
      title="Fatigue Management"
      description="Shift hours logging and fatigue risk assessment for shift workers."
      cta="Log Hours"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Log Fatigue
          </button>
        }
      stats={
        <>
          <Stat label="Logged Today"     value="18"   sub="of 20 workers"                         />
          <Stat label="Critical Risk"    value="1"    sub="stood down"           highlight="red"   />
          <Stat label="High Risk"        value="2"    sub=">12h or 6+ day run"   highlight="yellow"/>
          <Stat label="Avg Hours Today"  value="9.8h" sub="site average"                          />
        </>
      }
      tabs={["Today", "This Week", "Low", "Moderate", "High / Critical"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Worker</Th>
          <Th>Site</Th>
          <Th>Date</Th>
          <Th>Start</Th>
          <Th right>Hours</Th>
          <Th>Shift</Th>
          <Th right>Consec. Days</Th>
          <Th>Fatigue Risk</Th>
          <Th>Action Taken</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => {
            const shiftStyle = SHIFT_COLORS[r.shiftType];
            const riskStyle  = RISK_COLORS[r.fatigueRisk];
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.worker}</span></Td>
                <Td muted>{r.site}</Td>
                <Td muted>{r.date}</Td>
                <Td mono muted>{r.start}</Td>
                <Td right>
                  <span style={{
                    color: r.hours >= 13 ? "#f06060" : r.hours >= 12 ? "var(--b-badge-yellow-text)" : "var(--b-text-secondary)",
                    fontWeight: r.hours >= 12 ? 600 : undefined,
                    fontSize: "12.5px",
                  }}>
                    {r.hours}h
                  </span>
                </Td>
                <Td><Badge label={r.shiftType} bg={shiftStyle.bg} color={shiftStyle.color} /></Td>
                <Td right>
                  <span style={{
                    color: r.consecutiveDays >= 6 ? "#f06060" : r.consecutiveDays >= 5 ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)",
                    fontSize: "12.5px",
                  }}>
                    {r.consecutiveDays}
                  </span>
                </Td>
                <Td><Badge label={r.fatigueRisk} bg={riskStyle.bg} color={riskStyle.color} /></Td>
                <Td muted>{r.action}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <FatigueDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}