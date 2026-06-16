"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { HazardousSubstancesDrawer } from "./HazardousSubstancesDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const GHS_COLORS: Record<string, { bg: string; color: string }> = {
  "Flammable":       { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Toxic":           { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "Corrosive":       { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Oxidising":       { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Compressed Gas":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Harmful":         { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Environmental":   { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Explosive":       { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "Non-hazardous":   { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  ref: string; productName: string; supplier: string; ghsClass: string;
  location: string; maxQty: string; sdsVersion: string; sdsDate: string;
  sdsExpiry: string; signalWord: string;
  status: "Active" | "Closed";
  sdsExpired: boolean;
}> = [
  { ref: "HS-031", productName: "Methyl Ethyl Ketone (MEK)",      supplier: "Chem Supply",    ghsClass: "Flammable",    location: "Solvent Store",       maxQty: "200 L",   sdsVersion: "1.3", sdsDate: "Mar 2024", sdsExpiry: "Mar 2029", signalWord: "DANGER",  status: "Active", sdsExpired: false },
  { ref: "HS-030", productName: "Chromic Acid Solution 20%",       supplier: "Ajax Finechem",  ghsClass: "Toxic",        location: "Plating Line A",      maxQty: "50 L",    sdsVersion: "2.1", sdsDate: "Jan 2024", sdsExpiry: "Jan 2029", signalWord: "DANGER",  status: "Active", sdsExpired: false },
  { ref: "HS-029", productName: "Sodium Hydroxide 50%",            supplier: "Redox",          ghsClass: "Corrosive",    location: "Chemical Dosing Bay", maxQty: "1000 L",  sdsVersion: "1.7", sdsDate: "Feb 2024", sdsExpiry: "Feb 2029", signalWord: "DANGER",  status: "Active", sdsExpired: false },
  { ref: "HS-028", productName: "Acetylene — compressed",          supplier: "BOC",            ghsClass: "Compressed Gas",location: "Welding Bay A",      maxQty: "12 cyl",  sdsVersion: "3.0", sdsDate: "Apr 2024", sdsExpiry: "Apr 2029", signalWord: "DANGER",  status: "Active", sdsExpired: false },
  { ref: "HS-027", productName: "Sika 552 AT Isocyanate Primer",   supplier: "Sika Australia", ghsClass: "Harmful",      location: "Paint Booth B",       maxQty: "20 L",    sdsVersion: "1.1", sdsDate: "Dec 2018", sdsExpiry: "Dec 2023", signalWord: "WARNING", status: "Active", sdsExpired: true  },
  { ref: "HS-026", productName: "Hydrochloric Acid 32%",           supplier: "Chem Supply",    ghsClass: "Corrosive",    location: "Water Treatment",     maxQty: "500 L",   sdsVersion: "2.4", sdsDate: "Apr 2024", sdsExpiry: "Apr 2029", signalWord: "DANGER",  status: "Active", sdsExpired: false },
  { ref: "HS-025", productName: "Oxygen — compressed",             supplier: "BOC",            ghsClass: "Compressed Gas",location: "Welding Bay A",      maxQty: "8 cyl",   sdsVersion: "2.9", sdsDate: "Apr 2024", sdsExpiry: "Apr 2029", signalWord: "DANGER",  status: "Active", sdsExpired: false },
  { ref: "HS-024", productName: "Diesel Fuel",                     supplier: "On-site tank",   ghsClass: "Flammable",    location: "Fuel Store",          maxQty: "5000 L",  sdsVersion: "1.4", sdsDate: "Jan 2024", sdsExpiry: "Jan 2029", signalWord: "WARNING", status: "Active", sdsExpired: false },
  { ref: "HS-023", productName: "Hydraulic Oil ISO 46",            supplier: "Castrol",        ghsClass: "Harmful",      location: "Maintenance Store",   maxQty: "200 L",   sdsVersion: "1.2", sdsDate: "Jun 2023", sdsExpiry: "Jun 2028", signalWord: "WARNING", status: "Active", sdsExpired: false },
  { ref: "HS-022", productName: "Degreaser — BioSafe WD40 equiv",  supplier: "WD-40 Pty",     ghsClass: "Non-hazardous", location: "Workshop",            maxQty: "50 L",    sdsVersion: "1.0", sdsDate: "Mar 2024", sdsExpiry: "Mar 2029", signalWord: "—",       status: "Active", sdsExpired: false },
];

export function HazardousSubstancesPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const expiredSds = RECORDS.filter(r => r.sdsExpired).length;
  return (
    <>
    <PageShell
      back={{ href: "/compliance", label: "Compliance" }}
      title="Hazardous Substances Register"
      description="SDS register and chemical inventory under WHS Regulations 2017 — Schedule 11."
      cta="Add Substance"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Add Substance
          </button>
        }
      stats={
        <>
          <Stat label="Substances Registered" value="31"              sub="in the register"                        />
          <Stat label="SDS Expired"            value={String(expiredSds)} sub="require updated SDS" highlight="red"   />
          <Stat label="DANGER Signal Word"     value="6"              sub="highest GHS tier"        highlight="yellow"/>
          <Stat label="Last Updated"           value="Apr 2024"       sub="Oxygen + Acetylene SDS"  highlight="green" />
        </>
      }
      tabs={["All", "SDS Expired", "DANGER Class", "Flammable", "Toxic"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Product Name</Th>
          <Th>Supplier</Th>
          <Th>GHS Class</Th>
          <Th>Location</Th>
          <Th>Max Qty</Th>
          <Th>Signal Word</Th>
          <Th>SDS Version</Th>
          <Th>SDS Date</Th>
          <Th>SDS Expiry</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {RECORDS.map((r) => {
            const ghsStyle = GHS_COLORS[r.ghsClass] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.productName}</span></Td>
                <Td muted>{r.supplier}</Td>
                <Td><Badge label={r.ghsClass} bg={ghsStyle.bg} color={ghsStyle.color} /></Td>
                <Td muted>{r.location}</Td>
                <Td muted>{r.maxQty}</Td>
                <Td>
                  <span style={{ color: r.signalWord === "DANGER" ? "#f06060" : r.signalWord === "WARNING" ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)", fontSize: "11px", fontWeight: r.signalWord !== "—" ? 700 : undefined }}>
                    {r.signalWord}
                  </span>
                </Td>
                <Td muted>{r.sdsVersion}</Td>
                <Td muted>{r.sdsDate}</Td>
                <Td>
                  <span style={{ color: r.sdsExpired ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.sdsExpired ? 600 : undefined }}>
                    {r.sdsExpiry}{r.sdsExpired ? " · expired" : ""}
                  </span>
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <HazardousSubstancesDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}