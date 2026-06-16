export const dynamic = "force-dynamic";

import { BarChart3, FileText, Users, Database, Zap, TrendingUp, Calendar } from "lucide-react";

const MODULE_USAGE = [
  { module: "Safety",      records: 312, icon: "🛡", pct: 100, color: "#f06060"                    },
  { module: "Training",    records: 186, icon: "🎓", pct: 60,  color: "var(--b-badge-blue-text)"    },
  { module: "Compliance",  records: 144, icon: "✅", pct: 46,  color: "var(--b-badge-green-text)"   },
  { module: "Risk",        records: 98,  icon: "⚠",  pct: 31,  color: "var(--b-badge-yellow-text)"  },
  { module: "People",      records: 87,  icon: "👥", pct: 28,  color: "#b450c8"                     },
  { module: "Operations",  records: 74,  icon: "⚙",  pct: 24,  color: "var(--b-text-muted)"         },
];

const MONTHLY = [
  { month: "Jan", records: 198 },
  { month: "Feb", records: 211 },
  { month: "Mar", records: 244 },
  { month: "Apr", records: 219 },
  { month: "May", records: 288 },
  { month: "Jun", records: 312 },
];

const maxMonthly = Math.max(...MONTHLY.map(m => m.records));

function UsageBar({ label, used, max, color, unit = "" }: { label: string; used: number; max: number; color: string; unit?: string }) {
  const pct = Math.round((used / max) * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[13px] font-medium" style={{ color: "var(--b-text)" }}>{label}</span>
        <span className="text-[12.5px]" style={{ color: "var(--b-text-muted)" }}>
          <span style={{ color: pct > 80 ? "#f06060" : "var(--b-text)" }}>{used.toLocaleString()}{unit}</span>
          {" / "}{max.toLocaleString()}{unit}
          <span className="ml-2 text-[11px]" style={{ color: pct > 80 ? "#f06060" : "var(--b-text-muted)" }}>({pct}%)</span>
        </span>
      </div>
      <div className="h-2" style={{ background: "var(--b-bg-active)" }}>
        <div className="h-full transition-all" style={{ width: `${pct}%`, background: pct > 80 ? "#f06060" : color }} />
      </div>
    </div>
  );
}

export default function UsagePage() {
  return (
    <div className="p-8 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Usage</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>Platform usage metrics for your current billing period.</p>
        </div>
        <div className="flex items-center gap-2 text-[12.5px]" style={{ color: "var(--b-text-muted)" }}>
          <Calendar className="w-3.5 h-3.5" />
          Billing period: 1 Jun – 30 Jun 2024
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Records",   value: "901",    sub: "+88 vs last month",  icon: FileText, color: "var(--b-badge-green-text)",   bg: "var(--b-badge-green-bg)" },
          { label: "Active Users",    value: "7",      sub: "9 seats total",      icon: Users,    color: "var(--b-badge-blue-text)",    bg: "var(--b-badge-blue-bg)" },
          { label: "Storage Used",    value: "2.4 GB", sub: "of 10 GB",           icon: Database, color: "var(--b-badge-yellow-text)",  bg: "var(--b-badge-yellow-bg)" },
          { label: "API Calls",       value: "1,847",  sub: "this month",         icon: Zap,      color: "var(--b-accent-text)",        bg: "var(--b-accent-bg)" },
        ].map(s => (
          <div key={s.label} className="border p-5" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: "var(--b-text-muted)" }}>{s.label}</span>
              <div className="w-7 h-7 flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon className="w-3.5 h-3.5" style={{ color: s.color }} />
              </div>
            </div>
            <div className="text-[28px] font-bold leading-none mb-1.5" style={{ color: "var(--b-text)" }}>{s.value}</div>
            <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left — usage bars */}
        <div className="col-span-2 space-y-6">

          {/* Plan limits */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--b-border)" }}>
              <BarChart3 className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
              <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Plan Limits — Pro</span>
            </div>
            <div className="px-5 py-5 space-y-5">
              <UsageBar label="Records"        used={901}    max={5000}  color="var(--b-badge-green-text)" />
              <UsageBar label="Team Members"   used={9}      max={25}    color="var(--b-badge-blue-text)" />
              <UsageBar label="Storage"        used={2.4}    max={10}    color="var(--b-badge-yellow-text)" unit=" GB" />
              <UsageBar label="API Calls"      used={1847}   max={10000} color="var(--b-accent-text)" />
              <UsageBar label="AI Generations" used={284}    max={500}   color="#b450c8" />
            </div>
          </div>

          {/* Monthly chart */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-5 py-4 border-b flex items-center gap-2" style={{ borderColor: "var(--b-border)" }}>
              <TrendingUp className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
              <span className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>Records Created — Last 6 Months</span>
            </div>
            <div className="px-5 py-5">
              <div className="flex items-end gap-3 h-32">
                {MONTHLY.map(m => {
                  const h = Math.round((m.records / maxMonthly) * 100);
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                      <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{m.records}</span>
                      <div className="w-full" style={{ height: `${h}%`, background: m.month === "Jun" ? "var(--b-badge-green-text)" : "var(--b-bg-active)", minHeight: "4px" }} />
                      <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right — by module */}
        <div className="space-y-5">
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-4 py-3.5 border-b" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[12px] font-semibold" style={{ color: "var(--b-text)" }}>Records by Module</span>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--b-border)" }}>
              {MODULE_USAGE.map(m => (
                <div key={m.module} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px]">{m.icon}</span>
                      <span className="text-[12.5px] font-medium" style={{ color: "var(--b-text)" }}>{m.module}</span>
                    </div>
                    <span className="text-[12px] font-semibold" style={{ color: "var(--b-text-secondary)" }}>{m.records}</span>
                  </div>
                  <div className="h-1.5" style={{ background: "var(--b-bg-active)" }}>
                    <div className="h-full" style={{ width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI usage breakdown */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-4 py-3.5 border-b" style={{ borderColor: "var(--b-border)" }}>
              <div className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
                <span className="text-[12px] font-semibold" style={{ color: "var(--b-text)" }}>AI Generations</span>
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--b-border)" }}>
              {[
                { label: "Toolbox talks",     count: 98 },
                { label: "Course outlines",   count: 64 },
                { label: "Induction modules", count: 52 },
                { label: "SWMS descriptions", count: 38 },
                { label: "Licence suggestions",count: 32 },
              ].map(a => (
                <div key={a.label} className="px-4 py-2.5 flex items-center justify-between">
                  <span className="text-[12px]" style={{ color: "var(--b-text-secondary)" }}>{a.label}</span>
                  <span className="text-[12px] font-semibold" style={{ color: "var(--b-accent-text)" }}>{a.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
