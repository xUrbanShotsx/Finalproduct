export const dynamic = "force-dynamic";

import { cookies } from "next/headers";
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
      className="flex-1 min-w-[150px] p-5 border"
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

type InsightItem = { type: string; typeBg: string; typeColor: string; confidence: string; title: string; body: string; action: string; href: string };
const AI_INSIGHTS: Record<Industry, InsightItem[]> = {
  construction: [
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
  ],
  industrial: [
    {
      type: "RISK",
      typeBg: "rgba(240,96,96,0.1)",
      typeColor: "#f06060",
      confidence: "96% confidence",
      title: "Benzene exposure limit breach risk",
      body: "2 workers in the chemical processing area are approaching the 0.5 ppm TWA limit. Shift patterns indicate an overexposure event within 3 days if controls aren't adjusted.",
      action: "View exposure records",
      href: "/compliance/exposure-monitoring",
    },
    {
      type: "OPPORTUNITY",
      typeBg: "var(--b-badge-yellow-bg)",
      typeColor: "var(--b-badge-yellow-text)",
      confidence: "89% confidence",
      title: "4 LOTO procedures need updating",
      body: "Recent plant modifications to Pump 3 and Conveyor B are not reflected in current LOTO procedures. Updating now avoids a non-conformance at the scheduled audit.",
      action: "Review LOTO",
      href: "/safety/loto",
    },
    {
      type: "TREND",
      typeBg: "var(--b-badge-green-bg)",
      typeColor: "var(--b-badge-green-text)",
      confidence: "88% confidence",
      title: "Permit-to-work compliance up 12%",
      body: "PTW completion rates have improved significantly since the new digital workflow rolled out. Zero overdue permits recorded in the last 10 working days.",
      action: "View permits",
      href: "/safety/permits-to-work",
    },
  ],
  facilities: [
    {
      type: "RISK",
      typeBg: "rgba(240,96,96,0.1)",
      typeColor: "#f06060",
      confidence: "93% confidence",
      title: "Essential safety measures due",
      body: "3 fire suppression systems and 2 emergency exit lights are overdue for their annual compliance inspection under the Building Act.",
      action: "View ESM register",
      href: "/compliance/essential-safety-measures",
    },
    {
      type: "OPPORTUNITY",
      typeBg: "var(--b-badge-yellow-bg)",
      typeColor: "var(--b-badge-yellow-text)",
      confidence: "90% confidence",
      title: "Quick win: +5 compliance points",
      body: "Closing 2 outstanding corrective actions from last month's audit would push your score from 79 → 84, clearing the next review threshold.",
      action: "View actions",
      href: "/safety/actions",
    },
    {
      type: "TREND",
      typeBg: "var(--b-badge-green-bg)",
      typeColor: "var(--b-badge-green-text)",
      confidence: "85% confidence",
      title: "Contractor induction rate improving",
      body: "Contractor induction completion is up 15% this quarter. All active contractors now have current site inductions on file.",
      action: "View inductions",
      href: "/people/inductions",
    },
  ],
};


const TASKS: Record<Industry, { id: string; label: string; sub: string }[]> = {
  construction: [
    { id: "POL-017",  label: "Approve POL-017 silica redline",       sub: "Draft · 2 reviewers waiting" },
    { id: "SWMS-103", label: "Sign off SWMS-103 revision",           sub: "Awaiting your signature" },
    { id: "INC-044",  label: "Close out INC-044 investigation",      sub: "Due today · 3 actions open" },
    { id: "AUD-12",   label: "Complete AUD-12 site audit",           sub: "Scheduled · Site 01" },
  ],
  industrial: [
    { id: "JSA-088",  label: "Review JSA for boiler maintenance",    sub: "Draft · approval required" },
    { id: "PTW-034",  label: "Issue PTW — confined space entry",     sub: "Awaiting your sign-off" },
    { id: "INC-044",  label: "Close out INC-044 investigation",      sub: "Due today · 3 actions open" },
    { id: "LOTO-019", label: "Verify LOTO procedure for Pump 3",     sub: "Post-modification review" },
  ],
  facilities: [
    { id: "ESM-007",  label: "Schedule ESM inspection — Level 3",    sub: "Overdue · compliance risk" },
    { id: "INC-031",  label: "Close out INC-031 slip/trip report",   sub: "Due today · 2 actions open" },
    { id: "AUD-08",   label: "Complete AUD-08 building audit",       sub: "Scheduled · Tower B" },
    { id: "ISO-012",  label: "Approve isolation plan — HVAC Unit 4", sub: "Maintenance scheduled tomorrow" },
  ],
};

type StatItem = { label: string; value: string; sub: string; icon: "file" | "alert" | "users"; tone: "green" | "red" | "yellow" | "blue" };

const STATS: Record<Industry, StatItem[]> = {
  construction: [
    { label: "Audit Readiness", value: "82%", sub: "+4 pts · 70 of 85",      icon: "file",  tone: "green" },
    { label: "Open Incidents",  value: "2",   sub: "1 high · 1 low",         icon: "alert", tone: "red" },
    { label: "SWMS Due",        value: "6",   sub: "next: SWMS-103",         icon: "file",  tone: "yellow" },
    { label: "Induction",       value: "94%", sub: "12 workers outstanding", icon: "users", tone: "blue" },
  ],
  industrial: [
    { label: "Audit Readiness",  value: "78%", sub: "+2 pts · 66 of 85",     icon: "file",  tone: "green" },
    { label: "Open Incidents",   value: "3",   sub: "2 high · 1 medium",     icon: "alert", tone: "red" },
    { label: "Permits to Work",  value: "4",   sub: "next: PTW-034",         icon: "file",  tone: "yellow" },
    { label: "Induction",        value: "91%", sub: "8 workers outstanding", icon: "users", tone: "blue" },
  ],
  facilities: [
    { label: "Audit Readiness", value: "79%", sub: "+3 pts · 67 of 85",     icon: "file",  tone: "green" },
    { label: "Open Incidents",  value: "2",   sub: "1 medium · 1 low",      icon: "alert", tone: "red" },
    { label: "ESM Due",         value: "5",   sub: "next: ESM-007",         icon: "file",  tone: "yellow" },
    { label: "Induction",       value: "96%", sub: "4 contractors outstanding", icon: "users", tone: "blue" },
  ],
};

type BannerData = { lead: React.ReactNode; workersInScope: string; artifacts: string };

const BANNER: Record<Industry, BannerData> = {
  construction: {
    lead: <>Silica exposure standard halved to 0.025 mg/m³. I&apos;ve drafted updates to 2 policies and 6 SWMS — review and approve in ~4 min.</>,
    workersInScope: "47",
    artifacts: "8",
  },
  industrial: {
    lead: <>Benzene TWA limit updated to 0.5 ppm under the model WHS Regulations. I&apos;ve flagged 4 JSAs and 2 SDS entries that reference benzene handling — review and approve in ~3 min.</>,
    workersInScope: "63",
    artifacts: "6",
  },
  facilities: {
    lead: <>Essential Safety Measures annual schedule is due. I&apos;ve compiled inspection records for 5 fire and emergency systems across 3 buildings — review and approve in ~3 min.</>,
    workersInScope: "38",
    artifacts: "5",
  },
};

type RegItem = { title: string; source: string; impact: string };

const REGULATION: Record<Industry, RegItem> = {
  construction: {
    title: "Silica dust — exposure standard halved to 0.025 mg/m³",
    source: "Safe Work Australia · Effective 20 Jun 2024",
    impact: "Tracking matrix impact — 6 SWMS, 2 policies",
  },
  industrial: {
    title: "Benzene TWA limit updated to 0.5 ppm — model WHS Regulations",
    source: "Safe Work Australia · Effective 1 Jul 2024",
    impact: "Tracking matrix impact — 4 JSAs, 2 SDS entries",
  },
  facilities: {
    title: "AS 1851 — essential safety measures servicing updated",
    source: "Standards Australia · Effective 1 Jul 2024",
    impact: "Tracking matrix impact — 5 ESM schedules, 1 policy",
  },
};

const STAT_ICON = { file: FileText, alert: AlertTriangle, users: Users } as const;
const STAT_TONE: Record<StatItem["tone"], React.CSSProperties> = {
  green:  { background: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  red:    { background: "rgba(240,96,96,0.1)",      color: "#f06060" },
  yellow: { background: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  blue:   { background: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const demoCookie  = cookieStore.get("b-demo-industry")?.value ?? "construction";

  let industry: Industry =
    demoCookie === "industrial" ? "industrial"
    : demoCookie === "facilities" ? "facilities"
    : "construction";

  if (SUPABASE_CONFIGURED) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const ctx = await getOrgContext(supabase, user.id, user.user_metadata as Record<string, string>);
      industry = ctx.industry;
    }
  }

  const insights = AI_INSIGHTS[industry];
  const tasks    = TASKS[industry];
  const stats    = STATS[industry];
  const banner   = BANNER[industry];
  const reg      = REGULATION[industry];

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
        <div className="hidden md:flex items-center gap-2">
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
      <div className="flex flex-wrap gap-4 mb-6">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} icon={STAT_ICON[s.icon]} iconStyle={STAT_TONE[s.tone]} />
        ))}
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
              {banner.lead}
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
          <div className="hidden md:flex gap-8 flex-shrink-0">
            <div className="text-right">
              <div className="text-[2rem] font-bold leading-none" style={{ color: "var(--b-text)" }}>{banner.workersInScope}</div>
              <div
                className="text-[10px] mt-1 uppercase tracking-wide"
                style={{ color: "var(--b-text-muted)" }}
              >
                Workers in scope
              </div>
            </div>
            <div className="text-right">
              <div className="text-[2rem] font-bold leading-none" style={{ color: "var(--b-text)" }}>{banner.artifacts}</div>
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
      <div className="mb-6 hidden md:block">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((insight) => (
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Regulation feed */}
        <div
          className="border p-5 hidden md:block"
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
                    {reg.title}
                  </span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5"
                    style={{ background: "rgba(240,96,96,0.1)", color: "#f06060" }}
                  >
                    HIGH
                  </span>
                </div>
                <div className="text-[12px]" style={{ color: "var(--b-text-muted)" }}>
                  {reg.source}
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>
                  {reg.impact}
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
            {tasks.map((task) => (
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
