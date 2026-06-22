"use client";

import { useState, useEffect } from "react";
import type React from "react";
import { X, ShieldCheck, Download, CheckCircle2, Loader2, AlertTriangle, FileText, Users, ClipboardList, BookOpen, Building2 } from "lucide-react";

const YELLOW = "#ffd600";
const RED = "#f06060";
const GREEN = "#1a8a4a";

/* ── Audit data snapshots (mirrors live module data) ─────────────── */

const AUDIT_META = {
  org:        "Spinelli Construction Group",
  abn:        "51 123 456 789",
  industry:   "Construction",
  period:     "1 January 2024 – 22 June 2024",
  generatedAt: new Date().toLocaleString("en-AU", { dateStyle: "full", timeStyle: "short" }),
  preparedBy: "J. Spinelli",
  auditType:  "WHS Compliance Audit",
  jurisdiction: "NSW Work Health and Safety Act 2011",
};

const AUDIT_INCIDENTS = [
  { ref: "INC-044", date: "13 Jun 2024", type: "Near Miss",        location: "Site 01 — Level 3",  severity: "High",   status: "Under Investigation", icam: "In Progress",  assignee: "J. Smith" },
  { ref: "INC-043", date: "07 Jun 2024", type: "First Aid Injury", location: "Site 02 — Laydown",  severity: "Low",    status: "Closed",              icam: "Complete",     assignee: "M. Jones" },
  { ref: "INC-042", date: "03 Jun 2024", type: "Property Damage",  location: "Site 01 — B-Block",  severity: "Medium", status: "Closed",              icam: "Complete",     assignee: "K. Davis" },
  { ref: "INC-041", date: "28 May 2024", type: "Near Miss",        location: "Site 03 — Basement", severity: "Medium", status: "Open",                icam: "Not Started",  assignee: "L. Brown" },
  { ref: "INC-040", date: "21 May 2024", type: "First Aid Injury", location: "Site 02 — Level 1",  severity: "Low",    status: "Closed",              icam: "Complete",     assignee: "T. Walsh" },
  { ref: "INC-039", date: "15 May 2024", type: "Near Miss",        location: "Site 01 — Roof",     severity: "High",   status: "Closed",              icam: "Complete",     assignee: "J. Smith" },
];

const AUDIT_HAZARDS = [
  { ref: "HAZ-094", hazard: "Working at heights — scaffold and edges",    type: "Physical",     inherent: "Critical", residual: "Medium", controls: "Perimeter barrier, harness, SWMS-103",   owner: "J. Smith",  reviewed: "01 Jun 2024", overdue: false },
  { ref: "HAZ-093", hazard: "Crane slewing into exclusion zone",          type: "Mechanical",   inherent: "Critical", residual: "Medium", controls: "Exclusion barriers, lift plan, spotter",  owner: "M. Jones",  reviewed: "01 Jun 2024", overdue: false },
  { ref: "HAZ-092", hazard: "Struck by excavator — blind spots",          type: "Mechanical",   inherent: "Critical", residual: "High",   controls: "Exclusion zone, spotter, hi-vis",         owner: "K. Davis",  reviewed: "15 May 2024", overdue: false },
  { ref: "HAZ-091", hazard: "Silica dust inhalation — concrete cutting",  type: "Chemical",     inherent: "High",     residual: "Low",    controls: "Wet cutting, P2 mask, local exhaust",     owner: "T. Walsh",  reviewed: "10 May 2024", overdue: false },
  { ref: "HAZ-090", hazard: "Electric shock — live services underground", type: "Physical",     inherent: "Critical", residual: "Medium", controls: "Dial before dig, CAT scan, PTW",          owner: "M. Jones",  reviewed: "05 May 2024", overdue: false },
  { ref: "HAZ-085", hazard: "Fatigue — extended shift workers",           type: "Psychosocial", inherent: "High",     residual: "Medium", controls: "Roster limits, supervisor check, FMP",    owner: "T. Walsh",  reviewed: "01 Nov 2023", overdue: true  },
  { ref: "HAZ-084", hazard: "Noise — concrete saw and jackhammer ops",    type: "Physical",     inherent: "High",     residual: "Low",    controls: "Hearing protection, <8h exposure, swap",  owner: "P. Nguyen", reviewed: "01 Oct 2023", overdue: true  },
];

const AUDIT_CRC = [
  { ref: "CRC-021", control: "Edge protection — all open edges ≥2m",          result: "Verified", verifiedBy: "J. Smith",  date: "Today 07:00" },
  { ref: "CRC-020", control: "Exclusion zone — crane swing radius clear",       result: "Verified", verifiedBy: "M. Jones",  date: "Today 06:45" },
  { ref: "CRC-019", control: "Atmospheric test — confined space before entry",  result: "Verified", verifiedBy: "K. Davis",  date: "Today 08:00" },
  { ref: "CRC-018", control: "Isolation verified — LOTO before work",           result: "Verified", verifiedBy: "T. Walsh",  date: "Today 07:30" },
  { ref: "CRC-017", control: "Excavation face support — trench >1.5m",          result: "Partial",  verifiedBy: "S. Lee",    date: "Today 07:15" },
  { ref: "CRC-014", control: "Chemical containment — spill bund intact",        result: "Failed",   verifiedBy: "J. Park",   date: "Yesterday" },
];

const AUDIT_TOOLBOX = [
  { ref: "TBX-240612-008", topic: "Silica Dust",         presenter: "D. Wong",   attendees: 14, site: "Site 01", date: "12 Jun 2024", signed: true },
  { ref: "TBX-240610-007", topic: "Working at Heights",  presenter: "S. Lee",    attendees: 9,  site: "Site 02", date: "10 Jun 2024", signed: true },
  { ref: "TBX-240607-006", topic: "Manual Handling",     presenter: "P. Nguyen", attendees: 11, site: "Site 01", date: "07 Jun 2024", signed: true },
  { ref: "TBX-240605-005", topic: "Emergency Procedures",presenter: "S. Lee",    attendees: 12, site: "Site 03", date: "05 Jun 2024", signed: false },
  { ref: "TBX-240603-004", topic: "Housekeeping",        presenter: "M. Jones",  attendees: 7,  site: "Site 02", date: "03 Jun 2024", signed: true },
];

const AUDIT_LICENCES = [
  { name: "J. Smith",   licence: "Construction Induction (White Card)", no: "WC-110342", expires: "N/A",         status: "Current"  },
  { name: "M. Jones",   licence: "Rigging — Intermediate",               no: "RI-220891", expires: "30 Jun 2024", status: "Current"  },
  { name: "K. Davis",   licence: "Dogging",                              no: "DG-334512", expires: "15 Aug 2025", status: "Current"  },
  { name: "T. Walsh",   licence: "Scaffolding — Basic",                  no: "SC-118273", expires: "01 Mar 2024", status: "EXPIRED"  },
  { name: "D. Wong",    licence: "Crane — Tower",                        no: "CR-229981", expires: "20 Sep 2025", status: "Current"  },
  { name: "S. Lee",     licence: "First Aid",                            no: "FA-098234", expires: "12 Jan 2026", status: "Current"  },
  { name: "P. Nguyen",  licence: "Electrical — Grade A",                  no: "EL-445672", expires: "N/A",         status: "Current"  },
];

const AUDIT_COMPLIANCE = [
  { obligation: "WHS Management Plan",        status: "Current",     dueDate: "Annual — Jun 2025", evidence: "WHSMP-2024 v3.2"            },
  { obligation: "Emergency Response Plan",    status: "Current",     dueDate: "Annual — Nov 2024", evidence: "ERP-Site01/02/03-2024"       },
  { obligation: "Safe Work Method Statements",status: "Current",     dueDate: "Per activity",      evidence: "14 active SWMS on file"      },
  { obligation: "Principal Contractor Duties",status: "Current",     dueDate: "Ongoing",           evidence: "Site-specific WHS plans"     },
  { obligation: "Notifiable Incident Reporting",status:"Current",    dueDate: "24h of incident",   evidence: "SafeWork NSW — no notifiable incidents this period" },
  { obligation: "Psychosocial Risk Register",  status: "Due",        dueDate: "30 Jun 2024",       evidence: "Draft — review in progress"  },
  { obligation: "Worker Consultation Records", status: "Current",    dueDate: "Ongoing",           evidence: "Toolbox talk records on file" },
];

/* ── Build steps shown during generation ──────────────────────────── */
const BUILD_STEPS = [
  { icon: ClipboardList, label: "Consolidating incident register"         },
  { icon: AlertTriangle, label: "Extracting hazard register & controls"   },
  { icon: ShieldCheck,   label: "Compiling critical risk control verifications" },
  { icon: FileText,      label: "Pulling toolbox talk & sign-off records" },
  { icon: Users,         label: "Checking worker licences & credentials"  },
  { icon: BookOpen,      label: "Reviewing compliance obligations"        },
  { icon: Building2,     label: "Packaging audit pack"                    },
];

/* ── HTML report generator ────────────────────────────────────────── */
function generateAuditHTML(): string {
  const sev = (s: string) => s === "Critical" || s === "Failed" || s === "EXPIRED" ? `color:${RED};font-weight:700` : s === "High" || s === "Partial" || s === "Due" ? `color:#b8860b;font-weight:700` : s === "Current" || s === "Verified" || s === "Low" ? `color:${GREEN};font-weight:600` : "color:#555";
  const row = (cells: string[]) => `<tr>${cells.map(c => `<td>${c}</td>`).join("")}</tr>`;

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
  @media print { body { font-size: 11px; } .stamp { border-width: 2px; } }
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
    <div><dt>Audit Period</dt><dd>${AUDIT_META.period}</dd></div>
    <div><dt>Generated</dt><dd>${AUDIT_META.generatedAt}</dd></div>
    <div><dt>Prepared By</dt><dd>${AUDIT_META.preparedBy}</dd></div>
  </dl>
</div>

<div class="alerts">
  <h3>Items requiring auditor attention</h3>
  <div class="alert-item">&#9679; CRC-014 — Chemical containment control <strong>FAILED</strong> verification (yesterday)</div>
  <div class="alert-item">&#9679; CRC-017 — Excavation face support <strong>PARTIAL</strong> — engineer review pending</div>
  <div class="alert-item">&#9679; HAZ-085 — Fatigue psychosocial risk review <strong>OVERDUE</strong> since Nov 2023</div>
  <div class="alert-item">&#9679; HAZ-084 — Noise hazard review <strong>OVERDUE</strong> since Oct 2023</div>
  <div class="alert-item">&#9679; T. Walsh — Scaffolding licence <strong>EXPIRED</strong> 01 Mar 2024</div>
  <div class="alert-item">&#9679; TBX-240605-005 — Emergency Procedures toolbox talk <strong>PENDING SIGN-OFF</strong></div>
  <div class="alert-item">&#9679; Psychosocial Risk Register — compliance obligation <strong>DUE</strong> 30 Jun 2024</div>
</div>

<section>
  <h2>1. Incident Register <span>${AUDIT_INCIDENTS.length} records · period shown</span></h2>
  <table>
    <tr><th>Ref</th><th>Date</th><th>Type</th><th>Location</th><th>Severity</th><th>Status</th><th>ICAM</th><th>Assignee</th></tr>
    ${AUDIT_INCIDENTS.map(r => row([r.ref, r.date, r.type, r.location, `<span style="${sev(r.severity)}">${r.severity}</span>`, r.status, `<span style="${sev(r.icam)}">${r.icam}</span>`, r.assignee])).join("\n    ")}
  </table>
</section>

<section>
  <h2>2. Hazard Register <span>${AUDIT_HAZARDS.length} records shown · 94 total on file</span></h2>
  <table>
    <tr><th>Ref</th><th>Hazard</th><th>Type</th><th>Inherent</th><th>Residual</th><th>Controls</th><th>Owner</th><th>Last Review</th><th>Status</th></tr>
    ${AUDIT_HAZARDS.map(r => row([r.ref, r.hazard, r.type, `<span style="${sev(r.inherent)}">${r.inherent}</span>`, `<span style="${sev(r.residual)}">${r.residual}</span>`, r.controls, r.owner, r.reviewed, r.overdue ? `<span style="color:${RED};font-weight:700">REVIEW OVERDUE</span>` : `<span style="color:${GREEN}">Current</span>`])).join("\n    ")}
  </table>
</section>

<section>
  <h2>3. Critical Risk Control Verifications <span>Daily log — ${new Date().toLocaleDateString("en-AU")}</span></h2>
  <table>
    <tr><th>Ref</th><th>Control</th><th>Result</th><th>Verified By</th><th>Verified At</th></tr>
    ${AUDIT_CRC.map(r => row([r.ref, r.control, `<span style="${sev(r.result)}">${r.result}</span>`, r.verifiedBy, r.date])).join("\n    ")}
  </table>
</section>

<section>
  <h2>4. Toolbox Talk Records <span>${AUDIT_TOOLBOX.length} sessions shown</span></h2>
  <table>
    <tr><th>Ref</th><th>Topic</th><th>Presenter</th><th>Attendees</th><th>Site</th><th>Date</th><th>Sign-Off</th></tr>
    ${AUDIT_TOOLBOX.map(r => row([r.ref, r.topic, r.presenter, String(r.attendees), r.site, r.date, r.signed ? `<span style="color:${GREEN};font-weight:600">Signed Off</span>` : `<span style="color:#b8860b;font-weight:700">PENDING</span>`])).join("\n    ")}
  </table>
</section>

<section>
  <h2>5. Worker Licences & Credentials <span>${AUDIT_LICENCES.length} records</span></h2>
  <table>
    <tr><th>Worker</th><th>Licence / Credential</th><th>Licence No.</th><th>Expires</th><th>Status</th></tr>
    ${AUDIT_LICENCES.map(r => row([r.name, r.licence, r.no, r.expires, `<span style="${sev(r.status)}">${r.status}</span>`])).join("\n    ")}
  </table>
</section>

<section>
  <h2>6. Compliance Obligations <span>${AUDIT_COMPLIANCE.length} obligations tracked</span></h2>
  <table>
    <tr><th>Obligation</th><th>Status</th><th>Due / Frequency</th><th>Evidence on File</th></tr>
    ${AUDIT_COMPLIANCE.map(r => row([r.obligation, `<span style="${sev(r.status)}">${r.status}</span>`, r.dueDate, r.evidence])).join("\n    ")}
  </table>
</section>

<div class="footer">
  <strong>Briesa WHS Platform</strong> — Audit pack generated ${AUDIT_META.generatedAt} by ${AUDIT_META.preparedBy}<br>
  This document is confidential and intended solely for the named auditor. Records reflect system state at the time of generation.
</div>

</body>
</html>`;
}

/* ── Modal component ──────────────────────────────────────────────── */
interface Props {
  open: boolean;
  onClose: () => void;
}

type Phase = "confirm" | "building" | "ready";

export function AuditModal({ open, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>("confirm");
  const [stepIdx, setStepIdx] = useState(0);

  useEffect(() => {
    if (!open) { setPhase("confirm"); setStepIdx(0); }
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

  function startBuild() {
    setPhase("building");
    setStepIdx(0);
  }

  function download() {
    const html = generateAuditHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `Briesa_AuditPack_${new Date().toISOString().slice(0,10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

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
          <button onClick={onClose} className="ml-auto p-1" style={{ color: "var(--b-text-muted)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">

          {/* ── CONFIRM phase ── */}
          {phase === "confirm" && (
            <>
              {/* Audit notice banner */}
              <div className="flex items-start gap-3 px-4 py-3 mb-5 border-l-2" style={{ borderLeftColor: YELLOW, background: "rgba(255,214,0,0.06)" }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: YELLOW }} />
                <div>
                  <p className="text-[12.5px] font-[700]" style={{ color: "var(--b-text)" }}>An audit is being prepared</p>
                  <p className="text-[11.5px] mt-0.5 leading-relaxed" style={{ color: "var(--b-text-muted)" }}>
                    Briesa will consolidate all WHS records into a single audit pack — incidents, hazards, CRC verifications, toolbox talks, worker credentials and compliance obligations.
                  </p>
                </div>
              </div>

              {/* What's included */}
              <p className="text-[11px] font-[700] tracking-[0.06em] uppercase mb-2" style={{ color: "var(--b-text-muted)" }}>Included in this pack</p>
              <div className="space-y-1 mb-5">
                {([
                  { Icon: ClipboardList, label: "Incident register — all records, ICAM status" },
                  { Icon: AlertTriangle, label: "Hazard register — 94 entries with controls" },
                  { Icon: ShieldCheck,   label: "Critical risk control daily verifications" },
                  { Icon: FileText,      label: "Toolbox talk records with attendance & sign-offs" },
                  { Icon: Users,         label: "Worker licences & credentials" },
                  { Icon: BookOpen,      label: "Compliance obligations & evidence on file" },
                ] as { Icon: React.ElementType; label: string }[]).map(({ Icon, label }, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2 border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: YELLOW }} />
                    <span className="text-[12px]" style={{ color: "var(--b-text-secondary)" }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Attention items */}
              <div className="border px-4 py-3 mb-5" style={{ borderColor: "rgba(240,96,96,0.25)", background: "rgba(240,96,96,0.04)" }}>
                <p className="text-[11px] font-[700] tracking-[0.06em] uppercase mb-2" style={{ color: RED }}>7 items flagged for auditor attention</p>
                {["CRC-014 Failed control — chemical containment bund breach",
                  "CRC-017 Partial — excavation face support, engineer review pending",
                  "HAZ-085 Review overdue — fatigue / psychosocial (Nov 2023)",
                  "HAZ-084 Review overdue — noise, concrete saw (Oct 2023)",
                  "T. Walsh — Scaffolding licence expired 01 Mar 2024",
                  "TBX-240605-005 — Emergency Procedures sign-off pending",
                  "Psychosocial Risk Register — compliance obligation due 30 Jun 2024",
                ].map((item, i) => (
                  <p key={i} className="text-[11.5px] leading-relaxed" style={{ color: "var(--b-text-muted)" }}>
                    <span style={{ color: RED }}>· </span>{item}
                  </p>
                ))}
              </div>

              <button
                onClick={startBuild}
                className="w-full h-10 text-[13px] font-[700] flex items-center justify-center gap-2 transition-colors"
                style={{ background: YELLOW, color: "#0a0a0a" }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "#ffe033"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = YELLOW; }}
              >
                <ShieldCheck className="w-4 h-4" /> Generate Audit Pack
              </button>
            </>
          )}

          {/* ── BUILDING phase ── */}
          {phase === "building" && (
            <div className="py-4">
              <p className="text-[12.5px] font-[700] mb-4 text-center" style={{ color: "var(--b-text)" }}>Consolidating records…</p>
              <div className="space-y-2">
                {BUILD_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done    = i < stepIdx;
                  const active  = i === stepIdx;
                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5 border transition-all"
                      style={{
                        borderColor: done ? "rgba(26,138,74,0.3)" : active ? `rgba(255,214,0,0.35)` : "var(--b-border)",
                        background:  done ? "rgba(26,138,74,0.05)" : active ? "rgba(255,214,0,0.06)" : "var(--b-bg-secondary)",
                      }}
                    >
                      {done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GREEN }} />
                      ) : active ? (
                        <Loader2 className="w-3.5 h-3.5 flex-shrink-0 animate-spin" style={{ color: YELLOW }} />
                      ) : (
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
                      )}
                      <span
                        className="text-[12px]"
                        style={{ color: done ? "var(--b-badge-green-text)" : active ? "var(--b-text)" : "var(--b-text-muted)" }}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── READY phase ── */}
          {phase === "ready" && (
            <div className="py-2">
              <div className="flex flex-col items-center py-6 mb-5">
                <div className="w-12 h-12 flex items-center justify-center border-2 mb-3" style={{ borderColor: YELLOW, background: "rgba(255,214,0,0.1)" }}>
                  <ShieldCheck className="w-6 h-6" style={{ color: YELLOW }} />
                </div>
                <p className="text-[14px] font-[700]" style={{ color: "var(--b-text)" }}>Audit pack ready</p>
                <p className="text-[12px] mt-1 text-center" style={{ color: "var(--b-text-muted)" }}>
                  All records consolidated. 7 items flagged for auditor attention.
                </p>
              </div>

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {[
                  { label: "Incidents",     value: String(AUDIT_INCIDENTS.length) },
                  { label: "Hazards",       value: "94" },
                  { label: "CRC Checks",    value: String(AUDIT_CRC.length) },
                  { label: "Toolbox Talks", value: String(AUDIT_TOOLBOX.length) },
                  { label: "Licences",      value: String(AUDIT_LICENCES.length) },
                  { label: "Obligations",   value: String(AUDIT_COMPLIANCE.length) },
                ].map(s => (
                  <div key={s.label} className="border px-3 py-2.5 text-center" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
                    <div className="text-[18px] font-[800] leading-none" style={{ color: "var(--b-text)" }}>{s.value}</div>
                    <div className="text-[10.5px] mt-1" style={{ color: "var(--b-text-muted)" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Attention banner */}
              <div className="flex items-start gap-2.5 px-3 py-2.5 border mb-4" style={{ borderColor: "rgba(240,96,96,0.25)", background: "rgba(240,96,96,0.04)" }}>
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: RED }} />
                <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                  <span style={{ color: RED, fontWeight: 700 }}>7 items</span> have been highlighted in the audit pack — review before presenting to the auditor.
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
