"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Sparkles, FileText, ShieldCheck, Database, RefreshCw } from "lucide-react";
import {
  ALL_STANDARDS, STANDARDS, priceFor, bundleLabel, fmtAUD, RENEWAL_PRICE,
  CATEGORY_LABEL, type ISOStandard, type DocCategory,
} from "@/config/blueprints";

function BLogo({ size = 20, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill={color} />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill={color} />
    </svg>
  );
}

const YELLOW = "#ffd600";

function catBreakdown(k: ISOStandard) {
  const docs = STANDARDS[k].docs;
  const count = (c: DocCategory) => docs.filter((d) => d.category === c).length;
  return [
    { label: CATEGORY_LABEL.MANDATORY_DOCUMENT + "s", n: count("MANDATORY_DOCUMENT") },
    { label: CATEGORY_LABEL.MANDATORY_RECORD + "s", n: count("MANDATORY_RECORD") },
    { label: CATEGORY_LABEL.RECOMMENDED_PROCEDURE + "s", n: count("RECOMMENDED_PROCEDURE") },
  ];
}

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: YELLOW }}>[{n}]</span>
        <span style={{ fontSize: "12px", color: "#333" }}>//</span>
        <span style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888" }}>{label}</span>
      </div>
      <div style={{ height: "1px", background: "#1a1a1a" }} />
    </div>
  );
}

export default function BlueprintsIsoPage() {
  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <header style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.97)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <BLogo size={20} />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>Briesa</span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, color: "#333", marginLeft: "2px" }}>V1.0</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/login" style={{ fontSize: "13px", fontWeight: 500, color: "#666", textDecoration: "none", padding: "7px 16px", border: "1px solid #222" }}>Log in</Link>
            <Link href="/signup" style={{ fontSize: "13px", fontWeight: 700, color: "#0a0a0a", textDecoration: "none", padding: "7px 18px", background: YELLOW, border: `1px solid ${YELLOW}` }}>Get started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "96px 24px 80px", textAlign: "center" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#555", textDecoration: "none", marginBottom: "28px" }}>
            <ArrowLeft size={14} /> Back to home
          </Link>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333" }}>[BLUEPRINTS]</span>
            <span style={{ fontSize: "11px", color: "#222" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: YELLOW }}>ISO Management Systems</span>
          </div>
          <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, lineHeight: 1.04, letterSpacing: "-0.04em", color: "#ffffff", margin: "0 auto 24px", maxWidth: "880px" }}>
            CERTIFICATION-READY<br />ISO DOCUMENTS, <span style={{ color: YELLOW }}>DONE FOR YOU.</span>
          </h1>
          <p style={{ fontSize: "18px", lineHeight: 1.65, color: "#666", maxWidth: "620px", margin: "0 auto 40px" }}>
            A one-off purchase delivers a complete, audit-ready document pack for ISO 9001, 14001 or 45001 — tailored to your organisation and built straight from the data you already keep in Briesa.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 30px", fontSize: "15px", fontWeight: 700, color: "#0a0a0a", background: YELLOW, textDecoration: "none", border: `1px solid ${YELLOW}` }}>
              Get your blueprint <ArrowRight size={16} />
            </Link>
            <a href="#pricing" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 28px", fontSize: "15px", fontWeight: 500, color: "#888", background: "transparent", textDecoration: "none", border: "1px solid #222" }}>
              View pricing
            </a>
          </div>

          {/* trust strip */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "32px", marginTop: "56px" }}>
            {[
              [ShieldCheck, "Audit-ready", "Mapped to the exact ISO clauses certifiers check"],
              [Database, "Pre-filled from Briesa", "ISO 45001 uses your live WHS data"],
              [FileText, "You own it", "Editable docs, export to PDF & Word"],
            ].map(([Icon, t, d], i) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", maxWidth: "260px", textAlign: "left" }}>
                  <I size={18} style={{ color: YELLOW, flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#e0e0e0" }}>{t as string}</div>
                    <div style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}>{d as string}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "88px 24px" }}>
          <SectionLabel n="01" label="The standards" />
          <p style={{ fontSize: "16px", color: "#666", maxWidth: "640px", margin: "-20px 0 40px", lineHeight: 1.6 }}>
            Three internationally recognised management-system standards. Buy one, or bundle them for a fully integrated system.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            {ALL_STANDARDS.map((k) => {
              const s = STANDARDS[k];
              return (
                <div key={k} style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: "28px 24px" }}>
                  <div style={{ height: "3px", width: "40px", background: s.color, marginBottom: "20px" }} />
                  <div style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: s.color, marginBottom: "6px" }}>
                    {s.code}<span style={{ color: "#444" }}>{s.year}</span>
                  </div>
                  <div style={{ fontSize: "19px", fontWeight: 800, color: "#ffffff", marginBottom: "10px" }}>{s.name}</div>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: "#666", marginBottom: "20px" }}>{s.tagline}</p>

                  <div style={{ fontFamily: "monospace", fontSize: "26px", fontWeight: 800, color: "#e0e0e0", marginBottom: "16px" }}>
                    {s.docs.length}<span style={{ fontSize: "12px", color: "#555", marginLeft: "6px" }}>documents</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
                    {catBreakdown(k).map((c) => (
                      <div key={c.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px" }}>
                        <span style={{ color: "#666" }}>{c.label}</span>
                        <span style={{ color: "#999", fontFamily: "monospace", fontWeight: 700 }}>{c.n}</span>
                      </div>
                    ))}
                  </div>

                  {k === "ISO_45001" && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", background: "rgba(255,214,0,0.08)", marginTop: "4px" }}>
                      <Sparkles size={13} style={{ color: YELLOW, flexShrink: 0 }} />
                      <span style={{ fontSize: "11px", fontWeight: 600, color: YELLOW }}>Pre-fills from your Briesa data</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "88px 24px" }}>
          <SectionLabel n="02" label="How it works" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "6px" }}>
            {[
              ["01", "Choose your standards", "Pick one, two or three ISO standards from the Blueprint Store."],
              ["02", "Tell us about your org", "A short intake — or for ISO 45001, pull straight from your Briesa data."],
              ["03", "We generate the pack", "Every document is produced for your scope, sites and operations."],
              ["04", "Review, edit & export", "Run a gap analysis, edit anything, then export to PDF or Word."],
            ].map(([num, title, desc]) => (
              <div key={num} style={{ background: "#0f0f0f", border: "1px solid #1a1a1a", padding: "24px 20px" }}>
                <div style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 700, color: YELLOW, marginBottom: "16px" }}>{num}</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "#e0e0e0", marginBottom: "8px" }}>{title}</div>
                <div style={{ fontSize: "13px", color: "#555", lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "88px 24px" }}>
          <SectionLabel n="03" label="Pricing" />
          <p style={{ fontSize: "16px", color: "#666", maxWidth: "640px", margin: "-20px 0 40px", lineHeight: 1.6 }}>
            One-off purchase. The more standards you bundle, the more you save. No subscription to own your documents.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            {[1, 2, 3].map((n) => {
              const popular = n === 2;
              return (
                <div key={n} style={{ background: "#0f0f0f", border: popular ? `1px solid ${YELLOW}` : "1px solid #1a1a1a", padding: "32px 28px", position: "relative" }}>
                  {popular && (
                    <span style={{ position: "absolute", top: 0, right: 0, fontFamily: "monospace", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 10px", background: YELLOW, color: "#0a0a0a" }}>
                      [Most Popular]
                    </span>
                  )}
                  <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#888", marginBottom: "16px" }}>{bundleLabel(n)}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>{fmtAUD(priceFor(n))}</span>
                    <span style={{ fontSize: "13px", color: "#555" }}>AUD</span>
                  </div>
                  <div style={{ fontSize: "13px", color: "#666", marginBottom: "24px" }}>{n} standard{n > 1 ? "s" : ""} · one-off</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "28px" }}>
                    {[
                      `${n} complete ISO document pack${n > 1 ? "s" : ""}`,
                      "Tailored to your organisation",
                      "Gap analysis & compliance score",
                      "Editable · export to PDF & Word",
                      "You own the documents outright",
                    ].map((f) => (
                      <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <Check size={14} style={{ color: YELLOW, flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ fontSize: "13px", color: "#999" }}>{f}</span>
                      </div>
                    ))}
                  </div>
                  <Link href="/signup" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "44px", fontSize: "14px", fontWeight: 700, textDecoration: "none", background: popular ? YELLOW : "transparent", color: popular ? "#0a0a0a" : "#e0e0e0", border: popular ? `1px solid ${YELLOW}` : "1px solid #222" }}>
                    Get started <ArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Renewal note */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "24px", padding: "16px 20px", border: "1px solid #1a1a1a", background: "#0f0f0f" }}>
            <RefreshCw size={16} style={{ color: YELLOW, flexShrink: 0 }} />
            <span style={{ fontSize: "13px", color: "#888" }}>
              Optional annual refresh keeps every blueprint current with standard and operational changes — <span style={{ color: "#e0e0e0", fontWeight: 600 }}>{fmtAUD(RENEWAL_PRICE)} per blueprint / year</span>.
            </span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#ffffff", margin: "0 0 16px", lineHeight: 1.05 }}>
            CERTIFY WITH<br /><span style={{ color: YELLOW }}>CONFIDENCE.</span>
          </h2>
          <p style={{ fontSize: "16px", color: "#555", margin: "0 auto 36px", maxWidth: "440px", lineHeight: 1.6 }}>
            Generate your ISO blueprint today and walk into your audit prepared.
          </p>
          <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "15px 34px", fontSize: "15px", fontWeight: 700, color: "#0a0a0a", background: YELLOW, textDecoration: "none", border: `1px solid ${YELLOW}` }}>
            Get your blueprint <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
