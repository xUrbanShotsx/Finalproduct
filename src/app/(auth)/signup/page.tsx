"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Check } from "lucide-react";
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

type Step = "account" | "industry" | "organisation";

const STEPS: { key: Step; label: string }[] = [
  { key: "account", label: "Account" },
  { key: "industry", label: "Industry" },
  { key: "organisation", label: "Organisation" },
];

const inputStyle: React.CSSProperties = {
  background: "var(--b-bg-hover)",
  borderColor: "var(--b-border-strong)",
  color: "var(--b-text)",
};

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("account");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!industry) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, industry, org_name: orgName } },
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

  const accentBtn = {
    background: "var(--b-accent-bg)",
    borderColor: "var(--b-accent-border)",
    color: "var(--b-text)",
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--b-bg-canvas)" }}
    >
      <div className="w-full max-w-md">
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
        <div className="flex items-center justify-center gap-0 mb-8">
          {STEPS.map((s, i) => {
            const done = stepIndex > i;
            const active = stepIndex === i;
            return (
              <div key={s.key} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 flex items-center justify-center text-[11px] font-semibold transition-colors"
                    style={{
                      background: done
                        ? "var(--b-badge-green-bg)"
                        : active
                        ? "var(--b-bg-active)"
                        : "var(--b-bg-secondary)",
                      color: done
                        ? "var(--b-badge-green-text)"
                        : active
                        ? "var(--b-text)"
                        : "var(--b-text-muted)",
                      border: `1px solid ${done ? "var(--b-accent-border)" : "var(--b-border)"}`,
                    }}
                  >
                    {done ? <Check className="w-3 h-3" /> : i + 1}
                  </div>
                  <span
                    className="text-[12px] font-medium"
                    style={{
                      color: active
                        ? "var(--b-text)"
                        : done
                        ? "var(--b-accent-text)"
                        : "var(--b-text-muted)",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className="w-10 h-px mx-3"
                    style={{ background: done ? "var(--b-accent-border)" : "var(--b-border)" }}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div
          className="border p-6"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}
        >
          {/* Step 1 — Account */}
          {step === "account" && (
            <>
              <h2 className="text-[15px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>
                Create your account
              </h2>
              <p className="text-[12.5px] mb-6" style={{ color: "var(--b-text-muted)" }}>
                Get started with a 14-day free trial
              </p>
              <form onSubmit={(e) => { e.preventDefault(); setStep("industry"); }} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>
                    Full name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-3 h-10 text-[13px] border outline-none transition-colors"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>
                    Work email
                  </label>
                  <input
                    type="email"
                    placeholder="jane@company.com.au"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 h-10 text-[13px] border outline-none transition-colors"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    className="w-full px-3 h-10 text-[13px] border outline-none transition-colors"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full h-[38px] text-[13px] font-semibold border transition-colors mt-2"
                  style={accentBtn}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)";
                  }}
                >
                  Continue
                </button>
              </form>
              <p className="text-center text-[12px] mt-5" style={{ color: "var(--b-text-muted)" }}>
                Already have an account?{" "}
                <Link href="/login" className="transition-colors" style={{ color: "var(--b-accent-text)" }}>
                  Sign in
                </Link>
              </p>
            </>
          )}

          {/* Step 2 — Industry */}
          {step === "industry" && (
            <>
              <h2 className="text-[15px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>
                Select your industry
              </h2>
              <p className="text-[12.5px] mb-6" style={{ color: "var(--b-text-muted)" }}>
                Your dashboard and modules will be configured for your industry
              </p>
              <div className="space-y-2">
                {INDUSTRIES.map((ind) => {
                  const selected = industry === ind.key;
                  return (
                    <button
                      key={ind.key}
                      type="button"
                      onClick={() => setIndustry(ind.key)}
                      className="w-full text-left p-4 border transition-all"
                      style={{
                        background: selected ? "var(--b-accent-bg)" : "var(--b-bg-hover)",
                        borderColor: selected ? "var(--b-accent-border)" : "var(--b-border)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{ind.icon}</span>
                        <div>
                          <div className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>
                            {ind.label}
                          </div>
                          <div className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
                            {ind.description}
                          </div>
                        </div>
                        {selected && (
                          <div
                            className="ml-auto w-4 h-4 flex items-center justify-center"
                            style={{ background: "var(--b-badge-green-bg)" }}
                          >
                            <Check className="w-2.5 h-2.5" style={{ color: "var(--b-badge-green-text)" }} />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep("account")}
                  className="flex-1 h-[38px] border text-[13px] transition-colors"
                  style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-tertiary)" }}
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={!industry}
                  onClick={() => setStep("organisation")}
                  className="flex-1 h-[38px] text-[13px] font-semibold border transition-colors disabled:opacity-40"
                  style={accentBtn}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)";
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)";
                  }}
                >
                  Continue
                </button>
              </div>
            </>
          )}

          {/* Step 3 — Organisation */}
          {step === "organisation" && (
            <>
              <h2 className="text-[15px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>
                Your organisation
              </h2>
              <p className="text-[12.5px] mb-6" style={{ color: "var(--b-text-muted)" }}>
                This will appear on all reports and documents
              </p>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }}>
                    Organisation name
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Construction Pty Ltd"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                    className="w-full px-3 h-10 text-[13px] border outline-none transition-colors"
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
                  />
                </div>

                <div
                  className="flex items-center gap-3 p-3 border"
                  style={{ borderColor: "var(--b-border)", background: "var(--b-bg-hover)" }}
                >
                  <span className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>Industry</span>
                  <span
                    className="text-[12px] font-medium px-2 py-0.5 capitalize"
                    style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}
                  >
                    {industry}
                  </span>
                </div>

                {error && <p className="text-[12px]" style={{ color: "var(--destructive)" }}>{error}</p>}

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setStep("industry")}
                    className="flex-1 h-[38px] border text-[13px] transition-colors"
                    style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-tertiary)" }}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !orgName}
                    className="flex-1 h-[38px] text-[13px] font-semibold border transition-colors disabled:opacity-40"
                    style={accentBtn}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)";
                    }}
                  >
                    {loading ? "Creating…" : "Create account"}
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
