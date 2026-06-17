"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";

function BLogo({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill={color} />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill={color} />
    </svg>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0 14px",
  height: "44px",
  fontSize: "14px",
  background: "#0f0f0f",
  border: "1px solid #222",
  color: "#e0e0e0",
  outline: "none",
};

export default function DemoPage() {
  const router = useRouter();
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Demo workspace is the Construction dashboard; flag as a prospect demo
    // so paid add-ons (e.g. Blueprints) stay locked in this view.
    document.cookie = "b-demo-industry=construction; path=/; max-age=86400";
    document.cookie = "b-demo-prospect=1; path=/; max-age=86400";
    router.push("/dashboard");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", fontFamily: "'Space Grotesk', sans-serif" }}>

      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Back */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#555", textDecoration: "none", marginBottom: "32px" }}
          onMouseOver={e => (e.currentTarget.style.color = "#aaa")}
          onMouseOut={e => (e.currentTarget.style.color = "#555")}>
          <ArrowLeft size={14} /> Back to home
        </Link>

        {/* Logo + heading */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
          <BLogo size={26} color="#ffffff" />
          <span style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>Briesa</span>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333" }}>[FREE DEMO]</span>
          <span style={{ fontSize: "11px", color: "#222" }}>//</span>
          <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#f5c842" }}>No credit card</span>
        </div>

        <h1 style={{ fontSize: "30px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff", margin: "0 0 10px", lineHeight: 1.1 }}>
          See Briesa in action.
        </h1>
        <p style={{ fontSize: "14px", lineHeight: 1.6, color: "#555", margin: "0 0 32px" }}>
          Tell us who you are and step straight into a live workspace — full access to every module, no setup required.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#555" }}>Full name</label>
            <input type="text" placeholder="Jane Smith" value={name} onChange={e => setName(e.target.value)} required style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "#f5c842")}
              onBlur={e => (e.currentTarget.style.borderColor = "#222")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#555" }}>Work email</label>
            <input type="email" placeholder="jane@company.com.au" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "#f5c842")}
              onBlur={e => (e.currentTarget.style.borderColor = "#222")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            <label style={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#555" }}>Phone number</label>
            <input type="tel" placeholder="04XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} required style={inputStyle}
              onFocus={e => (e.currentTarget.style.borderColor = "#f5c842")}
              onBlur={e => (e.currentTarget.style.borderColor = "#222")} />
          </div>

          <button type="submit" disabled={loading}
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "46px", marginTop: "8px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", background: "#f5c842", border: "1px solid #f5c842", cursor: "pointer", opacity: loading ? 0.6 : 1 }}
            onMouseOver={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = "#e0b830"; }}
            onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "#f5c842"; }}>
            {loading ? "Entering…" : <>Enter Demo <ArrowRight size={15} /></>}
          </button>
        </form>

        <p style={{ fontSize: "11px", color: "#333", marginTop: "20px", textAlign: "center", lineHeight: 1.6 }}>
          This is a sample Construction workspace populated with demo data.
        </p>
      </div>
    </div>
  );
}
