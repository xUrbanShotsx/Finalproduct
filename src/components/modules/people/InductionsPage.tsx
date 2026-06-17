"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { InductionDrawer } from "./InductionDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab } from "../shared";

const TRADE_COLORS: Record<string, { bg: string; color: string }> = {
  "Carpenter":        { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Electrician":      { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Plumber":          { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Labourer":         { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Steel Fixer":      { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Crane Operator":   { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Site Supervisor":  { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Scaffolder":       { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS = [
  { ref: "IND-047", name: "Marcus Chen",   trade: "Crane Operator",  site: "Site 01", inducted: "03 Jun 2024", expiry: "03 Jun 2025", status: "Active" as const,  accessCleared: true  },
  { ref: "IND-046", name: "Sophie Walsh",  trade: "Site Supervisor", site: "All Sites",inducted: "01 Jun 2024", expiry: "01 Jun 2025", status: "Active" as const,  accessCleared: true  },
  { ref: "IND-045", name: "James Tran",    trade: "Electrician",     site: "Site 02", inducted: "28 May 2024", expiry: "28 May 2025", status: "Active" as const,  accessCleared: true  },
  { ref: "IND-044", name: "Priya Patel",   trade: "Plumber",         site: "Site 01", inducted: "21 May 2024", expiry: "21 May 2025", status: "Active" as const,  accessCleared: true  },
  { ref: "IND-043", name: "Ryan O'Brien",  trade: "Scaffolder",      site: "Site 03", inducted: "15 May 2024", expiry: "15 May 2025", status: "Active" as const,  accessCleared: false },
  { ref: "IND-042", name: "Natalie Kim",   trade: "Labourer",        site: "Site 02", inducted: "10 May 2024", expiry: "10 May 2025", status: "Active" as const,  accessCleared: true  },
  { ref: "IND-041", name: "David Huang",   trade: "Carpenter",       site: "Site 01", inducted: "05 May 2024", expiry: "05 May 2025", status: "Active" as const,  accessCleared: true  },
  { ref: "IND-040", name: "Lisa Nguyen",   trade: "Steel Fixer",     site: "Site 03", inducted: "29 Apr 2024", expiry: "29 Apr 2025", status: "Active" as const,  accessCleared: true  },
  { ref: "IND-039", name: "Tom Barker",    trade: "Labourer",        site: "Site 01", inducted: "01 Jan 2024", expiry: "01 Jan 2025", status: "Active" as const,  accessCleared: true  },
  { ref: "IND-038", name: "Amy Foster",    trade: "Carpenter",       site: "Site 02", inducted: "15 Jun 2023", expiry: "15 Jun 2024", status: "Expired" as const, accessCleared: false },
];

export function InductionsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/people", label: "People" }}
      title="Inductions"
      description="Site induction records and access clearance tracking for all workers and contractors."
      cta="Record Induction"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Record Induction
          </button>
        }
      stats={
        <>
          <Stat label="Active Workers" value="43" sub="inducted and cleared" highlight="green" />
          <Stat label="Expiring (30d)" value="4"  sub="renewal required"     highlight="yellow" />
          <Stat label="Expired / Lapsed" value="2" sub="access revoked"      highlight="red" />
          <Stat label="Awaiting Clearance" value="1" sub="induction complete" />
        </>
      }
      tabs={["All", "Active", "Expiring Soon", "Expired", "Awaiting Clearance"]}
      onTabChange={setTab}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Worker</Th>
          <Th>Trade</Th>
          <Th>Site</Th>
          <Th>Inducted</Th>
          <Th>Expiry</Th>
          <Th>Access Cleared</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r)).map((r) => {
            const tradeStyle = TRADE_COLORS[r.trade] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.name}</span></Td>
                <Td><Badge label={r.trade} bg={tradeStyle.bg} color={tradeStyle.color} /></Td>
                <Td muted>{r.site}</Td>
                <Td muted>{r.inducted}</Td>
                <Td>
                  <span style={{ color: r.status === "Expired" ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px" }}>
                    {r.expiry}
                  </span>
                </Td>
                <Td>
                  {r.accessCleared
                    ? <Badge label="Cleared"     bg="var(--b-badge-green-bg)" color="var(--b-badge-green-text)" />
                    : <Badge label="Not Cleared" bg="rgba(240,96,96,0.1)"     color="#f06060" />}
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <InductionDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}