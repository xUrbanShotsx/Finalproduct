"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Shield, Users, Settings, AlertTriangle, ArrowRight, CheckCircle2 } from "lucide-react";

const SUPABASE_CONFIGURED =
  typeof window !== "undefined"
    ? false
    : !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

const FEATURES = [
  { icon: Shield,        label: "Safety Management",   desc: "Incidents, SWMS, permits and toolbox talks" },
  { icon: Users,         label: "People & Workforce",  desc: "Inductions, contractor management, white cards" },
  { icon: Settings,      label: "Operations Control",  desc: "Work planning, plant inspections and work zones" },
  { icon: AlertTriangle, label: "Risk & Compliance",   desc: "Hazard register, CRCs, statutory obligations" },
];

const INDUSTRIES = ["Construction", "Industrial", "Facilities"];

// B logo SVG paths (same as TopBar)
function BLogo({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 25 L200 25 C290 25 340 75 340 150 C340 195 318 228 280 247 C330 265 360 305 360 360 C360 400 340 400 200 400 L50 400 Z" fill="currentColor"/>
      <polygon points="155,120 265,210 155,210" fill="var(--b-bg)"/>
      <polygon points="155,215 275,215 215,310" fill="var(--b-bg)"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!url || !url.startsWith("http")) {
      // Demo mode — bypass auth
      router.push("/dashboard");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  function handleDemoAccess() {
    router.push("/dashboard");
  }

  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

  return (
    <div className="min-h-screen flex" style={{ background: "var(--b-bg-canvas)" }}>

      {/* ── LEFT PANEL — brand ── */}
      <div
        className="hidden lg:flex lg:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "#111111" }}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(var(--b-border) 1px, transparent 1px), linear-gradient(90deg, var(--b-border) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top: logo + wordmark */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="text-white" style={{ color: "#3ecf8e" }}>
              <BLogo size={32} />
            </div>
            <span className="text-[20px] font-[700] tracking-tight text-white">Briesa</span>
          </div>
        </div>

        {/* Middle: hero text + features */}
        <div className="relative z-10 space-y-10">
          <div className="space-y-4">
            <div
              className="inline-block px-2.5 py-1 text-[11px] font-[600] uppercase tracking-widest border"
              style={{ borderColor: "#3ecf8e", color: "#3ecf8e", background: "rgba(62,207,142,0.08)" }}
            >
              Australian WHS Platform
            </div>
            <h1 className="text-[36px] font-[700] leading-[1.1] tracking-tight text-white">
              Safety management<br />built for the field
            </h1>
            <p className="text-[14.5px] leading-relaxed" style={{ color: "#888888" }}>
              Incident reporting, permits, risk assessments and critical risk
              control verification — all in one place, built for Australian
              construction, industrial and facilities teams.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3.5">
                <div
                  className="w-8 h-8 flex items-center justify-center flex-shrink-0 border"
                  style={{ background: "rgba(62,207,142,0.08)", borderColor: "rgba(62,207,142,0.2)" }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color: "#3ecf8e" }} />
                </div>
                <div>
                  <p className="text-[13px] font-[600] text-white">{label}</p>
                  <p className="text-[12px]" style={{ color: "#666666" }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: industry chips */}
        <div className="relative z-10 flex items-center gap-2">
          <span className="text-[11.5px]" style={{ color: "#555555" }}>Built for</span>
          {INDUSTRIES.map(ind => (
            <span
              key={ind}
              className="px-2.5 py-1 text-[11px] font-[600] border"
              style={{ borderColor: "#2e2e2e", color: "#888888", background: "#1a1a1a" }}
            >
              {ind}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12" style={{ background: "var(--b-bg)" }}>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <div style={{ color: "var(--b-accent-text)" }}><BLogo size={26} /></div>
          <span className="text-[18px] font-[700]" style={{ color: "var(--b-text)" }}>Briesa</span>
        </div>

        <div className="w-full max-w-[380px]">

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[22px] font-[700] tracking-tight" style={{ color: "var(--b-text)" }}>
              Welcome back
            </h2>
            <p className="text-[13px] mt-1" style={{ color: "var(--b-text-muted)" }}>
              Sign in to your Briesa workspace
            </p>
          </div>

          {/* Demo notice */}
          {isDemo && (
            <div
              className="flex items-start gap-3 p-3 mb-6 border"
              style={{ background: "var(--b-badge-green-bg)", borderColor: "var(--b-accent-border)" }}
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "var(--b-accent-text)" }} />
              <div>
                <p className="text-[12px] font-[600]" style={{ color: "var(--b-accent-text)" }}>Demo mode active</p>
                <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                  No credentials required — click below to explore the platform.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-[11.5px] font-[600] uppercase tracking-wide"
                style={{ color: "var(--b-text-tertiary)" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com.au"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required={!isDemo}
                className="w-full px-3 h-[40px] text-[13px] border outline-none transition-colors"
                style={{
                  background: "var(--b-bg-secondary)",
                  borderColor: "var(--b-border-strong)",
                  color: "var(--b-text)",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--b-accent-text)")}
                onBlur={e  => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-[11.5px] font-[600] uppercase tracking-wide"
                  style={{ color: "var(--b-text-tertiary)" }}
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-[12px] transition-colors"
                  style={{ color: "var(--b-accent-text)" }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required={!isDemo}
                className="w-full px-3 h-[40px] text-[13px] border outline-none transition-colors"
                style={{
                  background: "var(--b-bg-secondary)",
                  borderColor: "var(--b-border-strong)",
                  color: "var(--b-text)",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--b-accent-text)")}
                onBlur={e  => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
              />
            </div>

            {error && (
              <p className="text-[12px] font-[500]" style={{ color: "var(--destructive)" }}>{error}</p>
            )}

            {/* Primary CTA */}
            {isDemo ? (
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full h-[42px] flex items-center justify-center gap-2 text-[13.5px] font-[600] border transition-colors mt-2 b-btn-accent"
              >
                Enter Demo Workspace
                <ArrowRight className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[42px] flex items-center justify-center gap-2 text-[13.5px] font-[600] border transition-colors mt-2 b-btn-accent disabled:opacity-50"
              >
                {loading ? "Signing in…" : (
                  <>Sign in <ArrowRight className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /></>
                )}
              </button>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ background: "var(--b-border)" }} />
            <span className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--b-border)" }} />
          </div>

          {/* Secondary: get started */}
          <Link
            href="/signup"
            className="w-full h-[40px] flex items-center justify-center text-[13px] font-[500] border transition-colors b-btn-ghost"
          >
            Create an account
          </Link>

          <p className="text-center text-[11.5px] mt-6" style={{ color: "var(--b-text-muted)" }}>
            By signing in you agree to Briesa&apos;s{" "}
            <span className="underline cursor-pointer" style={{ color: "var(--b-text-tertiary)" }}>Terms of Service</span>
            {" "}and{" "}
            <span className="underline cursor-pointer" style={{ color: "var(--b-text-tertiary)" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
