"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { DefectReportingDrawer } from "./DefectReportingDrawer";
import { PageShell, Stat, SeverityBadge, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const DEFECT_CATEGORY: Record<string, { bg: string; color: string }> = {
  "Structural":   { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Electrical":   { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Plant":        { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Scaffold":     { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Amenities":    { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Fire Safety":  { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "PPE":          { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Access":       { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
};

const RECORDS: Array<{
  ref: string; asset: string; category: string; description: string;
  site: string; reportedBy: string; date: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  status: "Open" | "Closed" | "Pending";
  grounded: boolean; assignee: string;
}> = [
  { ref: "DEF-058", asset: "Tower Crane TC-04",        category: "Plant",      description: "Slew ring bearing noise — abnormal",           site: "Site 01", reportedBy: "M. Chen",    date: "13 Jun", severity: "Critical", status: "Open",    grounded: true,  assignee: "OEM Service" },
  { ref: "DEF-057", asset: "Mobile Scaffold — Bay 3",  category: "Scaffold",   description: "2 base plates missing lock pins",               site: "Site 03", reportedBy: "J. Park",    date: "13 Jun", severity: "High",     status: "Open",    grounded: true,  assignee: "T. Walsh"    },
  { ref: "DEF-056", asset: "Temporary Power Board",     category: "Electrical", description: "RCD trips on circuit 4 — intermittent fault",  site: "Site 02", reportedBy: "T. Walsh",   date: "12 Jun", severity: "High",     status: "Open",    grounded: false, assignee: "M. Jones"    },
  { ref: "DEF-055", asset: "Excavator CAT 320",         category: "Plant",      description: "Left track shoe cracked — monitor required",   site: "Site 02", reportedBy: "T. Walsh",   date: "12 Jun", severity: "Medium",   status: "Open",    grounded: false, assignee: "CAT Service" },
  { ref: "DEF-054", asset: "Fire Extinguisher — L3 NE", category: "Fire Safety",description: "Gauge reading below minimum pressure",          site: "Site 01", reportedBy: "S. Lee",     date: "11 Jun", severity: "Medium",   status: "Open",    grounded: false, assignee: "K. Davis"    },
  { ref: "DEF-053", asset: "EWP — Boom Lift JLG",       category: "Plant",      description: "Upper limit switch warning — basket jerk",     site: "Site 01", reportedBy: "P. Nguyen",  date: "10 Jun", severity: "High",     status: "Open",    grounded: false, assignee: "JLG Service" },
  { ref: "DEF-052", asset: "Site Toilets — Block B",    category: "Amenities",  description: "Plumbing blockage — 2 of 4 units out of order", site: "Site 02", reportedBy: "D. Wong",    date: "10 Jun", severity: "Low",      status: "Open",    grounded: false, assignee: "Plumber"     },
  { ref: "DEF-051", asset: "Scaffold — Level 1 West",   category: "Scaffold",   description: "Missing mid-rail on 3m section",               site: "Site 01", reportedBy: "R. Kim",     date: "07 Jun", severity: "High",     status: "Closed",  grounded: false, assignee: "T. Walsh"    },
  { ref: "DEF-050", asset: "Personnel Hoist",           category: "Plant",      description: "Gate interlock sensor fault — door open alarm", site: "Site 01", reportedBy: "J. Smith",   date: "05 Jun", severity: "Critical", status: "Closed",  grounded: true,  assignee: "Hoist Tech"  },
];

export function DefectReportingPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const grounded = rows.filter(r => r.grounded && r.status === "Open").length;

  return (
    <>
    <PageShell
      back={{ href: "/operations", label: "Operations" }}
      title="Defect Reporting"
      description="Report, track and close out defects on plant, equipment and site infrastructure."
      cta="Report Defect"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Report Defect
          </button>
        }
      stats={
        <>
          <Stat label="Open Defects"    value={String(rows.filter(r => r.status === "Open").length)} sub="require action"  />
          <Stat label="Grounded Assets" value={String(grounded)} sub="out of service" highlight="red"   />
          <Stat label="High / Critical" value="5"  sub="priority action"              highlight="yellow" />
          <Stat label="Closed (Week)"   value="4"  sub="resolved and cleared"         highlight="green"  />
        </>
      }
      tabs={["All", "Open", "Grounded", "High / Critical", "Closed"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Asset / Item</Th>
          <Th>Category</Th>
          <Th>Description</Th>
          <Th>Site</Th>
          <Th>Reported</Th>
          <Th>Severity</Th>
          <Th>Grounded</Th>
          <Th>Assignee</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => {
            const catStyle = DEFECT_CATEGORY[r.category] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.asset}</span></Td>
                <Td><Badge label={r.category} bg={catStyle.bg} color={catStyle.color} /></Td>
                <Td muted>{r.description}</Td>
                <Td muted>{r.site}</Td>
                <Td muted>{r.date}</Td>
                <Td><SeverityBadge v={r.severity} /></Td>
                <Td>
                  {r.grounded
                    ? <Badge label="Yes" bg="rgba(240,96,96,0.1)" color="#f06060" />
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td muted>{r.assignee}</Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <DefectReportingDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}