"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Zap, Shield, FileText, Users, BookOpen, BarChart3,
  CheckCircle2, AlertTriangle, Brain, Sparkles, ArrowRight, ChevronRight,
  Building2, Cpu, Home,
} from "lucide-react";

const YELLOW = "#ffd600";
const GREEN  = "#1a8a4a";

/* ─── Logo ────────────────────────────────────────────────────────── */
function BLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill="#fff" />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill="#fff" />
    </svg>
  );
}

/* ─── Scroll reveal ───────────────────────────────────────────────── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── Terminal ────────────────────────────────────────────────────── */
type Line =
  | { k: "blank" }
  | { k: "cmd" | "in" | "status" | "head" | "meta" | "body" | "check" | "warn" | "note"; v: string };

function renderLine(line: Line, i: number) {
  if (line.k === "blank") return <div key={i} style={{ height: "10px" }} />;
  const styles: Record<string, React.CSSProperties> = {
    cmd:    { color: "#666" },
    in:     { color: "#383838" },
    status: { color: GREEN },
    head:   { color: "#c0c0c0", fontWeight: 700, letterSpacing: "0.04em" },
    meta:   { color: "#2e2e2e" },
    body:   { color: "#484848" },
    check:  { color: GREEN },
    warn:   { color: "#8a6a1a" },
    note:   { color: GREEN },
  };
  const text = (line as { v: string }).v;
  if (line.k === "cmd") {
    return <div key={i} style={styles.cmd}><span style={{ color: GREEN }}>$</span> <span style={{ color: "#777" }}>{text.slice(2)}</span></div>;
  }
  return <div key={i} style={styles[line.k] ?? {}}>{line.k === "check" ? "✓ " : ""}{text}</div>;
}

/* ─── AI Feature Data ─────────────────────────────────────────────── */
const AI_FEATURES: { tag: string; name: string; industry: string; desc: string; label: string; lines: Line[] }[] = [
  {
    tag: "01", name: "Toolbox Talk Generator", industry: "WHS · Construction · Industrial",
    desc: "Generate structured safety talks with numbered speaker points for any topic in seconds. Referenced against Australian WHS legislation.",
    label: "briesa — ai — toolbox talk",
    lines: [
      { k: "cmd",    v: '$ briesa ai toolbox --topic "Working at Heights — EWP"' },
      { k: "in",     v: "→ Site: Level 3, Site 01  |  Presenter: J. Smith" },
      { k: "blank" },
      { k: "status", v: "Generating talk points..." },
      { k: "blank" },
      { k: "head",   v: "TOOLBOX TALK — Working at Heights" },
      { k: "meta",   v: "16 Jun 2026 · Level 3, Site 01 · Safety Manager" },
      { k: "blank" },
      { k: "body",   v: "1. Pre-use EWP inspection — check tyres, controls, safety cage and harness anchor points." },
      { k: "body",   v: "2. Exclusion zones — establish a 2m perimeter. Spotter required at all times." },
      { k: "body",   v: "3. Weather limits — cease operations if wind exceeds 45 km/h." },
      { k: "body",   v: "4. Emergency descent — demonstrate manual lowering before elevated work begins." },
      { k: "body",   v: "5. Rescue plan — confirm procedures are briefed and equipment is on standby." },
      { k: "blank" },
      { k: "note",   v: "→ 5 talk points generated · Ready to attach to toolbox record" },
    ],
  },
  {
    tag: "02", name: "SWMS Drafter", industry: "WHS · Construction",
    desc: "Draft Safe Work Method Statements from HRCW category and task description. Hazards, controls and sign-off fields pre-populated.",
    label: "briesa — ai — swms draft",
    lines: [
      { k: "cmd",    v: '$ briesa ai swms --task "EWP façade works" --hrcw "Work at heights"' },
      { k: "in",     v: "→ Location: Level 3 Façade, Site 01" },
      { k: "blank" },
      { k: "status", v: "Drafting SWMS content..." },
      { k: "blank" },
      { k: "head",   v: "TASK: Elevated Work Platform — Level 3 Façade" },
      { k: "meta",   v: "HRCW: Work in area with potential fall of more than 2 metres" },
      { k: "blank" },
      { k: "head",   v: "KEY HAZARDS" },
      { k: "body",   v: "• Fall from height — EWP tip-over or outrigger failure" },
      { k: "body",   v: "• Struck by falling objects — unsecured tools or materials" },
      { k: "body",   v: "• Electrocution — overhead power lines within 3m" },
      { k: "blank" },
      { k: "head",   v: "HIERARCHY OF CONTROLS" },
      { k: "check",  v: "Elimination — restrict access during overhead works" },
      { k: "check",  v: "Engineering — outrigger stabilisers, travel restraints" },
      { k: "check",  v: "PPE — full body harness, anchor to certified points" },
      { k: "blank" },
      { k: "note",   v: "→ Draft complete · Review and customise before worker sign-off" },
    ],
  },
  {
    tag: "03", name: "Incident Action Recommender", industry: "WHS · All industries",
    desc: "Recommend corrective and preventive actions from incident type, severity and causal factors. Referenced to WHS Act notification obligations.",
    label: "briesa — ai — incident actions",
    lines: [
      { k: "cmd",    v: '$ briesa ai actions --incident "INC-044" --severity "High"' },
      { k: "in",     v: "→ Type: Near Miss — EWP near-tip-over · NSW" },
      { k: "blank" },
      { k: "status", v: "Generating recommended actions..." },
      { k: "blank" },
      { k: "head",   v: "IMMEDIATE (within 24 hrs)" },
      { k: "body",   v: "1. Isolate EWP from service — do not operate until inspection complete." },
      { k: "body",   v: "2. Notify SafeWork NSW under WHS Act s.35 (dangerous incident)." },
      { k: "body",   v: "3. Preserve scene — no clean-up until investigation is authorised." },
      { k: "blank" },
      { k: "head",   v: "INVESTIGATION (within 72 hrs)" },
      { k: "body",   v: "4. Root cause analysis — ground conditions, training, pre-op check." },
      { k: "body",   v: "5. Review all pre-op records for last 30 days." },
      { k: "body",   v: "6. Engage third-party inspector for structural assessment." },
      { k: "blank" },
      { k: "note",   v: "→ 6 actions generated · Assign owners and due dates in Briesa" },
    ],
  },
  {
    tag: "04", name: "Permit Controls Suggester", industry: "WHS · Industrial · Facilities",
    desc: "Suggest mandatory and recommended safety controls for any permit type based on work location and hazard profile.",
    label: "briesa — ai — permit controls",
    lines: [
      { k: "cmd",    v: '$ briesa ai permit --type "Hot Work" --location "Basement B1"' },
      { k: "in",     v: "→ Permit type: Hot Work (welding & grinding) · Enclosed space" },
      { k: "blank" },
      { k: "status", v: "Suggesting controls..." },
      { k: "blank" },
      { k: "head",   v: "MANDATORY CONTROLS" },
      { k: "check",  v: "Fire warden assigned, briefed and positioned" },
      { k: "check",  v: "Fire extinguisher within 10m of work area" },
      { k: "check",  v: "Combustibles cleared within 3m radius" },
      { k: "check",  v: "30-minute fire watch after work completion" },
      { k: "blank" },
      { k: "head",   v: "ADDITIONAL RECOMMENDED" },
      { k: "check",  v: "Notify building manager — enable suppression bypass" },
      { k: "check",  v: "Isolate smoke detectors in affected zone" },
      { k: "blank" },
      { k: "warn",   v: "⚠ Confined space entry permit may also be required" },
      { k: "blank" },
      { k: "note",   v: "→ 7 controls added to permit · Ready for sign-off" },
    ],
  },
  {
    tag: "05", name: "CMA Report Generator", industry: "Real Estate",
    desc: "Generate Comparable Market Analysis reports with property comparisons, market commentary and pricing guidance ready to present to vendors.",
    label: "briesa — ai — cma report",
    lines: [
      { k: "cmd",    v: '$ briesa ai cma --property "32 Harbour Street, Manly"' },
      { k: "in",     v: "→ Type: House · 4 bed, 2 bath · 620sqm · Ocean views" },
      { k: "blank" },
      { k: "status", v: "Analysing comparable sales..." },
      { k: "blank" },
      { k: "head",   v: "COMPARABLE MARKET ANALYSIS — Manly NSW 2095" },
      { k: "meta",   v: "Generated 16 Jun 2026 · Harbour & Bay Real Estate" },
      { k: "blank" },
      { k: "head",   v: "RECENT COMPARABLE SALES" },
      { k: "body",   v: "• 18 Bower St, Manly — $2,780,000 (42 DOM, Apr 2026)" },
      { k: "body",   v: "• 9 Stuart St, Manly — $2,950,000 (18 DOM, Mar 2026)" },
      { k: "body",   v: "• 44 Darley Rd, Manly — $3,100,000 (11 DOM, Feb 2026)" },
      { k: "blank" },
      { k: "head",   v: "ESTIMATED PRICE RANGE" },
      { k: "check",  v: "Conservative: $2,750,000 — $2,900,000" },
      { k: "check",  v: "Market: $2,900,000 — $3,100,000" },
      { k: "blank" },
      { k: "note",   v: "→ CMA ready to present to vendor · Export to PDF" },
    ],
  },
  {
    tag: "06", name: "Licence Mapper", industry: "WHS · All industries",
    desc: "Map required tickets, licences and certifications to any role and site type instantly. Flags expiry risks and currency gaps.",
    label: "briesa — ai — licence map",
    lines: [
      { k: "cmd",    v: '$ briesa ai licences --role "Rigger" --site "High-rise construction"' },
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
      { k: "body",   v: "+ EWP Licence — 11m boom or scissors" },
      { k: "body",   v: "+ Dogging Licence — required if directing crane lifts" },
      { k: "blank" },
      { k: "warn",   v: "⚠ First Aid — check renewal date (3-year cycle)" },
      { k: "blank" },
      { k: "note",   v: "→ 6 requirements mapped · Add to competency register" },
    ],
  },
];

/* ─── Capability cards ────────────────────────────────────────────── */
const CAPABILITY_CARDS = [
  { icon: Zap,        title: "Instant document drafting",       body: "SWMS, toolbox talks, course outlines, CMA reports and permit controls drafted in seconds — not hours. AI handles the scaffolding so your team handles the job." },
  { icon: Shield,     title: "Regulatory intelligence",         body: "AI flags when a document, process or control may not meet current Australian WHS legislation. Stays current with SafeWork guidance, AUSTRAC obligations and industry codes." },
  { icon: Brain,      title: "Root cause analysis",             body: "Feed in incident details and get structured ICAM-aligned investigation prompts, causal factor analysis and corrective action recommendations automatically." },
  { icon: BarChart3,  title: "Predictive risk signals",         body: "Surface patterns across incidents, near-misses and actions before they escalate. AI identifies which sites, teams or tasks carry elevated risk." },
  { icon: BookOpen,   title: "Training content builder",        body: "Generate structured course outlines, learning objectives and assessment questions for any WHS topic — referenced to the relevant legislation and codes of practice." },
  { icon: Users,      title: "People & licence tracking",       body: "AI maps required tickets to each role and site type, flags expiries before they become compliance gaps, and surfaces workers approaching renewal dates." },
  { icon: FileText,   title: "AML/CTF document intelligence",   body: "For real estate agencies — AI assists with CDD verification workflows, flags unusual transaction patterns and helps structure SMR documentation for AUSTRAC." },
  { icon: Sparkles,   title: "24/7 Briesa AI assistant",        body: "Every dashboard embeds a context-aware AI assistant. Ask anything: legislation lookups, document help, form guidance, regulation changes — answered instantly." },
];

/* ─── Industry breakdown ──────────────────────────────────────────── */
const INDUSTRIES = [
  {
    icon: Building2,
    name: "Construction",
    color: "#f0a020",
    features: ["SWMS drafting for every HRCW task", "Toolbox talk generation", "Permit controls (Hot Work, Confined Space, Electrical)", "Incident actions with WHS Act obligations", "White Card and HRCW licence mapping"],
  },
  {
    icon: Cpu,
    name: "Industrial",
    color: "#4080f0",
    features: ["Confined space and LOTO permit controls", "Machinery pre-start assessment drafts", "ISO 45001 gap analysis prompts", "Contractor induction pack generation", "Chemical register risk assessment assistance"],
  },
  {
    icon: Shield,
    name: "Facilities",
    color: "#20b060",
    features: ["Emergency evacuation plan drafting", "Contractor management checklist generation", "Preventive maintenance task risk prompts", "Building compliance certificate tracking", "Incident trend analysis across tenancies"],
  },
  {
    icon: Home,
    name: "Real Estate",
    color: "#a040e0",
    features: ["CMA report generation from property data", "AML/CTF CDD workflow guidance", "SMR documentation structuring", "Agency agreement and disclosure prompts", "AUSTRAC reporting obligation summaries"],
  },
];

/* ─── Stats ───────────────────────────────────────────────────────── */
const STATS = [
  { value: "8",    label: "AI capabilities",         note: "embedded across every module" },
  { value: "6",    label: "AI document types",        note: "drafted in under 60 seconds" },
  { value: "4",    label: "Industries supported",     note: "construction, industrial, facilities, real estate" },
  { value: "24/7", label: "AI assistant availability", note: "context-aware, always on" },
  { value: "100%", label: "Australian legislation",   note: "WHS Act, AUSTRAC, state regulations" },
  { value: "<60s", label: "Avg. document draft time", note: "vs hours with manual methods" },
];

/* ─── How it works steps ──────────────────────────────────────────── */
const HOW_STEPS = [
  { n: "01", title: "Tell Briesa what you need", body: "Select a module — Safety, Training, AML/CTF, Properties — and navigate to any AI-powered action. No prompting required; the AI understands the context of where you are." },
  { n: "02", title: "Provide the job context",   body: "Answer a few simple fields: task name, site, industry, personnel. Briesa's AI uses this to generate content that's specific to your work — not generic templates." },
  { n: "03", title: "Review and customise",       body: "AI-generated content is a starting point, not a final document. Review, edit and approve in Briesa before distributing for worker sign-off or regulator submission." },
  { n: "04", title: "Store, assign and track",    body: "Every AI-generated document lives inside Briesa's compliance register — linked to workers, sites and incidents. Full audit trail for any SafeWork or AUSTRAC inspection." },
];

/* ─── Page ────────────────────────────────────────────────────────── */
export default function AIToolboxPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const feature = AI_FEATURES[activeFeature];

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Space Grotesk', sans-serif", color: "#e0e0e0" }}>

      {/* ── Sticky nav ── */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <BLogo size={20} />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>Briesa</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#555", textDecoration: "none" }}>
              <ArrowLeft size={13} /> Home
            </Link>
            <Link href="/signup" style={{ fontSize: "13px", fontWeight: 700, color: "#0a0a0a", textDecoration: "none", padding: "7px 18px", background: YELLOW, border: `1px solid ${YELLOW}` }}>
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ borderBottom: "1px solid #1a1a1a", position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: "-200px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "600px", background: `radial-gradient(circle, ${YELLOW}08 0%, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "96px 24px 80px", textAlign: "center", position: "relative" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "28px", padding: "6px 14px", border: `1px solid ${YELLOW}22`, background: `${YELLOW}08` }}>
              <Sparkles size={12} color={YELLOW} />
              <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: YELLOW, letterSpacing: "0.12em", textTransform: "uppercase" }}>AI Toolbox</span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#ffffff", margin: "0 0 24px" }}>
              Your AI-powered<br />
              <span style={{ color: YELLOW }}>compliance team</span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p style={{ fontSize: "18px", lineHeight: 1.65, color: "#555", maxWidth: "600px", margin: "0 auto 40px" }}>
              Briesa embeds AI across every module — drafting documents, recommending actions, flagging risks and answering legislation questions in real time. Built for Australian businesses who can&apos;t afford to get compliance wrong.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/signup"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", textDecoration: "none", padding: "12px 28px", background: YELLOW }}
              >
                Start free — no credit card
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/demo"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#777", textDecoration: "none", padding: "12px 28px", border: "1px solid #222" }}
              >
                Book a demo
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ borderBottom: "1px solid #1a1a1a", background: "#080808" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", borderLeft: "1px solid #1a1a1a" }}>
            {STATS.map((s, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div style={{ padding: "32px 24px", borderRight: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a" }}>
                  <div style={{ fontSize: "32px", fontWeight: 900, color: YELLOW, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#e0e0e0", marginTop: "6px" }}>{s.label}</div>
                  <div style={{ fontSize: "11px", color: "#333", marginTop: "4px", lineHeight: 1.4 }}>{s.note}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive AI demo ── */}
      <section style={{ borderBottom: "1px solid #1a1a1a", padding: "96px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <Reveal>
            <div style={{ marginBottom: "56px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>[02] — LIVE DEMOS</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.035em", color: "#ffffff", margin: 0 }}>
                AI in action — every tool, every industry
              </h2>
              <p style={{ fontSize: "15px", color: "#444", marginTop: "12px", maxWidth: "520px" }}>
                Click any capability to see a real output from Briesa&apos;s AI models. These are actual outputs — not mockups.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "6px", alignItems: "start" }}>
            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {AI_FEATURES.map((f, i) => (
                <button
                  key={f.tag}
                  onClick={() => setActiveFeature(i)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "14px 16px",
                    background: activeFeature === i ? "#111" : "transparent",
                    border: `1px solid ${activeFeature === i ? "#2a2a2a" : "transparent"}`,
                    cursor: "pointer", transition: "background 100ms",
                  }}
                  onMouseOver={e => { if (activeFeature !== i) (e.currentTarget as HTMLElement).style.background = "#0d0d0d"; }}
                  onMouseOut={e => { if (activeFeature !== i) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, color: activeFeature === i ? "#444" : "#222" }}>[{f.tag}]</span>
                    <span style={{ fontSize: "12.5px", fontWeight: 700, color: activeFeature === i ? "#e0e0e0" : "#444" }}>{f.name}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: activeFeature === i ? YELLOW : "#2a2a2a", fontWeight: 600 }}>{f.industry}</div>
                  {activeFeature === i && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: GREEN }} />
                      <span style={{ fontFamily: "monospace", fontSize: "9px", color: GREEN }}>LIVE OUTPUT</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Terminal output */}
            <div style={{ border: "1px solid #1a1a1a", background: "#060606" }}>
              {/* Chrome */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px", borderBottom: "1px solid #1a1a1a" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff6058" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
                <span style={{ marginLeft: "8px", fontSize: "10px", fontFamily: "monospace", color: "#2a2a2a" }}>{feature.label}</span>
              </div>
              {/* Description bar */}
              <div style={{ padding: "12px 20px 0", borderBottom: "1px solid #111", display: "flex", alignItems: "start", justifyContent: "space-between", gap: "20px" }}>
                <p style={{ fontSize: "12.5px", color: "#444", lineHeight: 1.55, margin: "0 0 12px", maxWidth: "480px" }}>{feature.desc}</p>
                <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, color: "#222", flexShrink: 0, paddingTop: "3px" }}>{feature.industry.toUpperCase()}</span>
              </div>
              {/* Output */}
              <div style={{ padding: "22px 24px", fontFamily: "monospace", fontSize: "12px", lineHeight: 1.85, minHeight: "380px" }}>
                {feature.lines.map((line, i) => renderLine(line, i))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Capability cards ── */}
      <section style={{ borderBottom: "1px solid #1a1a1a", padding: "96px 0", background: "#060606" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <Reveal>
            <div style={{ marginBottom: "56px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>[03] — CAPABILITIES</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.035em", color: "#ffffff", margin: 0 }}>
                AI woven into every workflow
              </h2>
              <p style={{ fontSize: "15px", color: "#444", marginTop: "12px", maxWidth: "520px" }}>
                Not a bolt-on chatbot. Briesa&apos;s AI is purpose-built for compliance operations — every feature has regulatory context baked in.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a" }}>
            {CAPABILITY_CARDS.map((c, i) => {
              const Icon = c.icon;
              return (
                <Reveal key={i} delay={i * 0.04}>
                  <div
                    style={{ background: "#0a0a0a", padding: "28px 24px", transition: "background 150ms" }}
                    onMouseOver={e => ((e.currentTarget as HTMLElement).style.background = "#0f0f0f")}
                    onMouseOut={e => ((e.currentTarget as HTMLElement).style.background = "#0a0a0a")}
                  >
                    <div style={{ width: "38px", height: "38px", display: "flex", alignItems: "center", justifyContent: "center", background: `${YELLOW}12`, marginBottom: "16px" }}>
                      <Icon size={18} color={YELLOW} />
                    </div>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#e0e0e0", margin: "0 0 8px" }}>{c.title}</h3>
                    <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.6, margin: 0 }}>{c.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Industry breakdown ── */}
      <section style={{ borderBottom: "1px solid #1a1a1a", padding: "96px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <Reveal>
            <div style={{ marginBottom: "56px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>[04] — BY INDUSTRY</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.035em", color: "#ffffff", margin: 0 }}>
                Tailored to your industry
              </h2>
              <p style={{ fontSize: "15px", color: "#444", marginTop: "12px", maxWidth: "520px" }}>
                Briesa&apos;s AI speaks the language of your industry — the right legislation, the right terminology, the right obligations.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "6px" }}>
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <Reveal key={ind.name} delay={i * 0.06}>
                  <div style={{ border: "1px solid #1a1a1a", background: "#080808", padding: "28px 24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                      <div style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: `${ind.color}18` }}>
                        <Icon size={18} color={ind.color} />
                      </div>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: "#e0e0e0" }}>{ind.name}</span>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {ind.features.map(feat => (
                        <li key={feat} style={{ display: "flex", alignItems: "start", gap: "8px", fontSize: "12.5px", color: "#444", lineHeight: 1.45 }}>
                          <CheckCircle2 size={13} color={ind.color} style={{ flexShrink: 0, marginTop: "2px" }} />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section style={{ borderBottom: "1px solid #1a1a1a", padding: "96px 0", background: "#060606" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <Reveal>
            <div style={{ marginBottom: "56px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>[05] — HOW IT WORKS</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.035em", color: "#ffffff", margin: 0 }}>
                Four steps from task to compliance
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1px", background: "#1a1a1a", border: "1px solid #1a1a1a" }}>
            {HOW_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.06}>
                <div style={{ background: "#060606", padding: "32px 24px", position: "relative" }}>
                  <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#1e1e1e", letterSpacing: "0.08em", marginBottom: "12px" }}>{step.n}</div>
                  <div style={{ position: "absolute", top: "28px", right: "24px" }}>
                    <ChevronRight size={14} color="#1e1e1e" />
                  </div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#e0e0e0", margin: "0 0 10px", lineHeight: 1.3 }}>{step.title}</h3>
                  <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.6, margin: 0 }}>{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust bar ── */}
      <section style={{ borderBottom: "1px solid #1a1a1a", padding: "48px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <Reveal>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "center", justifyContent: "center" }}>
              {[
                { icon: Shield,        text: "WHS Act 2011 compliant" },
                { icon: AlertTriangle, text: "AML/CTF Act 2006 aware" },
                { icon: CheckCircle2,  text: "No AI output auto-approved" },
                { icon: FileText,      text: "Full audit trail on every document" },
                { icon: Users,         text: "Worker sign-off built in" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <Icon size={14} color="#333" />
                  <span style={{ fontSize: "12.5px", color: "#333", fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "120px 0" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "28px", padding: "6px 14px", border: `1px solid ${YELLOW}22`, background: `${YELLOW}08` }}>
              <Zap size={12} color={YELLOW} />
              <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: YELLOW, letterSpacing: "0.12em", textTransform: "uppercase" }}>Get started today</span>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#ffffff", margin: "0 0 20px", lineHeight: 1.05 }}>
              Stop managing compliance<br />with spreadsheets
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <p style={{ fontSize: "16px", color: "#444", lineHeight: 1.7, margin: "0 auto 40px", maxWidth: "480px" }}>
              Join Australian businesses using Briesa&apos;s AI to stay safe, stay compliant and save hours every week. Free to start — no credit card required.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/signup"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", textDecoration: "none", padding: "14px 32px", background: YELLOW }}
              >
                Start free — no credit card
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/demo"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#555", textDecoration: "none", padding: "14px 32px", border: "1px solid #222" }}
              >
                Book a live demo
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <p style={{ fontSize: "12px", color: "#282828", marginTop: "24px" }}>
              No contracts · Cancel anytime · Australian data residency
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #111", padding: "32px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BLogo size={16} />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#333" }}>Briesa</span>
          </div>
          <p style={{ fontSize: "11.5px", color: "#222", margin: 0 }}>© 2026 Briesa. All rights reserved. AI outputs require human review before use.</p>
        </div>
      </footer>

    </div>
  );
}
