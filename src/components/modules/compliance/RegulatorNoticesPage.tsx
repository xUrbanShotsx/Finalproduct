"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { RegulatorNoticesDrawer } from "./RegulatorNoticesDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab, matchesSite, siteOptionsOf } from "../shared";

const NOTICE_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Improvement Notice": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Prohibition Notice": { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "Infringement":       { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Formal Warning":     { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const RECORDS: Array<{
  ref: string; noticeNo: string; noticeType: string; issuer: string;
  site: string; issue: string; issueDate: string; complianceDate: string;
  status: "Open" | "Closed" | "Active" | "Overdue";
  actionsOpen: number; overdue: boolean;
}> = [
  { ref: "RN-2024-007", noticeNo: "IN-240613-0042", noticeType: "Improvement Notice", issuer: "SafeWork NSW — D. Shaw", site: "Site 01", issue: "Incomplete fall protection at northern slab edge Level 3", issueDate: "13 Jun 2024", complianceDate: "20 Jun 2024", status: "Open",    actionsOpen: 2, overdue: false },
  { ref: "RN-2024-006", noticeNo: "IN-240613-0041", noticeType: "Improvement Notice", issuer: "SafeWork NSW — D. Shaw", site: "Site 02", issue: "SWMS not signed by all workers prior to commencing HRCW", issueDate: "13 Jun 2024", complianceDate: "20 Jun 2024", status: "Open",    actionsOpen: 1, overdue: false },
  { ref: "RN-2024-005", noticeNo: "PN-240613-0009", noticeType: "Prohibition Notice", issuer: "SafeWork NSW — D. Shaw", site: "Site 01", issue: "Personnel hoist PH-01 operating with door interlock fault",issueDate: "13 Jun 2024", complianceDate: "Until rectified",status:"Active",  actionsOpen: 1, overdue: false },
  { ref: "RN-2024-004", noticeNo: "IN-240501-0033", noticeType: "Improvement Notice", issuer: "SafeWork NSW",           site: "Site 02", issue: "Inadequate bracing on temporary works formwork",          issueDate: "01 May 2024", complianceDate: "15 May 2024", status: "Closed",  actionsOpen: 0, overdue: false },
  { ref: "RN-2024-003", noticeNo: "IN-240320-0021", noticeType: "Improvement Notice", issuer: "SafeWork NSW",           site: "Site 01", issue: "Confined space register not maintained on site",           issueDate: "20 Mar 2024", complianceDate: "03 Apr 2024", status: "Closed",  actionsOpen: 0, overdue: false },
  { ref: "RN-2024-002", noticeNo: "IN-240210-0014", noticeType: "Formal Warning",     issuer: "SafeWork NSW",           site: "Site 01", issue: "Delay in notifying regulator of notifiable incident",      issueDate: "10 Feb 2024", complianceDate: "17 Feb 2024", status: "Closed",  actionsOpen: 0, overdue: false },
  { ref: "RN-2023-008", noticeNo: "IN-231105-0091", noticeType: "Improvement Notice", issuer: "SafeWork NSW",           site: "Site 03", issue: "OHS Management Plan not available on site",               issueDate: "05 Nov 2023", complianceDate: "19 Nov 2023", status: "Overdue", actionsOpen: 1, overdue: true  },
];

export function RegulatorNoticesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");
  const open = rows.filter(r => r.status === "Open" || r.status === "Active" || r.status === "Overdue").length;
  return (
    <>
    <PageShell
      back={{ href: "/compliance", label: "Compliance" }}
      title="Regulator Notices"
      description="SafeWork improvement, prohibition and infringement notice register."
      cta="Record Notice"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Record Notice
          </button>
        }
      stats={
        <>
          <Stat label="Open / Active"     value={String(open)} sub="require action"                      />
          <Stat label="Prohibition"        value="1"            sub="PH-01 — hoist"    highlight="red"   />
          <Stat label="Overdue"            value="1"            sub="RN-2023-008"       highlight="red"   />
          <Stat label="Closed (YTD)"       value="3"            sub="complied and closed"highlight="green"/>
        </>
      }
      tabs={["All", "Open", "Prohibition", "Overdue", "Closed"]}
      onTabChange={setTab}
      siteOptions={siteOptionsOf(rows)}
      onSiteChange={setSite}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Notice No.</Th>
          <Th>Type</Th>
          <Th>Issuer</Th>
          <Th>Site</Th>
          <Th>Issue</Th>
          <Th>Issued</Th>
          <Th>Compliance By</Th>
          <Th right>Open Actions</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r) && matchesSite(site, r)).map((r) => {
            const typeStyle = NOTICE_TYPE_COLORS[r.noticeType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.noticeNo}</span></Td>
                <Td><Badge label={r.noticeType} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td muted>{r.issuer}</Td>
                <Td muted>{r.site}</Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.issue}</span></Td>
                <Td muted>{r.issueDate}</Td>
                <Td>
                  <span style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.overdue ? 600 : undefined }}>
                    {r.complianceDate}{r.overdue ? " · overdue" : ""}
                  </span>
                </Td>
                <Td right>
                  {r.actionsOpen > 0
                    ? <Badge label={String(r.actionsOpen)} bg="rgba(240,96,96,0.1)" color="#f06060" />
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <RegulatorNoticesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}