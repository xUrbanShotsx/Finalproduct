"use client";

import { useState } from "react";
import { Plus, AlertTriangle, Clock, CheckCircle2, MapPin, Search, ShieldAlert } from "lucide-react";
import { PageShell, Stat, SeverityBadge, StatusBadge, matchesTab, matchesSite, siteOptionsOf } from "../shared";
import { ReportIncidentDrawer } from "./ReportIncidentDrawer";
import { IcamInvestigationDrawer, type IncidentRow } from "./IcamInvestigationDrawer";
import { RaiseRiskDrawer, type RaiseRiskSource } from "../risk/RaiseRiskDrawer";

const RECORDS: IncidentRow[] = [
  { ref: "INC-044", date: "13 Jun 2024", time: "09:14", type: "Near Miss",        location: "Site 01 — Level 3",  severity: "High"   as const, status: "Under Investigation" as const, assignee: "J. Smith",  daysOpen: 3,    icamStatus: "In Progress" },
  { ref: "INC-043", date: "07 Jun 2024", time: "13:42", type: "First Aid Injury", location: "Site 02 — Laydown",  severity: "Low"    as const, status: "Closed"               as const, assignee: "M. Jones",  daysOpen: null, icamStatus: "Complete" },
  { ref: "INC-042", date: "03 Jun 2024", time: "11:05", type: "Property Damage",  location: "Site 01 — B-Block",  severity: "Medium" as const, status: "Closed"               as const, assignee: "K. Davis",  daysOpen: null, icamStatus: "Complete" },
  { ref: "INC-041", date: "28 May 2024", time: "07:55", type: "Near Miss",        location: "Site 03 — Basement", severity: "Medium" as const, status: "Open"                 as const, assignee: "L. Brown",  daysOpen: 16,   icamStatus: "Not Started" },
  { ref: "INC-040", date: "21 May 2024", time: "15:30", type: "First Aid Injury", location: "Site 02 — Level 1",  severity: "Low"    as const, status: "Closed"               as const, assignee: "T. Walsh",  daysOpen: null, icamStatus: "Complete" },
  { ref: "INC-039", date: "15 May 2024", time: "08:20", type: "Near Miss",        location: "Site 01 — Roof",     severity: "High"   as const, status: "Closed"               as const, assignee: "J. Smith",  daysOpen: null, icamStatus: "Complete" },
];

const SEV_BORDER: Record<string, string> = {
  Critical: "#f06060", High: "#f06060", Medium: "var(--b-badge-yellow-text)", Low: "var(--b-badge-green-text)",
};
const SEV_BG: Record<string, string> = {
  Critical: "rgba(240,96,96,0.05)", High: "rgba(240,96,96,0.04)", Medium: "rgba(255,200,0,0.04)", Low: "rgba(60,180,100,0.04)",
};

const ICAM_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  "Complete":    { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)",  label: "ICAM ✓" },
  "In Progress": { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)", label: "ICAM ⏳" },
  "Not Started": { bg: "var(--b-bg-active)",        color: "var(--b-text-muted)",        label: "ICAM" },
};

function StatusIcon({ status }: { status: string }) {
  if (status === "Closed") return <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--b-badge-green-text)" }} />;
  if (status === "Under Investigation") return <Clock className="w-3.5 h-3.5" style={{ color: "var(--b-badge-yellow-text)" }} />;
  return <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#f06060" }} />;
}

export function IncidentsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [investigationOpen, setInvestigationOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentRow | null>(null);
  const [rows, setRows] = useState(RECORDS);
  const [tab, setTab] = useState("");
  const [site, setSite] = useState("");
  const [raiseRiskSource, setRaiseRiskSource] = useState<RaiseRiskSource | null>(null);
  const [raisedRisks, setRaisedRisks] = useState<Set<string>>(new Set());

  function openInvestigation(r: IncidentRow) {
    setSelectedIncident(r);
    setInvestigationOpen(true);
  }

  function openRaiseRisk(e: React.MouseEvent, r: IncidentRow) {
    e.stopPropagation();
    setRaiseRiskSource({
      sourceRef:   `Incident ${r.ref}`,
      title:       `${r.type} — ${r.location}`,
      location:    r.location,
      site:        r.location.split(" — ")[0] ?? "Site 01",
      riskLevel:   r.severity === "Critical" || r.severity === "High" ? "High" : "Medium",
      sourceRoute: "/safety/incidents",
    });
  }

  return (
    <>
      <PageShell
        back={{ href: "/safety", label: "Safety" }}
        title="Incidents"
        description="Report, investigate and close out incidents, near misses and injuries."
        cta="Report Incident"
        ctaSlot={
          <button
            onClick={() => setDrawerOpen(true)}
            className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Report Incident
          </button>
        }
        stats={
          <>
            <Stat label="Open"                value="2"   sub="1 high severity"         highlight="red"    />
            <Stat label="Under Investigation" value="1"   sub="ICAM in progress · day 3" highlight="yellow" />
            <Stat label="ICAM Complete"       value="4"   sub="this period"              highlight="green"  />
            <Stat label="YTD TRIFR"           value="1.2" sub="target: <2.0"                               />
          </>
        }
        tabs={["All", "Open", "Under Investigation", "Closed", "Notifiable"]}
        onTabChange={setTab}
        siteOptions={siteOptionsOf(rows as unknown[])}
        onSiteChange={setSite}
      >
        {/* Method callout */}
        <div
          className="mx-1 mb-3 px-3 py-2.5 flex items-center gap-2.5 border text-[11.5px]"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}
        >
          <Search className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-accent-text)" }} />
          <span style={{ color: "var(--b-text-muted)" }}>
            All investigations follow{" "}
            <span className="font-semibold" style={{ color: "var(--b-text)" }}>ICAM</span>
            {" "}(Incident Cause Analysis Method) +{" "}
            <span className="font-semibold" style={{ color: "var(--b-text)" }}>TapRooT®</span>
            {" "}root cause analysis. Click any incident to open its investigation workflow.
          </span>
        </div>

        <div className="space-y-2 p-1">
          {rows.filter(r => matchesTab(tab, r as unknown as Record<string, unknown>) && matchesSite(site, r as unknown as Record<string, unknown>)).map((r) => {
            const icam = ICAM_STYLE[r.icamStatus ?? "Not Started"];
            return (
              <div
                key={r.ref}
                className="flex items-stretch border cursor-pointer transition-colors"
                style={{ borderColor: "var(--b-border)", background: SEV_BG[r.severity] }}
                onClick={() => openInvestigation(r)}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border-hover)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"}
              >
                {/* Severity stripe */}
                <div className="w-1 flex-shrink-0" style={{ background: SEV_BORDER[r.severity] }} />

                <div className="flex-1 px-4 py-3">
                  <div className="flex items-start justify-between gap-4">
                    {/* Left: ref + type + location */}
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

                    {/* Right: badges + ICAM status */}
                    <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-end">
                      <SeverityBadge v={r.severity} />
                      <div className="flex items-center gap-1.5">
                        <StatusIcon status={r.status} />
                        <span
                          className="text-[12px]"
                          style={{ color: r.status === "Closed" ? "var(--b-text-muted)" : "var(--b-text-secondary)" }}
                        >
                          {r.status}
                        </span>
                      </div>
                      {/* ICAM badge */}
                      <span
                        className="text-[10.5px] font-semibold px-2 py-0.5"
                        style={{ background: icam.bg, color: icam.color }}
                      >
                        {icam.label}
                      </span>
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
                      {/* Raise to Risk — High/Critical only */}
                      {(r.severity === "High" || r.severity === "Critical") && (
                        raisedRisks.has(r.ref) ? (
                          <span className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5" style={{ background: "rgba(240,96,96,0.08)", color: "#f06060" }}>
                            <ShieldAlert className="w-3 h-3" /> Risk Logged
                          </span>
                        ) : (
                          <button
                            onClick={e => openRaiseRisk(e, r)}
                            className="flex items-center gap-1 text-[10.5px] font-semibold px-2 py-0.5 border transition-colors"
                            style={{ borderColor: "rgba(240,96,96,0.3)", color: "#f06060", background: "rgba(240,96,96,0.05)" }}
                            onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "rgba(240,96,96,0.12)"; }}
                            onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "rgba(240,96,96,0.05)"; }}
                          >
                            <ShieldAlert className="w-3 h-3" /> → Risk Register
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PageShell>

      <ReportIncidentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdd={(form) => setRows(prev => [{
          ref: `INC-${45 + prev.length}`,
          date: form.date || new Date().toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" }),
          time: form.time || new Date().toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", hour12: false }),
          type: form.incidentType || "Near Miss",
          location: [form.site, form.specificLocation].filter(Boolean).join(" — ") || "Site 01",
          severity: (["Critical","High","Medium","Low"].includes(form.severity) ? form.severity : "Medium") as "Critical" | "High" | "Medium" | "Low",
          status: "Open" as const,
          assignee: form.assignee || "Unassigned",
          daysOpen: 0,
          icamStatus: "Not Started" as const,
        }, ...prev])}
      />

      <IcamInvestigationDrawer
        key={selectedIncident?.ref}
        open={investigationOpen}
        onClose={() => setInvestigationOpen(false)}
        incident={selectedIncident}
      />

      <RaiseRiskDrawer
        open={raiseRiskSource !== null}
        onClose={() => setRaiseRiskSource(null)}
        source={raiseRiskSource}
        onSaved={(ref) => {
          if (raiseRiskSource) {
            const incRef = raiseRiskSource.sourceRef.replace("Incident ", "");
            setRaisedRisks(prev => new Set([...prev, incRef]));
          }
          setRaiseRiskSource(null);
        }}
      />
    </>
  );
}
