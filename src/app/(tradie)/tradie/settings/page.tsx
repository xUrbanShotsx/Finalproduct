"use client";

import { TradieChrome } from "@/components/tradie/TradieChrome";
import { Zap, User, Bell, CreditCard } from "lucide-react";

const YELLOW = "#ffd600";

export default function TradieSettingsPage() {
  return (
    <TradieChrome>
      <div className="p-5 max-w-[640px]">
        <h1 className="text-[20px] font-[800] tracking-tight mb-5" style={{ color: "var(--b-text)" }}>Settings</h1>

        {/* Plan banner */}
        <div className="flex items-center gap-3 border px-4 py-3 mb-5" style={{ borderColor: "rgba(255,214,0,0.3)", background: "rgba(255,214,0,0.06)" }}>
          <Zap className="w-4 h-4 flex-shrink-0" style={{ color: YELLOW }} />
          <div className="flex-1">
            <p className="text-[12.5px] font-[700]" style={{ color: "var(--b-text)" }}>Briesa Tradie Plan</p>
            <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>$69/month · 100 AI calls · 5 GB storage · 1 user</p>
          </div>
          <button className="text-[11.5px] font-[700] px-3 h-8 border" style={{ borderColor: "rgba(255,214,0,0.4)", color: YELLOW }}>Upgrade</button>
        </div>

        {/* Profile */}
        <div className="border mb-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--b-border)" }}>
            <User className="w-3.5 h-3.5" style={{ color: YELLOW }} />
            <span className="text-[12px] font-[700]" style={{ color: "var(--b-text)" }}>Profile</span>
          </div>
          <div className="px-4 py-4 space-y-3">
            {[
              { label: "Full Name",       value: "Jake Sullivan",        type: "text"  },
              { label: "Trade",           value: "Licensed Plumber",     type: "text"  },
              { label: "Licence Number",  value: "PL-089423",           type: "text"  },
              { label: "Email",           value: "trady@com",            type: "email" },
              { label: "Phone",           value: "0412 345 678",         type: "tel"   },
              { label: "ABN",             value: "51 234 567 890",       type: "text"  },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-[10.5px] font-[700] uppercase tracking-wide mb-1" style={{ color: "var(--b-text-muted)" }}>{f.label}</label>
                <input type={f.type} defaultValue={f.value} className="w-full px-3 h-[34px] border text-[12.5px] outline-none" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border-strong)", color: "var(--b-text)" }} />
              </div>
            ))}
            <button className="mt-2 px-4 h-9 text-[12.5px] font-[700]" style={{ background: YELLOW, color: "#0a0a0a" }}>Save Changes</button>
          </div>
        </div>

        {/* Notifications */}
        <div className="border mb-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--b-border)" }}>
            <Bell className="w-3.5 h-3.5" style={{ color: YELLOW }} />
            <span className="text-[12px] font-[700]" style={{ color: "var(--b-text)" }}>Notifications</span>
          </div>
          <div className="px-4 py-4 space-y-3">
            {[
              { label: "Licence expiry reminders",   sub: "30 days and 7 days before" },
              { label: "Safety document due alerts",  sub: "SWMS review reminders"     },
              { label: "Weekly job summary",          sub: "Hours and jobs completed"  },
            ].map(n => (
              <div key={n.label} className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-[500]" style={{ color: "var(--b-text)" }}>{n.label}</p>
                  <p className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{n.sub}</p>
                </div>
                <div className="w-9 h-5 flex-shrink-0 border cursor-pointer" style={{ background: "rgba(255,214,0,0.12)", borderColor: "rgba(255,214,0,0.3)", position: "relative" }}>
                  <div className="absolute right-0.5 top-0.5 w-4 h-4" style={{ background: YELLOW }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Billing */}
        <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
          <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: "var(--b-border)" }}>
            <CreditCard className="w-3.5 h-3.5" style={{ color: YELLOW }} />
            <span className="text-[12px] font-[700]" style={{ color: "var(--b-text)" }}>Billing</span>
          </div>
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[12.5px] font-[600]" style={{ color: "var(--b-text)" }}>Tradie Plan — $69/month</p>
                <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>Next billing: 22 Jul 2024 · Visa ····4521</p>
              </div>
              <button className="text-[11.5px] font-[600] px-3 h-8 border" style={{ borderColor: "var(--b-border-strong)", color: "var(--b-text-muted)" }}>Manage</button>
            </div>
            <p className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>Cancel anytime — no lock-in contract.</p>
          </div>
        </div>
      </div>
    </TradieChrome>
  );
}
