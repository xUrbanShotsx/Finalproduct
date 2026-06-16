"use client";

import { useState } from "react";
import { CreditCard, Download, CheckCircle2, ArrowRight, Zap, Shield, Users, BarChart3, ChevronRight } from "lucide-react";

const INVOICES = [
  { id: "INV-2024-06", date: "1 Jun 2024",  period: "Jun 2024",  amount: "$449.00", status: "Paid" },
  { id: "INV-2024-05", date: "1 May 2024",  period: "May 2024",  amount: "$449.00", status: "Paid" },
  { id: "INV-2024-04", date: "1 Apr 2024",  period: "Apr 2024",  amount: "$449.00", status: "Paid" },
  { id: "INV-2024-03", date: "1 Mar 2024",  period: "Mar 2024",  amount: "$249.00", status: "Paid" },
  { id: "INV-2024-02", date: "1 Feb 2024",  period: "Feb 2024",  amount: "$249.00", status: "Paid" },
  { id: "INV-2024-01", date: "1 Jan 2024",  period: "Jan 2024",  amount: "$249.00", status: "Paid" },
];

const PLANS = [
  {
    key: "small",
    name: "Small",
    price: "$249",
    period: "/ month",
    desc: "For small crews with 1–15 workers on site.",
    specs: ["25 GB storage", "100–300 docs/month", "500K AI tokens/month"],
    features: ["All 9 WHS modules", "Unlimited team members", "~150–300 AI calls/month", "Email support"],
    cta: "Downgrade",
    current: false,
    accent: false,
  },
  {
    key: "medium",
    name: "Medium",
    price: "$449",
    period: "/ month",
    desc: "For growing teams with 15–50 workers across sites.",
    specs: ["75 GB storage", "300–800 docs/month", "2M AI tokens/month"],
    features: ["All 9 WHS modules", "Unlimited team members", "~600–1,200 AI calls/month", "Priority support", "API access"],
    cta: "Current plan",
    current: true,
    accent: true,
  },
  {
    key: "large",
    name: "Large",
    price: "$649",
    period: "/ month",
    desc: "For large organisations with 50–200+ workers.",
    specs: ["200 GB storage", "800–2,500 docs/month", "6M AI tokens/month"],
    features: ["Everything in Medium", "~2,000–4,000 AI calls/month", "Dedicated account manager", "SSO & custom integrations", "On-site onboarding"],
    cta: "Upgrade",
    current: false,
    accent: false,
  },
];

export default function BillingPage() {
  const [cancelOpen, setCancelOpen] = useState(false);

  return (
    <div className="p-8 max-w-[1100px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Billing</h1>
        <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Manage your plan, payment method and invoices.</p>
      </div>

      {/* Current plan banner */}
      <div className="border mb-6 p-5 flex items-center justify-between" style={{ borderColor: "var(--b-accent-border)", background: "var(--b-accent-bg)" }}>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center border" style={{ background: "var(--b-bg)", borderColor: "var(--b-accent-border)" }}>
            <Zap className="w-5 h-5" style={{ color: "var(--b-accent-text)" }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-bold" style={{ color: "var(--b-text)" }}>Medium Plan</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5" style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>ACTIVE</span>
            </div>
            <div className="text-[12.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
              $449.00/month · 15–50 workers · 75 GB · 2M AI tokens · Next billing: <strong style={{ color: "var(--b-text)" }}>1 Jul 2024</strong>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 h-[34px] text-[12.5px] font-medium border" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-secondary)", background: "var(--b-bg)" }}>
            Manage plan
          </button>
          <button className="flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-semibold border" style={{ background: "#1a8a4a", borderColor: "#156a39", color: "#ffffff" }}>
            Upgrade to Large <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">

          {/* Payment method */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--b-border)" }}>
              <CreditCard className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
              <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Payment Method</span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 border flex items-center justify-center" style={{ background: "#1a1f71", borderColor: "var(--b-border)" }}>
                  <span className="text-[11px] font-bold text-white">VISA</span>
                </div>
                <div>
                  <div className="text-[13px] font-medium" style={{ color: "var(--b-text)" }}>Visa ending in 4242</div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Expires 09/2027 · Billing to demo@demoorg.com.au</div>
                </div>
              </div>
              <button className="px-4 h-[32px] text-[12px] font-medium border" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-secondary)", background: "var(--b-bg-secondary)" }}>
                Update
              </button>
            </div>
            <div className="px-5 pb-4">
              <button className="text-[12px]" style={{ color: "var(--b-accent-text)" }}>
                + Add payment method
              </button>
            </div>
          </div>

          {/* Invoice history */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Invoice History</span>
              <button className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--b-accent-text)" }}>
                <Download className="w-3 h-3" /> Download all
              </button>
            </div>
            {/* Header */}
            <div className="flex items-center px-5 py-2 border-b" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
              {["Invoice","Date","Period","Amount","Status",""].map((h, i) => (
                <div key={i} className={`text-[10px] font-semibold uppercase tracking-widest ${i === 0 ? "w-28" : i === 5 ? "w-8" : "flex-1"}`} style={{ color: "var(--b-text-muted)" }}>{h}</div>
              ))}
            </div>
            {INVOICES.map(inv => (
              <div
                key={inv.id}
                className="flex items-center px-5 py-3 border-b transition-colors"
                style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--b-bg-hover)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--b-bg)"}
              >
                <div className="w-28 font-mono text-[12px]" style={{ color: "var(--b-text-secondary)" }}>{inv.id}</div>
                <div className="flex-1 text-[12.5px]" style={{ color: "var(--b-text-secondary)" }}>{inv.date}</div>
                <div className="flex-1 text-[12.5px]" style={{ color: "var(--b-text-secondary)" }}>{inv.period}</div>
                <div className="flex-1 text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>{inv.amount}</div>
                <div className="flex-1">
                  <span className="flex items-center gap-1.5 text-[11.5px]">
                    <CheckCircle2 className="w-3 h-3" style={{ color: "var(--b-badge-green-text)" }} />
                    <span style={{ color: "var(--b-badge-green-text)" }}>Paid</span>
                  </span>
                </div>
                <div className="w-8">
                  <button style={{ color: "var(--b-text-muted)" }}>
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cancel */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-5 py-4">
              {!cancelOpen ? (
                <button onClick={() => setCancelOpen(true)} className="text-[12.5px]" style={{ color: "var(--b-text-muted)" }}>
                  Cancel subscription
                </button>
              ) : (
                <div>
                  <div className="text-[13px] font-semibold mb-1" style={{ color: "#f06060" }}>Cancel subscription?</div>
                  <p className="text-[12.5px] mb-4" style={{ color: "var(--b-text-muted)" }}>
                    Your plan will remain active until 1 Jul 2024. After that, you'll lose access to Pro features and your data will be read-only for 30 days.
                  </p>
                  <div className="flex gap-3">
                    <button className="px-4 h-[32px] border text-[12px] font-medium" style={{ borderColor: "#f06060", color: "#f06060" }}>
                      Yes, cancel
                    </button>
                    <button onClick={() => setCancelOpen(false)} className="px-4 h-[32px] border text-[12px]" style={{ borderColor: "var(--b-border)", color: "var(--b-text-muted)" }}>
                      Keep plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right — plan comparison */}
        <div className="space-y-4">
          {PLANS.map(plan => (
            <div
              key={plan.key}
              className="border p-4"
              style={{
                borderColor: plan.current ? "var(--b-accent-border)" : "var(--b-border)",
                background: plan.current ? "var(--b-accent-bg)" : "var(--b-bg)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-bold" style={{ color: "var(--b-text)" }}>{plan.name}</span>
                {plan.current && <span className="text-[9px] font-bold px-1.5 py-0.5" style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}>CURRENT</span>}
              </div>
              <div className="mb-2">
                <span className="text-[22px] font-bold" style={{ color: "var(--b-text)" }}>{plan.price}</span>
                <span className="text-[11.5px] ml-1" style={{ color: "var(--b-text-muted)" }}>{plan.period}</span>
              </div>
              <p className="text-[12px] mb-3" style={{ color: "var(--b-text-muted)" }}>{plan.desc}</p>
              {/* Specs */}
              <div className="mb-3 space-y-1">
                {plan.specs.map(s => (
                  <div key={s} className="text-[11px] px-2 py-1" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>
                    {s}
                  </div>
                ))}
              </div>
              <ul className="space-y-1.5 mb-4">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 flex-shrink-0 mt-0.5" style={{ color: "var(--b-badge-green-text)" }} />
                    <span className="text-[12px]" style={{ color: "var(--b-text-secondary)" }}>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full h-[32px] text-[12px] font-semibold border transition-colors"
                disabled={plan.current}
                style={{
                  background: plan.current ? "var(--b-bg-active)" : plan.accent ? "#1a8a4a" : "var(--b-bg-secondary)",
                  borderColor: plan.current ? "var(--b-border)" : plan.accent ? "#156a39" : "var(--b-border-strong)",
                  color: plan.current ? "var(--b-text-muted)" : plan.accent ? "#ffffff" : "var(--b-text-secondary)",
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
