"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

function BLogo({ size = 28, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 400 425" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M400 315.018C400 375.709 350.801 424.908 290.11 424.908H115.751H0V284.249V225.641H8.79121H63.0037C91.6211 225.641 115.751 257.875 115.751 284.249V405.861L276.923 203.663H290.11C350.801 203.663 400 254.328 400 315.018Z" fill={color} />
      <path d="M334.066 102.564C334.066 159.209 288.146 205.128 231.502 205.128C181.099 205.128 165.568 168.498 165.568 143.59V16.1172L8.79121 227.106H0V0H231.502C288.146 0 334.066 45.9195 334.066 102.564Z" fill={color} />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (isDemo) { router.push("/dashboard"); return; }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT — full-bleed construction photo ── */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        {/* Photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=85"
          alt="Construction site"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient overlay — dark at top for logo, dark at bottom for tag */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0.65) 100%)",
          }}
        />

        {/* Top: logo + wordmark */}
        <div className="absolute top-8 left-8 flex items-center gap-3 z-10">
          <BLogo size={30} color="#3ecf8e" />
          <span className="text-[19px] font-[700] tracking-tight text-white">Briesa</span>
        </div>

        {/* Bottom: tagline */}
        <div className="absolute bottom-8 left-8 right-8 z-10 space-y-2">
          <p className="text-[22px] font-[700] leading-snug text-white">
            WHS management built<br />for Australian industry
          </p>
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)" }}>
            Construction · Industrial · Facilities
          </p>
        </div>
      </div>

      {/* ── RIGHT — login form ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-8 py-12"
        style={{ background: "var(--b-bg)" }}
      >
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2.5 mb-10">
          <BLogo size={26} color="var(--b-accent-text)" />
          <span className="text-[18px] font-[700]" style={{ color: "var(--b-text)" }}>Briesa</span>
        </div>

        <div className="w-full max-w-[360px]">

          {/* Back to landing */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[12.5px] mb-8"
            style={{ color: "var(--b-text-muted)", textDecoration: "none" }}
            onMouseOver={e => (e.currentTarget.style.color = "var(--b-text)")}
            onMouseOut={e => (e.currentTarget.style.color = "var(--b-text-muted)")}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to homepage
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-[24px] font-[700] tracking-tight" style={{ color: "var(--b-text)" }}>
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
                  No credentials needed — enter the workspace below.
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
                style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
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
                <button type="button" className="text-[12px]" style={{ color: "var(--b-accent-text)" }}>
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
                style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }}
                onFocus={e => (e.currentTarget.style.borderColor = "var(--b-accent-text)")}
                onBlur={e  => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
              />
            </div>

            {error && (
              <p className="text-[12px] font-[500]" style={{ color: "var(--destructive)" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[42px] flex items-center justify-center gap-2 text-[13.5px] font-[600] mt-2 b-btn-accent disabled:opacity-50"
            >
              {loading ? "Signing in…" : isDemo ? (
                <>Enter Demo Workspace <ArrowRight className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /></>
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: "var(--b-border)" }} />
            <span className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--b-border)" }} />
          </div>

          <Link
            href="/signup"
            className="w-full h-[40px] flex items-center justify-center text-[13px] font-[500] b-btn-ghost"
          >
            Create an account
          </Link>

          <p className="text-center text-[11.5px] mt-6" style={{ color: "var(--b-text-muted)" }}>
            By continuing you agree to Briesa&apos;s{" "}
            <span className="underline cursor-pointer" style={{ color: "var(--b-text-tertiary)" }}>Terms</span>
            {" "}&amp;{" "}
            <span className="underline cursor-pointer" style={{ color: "var(--b-text-tertiary)" }}>Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
