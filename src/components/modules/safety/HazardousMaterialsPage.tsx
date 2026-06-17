"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { HazardousMaterialsDrawer } from "./HazardousMaterialsDrawer";
import { PageShell, Stat, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const GHS_COLORS: Record<string, { bg: string; color: string }> = {
  "Flammable":      { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Corrosive":      { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Toxic":          { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "Oxidising":      { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Compressed Gas": { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Harmful":        { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Environmental":  { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Non-hazardous":  { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  ref: string; productName: string; supplier: string; ghsClass: string;
  location: string; maxQty: string; signalWord: string;
  sdsExpiry: string; spillKit: string;
  status: "Active" | "Closed";
  sdsExpired: boolean;
}> = [
  { ref: "HM-024", productName: "Sodium Hypochlorite 12.5%",   supplier: "Ixom",          ghsClass: "Corrosive",     location: "Pool Plant",      maxQty: "1000 L", signalWord: "DANGER",  sdsExpiry: "Feb 2029", spillKit: "Chemical", status: "Active", sdsExpired: false },
  { ref: "HM-023", productName: "Hydrochloric Acid 14% (pool)", supplier: "Ixom",          ghsClass: "Corrosive",     location: "Pool Plant",      maxQty: "200 L",  signalWord: "DANGER",  sdsExpiry: "Feb 2029", spillKit: "Chemical", status: "Active", sdsExpired: false },
  { ref: "HM-022", productName: "R-32 Refrigerant",            supplier: "A-Gas",         ghsClass: "Compressed Gas",location: "Roof Plant",      maxQty: "6 cyl",  signalWord: "WARNING", sdsExpiry: "Jul 2029", spillKit: "—",        status: "Active", sdsExpired: false },
  { ref: "HM-021", productName: "Floor Stripper — caustic",    supplier: "Agar Cleaning", ghsClass: "Corrosive",     location: "Cleaners Store",  maxQty: "60 L",   signalWord: "DANGER",  sdsExpiry: "Nov 2023", spillKit: "Chemical", status: "Active", sdsExpired: true  },
  { ref: "HM-020", productName: "Diesel (generator)",          supplier: "On-site tank",  ghsClass: "Flammable",     location: "Loading Dock",    maxQty: "2000 L", signalWord: "WARNING", sdsExpiry: "Jan 2029", spillKit: "Fuel",     status: "Active", sdsExpired: false },
  { ref: "HM-019", productName: "Glycol — chiller dosing",     supplier: "ChemSupply",    ghsClass: "Harmful",       location: "Plant Room",      maxQty: "400 L",  signalWord: "WARNING", sdsExpiry: "Mar 2029", spillKit: "General",  status: "Active", sdsExpired: false },
  { ref: "HM-018", productName: "LPG — kitchen reticulation",  supplier: "Elgas",         ghsClass: "Flammable",     location: "Roof Plant",      maxQty: "4 cyl",  signalWord: "DANGER",  sdsExpiry: "Apr 2029", spillKit: "—",        status: "Active", sdsExpired: false },
  { ref: "HM-017", productName: "Bleach — general purpose",    supplier: "Agar Cleaning", ghsClass: "Corrosive",     location: "Cleaners Store",  maxQty: "40 L",   signalWord: "WARNING", sdsExpiry: "Jun 2029", spillKit: "General",  status: "Active", sdsExpired: false },
  { ref: "HM-016", productName: "Descaler — cooling tower",    supplier: "Nalco",         ghsClass: "Corrosive",     location: "Plant Room",      maxQty: "100 L",  signalWord: "DANGER",  sdsExpiry: "Oct 2022", spillKit: "Chemical", status: "Active", sdsExpired: true  },
  { ref: "HM-015", productName: "Window cleaner concentrate",  supplier: "Agar Cleaning", ghsClass: "Non-hazardous", location: "Cleaners Store",  maxQty: "30 L",   signalWord: "—",       sdsExpiry: "May 2029", spillKit: "General",  status: "Active", sdsExpired: false },
];

export function HazardousMaterialsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const expiredSds = rows.filter(r => r.sdsExpired).length;
  return (
    <>
    <PageShell
      back={{ href: "/safety", label: "Safety" }}
      title="Hazardous Materials"
      description="SDS register, chemical storage, handling procedures and spill response for facility chemicals."
      cta="Add Material"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Add Material
          </button>
        }
      stats={
        <>
          <Stat label="Materials Registered" value="24"               sub="across all stores"                          />
          <Stat label="SDS Expired"          value={String(expiredSds)} sub="require updated SDS"   highlight="red"     />
          <Stat label="DANGER Signal Word"   value="5"                sub="highest GHS tier"      highlight="yellow"  />
          <Stat label="Spill Kits Deployed"  value="6"                sub="chemical · fuel · general" highlight="green" />
        </>
      }
      tabs={["All", "SDS Expired", "DANGER Class", "Flammable", "Corrosive"]}
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
          <Th>Spill Kit</Th>
          <Th>SDS Expiry</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => {
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
                <Td muted>{r.spillKit}</Td>
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
    <HazardousMaterialsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => [{
      ref: `HM-${25 + prev.length}`,
      productName: f.productName || "New material",
      supplier: f.supplier || "—",
      ghsClass: f.ghsClass || "Non-hazardous",
      location: f.location || "Plant Room",
      maxQty: f.quantity ? `${f.quantity} ${f.unit}`.trim() : "—",
      signalWord: f.signalWord || "—",
      sdsExpiry: f.sdsExpiry || "—",
      spillKit: "General",
      status: "Active" as const,
      sdsExpired: false,
    } as (typeof RECORDS)[number], ...prev])} />
    </>
  );
}
