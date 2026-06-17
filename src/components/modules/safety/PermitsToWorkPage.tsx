"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PermitsToWorkDrawer } from "./PermitsToWorkDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab } from "../shared";

const PERMIT_TYPES: Record<string, { bg: string; color: string }> = {
  "Hot Work":          { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Confined Space":    { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "Isolation":         { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Line Breaking":     { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Working at Height": { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Electrical":        { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const RECORDS: Array<{
  ref: string; type: keyof typeof PERMIT_TYPES; description: string; area: string;
  issued: string; expires: string; status: "Active" | "Expired" | "Pending";
  issuedBy: string; loto: string; expiringSoon: boolean;
}> = [
  { ref: "PTW-034", type: "Confined Space", description: "Vessel entry — Reactor R-2 internal clean", area: "Process Line A", issued: "13 Jun 06:00", expires: "13 Jun 14:00", status: "Active",  issuedBy: "M. Jones", loto: "LOTO-019", expiringSoon: false },
  { ref: "PTW-033", type: "Hot Work",       description: "Pipe welding — steam header tie-in",        area: "Boiler House",  issued: "13 Jun 07:00", expires: "Today 17:00", status: "Active",  issuedBy: "K. Davis", loto: "—",        expiringSoon: true  },
  { ref: "PTW-032", type: "Isolation",      description: "Electrical isolation — Conveyor B drive",   area: "Process Line B",issued: "13 Jun 05:30", expires: "14 Jun 17:00", status: "Active",  issuedBy: "J. Smith", loto: "LOTO-018", expiringSoon: false },
  { ref: "PTW-031", type: "Line Breaking",  description: "Break flange — caustic dosing line",        area: "Utilities",     issued: "12 Jun 08:00", expires: "12 Jun 16:00", status: "Expired", issuedBy: "T. Walsh", loto: "LOTO-016", expiringSoon: false },
  { ref: "PTW-030", type: "Hot Work",       description: "Grinding — structural repair, Bay 4",       area: "Warehouse",     issued: "11 Jun 09:00", expires: "11 Jun 15:00", status: "Expired", issuedBy: "L. Brown", loto: "—",        expiringSoon: false },
  { ref: "PTW-029", type: "Working at Height", description: "EWP access — silo top platform",         area: "Tank Farm",     issued: "10 Jun 07:00", expires: "10 Jun 17:00", status: "Expired", issuedBy: "D. Wong",  loto: "—",        expiringSoon: false },
  { ref: "PTW-035", type: "Confined Space", description: "Tank inspection — T-04 (planned)",          area: "Tank Farm",     issued: "20 Jun 06:00", expires: "20 Jun 16:00", status: "Pending", issuedBy: "M. Jones", loto: "LOTO-021", expiringSoon: false },
];

const PTW_TYPE_MAP: Record<string, keyof typeof PERMIT_TYPES> = {
  "Hot Work": "Hot Work",
  "Confined Space": "Confined Space",
  "Isolation / Energy Control": "Isolation",
  "Line Breaking": "Line Breaking",
  "Working at Height": "Working at Height",
  "Electrical": "Electrical",
};

export function PermitsToWorkPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  return (
    <>
    <PageShell
      back={{ href: "/safety", label: "Safety" }}
      title="Permits to Work"
      description="Hot work, confined space, isolation and energy control permits raised before hazardous tasks."
      cta="New Permit to Work"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New Permit to Work
          </button>
        }
      stats={
        <>
          <Stat label="Active Permits"  value="3" sub="across 3 areas"     highlight="green"  />
          <Stat label="Expiring Today"  value="1" sub="PTW-033"            highlight="yellow" />
          <Stat label="Expired"         value="3" sub="last 30 days"       highlight="red"    />
          <Stat label="With LOTO"       value="4" sub="energy isolated"                       />
        </>
      }
      tabs={["All", "Active", "Expiring Soon", "Expired", "Pending"]}
      onTabChange={setTab}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Type</Th>
          <Th>Description</Th>
          <Th>Area</Th>
          <Th>Issued</Th>
          <Th>Expires</Th>
          <Th>LOTO</Th>
          <Th>Status</Th>
          <Th>Issued By</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r)).map((r) => (
            <Tr key={r.ref}>
              <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
              <Td><Badge label={r.type} bg={PERMIT_TYPES[r.type].bg} color={PERMIT_TYPES[r.type].color} /></Td>
              <Td><span style={{ color: "var(--b-text)" }}>{r.description}</span></Td>
              <Td muted>{r.area}</Td>
              <Td muted>{r.issued}</Td>
              <Td>
                <span style={{ color: r.expiringSoon ? "var(--b-badge-yellow-text)" : r.status === "Expired" ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.expiringSoon ? 600 : undefined }}>
                  {r.expires}
                </span>
              </Td>
              <Td>
                {r.loto !== "—"
                  ? <span className="font-mono text-[11px]" style={{ color: "var(--b-accent-text)" }}>{r.loto}</span>
                  : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
              </Td>
              <Td><StatusBadge v={r.status} /></Td>
              <Td muted>{r.issuedBy}</Td>
            </Tr>
          ))}
        </tbody>
      </table>
    </PageShell>
    <PermitsToWorkDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => [{
      ref: `PTW-${36 + prev.length}`,
      type: PTW_TYPE_MAP[f.permitType] ?? "Hot Work",
      description: f.description || f.permitType || "Permit to work",
      area: f.area || "Process Line A",
      issued: f.validFrom ? f.validFrom.slice(5).replace("T", " ") : "Today",
      expires: f.validTo ? f.validTo.slice(5).replace("T", " ") : "—",
      status: "Active" as const,
      issuedBy: f.issuedTo || "—",
      loto: f.isolations || "—",
      expiringSoon: false,
    } as (typeof RECORDS)[number], ...prev])} />
    </>
  );
}
