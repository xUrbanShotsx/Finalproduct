"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PpeRegisterDrawer } from "./PpeRegisterDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab } from "../shared";

const PPE_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Head":        { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Eye/Face":    { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Hearing":     { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Respiratory": { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Hand":        { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Foot":        { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Hi-vis":      { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Fall Arrest": { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Skin":        { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  ref: string; item: string; ppeType: string; issuedTo: string;
  standard: string; issueDate: string; expiryDate: string | null;
  inspectionDue: string; status: "Active" | "Expired" | "Pending" | "Closed";
  expired: boolean; inspectionOverdue: boolean;
}> = [
  { ref: "PPE-2024-098", item: "Full Body Harness — Protecta P200",        ppeType: "Fall Arrest", issuedTo: "M. Chen",    standard: "AS/NZS 1891.1", issueDate: "01 Jan 2024", expiryDate: "01 Jan 2025",   inspectionDue: "01 Jul 2024", status: "Active",  expired: false, inspectionOverdue: false },
  { ref: "PPE-2024-097", item: "Full Body Harness — Protecta P200",        ppeType: "Fall Arrest", issuedTo: "T. Walsh",   standard: "AS/NZS 1891.1", issueDate: "01 Jan 2024", expiryDate: "01 Jan 2025",   inspectionDue: "01 Jul 2024", status: "Active",  expired: false, inspectionOverdue: false },
  { ref: "PPE-2024-096", item: "P2 Respirator — 3M 8822",                  ppeType: "Respiratory", issuedTo: "D. Wong",    standard: "AS/NZS 1716",   issueDate: "01 Mar 2024", expiryDate: "01 Sep 2024",   inspectionDue: "Monthly",     status: "Active",  expired: false, inspectionOverdue: false },
  { ref: "PPE-2024-095", item: "Half-face Respirator — 3M 6503",           ppeType: "Respiratory", issuedTo: "S. Lee",     standard: "AS/NZS 1716",   issueDate: "15 Feb 2024", expiryDate: null,             inspectionDue: "15 Aug 2024", status: "Active",  expired: false, inspectionOverdue: false },
  { ref: "PPE-2024-094", item: "Safety Helmet — JSP EVO3",                  ppeType: "Head",        issuedTo: "P. Nguyen",  standard: "AS/NZS 1801",   issueDate: "01 Jun 2022", expiryDate: "01 Jun 2024",   inspectionDue: "Expired",     status: "Expired", expired: true,  inspectionOverdue: false },
  { ref: "PPE-2024-093", item: "Safety Helmet — JSP EVO3",                  ppeType: "Head",        issuedTo: "J. Park",    standard: "AS/NZS 1801",   issueDate: "01 Mar 2024", expiryDate: "01 Mar 2026",   inspectionDue: "01 Sep 2024", status: "Active",  expired: false, inspectionOverdue: false },
  { ref: "PPE-2024-092", item: "Hearing Protection — 3M Peltor Optime II", ppeType: "Hearing",     issuedTo: "R. Kim",     standard: "AS/NZS 1270",   issueDate: "01 Apr 2024", expiryDate: null,             inspectionDue: "Ongoing",     status: "Active",  expired: false, inspectionOverdue: false },
  { ref: "PPE-2024-091", item: "Safety Glasses — Bolle Rush+",              ppeType: "Eye/Face",    issuedTo: "M. Chen",    standard: "AS/NZS 1337.1", issueDate: "01 Jan 2024", expiryDate: null,             inspectionDue: "Replace if damaged",status:"Active", expired: false, inspectionOverdue: false },
  { ref: "PPE-2024-090", item: "Chemical Splash Goggles — Uvex 9302",       ppeType: "Eye/Face",    issuedTo: "K. Davis",   standard: "AS/NZS 1337.1", issueDate: "01 May 2024", expiryDate: null,             inspectionDue: "Replace if damaged",status:"Active", expired: false, inspectionOverdue: false },
  { ref: "PPE-2024-089", item: "Safety Boots — Blundstone 882",             ppeType: "Foot",        issuedTo: "T. Walsh",   standard: "AS/NZS 2210.3", issueDate: "01 Feb 2024", expiryDate: null,             inspectionDue: "Replace if worn",   status:"Active", expired: false, inspectionOverdue: false },
  { ref: "PPE-2024-088", item: "Hi-vis Vest — Class D/N",                   ppeType: "Hi-vis",      issuedTo: "All crew",   standard: "AS/NZS 4602.1", issueDate: "01 Jan 2024", expiryDate: null,             inspectionDue: "Replace if faded", status:"Active",  expired: false, inspectionOverdue: false },
  { ref: "PPE-2024-087", item: "Full Body Harness — Protecta P200",        ppeType: "Fall Arrest", issuedTo: "S. Lee",     standard: "AS/NZS 1891.1", issueDate: "01 Jul 2022", expiryDate: "01 Jul 2024",   inspectionDue: "01 Jan 2024", status: "Expired", expired: true,  inspectionOverdue: true  },
];

export function PpeRegisterPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const expired = rows.filter(r => r.expired).length;
  return (
    <>
    <PageShell
      back={{ href: "/compliance", label: "Compliance" }}
      title="PPE Register"
      description="Issue, inspection and expiry records for all personal protective equipment."
      cta="Issue PPE"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Issue PPE
          </button>
        }
      stats={
        <>
          <Stat label="Items Registered" value="98"          sub="across all workers"                        />
          <Stat label="Expired"          value={String(expired)} sub="replace immediately"   highlight="red"   />
          <Stat label="Expiring (90d)"   value="3"           sub="harnesses + P2s"          highlight="yellow"/>
          <Stat label="Issued (Month)"   value="7"           sub="new and replacement"      highlight="green" />
        </>
      }
      tabs={["All", "Expired", "Expiring Soon", "Fall Arrest", "Respiratory"]}
      onTabChange={setTab}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Item</Th>
          <Th>Type</Th>
          <Th>Issued To</Th>
          <Th>Standard</Th>
          <Th>Issue Date</Th>
          <Th>Expiry</Th>
          <Th>Next Inspection</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r)).map((r) => {
            const typeStyle = PPE_TYPE_COLORS[r.ppeType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.item}</span></Td>
                <Td><Badge label={r.ppeType} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td muted>{r.issuedTo}</Td>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.standard}</span></Td>
                <Td muted>{r.issueDate}</Td>
                <Td>
                  {r.expiryDate
                    ? <span style={{ color: r.expired ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.expired ? 600 : undefined }}>
                        {r.expiryDate}{r.expired ? " · expired" : ""}
                      </span>
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td>
                  <span style={{ color: r.inspectionOverdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.inspectionOverdue ? 600 : undefined }}>
                    {r.inspectionDue}{r.inspectionOverdue ? " · overdue" : ""}
                  </span>
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <PpeRegisterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}