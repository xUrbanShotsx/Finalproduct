"use client";
import { useState } from "react";
import { Plus, CheckCircle2, XCircle, AlertCircle, Clock, ShieldAlert, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { CriticalRiskControlsDrawer } from "./CriticalRiskControlsDrawer";
import { RaiseRiskDrawer, type RaiseRiskSource } from "./RaiseRiskDrawer";
import { PageShell, Stat, Badge, matchesTab, matchesSite, siteOptionsOf } from "../shared";

type VerifyResult = "Verified" | "Failed" | "Partial" | "Not Checked";

const CRC_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Working at Heights": { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Confined Space":     { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Electrical":         { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Crane & Lifting":    { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Excavation":         { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Hot Work":           { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Struck By":          { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Chemical":           { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const RECORDS: Array<{
  ref: string; controlName: string; crcType: string; site: string;
  requirement: string; verifiedBy: string; lastVerified: string;
  result: VerifyResult; failureAction: string;
}> = [
  { ref: "CRC-021", controlName: "Edge protection — all open edges ≥2m",            crcType: "Working at Heights", site: "Site 01",     requirement: "Barrier or harness at all edges",         verifiedBy: "J. Smith",   lastVerified: "Today 07:00",  result: "Verified",    failureAction: "" },
  { ref: "CRC-020", controlName: "Exclusion zone — crane swing radius clear",        crcType: "Crane & Lifting",    site: "Site 01",     requirement: "No persons in slew zone during lift",     verifiedBy: "M. Jones",   lastVerified: "Today 06:45",  result: "Verified",    failureAction: "" },
  { ref: "CRC-019", controlName: "Atmospheric test — confined space before entry",   crcType: "Confined Space",     site: "Site 01, 02", requirement: "O₂ 19.5–23.5%, <5% LEL, <5ppm CO",      verifiedBy: "K. Davis",   lastVerified: "Today 08:00",  result: "Verified",    failureAction: "" },
  { ref: "CRC-018", controlName: "Isolation verified — LOTO before work",            crcType: "Electrical",         site: "Site 01",     requirement: "Test-before-touch, tag and lock applied", verifiedBy: "T. Walsh",   lastVerified: "Today 07:30",  result: "Verified",    failureAction: "" },
  { ref: "CRC-017", controlName: "Excavation face support — trench >1.5m",           crcType: "Excavation",         site: "Site 02",     requirement: "Shoring or batter slope to engineer spec",verifiedBy: "S. Lee",    lastVerified: "Today 07:15",  result: "Partial",     failureAction: "Engineer review pending — works paused" },
  { ref: "CRC-016", controlName: "Spotter in place — plant in blind-spot zones",     crcType: "Struck By",          site: "Site 02",     requirement: "Dedicated spotter, radio comms",          verifiedBy: "D. Wong",    lastVerified: "Today 06:50",  result: "Verified",    failureAction: "" },
  { ref: "CRC-015", controlName: "Hot work area clear — 3m combustible-free",        crcType: "Hot Work",           site: "Site 01",     requirement: "Extinguisher, 30 min watch period",       verifiedBy: "P. Nguyen",  lastVerified: "Today 09:00",  result: "Verified",    failureAction: "" },
  { ref: "CRC-014", controlName: "Chemical containment — spill bund intact",         crcType: "Chemical",           site: "Site 01",     requirement: "Bund capacity ≥110% of largest vessel",   verifiedBy: "J. Park",    lastVerified: "Yesterday",    result: "Failed",      failureAction: "Bund breach — maintenance order DEF-059 raised" },
  { ref: "CRC-013", controlName: "Permit in place before confined space entry",       crcType: "Confined Space",     site: "Site 01",     requirement: "Signed permit, rescue team nominated",    verifiedBy: "M. Chen",    lastVerified: "Today 08:05",  result: "Verified",    failureAction: "" },
  { ref: "CRC-012", controlName: "SWMS reviewed and signed by workers before task",  crcType: "Working at Heights", site: "All sites",   requirement: "All workers sign before commencing",      verifiedBy: "J. Smith",   lastVerified: "Today 06:30",  result: "Verified",    failureAction: "" },
  { ref: "CRC-011", controlName: "Scaffold tagged and inspected — weekly",           crcType: "Working at Heights", site: "Site 01",     requirement: "Competent person sign-off, green tag",    verifiedBy: "—",          lastVerified: "13 Jun 2024",  result: "Not Checked", failureAction: "" },
];

const RESULT_CONFIG: Record<VerifyResult, { icon: typeof CheckCircle2; color: string; bg: string; label: string }> = {
  "Verified":    { icon: CheckCircle2, color: "var(--b-badge-green-text)",  bg: "var(--b-badge-green-bg)",  label: "Verified" },
  "Failed":      { icon: XCircle,      color: "#f06060",                    bg: "rgba(240,96,96,0.08)",     label: "Failed" },
  "Partial":     { icon: AlertCircle,  color: "var(--b-badge-yellow-text)", bg: "var(--b-badge-yellow-bg)", label: "Partial" },
  "Not Checked": { icon: Clock,        color: "var(--b-text-muted)",        bg: "var(--b-bg-active)",       label: "Not Checked" },
};

function ControlCard({ r, onRaiseRisk, onAction }: { r: typeof RECORDS[number]; onRaiseRisk: (r: typeof RECORDS[number]) => void; onAction: (ref: string) => void }) {
  const res = RESULT_CONFIG[r.result];
  const Icon = res.icon;
  const typeStyle = CRC_TYPE_COLORS[r.crcType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
  const isFail = r.result === "Failed";
  const isPartial = r.result === "Partial";
  const needsAction = isFail || isPartial;
  return (
    <div
      className="border flex flex-col"
      style={{
        borderColor: isFail ? "#f06060" : isPartial ? "var(--b-badge-yellow-text)" : "var(--b-border)",
        background: isFail ? "rgba(240,96,96,0.03)" : "var(--b-bg)",
      }}
    >
      {/* Status bar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b" style={{ background: res.bg, borderColor: "var(--b-border)" }}>
        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: res.color }} />
        <span className="text-[11.5px] font-[600]" style={{ color: res.color }}>{res.label}</span>
        <span className="ml-auto font-mono text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>{r.ref}</span>
      </div>
      {/* Content */}
      <div className="flex-1 p-3 space-y-2">
        <p className="text-[12.5px] font-[500] leading-snug" style={{ color: "var(--b-text)" }}>{r.controlName}</p>
        <p className="text-[11.5px] leading-snug" style={{ color: "var(--b-text-muted)" }}>{r.requirement}</p>
        {r.failureAction && (
          <p className="text-[11.5px] font-[500]" style={{ color: isFail ? "#f06060" : "var(--b-badge-yellow-text)" }}>
            {r.failureAction}
          </p>
        )}
        {needsAction && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => onRaiseRisk(r)}
              className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 border transition-colors"
              style={{ borderColor: "rgba(240,96,96,0.3)", color: "#f06060", background: "rgba(240,96,96,0.05)" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "rgba(240,96,96,0.12)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "rgba(240,96,96,0.05)"; }}
            >
              <ShieldAlert className="w-3 h-3" /> → Risk Register
            </button>
            <button
              onClick={() => onAction(r.ref)}
              className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 border transition-colors"
              style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)", background: "var(--b-bg-secondary)" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "var(--b-bg-active)"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "var(--b-bg-secondary)"; }}
            >
              <ClipboardList className="w-3 h-3" /> Corrective Action →
            </button>
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2 border-t" style={{ borderColor: "var(--b-border)" }}>
        <div className="flex items-center gap-1.5">
          <Badge label={r.crcType} bg={typeStyle.bg} color={typeStyle.color} />
          <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.site}</span>
        </div>
        <div className="text-right">
          <p className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.verifiedBy}</p>
          <p className="text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>{r.lastVerified}</p>
        </div>
      </div>
    </div>
  );
}

export function CriticalRiskControlsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");
  const [raiseRiskSource, setRaiseRiskSource] = useState<RaiseRiskSource | null>(null);
  const router = useRouter();
  const failed  = rows.filter(r => r.result === "Failed").length;
  const partial = rows.filter(r => r.result === "Partial").length;

  // Sort: Failed first, then Partial, then Not Checked, then Verified
  const ORDER: VerifyResult[] = ["Failed","Partial","Not Checked","Verified"];
  const sorted = [...rows].filter(r => matchesTab(tab, r) && matchesSite(site, r)).sort((a, b) => ORDER.indexOf(a.result) - ORDER.indexOf(b.result));

  function handleRaiseRisk(r: typeof RECORDS[number]) {
    setRaiseRiskSource({
      sourceRef:   r.ref,
      title:       r.controlName,
      location:    r.site,
      site:        r.site.split(",")[0].trim(),
      riskLevel:   r.result === "Failed" ? "Critical" : "High",
      sourceRoute: "/risk/critical-risk-controls",
    });
  }

  function handleAction(ref: string) {
    router.push(`/safety/actions?source=${encodeURIComponent(ref)}`);
  }

  return (
    <>
    <PageShell
      back={{ href: "/risk", label: "Risk Management" }}
      title="Critical Risk Controls"
      description="Daily verification that life-critical controls are actively in place on site."
      cta="Verify Controls"
      ctaSlot={
        <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
          <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          Verify Controls
        </button>
      }
      stats={
        <>
          <Stat label="Controls Today"   value={String(rows.length)} sub="scheduled"                              />
          <Stat label="Failed"           value={String(failed)}         sub="CRC-014"                  highlight="red"    />
          <Stat label="Partial"          value={String(partial)}        sub="engineer review pending"  highlight="yellow" />
          <Stat label="Verified"         value={String(rows.filter(r => r.result === "Verified").length)} sub="confirmed in place" highlight="green" />
        </>
      }
      tabs={["Today", "Failed", "Partial", "Not Checked", "History"]}
      onTabChange={setTab}
      siteOptions={siteOptionsOf(rows)}
      onSiteChange={setSite}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {sorted.map(r => <ControlCard key={r.ref} r={r} onRaiseRisk={handleRaiseRisk} onAction={handleAction} />)}
      </div>
    </PageShell>
    <CriticalRiskControlsDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    <RaiseRiskDrawer
      open={raiseRiskSource !== null}
      onClose={() => setRaiseRiskSource(null)}
      source={raiseRiskSource}
      onSaved={() => setRaiseRiskSource(null)}
    />
    </>
  );
}
