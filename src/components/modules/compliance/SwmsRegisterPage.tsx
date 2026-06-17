"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SwmsRegisterDrawer } from "./SwmsRegisterDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab } from "../shared";

const HRCW_COLORS: Record<string, { bg: string; color: string }> = {
  "Cat 1 — Heights":    { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Cat 2 — Confined":   { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Cat 3 — Demolition": { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Cat 4 — Crane":      { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Cat 5 — Pressurised":{ bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Cat 11 — Excavation":{ bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Cat 13 — Hot Work":  { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Cat 14 — Tilt-up":   { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Cat 15 — Electrical":{ bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Cat 16 — OHW":       { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "General":            { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  ref: string; title: string; hrcwCategory: string; preparedBy: string;
  version: string; approved: string; approvedBy: string;
  nextReview: string; site: string; signedCount: number; requiredCount: number;
  status: "Active" | "Draft" | "Closed";
  overdue: boolean;
}> = [
  { ref: "SWMS-103", title: "Working at Heights — Scaffold Erection and Dismantling",   hrcwCategory: "Cat 1 — Heights",    preparedBy: "J. Smith",  version: "Rev 5", approved: "01 May 2024", approvedBy: "J. Smith",  nextReview: "01 May 2025", site: "Site 01", signedCount: 12, requiredCount: 12, status: "Active", overdue: false },
  { ref: "SWMS-098", title: "Excavation — Trenching Works >1.5m",                       hrcwCategory: "Cat 11 — Excavation",preparedBy: "M. Jones",  version: "Rev 3", approved: "15 Apr 2024", approvedBy: "M. Jones",  nextReview: "15 Apr 2025", site: "Site 02", signedCount: 6,  requiredCount: 6,  status: "Active", overdue: false },
  { ref: "SWMS-094", title: "Demolition — Non Load-Bearing Walls",                      hrcwCategory: "Cat 3 — Demolition", preparedBy: "K. Davis",  version: "Rev 1", approved: "10 May 2024", approvedBy: "K. Davis",  nextReview: "10 May 2025", site: "Site 03", signedCount: 0,  requiredCount: 5,  status: "Draft",  overdue: false },
  { ref: "SWMS-089", title: "Crane Lifts — TC-04 Tower Crane Operations",               hrcwCategory: "Cat 4 — Crane",      preparedBy: "J. Smith",  version: "Rev 4", approved: "01 Jun 2024", approvedBy: "J. Smith",  nextReview: "01 Jun 2025", site: "Site 01", signedCount: 4,  requiredCount: 4,  status: "Active", overdue: false },
  { ref: "SWMS-086", title: "Confined Space Entry — Stormwater Pits and Tanks",         hrcwCategory: "Cat 2 — Confined",   preparedBy: "T. Walsh",  version: "Rev 6", approved: "20 May 2024", approvedBy: "T. Walsh",  nextReview: "20 May 2025", site: "Site 01, 02",signedCount:3, requiredCount: 3, status: "Active", overdue: false },
  { ref: "SWMS-083", title: "Pressurised Equipment — Concrete Pump Operations",         hrcwCategory: "Cat 5 — Pressurised",preparedBy: "M. Jones",  version: "Rev 2", approved: "15 May 2024", approvedBy: "M. Jones",  nextReview: "15 May 2025", site: "Site 01", signedCount: 3,  requiredCount: 3,  status: "Active", overdue: false },
  { ref: "SWMS-081", title: "Hot Work — Welding, Cutting and Grinding",                 hrcwCategory: "Cat 13 — Hot Work",  preparedBy: "K. Davis",  version: "Rev 4", approved: "03 Apr 2024", approvedBy: "K. Davis",  nextReview: "03 Apr 2025", site: "Site 01", signedCount: 8,  requiredCount: 10, status: "Active", overdue: false },
  { ref: "SWMS-078", title: "Tilt-up and Precast Panel Erection",                       hrcwCategory: "Cat 14 — Tilt-up",   preparedBy: "D. Wong",   version: "Rev 2", approved: "05 May 2024", approvedBy: "D. Wong",   nextReview: "05 May 2025", site: "Site 01", signedCount: 5,  requiredCount: 5,  status: "Active", overdue: false },
  { ref: "SWMS-075", title: "Work Near Energised Electrical Installations",             hrcwCategory: "Cat 15 — Electrical",preparedBy: "M. Jones",  version: "Rev 3", approved: "01 May 2024", approvedBy: "M. Jones",  nextReview: "01 May 2025", site: "Site 01", signedCount: 1,  requiredCount: 3,  status: "Active", overdue: false },
  { ref: "SWMS-072", title: "Work Near Overhead Power Lines — Site 02 Boundary",        hrcwCategory: "Cat 16 — OHW",       preparedBy: "J. Smith",  version: "Rev 2", approved: "15 Apr 2024", approvedBy: "J. Smith",  nextReview: "15 Apr 2025", site: "Site 02", signedCount: 2,  requiredCount: 2,  status: "Active", overdue: false },
  { ref: "SWMS-034", title: "Scaffold Erection >4m — Large Scaffold Frames",           hrcwCategory: "Cat 1 — Heights",    preparedBy: "T. Walsh",  version: "Rev 2", approved: "05 Nov 2023", approvedBy: "T. Walsh",  nextReview: "05 Nov 2024", site: "Site 01", signedCount: 10, requiredCount: 10, status: "Active", overdue: true  },
];

export function SwmsRegisterPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const unsignedGap = rows.filter(r => r.signedCount < r.requiredCount && r.status === "Active").length;
  return (
    <>
    <PageShell
      back={{ href: "/compliance", label: "Compliance" }}
      title="SWMS Register"
      description="Repository of all Safe Work Method Statements with version control and sign-off tracking."
      cta="New SWMS"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New SWMS
          </button>
        }
      stats={
        <>
          <Stat label="Total SWMS"       value="103" sub="in repository"                          />
          <Stat label="Review Overdue"   value="1"   sub="SWMS-034"          highlight="red"   />
          <Stat label="Sign-off Gaps"    value={String(unsignedGap)} sub="workers not signed" highlight="yellow"/>
          <Stat label="Reviewed (Month)" value="4"   sub="updated and re-approved" highlight="green"/>
        </>
      }
      tabs={["All", "Active", "Draft", "Sign-off Gap", "Overdue Review"]}
      onTabChange={setTab}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Title</Th>
          <Th>HRCW Category</Th>
          <Th>Version</Th>
          <Th>Approved</Th>
          <Th>Approved By</Th>
          <Th>Site</Th>
          <Th>Sign-offs</Th>
          <Th>Next Review</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r)).map((r) => {
            const catStyle = HRCW_COLORS[r.hrcwCategory] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            const signedComplete = r.signedCount >= r.requiredCount;
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-accent-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.title}</span></Td>
                <Td><Badge label={r.hrcwCategory} bg={catStyle.bg} color={catStyle.color} /></Td>
                <Td muted>{r.version}</Td>
                <Td muted>{r.approved}</Td>
                <Td muted>{r.approvedBy}</Td>
                <Td muted>{r.site}</Td>
                <Td>
                  <span style={{ color: signedComplete ? "var(--b-badge-green-text)" : "#f06060", fontSize: "12.5px", fontWeight: !signedComplete ? 600 : undefined }}>
                    {r.signedCount}/{r.requiredCount}{!signedComplete ? " · gap" : ""}
                  </span>
                </Td>
                <Td>
                  <span style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.overdue ? 600 : undefined }}>
                    {r.nextReview}{r.overdue ? " · overdue" : ""}
                  </span>
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <SwmsRegisterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}