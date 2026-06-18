"use client";
import { useState } from "react";
import { Plus, MapPin, Clock, Megaphone, Map as MapIcon, Users, X, Send, Check, ChevronRight } from "lucide-react";
import { WorkZoneDrawer } from "./WorkZoneDrawer";
import { PageShell, Stat, Badge, StatusBadge, matchesTab } from "../shared";

type ZoneStatus = "Active" | "Pending" | "Closed";

/* ── Emergency evacuation plans (per site) ── */
interface EvacPlan {
  site: string;
  workers: number;
  assembly: string;
  altAssembly: string;
  primaryRoute: string;
  secondaryRoute: string;
  chiefWarden: string;
  wardenPhone: string;
  hospital: string;
  lastDrill: string;
}
const EVAC_PLANS: EvacPlan[] = [
  { site: "Site 01", workers: 42, assembly: "Assembly Point A — Johnson St car park", altAssembly: "Assembly Point B — Bligh St verge", primaryRoute: "Level exits → north stair → site gate 1 → Johnson St", secondaryRoute: "South stair → laydown yard → gate 3", chiefWarden: "J. Smith", wardenPhone: "0412 345 678", hospital: "Westmead Hospital — 8 min", lastDrill: "05 Jun 2024" },
  { site: "Site 02", workers: 18, assembly: "Assembly Point — Liverpool St open lot", altAssembly: "Assembly Point B — east footpath", primaryRoute: "Ground egress → east gate → Liverpool St", secondaryRoute: "West gate → contractor car park", chiefWarden: "K. Davis", wardenPhone: "0413 222 901", hospital: "Liverpool Hospital — 6 min", lastDrill: "22 May 2024" },
  { site: "Site 03", workers: 9, assembly: "Assembly Point — Penrith depot forecourt", altAssembly: "Assembly Point B — street frontage", primaryRoute: "Main egress → front gate → depot forecourt", secondaryRoute: "Rear gate → laneway", chiefWarden: "M. Jones", wardenPhone: "0414 555 120", hospital: "Nepean Hospital — 11 min", lastDrill: "30 Apr 2024" },
];

const NOTIFY_TYPES = [
  { id: "evacuate", label: "Evacuate now", danger: true },
  { id: "stop", label: "Stop work", danger: true },
  { id: "hazard", label: "Hazard alert", danger: true },
  { id: "weather", label: "Severe weather", danger: false },
  { id: "allclear", label: "All clear", danger: false },
  { id: "general", label: "General notice", danger: false },
];

interface Notification { id: string; site: string; type: string; message: string; workers: number; at: string; }

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

/* ── View an evacuation plan ── */
function EvacModal({ plan, onClose, onNotify }: { plan: EvacPlan; onClose: () => void; onNotify: () => void }) {
  const rows: [string, string][] = [
    ["Primary assembly", plan.assembly],
    ["Alternate assembly", plan.altAssembly],
    ["Primary egress route", plan.primaryRoute],
    ["Secondary egress route", plan.secondaryRoute],
    ["Chief warden", `${plan.chiefWarden} · ${plan.wardenPhone}`],
    ["Nearest hospital", plan.hospital],
    ["Last drill", plan.lastDrill],
  ];
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-[520px] border max-h-[88vh] overflow-y-auto" style={{ background: "var(--b-bg)", borderColor: "var(--b-border)" }}>
        <div className="flex items-center justify-between px-5 py-3.5 border-b sticky top-0" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
          <div className="flex items-center gap-2">
            <MapIcon className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
            <span className="text-[14px] font-bold" style={{ color: "var(--b-text)" }}>Evacuation Plan — {plan.site}</span>
          </div>
          <button onClick={onClose} style={{ color: "var(--b-text-muted)" }}><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5">
          {/* schematic */}
          <div className="border mb-4 p-4 flex flex-col items-center justify-center text-center" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)", minHeight: "120px" }}>
            <MapIcon className="w-7 h-7 mb-2" style={{ color: "var(--b-text-muted)" }} />
            <div className="text-[12px]" style={{ color: "var(--b-text-secondary)" }}>{plan.assembly}</div>
            <div className="text-[11px] mt-1" style={{ color: "var(--b-text-muted)" }}>Tap a worker&apos;s phone shows this map with live routes</div>
          </div>
          <div className="space-y-0">
            {rows.map(([k, v]) => (
              <div key={k} className="flex gap-3 py-2.5 border-b last:border-b-0" style={{ borderColor: "var(--b-border)" }}>
                <span className="text-[11.5px] w-40 flex-shrink-0 font-semibold uppercase tracking-wide" style={{ color: "var(--b-text-muted)" }}>{k}</span>
                <span className="text-[13px]" style={{ color: "var(--b-text)" }}>{v}</span>
              </div>
            ))}
          </div>
          <button onClick={onNotify} className="w-full mt-5 h-11 flex items-center justify-center gap-2 text-[14px] font-bold" style={{ background: "rgba(240,96,96,0.1)", border: "1px solid #f06060", color: "#f06060" }}>
            <Megaphone className="w-4 h-4" /> Trigger evacuation for {plan.site}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Notify all workers on a site ── */
function NotifyModal({ onClose, onSend, presetSite }: { onClose: () => void; onSend: (n: Notification) => void; presetSite?: string }) {
  const [site, setSite] = useState(presetSite ?? "Site 01");
  const [type, setType] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState<Notification | null>(null);

  function workersFor(s: string) {
    if (s === "All sites") return EVAC_PLANS.reduce((a, p) => a + p.workers, 0);
    return EVAC_PLANS.find((p) => p.site === s)?.workers ?? 0;
  }
  function send() {
    if (!type) return;
    const label = NOTIFY_TYPES.find((t) => t.id === type)?.label ?? "Notice";
    const n: Notification = {
      id: `N-${Date.now()}`, site, type: label,
      message: msg || label, workers: workersFor(site),
      at: new Date().toLocaleString("en-AU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
    };
    onSend(n); setSent(n);
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="w-full max-w-[440px] border" style={{ background: "var(--b-bg)", borderColor: sent ? "var(--b-badge-green-text)" : "#f06060" }}>
        {!sent ? (
          <>
            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[14px] font-bold flex items-center gap-2" style={{ color: "#f06060" }}><Megaphone className="w-4 h-4" /> Notify workers on site</span>
              <button onClick={onClose} style={{ color: "var(--b-text-muted)" }}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5">
              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--b-text-muted)" }}>Job site</label>
              <select value={site} onChange={(e) => setSite(e.target.value)} className="w-full h-11 px-3 mt-1.5 mb-4 text-[13px] border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}>
                {EVAC_PLANS.map((p) => <option key={p.site}>{p.site}</option>)}
                <option>All sites</option>
              </select>

              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--b-text-muted)" }}>Message type</label>
              <div className="grid grid-cols-2 gap-2 mt-1.5 mb-4">
                {NOTIFY_TYPES.map((t) => (
                  <button key={t.id} onClick={() => setType(t.id)} className="h-10 text-[12.5px] font-semibold border" style={{ borderColor: type === t.id ? (t.danger ? "#f06060" : "var(--b-accent-border)") : "var(--b-border)", color: type === t.id ? (t.danger ? "#f06060" : "var(--b-accent-text)") : "var(--b-text-muted)", background: type === t.id ? (t.danger ? "rgba(240,96,96,0.08)" : "var(--b-accent-bg)") : "transparent" }}>{t.label}</button>
                ))}
              </div>

              <label className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: "var(--b-text-muted)" }}>Detail (optional)</label>
              <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Add specifics…" className="w-full h-11 px-3 mt-1.5 mb-5 text-[13px] border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }} />

              <button onClick={send} disabled={!type} className="w-full h-12 flex items-center justify-center gap-2 text-[14px] font-bold disabled:opacity-40" style={{ background: "#f06060", color: "#fff" }}>
                <Send className="w-4 h-4" /> Push to {workersFor(site)} workers on {site}
              </button>
            </div>
          </>
        ) : (
          <div className="p-6 text-center">
            <div className="w-14 h-14 mx-auto flex items-center justify-center mb-3" style={{ background: "var(--b-badge-green-bg)" }}><Check className="w-7 h-7" style={{ color: "var(--b-badge-green-text)" }} /></div>
            <div className="text-[16px] font-bold" style={{ color: "var(--b-text)" }}>Alert sent</div>
            <p className="text-[13px] mt-1" style={{ color: "var(--b-text-muted)" }}>&ldquo;{sent.type}&rdquo; pushed to {sent.workers} workers on {sent.site}.</p>
            <button onClick={onClose} className="mt-5 h-10 px-6 text-[13px] font-semibold b-btn-accent">Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

export function WorkZonePage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [evacPlan, setEvacPlan] = useState<EvacPlan | null>(null);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifySite, setNotifySite] = useState<string | undefined>(undefined);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const active  = rows.filter(r => r.status === "Active").length;
  const highRisk = rows.filter(r => r.status === "Active" && (r.zoneType === "Exclusion Zone" || r.zoneType === "Crane Swing Zone" || r.zoneType === "No-Go Zone")).length;

  function openNotify(site?: string) { setNotifySite(site); setNotifyOpen(true); }

  return (
    <>
    <PageShell
      back={{ href: "/operations", label: "Operations" }}
      title="Work Zone"
      description="Traffic management plans, exclusion zones and work area separation controls on site."
      cta="New Work Zone"
      ctaSlot={
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => openNotify()} className="flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-semibold border flex-shrink-0" style={{ borderColor: "#f06060", color: "#f06060", background: "rgba(240,96,96,0.08)" }}>
            <Megaphone className="w-3.5 h-3.5" />
            Notify Workers
          </button>
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New Work Zone
          </button>
        </div>
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
      onTabChange={setTab}
    >
      <div className="p-4 sm:p-6 space-y-6">
        {/* Emergency evacuation plans */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapIcon className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
            <h2 className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--b-text)" }}>Emergency Evacuation Plans</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {EVAC_PLANS.map((p) => (
              <div key={p.site} className="border p-3.5" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13.5px] font-semibold" style={{ color: "var(--b-text)" }}>{p.site}</span>
                  <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--b-text-muted)" }}><Users className="w-3 h-3" /> {p.workers}</span>
                </div>
                <div className="flex items-start gap-1.5 text-[11.5px] mb-1" style={{ color: "var(--b-text-muted)" }}>
                  <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" /> {p.assembly}
                </div>
                <div className="text-[11px] mb-3" style={{ color: "var(--b-text-muted)" }}>Warden {p.chiefWarden} · drill {p.lastDrill}</div>
                <button onClick={() => setEvacPlan(p)} className="w-full flex items-center justify-center gap-1.5 h-9 text-[12.5px] font-semibold border" style={{ borderColor: "var(--b-accent-border)", color: "var(--b-accent-text)", background: "var(--b-accent-bg)" }}>
                  View plan <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications log */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4" style={{ color: "#f06060" }} />
              <h2 className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "var(--b-text)" }}>Site Notifications</h2>
            </div>
            <button onClick={() => openNotify()} className="flex items-center gap-1.5 px-3 h-8 text-[12px] font-semibold border" style={{ borderColor: "#f06060", color: "#f06060", background: "rgba(240,96,96,0.08)" }}>
              <Megaphone className="w-3.5 h-3.5" /> Notify all workers
            </button>
          </div>
          {notifications.length === 0 ? (
            <div className="border border-dashed p-5 text-center text-[12.5px]" style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>
              No alerts sent. Use &ldquo;Notify all workers&rdquo; to push a site-wide message to every worker on a job site.
            </div>
          ) : (
            <div className="space-y-1.5">
              {notifications.map((n) => (
                <div key={n.id} className="flex items-center gap-3 border px-3.5 py-2.5" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
                  <span className="w-1.5 h-1.5 flex-shrink-0" style={{ background: "#f06060" }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{n.type} <span className="font-normal" style={{ color: "var(--b-text-muted)" }}>— {n.site}</span></div>
                    {n.message !== n.type && <div className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{n.message}</div>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[11px]" style={{ color: "var(--b-badge-green-text)" }}>{n.workers} notified</div>
                    <div className="text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>{n.at}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Work zones */}
        <div>
          <h2 className="text-[12px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--b-text)" }}>Work Zones</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rows.filter(r => matchesTab(tab, r)).map(r => <ZoneCard key={r.ref} r={r} />)}
          </div>
        </div>
      </div>
    </PageShell>
    <WorkZoneDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />

    {evacPlan && <EvacModal plan={evacPlan} onClose={() => setEvacPlan(null)} onNotify={() => { const s = evacPlan.site; setEvacPlan(null); openNotify(s); }} />}
    {notifyOpen && <NotifyModal presetSite={notifySite} onClose={() => setNotifyOpen(false)} onSend={(n) => setNotifications(prev => [n, ...prev])} />}
    </>
  );
}
