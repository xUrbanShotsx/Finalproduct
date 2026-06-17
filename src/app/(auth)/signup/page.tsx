"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Check, CreditCard, Lock, ArrowRight } from "lucide-react";
import type { Industry } from "@/config/modules";

function BLogo({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill={color} />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill={color} />
    </svg>
  );
}

const INDUSTRIES: { key: Industry; label: string; description: string }[] = [
  { key: "construction", label: "Construction",  description: "Commercial, residential and civil construction" },
  { key: "industrial",   label: "Industrial",    description: "Manufacturing, mining and warehousing" },
  { key: "facilities",   label: "Facilities",    description: "Building management and facilities services" },
];

type PlanKey = "small" | "medium" | "large";

const PLANS: { key: PlanKey; name: string; monthlyPrice: number; tagline: string; workers: string; storage: string; ai: string; popular?: boolean }[] = [
  { key: "small",  name: "Small",  monthlyPrice: 249, tagline: "Up to 15 workers",    workers: "1–15",     storage: "25 GB",  ai: "~300 AI calls/mo" },
  { key: "medium", name: "Medium", monthlyPrice: 449, tagline: "15–50 workers",       workers: "15–50",    storage: "75 GB",  ai: "~1,200 AI calls/mo", popular: true },
  { key: "large",  name: "Large",  monthlyPrice: 649, tagline: "50–200+ workers",     workers: "50–200+",  storage: "200 GB", ai: "~4,000 AI calls/mo" },
];

type BillingCycle = "monthly" | "yearly";
type Step = "account" | "industry" | "organisation";

const STEPS: { key: Step; label: string }[] = [
  { key: "account",      label: "Account" },
  { key: "industry",     label: "Industry" },
  { key: "organisation", label: "Organisation" },
];

function yearlyPrice(monthly: number) {
  return Math.round(monthly * 0.9);
}

function inputCls() {
  return "w-full px-3 h-10 text-[13px] border outline-none transition-colors";
}

const baseInput: React.CSSProperties = {
  background: "var(--b-bg-hover)",
  borderColor: "var(--b-border-strong)",
  color: "var(--b-text)",
};

function PrimaryBtn({ children, onClick, disabled, type = "button" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className="flex-1 h-[42px] text-[13px] font-semibold border transition-all disabled:opacity-30 flex items-center justify-center gap-2"
      style={{ background: "var(--b-accent-bg)", borderColor: "var(--b-accent-border)", color: "var(--b-text)" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)"; }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex-1 h-[42px] border text-[13px] transition-all"
      style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-tertiary)", background: "transparent" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--b-text-muted)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border-strong)"; (e.currentTarget as HTMLElement).style.color = "var(--b-text-tertiary)"; }}>
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11.5px] font-semibold tracking-wide uppercase" style={{ color: "var(--b-text-muted)" }}>{label}</label>
      {children}
    </div>
  );
}

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep]           = useState<Step>("account");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [fullName, setFullName]   = useState("");
  const [industry, setIndustry]   = useState<Industry | null>(null);
  const [orgName, setOrgName]     = useState("");
  const [plan, setPlan]           = useState<PlanKey | null>(null);
  const [billing, setBilling]     = useState<BillingCycle>("monthly");
  const [cardName, setCardName]   = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry]       = useState("");
  const [cvv, setCvv]             = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!industry || !plan) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, industry, org_name: orgName, plan, billing } },
    });
    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Signup failed");
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step);
  const isWide    = step === "organisation";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: "var(--b-bg-canvas)" }}>

      {/* ── Logo ── */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <Link href="/" className="transition-opacity hover:opacity-70">
          <BLogo size={32} color="var(--b-text)" />
        </Link>
        <div className="text-center">
          <p className="text-[13px]" style={{ color: "var(--b-text-muted)" }}>WHS Management Platform</p>
        </div>
        <Link href="/" className="flex items-center gap-1.5 text-[12px] transition-colors"
          style={{ color: "var(--b-text-muted)" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "var(--b-text)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "var(--b-text-muted)")}>
          ← Back to home
        </Link>
      </div>

      {/* ── Step bar ── */}
      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => {
          const done   = stepIndex > i;
          const active = stepIndex === i;
          return (
            <div key={s.key} className="flex items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 flex items-center justify-center text-[11px] font-bold transition-all"
                  style={{
                    background: done ? "var(--b-badge-green-bg)" : active ? "var(--b-bg-active)" : "transparent",
                    color:      done ? "var(--b-badge-green-text)" : active ? "var(--b-text)" : "var(--b-text-muted)",
                    border:     `1px solid ${done ? "var(--b-badge-green-text)" : active ? "var(--b-border-hover)" : "var(--b-border)"}`,
                  }}>
                  {done ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <span className="text-[12.5px] font-medium"
                  style={{ color: active ? "var(--b-text)" : done ? "var(--b-badge-green-text)" : "var(--b-text-muted)" }}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="w-12 h-px mx-4" style={{ background: done ? "var(--b-badge-green-text)" : "var(--b-border)" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* ── Card ── */}
      <div className="w-full transition-all duration-200" style={{ maxWidth: isWide ? "760px" : "420px" }}>
        <div className="border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>

          {/* ── Step 1: Account ── */}
          {step === "account" && (
            <div className="p-8">
              <div className="mb-7">
                <h2 className="text-[18px] font-bold mb-1" style={{ color: "var(--b-text)" }}>Create your account</h2>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); setStep("industry"); }} className="space-y-5">
                <Field label="Full name">
                  <input type="text" placeholder="Jane Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} required className={inputCls()} style={baseInput}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                </Field>
                <Field label="Work email">
                  <input type="email" placeholder="jane@company.com.au" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls()} style={baseInput}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                </Field>
                <Field label="Password">
                  <input type="password" placeholder="Min. 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required className={inputCls()} style={baseInput}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                </Field>
                <div className="pt-1 flex">
                  <PrimaryBtn type="submit">Continue <ArrowRight className="w-3.5 h-3.5" /></PrimaryBtn>
                </div>
              </form>
              <p className="text-center text-[12px] mt-6" style={{ color: "var(--b-text-muted)" }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "var(--b-accent-text)" }}>Sign in</Link>
              </p>
            </div>
          )}

          {/* ── Step 2: Industry ── */}
          {step === "industry" && (
            <div className="p-8">
              <div className="mb-7">
                <h2 className="text-[18px] font-bold mb-1" style={{ color: "var(--b-text)" }}>Select your industry</h2>
                <p className="text-[13px]" style={{ color: "var(--b-text-muted)" }}>Your modules and defaults will be configured accordingly.</p>
              </div>
              <div className="space-y-2 mb-7">
                {INDUSTRIES.map((ind) => {
                  const sel = industry === ind.key;
                  return (
                    <button key={ind.key} type="button" onClick={() => setIndustry(ind.key)}
                      className="w-full text-left px-4 py-3.5 border transition-all flex items-center justify-between"
                      style={{ background: sel ? "var(--b-accent-bg)" : "var(--b-bg-hover)", borderColor: sel ? "var(--b-accent-border)" : "var(--b-border)" }}>
                      <div>
                        <div className="text-[13.5px] font-semibold" style={{ color: "var(--b-text)" }}>{ind.label}</div>
                        <div className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{ind.description}</div>
                      </div>
                      {sel && (
                        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 ml-4" style={{ background: "var(--b-badge-green-bg)" }}>
                          <Check className="w-3 h-3" style={{ color: "var(--b-badge-green-text)" }} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <GhostBtn onClick={() => setStep("account")}>Back</GhostBtn>
                <PrimaryBtn disabled={!industry} onClick={() => setStep("organisation")}>Continue <ArrowRight className="w-3.5 h-3.5" /></PrimaryBtn>
              </div>
            </div>
          )}

          {/* ── Step 3: Organisation + Plan + Billing ── */}
          {step === "organisation" && (
            <form onSubmit={handleSignup}>
              {/* Header */}
              <div className="px-8 pt-8 pb-6 border-b" style={{ borderColor: "var(--b-border)" }}>
                <h2 className="text-[18px] font-bold mb-1" style={{ color: "var(--b-text)" }}>Set up your organisation</h2>
                <p className="text-[13px]" style={{ color: "var(--b-text-muted)" }}>Name your organisation, choose a plan, and enter payment details.</p>
              </div>

              <div className="p-8 space-y-8">

                {/* Org name */}
                <div>
                  <Field label="Organisation name">
                    <input type="text" placeholder="Acme Construction Pty Ltd" value={orgName} onChange={(e) => setOrgName(e.target.value)} required className={inputCls()} style={baseInput}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                  </Field>
                  {industry && (
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>Industry</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 capitalize" style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>{industry}</span>
                    </div>
                  )}
                </div>

                {/* Billing toggle */}
                <div>
                  <p className="text-[11.5px] font-semibold tracking-wide uppercase mb-3" style={{ color: "var(--b-text-muted)" }}>Billing cycle</p>
                  <div className="inline-flex border" style={{ borderColor: "var(--b-border)" }}>
                    {(["monthly", "yearly"] as BillingCycle[]).map((cycle) => (
                      <button key={cycle} type="button" onClick={() => setBilling(cycle)}
                        className="px-5 h-9 text-[12.5px] font-semibold transition-all flex items-center gap-2"
                        style={{
                          background: billing === cycle ? "var(--b-bg-active)" : "transparent",
                          color:      billing === cycle ? "var(--b-text)" : "var(--b-text-muted)",
                          borderRight: cycle === "monthly" ? "1px solid var(--b-border)" : undefined,
                        }}>
                        {cycle === "monthly" ? "Monthly" : "Yearly"}
                        {cycle === "yearly" && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5" style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>
                            10% off
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Plan cards */}
                <div>
                  <p className="text-[11.5px] font-semibold tracking-wide uppercase mb-3" style={{ color: "var(--b-text-muted)" }}>Choose a plan</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {PLANS.map((p) => {
                      const sel        = plan === p.key;
                      const price      = billing === "yearly" ? yearlyPrice(p.monthlyPrice) : p.monthlyPrice;
                      const fullPrice  = p.monthlyPrice;
                      return (
                        <button key={p.key} type="button" onClick={() => setPlan(p.key)}
                          className="text-left border transition-all relative overflow-hidden"
                          style={{ background: sel ? "var(--b-accent-bg)" : "var(--b-bg-hover)", borderColor: sel ? "var(--b-accent-border)" : "var(--b-border)" }}>
                          {p.popular && <div className="h-[2px]" style={{ background: sel ? "var(--b-accent-text)" : "var(--b-text-muted)" }} />}
                          <div className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--b-text-muted)" }}>{p.name}</span>
                              {p.popular && (
                                <span className="text-[9px] font-bold px-1.5 py-0.5" style={{ background: "var(--b-bg-active)", color: "var(--b-text-secondary)" }}>POPULAR</span>
                              )}
                            </div>
                            <div className="flex items-baseline gap-1 mb-0.5">
                              <span className="text-[26px] font-bold leading-none" style={{ color: "var(--b-text)" }}>${price}</span>
                              <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>/mo</span>
                            </div>
                            {billing === "yearly" && (
                              <p className="text-[10px] mb-2" style={{ color: "var(--b-text-muted)" }}>
                                <span style={{ textDecoration: "line-through" }}>${fullPrice}</span> billed annually
                              </p>
                            )}
                            <p className="text-[11px] font-medium mt-1 mb-3" style={{ color: "var(--b-text-secondary)" }}>{p.tagline}</p>
                            <div className="space-y-1 text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>
                              <div>{p.workers} workers</div>
                              <div>{p.storage} storage</div>
                              <div>{p.ai}</div>
                            </div>
                            {sel && (
                              <div className="mt-3 flex items-center gap-1.5">
                                <Check className="w-3 h-3" style={{ color: "var(--b-badge-green-text)" }} />
                                <span className="text-[10px] font-bold" style={{ color: "var(--b-badge-green-text)" }}>Selected</span>
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Card details */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11.5px] font-semibold tracking-wide uppercase" style={{ color: "var(--b-text-muted)" }}>Payment details</p>
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3 h-3" style={{ color: "var(--b-text-muted)" }} />
                      <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>256-bit SSL</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Field label="Cardholder name">
                      <input type="text" placeholder="Jane Smith" value={cardName} onChange={(e) => setCardName(e.target.value)} required className={inputCls()} style={baseInput}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                    </Field>
                    <Field label="Card number">
                      <div className="relative">
                        <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          required className={inputCls() + " pr-10 font-mono"} style={baseInput}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
                      </div>
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Expiry">
                        <input type="text" inputMode="numeric" placeholder="MM / YY" value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          required className={inputCls() + " font-mono"} style={baseInput}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                      </Field>
                      <Field label="CVV">
                        <input type="text" inputMode="numeric" placeholder="•••" value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          required className={inputCls() + " font-mono"} style={baseInput}
                          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                      </Field>
                    </div>
                  </div>
                </div>

                {error && <p className="text-[12px]" style={{ color: "var(--destructive)" }}>{error}</p>}

                {/* Summary + submit */}
                {plan && (
                  <div className="border-t pt-6" style={{ borderColor: "var(--b-border)" }}>
                    <div className="flex items-center justify-between mb-5 text-[13px]">
                      <span style={{ color: "var(--b-text-muted)" }}>
                        {PLANS.find(p => p.key === plan)?.name} plan · {billing === "monthly" ? "Monthly" : "Billed annually"}
                      </span>
                      <span className="font-bold" style={{ color: "var(--b-text)" }}>
                        ${billing === "yearly"
                          ? yearlyPrice(PLANS.find(p => p.key === plan)!.monthlyPrice)
                          : PLANS.find(p => p.key === plan)!.monthlyPrice}/mo
                      </span>
                    </div>
                    <div className="flex gap-3">
                      <GhostBtn onClick={() => setStep("industry")}>Back</GhostBtn>
                      <PrimaryBtn type="submit" disabled={loading || !orgName || !plan || !cardName || !cardNumber || !expiry || !cvv}>
                        {loading ? "Creating account…" : "Start subscription"}
                      </PrimaryBtn>
                    </div>
                  </div>
                )}

                {!plan && (
                  <div className="flex gap-3 border-t pt-6" style={{ borderColor: "var(--b-border)" }}>
                    <GhostBtn onClick={() => setStep("industry")}>Back</GhostBtn>
                  </div>
                )}

              </div>
            </form>
          )}
        </div>

        <p className="text-center text-[11px] mt-6" style={{ color: "var(--b-text-muted)" }}>
          By creating an account you agree to our{" "}
          <span style={{ color: "var(--b-text-tertiary)" }}>Terms of Service</span> and{" "}
          <span style={{ color: "var(--b-text-tertiary)" }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
