"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Mail, MapPin, Phone } from "lucide-react";

const YELLOW = "#ffd600";

function BLogo({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill="#fff" />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill="#fff" />
    </svg>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", height: "46px", padding: "0 14px", fontSize: "14px",
  background: "#0f0f0f", border: "1px solid #222", color: "#e0e0e0", outline: "none",
};

export default function ContactPage() {
  const [f, setF] = useState({ name: "", email: "", company: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));
  const valid = f.name && f.email && f.message;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <header style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <BLogo size={20} />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>Briesa</span>
          </Link>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#555", textDecoration: "none" }}>
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "64px 24px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "48px", alignItems: "start" }} className="r-grid-2">
        {/* Left — copy */}
        <div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "11px", fontWeight: 700, color: "#333" }}>[CONTACT]</span>
            <span style={{ fontSize: "11px", color: "#222" }}>//</span>
            <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: YELLOW }}>We&apos;d love to hear from you</span>
          </div>
          <h1 style={{ fontSize: "clamp(34px, 5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", color: "#fff", lineHeight: 1.05, margin: "0 0 16px" }}>
            Let&apos;s talk<br /><span style={{ color: YELLOW }}>safety.</span>
          </h1>
          <p style={{ fontSize: "15px", lineHeight: 1.65, color: "#666", margin: "0 0 32px", maxWidth: "380px" }}>
            Questions, a demo, or want to see how Briesa fits your sites? Send us a note and we&apos;ll get back to you within one business day.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              [Mail, "hello@briesa.com"],
              [Phone, "1300 BRIESA"],
              [MapPin, "Sydney · servicing all of Australia"],
            ].map(([Icon, text], i) => {
              const I = Icon as typeof Mail;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <I size={16} style={{ color: YELLOW, flexShrink: 0 }} />
                  <span style={{ fontSize: "13.5px", color: "#999" }}>{text as string}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right — form */}
        <div style={{ border: "1px solid #1a1a1a", background: "#0f0f0f", padding: "28px 24px" }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: "56px", height: "56px", margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,214,0,0.12)" }}>
                <Check size={28} style={{ color: YELLOW }} />
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Message sent</h2>
              <p style={{ fontSize: "13.5px", color: "#666", margin: 0 }}>Thanks {f.name.split(" ")[0] || "—"}. We&apos;ll be in touch shortly at {f.email}.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <Field label="Full name *"><input style={inputStyle} value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane Smith" required /></Field>
              <Field label="Work email *"><input type="email" style={inputStyle} value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="jane@company.com.au" required /></Field>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }} className="r-grid-2">
                <Field label="Company"><input style={inputStyle} value={f.company} onChange={(e) => set("company", e.target.value)} placeholder="Acme Pty Ltd" /></Field>
                <Field label="Phone"><input type="tel" style={inputStyle} value={f.phone} onChange={(e) => set("phone", e.target.value)} placeholder="04XX XXX XXX" /></Field>
              </div>
              <Field label="Message *">
                <textarea value={f.message} onChange={(e) => set("message", e.target.value)} rows={5} placeholder="How can we help?" required style={{ ...inputStyle, height: "auto", padding: "12px 14px", resize: "none", lineHeight: 1.5 }} />
              </Field>
              <button type="submit" disabled={!valid} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "48px", marginTop: "4px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", background: YELLOW, border: `1px solid ${YELLOW}`, cursor: valid ? "pointer" : "not-allowed", opacity: valid ? 1 : 0.4 }}>
                Send message <ArrowRight size={15} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
      <label style={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#666" }}>{label}</label>
      {children}
    </div>
  );
}
