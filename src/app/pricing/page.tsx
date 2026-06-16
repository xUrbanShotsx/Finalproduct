"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ArrowLeft } from "lucide-react";

function BLogo({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill={color} />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill={color} />
    </svg>
  );
}

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

const PLANS = [
  {
    key: "small",
    name: "Small",
    price: "$249",
    tagline: "For small crews up to 15 workers on site.",
    highlight: false,
    badge: null,
    capacity: [
      { label: "Workers on site",    value: "1 – 15" },
      { label: "Storage",            value: "25 GB" },
      { label: "Docs / month",       value: "100 – 300" },
      { label: "AI generations",     value: "~150–300 calls" },
      { label: "Token cap",          value: "500K / month" },
    ],
    features: [
      "All 9 WHS modules",
      "Unlimited team members",
      "Full mobile access",
      "Australian compliance templates",
      "Email support",
    ],
  },
  {
    key: "medium",
    name: "Medium",
    price: "$449",
    tagline: "For growing teams with 15–50 workers across sites.",
    highlight: true,
    badge: "Most Popular",
    capacity: [
      { label: "Workers on site",    value: "15 – 50" },
      { label: "Storage",            value: "75 GB" },
      { label: "Docs / month",       value: "300 – 800" },
      { label: "AI generations",     value: "~600–1,200 calls" },
      { label: "Token cap",          value: "2M / month" },
    ],
    features: [
      "Everything in Small",
      "Priority support",
      "Advanced analytics & reporting",
      "API access",
      "Custom induction builder",
    ],
  },
  {
    key: "large",
    name: "Large",
    price: "$649",
    tagline: "For large organisations with 50–200+ workers.",
    highlight: false,
    badge: null,
    capacity: [
      { label: "Workers on site",    value: "50 – 200+" },
      { label: "Storage",            value: "200 GB" },
      { label: "Docs / month",       value: "800 – 2,500" },
      { label: "AI generations",     value: "~2,000–4,000 calls" },
      { label: "Token cap",          value: "6M / month" },
    ],
    features: [
      "Everything in Medium",
      "Dedicated account manager",
      "SSO & custom integrations",
      "Webhook & advanced API",
      "On-site onboarding",
    ],
  },
] as const;

const FAQ = [
  {
    q: "Is there a free trial?",
    a: "Yes — every plan includes a 14-day free trial with full access to all modules. No credit card required to start.",
  },
  {
    q: "What counts as a 'worker'?",
    a: "Workers on site are people who actively use Briesa to submit records, sign SWMS, run pre-ops, etc. Admin and safety manager accounts don't count toward the worker limit.",
  },
  {
    q: "Can I change plans later?",
    a: "Absolutely. You can upgrade or downgrade at any time. Upgrades take effect immediately; downgrades apply at the next billing cycle.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data remains read-only for 30 days after cancellation. You can export everything as PDF or CSV before your account closes.",
  },
  {
    q: "Do you offer annual billing?",
    a: "Yes — annual billing gives you two months free (equivalent to ~17% off). Contact us to switch your plan to annual.",
  },
  {
    q: "What Australian WHS standards does Briesa support?",
    a: "Briesa is built to the Work Health and Safety Act 2011 (Cth) and aligns with SafeWork NSW, WorkSafe Victoria, and state equivalents for HRCW licensing, SWMS and incident reporting.",
  },
];

export default function PricingPage() {
  return (
    <div style={{ background: "#fff", color: "#0a0a0a", fontFamily: "'Space Grotesk', sans-serif", minHeight: "100vh" }}>

      {/* NAV */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #f0f0f0",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <BLogo size={20} color="#1a8a4a" />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#0a0a0a" }}>Briesa</span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, color: "#ccc", marginLeft: "2px" }}>V1.0</span>
          </Link>

          <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {[
              ["/#features",   "Platform"],
              ["/#industries", "Industries"],
              ["/#ai",         "AI"],
              ["/pricing",     "Pricing"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                style={{ fontSize: "13.5px", fontWeight: label === "Pricing" ? 700 : 500, color: label === "Pricing" ? "#0a0a0a" : "#666", textDecoration: "none" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link href="/login" style={{ fontSize: "13px", fontWeight: 500, color: "#555", textDecoration: "none", padding: "7px 16px", border: "1px solid #e0e0e0" }}>
              Log in
            </Link>
            <Link href="/login" style={{ fontSize: "13px", fontWeight: 700, color: "#fff", textDecoration: "none", padding: "7px 18px", background: "#0a0a0a", border: "1px solid #0a0a0a" }}>
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section style={{ background: "#fff", padding: "80px 0 0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 72px" }}>

          {/* Back */}
          <Link
            href="/"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#999", textDecoration: "none", marginBottom: "40px" }}
            onMouseOver={e => (e.currentTarget.style.color = "#555")}
            onMouseOut={e => (e.currentTarget.style.color = "#999")}
          >
            <ArrowLeft size={13} /> Back to home
          </Link>

          {/* Label */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#ccc" }}>[PRICING]</span>
            <span style={{ fontSize: "11px", color: "#e0e0e0" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a8a4a" }}>Simple, honest plans</span>
          </div>

          <h1 style={{ fontSize: "clamp(40px, 5.5vw, 64px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.04em", color: "#0a0a0a", margin: "0 0 20px" }}>
            Flat pricing.<br />No per-user fees.
          </h1>
          <p style={{ fontSize: "17px", lineHeight: 1.65, color: "#666", maxWidth: "480px", margin: 0 }}>
            One flat monthly price based on your workforce size. All 9 WHS modules included on every plan — no add-ons, no surprises.
          </p>
        </div>
      </section>

      {/* PLANS */}
      <section style={{ background: "#fafafa", padding: "72px 0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", alignItems: "start" }}>
            {PLANS.map(plan => (
              <div
                key={plan.key}
                style={{
                  background: "#fff",
                  border: `1px solid ${plan.highlight ? "#0a0a0a" : "#e8e8e8"}`,
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                {/* Most popular badge */}
                {plan.badge && (
                  <div style={{
                    position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)",
                    background: "#0a0a0a", color: "#fff",
                    fontFamily: "monospace", fontSize: "9px", fontWeight: 700,
                    letterSpacing: "0.1em", padding: "3px 12px", textTransform: "uppercase",
                  }}>
                    [{plan.badge}]
                  </div>
                )}

                {/* Header */}
                <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: plan.highlight ? "#0a0a0a" : "#aaa" }}>
                      {plan.name}
                    </span>
                    <Tag label={plan.highlight ? "POPULAR" : "PLAN"} accent={plan.highlight} />
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "48px", fontWeight: 800, letterSpacing: "-0.04em", color: "#0a0a0a", lineHeight: 1 }}>{plan.price}</span>
                    <span style={{ fontSize: "14px", color: "#aaa" }}>/ month</span>
                  </div>
                  <p style={{ fontSize: "13px", color: "#777", margin: 0, lineHeight: 1.6 }}>{plan.tagline}</p>
                </div>

                {/* Capacity */}
                <div style={{ padding: "18px 24px", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ccc", marginBottom: "12px", fontFamily: "monospace" }}>
                    // Capacity
                  </div>
                  {plan.capacity.map(c => (
                    <div key={c.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid #f7f7f7" }}>
                      <span style={{ fontSize: "12px", color: "#888" }}>{c.label}</span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#333", fontFamily: "monospace" }}>{c.value}</span>
                    </div>
                  ))}
                </div>

                {/* Features */}
                <div style={{ padding: "18px 24px", flex: 1 }}>
                  <div style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ccc", marginBottom: "12px", fontFamily: "monospace" }}>
                    // Includes
                  </div>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <CheckCircle2 style={{ width: "13px", height: "13px", color: "#1a8a4a", flexShrink: 0, marginTop: "2px" }} />
                        <span style={{ fontSize: "13px", color: "#555" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div style={{ padding: "20px 24px" }}>
                  <Link
                    href="/login"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                      height: "44px", fontSize: "13.5px", fontWeight: 700, textDecoration: "none",
                      background: plan.highlight ? "#0a0a0a" : "#fff",
                      color: plan.highlight ? "#fff" : "#0a0a0a",
                      border: `1px solid ${plan.highlight ? "#0a0a0a" : "#d0d0d0"}`,
                    }}
                    onMouseOver={e => {
                      if (plan.highlight) (e.currentTarget as HTMLElement).style.background = "#222";
                      else (e.currentTarget as HTMLElement).style.borderColor = "#888";
                    }}
                    onMouseOut={e => {
                      if (plan.highlight) (e.currentTarget as HTMLElement).style.background = "#0a0a0a";
                      else (e.currentTarget as HTMLElement).style.borderColor = "#d0d0d0";
                    }}
                  >
                    Get started <ArrowRight size={14} />
                  </Link>
                  <p style={{ textAlign: "center", fontSize: "11.5px", color: "#bbb", margin: "10px 0 0" }}>14-day free trial · No card required</p>
                </div>
              </div>
            ))}
          </div>

          {/* Under-plan note */}
          <div style={{ textAlign: "center", marginTop: "36px" }}>
            <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 6px" }}>
              Need more than 200 workers or custom storage?{" "}
              <a href="mailto:hello@briesa.com" style={{ color: "#0a0a0a", textDecoration: "underline", textUnderlineOffset: "3px" }}>Contact us for Enterprise pricing →</a>
            </p>
            <p style={{ fontSize: "13px", color: "#ccc", margin: 0 }}>Annual billing available — 2 months free · Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* COMPARE TABLE */}
      <section style={{ background: "#fff", padding: "80px 0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "48px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "#ccc" }}>[05]</span>
            <span style={{ fontSize: "12px", color: "#d5d5d5" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa" }}>Full comparison</span>
            <div style={{ flex: 1, height: "1px", background: "#ebebeb" }} />
          </div>

          <div style={{ border: "1px solid #ebebeb", overflow: "hidden" }}>
            {/* Header row */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", background: "#fafafa", borderBottom: "1px solid #ebebeb" }}>
              <div style={{ padding: "14px 20px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#aaa" }}>Feature</div>
              {["Small", "Medium", "Large"].map(p => (
                <div key={p} style={{ padding: "14px 20px", fontSize: "13px", fontWeight: 700, color: p === "Medium" ? "#0a0a0a" : "#555", borderLeft: "1px solid #ebebeb", textAlign: "center" }}>
                  {p}
                  {p === "Medium" && <span style={{ marginLeft: "6px", fontFamily: "monospace", fontSize: "9px", color: "#1a8a4a" }}>[POPULAR]</span>}
                </div>
              ))}
            </div>
            {[
              { label: "Price",                      vals: ["$249/mo", "$449/mo", "$649/mo"] },
              { label: "Workers on site",             vals: ["1–15", "15–50", "50–200+"] },
              { label: "Storage",                     vals: ["25 GB", "75 GB", "200 GB"] },
              { label: "Docs per month",              vals: ["100–300", "300–800", "800–2,500"] },
              { label: "AI tokens",                   vals: ["500K", "2M", "6M"] },
              { label: "All 9 WHS modules",           vals: ["✓", "✓", "✓"] },
              { label: "Mobile access",               vals: ["✓", "✓", "✓"] },
              { label: "Australian compliance templates", vals: ["✓", "✓", "✓"] },
              { label: "API access",                  vals: ["—", "✓", "✓"] },
              { label: "Priority support",            vals: ["—", "✓", "✓"] },
              { label: "Advanced analytics",          vals: ["—", "✓", "✓"] },
              { label: "SSO & custom integrations",   vals: ["—", "—", "✓"] },
              { label: "Dedicated account manager",   vals: ["—", "—", "✓"] },
              { label: "On-site onboarding",          vals: ["—", "—", "✓"] },
            ].map((row, i) => (
              <div key={row.label} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", borderBottom: i < 13 ? "1px solid #f5f5f5" : "none", background: i % 2 === 0 ? "#fff" : "#fdfcfc" }}>
                <div style={{ padding: "12px 20px", fontSize: "13px", color: "#555" }}>{row.label}</div>
                {row.vals.map((v, vi) => (
                  <div key={vi} style={{ padding: "12px 20px", fontSize: "13px", textAlign: "center", borderLeft: "1px solid #f0f0f0", color: v === "✓" ? "#1a8a4a" : v === "—" ? "#ddd" : "#0a0a0a", fontWeight: v === "✓" ? 700 : v === "—" ? 400 : 600, fontFamily: v.includes("$") ? "monospace" : "inherit" }}>
                    {v}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: "#fafafa", padding: "80px 0", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "56px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: "#ccc" }}>[06]</span>
            <span style={{ fontSize: "12px", color: "#d5d5d5" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#aaa" }}>FAQ</span>
            <div style={{ flex: 1, height: "1px", background: "#ebebeb" }} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
            {FAQ.map(({ q, a }) => (
              <div key={q} style={{ borderLeft: "2px solid #ebebeb", paddingLeft: "20px" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "#0a0a0a", marginBottom: "8px", lineHeight: 1.4 }}>{q}</div>
                <p style={{ fontSize: "13.5px", color: "#666", lineHeight: 1.7, margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "#0a0a0a", padding: "80px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333" }}>[FREE TRIAL]</span>
            <span style={{ fontSize: "11px", color: "#333" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#555" }}>14 days · No card required</span>
          </div>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", margin: "0 0 16px", lineHeight: 1.05 }}>
            Stop guessing.<br />Get certified.
          </h2>
          <p style={{ fontSize: "15px", color: "#444", margin: "0 0 40px", lineHeight: 1.6 }}>
            Full access to all modules. Cancel anytime.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
            <Link
              href="/login"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 28px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", background: "#fff", textDecoration: "none", border: "1px solid #fff" }}
              onMouseOver={e => (e.currentTarget as HTMLElement).style.background = "#f0f0f0"}
              onMouseOut={e => (e.currentTarget as HTMLElement).style.background = "#fff"}
            >
              Get started free <ArrowRight size={15} />
            </Link>
            <Link
              href="/"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "13px 24px", fontSize: "14px", fontWeight: 500, color: "#555", background: "transparent", textDecoration: "none", border: "1px solid #2a2a2a" }}
            >
              Back to home
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#060606", borderTop: "1px solid #111", padding: "32px 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <BLogo size={16} color="#1a8a4a" />
            <span style={{ fontSize: "14px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Briesa</span>
            <span style={{ fontFamily: "monospace", fontSize: "9px", fontWeight: 700, color: "#333" }}>V1.0</span>
          </div>
          <p style={{ fontSize: "11.5px", color: "#333", margin: 0 }}>© {new Date().getFullYear()} Briesa. All rights reserved.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            {[["Privacy", "#"], ["Terms", "#"], ["Contact", "#"]].map(([l, h]) => (
              <a key={l} href={h} style={{ fontSize: "12px", color: "#333", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
