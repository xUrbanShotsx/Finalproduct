"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Lock, Sparkles, FileText, CreditCard } from "lucide-react";
import {
  ALL_STANDARDS, STANDARDS, priceFor, bundleLabel, fmtAUD, docCount,
  type ISOStandard,
} from "@/config/blueprints";

const YELLOW = "#ffd600";

function BLogo({ size = 20, color = "#ffffff" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill={color} />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill={color} />
    </svg>
  );
}

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const STEPS = ["Your pack", "Business details", "Payment", "Done"];

const inputStyle: React.CSSProperties = {
  width: "100%", height: "44px", padding: "0 14px", fontSize: "14px",
  background: "#0f0f0f", border: "1px solid #222", color: "#e0e0e0", outline: "none",
};

function fmtCard(v: string) { return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); }
function fmtExp(v: string) { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; }

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <Checkout />
    </Suspense>
  );
}

function Checkout() {
  const params = useSearchParams();
  const planParam = Math.max(1, Math.min(3, Number(params.get("plan")) || 1));

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Set<ISOStandard>>(() => new Set(ALL_STANDARDS.slice(0, planParam)));

  // business
  const [biz, setBiz] = useState({
    orgName: "", abn: "", industry: "", state: "NSW", employeeCount: "", sites: "",
    scope: "", existingCerts: "", contactName: "", contactEmail: "", contactPhone: "", position: "",
  });
  // payment
  const [pay, setPay] = useState({ cardName: "", cardNumber: "", expiry: "", cvv: "" });

  const count = selected.size;
  const price = priceFor(count);
  const totalDocs = [...selected].reduce((s, k) => s + docCount(k), 0);

  function setB<K extends keyof typeof biz>(k: K, v: string) { setBiz((p) => ({ ...p, [k]: v })); }
  function setP<K extends keyof typeof pay>(k: K, v: string) { setPay((p) => ({ ...p, [k]: v })); }
  function toggle(k: ISOStandard) { setSelected((p) => { const n = new Set(p); n.has(k) ? n.delete(k) : n.add(k); return n; }); }

  const bizValid = biz.orgName && biz.industry && biz.employeeCount && biz.scope && biz.contactName && biz.contactEmail;
  const payValid = pay.cardName && pay.cardNumber.replace(/\s/g, "").length >= 15 && pay.expiry.length === 5 && pay.cvv.length >= 3;

  return (
    <div style={{ background: "#0a0a0a", minHeight: "100vh", fontFamily: "'Space Grotesk', sans-serif" }}>
      {/* Nav */}
      <header style={{ borderBottom: "1px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <BLogo size={20} />
            <span style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.03em", color: "#ffffff" }}>Briesa</span>
          </Link>
          <Link href="/blueprints-iso" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "#555", textDecoration: "none" }}>
            <ArrowLeft size={14} /> Back to Blueprints
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>
        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0", marginBottom: "40px" }}>
          {STEPS.map((s, i) => {
            const done = step > i; const active = step === i;
            return (
              <div key={s} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                  <div style={{ width: "24px", height: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, background: done ? YELLOW : active ? "#1a1a1a" : "transparent", color: done ? "#0a0a0a" : active ? "#fff" : "#555", border: `1px solid ${done ? YELLOW : active ? "#333" : "#222"}` }}>
                    {done ? <Check size={13} /> : i + 1}
                  </div>
                  <span className="r-hide-mobile" style={{ fontSize: "12.5px", fontWeight: 500, color: active ? "#fff" : done ? "#999" : "#555" }}>{s}</span>
                </div>
                {i < STEPS.length - 1 && <div style={{ width: "32px", height: "1px", margin: "0 14px", background: done ? YELLOW : "#222" }} />}
              </div>
            );
          })}
        </div>

        {/* ── Step 1: Pack ── */}
        {step === 0 && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 6px" }}>Choose your standards</h1>
            <p style={{ fontSize: "13.5px", color: "#666", margin: "0 0 24px" }}>Select the ISO standards you want in your blueprint pack. Pricing updates automatically.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {ALL_STANDARDS.map((k) => {
                const s = STANDARDS[k]; const sel = selected.has(k);
                return (
                  <button key={k} onClick={() => toggle(k)} style={{ display: "flex", alignItems: "center", gap: "14px", textAlign: "left", padding: "16px 18px", background: sel ? "#0f0f0f" : "transparent", border: `1px solid ${sel ? s.color : "#222"}`, cursor: "pointer" }}>
                    <div style={{ width: "20px", height: "20px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${sel ? s.color : "#333"}`, background: sel ? s.color : "transparent" }}>
                      {sel && <Check size={13} style={{ color: "#0a0a0a" }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "monospace", fontSize: "12px", fontWeight: 700, color: s.color }}>{s.code}{s.year}</span>
                        <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#e0e0e0" }}>{s.name}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#666", marginTop: "2px" }}>{s.tagline}</div>
                    </div>
                    <span style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11.5px", color: "#555", flexShrink: 0 }}><FileText size={13} /> {docCount(k)} docs</span>
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "24px", padding: "18px 20px", border: "1px solid #1a1a1a", background: "#0f0f0f" }}>
              <div>
                <div style={{ fontSize: "13px", color: "#999" }}>{count === 0 ? "Select at least one standard" : `${bundleLabel(count)} · ${totalDocs} documents`}</div>
                {count > 0 && <div style={{ fontSize: "11.5px", color: "#555", marginTop: "2px" }}>One-off purchase · AUD</div>}
              </div>
              <div style={{ fontSize: "26px", fontWeight: 800, color: "#fff" }}>{fmtAUD(price)}</div>
            </div>

            <NavRow onNext={() => setStep(1)} nextDisabled={count === 0} nextLabel="Continue" />
          </div>
        )}

        {/* ── Step 2: Business questionnaire ── */}
        {step === 1 && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 6px" }}>Tell us about your business</h1>
            <p style={{ fontSize: "13.5px", color: "#666", margin: "0 0 24px" }}>We tailor every document in your pack to these details, so they&apos;re ready for your certification audit.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Row>
                <Field label="Organisation name *"><input style={inputStyle} value={biz.orgName} onChange={(e) => setB("orgName", e.target.value)} placeholder="Acme Pty Ltd" /></Field>
                <Field label="ABN"><input style={inputStyle} value={biz.abn} onChange={(e) => setB("abn", e.target.value)} placeholder="54 123 456 789" /></Field>
              </Row>
              <Row>
                <Field label="Industry *"><input style={inputStyle} value={biz.industry} onChange={(e) => setB("industry", e.target.value)} placeholder="Construction" /></Field>
                <Field label="State *">
                  <select style={inputStyle} value={biz.state} onChange={(e) => setB("state", e.target.value)}>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
                </Field>
                <Field label="Employees *"><input style={inputStyle} value={biz.employeeCount} onChange={(e) => setB("employeeCount", e.target.value)} placeholder="42" /></Field>
              </Row>
              <Field label="Site locations"><input style={inputStyle} value={biz.sites} onChange={(e) => setB("sites", e.target.value)} placeholder="Parramatta, Liverpool (comma separated)" /></Field>
              <Field label="Scope of certification *">
                <textarea value={biz.scope} onChange={(e) => setB("scope", e.target.value)} rows={3} placeholder="Describe the activities, products or services to be covered by the management system…" style={{ ...inputStyle, height: "auto", padding: "10px 14px", resize: "none", lineHeight: 1.5 }} />
              </Field>
              <Field label="Existing certifications"><input style={inputStyle} value={biz.existingCerts} onChange={(e) => setB("existingCerts", e.target.value)} placeholder="e.g. ISO 9001 (comma separated)" /></Field>

              <div style={{ height: "1px", background: "#1a1a1a", margin: "4px 0" }} />
              <Row>
                <Field label="Primary contact *"><input style={inputStyle} value={biz.contactName} onChange={(e) => setB("contactName", e.target.value)} placeholder="Jane Smith" /></Field>
                <Field label="Position / title"><input style={inputStyle} value={biz.position} onChange={(e) => setB("position", e.target.value)} placeholder="WHS Manager" /></Field>
              </Row>
              <Row>
                <Field label="Work email *"><input type="email" style={inputStyle} value={biz.contactEmail} onChange={(e) => setB("contactEmail", e.target.value)} placeholder="jane@company.com.au" /></Field>
                <Field label="Phone"><input type="tel" style={inputStyle} value={biz.contactPhone} onChange={(e) => setB("contactPhone", e.target.value)} placeholder="04XX XXX XXX" /></Field>
              </Row>
            </div>

            <NavRow onBack={() => setStep(0)} onNext={() => setStep(2)} nextDisabled={!bizValid} nextLabel="Continue to payment" />
          </div>
        )}

        {/* ── Step 3: Payment ── */}
        {step === 2 && (
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 6px" }}>Payment</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", margin: "0 0 24px" }}>
              <Lock size={12} style={{ color: "#555" }} />
              <span style={{ fontSize: "12px", color: "#555" }}>Secured with 256-bit SSL encryption</span>
            </div>

            {/* Order summary */}
            <div style={{ border: "1px solid #1a1a1a", background: "#0f0f0f", padding: "18px 20px", marginBottom: "24px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#555", marginBottom: "12px" }}>Order summary</div>
              {[...selected].map((k) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: "13px" }}>
                  <span style={{ color: "#999" }}>{STANDARDS[k].code} — {STANDARDS[k].name}</span>
                  <span style={{ color: "#666", fontFamily: "monospace" }}>{docCount(k)} docs</span>
                </div>
              ))}
              <div style={{ height: "1px", background: "#1a1a1a", margin: "12px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: "13px", color: "#999" }}>{bundleLabel(count)} · one-off</span>
                <span style={{ fontSize: "24px", fontWeight: 800, color: "#fff" }}>{fmtAUD(price)} <span style={{ fontSize: "12px", color: "#555" }}>AUD</span></span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Field label="Cardholder name"><input style={inputStyle} value={pay.cardName} onChange={(e) => setP("cardName", e.target.value)} placeholder="Jane Smith" /></Field>
              <Field label="Card number">
                <div style={{ position: "relative" }}>
                  <input style={{ ...inputStyle, fontFamily: "monospace", paddingRight: "40px" }} inputMode="numeric" value={pay.cardNumber} onChange={(e) => setP("cardNumber", fmtCard(e.target.value))} placeholder="1234 5678 9012 3456" />
                  <CreditCard size={16} style={{ position: "absolute", right: "14px", top: "14px", color: "#555" }} />
                </div>
              </Field>
              <Row>
                <Field label="Expiry"><input style={{ ...inputStyle, fontFamily: "monospace" }} inputMode="numeric" value={pay.expiry} onChange={(e) => setP("expiry", fmtExp(e.target.value))} placeholder="MM / YY" /></Field>
                <Field label="CVV"><input style={{ ...inputStyle, fontFamily: "monospace" }} inputMode="numeric" value={pay.cvv} onChange={(e) => setP("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="•••" /></Field>
              </Row>
            </div>

            <NavRow onBack={() => setStep(1)} onNext={() => setStep(3)} nextDisabled={!payValid} nextLabel={`Pay ${fmtAUD(price)}`} />
          </div>
        )}

        {/* ── Step 4: Confirmation ── */}
        {step === 3 && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ width: "56px", height: "56px", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,214,0,0.12)" }}>
              <Check size={28} style={{ color: YELLOW }} />
            </div>
            <h1 style={{ fontSize: "26px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", margin: "0 0 10px" }}>Order confirmed</h1>
            <p style={{ fontSize: "14px", color: "#777", margin: "0 auto 6px", maxWidth: "440px", lineHeight: 1.6 }}>
              Thanks {biz.contactName.split(" ")[0] || "—"}. We&apos;ve received your {bundleLabel(count).toLowerCase()} for <strong style={{ color: "#e0e0e0" }}>{biz.orgName}</strong>.
            </p>
            <p style={{ fontSize: "13px", color: "#555", margin: "0 auto 28px", maxWidth: "460px", lineHeight: 1.6 }}>
              A receipt and your blueprint access link are on the way to <span style={{ color: "#999" }}>{biz.contactEmail}</span>. Generation of your {totalDocs} documents begins now.
            </p>

            <div style={{ display: "inline-flex", flexDirection: "column", gap: "8px", border: "1px solid #1a1a1a", background: "#0f0f0f", padding: "18px 24px", marginBottom: "28px", textAlign: "left", minWidth: "320px" }}>
              {[...selected].map((k) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                  <Sparkles size={13} style={{ color: YELLOW }} />
                  <span style={{ color: "#bbb" }}>{STANDARDS[k].code} — {STANDARDS[k].name}</span>
                </div>
              ))}
              <div style={{ height: "1px", background: "#1a1a1a", margin: "6px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "#666" }}>Total paid</span>
                <span style={{ color: "#fff", fontWeight: 700 }}>{fmtAUD(price)} AUD</span>
              </div>
            </div>

            <div>
              <Link href="/signup" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "14px 30px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", background: YELLOW, textDecoration: "none" }}>
                Access your blueprint <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NavRow({ onBack, onNext, nextDisabled, nextLabel }: { onBack?: () => void; onNext: () => void; nextDisabled?: boolean; nextLabel: string }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "28px" }}>
      {onBack && (
        <button onClick={onBack} style={{ padding: "0 22px", height: "46px", fontSize: "14px", fontWeight: 500, color: "#888", background: "transparent", border: "1px solid #222", cursor: "pointer" }}>Back</button>
      )}
      <button onClick={onNext} disabled={nextDisabled} style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "46px", fontSize: "14px", fontWeight: 700, color: "#0a0a0a", background: YELLOW, border: `1px solid ${YELLOW}`, cursor: nextDisabled ? "not-allowed" : "pointer", opacity: nextDisabled ? 0.4 : 1 }}>
        {nextLabel} <ArrowRight size={15} />
      </button>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="r-grid-row" style={{ display: "grid", gridTemplateColumns: `repeat(${Array.isArray(children) ? children.length : 1}, 1fr)`, gap: "14px" }}>{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
      <label style={{ fontSize: "11.5px", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "#666" }}>{label}</label>
      {children}
    </div>
  );
}
