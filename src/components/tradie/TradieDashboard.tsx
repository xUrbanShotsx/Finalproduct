"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ClipboardList, Shield, BadgeCheck, Bot, Plus,
  MapPin, Clock, CheckCircle2, AlertTriangle, ChevronRight,
  Wrench, Zap, FileText, Phone,
} from "lucide-react";

const YELLOW = "#ffd600";
const GREEN  = "#1a8a4a";
const RED    = "#f06060";

const TODAY_JOBS = [
  { id: 1, client: "Morrison Residence",  address: "14 Elm St, Mosman",        type: "Plumbing",   time: "7:30 AM",  status: "In Progress", hours: 3  },
  { id: 2, client: "Blue Bay Apartments", address: "88 Pacific Ave, Manly",     type: "Plumbing",   time: "1:00 PM",  status: "Scheduled",   hours: 2  },
  { id: 3, client: "Hendry Property",     address: "32 Outlook Dr, Balgowlah",  type: "Hot Water",  time: "4:30 PM",  status: "Scheduled",   hours: 1.5},
];

const RECENT_DOCS = [
  { name: "SWMS — Bathroom Reno", date: "Today",       type: "SWMS"       },
  { name: "Toolbox Talk — Site 01", date: "Yesterday", type: "Toolbox"    },
  { name: "Incident Report #003",   date: "12 Jun",    type: "Incident"   },
];

const LICENCE_ALERTS = [
  { name: "Plumbing Licence", expires: "30 Sep 2024", daysLeft: 100, status: "ok"     },
  { name: "White Card",       expires: "N/A",         daysLeft: 999, status: "ok"     },
  { name: "Public Liability", expires: "14 Jul 2024", daysLeft: 22,  status: "urgent" },
];

const QUICK_ACTIONS = [
  { label: "Log a Job",       icon: ClipboardList, href: "/tradie/jobs",      color: "var(--b-badge-blue-text)" },
  { label: "Generate SWMS",   icon: FileText,      href: "/tradie/safety",    color: YELLOW },
  { label: "Ask AI",          icon: Bot,           href: "/tradie/assistant", color: GREEN  },
  { label: "Add Licence",     icon: BadgeCheck,    href: "/tradie/licences",  color: "var(--b-badge-blue-text)" },
];

const STATUS_STYLE: Record<string, { color: string; bg: string }> = {
  "In Progress": { color: YELLOW,  bg: "rgba(255,214,0,0.1)"   },
  "Scheduled":   { color: "var(--b-badge-blue-text)", bg: "rgba(80,130,255,0.08)" },
  "Done":        { color: GREEN,   bg: "rgba(26,138,74,0.08)"  },
};

export function TradieDashboard() {
  const router = useRouter();
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  });
  const date = new Date().toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="p-5 max-w-[960px]">

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-[800] tracking-tight" style={{ color: "var(--b-text)" }}>
            {greeting}, Jye 👋
          </h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{date}</p>
        </div>
        <button
          onClick={() => router.push("/tradie/jobs")}
          className="flex items-center gap-1.5 px-4 h-9 text-[12.5px] font-[700]"
          style={{ background: YELLOW, color: "#0a0a0a" }}
        >
          <Plus className="w-3.5 h-3.5" /> New Job
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Jobs Today",    value: "3",   sub: "2 scheduled",         color: "var(--b-text)",       icon: ClipboardList },
          { label: "Hours Logged",  value: "6.5", sub: "this week",            color: YELLOW,                icon: Clock         },
          { label: "Safety Status", value: "OK",  sub: "SWMS current",        color: GREEN,                 icon: Shield        },
          { label: "Licence Alert", value: "1",   sub: "Public liability 22d", color: RED,                   icon: AlertTriangle },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="border px-4 py-3" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-3.5 h-3.5" style={{ color: s.color }} />
                <span className="text-[11px] font-[600]" style={{ color: "var(--b-text-muted)" }}>{s.label}</span>
              </div>
              <div className="text-[22px] font-[800] leading-none tracking-tight" style={{ color: s.color }}>{s.value}</div>
              <div className="text-[11px] mt-1" style={{ color: "var(--b-text-muted)" }}>{s.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid md:grid-cols-3 gap-4">

        {/* Today's schedule — spans 2 cols */}
        <div className="md:col-span-2 border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--b-border)" }}>
            <span className="text-[12px] font-[700]" style={{ color: "var(--b-text)" }}>Today&apos;s Schedule</span>
            <button onClick={() => router.push("/tradie/jobs")} className="text-[11px] font-[600] flex items-center gap-0.5" style={{ color: YELLOW }}>
              All jobs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y" style={{ borderColor: "var(--b-border)" }}>
            {TODAY_JOBS.map(job => {
              const st = STATUS_STYLE[job.status];
              return (
                <div key={job.id} className="flex items-center gap-3 px-4 py-3">
                  {/* Time */}
                  <div className="w-14 flex-shrink-0">
                    <p className="text-[11px] font-[700]" style={{ color: "var(--b-text-secondary)" }}>{job.time}</p>
                    <p className="text-[10px]" style={{ color: "var(--b-text-muted)" }}>{job.hours}h</p>
                  </div>
                  {/* Job info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12.5px] font-[600] truncate" style={{ color: "var(--b-text)" }}>{job.client}</p>
                    <p className="flex items-center gap-1 text-[11px] truncate" style={{ color: "var(--b-text-muted)" }}>
                      <MapPin className="w-3 h-3 flex-shrink-0" />{job.address}
                    </p>
                  </div>
                  {/* Type + status */}
                  <div className="flex-shrink-0 text-right">
                    <span className="text-[10.5px] font-[600] px-1.5 py-px" style={{ background: st.bg, color: st.color }}>{job.status}</span>
                    <p className="text-[10.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{job.type}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[12px] font-[700]" style={{ color: "var(--b-text)" }}>Quick Actions</span>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(a => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.label}
                    onClick={() => router.push(a.href)}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 border text-center transition-colors"
                    style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}
                    onMouseOver={e => { (e.currentTarget as HTMLElement).style.borderColor = YELLOW; (e.currentTarget as HTMLElement).style.background = "rgba(255,214,0,0.04)"; }}
                    onMouseOut={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"; (e.currentTarget as HTMLElement).style.background = "var(--b-bg-secondary)"; }}
                  >
                    <Icon className="w-4 h-4" style={{ color: a.color }} />
                    <span className="text-[10.5px] font-[600] leading-snug" style={{ color: "var(--b-text-secondary)" }}>{a.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Licence alerts */}
          <div className="border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
            <div className="px-4 py-3 border-b" style={{ borderColor: "var(--b-border)" }}>
              <span className="text-[12px] font-[700]" style={{ color: "var(--b-text)" }}>Licences</span>
            </div>
            <div className="divide-y" style={{ borderColor: "var(--b-border)" }}>
              {LICENCE_ALERTS.map(l => (
                <div key={l.name} className="flex items-center gap-2 px-4 py-2.5">
                  {l.status === "urgent"
                    ? <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: RED }} />
                    : <CheckCircle2  className="w-3.5 h-3.5 flex-shrink-0" style={{ color: GREEN }} />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-[500] truncate" style={{ color: "var(--b-text)" }}>{l.name}</p>
                    <p className="text-[10.5px]" style={{ color: l.status === "urgent" ? RED : "var(--b-text-muted)" }}>
                      {l.expires === "N/A" ? "No expiry" : `Expires ${l.expires}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI suggestion banner */}
      <div
        className="mt-4 flex items-center gap-3 px-4 py-3 border cursor-pointer transition-all"
        style={{ borderColor: "rgba(255,214,0,0.25)", background: "rgba(255,214,0,0.04)" }}
        onClick={() => router.push("/tradie/assistant")}
        onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,214,0,0.08)"; }}
        onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,214,0,0.04)"; }}
      >
        <Zap className="w-4 h-4 flex-shrink-0" style={{ color: YELLOW }} />
        <div className="flex-1">
          <p className="text-[12.5px] font-[700]" style={{ color: "var(--b-text)" }}>AI tip for today</p>
          <p className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>
            You have a hot water replacement at 4:30PM — want me to draft a SWMS for it?
          </p>
        </div>
        <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: YELLOW }} />
      </div>

      {/* Recent docs */}
      <div className="mt-4 border" style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: "var(--b-border)" }}>
          <span className="text-[12px] font-[700]" style={{ color: "var(--b-text)" }}>Recent Documents</span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--b-border)" }}>
          {RECENT_DOCS.map(d => (
            <div key={d.name} className="flex items-center gap-3 px-4 py-2.5">
              <FileText className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "var(--b-text-muted)" }} />
              <span className="flex-1 text-[12px]" style={{ color: "var(--b-text-secondary)" }}>{d.name}</span>
              <span className="text-[10.5px] px-1.5 py-px font-[600]" style={{ background: "var(--b-bg-active)", color: "var(--b-text-muted)" }}>{d.type}</span>
              <span className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency contacts */}
      <div className="mt-4 border px-4 py-3 flex flex-wrap gap-4" style={{ borderColor: "var(--b-border)", background: "var(--b-bg-secondary)" }}>
        <p className="text-[11px] font-[700] tracking-wide uppercase w-full" style={{ color: "var(--b-text-muted)" }}>Emergency Contacts</p>
        {[
          { label: "SafeWork NSW",    number: "13 10 50" },
          { label: "Emergency",       number: "000" },
          { label: "Poisons Info",    number: "13 11 26" },
        ].map(c => (
          <div key={c.label} className="flex items-center gap-2">
            <Phone className="w-3 h-3" style={{ color: YELLOW }} />
            <span className="text-[11.5px] font-[600]" style={{ color: "var(--b-text-secondary)" }}>{c.label}:</span>
            <span className="text-[11.5px] font-[700]" style={{ color: "var(--b-text)" }}>{c.number}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
