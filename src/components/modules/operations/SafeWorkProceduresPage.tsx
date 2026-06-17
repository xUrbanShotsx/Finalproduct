"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SafeWorkProceduresDrawer } from "./SafeWorkProceduresDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab } from "../shared";

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "Working at Heights":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Electrical":          { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Confined Space":      { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Excavation":          { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Hot Work":            { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Manual Handling":     { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Plant & Equipment":   { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Chemical Handling":   { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Emergency":           { bg: "rgba(240,96,96,0.15)",     color: "#f06060" },
  "General":             { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS = [
  { ref: "SWP-034", title: "Scaffold Erection and Dismantling",           category: "Working at Heights", version: "Rev 5", status: "Active" as const,  lastReviewed: "01 May 2024", approvedBy: "J. Smith",  nextReview: "01 May 2025", overdue: false },
  { ref: "SWP-033", title: "Excavation and Trenching Operations",          category: "Excavation",          version: "Rev 3", status: "Active" as const,  lastReviewed: "15 Apr 2024", approvedBy: "M. Jones",  nextReview: "15 Apr 2025", overdue: false },
  { ref: "SWP-032", title: "Hot Work — Welding, Cutting and Grinding",    category: "Hot Work",            version: "Rev 4", status: "Active" as const,  lastReviewed: "03 Apr 2024", approvedBy: "K. Davis",  nextReview: "03 Apr 2025", overdue: false },
  { ref: "SWP-031", title: "Confined Space Entry Procedure",               category: "Confined Space",      version: "Rev 6", status: "Active" as const,  lastReviewed: "20 Mar 2024", approvedBy: "J. Smith",  nextReview: "20 Mar 2025", overdue: false },
  { ref: "SWP-030", title: "Mobile Plant Pre-operational Inspection",      category: "Plant & Equipment",   version: "Rev 2", status: "Active" as const,  lastReviewed: "10 Mar 2024", approvedBy: "M. Jones",  nextReview: "10 Mar 2025", overdue: false },
  { ref: "SWP-029", title: "Electrical Isolation Procedure",               category: "Electrical",          version: "Rev 3", status: "Draft" as const,   lastReviewed: "—",           approvedBy: "—",         nextReview: "—",           overdue: false },
  { ref: "SWP-028", title: "Manual Handling and Ergonomics",               category: "Manual Handling",     version: "Rev 1", status: "Active" as const,  lastReviewed: "01 Feb 2024", approvedBy: "K. Davis",  nextReview: "01 Feb 2025", overdue: false },
  { ref: "SWP-027", title: "Hazardous Chemical Handling and Storage",      category: "Chemical Handling",   version: "Rev 2", status: "Active" as const,  lastReviewed: "15 Jan 2024", approvedBy: "J. Smith",  nextReview: "15 Jan 2025", overdue: false },
  { ref: "SWP-026", title: "Emergency Evacuation Procedure",               category: "Emergency",           version: "Rev 7", status: "Active" as const,  lastReviewed: "10 Jan 2024", approvedBy: "M. Jones",  nextReview: "10 Jan 2025", overdue: false },
  { ref: "SWP-025", title: "Working at Heights — MEWP and EWP Operations", category: "Working at Heights", version: "Rev 2", status: "Active" as const,  lastReviewed: "05 Nov 2023", approvedBy: "K. Davis",  nextReview: "05 Nov 2024", overdue: true  },
  { ref: "SWP-024", title: "Demolition Works — Non Load-Bearing Structures",category:"General",            version: "Rev 1", status: "Draft" as const,   lastReviewed: "—",           approvedBy: "—",         nextReview: "—",           overdue: false },
];

export function SafeWorkProceduresPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/operations", label: "Operations" }}
      title="Safe Work Procedures"
      description="Documented procedures for performing work safely across all tasks and activities."
      cta="New Procedure"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New Procedure
          </button>
        }
      stats={
        <>
          <Stat label="Total Procedures"   value="34"  sub="in the register"                     />
          <Stat label="Under Review"        value="5"   sub="pending approval"    highlight="yellow" />
          <Stat label="Overdue Review"      value="1"   sub="SWP-025"             highlight="red"    />
          <Stat label="Approved This Month" value="3"   sub="new and updated"     highlight="green"  />
        </>
      }
      tabs={["All", "Active", "Draft", "Under Review", "Overdue"]}
      onTabChange={setTab}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Title</Th>
          <Th>Category</Th>
          <Th>Version</Th>
          <Th>Status</Th>
          <Th>Last Reviewed</Th>
          <Th>Approved By</Th>
          <Th>Next Review</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r)).map((r) => {
            const catStyle = CATEGORY_COLORS[r.category] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.title}</span></Td>
                <Td><Badge label={r.category} bg={catStyle.bg} color={catStyle.color} /></Td>
                <Td muted>{r.version}</Td>
                <Td><StatusBadge v={r.status} /></Td>
                <Td muted>{r.lastReviewed}</Td>
                <Td muted>{r.approvedBy}</Td>
                <Td>
                  <span style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.overdue ? 600 : undefined }}>
                    {r.nextReview}{r.overdue ? " · overdue" : ""}
                  </span>
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <SafeWorkProceduresDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}