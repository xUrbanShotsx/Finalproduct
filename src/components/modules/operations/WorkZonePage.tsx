"use client";
import { useState } from "react";
import { Plus, MapPin, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { WorkZoneDrawer } from "./WorkZoneDrawer";
import { PageShell, Stat, Badge, StatusBadge } from "../shared";

type ZoneStatus = "Active" | "Pending" | "Closed";

const ZONE_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Traffic Management":   { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Exclusion Zone":       { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Crane Swing Zone":     { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Laydown Area":         { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Pedestrian Corridor":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Hoarding / Fence Line":{ bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "No-Go Zone":           { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const RECORDS: Array<{
  ref: string; zoneType: string; site: string; location: string;
  activeFrom: string; activeTo: string; supervisor: string;
  separation: string; tmpRef: string; status: ZoneStatus;
}> = [
  { ref: "WZ-2024-009", zoneType: "Exclusion Zone",       site: "Site 01", location: "Crane TC-04 slewing radius — Grid A to D, Levels 1–4",      activeFrom: "14 Jun 06:00", activeTo: "14 Jun 18:00", supervisor: "J. Smith",  separation: "Concrete barriers",              tmpRef: "—",         status: "Active"  },
  { ref: "WZ-2024-008", zoneType: "Traffic Management",   site: "Site 01", location: "Main entry off Johnson St — single lane controlled access",  activeFrom: "13 Jun 05:30", activeTo: "31 Aug 2024",  supervisor: "M. Jones",  separation: "Witches hats + bunting",         tmpRef: "TMP-2024-007", status: "Active"  },
  { ref: "WZ-2024-007", zoneType: "Crane Swing Zone",     site: "Site 02", location: "Luffing crane — Grid H5–H9, 20m radius from base",           activeFrom: "10 Jun 07:00", activeTo: "20 Jun 17:00", supervisor: "K. Davis",  separation: "Temporary fencing",              tmpRef: "—",         status: "Active"  },
  { ref: "WZ-2024-006", zoneType: "Pedestrian Corridor",  site: "Site 01", location: "Hoarded pedestrian path — Johnson St frontage to site office",activeFrom: "01 Jun 00:00", activeTo: "30 Sep 2024",  supervisor: "T. Walsh",  separation: "Hoarding",                       tmpRef: "TMP-2024-006", status: "Active"  },
  { ref: "WZ-2024-005", zoneType: "Laydown Area",         site: "Site 02", location: "Formwork laydown — Grid G2–G4, ground level",                activeFrom: "12 Jun 06:00", activeTo: "30 Jun 2024",  supervisor: "D. Wong",   separation: "Barrier tape",                   tmpRef: "—",         status: "Active"  },
  { ref: "WZ-2024-004", zoneType: "Exclusion Zone",       site: "Site 03", location: "Demolition zone — Wing C, 20m exclusion",                    activeFrom: "20 Jun 07:00", activeTo: "22 Jun 17:00", supervisor: "J. Smith",  separation: "Hoarding",                       tmpRef: "—",         status: "Pending" },
  { ref: "WZ-2024-003", zoneType: "No-Go Zone",           site: "Site 01", location: "Contaminated soil exclusion — Grid B1, basement level",      activeFrom: "05 Jun 08:00", activeTo: "08 Jun 17:00", supervisor: "M. Jones",  separation: "Concrete barriers",              tmpRef: "—",         status: "Closed"  },
  { ref: "WZ-2024-002", zoneType: "Traffic Management",   site: "Site 01", location: "Concrete pump setup — Road closure, Bligh St",               activeFrom: "07 Jun 05:00", activeTo: "07 Jun 14:00", supervisor: "K. Davis",  separation: "Jersey barriers",                tmpRef: "TMP-2024-005", status: "Closed"  },
];

function ZoneCard({ r }: { r: typeof RECORDS[number] }) {
  const typeStyle = ZONE_TYPE_COLORS[r.zoneType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
  const isHighRisk = r.zoneType === "Exclusion Zone" || r.zoneType === "Crane Swing Zone" || r.zoneType === "No-Go Zone";

  return (
    <div
      className="border p-3 space-y-2.5 cursor-pointer"
      style={{
        borderColor: isHighRisk && r.status === "Active" ? "rgba(240,96,96,0.4)" : "var(--b-border)",
        background: isHighRisk && r.status === "Active" ? "rgba(240,96,96,0.02)" : "var(--b-bg)",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = isHighRisk && r.status === "Active" ? "rgba(240,96,96,0.6)" : "var(--b-border-hover)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = isHighRisk && r.status === "Active" ? "rgba(240,96,96,0.4)" : "var(--b-border)"}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.ref}</span>
          <Badge label={r.zoneType} bg={typeStyle.bg} color={typeStyle.color} />
        </div>
        <StatusBadge v={r.status} />
      </div>

      {/* Location */}
      <div className="flex items-start gap-1.5">
        <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: "var(--b-text-muted)" }} />
        <p className="text-[12.5px] font-[500] leading-snug" style={{ color: "var(--b-text)" }}>{r.location}</p>
      </div>

      {/* Site + separation */}
      <div className="flex items-center gap-3 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
        <span>{r.site}</span>
        <span>·</span>
        <span>{r.separation}</span>
        {r.tmpRef !== "—" && (
          <>
            <span>·</span>
            <span className="font-mono">{r.tmpRef}</span>
          </>
        )}
      </div>

      {/* Time + supervisor */}
      <div className="flex items-center justify-between text-[11.5px] border-t pt-2" style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />{r.activeFrom} → {r.activeTo}
        </span>
        <span>{r.supervisor}</span>
      </div>
    </div>
  );
}

export function WorkZonePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const active  = rows.filter(r => r.status === "Active").length;
  const highRisk = rows.filter(r => r.status === "Active" && (r.zoneType === "Exclusion Zone" || r.zoneType === "Crane Swing Zone" || r.zoneType === "No-Go Zone")).length;

  return (
    <>
    <PageShell
      back={{ href: "/operations", label: "Operations" }}
      title="Work Zone"
      description="Traffic management plans, exclusion zones and work area separation controls on site."
      cta="New Work Zone"
      ctaSlot={
        <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
          <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
          New Work Zone
        </button>
      }
      stats={
        <>
          <Stat label="Active Zones"     value={String(active)}   sub="across all sites"          highlight="green"  />
          <Stat label="High Risk Active" value={String(highRisk)} sub="exclusion / crane / no-go" highlight="red"    />
          <Stat label="TMPs in Place"    value="2"               sub="council approved"                              />
          <Stat label="Closed This Week" value="2"               sub="WZ-003, WZ-002"             highlight="green"  />
        </>
      }
      tabs={["All", "Active", "Pending", "Closed", "Traffic Management"]}
    >
      <div className="grid grid-cols-2 gap-3">
        {rows.map(r => <ZoneCard key={r.ref} r={r} />)}
      </div>
    </PageShell>
    <WorkZoneDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}
