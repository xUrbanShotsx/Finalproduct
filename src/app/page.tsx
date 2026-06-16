"use client";

import Link from "next/link";
import {
  Shield, Users, Settings, AlertTriangle, CheckSquare, BarChart3,
  Building2, ArrowRight, CheckCircle2, Zap, MapPin,
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
    <div style={{ width: "100%", filter: "drop-shadow(0 40px 80px rgba(0,0,0,0.12))", userSelect: "none" }}>
      <div style={{ border: "1px solid #d8d8d8", background: "#f0f0f0" }}>
        {/* Browser chrome */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderBottom: "1px solid #d0d0d0" }}>
          <div style={{ display: "flex", gap: "6px" }}>
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff6058" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#28c840" }} />
          </div>
          <div style={{ flex: 1, margin: "0 16px", padding: "4px 12px", fontSize: "11px", textAlign: "center", border: "1px solid #d8d8d8", background: "#fff", color: "#888" }}>
            app.briesa.com/safety/incidents
          </div>
        </div>
        {/* App */}
        <div style={{ display: "flex", height: "420px", background: "#fafafa", overflow: "hidden" }}>
          {/* Sidebar */}
          <div style={{ width: "155px", flexShrink: 0, borderRight: "1px solid #e8e8e8", background: "#fff", padding: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px 10px", borderBottom: "1px solid #f0f0f0", marginBottom: "8px" }}>
              <BLogo size={13} color="#1a8a4a" />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#111" }}>Briesa</span>
            </div>
            <div style={{ fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.1em", color: "#bbb", textTransform: "uppercase", padding: "0 8px 6px" }}>Modules</div>
            {/* Safety active */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", background: "#f0f0f0", fontSize: "10px", fontWeight: 600, color: "#111" }}>
              <Shield style={{ width: "10px", height: "10px", color: "#1a8a4a" }} />
              Safety
            </div>
            <div style={{ marginLeft: "12px", paddingLeft: "8px", borderLeft: "1px solid #e8e8e8" }}>
              {["Incidents", "Actions", "Toolbox", "Prestart", "SWMS", "Permits"].map((s, i) => (
                <div key={s} style={{ padding: "4px 8px", fontSize: "9.5px", color: i === 0 ? "#111" : "#bbb", background: i === 0 ? "#ebebeb" : "transparent", fontWeight: i === 0 ? 600 : 400 }}>{s}</div>
              ))}
            </div>
            {[["Training"], ["People"], ["Risk"]].map(([name]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", fontSize: "10px", color: "#ccc" }}>
                <div style={{ width: "10px", height: "10px", background: "#eee" }} />
                {name}
              </div>
            ))}
          </div>
          {/* Main */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* Topbar */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0 16px", height: "38px", borderBottom: "1px solid #ebebeb", background: "#fff", flexShrink: 0 }}>
              <span style={{ fontSize: "10px", color: "#bbb" }}>Safety</span>
              <span style={{ fontSize: "10px", color: "#ccc" }}>/</span>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#111" }}>Incidents</span>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "9px", fontWeight: 700, padding: "2px 6px", background: "#e6f7ed", color: "#1a8a4a" }}>OWNER</span>
                <span style={{ fontSize: "9px", color: "#bbb" }}>Demo Org</span>
              </div>
            </div>
            {/* Page header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: "1px solid #f0f0f0", background: "#fff", flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>Incidents</div>
                <div style={{ fontSize: "9px", color: "#bbb", marginTop: "2px" }}>Report, investigate and close out incidents</div>
              </div>
              <div style={{ padding: "4px 10px", fontSize: "9px", fontWeight: 600, border: "1px solid #b3e6c9", background: "#e6f7ed", color: "#1a8a4a" }}>+ Report</div>
            </div>
            {/* Stats strip */}
            <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", background: "#fff", flexShrink: 0 }}>
              {[["2","Open","#f06060"],["1","Under Invest.","#b58a1b"],["3","Closed","#1a8a4a"],["1.2","TRIFR","#555"]].map(([v, l, c]) => (
                <div key={l} style={{ flex: 1, padding: "8px 12px", borderRight: "1px solid #f5f5f5" }}>
                  <div style={{ fontSize: "16px", fontWeight: 800, color: c, lineHeight: 1 }}>{v}</div>
                  <div style={{ fontSize: "8.5px", fontWeight: 600, color: "#555", marginTop: "2px" }}>{l}</div>
                </div>
              ))}
            </div>
            {/* Rows */}
            <div style={{ flex: 1, overflow: "hidden", padding: "10px 12px", display: "flex", flexDirection: "column", gap: "6px" }}>
              {[
                { ref:"INC-044", type:"Near Miss",         loc:"Site 01 — Level 3",  sev:"High",   c:"#f06060" },
                { ref:"INC-043", type:"First Aid Injury",  loc:"Site 02 — Laydown",  sev:"Low",    c:"#1a8a4a" },
                { ref:"INC-042", type:"Property Damage",   loc:"Site 01 — B-Block",  sev:"Medium", c:"#b58a1b" },
                { ref:"INC-041", type:"Near Miss",         loc:"Site 03 — Basement", sev:"Medium", c:"#b58a1b" },
              ].map(r => (
                <div key={r.ref} style={{ display: "flex", alignItems: "center", border: "1px solid #ebebeb", background: "#fff", overflow: "hidden" }}>
                  <div style={{ width: "3px", alignSelf: "stretch", background: r.c, flexShrink: 0 }} />
                  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 10px", gap: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontSize: "9px", fontWeight: 700, fontFamily: "monospace", color: "#111" }}>{r.ref}</span>
                        <span style={{ fontSize: "8.5px", color: "#555" }}>{r.type}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                        <MapPin style={{ width: "8px", height: "8px", color: "#ccc" }} />
                        <span style={{ fontSize: "8px", color: "#bbb" }}>{r.loc}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: "8px", fontWeight: 700, padding: "2px 6px", background: r.c + "20", color: r.c, flexShrink: 0 }}>{r.sev}</span>
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
      <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "#ccc", letterSpacing: "0.02em" }}>[{n}]</span>
      <span style={{ fontSize: "12px", color: "#d5d5d5" }}>//</span>
      <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa" }}>{label}</span>
      <div style={{ flex: 1, height: "1px", background: "#ebebeb" }} />
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
      border: `1px solid ${accent ? "#b3e6c9" : "#e0e0e0"}`,
      color: accent ? "#1a8a4a" : "#999",
      background: accent ? "#f0faf4" : "#fafafa",
    }}>
      [{label}]
    </span>
  );
}

/* ─── Data ───────────────────────────────────────────────────────── */
const MODULES = [
  { icon: Shield,        name: "Safety",          color: "#f06060", tags: ["CORE", "AI"],   desc: "Incidents, SWMS, toolbox talks, permits and prestart checks — everything from ground level to audit-ready." },
  { icon: Users,         name: "People",           color: "#1a6ddb", tags: ["CORE"],         desc: "Workforce credentials, contractor onboarding, site inductions and health monitoring in one register." },
  { icon: Settings,      name: "Operations",       color: "#b58a1b", tags: ["CORE"],         desc: "Work planning, plant pre-op inspections, defect logging and traffic management controls." },
  { icon: AlertTriangle, name: "Risk",             color: "#e06030", tags: ["CORE"],         desc: "Hazard register, risk assessments, critical risk control verification and HRCW tracking." },
  { icon: CheckSquare,   name: "Compliance",       color: "#1a8a4a", tags: ["CORE"],         desc: "Audits, legislative register, SWMS review schedules and HRCW compliance evidence storage." },
  { icon: BarChart3,     name: "Insights",         color: "#8b5cf6", tags: ["AI"],           desc: "Live WHS performance metrics, TRIFR tracking, leading indicators and custom board reporting." },
  { icon: Building2,     name: "Training",         color: "#0ea5e9", tags: ["CORE", "AI"],   desc: "Course builder, training register, competency licences, induction builder and training matrix." },
];

const INDUSTRIES = [
  {
    name: "Construction",
    tag: "OPEN",
    desc: "From SWMS and HRCW permits to plant pre-ops and work zone management. Built to the requirements of SafeWork NSW and state equivalents.",
    items: ["Incidents · SWMS · Permits", "White Card Register", "Plant & Equipment", "High Risk Work Licensing", "Work Zone Controls"],
  },
  {
    name: "Industrial",
    tag: "OPEN",
    desc: "Permits to Work, LOTO procedures, JSA/JSEA and chemical process risk built for manufacturing and industrial facilities.",
    items: ["Permits to Work · LOTO", "JSA / JSEA Management", "Chemical & Process Risk", "Health Monitoring", "Operational Readiness"],
  },
  {
    name: "Facilities",
    tag: "OPEN",
    desc: "Building warden registers, isolation and shutdown procedures and statutory compliance obligations for facility managers.",
    items: ["Warden Register", "Isolation & Shutdown", "Essential Safety Measures", "Statutory Obligations", "Visitor & Access Control"],
  },
];

/* ─── Page ───────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ background: "#fff", color: "#0a0a0a", fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── NAV ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #f0f0f0",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BLogo size={20} color="#1a8a4a" />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0a0a" }}>Briesa</span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, color: "#ccc", marginLeft: "2px" }}>V1.0</span>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {[
              ["#features",    "Platform"],
              ["#industries",  "Industries"],
              ["#ai",          "AI"],
              ["/pricing",     "Pricing"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: "13.5px", fontWeight: 500, color: "#666", textDecoration: "none" }}
                onMouseOver={e => (e.currentTarget.style.color = "#0a0a0a")}
                onMouseOut={e => (e.currentTarget.style.color = "#666")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link
              href="/login"
              style={{ fontSize: "13px", fontWeight: 500, color: "#555", textDecoration: "none", padding: "7px 16px", border: "1px solid #e0e0e0" }}
              onMouseOver={e => (e.currentTarget.style.borderColor = "#bbb")}
              onMouseOut={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
            >
              Log in
            </Link>
            <Link
              href="/login"
              style={{ fontSize: "13px", fontWeight: 700, color: "#fff", textDecoration: "none", padding: "7px 18px", background: "#0a0a0a", border: "1px solid #0a0a0a" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "#222"; (e.currentTarget as HTMLElement).style.borderColor = "#222"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "#0a0a0a"; (e.currentTarget as HTMLElement).style.borderColor = "#0a0a0a"; }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: "#fff", paddingTop: "88px", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>

          {/* Platform label */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "36px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#ccc" }}>[WHS PLATFORM]</span>
            <span style={{ fontSize: "11px", color: "#e0e0e0" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a8a4a" }}>Australian Industry</span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(48px, 6.5vw, 80px)",
            fontWeight: 800,
            lineHeight: 1.03,
            letterSpacing: "-0.04em",
            color: "#0a0a0a",
            margin: "0 0 24px",
            maxWidth: "820px",
          }}>
            WHS your team<br />will actually use.
          </h1>

          {/* Subheading */}
          <p style={{ fontSize: "18px", lineHeight: 1.65, color: "#666", maxWidth: "520px", margin: "0 0 44px" }}>
            Incidents, SWMS, permits and critical risk controls — all in one place. Built for Australian construction, industrial and facilities teams.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "72px" }}>
            <Link
              href="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", fontSize: "14px", fontWeight: 700, color: "#fff", background: "#0a0a0a", textDecoration: "none", border: "1px solid #0a0a0a" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "#222"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "#0a0a0a"; }}
            >
              Get started free <ArrowRight size={15} />
            </Link>
            <Link
              href="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 26px", fontSize: "14px", fontWeight: 500, color: "#555", background: "#fff", textDecoration: "none", border: "1px solid #e0e0e0" }}
              onMouseOver={e => (e.currentTarget.style.borderColor = "#bbb")}
              onMouseOut={e => (e.currentTarget.style.borderColor = "#e0e0e0")}
            >
              View live demo
            </Link>
          </div>

          {/* Dashboard mockup — full width */}
          <DashboardMockup />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            ["9 modules",    "All core WHS disciplines covered"],
            ["3 industries", "Construction · Industrial · Facilities"],
            ["AI-powered",   "Claude AI woven into every module"],
            ["Australian",   "SafeWork & state WHS compliant"],
          ].map(([stat, label]) => (
            <div key={stat} style={{ padding: "36px 0", borderRight: "1px solid #1a1a1a", textAlign: "center" }}>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "#1a8a4a", letterSpacing: "-0.02em" }}>{stat}</div>
              <div style={{ fontSize: "12px", color: "#555", marginTop: "4px" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── [01] PLATFORM ── */}
      <section id="features" style={{ background: "#fff", padding: "96px 0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <SectionLabel n="01" label="Platform" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "#f0f0f0", border: "1px solid #f0f0f0" }}>
            {MODULES.map(({ icon: Icon, name, color, tags, desc }) => (
              <div
                key={name}
                style={{ background: "#fff", padding: "28px 26px", display: "flex", flexDirection: "column", gap: "16px", transition: "background 120ms" }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "#fafafa"}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.background = "#fff"}
              >
                {/* Icon + tags row */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${color}25`, background: `${color}10` }}>
                    <Icon style={{ width: "16px", height: "16px", color }} />
                  </div>
                  <div style={{ display: "flex", gap: "5px" }}>
                    {tags.map(t => <Tag key={t} label={t} accent={t === "AI"} />)}
                  </div>
                </div>
                {/* Content */}
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#0a0a0a", marginBottom: "8px", letterSpacing: "-0.01em" }}>{name}</div>
                  <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── [02] INDUSTRIES ── */}
      <section id="industries" style={{ background: "#fafafa", padding: "96px 0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <SectionLabel n="02" label="Industries" />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {INDUSTRIES.map(({ name, tag, desc, items }) => (
              <div key={name} style={{ background: "#fff", border: "1px solid #ebebeb", display: "flex", flexDirection: "column" }}>
                {/* Header */}
                <div style={{ padding: "24px 24px 20px", borderBottom: "1px solid #f5f5f5" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.02em", color: "#0a0a0a" }}>{name}</span>
                    <Tag label={tag} />
                  </div>
                  <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
                {/* Items */}
                <div style={{ padding: "20px 24px", flex: 1 }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#ccc", marginBottom: "12px" }}>Included</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {items.map(item => (
                      <li key={item} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "4px", height: "4px", background: "#1a8a4a", flexShrink: 0 }} />
                        <span style={{ fontSize: "12.5px", color: "#555" }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ padding: "16px 24px", borderTop: "1px solid #f5f5f5" }}>
                  <Link
                    href="/login"
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", fontWeight: 600, color: "#0a0a0a", textDecoration: "none" }}
                    onMouseOver={e => (e.currentTarget.style.color = "#1a8a4a")}
                    onMouseOut={e => (e.currentTarget.style.color = "#0a0a0a")}
                  >
                    Explore {name} <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── [03] AI ── */}
      <section id="ai" style={{ background: "#0a0a0a", padding: "96px 0", borderBottom: "1px solid #161616" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <SectionLabel n="03" label="AI" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
            {/* Left */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                <div style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(26,138,74,0.3)", background: "rgba(26,138,74,0.08)" }}>
                  <Zap style={{ width: "14px", height: "14px", color: "#1a8a4a" }} />
                </div>
                <Tag label="AI" accent />
              </div>

              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 20px", lineHeight: 1.1 }}>
                Documentation<br />that writes itself.
              </h2>

              <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#555", margin: "0 0 36px" }}>
                Briesa uses Claude (Anthropic) to generate contextual WHS content as you work — from toolbox talking points to SWMS descriptions, permit controls and training outlines.
              </p>

              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  ["Toolbox talks",        "Generate numbered speaker talking points from a topic in seconds"],
                  ["SWMS drafting",        "Draft task descriptions and key hazards from the HRCW category"],
                  ["Permit controls",      "Suggest safety controls based on permit type and location"],
                  ["Incident actions",     "Recommend corrective actions from incident type and severity"],
                  ["Course outlines",      "Build structured training content and learning objectives"],
                  ["Licence suggestions",  "Map required tickets and licences to a worker&apos;s role"],
                ].map(([title, desc]) => (
                  <li key={title} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <CheckCircle2 style={{ width: "16px", height: "16px", color: "#1a8a4a", flexShrink: 0, marginTop: "2px" }} />
                    <div>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "#fff" }}>{title}</span>
                      <span style={{ fontSize: "13.5px", color: "#444" }}> — {desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — terminal-style AI card */}
            <div style={{ border: "1px solid #1e1e1e", background: "#0d0d0d" }}>
              {/* Terminal header */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "12px 16px", borderBottom: "1px solid #1e1e1e" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff6058" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
                <span style={{ marginLeft: "8px", fontSize: "10px", fontFamily: "monospace", color: "#444" }}>briesa — ai generate — toolbox talk</span>
              </div>
              {/* Content */}
              <div style={{ padding: "20px", fontFamily: "monospace", fontSize: "12px", lineHeight: 1.8, color: "#555" }}>
                <div><span style={{ color: "#1a8a4a" }}>$</span> <span style={{ color: "#888" }}>briesa generate toolbox</span></div>
                <div style={{ color: "#444" }}>→ Topic: Working at Heights — EWP Operations</div>
                <div style={{ color: "#444" }}>→ Site: Level 3, Site 01</div>
                <br />
                <div style={{ color: "#3ecf8e" }}>Generating talk points...</div>
                <br />
                {[
                  "1. Pre-use inspection of the EWP — check tyres, controls, safety cage and harness anchor points before commencing work.",
                  "2. Exclusion zones — establish and mark a 2m exclusion zone around the EWP base. Spotter required at all times.",
                  "3. Weather limits — cease EWP operations if wind exceeds 45 km/h or lightning is within 10 km.",
                  "4. Emergency descent — demonstrate manual lowering procedure before commencing elevated work.",
                ].map((line, i) => (
                  <div key={i} style={{ color: "#666", marginBottom: "4px" }}>{line}</div>
                ))}
                <br />
                <div style={{ color: "#444" }}>→ <span style={{ color: "#1a8a4a" }}>4 talk points generated</span> · 12s · gpt-4o via Anthropic</div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "16px" }}>
                  <div style={{ width: "8px", height: "8px", background: "#1a8a4a", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
                  <span style={{ color: "#333" }}>Ready to copy or attach to toolbox record</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── [04] WHY BRIESA ── */}
      <section style={{ background: "#fff", padding: "96px 0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <SectionLabel n="04" label="Built for the field" />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
            {/* Left */}
            <div>
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#0a0a0a", margin: "0 0 20px", lineHeight: 1.1 }}>
                Built for the workers,<br />not just the office.
              </h2>
              <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#666", margin: "0 0 32px" }}>
                Most WHS platforms are designed for compliance managers behind a desk.
                Briesa is built for the foreman on Level 3, the plant operator at 06:30,
                and the safety advisor who needs to report an incident before the ambulance leaves site.
              </p>
              <Link
                href="/login"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 700, color: "#fff", background: "#0a0a0a", textDecoration: "none", border: "1px solid #0a0a0a" }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "#222"}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.background = "#0a0a0a"}
              >
                Start for free <ArrowRight size={15} />
              </Link>
            </div>
            {/* Right grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#f0f0f0", border: "1px solid #f0f0f0" }}>
              {[
                ["Full mobile access",   "Report incidents, run prestarts and sign SWMS from your phone on site."],
                ["Offline capable",      "Core safety forms work without a network connection on site."],
                ["Real-time sync",       "All records sync instantly the moment connectivity is restored."],
                ["Role-based access",    "Workers see what they need. Managers and admins see everything."],
              ].map(([title, desc]) => (
                <div key={title} style={{ background: "#fff", padding: "24px 20px" }}>
                  <div style={{ width: "6px", height: "6px", background: "#1a8a4a", marginBottom: "14px" }} />
                  <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0a0a0a", marginBottom: "8px" }}>{title}</div>
                  <div style={{ fontSize: "12.5px", color: "#888", lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ background: "#0a0a0a", padding: "80px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333" }}>[FREE TRIAL]</span>
            <span style={{ fontSize: "11px", color: "#333" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555" }}>No credit card required</span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 16px", lineHeight: 1.05 }}>
            Stop guessing.<br />Get certified.
          </h2>
          <p style={{ fontSize: "16px", color: "#444", margin: "0 0 40px", maxWidth: "400px", marginInline: "auto", lineHeight: 1.6 }}>
            14-day free trial. Full access to all modules.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <Link
              href="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 32px", fontSize: "15px", fontWeight: 700, color: "#0a0a0a", background: "#fff", textDecoration: "none", border: "1px solid #fff" }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "#f0f0f0"}
              onMouseOut={e => (e.currentTarget as HTMLElement).style.background = "#fff"}
            >
              Get started free <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", fontSize: "15px", fontWeight: 500, color: "#666", background: "transparent", textDecoration: "none", border: "1px solid #2a2a2a" }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.borderColor = "#444"}
              onMouseOut={e => (e.currentTarget as HTMLElement).style.borderColor = "#2a2a2a"}
            >
              View demo workspace
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#060606", borderTop: "1px solid #111", padding: "56px 0 32px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", gap: "48px", marginBottom: "56px" }}>
            {/* Brand */}
            <div style={{ flex: "0 0 220px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <BLogo size={18} color="#1a8a4a" />
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Briesa</span>
                <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, color: "#333" }}>V1.0</span>
              </div>
              <p style={{ fontSize: "12.5px", color: "#444", lineHeight: 1.7, margin: "0 0 20px" }}>
                WHS management software for Australian construction, industrial and facilities industries.
              </p>
              {/* Social icons */}
              <div style={{ display: "flex", gap: "10px" }}>
                {["X", "IN", "IG"].map(s => (
                  <div key={s} style={{ width: "28px", height: "28px", border: "1px solid #1e1e1e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, fontFamily: "monospace", color: "#444" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Links */}
            <div style={{ flex: 1, display: "flex", gap: "48px", flexWrap: "wrap" }}>
              {[
                ["Product",    ["Platform", "Industries", "AI", "Pricing", "Changelog"]],
                ["Industries", ["Construction", "Industrial", "Facilities"]],
                ["Company",    ["About", "Contact", "Privacy", "Terms"]],
                ["Legal",      ["Privacy Policy", "Terms of Service", "Cookie Policy"]],
              ].map(([section, links]) => (
                <div key={section as string}>
                  <div style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#333", marginBottom: "14px" }}>{section as string}</div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {(links as string[]).map(link => (
                      <li key={link}>
                        <a
                          href={link === "Pricing" ? "/pricing" : "#"}
                          style={{ fontSize: "13px", color: "#444", textDecoration: "none" }}
                          onMouseOver={e => (e.currentTarget.style.color = "#777")}
                          onMouseOut={e => (e.currentTarget.style.color = "#444")}
                        >{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "24px", borderTop: "1px solid #111" }}>
            <p style={{ fontSize: "11.5px", color: "#333", margin: 0 }}>
              © {new Date().getFullYear()} Briesa. All rights reserved. ABN 00 000 000 000.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "10px", color: "#2a2a2a", fontWeight: 700 }}>V1.0.0</span>
              <span style={{ fontSize: "11.5px", color: "#2a2a2a" }}>SafeWork NSW · Australian Industry</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
