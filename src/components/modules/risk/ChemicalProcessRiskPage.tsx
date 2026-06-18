"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { ChemicalProcessRiskDrawer } from "./ChemicalProcessRiskDrawer";
import { PageShell, Stat, SeverityBadge, StatusBadge, Badge, TableHead, Th, Tr, Td, matchesTab, matchesSite, siteOptionsOf } from "../shared";

const CHEM_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Flammable":      { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Toxic":          { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "Corrosive":      { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Oxidising":      { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Compressed Gas": { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Carcinogen":     { bg: "rgba(220,38,38,0.15)",     color: "#f06060" },
  "Irritant":       { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  ref: string; chemical: string; casNo: string; chemType: string; location: string;
  qty: string; wes: string; currentExposure: string; aboveLimit: boolean;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  controls: string; sdsIssue: string; nextReview: string;
  status: "Active" | "Closed" | "Pending";
}> = [
  { ref: "CPR-031", chemical: "Methyl Ethyl Ketone (MEK)",      casNo: "78-93-3",     chemType: "Flammable",      location: "Solvent Store",       qty: "200 L",  wes: "150 ppm",    currentExposure: "62 ppm",  aboveLimit: false, riskLevel: "High",   controls: "LEV, flash-proof fittings, SWP-027", sdsIssue: "Mar 2024", nextReview: "Mar 2025", status: "Active"  },
  { ref: "CPR-030", chemical: "Chromic Acid (hexavalent Cr)",   casNo: "7738-94-5",   chemType: "Toxic",          location: "Plating Line A",      qty: "50 L",   wes: "0.05 mg/m³", currentExposure: "0.07 mg/m³",aboveLimit: true,  riskLevel: "Critical", controls: "Enclosed process, PAPR, health monitoring",sdsIssue:"Jan 2024",nextReview:"Jan 2025",status:"Active"},
  { ref: "CPR-029", chemical: "Sodium Hydroxide 50% solution",  casNo: "1310-73-2",   chemType: "Corrosive",      location: "Chemical Dosing Bay", qty: "1000 L", wes: "2 mg/m³",    currentExposure: "0.5 mg/m³",aboveLimit: false, riskLevel: "High",   controls: "Bunded IBC, face shield, emergency shower", sdsIssue: "Feb 2024", nextReview: "Feb 2025", status: "Active"  },
  { ref: "CPR-028", chemical: "Acetylene",                       casNo: "74-86-2",     chemType: "Compressed Gas", location: "Welding Bay A",       qty: "12 cyl", wes: "N/A",        currentExposure: "N/A",     aboveLimit: false, riskLevel: "High",   controls: "Secured, flashback arrestor, SWP-027",sdsIssue:"Apr 2024",nextReview:"Apr 2025",status:"Active"},
  { ref: "CPR-027", chemical: "Isocyanate primer — Sika 552",   casNo: "Mixture",     chemType: "Toxic",          location: "Paint Booth B",       qty: "20 L",   wes: "0.02 ppm",   currentExposure: "0.01 ppm",aboveLimit: false, riskLevel: "High",   controls: "Full-face PAPR, LEV, HOLD see OR-240613-005",sdsIssue:"Dec 2023",nextReview:"Dec 2024",status:"Active"},
  { ref: "CPR-026", chemical: "Asbestos — suspected ACM framing",casNo: "N/A",         chemType: "Carcinogen",     location: "Site 03 — Demo Zone", qty: "Unknown",wes: "0.1 f/ml",   currentExposure: "Untested",aboveLimit: false, riskLevel: "High",   controls: "Works halted — clearance testing ordered",sdsIssue:"—",nextReview:"—",status:"Pending"},
  { ref: "CPR-025", chemical: "Hydrochloric Acid 32%",           casNo: "7647-01-0",   chemType: "Corrosive",      location: "Water Treatment",     qty: "500 L",  wes: "5 ppm",      currentExposure: "1.2 ppm", aboveLimit: false, riskLevel: "Medium", controls: "Bunded IBC, neutralisation kit, SWP-027",sdsIssue:"Apr 2024",nextReview:"Apr 2025",status:"Active"},
  { ref: "CPR-024", chemical: "Oxygen — compressed cylinder",    casNo: "7782-44-7",   chemType: "Oxidising",      location: "Welding Bay A",       qty: "8 cyl",  wes: "N/A",        currentExposure: "N/A",     aboveLimit: false, riskLevel: "Medium", controls: "Secured, no oil contact, ventilated store",sdsIssue:"Apr 2024",nextReview:"Apr 2025",status:"Active"},
  { ref: "CPR-023", chemical: "Cutting fluid (water-soluble)",   casNo: "Mixture",     chemType: "Irritant",       location: "CNC Machine Shop",    qty: "200 L",  wes: "N/A",        currentExposure: "N/A",     aboveLimit: false, riskLevel: "Low",    controls: "Nitrile gloves, skin monitoring",sdsIssue:"Feb 2024",nextReview:"Feb 2025",status:"Active"},
];

export function ChemicalProcessRiskPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");
  const aboveWes = rows.filter(r => r.aboveLimit).length;
  return (
    <>
    <PageShell
      back={{ href: "/risk", label: "Risk Management" }}
      title="Chemical & Process Risk"
      description="Risk assessment and exposure monitoring for hazardous chemicals and industrial processes."
      cta="Add Chemical"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Add Chemical
          </button>
        }
      stats={
        <>
          <Stat label="Chemicals Registered" value="31"            sub="in SDS register"                     />
          <Stat label="Above WES Limit"       value={String(aboveWes)} sub="CPR-030 · Chromic acid" highlight="red"    />
          <Stat label="Pending Testing"       value="1"            sub="CPR-026 · ACM"         highlight="yellow" />
          <Stat label="Reviews This Month"    value="4"            sub="SDS verified"          highlight="green"  />
        </>
      }
      tabs={["All", "Above WES", "Critical", "Pending", "Closed"]}
      onTabChange={setTab}
      siteOptions={siteOptionsOf(rows)}
      onSiteChange={setSite}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Chemical / Substance</Th>
          <Th>CAS No.</Th>
          <Th>Type</Th>
          <Th>Location</Th>
          <Th>Qty</Th>
          <Th>WES</Th>
          <Th>Current Exposure</Th>
          <Th>Risk Level</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.filter(r => matchesTab(tab, r) && matchesSite(site, r)).map((r) => {
            const typeStyle = CHEM_TYPE_COLORS[r.chemType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.chemical}</span></Td>
                <Td><span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.casNo}</span></Td>
                <Td><Badge label={r.chemType} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td muted>{r.location}</Td>
                <Td muted>{r.qty}</Td>
                <Td muted>{r.wes}</Td>
                <Td>
                  <span style={{ color: r.aboveLimit ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.aboveLimit ? 600 : undefined }}>
                    {r.currentExposure}{r.aboveLimit ? " · ABOVE WES" : ""}
                  </span>
                </Td>
                <Td><SeverityBadge v={r.riskLevel} /></Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <ChemicalProcessRiskDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}