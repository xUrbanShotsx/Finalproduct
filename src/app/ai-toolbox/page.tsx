"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft, Zap, Shield, FileText, Users, BookOpen, BarChart3,
  CheckCircle2, AlertTriangle, Brain, Sparkles, ArrowRight, ChevronRight,
  Building2, Cpu, Home, MapPin,
} from "lucide-react";

const YELLOW = "#ffd600";
const GREEN  = "#1a8a4a";

/* ─── Global keyframe styles ──────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes pulse-glow {
        0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
        50%       { opacity: 1;   transform: translateX(-50%) scale(1.12); }
      }
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
      }
      @keyframes float-a {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        50%       { transform: translateY(-18px) translateX(12px); }
      }
      @keyframes float-b {
        0%, 100% { transform: translateY(0px) translateX(0px); }
        50%       { transform: translateY(14px) translateX(-10px); }
      }
      @keyframes spin-slow {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }
      @keyframes shimmer {
        0%   { background-position: -400% 0; }
        100% { background-position:  400% 0; }
      }
      @keyframes slide-in {
        from { opacity: 0; transform: translateX(-10px); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes fade-up {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes progress-fill {
        from { width: 0%; }
        to   { width: 100%; }
      }
      @keyframes marquee {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      .ticker-track {
        display: flex;
        width: max-content;
        animation: marquee 28s linear infinite;
      }
      .ticker-track:hover { animation-play-state: paused; }
      .cap-card {
        background: #0a0a0a;
        padding: 28px 24px;
        height: 100%;
        display: flex;
        flex-direction: column;
        border-left: 2px solid transparent;
        transition: background 200ms, border-color 200ms, box-shadow 200ms;
        cursor: default;
      }
      .cap-card:hover {
        background: #0e0e0e !important;
        border-left-color: ${YELLOW} !important;
        box-shadow: inset 3px 0 24px rgba(255,214,0,0.04);
      }
      .cap-card:hover .cap-icon {
        background: rgba(255,214,0,0.2) !important;
        transform: scale(1.08);
      }
      .cap-icon {
        transition: background 200ms, transform 200ms;
      }
      .ind-card {
        border: 1px solid #1a1a1a;
        background: #080808;
        padding: 28px 24px;
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: border-color 250ms, background 250ms;
      }
      .step-card {
        background: #060606;
        padding: 32px 24px;
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: background 200ms;
        cursor: default;
      }
      .step-card:hover { background: #0c0c0c !important; }
      .step-card:hover .step-num { color: ${YELLOW} !important; }
      .step-num { transition: color 200ms; }
      .feat-btn {
        display: block; width: 100%; text-align: left;
        padding: 14px 16px;
        border: 1px solid transparent;
        border-left: 2px solid transparent;
        cursor: pointer;
        transition: background 150ms, border-color 150ms;
      }
      .feat-btn:hover { background: #0d0d0d; }
      .feat-btn.active {
        background: #111;
        border-color: #2a2a2a;
        border-left-color: ${YELLOW};
      }
      .pulse-dot {
        width: 6px; height: 6px; border-radius: 50%;
        background: ${YELLOW};
        animation: blink 1.4s ease-in-out infinite;
      }
      .ai-badge-pulse {
        animation: blink 2s ease-in-out infinite;
      }
      .hero-glow {
        animation: pulse-glow 4s ease-in-out infinite;
      }
      .orb-a { animation: float-a 7s ease-in-out infinite; }
      .orb-b { animation: float-b 9s ease-in-out infinite; }
      .shimmer-text {
        background: linear-gradient(90deg, #555 0%, #e0e0e0 40%, #555 60%, #555 100%);
        background-size: 400% 100%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        animation: shimmer 4s linear infinite;
      }
      .trust-item {
        display: flex; align-items: center; gap: 8px;
        opacity: 0.4; transition: opacity 200ms;
      }
      .trust-item:hover { opacity: 1; }
      .reveal-child { height: 100%; }
    `}</style>
  );
}

/* ─── Logo ────────────────────────────────────────────────────────── */
function BLogo({ size = 20, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill={color} />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill={color} />
    </svg>
  );
}

/* ─── Scroll progress bar ─────────────────────────────────────────── */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      setPct(el.scrollTop / (el.scrollHeight - el.clientHeight) * 100);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 100, background: "#111" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: YELLOW, transition: "width 60ms linear" }} />
    </div>
  );
}

/* ─── Scroll reveal ───────────────────────────────────────────────── */
function Reveal({ children, delay = 0, fullHeight = false }: { children: React.ReactNode; delay?: number; fullHeight?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ height: fullHeight ? "100%" : undefined, opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s` }}>
      {children}
    </div>
  );
}

/* ─── Animated stat counter ───────────────────────────────────────── */
function AnimatedStat({ value, label, note, delay }: { value: string; label: string; note: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.1 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ padding: "32px 24px", borderRight: "1px solid #1a1a1a", borderBottom: "1px solid #1a1a1a", opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(16px)", transition: `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s` }}>
      <div style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1, color: shown ? YELLOW : "#333", transition: `color 0.4s ease ${delay + 0.2}s` }}>{value}</div>
      <div style={{ fontSize: "13px", fontWeight: 700, color: "#e0e0e0", marginTop: "6px" }}>{label}</div>
      <div style={{ fontSize: "11px", color: "#333", marginTop: "4px", lineHeight: 1.4 }}>{note}</div>
    </div>
  );
}

/* ─── Dashboard mockup ────────────────────────────────────────────── */
interface FeatureMockup {
  url: string;
  module: string;
  submodule: string;
  moduleColor: string;
  pageTitle: string;
  pageSubtitle: string;
  actionLabel: string;
  content: React.ReactNode;
}

const SIDEBAR_MODULES = [
  { name: "Safety",     color: "#f06060" },
  { name: "People",     color: "#1a6ddb" },
  { name: "Operations", color: "#b58a1b" },
  { name: "Risk",       color: "#e06030" },
  { name: "Compliance", color: "#1a8a4a" },
  { name: "Training",   color: "#0ea5e9" },
  { name: "Insights",   color: "#8b5cf6" },
];

function DashboardPreview({ mockup, visible }: { mockup: FeatureMockup; visible: boolean }) {
  const activeModule = SIDEBAR_MODULES.find(m => m.name === mockup.module) ?? SIDEBAR_MODULES[0];
  const safetySubItems = ["Incidents", "Actions", "Toolbox", "Prestart", "SWMS", "Permits"];
  const peopleSubItems = ["Workers", "Contractors", "Licences", "Inductions"];
  const subItems = mockup.module === "People" ? peopleSubItems : safetySubItems;

  return (
    <div style={{ width: "100%", background: "#080808", border: "1px solid #1e1e1e", overflow: "hidden", filter: "drop-shadow(0 32px 80px rgba(0,0,0,0.8))", opacity: visible ? 1 : 0, transform: visible ? "translateY(0) scale(1)" : "translateY(12px) scale(0.98)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
      {/* Browser chrome */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 14px", borderBottom: "1px solid #1a1a1a", background: "#0c0c0c" }}>
        <div style={{ display: "flex", gap: "5px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff6058" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28c840" }} />
        </div>
        <div style={{ flex: 1, margin: "0 10px", padding: "3px 10px", fontSize: "10px", textAlign: "center", border: "1px solid #1e1e1e", background: "#111", color: "#444", fontFamily: "monospace" }}>
          {mockup.url}
        </div>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1a1a1a" }} />
      </div>

      {/* App shell */}
      <div style={{ display: "flex", height: "460px" }}>

        {/* Sidebar */}
        <div style={{ width: "148px", flexShrink: 0, borderRight: "1px solid #1a1a1a", background: "#0c0c0c", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 10px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
            <BLogo size={13} color={GREEN} />
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#e0e0e0", letterSpacing: "-0.02em" }}>Briesa</span>
          </div>
          <div style={{ flex: 1, overflowY: "hidden", padding: "8px 6px" }}>
            <div style={{ fontSize: "7.5px", fontWeight: 700, letterSpacing: "0.1em", color: "#2a2a2a", textTransform: "uppercase", padding: "0 4px 5px" }}>Modules</div>
            {SIDEBAR_MODULES.map(m => (
              <div key={m.name}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 8px", background: m.name === mockup.module ? "#1a1a1a" : "transparent", borderLeft: m.name === mockup.module ? `2px solid ${m.color}` : "2px solid transparent" }}>
                  <div style={{ width: "8px", height: "8px", background: m.color, opacity: m.name === mockup.module ? 1 : 0.18, flexShrink: 0 }} />
                  <span style={{ fontSize: "10px", fontWeight: m.name === mockup.module ? 700 : 400, color: m.name === mockup.module ? "#e0e0e0" : "#2e2e2e" }}>{m.name}</span>
                </div>
                {m.name === mockup.module && (
                  <div style={{ marginLeft: "18px", paddingLeft: "8px", borderLeft: "1px solid #1e1e1e" }}>
                    {subItems.map(s => (
                      <div key={s} style={{ padding: "3.5px 6px", fontSize: "9.5px", color: s === mockup.submodule ? "#e0e0e0" : "#333", background: s === mockup.submodule ? "#1e1e1e" : "transparent", fontWeight: s === mockup.submodule ? 600 : 400 }}>{s}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 10px", borderTop: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#1a1a1a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "8px", fontWeight: 700, color: "#444" }}>JS</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "9px", fontWeight: 600, color: "#555" }}>J. Smith</div>
              <div style={{ fontSize: "8px", color: "#2a2a2a" }}>Safety Mgr</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          {/* Topbar */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "0 14px", height: "36px", borderBottom: "1px solid #1a1a1a", background: "#0c0c0c", flexShrink: 0 }}>
            <span style={{ fontSize: "9.5px", color: "#333" }}>{mockup.module}</span>
            <span style={{ fontSize: "9px", color: "#222" }}>/</span>
            <span style={{ fontSize: "9.5px", fontWeight: 600, color: "#e0e0e0" }}>{mockup.submodule}</span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
              <div className="ai-badge-pulse" style={{ display: "flex", alignItems: "center", gap: "4px", padding: "2px 7px", background: `${YELLOW}10`, border: `1px solid ${YELLOW}20` }}>
                <div className="pulse-dot" />
                <span style={{ fontSize: "8px", fontWeight: 700, color: YELLOW, fontFamily: "monospace" }}>AI ACTIVE</span>
              </div>
              <div style={{ fontSize: "8.5px", fontWeight: 700, padding: "2px 6px", background: `${GREEN}12`, color: GREEN }}>OWNER</div>
            </div>
          </div>

          {/* Page header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #1a1a1a", background: "#0c0c0c", flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#e0e0e0" }}>{mockup.pageTitle}</div>
              <div style={{ fontSize: "9px", color: "#444", marginTop: "2px" }}>{mockup.pageSubtitle}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "5px 10px", fontSize: "9px", fontWeight: 600, border: `1px solid ${activeModule.color}40`, background: `${activeModule.color}10`, color: activeModule.color, flexShrink: 0 }}>
              <Sparkles style={{ width: "8px", height: "8px" }} />
              {mockup.actionLabel}
            </div>
          </div>

          {/* Dynamic content */}
          <div style={{ flex: 1, overflow: "hidden", background: "#0a0a0a" }}>
            {mockup.content}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature mockup content ──────────────────────────────────────── */
const FEATURE_MOCKUPS: FeatureMockup[] = [
  {
    url: "app.briesa.com/safety/toolbox",
    module: "Safety", submodule: "Toolbox", moduleColor: "#f06060",
    pageTitle: "Toolbox Talks", pageSubtitle: "AI-generated speaker points for any WHS topic",
    actionLabel: "Generate with AI",
    content: (
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px", height: "100%" }}>
        <div style={{ padding: "10px 12px", border: `1px solid ${YELLOW}25`, background: `${YELLOW}06` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <Sparkles style={{ width: "10px", height: "10px", color: YELLOW }} />
            <span style={{ fontSize: "9.5px", fontWeight: 700, color: YELLOW }}>AI Generated — Working at Heights (EWP)</span>
            <span style={{ marginLeft: "auto", fontSize: "8px", fontWeight: 700, padding: "1px 5px", background: `${GREEN}15`, color: GREEN }}>READY</span>
          </div>
          <div style={{ display: "flex", gap: "8px", fontSize: "8.5px", color: "#444", marginBottom: "8px" }}>
            <span>Site 01 · Level 3</span><span style={{ color: "#222" }}>·</span><span>J. Smith</span><span style={{ color: "#222" }}>·</span><span>16 Jun 2026</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {["Pre-use EWP inspection — check tyres, controls, safety cage and harness anchor points before commencing work.", "Exclusion zones — establish a 2m perimeter around EWP base. Spotter required at all times.", "Weather limits — cease operations if wind exceeds 45 km/h or lightning within 10 km.", "Emergency descent — demonstrate manual lowering procedure before elevated work begins.", "Rescue plan — confirm procedures are briefed and equipment is on standby."].map((pt, i) => (
              <div key={i} style={{ display: "flex", alignItems: "start", gap: "6px" }}>
                <span style={{ fontSize: "8px", fontWeight: 800, color: "#f06060", flexShrink: 0, marginTop: "1px" }}>{i + 1}</span>
                <span style={{ fontSize: "9px", color: "#555", lineHeight: 1.45 }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2a2a2a" }}>Recent talks</div>
        {[{ topic: "Electrical Safety — LOTO", date: "12 Jun", att: 8 }, { topic: "Manual Handling — Lower Back Risk", date: "9 Jun", att: 12 }, { topic: "Heat Stress Management", date: "5 Jun", att: 7 }].map((t, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", border: "1px solid #1a1a1a", background: "#0d0d0d" }}>
            <div>
              <div style={{ fontSize: "9.5px", fontWeight: 600, color: "#888" }}>{t.topic}</div>
              <div style={{ fontSize: "8px", color: "#2e2e2e", marginTop: "1px" }}>{t.date} · {t.att} attendees</div>
            </div>
            <span style={{ fontSize: "7.5px", fontWeight: 700, padding: "1px 5px", background: `${GREEN}12`, color: GREEN }}>SIGNED</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    url: "app.briesa.com/safety/swms",
    module: "Safety", submodule: "SWMS", moduleColor: "#f06060",
    pageTitle: "Safe Work Method Statements", pageSubtitle: "Draft, assign and track HRCW SWMS",
    actionLabel: "Draft with AI",
    content: (
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px", height: "100%" }}>
        <div style={{ border: `1px solid ${YELLOW}22`, background: `${YELLOW}05` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 10px", borderBottom: `1px solid ${YELLOW}15` }}>
            <Sparkles style={{ width: "9px", height: "9px", color: YELLOW }} />
            <span style={{ fontSize: "9.5px", fontWeight: 700, color: YELLOW }}>SWMS-047 — EWP Façade Works</span>
            <span style={{ marginLeft: "auto", fontSize: "7.5px", fontWeight: 700, padding: "1px 5px", background: "#b58a1b20", color: "#b58a1b" }}>DRAFT</span>
          </div>
          <div style={{ padding: "8px 10px" }}>
            <div style={{ display: "flex", gap: "16px", marginBottom: "8px" }}>
              <div><div style={{ fontSize: "7.5px", color: "#2a2a2a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>HRCW</div><div style={{ fontSize: "8.5px", color: "#666", marginTop: "2px" }}>Work at heights (&gt; 2m)</div></div>
              <div><div style={{ fontSize: "7.5px", color: "#2a2a2a", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Location</div><div style={{ fontSize: "8.5px", color: "#666", marginTop: "2px" }}>Level 3 Façade, Site 01</div></div>
            </div>
            <div style={{ border: "1px solid #1e1e1e", overflow: "hidden" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#111", borderBottom: "1px solid #1e1e1e" }}>
                <div style={{ padding: "4px 8px", fontSize: "7.5px", fontWeight: 700, color: "#333", borderRight: "1px solid #1e1e1e" }}>HAZARD</div>
                <div style={{ padding: "4px 8px", fontSize: "7.5px", fontWeight: 700, color: "#333" }}>CONTROL</div>
              </div>
              {[["Fall from height", "Full body harness + anchor"], ["Struck by objects", "Exclusion zone + spotter"], ["Electrocution (OHL)", "3m clearance enforced"]].map(([h, c], i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: i > 0 ? "1px solid #1a1a1a" : undefined }}>
                  <div style={{ padding: "5px 8px", fontSize: "8.5px", color: "#555", borderRight: "1px solid #1a1a1a", display: "flex", alignItems: "center", gap: "4px" }}><AlertTriangle style={{ width: "7px", height: "7px", color: "#f06060", flexShrink: 0 }} />{h}</div>
                  <div style={{ padding: "5px 8px", fontSize: "8.5px", color: "#555", display: "flex", alignItems: "center", gap: "4px" }}><CheckCircle2 style={{ width: "7px", height: "7px", color: GREEN, flexShrink: 0 }} />{c}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {[{ ref: "SWMS-046", task: "Concrete pour — Level 2 slab", status: "Active", workers: 6 }, { ref: "SWMS-045", task: "Scaffold erect — North elevation", status: "Active", workers: 4 }, { ref: "SWMS-044", task: "Electrical rough-in — B-Block", status: "Closed", workers: 2 }].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", border: "1px solid #1a1a1a", background: "#0d0d0d" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ fontSize: "8px", fontFamily: "monospace", color: "#333" }}>{s.ref}</span><span style={{ fontSize: "9px", fontWeight: 600, color: "#777" }}>{s.task}</span></div>
              <div style={{ fontSize: "8px", color: "#2e2e2e", marginTop: "1px" }}>{s.workers} workers signed</div>
            </div>
            <span style={{ fontSize: "7.5px", fontWeight: 700, padding: "1px 5px", background: s.status === "Active" ? `${GREEN}12` : "#1a1a1a", color: s.status === "Active" ? GREEN : "#333" }}>{s.status}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    url: "app.briesa.com/safety/incidents/INC-044",
    module: "Safety", submodule: "Incidents", moduleColor: "#f06060",
    pageTitle: "INC-044 — Near Miss", pageSubtitle: "EWP near-tip-over · Level 3, Site 01 · 14 Jun 2026",
    actionLabel: "Generate Actions",
    content: (
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px", height: "100%" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          {[["Severity", "HIGH", "#f06060"], ["Status", "Investigating", "#b58a1b"], ["Due", "17 Jun", "#444"]].map(([k, v, c]) => (
            <div key={k as string} style={{ flex: 1, padding: "6px 8px", border: "1px solid #1a1a1a", background: "#0d0d0d" }}>
              <div style={{ fontSize: "7.5px", color: "#2a2a2a", fontWeight: 700, textTransform: "uppercase" }}>{k}</div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: c as string, marginTop: "2px" }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ border: `1px solid ${YELLOW}22`, background: `${YELLOW}05` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 10px", borderBottom: `1px solid ${YELLOW}15` }}>
            <Sparkles style={{ width: "9px", height: "9px", color: YELLOW }} />
            <span style={{ fontSize: "9px", fontWeight: 700, color: YELLOW }}>AI Recommended Actions</span>
            <span style={{ marginLeft: "auto", fontSize: "7.5px", color: "#444" }}>6 generated</span>
          </div>
          <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: "5px" }}>
            {[{ label: "IMMEDIATE", color: "#f06060", items: ["Isolate EWP — do not operate until inspection complete", "Notify SafeWork NSW under WHS Act s.35", "Preserve scene — no clean-up until authorised"] }, { label: "72 HRS", color: "#b58a1b", items: ["Root cause: ground conditions, training, pre-op records", "Engage third-party structural inspector"] }].map(group => (
              <div key={group.label}>
                <div style={{ fontSize: "7.5px", fontWeight: 700, color: group.color, letterSpacing: "0.08em", marginBottom: "4px" }}>{group.label}</div>
                {group.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "start", gap: "5px", marginBottom: "3px" }}>
                    <div style={{ width: "12px", height: "12px", border: `1px solid ${group.color}40`, background: `${group.color}10`, flexShrink: 0 }} />
                    <span style={{ fontSize: "8.5px", color: "#555", lineHeight: 1.4 }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "start", gap: "6px", padding: "7px 10px", border: "1px solid #f0606020", background: "#f0606006" }}>
          <AlertTriangle style={{ width: "9px", height: "9px", color: "#f06060", flexShrink: 0, marginTop: "1px" }} />
          <span style={{ fontSize: "8.5px", color: "#555", lineHeight: 1.4 }}>Dangerous incident — regulator notification required within 24 hours under WHS Act s.35.</span>
        </div>
      </div>
    ),
  },
  {
    url: "app.briesa.com/safety/permits",
    module: "Safety", submodule: "Permits", moduleColor: "#f06060",
    pageTitle: "Permits to Work", pageSubtitle: "AI-suggested controls for every permit type",
    actionLabel: "Suggest Controls",
    content: (
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px", height: "100%" }}>
        <div style={{ border: `1px solid ${YELLOW}22`, background: `${YELLOW}05` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 10px", borderBottom: `1px solid ${YELLOW}15` }}>
            <Sparkles style={{ width: "9px", height: "9px", color: YELLOW }} />
            <span style={{ fontSize: "9.5px", fontWeight: 700, color: YELLOW }}>PTW-031 — Hot Work · Basement B1</span>
            <span style={{ marginLeft: "auto", fontSize: "7.5px", fontWeight: 700, padding: "1px 5px", background: "#b58a1b20", color: "#b58a1b" }}>PENDING</span>
          </div>
          <div style={{ padding: "8px 10px" }}>
            <div style={{ fontSize: "7.5px", fontWeight: 700, color: "#2e2e2e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>AI Mandatory Controls</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {[{ done: true, text: "Fire warden assigned, briefed and positioned" }, { done: true, text: "Fire extinguisher within 10m of work area" }, { done: true, text: "Combustibles cleared within 3m radius" }, { done: false, text: "30-minute fire watch after work completion" }, { done: false, text: "Notify building manager — suppression bypass" }, { done: false, text: "Isolate smoke detectors in affected zone" }].map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "12px", height: "12px", border: `1px solid ${c.done ? GREEN : "#2a2a2a"}`, background: c.done ? `${GREEN}20` : "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {c.done && <CheckCircle2 style={{ width: "8px", height: "8px", color: GREEN }} />}
                  </div>
                  <span style={{ fontSize: "8.5px", color: c.done ? "#555" : "#444", lineHeight: 1.4 }}>{c.text}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "8px", padding: "5px 8px", border: "1px solid #b58a1b20", background: "#b58a1b06", display: "flex", alignItems: "center", gap: "5px" }}>
              <AlertTriangle style={{ width: "8px", height: "8px", color: "#b58a1b", flexShrink: 0 }} />
              <span style={{ fontSize: "8px", color: "#555" }}>Confined space entry permit may also be required</span>
            </div>
          </div>
        </div>
        {[{ ref: "PTW-030", type: "Confined Space", loc: "Basement B2", status: "Active" }, { ref: "PTW-029", type: "Electrical Isolation", loc: "DB-3, Level 2", status: "Closed" }].map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", border: "1px solid #1a1a1a", background: "#0d0d0d" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px" }}><span style={{ fontSize: "8px", fontFamily: "monospace", color: "#333" }}>{p.ref}</span><span style={{ fontSize: "9px", fontWeight: 600, color: "#666" }}>{p.type}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: "3px", marginTop: "1px" }}><MapPin style={{ width: "7px", height: "7px", color: "#2a2a2a" }} /><span style={{ fontSize: "8px", color: "#2e2e2e" }}>{p.loc}</span></div>
            </div>
            <span style={{ fontSize: "7.5px", fontWeight: 700, padding: "1px 5px", background: p.status === "Active" ? `${GREEN}12` : "#1a1a1a", color: p.status === "Active" ? GREEN : "#333" }}>{p.status}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    url: "app.briesa.com/people/licences",
    module: "People", submodule: "Licences", moduleColor: "#1a6ddb",
    pageTitle: "Licence & Competency Register", pageSubtitle: "AI maps required tickets to every role and site type",
    actionLabel: "Map Licences",
    content: (
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px", height: "100%" }}>
        <div style={{ border: `1px solid ${YELLOW}22`, background: `${YELLOW}05` }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 10px", borderBottom: `1px solid ${YELLOW}15` }}>
            <Sparkles style={{ width: "9px", height: "9px", color: YELLOW }} />
            <span style={{ fontSize: "9.5px", fontWeight: 700, color: YELLOW }}>Role map — Rigger · High-rise Construction (NSW)</span>
          </div>
          <div style={{ padding: "8px 10px" }}>
            <div style={{ fontSize: "7.5px", fontWeight: 700, color: "#2e2e2e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Mandatory</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", marginBottom: "8px" }}>
              {["Rigging Licence — Basic or Intermediate (HRCW)", "Construction Induction — White Card CPCCWHS1001", "Working at Heights — site-specific training"].map((lic, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}><CheckCircle2 style={{ width: "10px", height: "10px", color: GREEN, flexShrink: 0 }} /><span style={{ fontSize: "8.5px", color: "#555" }}>{lic}</span></div>
              ))}
            </div>
            <div style={{ fontSize: "7.5px", fontWeight: 700, color: "#2e2e2e", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Recommended</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              {["EWP Licence — 11m boom or scissors", "Dogging Licence — crane lift directing"].map((lic, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}><div style={{ width: "10px", height: "10px", border: "1px solid #2a2a2a", flexShrink: 0 }} /><span style={{ fontSize: "8.5px", color: "#3a3a3a" }}>{lic}</span></div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#2a2a2a" }}>Workers — expiry alerts</div>
        {[{ name: "T. Morrison", role: "Rigger", alert: "First Aid expires 2 Jul", level: "warn" }, { name: "K. Barnes", role: "Rigger", alert: "All licences current", level: "ok" }, { name: "D. Walsh", role: "Dogman", alert: "EWP ticket expired", level: "err" }].map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", border: `1px solid ${w.level === "err" ? "#f0606020" : "#1a1a1a"}`, background: w.level === "err" ? "#f0606005" : "#0d0d0d" }}>
            <div>
              <div style={{ fontSize: "9px", fontWeight: 600, color: "#777" }}>{w.name} <span style={{ fontWeight: 400, color: "#333" }}>· {w.role}</span></div>
              <div style={{ fontSize: "8px", color: w.level === "err" ? "#f06060" : w.level === "warn" ? "#b58a1b" : "#2e2e2e", marginTop: "1px" }}>{w.alert}</div>
            </div>
            <span style={{ fontSize: "7.5px", fontWeight: 700, padding: "1px 5px", background: w.level === "err" ? "#f0606015" : w.level === "warn" ? "#b58a1b15" : `${GREEN}12`, color: w.level === "err" ? "#f06060" : w.level === "warn" ? "#b58a1b" : GREEN }}>
              {w.level === "err" ? "EXPIRED" : w.level === "warn" ? "EXPIRING" : "CURRENT"}
            </span>
          </div>
        ))}
      </div>
    ),
  },
];

/* ─── Feature selector data ───────────────────────────────────────── */
const AI_FEATURES = [
  { tag: "01", name: "Toolbox Talk Generator",      industry: "WHS · Construction · Industrial", desc: "Generate structured safety talks with numbered speaker points for any topic in seconds. Referenced against Australian WHS legislation." },
  { tag: "02", name: "SWMS Drafter",                industry: "WHS · Construction",              desc: "Draft Safe Work Method Statements from HRCW category and task description. Hazards, controls and sign-off fields pre-populated." },
  { tag: "03", name: "Incident Action Recommender", industry: "WHS · All industries",             desc: "Recommend corrective and preventive actions from incident type, severity and causal factors. Referenced to WHS Act notification obligations." },
  { tag: "04", name: "Permit Controls Suggester",   industry: "WHS · Industrial · Facilities",   desc: "Suggest mandatory and recommended safety controls for any permit type based on work location and hazard profile." },
  { tag: "05", name: "Licence Mapper",               industry: "WHS · All industries",            desc: "Map required tickets, licences and certifications to any role and site type instantly. Flags expiry risks and currency gaps." },
];

/* ─── Capability cards ────────────────────────────────────────────── */
const CAPABILITY_CARDS = [
  { icon: Zap,        title: "Instant document drafting",     body: "SWMS, toolbox talks, course outlines and permit controls drafted in seconds — not hours. AI handles the scaffolding so your team handles the job." },
  { icon: Shield,     title: "Regulatory intelligence",       body: "AI flags when a document, process or control may not meet current Australian WHS legislation. Stays current with SafeWork guidance and industry codes." },
  { icon: Brain,      title: "Root cause analysis",           body: "Feed in incident details and get ICAM-aligned investigation prompts, causal factor analysis and corrective action recommendations automatically." },
  { icon: BarChart3,  title: "Predictive risk signals",       body: "Surface patterns across incidents, near-misses and actions before they escalate. AI identifies which sites, teams or tasks carry elevated risk." },
  { icon: BookOpen,   title: "Training content builder",      body: "Generate structured course outlines, learning objectives and assessment questions for any WHS topic — referenced to the relevant legislation and codes of practice." },
  { icon: Users,      title: "People & licence tracking",     body: "AI maps required tickets to each role and site type, flags expiries before they become compliance gaps, and surfaces workers approaching renewal dates." },
  { icon: FileText,   title: "Document intelligence",         body: "AI reviews SWMS, permits and policies against relevant legislation and flags gaps before they reach your workers or regulators." },
  { icon: Sparkles,   title: "24/7 Briesa AI assistant",      body: "Every dashboard embeds a context-aware AI assistant. Ask anything: legislation lookups, document help, form guidance, regulation changes — answered instantly." },
];

/* ─── Industry breakdown ──────────────────────────────────────────── */
const INDUSTRIES = [
  { icon: Building2, name: "Construction", color: "#f0a020", features: ["SWMS drafting for every HRCW task", "Toolbox talk generation", "Permit controls (Hot Work, Confined Space, Electrical)", "Incident actions with WHS Act obligations", "White Card and HRCW licence mapping"] },
  { icon: Cpu,       name: "Industrial",   color: "#4080f0", features: ["Confined space and LOTO permit controls", "Machinery pre-start assessment drafts", "ISO 45001 gap analysis prompts", "Contractor induction pack generation", "Chemical register risk assessment assistance"] },
  { icon: Shield,    name: "Facilities",   color: "#20b060", features: ["Emergency evacuation plan drafting", "Contractor management checklist generation", "Preventive maintenance task risk prompts", "Building compliance certificate tracking", "Incident trend analysis across tenancies"] },
];

/* ─── Stats ───────────────────────────────────────────────────────── */
const STATS = [
  { value: "8",    label: "AI capabilities",          note: "embedded across every module" },
  { value: "5",    label: "AI document types",         note: "drafted in under 60 seconds" },
  { value: "3",    label: "Industries supported",      note: "construction, industrial, facilities" },
  { value: "24/7", label: "AI assistant availability", note: "context-aware, always on" },
  { value: "100%", label: "Australian legislation",    note: "WHS Act, state regulations" },
  { value: "<60s", label: "Avg. document draft time",  note: "vs hours with manual methods" },
];

/* ─── How it works ────────────────────────────────────────────────── */
const HOW_STEPS = [
  { n: "01", title: "Tell Briesa what you need",  body: "Select a module — Safety, Training, Risk — and navigate to any AI-powered action. No prompting required; the AI understands the context of where you are." },
  { n: "02", title: "Provide the job context",    body: "Answer a few simple fields: task name, site, industry, personnel. Briesa's AI generates content specific to your work — not generic templates." },
  { n: "03", title: "Review and customise",        body: "AI-generated content is a starting point. Review, edit and approve in Briesa before distributing for worker sign-off or regulator submission." },
  { n: "04", title: "Store, assign and track",     body: "Every AI-generated document lives inside Briesa's compliance register — linked to workers, sites and incidents. Full audit trail for any SafeWork inspection." },
];

/* ─── Page ────────────────────────────────────────────────────────── */
export default function AIToolboxPage() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredIndustry, setHoveredIndustry] = useState<number | null>(null);

  const switchFeature = useCallback((i: number) => {
    if (i === activeFeature) return;
    setPreviewVisible(false);
    setTimeout(() => { setActiveFeature(i); setPreviewVisible(true); }, 280);
  }, [activeFeature]);

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Space Grotesk', sans-serif", color: "#e0e0e0" }}>
      <GlobalStyles />
      <ScrollProgress />

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
            <Link href="/signup" style={{ fontSize: "13px", fontWeight: 700, color: "#0a0a0a", textDecoration: "none", padding: "7px 18px", background: YELLOW }}>
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={{ borderBottom: "1px solid #1a1a1a", position: "relative", overflow: "hidden" }}>
        {/* Animated orbs */}
        <div className="hero-glow orb-a" style={{ position: "absolute", top: "-150px", left: "50%", width: "500px", height: "500px", background: `radial-gradient(circle, ${YELLOW}0a 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="orb-b" style={{ position: "absolute", top: "60px", left: "30%", width: "300px", height: "300px", background: `radial-gradient(circle, #4080f020 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div className="orb-a" style={{ position: "absolute", top: "40px", right: "20%", width: "260px", height: "260px", background: `radial-gradient(circle, ${GREEN}10 0%, transparent 70%)`, pointerEvents: "none" }} />

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
              <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", textDecoration: "none", padding: "12px 28px", background: YELLOW }}>
                Sign Up Today <ArrowRight size={16} />
              </Link>
              <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#777", textDecoration: "none", padding: "12px 28px", border: "1px solid #222" }}>
                Book a demo
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Stats ticker ── */}
      <section style={{ background: YELLOW, borderTop: "1px solid #e8c200", borderBottom: "1px solid #e8c200", overflow: "hidden", padding: "0" }}>
        <div className="ticker-track">
          {[...STATS, ...STATS].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "0", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "10px", padding: "18px 36px", whiteSpace: "nowrap" }}>
                <span style={{ fontSize: "26px", fontWeight: 900, letterSpacing: "-0.04em", color: "#0a0a0a", lineHeight: 1 }}>{s.value}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#0a0a0a" }}>{s.label}</span>
                <span style={{ fontSize: "12px", color: "#0a0a0a", opacity: 0.5 }}>— {s.note}</span>
              </div>
              <span style={{ color: "#0a0a0a", opacity: 0.25, fontSize: "20px", fontWeight: 300, flexShrink: 0 }}>|</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Interactive AI demo ── */}
      <section style={{ borderBottom: "1px solid #1a1a1a", padding: "96px 0" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
          <Reveal>
            <div style={{ marginBottom: "48px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>[02] — LIVE DEMOS</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.035em", color: "#ffffff", margin: 0 }}>
                AI in action — inside the dashboard
              </h2>
              <p style={{ fontSize: "15px", color: "#444", marginTop: "12px", maxWidth: "520px" }}>
                Select any capability to see exactly how it looks and works inside Briesa. Every screen is the real product.
              </p>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "16px", alignItems: "start" }}>
            {/* Feature selector */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {AI_FEATURES.map((f, i) => (
                <button
                  key={f.tag}
                  onClick={() => switchFeature(i)}
                  className={`feat-btn${activeFeature === i ? " active" : ""}`}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontFamily: "monospace", fontSize: "10px", fontWeight: 700, color: activeFeature === i ? YELLOW : "#222" }}>[{f.tag}]</span>
                    <span style={{ fontSize: "12.5px", fontWeight: 700, color: activeFeature === i ? "#e0e0e0" : "#444" }}>{f.name}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: activeFeature === i ? "#555" : "#222", lineHeight: 1.4 }}>{f.desc}</div>
                  {activeFeature === i && (
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "8px" }}>
                      <div className="pulse-dot" />
                      <span style={{ fontFamily: "monospace", fontSize: "9px", color: GREEN }}>LIVE PREVIEW</span>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Dashboard preview */}
            <DashboardPreview mockup={FEATURE_MOCKUPS[activeFeature]} visible={previewVisible} />
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

          {/* Equal-height grid: gap via outline trick so Reveal wrappers can be height:100% */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1px", background: "#1e1e1e" }}>
            {CAPABILITY_CARDS.map((c, i) => {
              const Icon = c.icon;
              const hov = hoveredCard === i;
              return (
                <Reveal key={i} delay={i * 0.04} fullHeight>
                  <div
                    className="cap-card"
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className="cap-icon"
                      style={{ width: "42px", height: "42px", display: "flex", alignItems: "center", justifyContent: "center", background: hov ? `${YELLOW}20` : `${YELLOW}10`, marginBottom: "18px" }}
                    >
                      <Icon size={20} color={YELLOW} />
                    </div>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: hov ? "#ffffff" : "#e0e0e0", margin: "0 0 10px", transition: "color 200ms" }}>{c.title}</h3>
                    <p style={{ fontSize: "13px", color: hov ? "#555" : "#3a3a3a", lineHeight: 1.65, margin: 0, flex: 1, transition: "color 200ms" }}>{c.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Industry breakdown ── */}
      <section style={{ borderBottom: "1px solid #1a1a1a", padding: "96px 0" }}>
        <div style={{ padding: "0 24px" }}>
          <Reveal>
            <div style={{ maxWidth: "1200px", margin: "0 auto", marginBottom: "56px" }}>
              <div style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>[04] — BY INDUSTRY</div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 900, letterSpacing: "-0.035em", color: "#ffffff", margin: 0 }}>
                Tailored to your industry
              </h2>
              <p style={{ fontSize: "15px", color: "#444", marginTop: "12px", maxWidth: "520px" }}>
                Briesa&apos;s AI speaks the language of your industry — the right legislation, the right terminology, the right obligations.
              </p>
            </div>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            {INDUSTRIES.map((ind, i) => {
              const Icon = ind.icon;
              const hov = hoveredIndustry === i;
              return (
                <Reveal key={ind.name} delay={i * 0.06} fullHeight>
                  <div
                    className="ind-card"
                    onMouseEnter={() => setHoveredIndustry(i)}
                    onMouseLeave={() => setHoveredIndustry(null)}
                    style={{ borderColor: hov ? ind.color + "60" : "#1a1a1a", background: hov ? ind.color + "06" : "#080808" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                      <div style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", background: ind.color + (hov ? "28" : "14"), transition: "background 250ms" }}>
                        <Icon size={20} color={ind.color} />
                      </div>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: hov ? "#ffffff" : "#e0e0e0", transition: "color 250ms" }}>{ind.name}</span>
                    </div>
                    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "9px", flex: 1 }}>
                      {ind.features.map(feat => (
                        <li key={feat} style={{ display: "flex", alignItems: "start", gap: "8px", fontSize: "12.5px", color: hov ? "#555" : "#3e3e3e", lineHeight: 1.45, transition: "color 250ms" }}>
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1px", background: "#1a1a1a" }}>
            {HOW_STEPS.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.06} fullHeight>
                <div className="step-card">
                  <div className="step-num" style={{ fontFamily: "monospace", fontSize: "28px", fontWeight: 900, color: "#1a1a1a", letterSpacing: "-0.02em", marginBottom: "16px", lineHeight: 1 }}>{step.n}</div>
                  <div style={{ position: "absolute", top: "28px", right: "24px" }}>
                    <ChevronRight size={14} color="#1e1e1e" />
                  </div>
                  <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#e0e0e0", margin: "0 0 10px", lineHeight: 1.3 }}>{step.title}</h3>
                  <p style={{ fontSize: "13px", color: "#444", lineHeight: 1.6, margin: 0, flex: 1 }}>{step.body}</p>
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
                { icon: AlertTriangle, text: "SafeWork regulation aware" },
                { icon: CheckCircle2,  text: "No AI output auto-approved" },
                { icon: FileText,      text: "Full audit trail on every document" },
                { icon: Users,         text: "Worker sign-off built in" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="trust-item">
                  <Icon size={14} color="#555" />
                  <span style={{ fontSize: "12.5px", color: "#555", fontWeight: 600 }}>{text}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "120px 0", position: "relative", overflow: "hidden" }}>
        <div className="orb-a" style={{ position: "absolute", bottom: "-100px", left: "50%", width: "600px", height: "400px", background: `radial-gradient(circle, ${YELLOW}07 0%, transparent 70%)`, pointerEvents: "none", transform: "translateX(-50%)" }} />
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "0 24px", textAlign: "center", position: "relative" }}>
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
              <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", textDecoration: "none", padding: "14px 32px", background: YELLOW }}>
                Sign Up Today <ArrowRight size={16} />
              </Link>
              <Link href="/demo" style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 600, color: "#555", textDecoration: "none", padding: "14px 32px", border: "1px solid #222" }}>
                Book a live demo
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.26}>
            <p style={{ fontSize: "12px", color: "#282828", marginTop: "24px" }}>No contracts · Cancel anytime · Australian data residency</p>
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
