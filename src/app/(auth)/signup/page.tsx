"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Check, CreditCard, Lock } from "lucide-react";
import type { Industry } from "@/config/modules";

const INDUSTRIES: { key: Industry; label: string; description: string; icon: string }[] = [
  {
    key: "construction",
    label: "Construction",
    description: "Commercial, residential and civil construction sites",
    icon: "🏗️",
  },
  {
    key: "industrial",
    label: "Industrial",
    description: "Manufacturing, mining, warehousing and processing plants",
    icon: "🏭",
  },
  {
    key: "facilities",
    label: "Facilities",
    description: "Building management, property and facilities services",
    icon: "🏢",
  },
];

const PLANS = [
  {
    key: "small",
    name: "Small",
    price: "$249",
    tagline: "Up to 15 workers",
    capacity: "1–15 workers · 25 GB · ~150–300 AI calls/mo",
  },
  {
    key: "medium",
    name: "Medium",
    price: "$449",
    tagline: "15–50 workers",
    capacity: "15–50 workers · 75 GB · ~600–1,200 AI calls/mo",
    highlight: true,
    badge: "Most Popular",
  },
  {
    key: "large",
    name: "Large",
    price: "$649",
    tagline: "50–200+ workers",
    capacity: "50–200+ workers · 200 GB · ~2,000–4,000 AI calls/mo",
  },
] as const;

type PlanKey = "small" | "medium" | "large";
type Step = "account" | "industry" | "organisation" | "pricing" | "billing";

const STEPS: { key: Step; label: string }[] = [
  { key: "account",      label: "Account" },
  { key: "industry",     label: "Industry" },
  { key: "organisation", label: "Organisation" },
  { key: "pricing",      label: "Plan" },
  { key: "billing",      label: "Billing" },
];

const inputStyle: React.CSSProperties = {
  background: "var(--b-bg-hover)",
  borderColor: "var(--b-border-strong)",
  color: "var(--b-text)",
};

function formatCardNumber(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const digits = v.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
}

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep]         = useState<Step>("account");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [orgName, setOrgName]   = useState("");
  const [plan, setPlan]         = useState<PlanKey | null>(null);
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry]     = useState("");
  const [cvv, setCvv]           = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!industry || !plan) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, industry, org_name: orgName, plan } },
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

  const accentBtn: React.CSSProperties = {
    background: "var(--b-accent-bg)",
    borderColor: "var(--b-accent-border)",
    color: "var(--b-text)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--b-bg-canvas)" }}
    >
      <div className="w-full" style={{ maxWidth: step === "pricing" ? "680px" : "448px" }}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-10 h-10 border font-bold text-lg mb-4"
            style={{
              background: "var(--b-bg-secondary)",
              borderColor: "var(--b-border)",
              color: "var(--b-text)",
            }}
          >
            B
          </div>
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Briesa</h1>
          <p className="text-[13px] mt-1" style={{ color: "var(--b-text-muted)" }}>WHS Management Platform</p>
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-0 mb-8 overflow-x-auto">
          {STEPS.map((s, i) => {
            const done   = stepIndex > i;
            const active = stepIndex === i;
            return (
              <div key={s.key} className="flex items-center flex-shrink-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 flex items-center justify-center text-[11px] font-semibold transition-colors"
                    style={{
                      background: done ? "var(--b-badge-green-bg)" : active ? "var(--b-bg-active)" : "var(--b-bg-secondary)",
                      color:      done ? "var(--b-badge-green-text)" : active ? "var(--b-text)" : "var(--b-text-muted)",
                      border:     `1px solid ${done ? "var(--b-accent-border)" : "var(--b-border)"}`,
                    }}
                  >
                    {done ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span
                    className="text-[12px] font-medium"
                    style={{ color: active ? "var(--b-text)" : done ? "var(--b-accent-text)" : "var(--b-text-muted)" }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-8 h-px mx-2" style={{ background: done ? "var(--b-accent-border)" : "var(--b-border)" }} />
                )}
              </div>
            );
          })}
        </div>

        <div
          className="border p-6"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}
        >
          {/* ── Step 1: Account ── */}
          {step === "account" && (
            <>
              <h2 className="text-[15px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>Create your account</h2>
              <p className="text-[12.5px] mb-6" style={{ color: "var(--b-text-muted)" }}>Free demo available. Full access to all modules.</p>
              <form onSubmit={(e) => { e.preventDefault(); setStep("industry"); }} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>Full name</label>
                  <input type="text" placeholder="Jane Smith" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-3 h-10 text-[13px] border outline-none transition-colors" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>Work email</label>
                  <input type="email" placeholder="jane@company.com.au" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 h-10 text-[13px] border outline-none transition-colors" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required className="w-full px-3 h-10 text-[13px] border outline-none transition-colors" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                </div>
                <button type="submit" className="w-full h-[38px] text-[13px] font-semibold border transition-colors mt-2" style={accentBtn}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)"; }}>
                  Continue
                </button>
              </form>
              <p className="text-center text-[12px] mt-5" style={{ color: "var(--b-text-muted)" }}>
                Already have an account?{" "}
                <Link href="/login" className="transition-colors" style={{ color: "var(--b-accent-text)" }}>Sign in</Link>
              </p>
            </>
          )}

          {/* ── Step 2: Industry ── */}
          {step === "industry" && (
            <>
              <h2 className="text-[15px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>Select your industry</h2>
              <p className="text-[12.5px] mb-6" style={{ color: "var(--b-text-muted)" }}>Your dashboard and modules will be configured for your industry</p>
              <div className="space-y-2">
                {INDUSTRIES.map((ind) => {
                  const selected = industry === ind.key;
                  return (
                    <button key={ind.key} type="button" onClick={() => setIndustry(ind.key)} className="w-full text-left p-4 border transition-all"
                      style={{ background: selected ? "var(--b-accent-bg)" : "var(--b-bg-hover)", borderColor: selected ? "var(--b-accent-border)" : "var(--b-border)" }}>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{ind.icon}</span>
                        <div>
                          <div className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{ind.label}</div>
                          <div className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{ind.description}</div>
                        </div>
                        {selected && (
                          <div className="ml-auto w-4 h-4 flex items-center justify-center" style={{ background: "var(--b-badge-green-bg)" }}>
                            <Check className="w-2.5 h-2.5" style={{ color: "var(--b-badge-green-text)" }} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setStep("account")} className="flex-1 h-[38px] border text-[13px] transition-colors"
                  style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-tertiary)" }}>Back</button>
                <button type="button" disabled={!industry} onClick={() => setStep("organisation")} className="flex-1 h-[38px] text-[13px] font-semibold border transition-colors disabled:opacity-40" style={accentBtn}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)"; }}>
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ── Step 3: Organisation ── */}
          {step === "organisation" && (
            <>
              <h2 className="text-[15px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>Your organisation</h2>
              <p className="text-[12.5px] mb-6" style={{ color: "var(--b-text-muted)" }}>This will appear on all reports and documents</p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>Organisation name</label>
                  <input type="text" placeholder="Acme Construction Pty Ltd" value={orgName} onChange={(e) => setOrgName(e.target.value)} required className="w-full px-3 h-10 text-[13px] border outline-none transition-colors" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                </div>
                <div className="flex items-center gap-3 p-3 border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-hover)" }}>
                  <span className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>Industry</span>
                  <span className="text-[12px] font-medium px-2 py-0.5 capitalize" style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>{industry}</span>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep("industry")} className="flex-1 h-[38px] border text-[13px] transition-colors"
                    style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-tertiary)" }}>Back</button>
                  <button type="button" disabled={!orgName} onClick={() => setStep("pricing")} className="flex-1 h-[38px] text-[13px] font-semibold border transition-colors disabled:opacity-40" style={accentBtn}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)"; }}>
                    Continue
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── Step 4: Pricing ── */}
          {step === "pricing" && (
            <>
              <h2 className="text-[15px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>Choose your plan</h2>
              <p className="text-[12.5px] mb-6" style={{ color: "var(--b-text-muted)" }}>Flat monthly pricing based on workforce size. All 9 WHS modules included.</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {PLANS.map((p) => {
                  const selected = plan === p.key;
                  return (
                    <button key={p.key} type="button" onClick={() => setPlan(p.key)}
                      className="text-left border transition-all relative"
                      style={{
                        background: selected ? "var(--b-accent-bg)" : "var(--b-bg-hover)",
                        borderColor: selected ? "var(--b-accent-border)" : "var(--b-border)",
                      }}>
                      {"highlight" in p && p.highlight && (
                        <div className="h-[2px]" style={{ background: "var(--b-text)" }} />
                      )}
                      {"badge" in p && p.badge && (
                        <div className="absolute top-0 right-0 text-[8px] font-bold px-2 py-1 font-mono"
                          style={{ background: "var(--b-text)", color: "var(--b-bg-canvas)" }}>
                          [{p.badge}]
                        </div>
                      )}
                      <div className="p-4">
                        <div className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--b-text-muted)" }}>{p.name}</div>
                        <div className="flex items-baseline gap-1 mb-1">
                          <span className="text-[28px] font-bold leading-none" style={{ color: "var(--b-text)" }}>{p.price}</span>
                          <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>/mo</span>
                        </div>
                        <div className="text-[11px] font-medium mb-3" style={{ color: "var(--b-text-secondary)" }}>{p.tagline}</div>
                        <div className="text-[10px] leading-relaxed" style={{ color: "var(--b-text-muted)" }}>{p.capacity}</div>
                        {selected && (
                          <div className="mt-3 flex items-center gap-1.5">
                            <div className="w-3.5 h-3.5 flex items-center justify-center" style={{ background: "var(--b-badge-green-bg)" }}>
                              <Check className="w-2.5 h-2.5" style={{ color: "var(--b-badge-green-text)" }} />
                            </div>
                            <span className="text-[10px] font-semibold" style={{ color: "var(--b-badge-green-text)" }}>Selected</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep("organisation")} className="flex-1 h-[38px] border text-[13px] transition-colors"
                  style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-tertiary)" }}>Back</button>
                <button type="button" disabled={!plan} onClick={() => setStep("billing")} className="flex-1 h-[38px] text-[13px] font-semibold border transition-colors disabled:opacity-40" style={accentBtn}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)"; }}>
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ── Step 5: Billing ── */}
          {step === "billing" && (
            <>
              <h2 className="text-[15px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>Payment details</h2>
              <p className="text-[12.5px] mb-1" style={{ color: "var(--b-text-muted)" }}>
                {PLANS.find((p) => p.key === plan)?.name} plan — {PLANS.find((p) => p.key === plan)?.price}/month
              </p>
              <div className="flex items-center gap-1.5 mb-6">
                <Lock className="w-3 h-3" style={{ color: "var(--b-text-muted)" }} />
                <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>Secured with 256-bit SSL encryption</span>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>Cardholder name</label>
                  <input type="text" placeholder="Jane Smith" value={cardName} onChange={(e) => setCardName(e.target.value)} required className="w-full px-3 h-10 text-[13px] border outline-none transition-colors" style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>Card number</label>
                  <div className="relative">
                    <input type="text" inputMode="numeric" placeholder="1234 5678 9012 3456" value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      required className="w-full pl-3 pr-10 h-10 text-[13px] border outline-none transition-colors font-mono" style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>Expiry</label>
                    <input type="text" inputMode="numeric" placeholder="MM/YY" value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      required className="w-full px-3 h-10 text-[13px] border outline-none transition-colors font-mono" style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>CVV</label>
                    <input type="text" inputMode="numeric" placeholder="•••" value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      required className="w-full px-3 h-10 text-[13px] border outline-none transition-colors font-mono" style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")} />
                  </div>
                </div>

                {error && <p className="text-[12px]" style={{ color: "var(--destructive)" }}>{error}</p>}

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setStep("pricing")} className="flex-1 h-[38px] border text-[13px] transition-colors"
                    style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-tertiary)" }}>Back</button>
                  <button type="submit" disabled={loading || !cardName || !cardNumber || !expiry || !cvv}
                    className="flex-1 h-[38px] text-[13px] font-semibold border transition-colors disabled:opacity-40" style={accentBtn}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)"; }}>
                    {loading ? "Creating account…" : "Start subscription"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-[11px] mt-6" style={{ color: "var(--b-text-muted)" }}>
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
