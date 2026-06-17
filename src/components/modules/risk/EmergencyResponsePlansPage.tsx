"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { EmergencyResponsePlansDrawer } from "./EmergencyResponsePlansDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab } from "../shared";

const SCENARIO_COLORS: Record<string, { bg: string; color: string }> = {
  "Fire":             { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Medical":          { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Evacuation":       { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Structural":       { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "Environmental":    { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Security":         { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Chemical":         { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Utility Failure":  { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
};

const RECORDS = [
  { ref: "ERP-001", title: "Site Emergency Response Plan — Site 01",      scenario: "Evacuation",      sites: "Site 01",      warden: "J. Smith",   assemblyPoints: "A1, A2",   approved: "J. Smith",   version: "Rev 3", lastTested: "05 Jun 2024", nextTest: "05 Sep 2024", status: "Active" as const, testOverdue: false },
  { ref: "ERP-002", title: "Site Emergency Response Plan — Site 02",      scenario: "Evacuation",      sites: "Site 02",      warden: "K. Davis",   assemblyPoints: "B1",       approved: "K. Davis",   version: "Rev 2", lastTested: "03 Jun 2024", nextTest: "03 Sep 2024", status: "Active" as const, testOverdue: false },
  { ref: "ERP-003", title: "Fire Emergency Response Plan",                 scenario: "Fire",            sites: "All sites",    warden: "M. Jones",   assemblyPoints: "A1, A2, B1",approved:"M. Jones",  version: "Rev 4", lastTested: "05 Jun 2024", nextTest: "05 Sep 2024", status: "Active" as const, testOverdue: false },
  { ref: "ERP-004", title: "Medical Emergency and First Aid Plan",         scenario: "Medical",         sites: "All sites",    warden: "T. Walsh",   assemblyPoints: "—",        approved: "T. Walsh",   version: "Rev 5", lastTested: "05 Jun 2024", nextTest: "05 Sep 2024", status: "Active" as const, testOverdue: false },
  { ref: "ERP-005", title: "Structural Collapse Response Plan",            scenario: "Structural",      sites: "All sites",    warden: "J. Smith",   assemblyPoints: "A1, B1",   approved: "J. Smith",   version: "Rev 1", lastTested: "—",           nextTest: "01 Jun 2024", status: "Active" as const, testOverdue: true  },
  { ref: "ERP-006", title: "Chemical Spill and Hazchem Response",          scenario: "Chemical",        sites: "Site 01, 02",  warden: "K. Davis",   assemblyPoints: "A2, B1",   approved: "K. Davis",   version: "Rev 2", lastTested: "—",           nextTest: "20 Jun 2024", status: "Active" as const, testOverdue: false },
  { ref: "ERP-007", title: "Security Incident and Bomb Threat Response",   scenario: "Security",        sites: "All sites",    warden: "M. Jones",   assemblyPoints: "A1, A2, B1",approved:"M. Jones",  version: "Rev 1", lastTested: "—",           nextTest: "10 Jan 2025", status: "Active" as const, testOverdue: false },
  { ref: "ERP-008", title: "Utility Failure — Power Outage Response",      scenario: "Utility Failure", sites: "All sites",    warden: "T. Walsh",   assemblyPoints: "—",        approved: "T. Walsh",   version: "Rev 1", lastTested: "—",           nextTest: "01 Aug 2024", status: "Draft"  as const, testOverdue: false },
  { ref: "ERP-009", title: "Environmental Spill — Sediment and Waterway",  scenario: "Environmental",   sites: "Site 02",      warden: "D. Wong",    assemblyPoints: "—",        approved: "—",          version: "Rev 1", lastTested: "—",           nextTest: "01 Aug 2024", status: "Draft"  as const, testOverdue: false },
];

export function EmergencyResponsePlansPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/risk", label: "Risk Management" }}
      title="Emergency Response Plans"
      description="Planning, documentation and testing of site emergency response procedures."
      cta="New ERP"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New ERP
          </button>
        }
      stats={
        <>
          <Stat label="Total Plans"     value="9"   sub="across all sites"                     />
          <Stat label="Test Overdue"    value="1"   sub="ERP-005"           highlight="red"    />
          <Stat label="Test Due (30d)"  value="2"   sub="ERP-006, ERP-008"  highlight="yellow" />
          <Stat label="Last Tested"     value="8d"  sub="ago · Site 01"     highlight="green"  />
        </>
      }
      tabs={["All", "Active", "Draft", "Test Overdue", "Test Due Soon"]}
      onTabChange={setTab}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Plan Title</Th>
          <Th>Scenario</Th>
          <Th>Sites</Th>
          <Th>Chief Warden</Th>
          <Th>Assembly Points</Th>
          <Th>Version</Th>
          <Th>Last Tested</Th>
          <Th>Next Test</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r)).map((r) => {
            const scStyle = SCENARIO_COLORS[r.scenario] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.title}</span></Td>
                <Td><Badge label={r.scenario} bg={scStyle.bg} color={scStyle.color} /></Td>
                <Td muted>{r.sites}</Td>
                <Td muted>{r.warden}</Td>
                <Td muted>{r.assemblyPoints}</Td>
                <Td muted>{r.version}</Td>
                <Td muted>{r.lastTested}</Td>
                <Td>
                  <span style={{ color: r.testOverdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.testOverdue ? 600 : undefined }}>
                    {r.nextTest}{r.testOverdue ? " · overdue" : ""}
                  </span>
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <EmergencyResponsePlansDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}