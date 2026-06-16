"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { LegislativeRegisterDrawer } from "./LegislativeRegisterDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const INSTRUMENT_COLORS: Record<string, { bg: string; color: string }> = {
  "Act":                 { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Regulation":          { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Code of Practice":    { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Australian Standard": { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Guidance Material":   { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  ref: string; title: string; instrument: string; jurisdiction: string;
  applicability: string; owner: string; lastReviewed: string; nextReview: string;
  status: "Active" | "Pending" | "Closed";
  amendmentPending: boolean; overdue: boolean;
}> = [
  { ref: "LEG-001", title: "Work Health and Safety Act 2011 (NSW)",                           instrument: "Act",                 jurisdiction: "NSW",        applicability: "All operations",      owner: "J. Smith",  lastReviewed: "01 Jan 2024", nextReview: "01 Jan 2025", status: "Active",  amendmentPending: false, overdue: false },
  { ref: "LEG-002", title: "Work Health and Safety Regulation 2017 (NSW)",                    instrument: "Regulation",          jurisdiction: "NSW",        applicability: "All operations",      owner: "J. Smith",  lastReviewed: "01 Jan 2024", nextReview: "01 Jan 2025", status: "Active",  amendmentPending: true,  overdue: false },
  { ref: "LEG-003", title: "Managing the Work Environment and Facilities COP",                instrument: "Code of Practice",    jurisdiction: "National",   applicability: "All sites",           owner: "M. Jones",  lastReviewed: "15 Feb 2024", nextReview: "15 Feb 2025", status: "Active",  amendmentPending: false, overdue: false },
  { ref: "LEG-004", title: "Managing the Risk of Falls at Workplaces COP",                   instrument: "Code of Practice",    jurisdiction: "National",   applicability: "Construction sites",  owner: "K. Davis",  lastReviewed: "15 Feb 2024", nextReview: "15 Feb 2025", status: "Active",  amendmentPending: false, overdue: false },
  { ref: "LEG-005", title: "Excavation Work COP",                                             instrument: "Code of Practice",    jurisdiction: "National",   applicability: "Excavation works",    owner: "M. Jones",  lastReviewed: "15 Feb 2024", nextReview: "15 Feb 2025", status: "Active",  amendmentPending: false, overdue: false },
  { ref: "LEG-006", title: "Confined Spaces COP",                                             instrument: "Code of Practice",    jurisdiction: "National",   applicability: "Confined space works",owner: "T. Walsh",  lastReviewed: "01 Mar 2024", nextReview: "01 Mar 2025", status: "Active",  amendmentPending: false, overdue: false },
  { ref: "LEG-007", title: "AS/NZS 1576 — Scaffolding",                                       instrument: "Australian Standard", jurisdiction: "National",   applicability: "Scaffold works",      owner: "T. Walsh",  lastReviewed: "01 Apr 2024", nextReview: "01 Apr 2025", status: "Active",  amendmentPending: false, overdue: false },
  { ref: "LEG-008", title: "AS 2550 — Cranes, hoists and winches",                           instrument: "Australian Standard", jurisdiction: "National",   applicability: "Crane operations",    owner: "M. Jones",  lastReviewed: "01 Apr 2024", nextReview: "01 Apr 2025", status: "Active",  amendmentPending: false, overdue: false },
  { ref: "LEG-009", title: "Hazardous Manual Tasks COP",                                      instrument: "Code of Practice",    jurisdiction: "National",   applicability: "Manual tasks",        owner: "K. Davis",  lastReviewed: "15 Mar 2024", nextReview: "15 Mar 2025", status: "Active",  amendmentPending: false, overdue: false },
  { ref: "LEG-010", title: "Managing Noise and Preventing Hearing Loss COP",                  instrument: "Code of Practice",    jurisdiction: "National",   applicability: "All operations",      owner: "J. Smith",  lastReviewed: "01 Nov 2023", nextReview: "01 Nov 2024", status: "Active",  amendmentPending: false, overdue: false },
  { ref: "LEG-011", title: "How to Manage Work Health and Safety Risks COP",                  instrument: "Code of Practice",    jurisdiction: "National",   applicability: "All operations",      owner: "J. Smith",  lastReviewed: "01 Nov 2023", nextReview: "01 Nov 2024", status: "Active",  amendmentPending: false, overdue: false },
  { ref: "LEG-012", title: "SafeWork NSW Guide: Construction Work Notifications",             instrument: "Guidance Material",   jurisdiction: "NSW",        applicability: "Notifiable works",    owner: "M. Jones",  lastReviewed: "01 Oct 2023", nextReview: "01 Oct 2024", status: "Active",  amendmentPending: false, overdue: true  },
];

export function LegislativeRegisterPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
    <PageShell
      back={{ href: "/compliance", label: "Compliance" }}
      title="Legislative Register"
      description="Acts, Regulations and Codes of Practice applicable to the organisation."
      cta="Add Instrument"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Add Instrument
          </button>
        }
      stats={
        <>
          <Stat label="Total Instruments" value="12"  sub="tracked in register"                   />
          <Stat label="Amendment Pending" value="1"   sub="WHS Reg 2017"        highlight="yellow" />
          <Stat label="Review Overdue"    value="1"   sub="LEG-012"             highlight="red"    />
          <Stat label="Acts / Regs"       value="2"   sub="primary legislation"                   />
        </>
      }
      tabs={["All", "Acts & Regs", "Codes of Practice", "Standards", "Overdue Review"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Title</Th>
          <Th>Instrument</Th>
          <Th>Jurisdiction</Th>
          <Th>Applicability</Th>
          <Th>Owner</Th>
          <Th>Last Reviewed</Th>
          <Th>Next Review</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {RECORDS.map((r) => {
            const instStyle = INSTRUMENT_COLORS[r.instrument] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span style={{ color: "var(--b-text)" }}>{r.title}</span>
                    {r.amendmentPending && <Badge label="Amendment Pending" bg="var(--b-badge-yellow-bg)" color="var(--b-badge-yellow-text)" />}
                  </div>
                </Td>
                <Td><Badge label={r.instrument} bg={instStyle.bg} color={instStyle.color} /></Td>
                <Td muted>{r.jurisdiction}</Td>
                <Td muted>{r.applicability}</Td>
                <Td muted>{r.owner}</Td>
                <Td muted>{r.lastReviewed}</Td>
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
    <LegislativeRegisterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}