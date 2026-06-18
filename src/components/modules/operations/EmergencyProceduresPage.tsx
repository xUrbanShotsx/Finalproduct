"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { EmergencyProceduresDrawer } from "./EmergencyProceduresDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab, matchesSite, siteOptionsOf } from "../shared";

const PROC_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Fire":           { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Evacuation":     { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Medical":        { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Spill":          { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Structural":     { bg: "rgba(240,96,96,0.15)",     color: "#f06060" },
  "Electrical":     { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Bomb Threat":    { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "Natural Hazard": { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const RECORDS = [
  { ref: "EP-012", title: "Site Evacuation — Assembly Points",        type: "Evacuation",    sites: "All Sites",  version: "Rev 4", lastReviewed: "10 Jan 2024", lastDrill: "05 Jun 2024", nextDrill: "05 Sep 2024", status: "Active" as const, daysToNextDrill: 83 },
  { ref: "EP-011", title: "Fire Response and Suppression",            type: "Fire",          sites: "All Sites",  version: "Rev 3", lastReviewed: "10 Jan 2024", lastDrill: "05 Jun 2024", nextDrill: "05 Sep 2024", status: "Active" as const, daysToNextDrill: 83 },
  { ref: "EP-010", title: "Medical Emergency and First Aid Response", type: "Medical",       sites: "All Sites",  version: "Rev 5", lastReviewed: "10 Jan 2024", lastDrill: "05 Jun 2024", nextDrill: "05 Sep 2024", status: "Active" as const, daysToNextDrill: 83 },
  { ref: "EP-009", title: "Hazardous Chemical Spill Response",        type: "Spill",         sites: "Site 01, 02",version: "Rev 2", lastReviewed: "15 Feb 2024", lastDrill: "—",           nextDrill: "20 Jun 2024", status: "Active" as const, daysToNextDrill: 7  },
  { ref: "EP-008", title: "Structural Collapse Response",             type: "Structural",    sites: "All Sites",  version: "Rev 1", lastReviewed: "01 Mar 2024", lastDrill: "—",           nextDrill: "01 Jun 2024", status: "Active" as const, daysToNextDrill: -12},
  { ref: "EP-007", title: "Electrical Incident Response",             type: "Electrical",    sites: "Site 01, 03",version: "Rev 2", lastReviewed: "20 Feb 2024", lastDrill: "—",           nextDrill: "20 Aug 2024", status: "Active" as const, daysToNextDrill: 68 },
  { ref: "EP-006", title: "Bomb Threat and Security Incident",        type: "Bomb Threat",   sites: "All Sites",  version: "Rev 1", lastReviewed: "10 Jan 2024", lastDrill: "—",           nextDrill: "10 Jan 2025", status: "Active" as const, daysToNextDrill: 210},
  { ref: "EP-005", title: "Severe Weather and Natural Hazard",        type: "Natural Hazard",sites: "All Sites",  version: "Rev 2", lastReviewed: "01 Nov 2023", lastDrill: "—",           nextDrill: "01 Nov 2024", status: "Draft" as const,  daysToNextDrill: 141},
];

export function EmergencyProceduresPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/operations", label: "Operations" }}
      title="Emergency Procedures"
      description="Live site emergency response procedures, assembly points and drill records."
      cta="New Procedure"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New Procedure
          </button>
        }
      stats={
        <>
          <Stat label="Total Procedures"  value="12"   sub="in the register"                       />
          <Stat label="Drills Overdue"    value="1"    sub="EP-008"              highlight="red"    />
          <Stat label="Drills Due (30d)"  value="2"    sub="EP-009, EP-005"      highlight="yellow" />
          <Stat label="Last Drill"        value="8d"   sub="ago · Site 01"       highlight="green"  />
        </>
      }
      tabs={["All", "Active", "Draft", "Drill Overdue", "Drill Due Soon"]}
      onTabChange={setTab}
      siteOptions={siteOptionsOf(rows)}
      onSiteChange={setSite}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Procedure</Th>
          <Th>Type</Th>
          <Th>Sites</Th>
          <Th>Version</Th>
          <Th>Last Reviewed</Th>
          <Th>Last Drill</Th>
          <Th>Next Drill</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r) && matchesSite(site, r)).map((r) => {
            const typeStyle = PROC_TYPE_COLORS[r.type] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            const drillColor = r.daysToNextDrill < 0 ? "#f06060"
              : r.daysToNextDrill <= 30 ? "var(--b-badge-yellow-text)"
              : "var(--b-text-muted)";
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.title}</span></Td>
                <Td><Badge label={r.type} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td muted>{r.sites}</Td>
                <Td muted>{r.version}</Td>
                <Td muted>{r.lastReviewed}</Td>
                <Td muted>{r.lastDrill}</Td>
                <Td>
                  <span style={{ color: drillColor, fontSize: "12.5px", fontWeight: r.daysToNextDrill < 0 ? 600 : undefined }}>
                    {r.nextDrill}{r.daysToNextDrill < 0 ? " · overdue" : ""}
                  </span>
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <EmergencyProceduresDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}