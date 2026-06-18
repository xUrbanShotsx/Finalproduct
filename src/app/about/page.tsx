"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Lightbulb, Hammer, Rocket, Shield } from "lucide-react";

const YELLOW = "#ffd600";

function BLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill="#fff" />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill="#fff" />
    </svg>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(24px)", transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s` }}>
      {children}
    </div>
  );
}

const TIMELINE = [
  {
    icon: Lightbulb,
    year: "Mid 2025",
    title: "The idea",
    body: "Watching businesses right across Australia struggle to keep up with their WHS obligations — drowning in paper, spreadsheets and disconnected apps — we sketched out a single, all-in-one safety management system.",
  },
  {
    icon: Hammer,
    year: "Late 2025 — Early 2026",
    title: "Building & testing",
    body: "We've been developing and testing ever since — working alongside real operators on real sites to make sure every module earns its place and actually saves time on the ground.",
  },
  {
    icon: Rocket,
    year: "June 2026",
    title: "Launch",
    body: "Briesa goes live — one platform for incidents, SWMS, permits, training, compliance and AI-generated ISO blueprints. Built for Australian construction, industrial and facilities teams.",
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <BLogo size={20} />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>Briesa</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#555", textDecoration: "none" }}><ArrowLeft size={14} /> Home</Link>
            <Link href="/signup" style={{ fontSize: "13px", fontWeight: 700, color: "#0a0a0a", textDecoration: "none", padding: "7px 18px", background: YELLOW, border: `1px solid ${YELLOW}` }}>Get started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "880px", margin: "0 auto", padding: "96px 24px 72px", textAlign: "center" }}>
          <Reveal>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333" }}>[ABOUT]</span>
              <span style={{ fontSize: "11px", color: "#222" }}>//</span>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: YELLOW }}>Our story</span>
            </div>
            <h1 style={{ fontSize: "clamp(38px, 6vw, 68px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.05, margin: "0 0 24px" }}>
              BUILT FROM THE<br /><span style={{ color: YELLOW }}>GROUND UP.</span>
            </h1>
            <p style={{ fontSize: "18px", lineHeight: 1.65, color: "#777", maxWidth: "600px", margin: "0 auto" }}>
              Briesa started with a simple observation: businesses all over Australia were working harder than ever to stay safe and compliant — and the tools were getting in their way, not helping. So we set out to build the all-in-one WHS safety management system they actually deserved.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 24px" }}>
          <Reveal>
            <div style={{ marginBottom: "48px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: YELLOW }}>[01]</span>
                <span style={{ fontSize: "12px", color: "#333" }}>//</span>
                <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>The journey</span>
              </div>
              <div style={{ height: "1px", background: "#1a1a1a" }} />
            </div>
          </Reveal>

          <div style={{ position: "relative", paddingLeft: "44px" }}>
            {/* vertical line */}
            <div style={{ position: "absolute", left: "15px", top: "8px", bottom: "8px", width: "2px", background: "linear-gradient(to bottom, #ffd600, #2a2a2a)" }} />

            {TIMELINE.map((t, i) => {
              const Icon = t.icon;
              return (
                <Reveal key={t.year} delay={i * 0.12}>
                  <div style={{ position: "relative", paddingBottom: i === TIMELINE.length - 1 ? "0" : "44px" }}>
                    {/* dot */}
                    <div style={{ position: "absolute", left: "-44px", top: "0", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f0f0f", border: `1px solid ${YELLOW}` }}>
                      <Icon size={15} style={{ color: YELLOW }} />
                    </div>
                    <div style={{ border: "1px solid #1a1a1a", background: "#0f0f0f", padding: "20px 22px" }}>
                      <div style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: YELLOW, marginBottom: "6px" }}>{t.year}</div>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>{t.title}</div>
                      <p style={{ fontSize: "14px", lineHeight: 1.65, color: "#777", margin: 0 }}>{t.body}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section style={{ borderTop: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "80px 24px" }}>
          <Reveal>
            <Shield size={28} style={{ color: YELLOW, marginBottom: "20px" }} />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", lineHeight: 1.1, margin: "0 0 20px" }}>
              One platform. Every worker. Real safety.
            </h2>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#777", margin: "0 0 16px" }}>
              We believe safety software should disappear into the way teams already work — fast on the phone in your pocket, clear on the dashboard back in the office, and intelligent enough to spot the things people miss. No more folders in the site shed, no more chasing paper, no more wondering whether you&apos;re audit-ready.
            </p>
            <p style={{ fontSize: "16px", lineHeight: 1.7, color: "#777", margin: "0 0 32px" }}>
              From a single idea in 2025 to launch in 2026, that&apos;s the standard we hold ourselves to — and we&apos;re only getting started.
            </p>
            <Link href="/contact" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", background: YELLOW, textDecoration: "none" }}>
              Get in touch <ArrowRight size={15} />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
