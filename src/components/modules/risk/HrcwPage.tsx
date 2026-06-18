"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { HrcwDrawer } from "./HrcwDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab, matchesSite, siteOptionsOf } from "../shared";

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "HRCW Cat 1":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "HRCW Cat 2":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "HRCW Cat 3":  { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "HRCW Cat 4":  { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "HRCW Cat 5":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "HRCW Cat 11": { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "HRCW Cat 13": { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "HRCW Cat 14": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "HRCW Cat 15": { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "HRCW Cat 16": { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const RECORDS: Array<{
  ref: string; description: string; category: string; reg: string;
  swms: string; pcbuAppointed: string; site: string;
  status: "Active" | "Draft" | "Closed" | "Pending";
  lastReview: string; overdue: boolean;
}> = [
  { ref: "HRCW-2024-016", description: "Work at height >2m — scaffold and leading edges",        category: "HRCW Cat 1",  reg: "Reg 291(1)(a)",  swms: "SWMS-103",  pcbuAppointed: "J. Smith",  site: "Site 01",     status: "Active",  lastReview: "01 Jun 2024", overdue: false },
  { ref: "HRCW-2024-015", description: "Excavation >1.5m deep — Grid H7",                        category: "HRCW Cat 11", reg: "Reg 291(1)(k)",  swms: "SWMS-098",  pcbuAppointed: "M. Jones",  site: "Site 02",     status: "Active",  lastReview: "05 Jun 2024", overdue: false },
  { ref: "HRCW-2024-014", description: "Demolition of load-bearing structure",                   category: "HRCW Cat 3",  reg: "Reg 291(1)(c)",  swms: "SWMS-094",  pcbuAppointed: "K. Davis",  site: "Site 03",     status: "Active",  lastReview: "10 May 2024", overdue: false },
  { ref: "HRCW-2024-013", description: "Crane and plant operations — TC-04 crane lifts",         category: "HRCW Cat 4",  reg: "Reg 291(1)(d)",  swms: "SWMS-089",  pcbuAppointed: "J. Smith",  site: "Site 01",     status: "Active",  lastReview: "01 Jun 2024", overdue: false },
  { ref: "HRCW-2024-012", description: "Confined space entry — stormwater pits and tanks",       category: "HRCW Cat 2",  reg: "Reg 291(1)(b)",  swms: "SWMS-086",  pcbuAppointed: "T. Walsh",  site: "Site 01, 02", status: "Active",  lastReview: "20 May 2024", overdue: false },
  { ref: "HRCW-2024-011", description: "Pressurised equipment — concrete pump ops",              category: "HRCW Cat 5",  reg: "Reg 291(1)(e)",  swms: "SWMS-083",  pcbuAppointed: "M. Jones",  site: "Site 01",     status: "Active",  lastReview: "15 May 2024", overdue: false },
  { ref: "HRCW-2024-010", description: "Hot work — welding and cutting",                         category: "HRCW Cat 13", reg: "Reg 291(1)(m)",  swms: "SWMS-081",  pcbuAppointed: "K. Davis",  site: "Site 01",     status: "Active",  lastReview: "10 May 2024", overdue: false },
  { ref: "HRCW-2024-009", description: "Tilt-up and precast panel erection",                     category: "HRCW Cat 14", reg: "Reg 291(1)(n)",  swms: "SWMS-078",  pcbuAppointed: "D. Wong",   site: "Site 01",     status: "Active",  lastReview: "05 May 2024", overdue: false },
  { ref: "HRCW-2024-008", description: "Work near energised electrical installations",            category: "HRCW Cat 15", reg: "Reg 291(1)(o)",  swms: "SWMS-075",  pcbuAppointed: "M. Jones",  site: "Site 01",     status: "Active",  lastReview: "01 May 2024", overdue: false },
  { ref: "HRCW-2024-007", description: "Work near overhead power lines — Site 02 boundary",      category: "HRCW Cat 16", reg: "Reg 291(1)(p)",  swms: "SWMS-072",  pcbuAppointed: "J. Smith",  site: "Site 02",     status: "Active",  lastReview: "15 Apr 2024", overdue: false },
  { ref: "HRCW-2024-006", description: "Asbestos removal — suspected ACM in demolition zone",    category: "HRCW Cat 2",  reg: "Reg 291(1)(b)",  swms: "—",         pcbuAppointed: "K. Davis",  site: "Site 03",     status: "Draft",   lastReview: "—",           overdue: false },
  { ref: "HRCW-2024-005", description: "Scaffold erection and dismantling >4m",                  category: "HRCW Cat 1",  reg: "Reg 291(1)(a)",  swms: "SWMS-034",  pcbuAppointed: "T. Walsh",  site: "Site 01",     status: "Active",  lastReview: "01 Dec 2023", overdue: true  },
];

export function HrcwPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/risk", label: "Risk Management" }}
      title="High Risk Construction Work"
      description="Manage the 19 HRCW categories under WHS Regulations 2017 — SWMS, PCBUs and review."
      cta="New HRCW Record"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New HRCW Record
          </button>
        }
      stats={
        <>
          <Stat label="Active HRCW Works"  value="10"  sub="in progress on site"                   />
          <Stat label="SWMS Overdue"       value="1"   sub="HRCW-2024-005"        highlight="red"   />
          <Stat label="Draft / Pending"    value="1"   sub="awaiting SWMS"        highlight="yellow"/>
          <Stat label="Categories Active"  value="10"  sub="of 19 Reg categories"                   />
        </>
      }
      tabs={["All", "Active", "Draft", "Overdue Review", "Closed"]}
      onTabChange={setTab}
      siteOptions={siteOptionsOf(rows)}
      onSiteChange={setSite}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Description</Th>
          <Th>Category</Th>
          <Th>Reg</Th>
          <Th>SWMS</Th>
          <Th>PCBU Appointed</Th>
          <Th>Site</Th>
          <Th>Last Review</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r) && matchesSite(site, r)).map((r) => {
            const catStyle = CATEGORY_COLORS[r.category] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[11.5px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.description}</span></Td>
                <Td><Badge label={r.category} bg={catStyle.bg} color={catStyle.color} /></Td>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.reg}</span></Td>
                <Td>
                  {r.swms !== "—"
                    ? <span className="font-mono text-[11px]" style={{ color: "var(--b-accent-text)" }}>{r.swms}</span>
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td muted>{r.pcbuAppointed}</Td>
                <Td muted>{r.site}</Td>
                <Td>
                  <span style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.overdue ? 600 : undefined }}>
                    {r.lastReview || "—"}{r.overdue ? " · overdue" : ""}
                  </span>
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <HrcwDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}