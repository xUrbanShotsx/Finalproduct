"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { ExposureMonitoringDrawer } from "./ExposureMonitoringDrawer";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td } from "../shared";

const AGENT_COLORS: Record<string, { bg: string; color: string }> = {
  "Noise":          { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Dust — Silica":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Dust — Nuisance":{ bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Fumes":          { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Chemical Vapour":{ bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Vibration":      { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "UV Radiation":   { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Hexavalent Cr":  { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
};

const RECORDS: Array<{
  ref: string; agent: string; agentType: string; workerGroup: string;
  area: string; wes: string; measuredLevel: string; percentWes: number;
  monitorDate: string; nextMonitor: string; aboveWes: boolean; exceedance: boolean;
}> = [
  { ref: "EXP-031", agent: "Noise — grinding operations",          agentType: "Noise",           workerGroup: "Grinding crew",       area: "Welding Bay A",    wes: "85 dB(A)",    measuredLevel: "88 dB(A)",    percentWes: 104, monitorDate: "01 Jun 2024", nextMonitor: "01 Sep 2024", aboveWes: true,  exceedance: true  },
  { ref: "EXP-030", agent: "Hexavalent chromium — plating process",agentType: "Hexavalent Cr",   workerGroup: "Plating operators",   area: "Plating Line A",   wes: "0.05 mg/m³",  measuredLevel: "0.07 mg/m³",  percentWes: 140, monitorDate: "13 Jun 2024", nextMonitor: "13 Jul 2024", aboveWes: true,  exceedance: true  },
  { ref: "EXP-029", agent: "Respirable silica — cutting concrete", agentType: "Dust — Silica",   workerGroup: "Concrete cutters",    area: "CNC Machine Shop", wes: "0.05 mg/m³",  measuredLevel: "0.03 mg/m³",  percentWes: 60,  monitorDate: "15 May 2024", nextMonitor: "15 Aug 2024", aboveWes: false, exceedance: false },
  { ref: "EXP-028", agent: "Isocyanate vapour — spray painting",   agentType: "Chemical Vapour", workerGroup: "Paint booth ops",     area: "Paint Booth B",    wes: "0.02 ppm",    measuredLevel: "0.01 ppm",    percentWes: 50,  monitorDate: "10 May 2024", nextMonitor: "10 Aug 2024", aboveWes: false, exceedance: false },
  { ref: "EXP-027", agent: "Welding fumes — MIG/TIG",              agentType: "Fumes",           workerGroup: "Welders",             area: "Welding Bay A",    wes: "1 mg/m³",     measuredLevel: "0.6 mg/m³",   percentWes: 60,  monitorDate: "01 May 2024", nextMonitor: "01 Aug 2024", aboveWes: false, exceedance: false },
  { ref: "EXP-026", agent: "Nuisance dust — grinding",             agentType: "Dust — Nuisance", workerGroup: "Grinding crew",       area: "Welding Bay A",    wes: "10 mg/m³",    measuredLevel: "4.2 mg/m³",   percentWes: 42,  monitorDate: "01 May 2024", nextMonitor: "01 Aug 2024", aboveWes: false, exceedance: false },
  { ref: "EXP-025", agent: "MEK vapour — solvent application",     agentType: "Chemical Vapour", workerGroup: "Coating operators",   area: "Solvent Store",    wes: "150 ppm",     measuredLevel: "62 ppm",      percentWes: 41,  monitorDate: "15 Apr 2024", nextMonitor: "15 Jul 2024", aboveWes: false, exceedance: false },
  { ref: "EXP-024", agent: "Hand-arm vibration — jackhammer",      agentType: "Vibration",       workerGroup: "Demo crew",           area: "Assembly Line 3",  wes: "5 m/s²",      measuredLevel: "3.8 m/s²",    percentWes: 76,  monitorDate: "10 Apr 2024", nextMonitor: "10 Jul 2024", aboveWes: false, exceedance: false },
  { ref: "EXP-023", agent: "UV radiation — outdoor welding",       agentType: "UV Radiation",    workerGroup: "Outdoor welders",     area: "External yard",    wes: "3 mJ/cm²",    measuredLevel: "1.8 mJ/cm²",  percentWes: 60,  monitorDate: "01 Apr 2024", nextMonitor: "01 Jul 2024", aboveWes: false, exceedance: false },
  { ref: "EXP-022", agent: "Noise — compressor room ambient",      agentType: "Noise",           workerGroup: "Maintenance team",    area: "Compressor Room",  wes: "85 dB(A)",    measuredLevel: "82 dB(A)",    percentWes: 96,  monitorDate: "01 Mar 2024", nextMonitor: "01 Jun 2024", aboveWes: false, exceedance: false },
];

export function ExposureMonitoringPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const exceedances = rows.filter(r => r.exceedance).length;
  return (
    <>
    <PageShell
      back={{ href: "/compliance", label: "Compliance" }}
      title="Exposure Monitoring"
      description="Noise, dust and chemical exposure records measured against Workplace Exposure Standards."
      cta="New Monitor"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New Monitor
          </button>
        }
      stats={
        <>
          <Stat label="Active Agents"     value={String(rows.length)} sub="under monitoring"                         />
          <Stat label="Above WES"          value={String(exceedances)}    sub="immediate action required" highlight="red"   />
          <Stat label=">50% WES"           value="3"                      sub="approaching limits"        highlight="yellow"/>
          <Stat label="Monitoring Due"     value="2"                      sub="EXP-022, EXP-023"         highlight="green"  />
        </>
      }
      tabs={["All", "Above WES", "Approaching Limit", "Noise", "Dust & Chemicals"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Agent</Th>
          <Th>Type</Th>
          <Th>Worker Group</Th>
          <Th>Area</Th>
          <Th>WES</Th>
          <Th>Measured Level</Th>
          <Th right>% WES</Th>
          <Th>Monitored</Th>
          <Th>Next Monitor</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => {
            const agentStyle = AGENT_COLORS[r.agentType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            const pctColor = r.percentWes > 100 ? "#f06060" : r.percentWes >= 50 ? "var(--b-badge-yellow-text)" : "var(--b-badge-green-text)";
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.agent}</span></Td>
                <Td><Badge label={r.agentType} bg={agentStyle.bg} color={agentStyle.color} /></Td>
                <Td muted>{r.workerGroup}</Td>
                <Td muted>{r.area}</Td>
                <Td muted>{r.wes}</Td>
                <Td>
                  <span style={{ color: r.aboveWes ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.aboveWes ? 600 : undefined }}>
                    {r.measuredLevel}{r.aboveWes ? " ↑" : ""}
                  </span>
                </Td>
                <Td right>
                  <span className="font-mono text-[12.5px]" style={{ color: pctColor, fontWeight: r.percentWes >= 50 ? 600 : undefined }}>
                    {r.percentWes}%
                  </span>
                </Td>
                <Td muted>{r.monitorDate}</Td>
                <Td muted>{r.nextMonitor}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <ExposureMonitoringDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}