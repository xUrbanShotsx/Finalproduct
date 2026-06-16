"use client";

import { useState } from "react";
import { Plus, AlertTriangle, Clock, CheckCircle2, MapPin } from "lucide-react";
import { PageShell, Stat, SeverityBadge, StatusBadge } from "../shared";
import { ReportIncidentDrawer } from "./ReportIncidentDrawer";

const RECORDS = [
  { ref: "INC-044", date: "13 Jun 2024", time: "09:14", type: "Near Miss",          location: "Site 01 — Level 3",   severity: "High"   as const, status: "Under Investigation" as const, assignee: "J. Smith",  daysOpen: 3    },
  { ref: "INC-043", date: "07 Jun 2024", time: "13:42", type: "First Aid Injury",   location: "Site 02 — Laydown",   severity: "Low"    as const, status: "Closed"               as const, assignee: "M. Jones",  daysOpen: null },
  { ref: "INC-042", date: "03 Jun 2024", time: "11:05", type: "Property Damage",    location: "Site 01 — B-Block",   severity: "Medium" as const, status: "Closed"               as const, assignee: "K. Davis",  daysOpen: null },
  { ref: "INC-041", date: "28 May 2024", time: "07:55", type: "Near Miss",          location: "Site 03 — Basement",  severity: "Medium" as const, status: "Open"                 as const, assignee: "L. Brown",  daysOpen: 16   },
  { ref: "INC-040", date: "21 May 2024", time: "15:30", type: "First Aid Injury",   location: "Site 02 — Level 1",   severity: "Low"    as const, status: "Closed"               as const, assignee: "T. Walsh",  daysOpen: null },
  { ref: "INC-039", date: "15 May 2024", time: "08:20", type: "Near Miss",          location: "Site 01 — Roof",      severity: "High"   as const, status: "Closed"               as const, assignee: "J. Smith",  daysOpen: null },
];

const SEV_BORDER: Record<string, string> = {
  Critical: "#f06060", High: "#f06060", Medium: "var(--b-badge-yellow-text)", Low: "var(--b-badge-green-text)",
};
const SEV_BG: Record<string, string> = {
  Critical: "rgba(240,96,96,0.05)", High: "rgba(240,96,96,0.04)", Medium: "rgba(255,200,0,0.04)", Low: "rgba(60,180,100,0.04)",
};

function StatusIcon({ status }: { status: string }) {
  if (status === "Closed") return <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--b-badge-green-text)" }} />;
  if (status === "Under Investigation") return <Clock className="w-3.5 h-3.5" style={{ color: "var(--b-badge-yellow-text)" }} />;
  return <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f06060" }} />;
}

export function IncidentsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <PageShell
        back={{ href: "/safety", label: "Safety" }}
        title="Incidents"
        description="Report, investigate and close out incidents, near misses and injuries."
        cta="Report Incident"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Report Incident
          </button>
        }
        stats={
          <>
            <Stat label="Open"                value="2"   sub="1 high severity"       highlight="red"    />
            <Stat label="Under Investigation" value="1"   sub="INC-044 · day 3"       highlight="yellow" />
            <Stat label="Closed This Month"   value="3"   sub="+1 vs last month"      highlight="green"  />
            <Stat label="YTD TRIFR"           value="1.2" sub="target: <2.0"                             />
          </>
        }
        tabs={["All", "Open", "Under Investigation", "Closed", "Notifiable"]}
      >
        <div className="space-y-2 p-1">
          {RECORDS.map((r) => (
            <div
              key={r.ref}
              className="flex items-stretch border cursor-pointer transition-colors"
              style={{ borderColor: "var(--b-border)", background: SEV_BG[r.severity] }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border-hover)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"}
            >
              {/* Severity stripe */}
              <div className="w-1 flex-shrink-0" style={{ background: SEV_BORDER[r.severity] }} />

              <div className="flex-1 px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: ref + type */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[11.5px] font-semibold" style={{ color: "var(--b-text)" }}>{r.ref}</span>
                      <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>·</span>
                      <span className="text-[12px] font-[500]" style={{ color: "var(--b-text)" }}>{r.type}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        {r.location}
                      </span>
                      <span>{r.date} · {r.time}</span>
                    </div>
                  </div>

                  {/* Right: badges + meta */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <SeverityBadge v={r.severity} />
                    <div className="flex items-center gap-1.5">
                      <StatusIcon status={r.status} />
                      <span className="text-[12px]" style={{ color: r.status === "Closed" ? "var(--b-text-muted)" : "var(--b-text-secondary)" }}>
                        {r.status}
                      </span>
                    </div>
                    <span className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>{r.assignee}</span>
                    {r.daysOpen != null && (
                      <span
                        className="text-[11px] font-[600] px-2 py-0.5"
                        style={{
                          background: r.daysOpen > 14 ? "rgba(240,96,96,0.1)" : "var(--b-badge-yellow-bg)",
                          color: r.daysOpen > 14 ? "#f06060" : "var(--b-badge-yellow-text)",
                        }}
                      >
                        {r.daysOpen}d open
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageShell>

      <ReportIncidentDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
