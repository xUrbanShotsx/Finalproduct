"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

function BLogo({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill={color} />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill={color} />
    </svg>
  );
}

const PLANS = [
  {
    key: "small",
    name: "Small",
    price: "$249",
    tagline: "For small crews up to 15 workers on site.",
    highlight: false,
    badge: null as string | null,
    capacity: [
      { label: "Workers on site", value: "1 – 15" },
      { label: "Storage",         value: "25 GB" },
      { label: "Docs / month",    value: "100 – 300" },
      { label: "AI generations",  value: "~150–300 calls" },
      { label: "Token cap",       value: "500K / month" },
    ],
  },
  {
    key: "medium",
    name: "Medium",
    price: "$449",
    tagline: "For growing teams with 15–50 workers across sites.",
    highlight: true,
    badge: "Most Popular" as string | null,
    capacity: [
      { label: "Workers on site", value: "15 – 50" },
      { label: "Storage",         value: "75 GB" },
      { label: "Docs / month",    value: "300 – 800" },
      { label: "AI generations",  value: "~600–1,200 calls" },
      { label: "Token cap",       value: "2M / month" },
    ],
  },
  {
    key: "large",
    name: "Large",
    price: "$649",
    tagline: "For large organisations with 50–200+ workers.",
    highlight: false,
    badge: null as string | null,
    capacity: [
      { label: "Workers on site", value: "50 – 200+" },
      { label: "Storage",         value: "200 GB" },
      { label: "Docs / month",    value: "800 – 2,500" },
      { label: "AI generations",  value: "~2,000–4,000 calls" },
      { label: "Token cap",       value: "6M / month" },
    ],
  },
];

export default function PricingPage() {
  return (
    <div style={{
      height: "100vh",
      overflow: "hidden",
      background: "#0a0a0a",
      color: "#e0e0e0",
      fontFamily: "'Space Grotesk', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* ── NAV ── */}
      <header style={{
        flexShrink: 0,
        background: "rgba(10,10,10,0.97)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #1a1a1a",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <BLogo size={20} color="#ffffff" />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>Briesa</span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, color: "#333", marginLeft: "2px" }}>V1.0</span>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {[
              ["/#features",   "Platform"],
              ["/#industries", "Industries"],
              ["/#resources",  "Resources"],
              ["/pricing",     "Pricing"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: "13.5px", fontWeight: label === "Pricing" ? 700 : 500, color: label === "Pricing" ? "#ffffff" : "#555", textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </nav>

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
              style={{ fontSize: "13px", fontWeight: 700, color: "#0a0a0a", textDecoration: "none", padding: "7px 18px", background: "#f5c842", border: "1px solid #f5c842" }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "#e0b830"; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "#f5c842"; }}
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", maxWidth: "1200px", width: "100%", margin: "0 auto", padding: "0 24px" }}>

        {/* Top: back link + heading */}
        <div style={{ paddingTop: "36px", paddingBottom: "28px", flexShrink: 0 }}>
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#333", textDecoration: "none", marginBottom: "24px" }}
            onMouseOver={e => (e.currentTarget.style.color = "#666")}
            onMouseOut={e => (e.currentTarget.style.color = "#333")}
          >
            <ArrowLeft size={12} /> Back to home
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333" }}>[PRICING]</span>
            <span style={{ fontSize: "11px", color: "#222" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a8a4a" }}>Simple, honest plans</span>
          </div>

          <h1 style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#ffffff", margin: "0 0 8px" }}>
            FLAT PRICING.<br />NO PER-USER FEES.
          </h1>
          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#444", margin: 0, maxWidth: "440px" }}>
            One flat monthly price based on workforce size. All 9 WHS modules included — no add-ons, no surprises.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px", overflow: "hidden" }}>
          {PLANS.map(plan => (
            <div
              key={plan.key}
              style={{
                background: "#0f0f0f",
                border: `1px solid ${plan.highlight ? "#2a2a2a" : "#1a1a1a"}`,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top accent line for highlighted */}
              {plan.highlight && <div style={{ height: "2px", background: "#ffffff", flexShrink: 0 }} />}

              {/* Badge */}
              {plan.badge && (
                <div style={{
                  position: "absolute", top: plan.highlight ? "2px" : 0, right: 0,
                  background: "#ffffff", color: "#0a0a0a",
                  fontFamily: "monospace", fontSize: "8px", fontWeight: 700,
                  letterSpacing: "0.1em", padding: "3px 10px", textTransform: "uppercase",
                }}>
                  [{plan.badge}]
                </div>
              )}

              {/* Header */}
              <div style={{ padding: "22px 22px 16px", borderBottom: "1px solid #1a1a1a", flexShrink: 0 }}>
                <div style={{ marginBottom: "12px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: plan.highlight ? "#aaa" : "#333" }}>
                    {plan.name}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "44px", fontWeight: 800, letterSpacing: "-0.04em", color: "#ffffff", lineHeight: 1 }}>{plan.price}</span>
                  <span style={{ fontSize: "13px", color: "#333" }}>/ month</span>
                </div>
                <p style={{ fontSize: "12px", color: "#444", margin: 0, lineHeight: 1.5 }}>{plan.tagline}</p>
              </div>

              {/* Capacity */}
              <div style={{ padding: "16px 22px", flex: 1 }}>
                <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#2a2a2a", marginBottom: "10px", fontFamily: "monospace" }}>
                  // Capacity
                </div>
                {plan.capacity.map(c => (
                  <div key={c.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #141414" }}>
                    <span style={{ fontSize: "12px", color: "#444" }}>{c.label}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#777", fontFamily: "monospace" }}>{c.value}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ padding: "16px 22px 20px", flexShrink: 0 }}>
                <Link
                  href="/signup"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    height: "40px", fontSize: "13px", fontWeight: 700, textDecoration: "none",
                    background: "#f5c842",
                    color: "#0a0a0a",
                    border: "1px solid #f5c842",
                  }}
                  onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "#e0b830"; (e.currentTarget as HTMLElement).style.borderColor = "#e0b830"; }}
                  onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "#f5c842"; (e.currentTarget as HTMLElement).style.borderColor = "#f5c842"; }}
                >
                  Get started <ArrowRight size={13} />
                </Link>
                <p style={{ textAlign: "center", fontSize: "11px", color: "#2a2a2a", margin: "8px 0 0" }}>14-day free trial · No card required</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ flexShrink: 0, padding: "16px 0", display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #141414", marginTop: "6px" }}>
          <p style={{ fontSize: "12px", color: "#2a2a2a", margin: 0 }}>
            Need 200+ workers?{" "}
            <a href="mailto:hello@briesa.com" style={{ color: "#444", textDecoration: "underline", textUnderlineOffset: "3px" }}>Contact us for Enterprise →</a>
          </p>
          <p style={{ fontSize: "12px", color: "#222", margin: 0 }}>Annual billing available — 2 months free · Cancel anytime</p>
        </div>
      </main>

    </div>
  );
}
