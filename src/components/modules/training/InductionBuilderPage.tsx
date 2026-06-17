"use client";

import { useState } from "react";
import { Plus, ClipboardList, Clock, Users, CheckCircle2 } from "lucide-react";
import { PageShell, Stat, Badge, matchesTab } from "../shared";
import { InductionBuilderDrawer } from "./InductionBuilderDrawer";

type IStatus = "Active" | "Draft" | "Archived";

const INDUCTIONS = [
  { id: "IND-001", title: "Site Safety Induction — Site 01",   industry: "Construction",  roles: "All site workers",         modules: 12, durationMin: 90,  signOff: "Digital",  status: "Active" as IStatus,  completions: 47 },
  { id: "IND-002", title: "Subcontractor Induction",           industry: "Construction",  roles: "Subcontractors",           modules: 6,  durationMin: 30,  signOff: "Digital",  status: "Active" as IStatus,  completions: 18 },
  { id: "IND-003", title: "Visitor Safety Briefing",           industry: "All Industries",roles: "Site visitors",            modules: 4,  durationMin: 15,  signOff: "Paper",    status: "Active" as IStatus,  completions: 63 },
  { id: "IND-004", title: "Emergency Procedures Induction",    industry: "Construction",  roles: "All workers",              modules: 5,  durationMin: 20,  signOff: "Digital",  status: "Active" as IStatus,  completions: 47 },
  { id: "IND-005", title: "Plant Operator Safety Induction",   industry: "Industrial",    roles: "Plant operators",          modules: 8,  durationMin: 45,  signOff: "Digital",  status: "Draft"  as IStatus,  completions: 0  },
  { id: "IND-006", title: "Facilities Contractor Induction",   industry: "Facilities",    roles: "Maintenance contractors",  modules: 7,  durationMin: 35,  signOff: "Digital",  status: "Active" as IStatus,  completions: 11 },
];

const IND_COLOR: Record<string, { bg: string; color: string }> = {
  "Construction":  { bg: "rgba(240,96,96,0.1)",    color: "#f06060" },
  "Industrial":    { bg: "var(--b-badge-blue-bg)", color: "var(--b-badge-blue-text)" },
  "Facilities":    { bg: "var(--b-badge-yellow-bg)",color: "var(--b-badge-yellow-text)" },
  "All Industries":{ bg: "var(--b-badge-green-bg)",color: "var(--b-badge-green-text)" },
};

export function InductionBuilderPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(INDUCTIONS);
  const [tab, setTab] = useState("");

  return (
    <>
      <PageShell
        back={{ href: "/training", label: "Training" }}
        title="Induction Builder"
        description="Build site and role-specific induction programs with AI-generated module content."
        cta="Build Induction"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Build Induction
          </button>
        }
        stats={
          <>
            <Stat label="Active Inductions"  value="5"  sub="across 3 industries"   highlight="green"  />
            <Stat label="Draft"              value="1"  sub="IND-005 in progress"    highlight="yellow" />
            <Stat label="Total Completions"  value="186" sub="all time"                                 />
            <Stat label="Avg. Duration"      value="39m" sub="per induction"                            />
          </>
        }
        tabs={["All", "Active", "Draft", "Archived"]}
      onTabChange={setTab}
      >
        <div className="p-6 space-y-3">
          {rows.filter(r => matchesTab(tab, r)).map(ind => {
            const ic = IND_COLOR[ind.industry] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-muted)" };
            return (
              <div
                key={ind.id}
                className="border flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors"
                style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border-hover)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"}
              >
                {/* Icon */}
                <div className="w-10 h-10 flex items-center justify-center border flex-shrink-0" style={{ background: ic.bg, borderColor: "transparent" }}>
                  <ClipboardList className="w-5 h-5" style={{ color: ic.color }} />
                </div>

                {/* Title + meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>{ind.id}</span>
                    <Badge label={ind.industry} bg={ic.bg} color={ic.color} />
                    {ind.status === "Draft" && <Badge label="Draft" bg="var(--b-bg-active)" color="var(--b-text-tertiary)" />}
                  </div>
                  <div className="text-[13px] font-semibold" style={{ color: "var(--b-text)" }}>{ind.title}</div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: "var(--b-text-muted)" }}>{ind.roles}</div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--b-text-secondary)" }}>
                      <ClipboardList className="w-3 h-3" />
                      <span className="font-semibold">{ind.modules}</span>
                    </div>
                    <div className="text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>modules</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--b-text-secondary)" }}>
                      <Clock className="w-3 h-3" />
                      <span className="font-semibold">{ind.durationMin}m</span>
                    </div>
                    <div className="text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>duration</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--b-text-secondary)" }}>
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="font-semibold">{ind.completions}</span>
                    </div>
                    <div className="text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[12px]" style={{ color: "var(--b-text-secondary)" }}>
                      {ind.signOff}
                    </div>
                    <div className="text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>sign-off</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PageShell>

      <InductionBuilderDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => [{
        ...INDUCTIONS[0],
        id: `IND-${String(100 + prev.length).padStart(3, "0")}`,
        title: f.title || "New induction",
        industry: f.industry || INDUCTIONS[0].industry,
        roles: f.roles || "—",
        signOff: f.signOff || INDUCTIONS[0].signOff,
        completions: 0,
      } as (typeof INDUCTIONS)[number], ...prev])} />
    </>
  );
}
