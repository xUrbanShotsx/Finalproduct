"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield, Users, Settings, AlertTriangle, CheckSquare, BarChart3,
  Building2, ArrowRight, CheckCircle2, Zap, MapPin, FileText, Scale, ChevronDown,
} from "lucide-react";

/* ─── Logo ───────────────────────────────────────────────────────── */
function BLogo({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill={color} />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill={color} />
    </svg>
  );
}

/* ─── Dashboard Mockup ───────────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div style={{ width: "100%", filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.6))", userSelect: "none" }}>
      <div style={{ border: "1px solid #2a2a2a", background: "#1a1a1a" }}>
        {/* Browser chrome */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderBottom: "1px solid #222" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff6058" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }} />
          </div>
          <div style={{ flex: 1, margin: "0 16px", padding: "4px 12px", fontSize: "11px", textAlign: "center", border: "1px solid #2a2a2a", background: "#111", color: "#555" }}>
            app.briesa.com/safety/incidents
          </div>
        </div>
        {/* App */}
        <div style={{ display: "flex", height: "420px", background: "#0f0f0f", overflow: "hidden" }}>
          {/* Sidebar */}
          <div style={{ width: "155px", flexShrink: 0, borderRight: "1px solid #1e1e1e", background: "#111", padding: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px 10px", borderBottom: "1px solid #1a1a1a", marginBottom: "8px" }}>
              <BLogo size={13} color="#1a8a4a" />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#e0e0e0" }}>Briesa</span>
            </div>
            <div style={{ fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.1em", color: "#333", textTransform: "uppercase", padding: "0 8px 6px" }}>Modules</div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", background: "#1e1e1e", fontSize: "10px", fontWeight: 600, color: "#e0e0e0" }}>
              <Shield style={{ width: "10px", height: "10px", color: "#1a8a4a" }} />
              Safety
            </div>
            <div style={{ marginLeft: "12px", paddingLeft: "8px", borderLeft: "1px solid #1e1e1e" }}>
              {["Incidents", "Actions", "Toolbox", "Prestart", "SWMS", "Permits"].map((s, i) => (
                <div key={s} style={{ padding: "4px 8px", fontSize: "9.5px", color: i === 0 ? "#e0e0e0" : "#333", background: i === 0 ? "#1a1a1a" : "transparent", fontWeight: i === 0 ? 600 : 400 }}>{s}</div>
              ))}
            </div>
            {[["Training"], ["People"], ["Risk"]].map(([name]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", fontSize: "10px", color: "#333" }}>
                <div style={{ width: "10px", height: "10px", background: "#1e1e1e" }} />
                {name}
              </div>
            ))}
          </div>
          {/* Main */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Topbar */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 16px", height: "38px", borderBottom: "1px solid #1a1a1a", background: "#111", flexShrink: 0 }}>
              <span style={{ fontSize: "10px", color: "#444" }}>Safety</span>
              <span style={{ fontSize: "10px", color: "#333" }}>/</span>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#e0e0e0" }}>Incidents</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", background: "rgba(26,138,74,0.15)", color: "#1a8a4a" }}>OWNER</span>
                <span style={{ fontSize: "9px", color: "#333" }}>Demo Org</span>
              </div>
            </div>
            {/* Page header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #1a1a1a", background: "#111", flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#e0e0e0" }}>Incidents</div>
                <div style={{ fontSize: "9px", color: "#444", marginTop: "2px" }}>Report, investigate and close out incidents</div>
              </div>
              <div style={{ padding: "4px 10px", fontSize: "9px", fontWeight: 600, border: "1px solid rgba(26,138,74,0.4)", background: "rgba(26,138,74,0.1)", color: "#1a8a4a" }}>+ Report</div>
            </div>
            {/* Stats strip */}
            <div style={{ display: "flex", borderBottom: "1px solid #1a1a1a", background: "#111", flexShrink: 0 }}>
              {[["2","Open","#f06060"],["1","Under Invest.","#b58a1b"],["3","Closed","#1a8a4a"],["1.2","TRIFR","#666"]].map(([v, l, c]) => (
                <div key={l} style={{ flex: 1, padding: "8px 12px", borderRight: "1px solid #1a1a1a" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: "8.5px", fontWeight: 600, color: "#444", marginTop: "2px" }}>{l}</div>
                </div>
              ))}
            </div>
            {/* Rows */}
            <div style={{ flex: 1, overflow: "hidden", padding: "10px 12px", display: "flex", flexDirection: "column", gap: "6px", background: "#0f0f0f" }}>
              {[
                { ref:"INC-044", type:"Near Miss",         loc:"Site 01 — Level 3",  sev:"High",   c:"#f06060" },
                { ref:"INC-043", type:"First Aid Injury",  loc:"Site 02 — Laydown",  sev:"Low",    c:"#1a8a4a" },
                { ref:"INC-042", type:"Property Damage",   loc:"Site 01 — B-Block",  sev:"Medium", c:"#b58a1b" },
                { ref:"INC-041", type:"Near Miss",         loc:"Site 03 — Basement", sev:"Medium", c:"#b58a1b" },
              ].map(r => (
                <div key={r.ref} style={{ display: "flex", alignItems: "center", border: "1px solid #1e1e1e", background: "#111", overflow: "hidden" }}>
                  <div style={{ width: "3px", alignSelf: "stretch", background: r.c, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", gap: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "9px", fontWeight: 700, fontFamily: "monospace", color: "#ccc" }}>{r.ref}</span>
                        <span style={{ fontSize: "8.5px", color: "#555" }}>{r.type}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <MapPin style={{ width: "8px", height: "8px", color: "#333" }} />
                        <span style={{ fontSize: "8px", color: "#444" }}>{r.loc}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "8px", fontWeight: 700, padding: "2px 6px", background: r.c + "22", color: r.c, flexShrink: 0 }}>{r.sev}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section number divider ─────────────────────────────────────── */
function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "72px" }}>
      <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "#333", letterSpacing: "0.02em" }}>[{n}]</span>
      <span style={{ fontSize: "12px", color: "#222" }}>//</span>
      <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#444" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
    </div>
  );
}

/* ─── Card tag ───────────────────────────────────────────────────── */
function Tag({ label, accent }: { label: string; accent?: boolean }) {
  return (
    <span style={{
      display: "inline-block",
      fontFamily: "monospace",
      fontSize: "10px",
      fontWeight: 700,
      letterSpacing: "0.06em",
      padding: "2px 7px",
      border: `1px solid ${accent ? "rgba(26,138,74,0.4)" : "#222"}`,
      color: accent ? "#1a8a4a" : "#444",
      background: accent ? "rgba(26,138,74,0.08)" : "#111",
    }}>
      [{label}]
    </span>
  );
}

/* ─── Data ───────────────────────────────────────────────────────── */
const MODULES = [
  { icon: Shield,        name: "Safety",       color: "#f06060", tags: ["CORE", "AI"],   desc: "Incidents, SWMS, toolbox talks, permits and prestart checks — everything from ground level to audit-ready.", soon: false },
  { icon: Users,         name: "People",        color: "#1a6ddb", tags: ["CORE"],         desc: "Workforce credentials, contractor onboarding, site inductions and health monitoring in one register.", soon: false },
  { icon: Settings,      name: "Operations",    color: "#b58a1b", tags: ["CORE"],         desc: "Work planning, plant pre-op inspections, defect logging and traffic management controls.", soon: false },
  { icon: AlertTriangle, name: "Risk",          color: "#e06030", tags: ["CORE"],         desc: "Hazard register, risk assessments, critical risk control verification and HRCW tracking.", soon: false },
  { icon: CheckSquare,   name: "Compliance",    color: "#1a8a4a", tags: ["CORE"],         desc: "Audits, legislative register, SWMS review schedules and HRCW compliance evidence storage.", soon: false },
  { icon: BarChart3,     name: "Insights",      color: "#8b5cf6", tags: ["AI"],           desc: "Live WHS performance metrics, TRIFR tracking, leading indicators and custom board reporting.", soon: false },
  { icon: Building2,     name: "Training",      color: "#0ea5e9", tags: ["CORE", "AI"],   desc: "Course builder, training register, competency licences, induction builder and training matrix.", soon: false },
  { icon: FileText,      name: "Blueprints",    color: "#e06030", tags: ["SOON"],         desc: "Document management, standard operating procedures and controlled document revision tracking.", soon: true },
  { icon: Scale,         name: "Governance",    color: "#8b5cf6", tags: ["SOON"],         desc: "Board reporting, policy register, management review schedules and executive WHS dashboards.", soon: true },
];

const INDUSTRIES = [
  {
    name: "Construction",
    tag: "OPEN",
    color: "#00ff7f",
    desc: "From SWMS and HRCW permits to plant pre-ops and work zone management. Built to the requirements of SafeWork NSW and state equivalents.",
    items: ["Incidents · SWMS · Permits", "White Card Register", "Plant & Equipment", "High Risk Work Licensing", "Work Zone Controls"],
  },
  {
    name: "Industrial",
    tag: "OPEN",
    color: "#3b82f6",
    desc: "Permits to Work, LOTO procedures, JSA/JSEA and chemical process risk built for manufacturing and industrial facilities.",
    items: ["Permits to Work · LOTO", "JSA / JSEA Management", "Chemical & Process Risk", "Health Monitoring", "Operational Readiness"],
  },
  {
    name: "Facilities",
    tag: "OPEN",
    color: "#a855f7",
    desc: "Building warden registers, isolation and shutdown procedures and statutory compliance obligations for facility managers.",
    items: ["Warden Register", "Isolation & Shutdown", "Essential Safety Measures", "Statutory Obligations", "Visitor & Access Control"],
  },
];

/* ─── AI Toolbox ─────────────────────────────────────────────────── */
type Line =
  | { k: "cmd";   v: string }
  | { k: "in";    v: string }
  | { k: "blank" }
  | { k: "status"; v: string }
  | { k: "head";  v: string }
  | { k: "meta";  v: string }
  | { k: "body";  v: string }
  | { k: "check"; v: string }
  | { k: "warn";  v: string }
  | { k: "note";  v: string };

const AI_FEATURES: {
  tag: string; name: string; desc: string; label: string; lines: Line[];
}[] = [
  {
    tag: "01", name: "Toolbox Talks", label: "briesa — ai — toolbox talk",
    desc: "Generate numbered speaker talking points from any WHS topic in seconds.",
    lines: [
      { k: "cmd",    v: '$ briesa ai toolbox --topic "Working at Heights — EWP"' },
      { k: "in",     v: "→ Topic: Working at Heights — EWP Operations" },
      { k: "in",     v: "→ Site: Level 3, Site 01  |  Presenter: J. Smith" },
      { k: "blank" },
      { k: "status", v: "Generating talk points..." },
      { k: "blank" },
      { k: "head",   v: "TOOLBOX TALK — Working at Heights" },
      { k: "meta",   v: "16 Jun 2026 · Level 3, Site 01 · Safety Manager" },
      { k: "blank" },
      { k: "body",   v: "1. Pre-use EWP inspection — check tyres, controls, safety cage and harness anchor points before commencing work." },
      { k: "body",   v: "2. Exclusion zones — establish a 2m perimeter around EWP base. Spotter required at all times." },
      { k: "body",   v: "3. Weather limits — cease operations if wind exceeds 45 km/h or lightning within 10 km." },
      { k: "body",   v: "4. Emergency descent — demonstrate manual lowering procedure before elevated work begins." },
      { k: "body",   v: "5. Rescue plan — confirm rescue procedures are briefed and equipment is on standby." },
      { k: "blank" },
      { k: "note",   v: "→ 5 talk points generated · Ready to attach to toolbox record" },
    ],
  },
  {
    tag: "02", name: "SWMS Drafting", label: "briesa — ai — swms draft",
    desc: "Draft task descriptions and key hazards from the HRCW category automatically.",
    lines: [
      { k: "cmd",    v: '$ briesa ai swms --task "EWP façade works" --hrcw "Work at heights"' },
      { k: "in",     v: "→ HRCW: Work at heights (fall > 2 metres)" },
      { k: "in",     v: "→ Location: Level 3 Façade, Site 01" },
      { k: "blank" },
      { k: "status", v: "Drafting SWMS content..." },
      { k: "blank" },
      { k: "head",   v: "TASK: Elevated Work Platform — Level 3 Façade" },
      { k: "meta",   v: "HRCW: Work in area with potential fall of more than 2 metres" },
      { k: "blank" },
      { k: "head",   v: "HIGH RISK ACTIVITIES" },
      { k: "body",   v: "• Operating EWP in live traffic area near exclusion zones" },
      { k: "body",   v: "• Working over energised underground services" },
      { k: "blank" },
      { k: "head",   v: "KEY HAZARDS" },
      { k: "body",   v: "• Fall from height — EWP tip-over or outrigger failure" },
      { k: "body",   v: "• Struck by falling objects — unsecured tools or materials" },
      { k: "body",   v: "• Electrocution — overhead power lines within 3m" },
      { k: "blank" },
      { k: "note",   v: "→ Draft complete · Review and customise before worker sign-off" },
    ],
  },
  {
    tag: "03", name: "Permit Controls", label: "briesa — ai — permit controls",
    desc: "Suggest safety controls based on permit type and work location.",
    lines: [
      { k: "cmd",    v: '$ briesa ai permit --type "Hot Work" --location "Basement B1"' },
      { k: "in",     v: "→ Permit type: Hot Work (welding & grinding)" },
      { k: "in",     v: "→ Location: Basement B1 — enclosed welding bay" },
      { k: "blank" },
      { k: "status", v: "Suggesting controls..." },
      { k: "blank" },
      { k: "head",   v: "PERMIT: Hot Work — Basement B1" },
      { k: "blank" },
      { k: "head",   v: "MANDATORY CONTROLS" },
      { k: "check",  v: "Fire warden assigned, briefed and positioned" },
      { k: "check",  v: "Fire extinguisher within 10m of work area" },
      { k: "check",  v: "Combustibles cleared within 3m radius" },
      { k: "check",  v: "Adjacent areas inspected and signed off" },
      { k: "check",  v: "30-minute fire watch after work completion" },
      { k: "blank" },
      { k: "head",   v: "ADDITIONAL RECOMMENDED" },
      { k: "check",  v: "Notify building manager — enable suppression bypass" },
      { k: "check",  v: "Isolate smoke detectors in affected zone" },
      { k: "blank" },
      { k: "note",   v: "→ 7 controls added to permit · Ready for sign-off" },
    ],
  },
  {
    tag: "04", name: "Incident Actions", label: "briesa — ai — incident actions",
    desc: "Recommend corrective actions from incident type and severity automatically.",
    lines: [
      { k: "cmd",    v: '$ briesa ai actions --incident "INC-044" --severity "High"' },
      { k: "in",     v: "→ Type: Near Miss — EWP near-tip-over" },
      { k: "in",     v: "→ Severity: High · Location: Level 3, Site 01" },
      { k: "blank" },
      { k: "status", v: "Generating recommended actions..." },
      { k: "blank" },
      { k: "head",   v: "INC-044 — Near Miss (HIGH SEVERITY)" },
      { k: "blank" },
      { k: "head",   v: "IMMEDIATE (within 24 hrs)" },
      { k: "body",   v: "1. Isolate EWP from service — do not operate until inspection complete." },
      { k: "body",   v: "2. Notify SafeWork NSW under WHS Act s.35 (dangerous incident)." },
      { k: "body",   v: "3. Preserve scene — no clean-up until investigation is authorised." },
      { k: "body",   v: "4. Brief all EWP operators — documented sign-off required." },
      { k: "blank" },
      { k: "head",   v: "INVESTIGATION (within 72 hrs)" },
      { k: "body",   v: "5. Root cause analysis — ground conditions, training, pre-op check." },
      { k: "body",   v: "6. Review all pre-op records for last 30 days." },
      { k: "body",   v: "7. Engage third-party inspector for structural assessment." },
      { k: "blank" },
      { k: "note",   v: "→ 7 actions generated · Assign owners and due dates in Briesa" },
    ],
  },
  {
    tag: "05", name: "Course Outlines", label: "briesa — ai — course outline",
    desc: "Build structured training content and learning objectives for any WHS topic.",
    lines: [
      { k: "cmd",    v: '$ briesa ai course --title "Working Safely at Heights"' },
      { k: "in",     v: "→ Audience: Construction workers (general site)" },
      { k: "in",     v: "→ Duration: 3 hours · Delivery: Classroom + Practical" },
      { k: "blank" },
      { k: "status", v: "Building course outline..." },
      { k: "blank" },
      { k: "head",   v: "COURSE: Working Safely at Heights" },
      { k: "meta",   v: "3 hrs · 4 modules · 12 learning objectives" },
      { k: "blank" },
      { k: "head",   v: "MODULE 1 — Legislation & Duty of Care  (30 min)" },
      { k: "body",   v: "• WHS Act 2011 obligations for work at height" },
      { k: "body",   v: "• HRCW definition and licence requirements" },
      { k: "blank" },
      { k: "head",   v: "MODULE 2 — Risk Management  (45 min)" },
      { k: "body",   v: "• Hierarchy of controls applied to fall risk" },
      { k: "body",   v: "• SWMS requirements and completion process" },
      { k: "blank" },
      { k: "head",   v: "MODULE 3 — Equipment & Inspection  (60 min)" },
      { k: "body",   v: "• EWP, scaffold and harness systems" },
      { k: "body",   v: "• Pre-use inspection and defect reporting" },
      { k: "blank" },
      { k: "head",   v: "MODULE 4 — Practical Assessment  (45 min)" },
      { k: "body",   v: "• Supervised EWP operation and competency sign-off" },
      { k: "blank" },
      { k: "note",   v: "→ Outline generated · Add to Course Builder in Briesa Training" },
    ],
  },
  {
    tag: "06", name: "Licence Mapping", label: "briesa — ai — licence map",
    desc: "Map required tickets and licences to a worker's role and site type instantly.",
    lines: [
      { k: "cmd",    v: '$ briesa ai licences --role "Rigger" --site "High-rise construction"' },
      { k: "in",     v: "→ Role: Rigger · Site type: High-rise construction" },
      { k: "in",     v: "→ State: NSW · Checking WHS regulations..." },
      { k: "blank" },
      { k: "status", v: "Mapping required tickets..." },
      { k: "blank" },
      { k: "head",   v: "ROLE: Rigger — High-rise Construction (NSW)" },
      { k: "blank" },
      { k: "head",   v: "MANDATORY (no work without these)" },
      { k: "check",  v: "Rigging Licence — Basic or Intermediate (HRCW)" },
      { k: "check",  v: "Construction Induction — White Card CPCCWHS1001" },
      { k: "check",  v: "Working at Heights training — site-specific" },
      { k: "blank" },
      { k: "head",   v: "RECOMMENDED TICKETS" },
      { k: "body",   v: "+ Elevated Work Platform (EWP) — 11m boom or scissors" },
      { k: "body",   v: "+ Dogging Licence — required if directing crane lifts" },
      { k: "body",   v: "+ First Aid Certificate — HLTAID011" },
      { k: "blank" },
      { k: "warn",   v: "⚠ First Aid — check renewal date (3-year cycle)" },
      { k: "warn",   v: "⚠ EWP ticket — verify currency with issuing RTO" },
      { k: "blank" },
      { k: "note",   v: "→ 6 requirements mapped · Add to competency register" },
    ],
  },
];

function renderLine(line: Line, i: number) {
  if (line.k === "blank") return <div key={i} style={{ height: "10px" }} />;
  const styles: Record<string, React.CSSProperties> = {
    cmd:    { color: "#666", fontStyle: "normal" },
    in:     { color: "#383838" },
    status: { color: "#1a8a4a" },
    head:   { color: "#c0c0c0", fontWeight: 700, letterSpacing: "0.04em" },
    meta:   { color: "#2e2e2e" },
    body:   { color: "#484848" },
    check:  { color: "#1a8a4a" },
    warn:   { color: "#8a6a1a" },
    note:   { color: "#1a8a4a" },
  };
  const prefixes: Partial<Record<Line["k"], string>> = { check: "✓ ", warn: "" };
  const style = styles[line.k] ?? {};
  const prefix = line.k in prefixes ? prefixes[line.k as keyof typeof prefixes] : "";
  const text = (line as { v: string }).v;

  if (line.k === "cmd") {
    return (
      <div key={i} style={style}>
        <span style={{ color: "#1a8a4a" }}>$</span>{" "}
        <span style={{ color: "#777" }}>{text.slice(2)}</span>
      </div>
    );
  }
  return <div key={i} style={style}>{prefix}{text}</div>;
}

function AIToolbox() {
  const [active, setActive] = useState(0);
  const feature = AI_FEATURES[active];

  return (
    <div className="r-grid-2" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "6px", alignItems: "start" }}>
      {/* Left — feature list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        {AI_FEATURES.map((f, i) => (
          <button
            key={f.tag}
            onClick={() => setActive(i)}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "14px 16px",
              background: active === i ? "#111" : "transparent",
              border: `1px solid ${active === i ? "#2a2a2a" : "transparent"}`,
              cursor: "pointer",
              transition: "background 100ms",
            }}
            onMouseOver={e => { if (active !== i) (e.currentTarget as HTMLElement).style.background = "#0d0d0d"; }}
            onMouseOut={e => { if (active !== i) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, color: active === i ? "#444" : "#2a2a2a" }}>[{f.tag}]</span>
              <span style={{ fontSize: "13px", fontWeight: 700, color: active === i ? "#e0e0e0" : "#444" }}>{f.name}</span>
            </div>
            <p style={{ fontSize: "11.5px", color: active === i ? "#555" : "#2a2a2a", lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
            {active === i && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#1a8a4a" }} />
                <span style={{ fontFamily: "monospace", fontSize: "9px", color: "#1a8a4a" }}>ACTIVE</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Right — terminal output */}
      <div style={{ border: "1px solid #1a1a1a", background: "#080808", minHeight: "520px" }}>
        {/* Chrome */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff6058" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
          <span style={{ marginLeft: "8px", fontSize: "10px", fontFamily: "monospace", color: "#2a2a2a" }}>{feature.label}</span>
        </div>
        {/* Output */}
        <div style={{ padding: "22px 24px", fontFamily: "monospace", fontSize: "12px", lineHeight: 1.85 }}>
          {feature.lines.map((line, i) => renderLine(line, i))}
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────── */
const PRODUCTS: [string, string, string][] = [
  ["/signup", "Construction SMS", "Safety management for construction sites"],
  ["/signup", "Industrial SMS",   "Safety management for industrial operations"],
  ["/signup", "Facilities SMS",   "Safety management for facilities teams"],
  ["/blueprints-iso", "Blueprints (ISO)", "ISO 9001 / 14001 / 45001 packs"],
];

export default function LandingPage() {
  const [productsOpen, setProductsOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  return (
    <div style={{ background: "#0a0a0a", color: "#e0e0e0", fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── NAV ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,10,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BLogo size={20} color="#ffffff" />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>Briesa</span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, color: "#333", marginLeft: "2px" }}>V1.0</span>
          </div>

          {/* Nav */}
          <nav className="r-hide-mobile" style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {/* Products dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13.5px", fontWeight: 500, color: productsOpen ? "#ffffff" : "#555", cursor: "pointer", transition: "color 0.15s" }}>
                Products
                <ChevronDown size={13} style={{ transform: productsOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
              </span>
              {productsOpen && (
                <div style={{ position: "absolute", top: "100%", left: "-12px", paddingTop: "14px", zIndex: 50 }}>
                  <div style={{ minWidth: "268px", background: "#0f0f0f", border: "1px solid #222", padding: "6px", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
                    {PRODUCTS.map(([href, label, desc]) => (
                      <Link
                        key={label}
                        href={href}
                        style={{ display: "block", padding: "10px 12px", textDecoration: "none" }}
                        onMouseOver={e => ((e.currentTarget as HTMLElement).style.background = "#1a1a1a")}
                        onMouseOut={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                      >
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0" }}>{label}</div>
                        <div style={{ fontSize: "11.5px", color: "#555", marginTop: "2px" }}>{desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Company dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13.5px", fontWeight: 500, color: companyOpen ? "#ffffff" : "#555", cursor: "pointer", transition: "color 0.15s" }}>
                Company
                <ChevronDown size={13} style={{ transform: companyOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
              </span>
              {companyOpen && (
                <div style={{ position: "absolute", top: "100%", left: "-12px", paddingTop: "14px", zIndex: 50 }}>
                  <div style={{ minWidth: "220px", background: "#0f0f0f", border: "1px solid #222", padding: "6px", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
                    {[
                      ["/about", "About", "Our story and where we're headed"],
                      ["/contact", "Contact", "Get in touch with the team"],
                    ].map(([href, label, desc]) => (
                      <Link
                        key={label}
                        href={href}
                        style={{ display: "block", padding: "10px 12px", textDecoration: "none" }}
                        onMouseOver={e => ((e.currentTarget as HTMLElement).style.background = "#1a1a1a")}
                        onMouseOut={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                      >
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0" }}>{label}</div>
                        <div style={{ fontSize: "11.5px", color: "#555", marginTop: "2px" }}>{desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Resources dropdown */}
            <div
              style={{ position: "relative" }}
              onMouseEnter={() => setResourcesOpen(true)}
              onMouseLeave={() => setResourcesOpen(false)}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13.5px", fontWeight: 500, color: resourcesOpen ? "#ffffff" : "#555", cursor: "pointer", transition: "color 0.15s" }}>
                Resources
                <ChevronDown size={13} style={{ transform: resourcesOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
              </span>
              {resourcesOpen && (
                <div style={{ position: "absolute", top: "100%", left: "-12px", paddingTop: "14px", zIndex: 50 }}>
                  <div style={{ minWidth: "240px", background: "#0f0f0f", border: "1px solid #222", padding: "6px", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}>
                    {[
                      ["/newsroom", "Newsroom", "Updates, releases and announcements"],
                      ["/#resources", "AI Toolbox", "See Briesa's AI features in action"],
                    ].map(([href, label, desc]) => (
                      <Link
                        key={label}
                        href={href}
                        style={{ display: "block", padding: "10px 12px", textDecoration: "none" }}
                        onMouseOver={e => ((e.currentTarget as HTMLElement).style.background = "#1a1a1a")}
                        onMouseOut={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
                      >
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "#e0e0e0" }}>{label}</div>
                        <div style={{ fontSize: "11.5px", color: "#555", marginTop: "2px" }}>{desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {[
              ["/pricing",     "Pricing"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: "13.5px", fontWeight: 500, color: "#555", textDecoration: "none" }}
                onMouseOver={e => (e.currentTarget.style.color = "#ffffff")}
                onMouseOut={e => (e.currentTarget.style.color = "#555")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href="/login"
              style={{ fontSize: "13px", fontWeight: 500, color: "#666", textDecoration: "none", padding: "7px 16px", border: "1px solid #222" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = "#ccc"; (e.currentTarget as HTMLElement).style.borderColor = "#333"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = "#666"; (e.currentTarget as HTMLElement).style.borderColor = "#222"; }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              style={{ fontSize: "13px", fontWeight: 700, color: "#0a0a0a", textDecoration: "none", padding: "7px 18px", background: "#ffd600", border: "1px solid #ffd600" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "#e6c000"; (e.currentTarget as HTMLElement).style.borderColor = "#e6c000"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "#ffd600"; (e.currentTarget as HTMLElement).style.borderColor = "#ffd600"; }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: "#0a0a0a", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ textAlign: "center", padding: "0 24px", maxWidth: "900px", width: "100%" }}>

          {/* Platform label */}
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "36px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333" }}>[WHS PLATFORM]</span>
            <span style={{ fontSize: "11px", color: "#222" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#ffd600" }}>Australian Focused</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 800,
            lineHeight: 1.03,
            letterSpacing: "-0.04em",
            color: "#ffffff",
            margin: "0 0 28px",
          }}>
            BREEZE THROUGH<br />COMPLIANCE,<br /><span style={{ color: "#ffd600" }}>WITH CONFIDENCE.</span>
          </h1>

          {/* Subheading */}
          <p style={{ fontSize: "18px", lineHeight: 1.65, color: "#555", margin: "0 auto 44px", maxWidth: "540px" }}>
            Incidents, SWMS, permits and critical risk controls — all in one place. Built for Australian construction, industrial and facilities teams.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            <Link
              href="/signup"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 28px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", background: "#ffd600", textDecoration: "none", border: "1px solid #ffd600" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "#e6c000"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "#ffd600"; }}
            >
              Get started <ArrowRight size={15} />
            </Link>
            <Link
              href="/demo"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 28px", fontSize: "14px", fontWeight: 500, color: "#555", background: "transparent", textDecoration: "none", border: "1px solid #222" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.color = "#aaa"; (e.currentTarget as HTMLElement).style.borderColor = "#333"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.color = "#555"; (e.currentTarget as HTMLElement).style.borderColor = "#222"; }}
            >
              Try Free Demo
            </Link>
          </div>

        </div>
      </section>

      {/* ── [01] PLATFORM ── */}
      <section id="features" style={{ background: "#0a0a0a", padding: "96px 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <SectionLabel n="01" label="Platform" />

          <div className="r-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            {MODULES.map(({ icon: Icon, name, color, tags, desc, soon }) => (
              <div
                key={name}
                style={{
                  background: "#0f0f0f",
                  border: "1px solid #1a1a1a",
                  padding: "28px 26px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  transition: "border-color 120ms",
                  opacity: soon ? 0.5 : 1,
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a"; }}
              >
                {/* Icon + tags row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${color}22`, background: `${color}0e` }}>
                    <Icon style={{ width: "16px", height: "16px", color: soon ? "#444" : color }} />
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {tags.map(t => <Tag key={t} label={t} accent={t === "AI"} />)}
                  </div>
                </div>
                {/* Content */}
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: soon ? "#333" : "#e0e0e0", marginBottom: "8px", letterSpacing: "-0.01em" }}>{name}</div>
                  <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── [02] INDUSTRIES ── */}
      <section id="industries" style={{ background: "#080808", padding: "96px 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <SectionLabel n="02" label="Industries" />

          <div className="r-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            {INDUSTRIES.map(({ name, tag, color, desc, items }) => (
              <div key={name} style={{ background: "#0f0f0f", border: `1px solid ${color}55`, display: "flex", flexDirection: "column" }}>
                {/* Colour bar */}
                <div style={{ height: "3px", background: color }} />
                {/* Header */}
                <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${color}22` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.02em", color: "#e0e0e0" }}>{name}</span>
                    <span style={{
                      fontFamily: "monospace", fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em",
                      padding: "2px 7px", border: `1px solid ${color}55`, color, background: `${color}12`,
                    }}>[{tag}]</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
                {/* Items */}
                <div style={{ padding: "20px 24px", flex: 1 }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2a2a2a", marginBottom: "12px" }}>Included</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {items.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "4px", height: "4px", background: color, flexShrink: 0 }} />
                        <span style={{ fontSize: "12.5px", color: "#555" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ padding: "16px 24px", borderTop: `1px solid ${color}22` }}>
                  <Link
                    href="/login"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 600, color: "#555", textDecoration: "none" }}
                    onMouseOver={e => (e.currentTarget.style.color = color)}
                    onMouseOut={e => (e.currentTarget.style.color = "#555")}
                  >
                    Explore {name} <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── [03] AI TOOLBOX ── */}
      <section id="resources" style={{ background: "#0a0a0a", padding: "96px 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <SectionLabel n="03" label="AI Toolbox" />
          <AIToolbox />
        </div>
      </section>

      {/* ── [04] FIELD ── */}
      <section style={{ background: "#080808", padding: "96px 0", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <SectionLabel n="04" label="Built for the field" />

          <div className="r-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
            {/* Left */}
            <div>
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#ffffff", margin: "0 0 20px", lineHeight: 1.1 }}>
                An Engine<br />Of Control.
              </h2>
              <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#444", margin: "0 0 32px" }}>
                Centralising policies, registers, audits, and reporting into one intelligent operating system.
              </p>
              <Link
                href="/signup"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", background: "#ffd600", textDecoration: "none", border: "1px solid #ffd600" }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "#e6c000"}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.background = "#ffd600"}
              >
                Get started <ArrowRight size={15} />
              </Link>
            </div>
            {/* Right — stacked cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
              {[
                ["01", "Regulation", "Structured, real-time oversight of compliance obligations, risk frameworks, and operational workflows."],
                ["02", "Automation", "Transforming fragmented, manual processes into streamlined ecosystems that deliver clarity, control, and measurable growth."],
                ["03", "AI",         "Reliable datasets combined with advanced AI to systematically manage governance that was previously reactive."],
              ].map(([num, title, desc]) => (
                <div key={num} style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: "32px 28px" }}>
                  <div style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: "#1a8a4a", marginBottom: "18px" }}>{num}</div>
                  <div style={{ fontSize: "18px", fontWeight: 700, color: "#e0e0e0", marginBottom: "12px" }}>{title}</div>
                  <div style={{ fontSize: "14px", color: "#555", lineHeight: 1.65 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: "#060606", padding: "88px 0", borderTop: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#222" }}>[FREE DEMO]</span>
            <span style={{ fontSize: "11px", color: "#1e1e1e" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#333" }}>No credit card required</span>
          </div>
          <h2 style={{ fontSize: "clamp(48px, 7vw, 88px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#ffffff", margin: "0 0 16px", lineHeight: 1.0 }}>
            STOP GUESSING.<br />GET CERTIFIED.
          </h2>
          <p style={{ fontSize: "16px", color: "#444", margin: "0 0 40px", maxWidth: "400px", marginInline: "auto", lineHeight: 1.6 }}>
            Free demo available. Full access to all modules.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <Link
              href="/signup"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", fontSize: "15px", fontWeight: 700, color: "#0a0a0a", background: "#ffd600", textDecoration: "none", border: "1px solid #ffd600" }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "#e6c000"}
              onMouseOut={e => (e.currentTarget as HTMLElement).style.background = "#ffd600"}
            >
              Get started <ArrowRight size={16} />
            </Link>
            <Link
              href="/demo"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", fontSize: "15px", fontWeight: 500, color: "#555", background: "transparent", textDecoration: "none", border: "1px solid #222" }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.borderColor = "#333"}
              onMouseOut={e => (e.currentTarget as HTMLElement).style.borderColor = "#222"}
            >
              Try Free Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#040404", borderTop: "1px solid #111", padding: "56px 0 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: "48px", marginBottom: "56px" }}>
            {/* Brand */}
            <div style={{ flex: "0 0 220px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <BLogo size={18} color="#ffffff" />
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>Briesa</span>
                <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, color: "#222" }}>V1.0</span>
              </div>
              <p style={{ fontSize: "12.5px", color: "#333", lineHeight: 1.7, margin: "0 0 20px" }}>
                WHS management software for Australian construction, industrial and facilities industries.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                {["X", "IN", "IG"].map(s => (
                  <div key={s} style={{ width: "28px", height: "28px", border: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, fontFamily: "monospace", color: "#333" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Links */}
            <div style={{ flex: 1, display: "flex", gap: "48px", flexWrap: "wrap" }}>
              {[
                ["Product",    ["Platform", "Industries", "Resources", "Pricing", "Changelog"]],
                ["Industries", ["Construction", "Industrial", "Facilities"]],
                ["Company",    ["About", "Contact", "Privacy", "Terms"]],
                ["Legal",      ["Privacy Policy", "Terms of Service", "Cookie Policy"]],
              ].map(([section, links]) => (
                <div key={section as string}>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#222", marginBottom: "14px" }}>{section as string}</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(links as string[]).map(link => (
                      <li key={link}>
                        <a
                          href={link === "Pricing" ? "/pricing" : "#"}
                          style={{ fontSize: "13px", color: "#333", textDecoration: "none" }}
                          onMouseOver={e => (e.currentTarget.style.color = "#666")}
                          onMouseOut={e => (e.currentTarget.style.color = "#333")}
                        >{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "24px", borderTop: "1px solid #111" }}>
            <p style={{ fontSize: "11.5px", color: "#222", margin: 0 }}>
              © {new Date().getFullYear()} Briesa. All rights reserved. ABN 00 000 000 000.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#1e1e1e", fontWeight: 700 }}>V1.0.0</span>
              <span style={{ fontSize: "11.5px", color: "#1e1e1e" }}>SafeWork NSW · Australian Industry</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
