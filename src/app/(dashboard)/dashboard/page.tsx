export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import { getOrgContext } from "@/lib/getOrgContext";
import type { Industry } from "@/config/modules";
import {
  AlertTriangle,
  FileText,
  Users,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
} from "lucide-react";

const SUPABASE_CONFIGURED =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_URL.startsWith("http");

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconStyle,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  iconStyle: React.CSSProperties;
}) {
  return (
    <div
      className="flex-1 min-w-0 p-5 border"
      style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}
    >
      <div className="flex items-start justify-between mb-3">
        <span
          className="text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: "var(--b-text-muted)" }}
        >
          {label}
        </span>
        <div className="w-7 h-7 flex items-center justify-center" style={iconStyle}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-[2.25rem] font-bold leading-none mb-2" style={{ color: "var(--b-text)" }}>
        {value}
      </div>
      <div className="text-[13px]" style={{ color: "var(--b-text-muted)" }}>{sub}</div>
    </div>
  );
}

const AI_INSIGHTS = [
  {
    type: "RISK",
    typeBg: "rgba(240,96,96,0.1)",
    typeColor: "#f06060",
    confidence: "94% confidence",
    title: "Licence expiry cluster detected",
    body: "3 workers on Site 03 have licences expiring within 14 days. Historical patterns suggest this commonly precedes non-compliance flags during audits.",
    action: "View workers",
    href: "/people/inductions",
  },
  {
    type: "OPPORTUNITY",
    typeBg: "var(--b-badge-yellow-bg)",
    typeColor: "var(--b-badge-yellow-text)",
    confidence: "91% confidence",
    title: "Quick win: +6 compliance points",
    body: "Uploading 2 missing documents and closing 1 corrective action would push the score from 82 → 88, crossing the next audit threshold.",
    action: "View actions",
    href: "/safety/actions",
  },
  {
    type: "TREND",
    typeBg: "var(--b-badge-green-bg)",
    typeColor: "var(--b-badge-green-text)",
    confidence: "87% confidence",
    title: "Training completion trending up",
    body: "Completion rate has risen 8% over 6 weeks. At this pace you'll reach 90% by end of month — ahead of the quarterly target.",
    action: "View training",
    href: "/training",
  },
];

const TASKS = [
  { id: "POL-017", label: "Approve POL-017 silica redline", sub: "Draft · 2 reviewers waiting" },
  { id: "SWMS-103", label: "Sign off SWMS-103 revision", sub: "Awaiting your signature" },
  { id: "INC-044", label: "Close out INC-044 investigation", sub: "Due today · 3 actions open" },
  { id: "AUD-12", label: "Complete AUD-12 site audit", sub: "Scheduled · Site 01" },
];

export default async function DashboardPage() {
  let industry: Industry = "construction";

  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const ctx = await getOrgContext(supabase, user.id, user.user_metadata as Record<string, string>);
      industry = ctx.industry;
    }
  }

  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="p-8 max-w-[1200px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "var(--b-text)" }}>Dashboard</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{today} · operational snapshot</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="b-icon-btn p-2 border" style={{ borderColor: "var(--b-border)" }}>
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="b-btn-ghost flex items-center gap-2 px-3 py-2 text-[13px]">
            <Clock className="w-3.5 h-3.5" />
            Last 24 hours
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="flex gap-4 mb-6">
        <StatCard
          label="Audit Readiness"
          value="82%"
          sub="+4 pts · 70 of 85"
          icon={FileText}
          iconStyle={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}
        />
        <StatCard
          label="Open Incidents"
          value="2"
          sub="1 high · 1 low"
          icon={AlertTriangle}
          iconStyle={{ background: "rgba(240,96,96,0.1)", color: "#f06060" }}
        />
        <StatCard
          label={industry === "construction" ? "SWMS Due" : "Permits Due"}
          value="6"
          sub="next: SWMS-103"
          icon={FileText}
          iconStyle={{ background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" }}
        />
        <StatCard
          label="Induction"
          value="94%"
          sub="12 workers outstanding"
          icon={Users}
          iconStyle={{ background: "var(--b-badge-blue-bg)", color: "var(--b-badge-blue-text)" }}
        />
      </div>

      {/* AI banner */}
      <div
        className="border p-5 mb-6"
        style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
              <span
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: "var(--b-text-muted)" }}
              >
                AI has one thing for you
              </span>
            </div>
            <p className="text-[14px] leading-relaxed" style={{ color: "var(--b-text-secondary)" }}>
              Silica exposure standard halved to 0.025 mg/m³. I&apos;ve drafted updates to 2 policies and
              6 SWMS — review and approve in ~4 min.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <button className="b-btn-accent flex items-center gap-1.5 px-4 h-[38px] text-[13px] font-semibold">
                Review drafts
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button className="b-btn-ghost px-4 h-[38px] text-[13px]">
                Not now
              </button>
            </div>
          </div>
          <div className="flex gap-8 flex-shrink-0">
            <div className="text-right">
              <div className="text-[2rem] font-bold leading-none" style={{ color: "var(--b-text)" }}>47</div>
              <div
                className="text-[10px] mt-1 uppercase tracking-wide"
                style={{ color: "var(--b-text-muted)" }}
              >
                Workers in scope
              </div>
            </div>
            <div className="text-right">
              <div className="text-[2rem] font-bold leading-none" style={{ color: "var(--b-text)" }}>8</div>
              <div
                className="text-[10px] mt-1 uppercase tracking-wide"
                style={{ color: "var(--b-text-muted)" }}
              >
                Artifacts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-4 h-4" style={{ color: "var(--b-accent-text)" }} />
          <span
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--b-text-tertiary)" }}
          >
            AI Insights
          </span>
          <span
            className="text-[10px] font-semibold px-2 py-0.5"
            style={{ background: "var(--b-badge-green-bg)", color: "var(--b-badge-green-text)" }}
          >
            3 NEW
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {AI_INSIGHTS.map((insight) => (
            <div
              key={insight.type}
              className="border p-5 flex flex-col"
              style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-[10px] font-semibold tracking-wider px-2 py-0.5"
                  style={{ background: insight.typeBg, color: insight.typeColor }}
                >
                  {insight.type}
                </span>
                <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>
                  {insight.confidence}
                </span>
              </div>
              <h3 className="text-[13.5px] font-semibold mb-2" style={{ color: "var(--b-text)" }}>
                {insight.title}
              </h3>
              <p className="text-[12.5px] leading-relaxed flex-1" style={{ color: "var(--b-text-muted)" }}>
                {insight.body}
              </p>
              <a
                href={insight.href}
                className="flex items-center gap-1 mt-4 text-[12.5px] transition-colors"
                style={{ color: "var(--b-accent-text)" }}
              >
                {insight.action}
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Regulation feed */}
        <div
          className="border p-5"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
              <span
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: "var(--b-text-muted)" }}
              >
                Regulation Feed
              </span>
            </div>
            <button
              className="flex items-center gap-1 text-[12px] transition-colors"
              style={{ color: "var(--b-text-muted)" }}
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div
                className="w-8 h-8 flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "var(--b-bg-active)" }}
              >
                <BookOpen className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13px] font-medium" style={{ color: "var(--b-text)" }}>
                    Silica dust — exposure standard halved to 0.025 mg/m³
                  </span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5"
                    style={{ background: "rgba(240,96,96,0.1)", color: "#f06060" }}
                  >
                    HIGH
                  </span>
                </div>
                <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>
                  Safe Work Australia · Effective 20 Jun 2024
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
                  Tracking matrix impact — 6 SWMS, 2 policies
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks today */}
        <div
          className="border p-5"
          style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" style={{ color: "var(--b-text-muted)" }} />
              <span
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{ color: "var(--b-text-muted)" }}
              >
                Your Tasks Today
              </span>
            </div>
            <span className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>4 of 24</span>
          </div>
          <div className="space-y-1">
            {TASKS.map((task) => (
              <button
                key={task.id}
                className="b-task-btn w-full flex items-center gap-3 px-3 py-2.5 text-left"
                style={{ color: "var(--b-text-secondary)" }}
              >
                <div
                  className="w-4 h-4 border flex-shrink-0"
                  style={{ borderColor: "var(--b-border-strong)" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] truncate" style={{ color: "var(--b-text-secondary)" }}>
                    {task.label}
                  </div>
                  <div className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
                    {task.sub}
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
