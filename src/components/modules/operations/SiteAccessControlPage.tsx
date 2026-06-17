"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SiteAccessControlDrawer } from "./SiteAccessControlDrawer";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td } from "../shared";

type ZoneRisk   = "Exclusion" | "High Risk" | "Controlled" | "General";
type EntryResult = "Granted" | "Denied" | "Escorted";

const RISK_COLORS: Record<ZoneRisk, { bg: string; color: string }> = {
  "Exclusion":  { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "High Risk":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Controlled": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "General":    { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const ENTRY_COLORS: Record<EntryResult, { bg: string; color: string }> = {
  "Granted":  { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Denied":   { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Escorted": { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const ZONES = [
  { zone: "Crane Exclusion Zone — TC-04",       site: "Site 01", risk: "Exclusion"  as ZoneRisk, requirement: "Authorised lift team only",   authorised: 4,  lastEntry: "06:30",  status: "Active" },
  { zone: "Excavation — Grid H7 >1.5m",         site: "Site 02", risk: "High Risk"  as ZoneRisk, requirement: "Excavation permit + spotter", authorised: 6,  lastEntry: "07:15",  status: "Active" },
  { zone: "Electrical Substation — B-Block",     site: "Site 01", risk: "Exclusion"  as ZoneRisk, requirement: "Licensed electrician only",   authorised: 2,  lastEntry: "Yesterday",status:"Active"},
  { zone: "Scaffold Level 3 — East Face",        site: "Site 01", risk: "High Risk"  as ZoneRisk, requirement: "Working at heights induction", authorised: 12, lastEntry: "07:00",  status: "Active" },
  { zone: "Confined Space — Tank B",             site: "Site 01", risk: "Exclusion"  as ZoneRisk, requirement: "Confined space permit",        authorised: 3,  lastEntry: "08:00",  status: "Active" },
  { zone: "Demolition Zone — Wing C",            site: "Site 03", risk: "Exclusion"  as ZoneRisk, requirement: "Exclusion barrier required",   authorised: 5,  lastEntry: "—",      status: "Inactive"},
  { zone: "Main Laydown Area",                   site: "Site 02", risk: "Controlled" as ZoneRisk, requirement: "Site induction",               authorised: 43, lastEntry: "06:45",  status: "Active" },
  { zone: "General Construction Area",           site: "All",     risk: "General"    as ZoneRisk, requirement: "White Card + induction",        authorised: 43, lastEntry: "06:30",  status: "Active" },
];

const ACCESS_LOG = [
  { time: "13:47", person: "Unknown Visitor",   zone: "Electrical Substation — B-Block", site: "Site 01", type: "Visitor",    result: "Denied"   as EntryResult, reason: "No authorisation on file"  },
  { time: "13:22", person: "Marcus Chen",        zone: "Crane Exclusion Zone — TC-04",    site: "Site 01", type: "Worker",     result: "Granted"  as EntryResult, reason: "—"                         },
  { time: "12:50", person: "Chris Hammond",      zone: "Excavation — Grid H7",            site: "Site 02", type: "Contractor", result: "Escorted" as EntryResult, reason: "Site induction pending"    },
  { time: "11:30", person: "Derek Shaw (WorkSafe)",zone:"Main Laydown Area",              site: "Site 02", type: "Inspector",  result: "Granted"  as EntryResult, reason: "—"                         },
  { time: "10:15", person: "Sophie Walsh",       zone: "Confined Space — Tank B",         site: "Site 01", type: "Worker",     result: "Granted"  as EntryResult, reason: "—"                         },
  { time: "09:00", person: "Unknown Person",     zone: "Demolition Zone — Wing C",        site: "Site 03", type: "Unknown",    result: "Denied"   as EntryResult, reason: "Zone inactive — barriers"  },
  { time: "08:30", person: "James Tran",         zone: "Scaffold Level 3 — East Face",    site: "Site 01", type: "Worker",     result: "Granted"  as EntryResult, reason: "—"                         },
];

export function SiteAccessControlPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accessLog, setAccessLog] = useState(ACCESS_LOG);
  return (
    <>
    <PageShell
      back={{ href: "/operations", label: "Operations" }}
      title="Site Access Control"
      description="Control and audit who enters each zone and area on site."
      cta="Manage Access"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Manage Access
          </button>
        }
      stats={
        <>
          <Stat label="On Site Now"      value="22"  sub="workers + visitors"     highlight="green"  />
          <Stat label="Access Denied"    value="2"   sub="today"                  highlight="red"    />
          <Stat label="Active Zones"     value="7"   sub="of 8 configured"                           />
          <Stat label="Exclusion Zones"  value="4"   sub="restricted access"                         />
        </>
      }
      tabs={["Access Log", "Zones", "Denied", "Escorted"]}
    >
      {/* Zone summary strip */}
      <div className="px-4 pt-4 pb-2 border-b" style={{ borderColor: "var(--b-border)" }}>
        <div className="flex items-center gap-2 flex-wrap">
          {ZONES.map((z) => {
            const riskStyle = RISK_COLORS[z.risk];
            return (
              <div key={z.zone} className="flex items-center gap-1.5 border px-2.5 py-1.5"
                style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
                <Badge label={z.risk} bg={riskStyle.bg} color={riskStyle.color} />
                <span className="text-[11.5px]" style={{ color: "var(--b-text-secondary)" }}>{z.zone}</span>
                <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>·  {z.site}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Access log */}
      <table className="w-full">
        <TableHead>
          <Th>Time</Th>
          <Th>Person</Th>
          <Th>Zone</Th>
          <Th>Site</Th>
          <Th>Type</Th>
          <Th>Result</Th>
          <Th>Note</Th>
        </TableHead>
        <tbody>
          {accessLog.map((r, i) => {
            const entryStyle = ENTRY_COLORS[r.result];
            return (
              <Tr key={i}>
                <Td mono muted>{r.time}</Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.person}</span></Td>
                <Td muted>{r.zone}</Td>
                <Td muted>{r.site}</Td>
                <Td><Badge label={r.type} bg="var(--b-bg-active)" color="var(--b-text-tertiary)" /></Td>
                <Td><Badge label={r.result} bg={entryStyle.bg} color={entryStyle.color} /></Td>
                <Td muted>{r.reason}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <SiteAccessControlDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setAccessLog(prev => [{
      time: new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", hour12: false }),
      person: f.name || "New entrant",
      zone: f.zone || "—",
      site: f.site || "Site 01",
      type: "Worker",
      result: "Granted",
      reason: f.purpose || "—",
    } as (typeof ACCESS_LOG)[number], ...prev])} />
    </>
  );
}