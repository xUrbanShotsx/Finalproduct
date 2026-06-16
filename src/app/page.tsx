import Link from "next/link";
import {
  Shield, Users, Settings, AlertTriangle, CheckSquare,
  ArrowRight, CheckCircle2, MapPin, Clock, ChevronRight,
  Zap, BarChart3, Building2,
} from "lucide-react";

/* ─── B Logo ─────────────────────────────────────────────────────── */
function BLogo({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill={color} />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill={color} />
    </svg>
  );
}

/* ─── Inline dashboard mockup ─────────────────────────────────────── */
function DashboardMockup() {
  return (
    <div className="w-full max-w-[640px] select-none" style={{ filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.18))" }}>
      {/* Browser chrome */}
      <div className="border" style={{ background: "#f0f0f0", borderColor: "#d0d0d0" }}>
        <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: "#d0d0d0" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: "#ff6058" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
            <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <div className="flex-1 mx-4 px-3 py-1 text-[11px] text-center border" style={{ background: "#ffffff", borderColor: "#d8d8d8", color: "#888" }}>
            app.briesa.com/safety/incidents
          </div>
        </div>

        {/* App shell */}
        <div className="flex overflow-hidden" style={{ height: "380px", background: "#fafafa" }}>

          {/* Sidebar */}
          <div className="flex-shrink-0 w-[150px] border-r overflow-hidden" style={{ background: "#ffffff", borderColor: "#e0e0e0" }}>
            <div className="px-2 py-2.5 space-y-px">
              {/* Dashboard item */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 text-[10px]" style={{ color: "#999" }}>
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#e0e0e0" }} />
                Dashboard
              </div>
              {/* Section label */}
              <div className="px-2.5 pt-2 pb-0.5 text-[8.5px] font-bold uppercase tracking-widest" style={{ color: "#bbb" }}>Modules</div>
              {/* Safety — active */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 text-[10px] font-semibold" style={{ background: "#e0e0e0", color: "#171717" }}>
                <Shield className="w-2.5 h-2.5" style={{ color: "#1a8a4a" }} />
                Safety
              </div>
              {/* Sub items */}
              <div className="ml-3 pl-2 border-l space-y-px" style={{ borderColor: "#e0e0e0" }}>
                {["Incidents","Actions","Toolbox","Prestart","SWMS","Permits"].map((s, i) => (
                  <div key={s} className="px-2 py-1 text-[9.5px]" style={{ color: i === 0 ? "#171717" : "#aaa", background: i === 0 ? "#ebebeb" : "transparent", fontWeight: i === 0 ? 600 : 400 }}>{s}</div>
                ))}
              </div>
              {/* Other modules collapsed */}
              {[["Users","People"],["Settings","Operations"],["AlertTriangle","Risk"]].map(([,name]) => (
                <div key={name} className="flex items-center gap-2 px-2.5 py-1.5 text-[10px]" style={{ color: "#bbb" }}>
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "#eee" }} />
                  {name}
                </div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 h-[36px] border-b flex-shrink-0" style={{ background: "#ffffff", borderColor: "#e0e0e0" }}>
              <BLogo size={14} color="#1a8a4a" />
              <div className="w-px h-3" style={{ background: "#d0d0d0" }} />
              <span className="text-[10px] font-semibold" style={{ color: "#171717" }}>Demo Organisation</span>
              <span className="text-[7.5px] font-bold px-1.5 py-0.5" style={{ background: "#e6f7ed", color: "#1a8a4a" }}>OWNER</span>
              <div className="w-px h-3" style={{ background: "#d0d0d0" }} />
              <span className="text-[10px]" style={{ color: "#999" }}>Safety</span>
              <div className="w-px h-3" style={{ background: "#d0d0d0" }} />
              <span className="text-[10px] font-semibold" style={{ color: "#171717" }}>Incidents</span>
            </div>

            {/* Page header */}
            <div className="px-4 pt-3 pb-2.5 border-b flex items-center justify-between flex-shrink-0" style={{ background: "#ffffff", borderColor: "#e8e8e8" }}>
              <div>
                <div className="text-[12px] font-bold" style={{ color: "#171717" }}>Incidents</div>
                <div className="text-[9px] mt-0.5" style={{ color: "#aaa" }}>Report, investigate and close out incidents</div>
              </div>
              <div className="px-2.5 py-1 text-[9px] font-semibold border" style={{ background: "#e6f7ed", borderColor: "#b3e6c9", color: "#1a8a4a" }}>
                + Report Incident
              </div>
            </div>

            {/* Stats strip */}
            <div className="flex border-b flex-shrink-0" style={{ background: "#ffffff", borderColor: "#e8e8e8" }}>
              {[["2","Open","1 high severity","red"],["1","Under Invest.","INC-044 · day 3","yellow"],["3","Closed","this month","green"],["1.2","TRIFR","target &lt;2.0",""]].map(([val,label,sub,hl]) => (
                <div key={label} className="flex-1 px-3 py-2 border-r" style={{ borderColor: "#f0f0f0" }}>
                  <div className="text-[13px] font-bold" style={{ color: hl === "red" ? "#f06060" : hl === "yellow" ? "#b58a1b" : hl === "green" ? "#1a8a4a" : "#171717" }}>{val}</div>
                  <div className="text-[8.5px] font-semibold" style={{ color: "#555" }}>{label}</div>
                  <div className="text-[8px]" style={{ color: "#bbb" }} dangerouslySetInnerHTML={{ __html: sub }} />
                </div>
              ))}
            </div>

            {/* Incident rows */}
            <div className="flex-1 overflow-hidden px-3 py-2 space-y-1.5">
              {[
                { ref:"INC-044", type:"Near Miss",        loc:"Site 01 — Level 3",  sev:"High",   status:"Under Investigation", days:3,    sevColor:"#f06060" },
                { ref:"INC-043", type:"First Aid Injury", loc:"Site 02 — Laydown",  sev:"Low",    status:"Closed",              days:null, sevColor:"#1a8a4a" },
                { ref:"INC-042", type:"Property Damage",  loc:"Site 01 — B-Block",  sev:"Medium", status:"Closed",              days:null, sevColor:"#b58a1b" },
                { ref:"INC-041", type:"Near Miss",        loc:"Site 03 — Basement", sev:"Medium", status:"Open",                days:16,   sevColor:"#b58a1b" },
              ].map(r => (
                <div key={r.ref} className="flex items-center border overflow-hidden" style={{ borderColor: "#e8e8e8", background: "#fff" }}>
                  <div className="w-0.5 self-stretch flex-shrink-0" style={{ background: r.sevColor }} />
                  <div className="flex-1 flex items-center justify-between px-2.5 py-1.5 gap-3">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold font-mono" style={{ color: "#171717" }}>{r.ref}</span>
                        <span className="text-[8.5px]" style={{ color: "#555" }}>{r.type}</span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2 h-2" style={{ color: "#bbb" }} />
                        <span className="text-[8px]" style={{ color: "#bbb" }}>{r.loc}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[8px] font-bold px-1.5 py-0.5" style={{ background: r.sevColor + "20", color: r.sevColor }}>{r.sev}</span>
                      <span className="text-[8px]" style={{ color: r.status === "Closed" ? "#bbb" : "#555" }}>{r.status}</span>
                      {r.days && <span className="text-[8px] font-bold px-1" style={{ background: r.days > 14 ? "#fee" : "#fef3d6", color: r.days > 14 ? "#f06060" : "#b58a1b" }}>{r.days}d</span>}
                    </div>
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

/* ─── Module cards ────────────────────────────────────────────────── */
const MODULES = [
  {
    icon: Shield, key: "safety", name: "Safety", color: "#f06060",
    desc: "Incidents, SWMS, toolbox talks, permits and prestart checks in one place.",
    features: ["Incident reporting & investigation", "SWMS with sign-off & revision control", "Permit management for HRCW"],
  },
  {
    icon: Users, key: "people", name: "People", color: "#1a6ddb",
    desc: "Workforce credentials, contractor management and health monitoring.",
    features: ["Site inductions & White Card register", "Contractor onboarding & insurance", "Fatigue management & RTW plans"],
  },
  {
    icon: Settings, key: "operations", name: "Operations", color: "#b58a1b",
    desc: "Work planning, plant inspections and traffic management on site.",
    features: ["Daily work planning with controls", "Plant pre-op checks & defect logging", "Work zone & TMP management"],
  },
  {
    icon: AlertTriangle, key: "risk", name: "Risk Management", color: "#f06060",
    desc: "Hazard register, risk assessments and critical risk control verification.",
    features: ["Hazard register by residual risk level", "Daily CRC verification dashboard", "HRCW & psychosocial risk tracking"],
  },
  {
    icon: CheckSquare, key: "compliance", name: "Compliance", color: "#1a8a4a",
    desc: "Audits, legislative register and HRCW compliance evidence.",
    features: ["Inspections & audit scheduling", "Legislative register & notices", "SWMS register with review dates"],
  },
  {
    icon: BarChart3, key: "insights", name: "Insights", color: "#8b5cf6",
    desc: "Live WHS performance metrics, TRIFR tracking and custom reporting.",
    features: ["Live WHS performance dashboard", "TRIFR, LTIFR & incident analytics", "Leading & lagging indicator tracking"],
  },
];

const INDUSTRIES = [
  {
    name: "Construction",
    icon: Building2,
    desc: "From SWMS and HRCW permits to plant pre-ops and work zone management — everything a construction site needs.",
    modules: ["Incidents · SWMS · Permits", "White Card Register", "Plant & Equipment", "High Risk Work", "Work Zone Controls"],
    accent: "#1a8a4a",
  },
  {
    name: "Industrial",
    icon: Settings,
    desc: "Permits to Work, LOTO procedures, JSA/JSEA and chemical process risk built for manufacturing and industrial facilities.",
    modules: ["Permits to Work · LOTO", "JSA / JSEA", "Chemical & Process Risk", "Health Monitoring", "Operational Readiness"],
    accent: "#1a6ddb",
  },
  {
    name: "Facilities",
    icon: Building2,
    desc: "Building warden registers, isolation & shutdown procedures and statutory obligations for facility managers.",
    modules: ["Warden Register", "Isolation & Shutdown", "Essential Safety Measures", "Statutory Obligations", "Visitor & Access"],
    accent: "#b58a1b",
  },
];

/* ─── Page ────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ background: "#fafafa", color: "#171717", fontFamily: "'Space Grotesk', sans-serif" }}>

      {/* ── NAV ── */}
      <header
        className="sticky top-0 z-50 border-b"
        style={{ background: "rgba(250,250,250,0.92)", backdropFilter: "blur(12px)", borderColor: "#e0e0e0" }}
      >
        <div className="max-w-[1200px] mx-auto px-6 h-[58px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <BLogo size={22} color="#1a8a4a" />
            <span style={{ fontSize: "17px", fontWeight: 700, color: "#171717", letterSpacing: "-0.02em" }}>Briesa</span>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7">
            {[["#features","Features"],["#industries","Industries"],["#ai","AI"],["#pricing","Pricing"]].map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: "13.5px", fontWeight: 500, color: "#666", textDecoration: "none" }}
                onMouseOver={e => (e.currentTarget.style.color = "#171717")}
                onMouseOut={e => (e.currentTarget.style.color = "#666")}
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              style={{ fontSize: "13.5px", fontWeight: 500, color: "#555", textDecoration: "none", padding: "7px 16px", border: "1px solid #d0d0d0" }}
            >
              Log in
            </Link>
            <Link
              href="/login"
              style={{ fontSize: "13.5px", fontWeight: 600, color: "#171717", textDecoration: "none", padding: "7px 18px", background: "#e6f7ed", border: "1px solid #b3e6c9" }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid #e8e8e8" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-16">

          {/* Left */}
          <div className="flex-1 max-w-[520px]">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 border mb-6"
              style={{ background: "#e6f7ed", borderColor: "#b3e6c9", fontSize: "12px", fontWeight: 600, color: "#1a8a4a", letterSpacing: "0.05em", textTransform: "uppercase" }}
            >
              <Zap className="w-3.5 h-3.5" />
              Built for Australian Industry
            </div>

            <h1 style={{ fontSize: "clamp(36px,5vw,56px)", fontWeight: 800, lineHeight: 1.07, letterSpacing: "-0.03em", color: "#0d0d0d", margin: 0 }}>
              WHS your team<br />will actually use
            </h1>

            <p style={{ fontSize: "17px", lineHeight: 1.65, color: "#666", marginTop: "20px", maxWidth: "460px" }}>
              Incidents, SWMS, permits and critical risk controls — all in one place.
              Built for Australian construction, industrial and facilities teams.
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Link
                href="/login"
                className="flex items-center gap-2"
                style={{ fontSize: "14.5px", fontWeight: 700, color: "#171717", textDecoration: "none", padding: "11px 24px", background: "#e6f7ed", border: "1px solid #b3e6c9" }}
              >
                Start for free <ArrowRight className="w-4 h-4" style={{ color: "#1a8a4a" }} />
              </Link>
              <Link
                href="/login"
                style={{ fontSize: "14.5px", fontWeight: 500, color: "#555", textDecoration: "none", padding: "11px 24px", border: "1px solid #d8d8d8" }}
              >
                View live demo
              </Link>
            </div>

            {/* Industry chips */}
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <span style={{ fontSize: "12px", color: "#aaa" }}>Built for</span>
              {["Construction","Industrial","Facilities"].map(ind => (
                <span key={ind} style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", border: "1px solid #e0e0e0", color: "#555", background: "#f5f5f5" }}>{ind}</span>
              ))}
            </div>

            {/* Trust line */}
            <div className="flex items-center gap-2 mt-6">
              {[0,1,2,3].map(i => (
                <div key={i} className="w-7 h-7 flex items-center justify-center text-[11px] font-bold" style={{ background: "#e0e0e0", color: "#888" }}>
                  {["A","B","C","D"][i]}
                </div>
              ))}
              <span style={{ fontSize: "12.5px", color: "#999", marginLeft: "4px" }}>
                Trusted by leading Australian construction teams
              </span>
            </div>
          </div>

          {/* Right — mockup */}
          <div className="flex-1 flex justify-center lg:justify-end w-full">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: "#111111", borderBottom: "1px solid #222" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["5 modules",  "All core WHS modules covered"],
            ["3 industries", "Construction · Industrial · Facilities"],
            ["41+ pages",  "Submodule pages, fully interactive"],
            ["AI-powered", "Contextual AI across Safety module"],
          ].map(([stat, label]) => (
            <div key={stat} className="text-center">
              <div style={{ fontSize: "22px", fontWeight: 800, color: "#3ecf8e", letterSpacing: "-0.02em" }}>{stat}</div>
              <div style={{ fontSize: "12.5px", color: "#666", marginTop: "4px" }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES / MODULES ── */}
      <section id="features" style={{ background: "#fafafa", borderBottom: "1px solid #e8e8e8", padding: "96px 0" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a8a4a", marginBottom: "12px" }}>Platform</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0d0d0d", margin: 0 }}>
              Everything you need,<br />nothing you don&apos;t
            </h2>
            <p style={{ fontSize: "16px", color: "#888", marginTop: "14px", maxWidth: "500px", marginInline: "auto" }}>
              Five purpose-built modules that cover every aspect of WHS management, from ground level to board reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES.map(({ icon: Icon, name, desc, features, color }) => (
              <div
                key={name}
                className="p-6 border flex flex-col gap-4 group"
                style={{ background: "#ffffff", borderColor: "#e0e0e0", transition: "border-color 150ms, box-shadow 150ms" }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = "#c0c0c0"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)"; }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e0e0e0"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div className="flex items-start justify-between">
                  <div className="w-9 h-9 flex items-center justify-center border" style={{ background: color + "15", borderColor: color + "30" }}>
                    <Icon className="w-4.5 h-4.5" style={{ color }} />
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "#aaa" }} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "#171717" }}>{name}</div>
                  <div style={{ fontSize: "13px", color: "#888", marginTop: "6px", lineHeight: 1.6 }}>{desc}</div>
                </div>
                <ul className="space-y-1.5 mt-auto">
                  {features.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: "#1a8a4a" }} />
                      <span style={{ fontSize: "12.5px", color: "#666" }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDUSTRIES ── */}
      <section id="industries" style={{ background: "#ffffff", borderBottom: "1px solid #e8e8e8", padding: "96px 0" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a8a4a", marginBottom: "12px" }}>Industries</div>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0d0d0d", margin: 0 }}>
              Purpose-built for<br />your industry
            </h2>
            <p style={{ fontSize: "16px", color: "#888", marginTop: "14px", maxWidth: "480px", marginInline: "auto" }}>
              Different industries have different WHS requirements. Briesa adapts to show only the modules relevant to your team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {INDUSTRIES.map(({ name, desc, modules, accent }) => (
              <div key={name} className="border flex flex-col overflow-hidden" style={{ borderColor: "#e0e0e0", background: "#fafafa" }}>
                {/* Card header */}
                <div className="px-6 py-5 border-b" style={{ borderColor: "#e8e8e8", background: "#ffffff" }}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-2 h-2" style={{ background: accent }} />
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "#0d0d0d" }}>{name}</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                </div>
                {/* Module list */}
                <div className="px-6 py-5 flex-1">
                  <div style={{ fontSize: "10.5px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#aaa", marginBottom: "10px" }}>
                    Included submodules
                  </div>
                  <ul className="space-y-2">
                    {modules.map(m => (
                      <li key={m} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 flex-shrink-0" style={{ background: accent }} />
                        <span style={{ fontSize: "12.5px", color: "#555" }}>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 py-4 border-t" style={{ borderColor: "#e8e8e8" }}>
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5"
                    style={{ fontSize: "13px", fontWeight: 600, color: accent, textDecoration: "none" }}
                  >
                    Explore {name} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section id="ai" style={{ background: "#111111", borderBottom: "1px solid #1e1e1e", padding: "96px 0" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="max-w-[600px]">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 flex items-center justify-center border" style={{ background: "rgba(62,207,142,0.1)", borderColor: "rgba(62,207,142,0.25)" }}>
                <Zap className="w-3.5 h-3.5" style={{ color: "#3ecf8e" }} />
              </div>
              <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#3ecf8e" }}>
                AI-powered
              </span>
            </div>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff", margin: 0 }}>
              Documentation that writes itself
            </h2>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#777", marginTop: "16px" }}>
              Briesa uses Claude (Anthropic) to generate contextual WHS content as you work —
              from toolbox talking points to SWMS descriptions, permit controls and prestart defect summaries.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                ["Toolbox talks", "Generate numbered speaker talking points from a selected topic in seconds"],
                ["SWMS drafting", "Draft task descriptions and key hazards from the HRCW category"],
                ["Permit controls", "Suggest safety controls based on permit type and location"],
                ["Incident actions", "Recommend immediate actions based on incident type and severity"],
              ].map(([title, desc]) => (
                <li key={title} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "#3ecf8e" }} />
                  <div>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "#ffffff" }}>{title}</span>
                    <span style={{ fontSize: "13.5px", color: "#666" }}> — {desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── MOBILE READY ── */}
      <section style={{ background: "#ffffff", borderBottom: "1px solid #e8e8e8", padding: "80px 0" }}>
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a8a4a", marginBottom: "12px" }}>
              Field-first
            </div>
            <h2 style={{ fontSize: "clamp(24px,3.5vw,36px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0d0d0d", margin: 0 }}>
              Built for the workers,<br />not just the office
            </h2>
            <p style={{ fontSize: "15px", color: "#777", lineHeight: 1.7, marginTop: "14px" }}>
              Most WHS platforms are designed for compliance managers behind a desk.
              Briesa is designed for the foreman on Level 3, the plant operator at 06:30,
              and the safety advisor who needs to report an incident before the ambulance leaves site.
            </p>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            {[
              ["Full mobile access",   "Report incidents, run prestarts and sign SWMS from your phone"],
              ["Offline capable",      "Core safety forms work without a network connection on site"],
              ["Real-time sync",       "All records sync instantly when connectivity is restored"],
              ["Role-based access",    "Workers see what they need, managers see everything"],
            ].map(([title, desc]) => (
              <div key={title} className="p-4 border" style={{ background: "#fafafa", borderColor: "#e0e0e0" }}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#171717" }}>{title}</div>
                <div style={{ fontSize: "12px", color: "#888", marginTop: "5px", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section id="pricing" style={{ background: "#e6f7ed", borderBottom: "1px solid #b3e6c9", padding: "80px 0" }}>
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#0d1f12", margin: 0 }}>
            Start managing WHS<br />the right way
          </h2>
          <p style={{ fontSize: "16px", color: "#3a7a52", marginTop: "14px", maxWidth: "460px", marginInline: "auto" }}>
            Get full access to all modules. No credit card required for the demo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              href="/login"
              className="flex items-center gap-2"
              style={{ fontSize: "15px", fontWeight: 700, color: "#0d1f12", textDecoration: "none", padding: "13px 32px", background: "#1a8a4a", border: "1px solid #156a39", color: "#ffffff" }}
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              style={{ fontSize: "15px", fontWeight: 500, color: "#1a8a4a", textDecoration: "none", padding: "13px 28px", border: "1px solid #8ad4ab", background: "#ffffff" }}
            >
              View demo workspace
            </Link>
          </div>
          <p style={{ fontSize: "12.5px", color: "#6aac82", marginTop: "16px" }}>
            Construction · Industrial · Facilities &nbsp;·&nbsp; Australian WHS compliance
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0d0d0d", borderTop: "1px solid #1a1a1a", padding: "56px 0 32px" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 mb-12">
            {/* Brand */}
            <div className="flex-1 max-w-[260px]">
              <div className="flex items-center gap-2.5 mb-4">
                <BLogo size={20} color="#3ecf8e" />
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>Briesa</span>
              </div>
              <p style={{ fontSize: "13px", color: "#555", lineHeight: 1.7 }}>
                WHS management software for Australian construction, industrial and facilities industries.
              </p>
            </div>
            {/* Links */}
            <div className="flex flex-wrap gap-12">
              {[
                ["Product", ["Features","Industries","Pricing","AI","Changelog"]],
                ["Industries", ["Construction","Industrial","Facilities"]],
                ["Company", ["About","Contact","Privacy Policy","Terms of Service"]],
              ].map(([section, links]) => (
                <div key={section as string}>
                  <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#444", marginBottom: "12px" }}>{section as string}</div>
                  <ul className="space-y-2">
                    {(links as string[]).map(link => (
                      <li key={link}>
                        <a href="#" style={{ fontSize: "13px", color: "#666", textDecoration: "none" }}
                          onMouseOver={e => (e.currentTarget.style.color = "#aaa")}
                          onMouseOut={e => (e.currentTarget.style.color = "#666")}
                        >{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t gap-4" style={{ borderColor: "#1e1e1e" }}>
            <p style={{ fontSize: "12px", color: "#444" }}>
              © {new Date().getFullYear()} Briesa. All rights reserved. Built for Australian industry.
            </p>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" style={{ color: "#444" }} />
              <span style={{ fontSize: "12px", color: "#444" }}>Australian Eastern Time &nbsp;·&nbsp; SafeWork NSW compliant</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
