"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--b-bg-canvas)" }}
    >
      <div className="w-full max-w-sm">
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

        <div
          className="border p-6"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}
        >
          <h2 className="text-[15px] font-semibold mb-1" style={{ color: "var(--b-text)" }}>Sign in</h2>
          <p className="text-[12.5px] mb-6" style={{ color: "var(--b-text-muted)" }}>
            Enter your credentials to access your dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }} htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com.au"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 h-10 text-[13px] border outline-none transition-colors"
                style={{
                  background: "var(--b-bg-hover)",
                  borderColor: "var(--b-border-strong)",
                  color: "var(--b-text)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium" style={{ color: "var(--b-text-tertiary)" }} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 h-10 text-[13px] border outline-none transition-colors"
                style={{
                  background: "var(--b-bg-hover)",
                  borderColor: "var(--b-border-strong)",
                  color: "var(--b-text)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--b-border-hover)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--b-border-strong)")}
              />
            </div>
            {error && <p className="text-[12px]" style={{ color: "var(--destructive)" }}>{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-[38px] text-[13px] font-semibold border transition-colors mt-2 disabled:opacity-50"
              style={{
                background: "var(--b-accent-bg)",
                borderColor: "var(--b-accent-border)",
                color: "var(--b-text)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg-hover)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border-hover)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--b-accent-bg)";
                (e.currentTarget as HTMLElement).style.borderColor = "var(--b-accent-border)";
              }}
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-center text-[12px] mt-5" style={{ color: "var(--b-text-muted)" }}>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="transition-colors"
              style={{ color: "var(--b-accent-text)" }}
            >
              Get started
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
