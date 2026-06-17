"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { InspectionsAuditsDrawer } from "./InspectionsAuditsDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const AUDIT_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Internal":       { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "External":       { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Regulator":      { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Pre-start":      { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Site Walk":      { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Certification":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const RECORDS: Array<{
  ref: string; title: string; auditType: string; area: string;
  scheduledDate: string; conductor: string;
  status: "Active" | "Pending" | "Closed" | "Overdue";
  findings: number; actionsOpen: number; score: number | null; overdue: boolean;
}> = [
  { ref: "AUD-2024-047", title: "Monthly WHS Site Inspection — Site 01",         auditType: "Internal",      area: "Site 01",          scheduledDate: "14 Jun 2024", conductor: "J. Smith",   status: "Pending",  findings: 0,  actionsOpen: 0,  score: null, overdue: false },
  { ref: "AUD-2024-046", title: "SafeWork NSW Compliance Visit",                  auditType: "Regulator",     area: "Site 01, 02",      scheduledDate: "13 Jun 2024", conductor: "D. Shaw (SafeWork)", status: "Active", findings: 3, actionsOpen: 3, score: null, overdue: false },
  { ref: "AUD-2024-045", title: "Scaffold Inspection — Site 01 Weekly",           auditType: "Internal",      area: "Site 01 — All",    scheduledDate: "10 Jun 2024", conductor: "T. Walsh",   status: "Closed",   findings: 2,  actionsOpen: 0,  score: 91,   overdue: false },
  { ref: "AUD-2024-044", title: "Monthly WHS Site Inspection — Site 02",         auditType: "Internal",      area: "Site 02",          scheduledDate: "07 Jun 2024", conductor: "K. Davis",   status: "Closed",   findings: 4,  actionsOpen: 1,  score: 84,   overdue: false },
  { ref: "AUD-2024-043", title: "ISO 45001 Surveillance Audit",                   auditType: "External",      area: "All sites",        scheduledDate: "05 Jun 2024", conductor: "SAI Global", status: "Closed",   findings: 1,  actionsOpen: 0,  score: 96,   overdue: false },
  { ref: "AUD-2024-042", title: "Daily Site Walk — Senior HSE",                   auditType: "Site Walk",     area: "Site 01",          scheduledDate: "13 Jun 2024", conductor: "M. Jones",   status: "Active",   findings: 1,  actionsOpen: 1,  score: null, overdue: false },
  { ref: "AUD-2024-041", title: "Fire Safety Equipment Inspection",               auditType: "Certification", area: "All sites",        scheduledDate: "01 Jun 2024", conductor: "Fireco Pty", status: "Closed",   findings: 1,  actionsOpen: 0,  score: 98,   overdue: false },
  { ref: "AUD-2024-040", title: "Monthly WHS Site Inspection — Site 03",         auditType: "Internal",      area: "Site 03",          scheduledDate: "01 May 2024", conductor: "D. Wong",    status: "Overdue",  findings: 0,  actionsOpen: 0,  score: null, overdue: true  },
  { ref: "AUD-2024-039", title: "Plant & Equipment Annual Certification",          auditType: "Certification", area: "All sites",        scheduledDate: "15 Apr 2024", conductor: "WorkSafe Eng",status: "Closed",  findings: 2,  actionsOpen: 0,  score: 89,   overdue: false },
  { ref: "AUD-2024-038", title: "Electrical Safety Compliance Audit",             auditType: "External",      area: "Site 01, 03",      scheduledDate: "10 Apr 2024", conductor: "ElecSafe Co",status: "Closed",   findings: 0,  actionsOpen: 0,  score: 100,  overdue: false },
];

export function InspectionsAuditsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  return (
    <>
    <PageShell
      back={{ href: "/compliance", label: "Compliance" }}
      title="Inspections & Audits"
      description="Scheduled compliance checks, site inspections and formal audit trails."
      cta="Schedule Audit"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Schedule Audit
          </button>
        }
      stats={
        <>
          <Stat label="Scheduled (Month)"  value="6"   sub="upcoming"                          />
          <Stat label="Overdue"            value="1"   sub="AUD-2024-040"    highlight="red"   />
          <Stat label="Open Findings"      value="4"   sub="require action"  highlight="yellow"/>
          <Stat label="Avg Score"          value="92%" sub="closed audits"   highlight="green" />
        </>
      }
      tabs={["All", "Active", "Pending", "Overdue", "Closed"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Audit / Inspection</Th>
          <Th>Type</Th>
          <Th>Area</Th>
          <Th>Scheduled</Th>
          <Th>Conductor</Th>
          <Th right>Findings</Th>
          <Th right>Open Actions</Th>
          <Th right>Score</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => {
            const typeStyle = AUDIT_TYPE_COLORS[r.auditType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.title}</span></Td>
                <Td><Badge label={r.auditType} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td muted>{r.area}</Td>
                <Td>
                  <span style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.overdue ? 600 : undefined }}>
                    {r.scheduledDate}{r.overdue ? " · overdue" : ""}
                  </span>
                </Td>
                <Td muted>{r.conductor}</Td>
                <Td right>
                  {r.findings > 0
                    ? <Badge label={String(r.findings)} bg="rgba(240,96,96,0.1)" color="#f06060" />
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td right>
                  {r.actionsOpen > 0
                    ? <Badge label={String(r.actionsOpen)} bg="var(--b-badge-yellow-bg)" color="var(--b-badge-yellow-text)" />
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td right>
                  {r.score !== null
                    ? <span className="font-mono text-[12.5px]" style={{ color: r.score >= 95 ? "var(--b-badge-green-text)" : r.score >= 80 ? "var(--b-badge-yellow-text)" : "#f06060", fontWeight: 600 }}>{r.score}%</span>
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <InspectionsAuditsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}