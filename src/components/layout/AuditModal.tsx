"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { X, ShieldCheck, Download, CheckCircle2, Loader2, AlertTriangle, FileText, Users, ClipboardList, BookOpen, Building2, MapPin } from "lucide-react";

const YELLOW = "#ffd600";
const RED    = "#f06060";
const GREEN  = "#1a8a4a";

const AVAILABLE_SITES = ["Site 01", "Site 02", "Site 03"] as const;
type SiteName = typeof AVAILABLE_SITES[number];

/* ── Audit data snapshots ────────────────────────────────────────── */

const AUDIT_META = {
  org:          "Spinelli Construction Group",
  abn:          "51 123 456 789",
  industry:     "Construction",
  period:       "1 January 2024 – 22 June 2024",
  generatedAt:  new Date().toLocaleString("en-AU", { dateStyle: "full", timeStyle: "short" }),
  preparedBy:   "J. Spinelli",
  auditType:    "WHS Compliance Audit",
  jurisdiction: "NSW Work Health and Safety Act 2011",
};

const AUDIT_INCIDENTS = [
  { ref: "INC-044", date: "13 Jun 2024", type: "Near Miss",        site: "Site 01", location: "Site 01 — Level 3",  severity: "High",   status: "Under Investigation", icam: "In Progress", assignee: "J. Smith"  },
  { ref: "INC-043", date: "07 Jun 2024", type: "First Aid Injury", site: "Site 02", location: "Site 02 — Laydown",  severity: "Low",    status: "Closed",              icam: "Complete",    assignee: "M. Jones"  },
  { ref: "INC-042", date: "03 Jun 2024", type: "Property Damage",  site: "Site 01", location: "Site 01 — B-Block",  severity: "Medium", status: "Closed",              icam: "Complete",    assignee: "K. Davis"  },
  { ref: "INC-041", date: "28 May 2024", type: "Near Miss",        site: "Site 03", location: "Site 03 — Basement", severity: "Medium", status: "Open",                icam: "Not Started", assignee: "L. Brown"  },
  { ref: "INC-040", date: "21 May 2024", type: "First Aid Injury", site: "Site 02", location: "Site 02 — Level 1",  severity: "Low",    status: "Closed",              icam: "Complete",    assignee: "T. Walsh"  },
  { ref: "INC-039", date: "15 May 2024", type: "Near Miss",        site: "Site 01", location: "Site 01 — Roof",     severity: "High",   status: "Closed",              icam: "Complete",    assignee: "J. Smith"  },
];

const AUDIT_HAZARDS = [
  { ref: "HAZ-094", site: "Site 01", hazard: "Working at heights — scaffold and edges",    type: "Physical",     inherent: "Critical", residual: "Medium", controls: "Perimeter barrier, harness, SWMS-103",   owner: "J. Smith",  reviewed: "01 Jun 2024", overdue: false },
  { ref: "HAZ-093", site: "Site 01", hazard: "Crane slewing into exclusion zone",          type: "Mechanical",   inherent: "Critical", residual: "Medium", controls: "Exclusion barriers, lift plan, spotter",  owner: "M. Jones",  reviewed: "01 Jun 2024", overdue: false },
  { ref: "HAZ-092", site: "Site 02", hazard: "Struck by excavator — blind spots",          type: "Mechanical",   inherent: "Critical", residual: "High",   controls: "Exclusion zone, spotter, hi-vis",         owner: "K. Davis",  reviewed: "15 May 2024", overdue: false },
  { ref: "HAZ-091", site: "Site 01", hazard: "Silica dust inhalation — concrete cutting",  type: "Chemical",     inherent: "High",     residual: "Low",    controls: "Wet cutting, P2 mask, local exhaust",     owner: "T. Walsh",  reviewed: "10 May 2024", overdue: false },
  { ref: "HAZ-090", site: "Site 02", hazard: "Electric shock — live services underground", type: "Physical",     inherent: "Critical", residual: "Medium", controls: "Dial before dig, CAT scan, PTW",          owner: "M. Jones",  reviewed: "05 May 2024", overdue: false },
  { ref: "HAZ-089", site: "Site 01", hazard: "Falls on same level — wet access ways",      type: "Physical",     inherent: "Medium",   residual: "Low",    controls: "Non-slip matting, signage, housekeeping",  owner: "S. Lee",    reviewed: "01 Apr 2024", overdue: false },
  { ref: "HAZ-085", site: "Site 03", hazard: "Fatigue — extended shift workers",           type: "Psychosocial", inherent: "High",     residual: "Medium", controls: "Roster limits, supervisor check, FMP",    owner: "T. Walsh",  reviewed: "01 Nov 2023", overdue: true  },
  { ref: "HAZ-084", site: "Site 01", hazard: "Noise — concrete saw and jackhammer ops",    type: "Physical",     inherent: "High",     residual: "Low",    controls: "Hearing protection, <8h exposure, swap",  owner: "P. Nguyen", reviewed: "01 Oct 2023", overdue: true  },
];

const AUDIT_CRC = [
  { ref: "CRC-021", site: "Site 01", control: "Edge protection — all open edges ≥2m",         result: "Verified", verifiedBy: "J. Smith",  date: "Today 07:00" },
  { ref: "CRC-020", site: "Site 01", control: "Exclusion zone — crane swing radius clear",      result: "Verified", verifiedBy: "M. Jones",  date: "Today 06:45" },
  { ref: "CRC-019", site: "Site 01", control: "Atmospheric test — confined space before entry", result: "Verified", verifiedBy: "K. Davis",  date: "Today 08:00" },
  { ref: "CRC-018", site: "Site 01", control: "Isolation verified — LOTO before work",          result: "Verified", verifiedBy: "T. Walsh",  date: "Today 07:30" },
  { ref: "CRC-017", site: "Site 02", control: "Excavation face support — trench >1.5m",         result: "Partial",  verifiedBy: "S. Lee",    date: "Today 07:15" },
  { ref: "CRC-016", site: "Site 02", control: "Spotter in place — plant in blind-spot zones",   result: "Verified", verifiedBy: "D. Wong",   date: "Today 06:50" },
  { ref: "CRC-015", site: "Site 01", control: "Hot work area clear — 3m combustible-free",      result: "Verified", verifiedBy: "P. Nguyen", date: "Today 09:00" },
  { ref: "CRC-014", site: "Site 01", control: "Chemical containment — spill bund intact",       result: "Failed",   verifiedBy: "J. Park",   date: "Yesterday"   },
  { ref: "CRC-013", site: "Site 03", control: "Permit in place before confined space entry",    result: "Verified", verifiedBy: "M. Chen",   date: "Today 08:05" },
];

const AUDIT_TOOLBOX = [
  { ref: "TBX-240612-008", topic: "Silica Dust",          presenter: "D. Wong",   attendees: 14, site: "Site 01", date: "12 Jun 2024", signed: true  },
  { ref: "TBX-240610-007", topic: "Working at Heights",   presenter: "S. Lee",    attendees: 9,  site: "Site 02", date: "10 Jun 2024", signed: true  },
  { ref: "TBX-240607-006", topic: "Manual Handling",      presenter: "P. Nguyen", attendees: 11, site: "Site 01", date: "07 Jun 2024", signed: true  },
  { ref: "TBX-240605-005", topic: "Emergency Procedures", presenter: "S. Lee",    attendees: 12, site: "Site 03", date: "05 Jun 2024", signed: false },
  { ref: "TBX-240603-004", topic: "Housekeeping",         presenter: "M. Jones",  attendees: 7,  site: "Site 02", date: "03 Jun 2024", signed: true  },
];

/* Licences and Compliance are org-wide (not site-scoped) */
const AUDIT_LICENCES = [
  { name: "J. Smith",  licence: "Construction Induction (White Card)", no: "WC-110342", expires: "N/A",         status: "Current" },
  { name: "M. Jones",  licence: "Rigging — Intermediate",              no: "RI-220891", expires: "30 Jun 2024", status: "Current" },
  { name: "K. Davis",  licence: "Dogging",                             no: "DG-334512", expires: "15 Aug 2025", status: "Current" },
  { name: "T. Walsh",  licence: "Scaffolding — Basic",                 no: "SC-118273", expires: "01 Mar 2024", status: "EXPIRED" },
  { name: "D. Wong",   licence: "Crane — Tower",                       no: "CR-229981", expires: "20 Sep 2025", status: "Current" },
  { name: "S. Lee",    licence: "First Aid",                           no: "FA-098234", expires: "12 Jan 2026", status: "Current" },
  { name: "P. Nguyen", licence: "Electrical — Grade A",                no: "EL-445672", expires: "N/A",         status: "Current" },
];

const AUDIT_COMPLIANCE = [
  { obligation: "WHS Management Plan",           status: "Current", dueDate: "Annual — Jun 2025", evidence: "WHSMP-2024 v3.2" },
  { obligation: "Emergency Response Plan",       status: "Current", dueDate: "Annual — Nov 2024", evidence: "ERP-Site01/02/03-2024" },
  { obligation: "Safe Work Method Statements",   status: "Current", dueDate: "Per activity",      evidence: "14 active SWMS on file" },
  { obligation: "Principal Contractor Duties",   status: "Current", dueDate: "Ongoing",           evidence: "Site-specific WHS plans" },
  { obligation: "Notifiable Incident Reporting", status: "Current", dueDate: "24h of incident",   evidence: "SafeWork NSW — no notifiable incidents this period" },
  { obligation: "Psychosocial Risk Register",    status: "Due",     dueDate: "30 Jun 2024",       evidence: "Draft — review in progress" },
  { obligation: "Worker Consultation Records",   status: "Current", dueDate: "Ongoing",           evidence: "Toolbox talk records on file" },
];

/* ── Build steps ─────────────────────────────────────────────────── */
const BUILD_STEPS = [
  { icon: ClipboardList, label: "Consolidating incident register"              },
  { icon: AlertTriangle, label: "Extracting hazard register & controls"        },
  { icon: ShieldCheck,   label: "Compiling critical risk control verifications"},
  { icon: FileText,      label: "Pulling toolbox talk & sign-off records"      },
  { icon: Users,         label: "Checking worker licences & credentials"       },
  { icon: BookOpen,      label: "Reviewing compliance obligations"             },
  { icon: Building2,     label: "Packaging audit pack"                         },
];

/* ── HTML generator ──────────────────────────────────────────────── */
function generateAuditHTML(selectedSites: Set<SiteName>): string {
  const allSites = selectedSites.size === AVAILABLE_SITES.length;
  const siteLabel = allSites ? "All Sites" : [...selectedSites].join(", ");

  const inSites = (site: string) => selectedSites.has(site as SiteName);

  const incidents  = AUDIT_INCIDENTS.filter(r => inSites(r.site));
  const hazards    = AUDIT_HAZARDS.filter(r => inSites(r.site));
  const crc        = AUDIT_CRC.filter(r => inSites(r.site));
  const toolbox    = AUDIT_TOOLBOX.filter(r => inSites(r.site));

  const sev = (s: string) =>
    s === "Critical" || s === "Failed"  || s === "EXPIRED" ? `color:${RED};font-weight:700`   :
    s === "High"     || s === "Partial" || s === "Due"     ? `color:#b8860b;font-weight:700`   :
    s === "Current"  || s === "Verified"|| s === "Low"     ? `color:${GREEN};font-weight:600`  :
    "color:#555";

  const row = (cells: string[]) => `<tr>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`;

  /* Dynamic flagged items based on selected sites */
  const flagged: string[] = [];
  if (crc.some(r => r.result === "Failed"))
    flagged.push("CRC-014 — Chemical containment control <strong>FAILED</strong> verification (yesterday)");
  if (crc.some(r => r.result === "Partial"))
    flagged.push("CRC-017 — Excavation face support <strong>PARTIAL</strong> — engineer review pending");
  if (hazards.some(r => r.ref === "HAZ-085"))
    flagged.push("HAZ-085 — Fatigue psychosocial risk review <strong>OVERDUE</strong> since Nov 2023");
  if (hazards.some(r => r.ref === "HAZ-084"))
    flagged.push("HAZ-084 — Noise hazard review <strong>OVERDUE</strong> since Oct 2023");
  flagged.push("T. Walsh — Scaffolding licence <strong>EXPIRED</strong> 01 Mar 2024");
  if (toolbox.some(r => !r.signed))
    flagged.push("TBX-240605-005 — Emergency Procedures toolbox talk <strong>PENDING SIGN-OFF</strong>");
  flagged.push("Psychosocial Risk Register — compliance obligation <strong>DUE</strong> 30 Jun 2024");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Audit Pack — ${AUDIT_META.org}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #1a1a1a; background: #fff; }
  .cover { background: #0a0a0a; color: #fff; padding: 60px 48px; min-height: 220px; position: relative; }
  .cover h1 { font-size: 28px; font-weight: 800; letter-spacing: -0.04em; margin-bottom: 4px; }
  .cover .accent { color: ${YELLOW}; }
  .cover p { color: rgba(255,255,255,0.6); font-size: 13px; margin-top: 6px; }
  .cover .meta { margin-top: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px 32px; }
  .cover .meta dt { color: rgba(255,255,255,0.4); font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
  .cover .meta dd { color: #fff; font-size: 12px; font-weight: 600; margin-top: 2px; }
  .stamp { position: absolute; top: 48px; right: 48px; border: 2px solid ${YELLOW}; color: ${YELLOW}; font-size: 10px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 14px; }
  .alerts { background: #fff8e1; border-left: 4px solid ${YELLOW}; padding: 14px 20px; margin: 24px 40px 0; }
  .alerts h3 { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: #7a6000; margin-bottom: 8px; }
  .alert-item { font-size: 12px; color: #5a4600; margin-bottom: 4px; padding-left: 12px; border-left: 2px solid #f0b020; }
  section { padding: 32px 40px; border-bottom: 1px solid #ececec; }
  section:last-child { border-bottom: none; }
  h2 { font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.07em; color: #0a0a0a; border-bottom: 2px solid ${YELLOW}; padding-bottom: 6px; margin-bottom: 16px; }
  h2 span { color: rgba(0,0,0,0.35); font-weight: 600; font-size: 11px; margin-left: 6px; text-transform: none; letter-spacing: 0; }
  table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  th { background: #f4f4f4; font-weight: 700; text-align: left; padding: 7px 10px; border-bottom: 2px solid #e0e0e0; font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.05em; color: #555; }
  td { padding: 7px 10px; border-bottom: 1px solid #f0f0f0; vertical-align: top; line-height: 1.5; }
  tr:last-child td { border-bottom: none; }
  tr:nth-child(even) { background: #fafafa; }
  .footer { padding: 24px 40px; background: #f9f9f9; font-size: 10.5px; color: #888; text-align: center; border-top: 1px solid #e8e8e8; }
  .footer strong { color: #333; }
  @media print { body { font-size: 11px; } }
</style>
</head>
<body>

<div class="cover">
  <div class="stamp">Confidential</div>
  <h1><span class="accent">Briesa</span> Audit Pack</h1>
  <p>${AUDIT_META.auditType} — ${AUDIT_META.jurisdiction}</p>
  <dl class="meta">
    <div><dt>Organisation</dt><dd>${AUDIT_META.org}</dd></div>
    <div><dt>ABN</dt><dd>${AUDIT_META.abn}</dd></div>
    <div><dt>Industry</dt><dd>${AUDIT_META.industry}</dd></div>
    <div><dt>Sites Covered</dt><dd>${siteLabel}</dd></div>
    <div><dt>Audit Period</dt><dd>${AUDIT_META.period}</dd></div>
    <div><dt>Generated</dt><dd>${AUDIT_META.generatedAt}</dd></div>
    <div><dt>Prepared By</dt><dd>${AUDIT_META.preparedBy}</dd></div>
  </dl>
</div>

${flagged.length > 0 ? `
<div class="alerts">
  <h3>${flagged.length} item${flagged.length !== 1 ? "s" : ""} requiring auditor attention</h3>
  ${flagged.map(f => `<div class="alert-item">&#9679; ${f}</div>`).join("\n  ")}
</div>` : ""}

<section>
  <h2>1. Incident Register <span>${incidents.length} records · ${siteLabel}</span></h2>
  <table>
    <tr><th>Ref</th><th>Date</th><th>Type</th><th>Location</th><th>Severity</th><th>Status</th><th>ICAM</th><th>Assignee</th></tr>
    ${incidents.map(r => row([r.ref, r.date, r.type, r.location, `<span style="${sev(r.severity)}">${r.severity}</span>`, r.status, `<span style="${sev(r.icam)}">${r.icam}</span>`, r.assignee])).join("\n    ")}
  </table>
</section>

<section>
  <h2>2. Hazard Register <span>${hazards.length} records shown · ${siteLabel}</span></h2>
  <table>
    <tr><th>Ref</th><th>Hazard</th><th>Type</th><th>Inherent</th><th>Residual</th><th>Controls</th><th>Owner</th><th>Last Review</th><th>Status</th></tr>
    ${hazards.map(r => row([r.ref, r.hazard, r.type, `<span style="${sev(r.inherent)}">${r.inherent}</span>`, `<span style="${sev(r.residual)}">${r.residual}</span>`, r.controls, r.owner, r.reviewed, r.overdue ? `<span style="color:${RED};font-weight:700">REVIEW OVERDUE</span>` : `<span style="color:${GREEN}">Current</span>`])).join("\n    ")}
  </table>
</section>

<section>
  <h2>3. Critical Risk Control Verifications <span>Daily log — ${new Date().toLocaleDateString("en-AU")} · ${siteLabel}</span></h2>
  <table>
    <tr><th>Ref</th><th>Control</th><th>Site</th><th>Result</th><th>Verified By</th><th>Verified At</th></tr>
    ${crc.map(r => row([r.ref, r.control, r.site, `<span style="${sev(r.result)}">${r.result}</span>`, r.verifiedBy, r.date])).join("\n    ")}
  </table>
</section>

<section>
  <h2>4. Toolbox Talk Records <span>${toolbox.length} sessions · ${siteLabel}</span></h2>
  <table>
    <tr><th>Ref</th><th>Topic</th><th>Presenter</th><th>Attendees</th><th>Site</th><th>Date</th><th>Sign-Off</th></tr>
    ${toolbox.map(r => row([r.ref, r.topic, r.presenter, String(r.attendees), r.site, r.date, r.signed ? `<span style="color:${GREEN};font-weight:600">Signed Off</span>` : `<span style="color:#b8860b;font-weight:700">PENDING</span>`])).join("\n    ")}
  </table>
</section>

<section>
  <h2>5. Worker Licences & Credentials <span>${AUDIT_LICENCES.length} records · organisation-wide</span></h2>
  <table>
    <tr><th>Worker</th><th>Licence / Credential</th><th>Licence No.</th><th>Expires</th><th>Status</th></tr>
    ${AUDIT_LICENCES.map(r => row([r.name, r.licence, r.no, r.expires, `<span style="${sev(r.status)}">${r.status}</span>`])).join("\n    ")}
  </table>
</section>

<section>
  <h2>6. Compliance Obligations <span>${AUDIT_COMPLIANCE.length} obligations · organisation-wide</span></h2>
  <table>
    <tr><th>Obligation</th><th>Status</th><th>Due / Frequency</th><th>Evidence on File</th></tr>
    ${AUDIT_COMPLIANCE.map(r => row([r.obligation, `<span style="${sev(r.status)}">${r.status}</span>`, r.dueDate, r.evidence])).join("\n    ")}
  </table>
</section>

<div class="footer">
  <strong>Briesa WHS Platform</strong> — Audit pack generated ${AUDIT_META.generatedAt} by ${AUDIT_META.preparedBy} · Sites: ${siteLabel}<br>
  This document is confidential and intended solely for the named auditor. Records reflect system state at the time of generation.
</div>

</body>
</html>`;
}

/* ── Modal ───────────────────────────────────────────────────────── */
interface Props { open: boolean; onClose: () => void; }
type Phase = "confirm" | "building" | "ready";

export function AuditModal({ open, onClose }: Props) {
  const [phase, setPhase]               = useState<Phase>("confirm");
  const [stepIdx, setStepIdx]           = useState(0);
  const [selectedSites, setSelectedSites] = useState<Set<SiteName>>(new Set(AVAILABLE_SITES));

  const allSelected = selectedSites.size === AVAILABLE_SITES.length;

  useEffect(() => {
    if (!open) { setPhase("confirm"); setStepIdx(0); setSelectedSites(new Set(AVAILABLE_SITES)); }
  }, [open]);

  useEffect(() => {
    if (phase !== "building") return;
    if (stepIdx < BUILD_STEPS.length) {
      const t = setTimeout(() => setStepIdx(i => i + 1), 320 + Math.random() * 180);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("ready"), 400);
      return () => clearTimeout(t);
    }
  }, [phase, stepIdx]);

  function toggleSite(site: SiteName) {
    setSelectedSites(prev => {
      const next = new Set(prev);
      next.has(site) ? next.delete(site) : next.add(site);
      return next;
    });
  }

  function toggleAll() {
    setSelectedSites(allSelected ? new Set() : new Set(AVAILABLE_SITES));
  }

  function startBuild() {
    if (selectedSites.size === 0) return;
    setPhase("building");
    setStepIdx(0);
  }

  function download() {
    const html = generateAuditHTML(selectedSites);
    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    const siteSuffix = allSelected ? "AllSites" : [...selectedSites].join("-").replace(/ /g, "");
    a.href     = url;
    a.download = `Briesa_AuditPack_${siteSuffix}_${new Date().toISOString().slice(0,10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* Derived filtered counts for the ready screen */
  const filteredIncidents = AUDIT_INCIDENTS.filter(r => selectedSites.has(r.site as SiteName));
  const filteredHazards   = AUDIT_HAZARDS.filter(r => selectedSites.has(r.site as SiteName));
  const filteredCRC       = AUDIT_CRC.filter(r => selectedSites.has(r.site as SiteName));
  const filteredToolbox   = AUDIT_TOOLBOX.filter(r => selectedSites.has(r.site as SiteName));
  const flaggedCount      =
    (filteredCRC.some(r => r.result === "Failed") ? 1 : 0) +
    (filteredCRC.some(r => r.result === "Partial") ? 1 : 0) +
    (filteredHazards.some(r => r.ref === "HAZ-085") ? 1 : 0) +
    (filteredHazards.some(r => r.ref === "HAZ-084") ? 1 : 0) +
    1 + /* licence always org-wide */
    (filteredToolbox.some(r => !r.signed) ? 1 : 0) +
    1; /* compliance obligation always org-wide */

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <div
        className="relative flex flex-col border"
        style={{ background: "var(--b-bg)", borderColor: "var(--b-border-strong)", width: 540, maxHeight: "90vh", overflow: "hidden" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b flex-shrink-0" style={{ borderColor: "var(--b-border)" }}>
          <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: YELLOW }} />
          <span className="text-[13px] font-[700]" style={{ color: "var(--b-text)" }}>Audit Mode</span>
          {phase === "confirm" && selectedSites.size > 0 && (
            <span className="text-[11px] px-2 py-0.5 font-[600]" style={{ background: "rgba(255,214,0,0.12)", color: YELLOW }}>
              {allSelected ? "All Sites" : [...selectedSites].join(", ")}
            </span>
          )}
          <button onClick={onClose} className="ml-auto p-1" style={{ color: "var(--b-text-muted)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {/* ── CONFIRM ── */}
          {phase === "confirm" && (
            <>
              {/* Notice */}
              <div className="flex items-start gap-3 px-4 py-3 mb-5 border-l-2" style={{ borderLeftColor: YELLOW, background: "rgba(255,214,0,0.06)" }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: YELLOW }} />
                <div>
                  <p className="text-[12.5px] font-[700]" style={{ color: "var(--b-text)" }}>An audit is being prepared</p>
                  <p className="text-[11.5px] mt-0.5 leading-relaxed" style={{ color: "var(--b-text-muted)" }}>
                    Select the sites to include, then generate a consolidated WHS audit pack covering incidents, hazards, CRC verifications, toolbox talks, worker credentials and compliance obligations.
                  </p>
                </div>
              </div>

              {/* ── SITE SELECTION ── */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[11px] font-[700] tracking-[0.06em] uppercase" style={{ color: "var(--b-text-muted)" }}>
                    <MapPin className="inline w-3 h-3 mr-1" />Sites to include
                  </p>
                  <button
                    onClick={toggleAll}
                    className="text-[11px] font-[600] px-2 py-0.5 border transition-colors"
                    style={{ borderColor: allSelected ? YELLOW : "var(--b-border-strong)", color: allSelected ? YELLOW : "var(--b-text-muted)", background: allSelected ? "rgba(255,214,0,0.08)" : "transparent" }}
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {AVAILABLE_SITES.map(site => {
                    const active = selectedSites.has(site);
                    return (
                      <button
                        key={site}
                        onClick={() => toggleSite(site)}
                        className="flex items-center gap-2 px-3 py-2.5 border text-left transition-all"
                        style={{
                          borderColor: active ? YELLOW : "var(--b-border)",
                          background:  active ? "rgba(255,214,0,0.08)" : "var(--b-bg-secondary)",
                        }}
                      >
                        {/* Checkbox indicator */}
                        <div
                          className="w-3.5 h-3.5 flex-shrink-0 border flex items-center justify-center"
                          style={{ borderColor: active ? YELLOW : "var(--b-border-strong)", background: active ? YELLOW : "transparent" }}
                        >
                          {active && <svg viewBox="0 0 10 8" width="8" height="6" fill="none"><path d="M1 4l3 3 5-6" stroke="#0a0a0a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span className="text-[12px] font-[600]" style={{ color: active ? "var(--b-text)" : "var(--b-text-muted)" }}>{site}</span>
                      </button>
                    );
                  })}
                </div>
                {selectedSites.size === 0 && (
                  <p className="text-[11px] mt-2" style={{ color: RED }}>Select at least one site to continue.</p>
                )}
              </div>

              {/* What's included */}
              <p className="text-[11px] font-[700] tracking-[0.06em] uppercase mb-2" style={{ color: "var(--b-text-muted)" }}>Included in this pack</p>
              <div className="space-y-1 mb-5">
                {([
                  { Icon: ClipboardList, label: `Incident register — ${selectedSites.size > 0 ? filteredIncidents.length : "–"} records for selected sites` },
                  { Icon: AlertTriangle, label: `Hazard register — ${selectedSites.size > 0 ? filteredHazards.length : "–"} entries for selected sites` },
                  { Icon: ShieldCheck,   label: `Critical risk control verifications — ${selectedSites.size > 0 ? filteredCRC.length : "–"} checks` },
                  { Icon: FileText,      label: `Toolbox talks — ${selectedSites.size > 0 ? filteredToolbox.length : "–"} sessions for selected sites` },
                  { Icon: Users,         label: "Worker licences & credentials (organisation-wide)" },
                  { Icon: BookOpen,      label: "Compliance obligations (organisation-wide)" },
                ] as { Icon: React.ElementType; label: string }[]).map(({ Icon, label }, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: YELLOW }} />
                    <span className="text-[12px]" style={{ color: "var(--b-text-secondary)" }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Flagged items preview */}
              {selectedSites.size > 0 && (
                <div className="border px-4 py-3 mb-5" style={{ borderColor: "rgba(240,96,96,0.25)", background: "rgba(240,96,96,0.04)" }}>
                  <p className="text-[11px] font-[700] tracking-[0.06em] uppercase mb-2" style={{ color: RED }}>
                    {flaggedCount} item{flaggedCount !== 1 ? "s" : ""} flagged for auditor attention
                  </p>
                  {[
                    filteredCRC.some(r => r.result === "Failed") && "CRC-014 Failed control — chemical containment bund breach",
                    filteredCRC.some(r => r.result === "Partial") && "CRC-017 Partial — excavation face support, engineer review pending",
                    filteredHazards.some(r => r.ref === "HAZ-085") && "HAZ-085 Review overdue — fatigue / psychosocial (Nov 2023)",
                    filteredHazards.some(r => r.ref === "HAZ-084") && "HAZ-084 Review overdue — noise, concrete saw (Oct 2023)",
                    "T. Walsh — Scaffolding licence expired 01 Mar 2024",
                    filteredToolbox.some(r => !r.signed) && "TBX-240605-005 — Emergency Procedures sign-off pending",
                    "Psychosocial Risk Register — compliance obligation due 30 Jun 2024",
                  ].filter(Boolean).map((item, i) => (
                    <p key={i} className="text-[11.5px] leading-relaxed" style={{ color: "var(--b-text-muted)" }}>
                      <span style={{ color: RED }}>· </span>{item as string}
                    </p>
                  ))}
                </div>
              )}

              <button
                onClick={startBuild}
                disabled={selectedSites.size === 0}
                className="w-full h-10 text-[13px] font-[700] flex items-center justify-center gap-2 transition-colors"
                style={{ background: selectedSites.size === 0 ? "var(--b-bg-active)" : YELLOW, color: selectedSites.size === 0 ? "var(--b-text-muted)" : "#0a0a0a", cursor: selectedSites.size === 0 ? "not-allowed" : "pointer" }}
                onMouseOver={e => { if (selectedSites.size > 0) (e.currentTarget as HTMLElement).style.background = "#ffe033"; }}
                onMouseOut={e => { if (selectedSites.size > 0) (e.currentTarget as HTMLElement).style.background = YELLOW; }}
              >
                <ShieldCheck className="w-4 h-4" />
                Generate Audit Pack{selectedSites.size > 0 && !allSelected ? ` — ${[...selectedSites].join(", ")}` : ""}
              </button>
            </>
          )}

          {/* ── BUILDING ── */}
          {phase === "building" && (
            <div className="py-4">
              <p className="text-[12.5px] font-[700] mb-1 text-center" style={{ color: "var(--b-text)" }}>Consolidating records…</p>
              <p className="text-[11px] mb-4 text-center" style={{ color: "var(--b-text-muted)" }}>
                {allSelected ? "All Sites" : [...selectedSites].join(", ")}
              </p>
              <div className="space-y-2">
                {BUILD_STEPS.map((step, i) => {
                  const Icon    = step.icon;
                  const done    = i < stepIdx;
                  const active  = i === stepIdx;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5 border transition-all"
                      style={{
                        borderColor: done ? "rgba(26,138,74,0.3)" : active ? "rgba(255,214,0,0.35)" : "var(--b-border)",
                        background:  done ? "rgba(26,138,74,0.05)" : active ? "rgba(255,214,0,0.06)" : "var(--b-bg-secondary)",
                      }}
                    >
                      {done   ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GREEN }} />
                      : active ? <Loader2     className="w-3.5 h-3.5 flex-shrink-0 animate-spin" style={{ color: YELLOW }} />
                      :          <Icon        className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />}
                      <span className="text-[12px]" style={{ color: done ? "var(--b-badge-green-text)" : active ? "var(--b-text)" : "var(--b-text-muted)" }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── READY ── */}
          {phase === "ready" && (
            <div className="py-2">
              <div className="flex flex-col items-center py-6 mb-5">
                <div className="w-12 h-12 flex items-center justify-center border-2 mb-3" style={{ borderColor: YELLOW, background: "rgba(255,214,0,0.1)" }}>
                  <ShieldCheck className="w-6 h-6" style={{ color: YELLOW }} />
                </div>
                <p className="text-[14px] font-[700]" style={{ color: "var(--b-text)" }}>Audit pack ready</p>
                <p className="text-[12px] mt-1 text-center" style={{ color: "var(--b-text-muted)" }}>
                  {allSelected ? "All Sites" : [...selectedSites].join(", ")} · {flaggedCount} items flagged for auditor attention
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: "Incidents",     value: String(filteredIncidents.length) },
                  { label: "Hazards",       value: String(filteredHazards.length)   },
                  { label: "CRC Checks",    value: String(filteredCRC.length)        },
                  { label: "Toolbox Talks", value: String(filteredToolbox.length)    },
                  { label: "Licences",      value: String(AUDIT_LICENCES.length)     },
                  { label: "Obligations",   value: String(AUDIT_COMPLIANCE.length)   },
                ].map(s => (
                  <div key={s.label} className="border px-3 py-2.5 text-center" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
                    <div className="text-[18px] font-[800] leading-none" style={{ color: "var(--b-text)" }}>{s.value}</div>
                    <div className="text-[10.5px] mt-1" style={{ color: "var(--b-text-muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-start gap-2.5 px-3 py-2.5 border mb-4" style={{ borderColor: "rgba(240,96,96,0.25)", background: "rgba(240,96,96,0.04)" }}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: RED }} />
                <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                  <span style={{ color: RED, fontWeight: 700 }}>{flaggedCount} item{flaggedCount !== 1 ? "s" : ""}</span> highlighted in the audit pack — review before presenting to the auditor.
                </p>
              </div>

              <button
                onClick={download}
                className="w-full h-10 text-[13px] font-[700] flex items-center justify-center gap-2 mb-2 transition-colors"
                style={{ background: YELLOW, color: "#0a0a0a" }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "#ffe033"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = YELLOW; }}
              >
                <Download className="w-4 h-4" /> Download Audit Pack (.html)
              </button>
              <p className="text-[10.5px] text-center" style={{ color: "var(--b-text-muted)" }}>
                Opens in any browser · print to PDF for the auditor
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
