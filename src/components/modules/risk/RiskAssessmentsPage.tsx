"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { RiskAssessmentsDrawer } from "./RiskAssessmentsDrawer";
import { PageShell, Stat, SeverityBadge, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const HOC_COLORS: Record<string, { bg: string; color: string }> = {
  "Elimination":    { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Substitution":   { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Engineering":    { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Isolation":      { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Administrative": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "PPE":            { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const RECORDS: Array<{
  ref: string; task: string; area: string;
  likelihood: number; consequence: number; rating: number;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  highestControl: string; assessedBy: string; date: string; nextReview: string;
  status: "Active" | "Draft" | "Pending" | "Closed";
  overdue: boolean;
}> = [
  { ref: "RA-2024-031", task: "Crane lift — concrete panels over pedestrian path",     area: "Site 01 — Grid B",  likelihood: 2, consequence: 5, rating: 10, riskLevel: "High",     highestControl: "Engineering",    assessedBy: "J. Smith",  date: "10 Jun 2024", nextReview: "10 Dec 2024", status: "Active",  overdue: false },
  { ref: "RA-2024-030", task: "Excavation adjacent to existing building footings",     area: "Site 02",           likelihood: 3, consequence: 5, rating: 15, riskLevel: "Critical", highestControl: "Engineering",    assessedBy: "M. Jones",  date: "05 Jun 2024", nextReview: "05 Dec 2024", status: "Active",  overdue: false },
  { ref: "RA-2024-029", task: "Hot work in partially enclosed space",                  area: "Site 01 — L3",      likelihood: 2, consequence: 4, rating: 8,  riskLevel: "High",     highestControl: "Isolation",      assessedBy: "K. Davis",  date: "01 Jun 2024", nextReview: "01 Dec 2024", status: "Active",  overdue: false },
  { ref: "RA-2024-028", task: "Concrete saw cutting — interior slabs",                 area: "Site 01 — L2",      likelihood: 3, consequence: 3, rating: 9,  riskLevel: "High",     highestControl: "Engineering",    assessedBy: "T. Walsh",  date: "25 May 2024", nextReview: "25 Nov 2024", status: "Active",  overdue: false },
  { ref: "RA-2024-027", task: "Scaffold erection at edge of structure",                area: "Site 01 — Perimeter",likelihood:2, consequence: 5, rating: 10, riskLevel: "High",     highestControl: "Administrative", assessedBy: "J. Smith",  date: "20 May 2024", nextReview: "20 Nov 2024", status: "Active",  overdue: false },
  { ref: "RA-2024-026", task: "Electrical board installation — live switchboard",      area: "Site 01 — B-Block", likelihood: 1, consequence: 5, rating: 5,  riskLevel: "High",     highestControl: "Isolation",      assessedBy: "M. Jones",  date: "15 May 2024", nextReview: "15 Nov 2024", status: "Active",  overdue: false },
  { ref: "RA-2024-025", task: "Manual handling of precast panels",                     area: "Site 01 — Yard",    likelihood: 3, consequence: 3, rating: 9,  riskLevel: "High",     highestControl: "Engineering",    assessedBy: "K. Davis",  date: "10 May 2024", nextReview: "10 Nov 2024", status: "Active",  overdue: false },
  { ref: "RA-2024-024", task: "Roof penetration works — skylights",                    area: "Site 01 — Roof",    likelihood: 2, consequence: 5, rating: 10, riskLevel: "High",     highestControl: "Administrative", assessedBy: "D. Wong",   date: "05 May 2024", nextReview: "05 Nov 2024", status: "Active",  overdue: false },
  { ref: "RA-2024-023", task: "Confined space entry — stormwater pit",                 area: "Site 02",           likelihood: 2, consequence: 5, rating: 10, riskLevel: "High",     highestControl: "Administrative", assessedBy: "T. Walsh",  date: "01 May 2024", nextReview: "01 Nov 2024", status: "Active",  overdue: false },
  { ref: "RA-2024-022", task: "Night works — lighting and traffic management",         area: "All sites",         likelihood: 3, consequence: 3, rating: 9,  riskLevel: "High",     highestControl: "Administrative", assessedBy: "J. Smith",  date: "15 Mar 2024", nextReview: "15 Mar 2025", status: "Active",  overdue: false },
  { ref: "RA-2024-021", task: "Working near overhead power lines",                     area: "Site 02 — Boundary",likelihood: 2, consequence: 5, rating: 10, riskLevel: "High",     highestControl: "Elimination",    assessedBy: "M. Jones",  date: "01 Feb 2024", nextReview: "01 Feb 2025", status: "Active",  overdue: false },
  { ref: "RA-2024-020", task: "Demolition — asbestos-containing materials suspected",  area: "Site 03",           likelihood: 2, consequence: 5, rating: 10, riskLevel: "High",     highestControl: "Substitution",   assessedBy: "K. Davis",  date: "15 Nov 2023", nextReview: "15 Nov 2024", status: "Draft",   overdue: false },
];

export function RiskAssessmentsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  return (
    <>
    <PageShell
      back={{ href: "/risk", label: "Risk Management" }}
      title="Risk Assessments"
      description="Formal likelihood × consequence assessments with hierarchy of controls."
      cta="New Assessment"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New Assessment
          </button>
        }
      stats={
        <>
          <Stat label="Total Assessments" value="31"  sub="in register"                        />
          <Stat label="Critical Risk"      value="1"   sub="RA-2024-030"      highlight="red"   />
          <Stat label="High Risk"          value="10"  sub="active tasks"     highlight="yellow"/>
          <Stat label="Draft / Pending"    value="1"   sub="awaiting approval"                  />
        </>
      }
      tabs={["All", "Critical", "High", "Draft", "Closed"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Task / Activity</Th>
          <Th>Area</Th>
          <Th right>L</Th>
          <Th right>C</Th>
          <Th right>Rating</Th>
          <Th>Risk Level</Th>
          <Th>Highest Control</Th>
          <Th>Assessed By</Th>
          <Th>Next Review</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => {
            const hocStyle = HOC_COLORS[r.highestControl] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.task}</span></Td>
                <Td muted>{r.area}</Td>
                <Td right mono muted>{r.likelihood}</Td>
                <Td right mono muted>{r.consequence}</Td>
                <Td right>
                  <span className="font-mono text-[13px]" style={{
                    color: r.rating >= 15 ? "#f06060" : r.rating >= 8 ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)",
                    fontWeight: r.rating >= 8 ? 600 : undefined,
                  }}>{r.rating}</span>
                </Td>
                <Td><SeverityBadge v={r.riskLevel} /></Td>
                <Td><Badge label={r.highestControl} bg={hocStyle.bg} color={hocStyle.color} /></Td>
                <Td muted>{r.assessedBy}</Td>
                <Td muted>{r.nextReview}</Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <RiskAssessmentsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}