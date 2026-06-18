"use client";
import { useState } from "react";
import { Plus, AlertTriangle, CheckCircle2, Clock, Wrench } from "lucide-react";
import { PlantEquipmentDrawer } from "./PlantEquipmentDrawer";
import { PageShell, Stat, Badge, matchesTab } from "../shared";

const PLANT_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Tower Crane":     { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Excavator":       { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Telehandler":     { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "EWP":             { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Concrete Pump":   { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Skid Steer":      { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Personnel Hoist": { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Compactor":       { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const RECORDS: Array<{
  assetId: string; name: string; type: string; site: string;
  lastPreop: string; preOpResult: "Pass" | "Fail" | "Pending";
  nextService: string; serviceDue: boolean; operator: string;
  status: "Active" | "Grounded" | "In Service" | "Inactive";
  defects: number;
}> = [
  { assetId: "TC-04",   name: "Liebherr 280 EC-H",    type: "Tower Crane",    site: "Site 01", lastPreop: "Today 06:30",  preOpResult: "Pass",    nextService: "30 Jul 2024", serviceDue: false, operator: "M. Chen",   status: "Active",     defects: 1 },
  { assetId: "EX-02",   name: "CAT 320 Excavator",     type: "Excavator",      site: "Site 02", lastPreop: "Today 06:45",  preOpResult: "Pass",    nextService: "15 Jun 2024", serviceDue: true,  operator: "T. Walsh",  status: "Active",     defects: 1 },
  { assetId: "TH-01",   name: "JLG 4017 Telehandler",  type: "Telehandler",    site: "Site 01", lastPreop: "Today 07:00",  preOpResult: "Pass",    nextService: "22 Aug 2024", serviceDue: false, operator: "R. Kim",    status: "Active",     defects: 0 },
  { assetId: "EWP-03",  name: "Genie S-65 Boom Lift",  type: "EWP",            site: "Site 01", lastPreop: "Today 08:00",  preOpResult: "Pass",    nextService: "01 Sep 2024", serviceDue: false, operator: "P. Nguyen", status: "Active",     defects: 1 },
  { assetId: "CP-01",   name: "Schwing BP 600 Pump",   type: "Concrete Pump",  site: "Site 01", lastPreop: "Today 07:30",  preOpResult: "Pass",    nextService: "10 Jul 2024", serviceDue: false, operator: "D. Wong",   status: "Active",     defects: 0 },
  { assetId: "SS-02",   name: "Bobcat S650 Skid Steer",type: "Skid Steer",     site: "Site 02", lastPreop: "Today 07:45",  preOpResult: "Pass",    nextService: "30 Jun 2024", serviceDue: false, operator: "S. Lee",    status: "Active",     defects: 0 },
  { assetId: "PH-01",   name: "Alimak Hoist SC 32/33", type: "Personnel Hoist",site: "Site 01", lastPreop: "12 Jun 06:15", preOpResult: "Fail",    nextService: "18 Jun 2024", serviceDue: true,  operator: "J. Smith",  status: "Grounded",   defects: 2 },
  { assetId: "TC-03",   name: "Terex CTT 91-5",        type: "Tower Crane",    site: "Site 03", lastPreop: "13 Jun 06:00", preOpResult: "Pending", nextService: "01 Aug 2024", serviceDue: false, operator: "—",         status: "Inactive",   defects: 0 },
  { assetId: "CO-01",   name: "Dynapac CA250D",         type: "Compactor",      site: "Site 02", lastPreop: "11 Jun 07:00", preOpResult: "Pass",    nextService: "25 Jun 2024", serviceDue: false, operator: "K. Davis",  status: "In Service", defects: 0 },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; dot: string }> = {
  "Active":     { color: "var(--b-badge-green-text)",  bg: "var(--b-badge-green-bg)",  dot: "var(--b-badge-green-text)" },
  "Grounded":   { color: "#f06060",                    bg: "rgba(240,96,96,0.1)",       dot: "#f06060" },
  "In Service": { color: "var(--b-badge-blue-text)",   bg: "var(--b-badge-blue-bg)",   dot: "var(--b-badge-blue-text)" },
  "Inactive":   { color: "var(--b-text-muted)",        bg: "var(--b-bg-active)",        dot: "var(--b-text-muted)" },
};

function PreopIcon({ result }: { result: "Pass" | "Fail" | "Pending" }) {
  if (result === "Pass")    return <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--b-badge-green-text)" }} />;
  if (result === "Fail")    return <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f06060" }} />;
  return <Clock className="w-3.5 h-3.5" style={{ color: "var(--b-badge-yellow-text)" }} />;
}

function AssetCard({ r }: { r: typeof RECORDS[number] }) {
  const typeStyle = PLANT_TYPE_COLORS[r.type] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
  const st = STATUS_CONFIG[r.status];
  const isGrounded = r.status === "Grounded";
  const preOpColor = r.preOpResult === "Fail" ? "#f06060" : r.preOpResult === "Pending" ? "var(--b-badge-yellow-text)" : "var(--b-badge-green-text)";
  const preOpBg    = r.preOpResult === "Fail" ? "rgba(240,96,96,0.08)" : r.preOpResult === "Pending" ? "var(--b-badge-yellow-bg)" : "var(--b-badge-green-bg)";

  return (
    <div
      className="border flex flex-col cursor-pointer"
      style={{
        borderColor: isGrounded ? "#f06060" : "var(--b-border)",
        background: isGrounded ? "rgba(240,96,96,0.02)" : "var(--b-bg)",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = isGrounded ? "#f06060" : "var(--b-border-hover)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = isGrounded ? "#f06060" : "var(--b-border)"}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: "var(--b-border)" }}>
        <div>
          <span className="font-mono text-[11.5px] font-[700]" style={{ color: "var(--b-text)" }}>{r.assetId}</span>
          <span className="text-[11px] ml-1.5" style={{ color: "var(--b-text-muted)" }}>{r.site}</span>
        </div>
        {/* Status dot + label */}
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: st.dot }} />
          <span className="text-[11px] font-[600]" style={{ color: st.color }}>{r.status}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-3 py-2.5 space-y-2">
        <p className="text-[12.5px] font-[500] leading-snug" style={{ color: "var(--b-text)" }}>{r.name}</p>
        <Badge label={r.type} bg={typeStyle.bg} color={typeStyle.color} />
      </div>

      {/* Indicators row */}
      <div className="grid grid-cols-3 border-t" style={{ borderColor: "var(--b-border)" }}>
        {/* Pre-op */}
        <div className="flex flex-col items-center gap-0.5 py-2 px-1 border-r" style={{ background: preOpBg, borderColor: "var(--b-border)" }}>
          <PreopIcon result={r.preOpResult} />
          <span className="text-[10px] font-[600]" style={{ color: preOpColor }}>Pre-op</span>
          <span className="text-[10px]" style={{ color: preOpColor }}>{r.preOpResult}</span>
        </div>
        {/* Service */}
        <div className="flex flex-col items-center gap-0.5 py-2 px-1 border-r" style={{ borderColor: "var(--b-border)" }}>
          <Wrench className="w-3.5 h-3.5" style={{ color: r.serviceDue ? "#f06060" : "var(--b-text-muted)" }} />
          <span className="text-[10px] font-[600]" style={{ color: r.serviceDue ? "#f06060" : "var(--b-text-muted)" }}>Service</span>
          <span className="text-[10px]" style={{ color: r.serviceDue ? "#f06060" : "var(--b-text-muted)" }}>{r.nextService.split(" ").slice(0, 2).join(" ")}</span>
        </div>
        {/* Defects */}
        <div className="flex flex-col items-center gap-0.5 py-2 px-1">
          <AlertTriangle className="w-3.5 h-3.5" style={{ color: r.defects > 0 ? "#f06060" : "var(--b-text-muted)" }} />
          <span className="text-[10px] font-[600]" style={{ color: r.defects > 0 ? "#f06060" : "var(--b-text-muted)" }}>Defects</span>
          <span className="text-[10px]" style={{ color: r.defects > 0 ? "#f06060" : "var(--b-text-muted)" }}>{r.defects > 0 ? r.defects : "—"}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-2 border-t flex items-center justify-between" style={{ borderColor: "var(--b-border)" }}>
        <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>Operator: {r.operator}</span>
        <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.lastPreop}</span>
      </div>
    </div>
  );
}

export function PlantEquipmentPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const ORDER: Array<typeof RECORDS[number]["status"]> = ["Grounded","Active","In Service","Inactive"];
  const sorted = [...rows].filter(r => matchesTab(tab, r)).sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status));

  return (
    <>
    <PageShell
      back={{ href: "/operations", label: "Operations" }}
      title="Plant & Equipment"
      description="Pre-operational inspections, defect logging and service tracking for mobile plant."
      cta="Pre-op Check"
      ctaSlot={
        <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
          <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          Pre-op Check
        </button>
      }
      stats={
        <>
          <Stat label="Assets Registered" value="28"  sub="tracked in register"                   />
          <Stat label="Grounded"           value="1"   sub="PH-01 · fault"        highlight="red"   />
          <Stat label="Service Due"        value="2"   sub="within 7 days"         highlight="yellow"/>
          <Stat label="Pre-ops Today"      value="8"   sub="of 9 active assets"    highlight="green" />
        </>
      }
      tabs={["All", "Active", "Grounded", "Service Due", "Pre-op Fail"]}
      onTabChange={setTab}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sorted.map(r => <AssetCard key={r.assetId} r={r} />)}
      </div>
    </PageShell>
    <PlantEquipmentDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}
