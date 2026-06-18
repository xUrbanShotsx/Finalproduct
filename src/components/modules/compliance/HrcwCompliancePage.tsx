"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { HrcwComplianceDrawer } from "./HrcwComplianceDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab, matchesSite, siteOptionsOf } from "../shared";

const EVIDENCE_COLORS: Record<string, { bg: string; color: string }> = {
  "SWMS in place":           { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "SWMS not signed":         { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "SWMS missing":            { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Permit in place":         { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Permit expired":          { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Permit not required":     { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Notification lodged":     { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Notification required":   { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Notification not required":{ bg: "var(--b-bg-active)",       color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  category: string; reg: string; activity: string; site: string;
  swmsStatus: string; permitStatus: string; notificationStatus: string;
  pcbu: string; status: "Active" | "Pending" | "Closed";
  compliant: boolean;
}> = [
  { category: "Cat 1 — Heights >2m",    reg: "291(1)(a)", activity: "Scaffold, edges, EWP",          site: "Site 01",     swmsStatus: "SWMS in place",  permitStatus: "Permit not required", notificationStatus: "Notification lodged",      pcbu: "J. Smith",  status: "Active",  compliant: true  },
  { category: "Cat 2 — Confined Space", reg: "291(1)(b)", activity: "Underground pits, tanks",        site: "Site 01, 02", swmsStatus: "SWMS in place",  permitStatus: "Permit in place",     notificationStatus: "Notification not required",pcbu: "T. Walsh",  status: "Active",  compliant: true  },
  { category: "Cat 3 — Demolition",     reg: "291(1)(c)", activity: "Non load-bearing walls Wing C",  site: "Site 03",     swmsStatus: "SWMS missing",   permitStatus: "Permit not required", notificationStatus: "Notification required",    pcbu: "K. Davis",  status: "Pending", compliant: false },
  { category: "Cat 4 — Crane & Plant",  reg: "291(1)(d)", activity: "TC-04 crane lifts",              site: "Site 01",     swmsStatus: "SWMS in place",  permitStatus: "Permit in place",     notificationStatus: "Notification lodged",      pcbu: "J. Smith",  status: "Active",  compliant: true  },
  { category: "Cat 5 — Pressurised",    reg: "291(1)(e)", activity: "Concrete pump operations",       site: "Site 01",     swmsStatus: "SWMS in place",  permitStatus: "Permit not required", notificationStatus: "Notification not required",pcbu: "M. Jones",  status: "Active",  compliant: true  },
  { category: "Cat 11 — Excavation",    reg: "291(1)(k)", activity: "Trenching Grid H7 >1.5m",        site: "Site 02",     swmsStatus: "SWMS in place",  permitStatus: "Permit in place",     notificationStatus: "Notification lodged",      pcbu: "M. Jones",  status: "Active",  compliant: true  },
  { category: "Cat 13 — Hot Work",      reg: "291(1)(m)", activity: "Welding and grinding",           site: "Site 01",     swmsStatus: "SWMS in place",  permitStatus: "Permit in place",     notificationStatus: "Notification not required",pcbu: "K. Davis",  status: "Active",  compliant: true  },
  { category: "Cat 14 — Tilt-up",       reg: "291(1)(n)", activity: "Precast panel erection",        site: "Site 01",     swmsStatus: "SWMS in place",  permitStatus: "Permit not required", notificationStatus: "Notification lodged",      pcbu: "D. Wong",   status: "Active",  compliant: true  },
  { category: "Cat 15 — Live Electrical",reg: "291(1)(o)", activity: "Work near energised panels",   site: "Site 01",     swmsStatus: "SWMS not signed",permitStatus: "Permit in place",     notificationStatus: "Notification not required",pcbu: "M. Jones",  status: "Active",  compliant: false },
  { category: "Cat 16 — Overhead Lines",reg: "291(1)(p)", activity: "Works near boundary lines",     site: "Site 02",     swmsStatus: "SWMS in place",  permitStatus: "Permit not required", notificationStatus: "Notification lodged",      pcbu: "J. Smith",  status: "Active",  compliant: true  },
];

export function HrcwCompliancePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");
  const nonCompliant = rows.filter(r => !r.compliant).length;
  return (
    <>
    <PageShell
      back={{ href: "/compliance", label: "Compliance" }}
      title="HRCW Compliance"
      description="Evidence records confirming compliance for each active high-risk construction work category."
      cta="Add Evidence"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Add Evidence
          </button>
        }
      stats={
        <>
          <Stat label="Active Categories" value={String(rows.filter(r => r.status === "Active").length)} sub="under Reg 291"                     />
          <Stat label="Non-Compliant"     value={String(nonCompliant)} sub="gap in evidence"                highlight="red"   />
          <Stat label="SWMS Gaps"         value="2"                    sub="missing or unsigned"            highlight="yellow"/>
          <Stat label="Compliant"         value={String(rows.filter(r => r.compliant).length)} sub="full evidence on file" highlight="green" />
        </>
      }
      tabs={["All", "Non-Compliant", "Active", "Pending", "Closed"]}
      onTabChange={setTab}
      siteOptions={siteOptionsOf(rows)}
      onSiteChange={setSite}
    >
      <table className="w-full">
        <TableHead>
          <Th>Category</Th>
          <Th>Reg</Th>
          <Th>Activity</Th>
          <Th>Site</Th>
          <Th>SWMS</Th>
          <Th>Permit</Th>
          <Th>Notification</Th>
          <Th>PCBU</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r) && matchesSite(site, r)).map((r) => {
            const swmsStyle = EVIDENCE_COLORS[r.swmsStatus] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            const permitStyle = EVIDENCE_COLORS[r.permitStatus] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            const notifStyle = EVIDENCE_COLORS[r.notificationStatus] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.category}>
                <Td>
                  <div className="flex items-center gap-1.5">
                    {!r.compliant && <span style={{ color: "#f06060", fontSize: "11px", fontWeight: 700 }}>●</span>}
                    <span style={{ color: "var(--b-text)" }}>{r.category}</span>
                  </div>
                </Td>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.reg}</span></Td>
                <Td muted>{r.activity}</Td>
                <Td muted>{r.site}</Td>
                <Td><Badge label={r.swmsStatus} bg={swmsStyle.bg} color={swmsStyle.color} /></Td>
                <Td><Badge label={r.permitStatus} bg={permitStyle.bg} color={permitStyle.color} /></Td>
                <Td><Badge label={r.notificationStatus} bg={notifStyle.bg} color={notifStyle.color} /></Td>
                <Td muted>{r.pcbu}</Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <HrcwComplianceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}