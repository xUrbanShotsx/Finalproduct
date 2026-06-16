"use client";

import { useState } from "react";
import { Plus, Clock, Users, BookOpen, Monitor, LayoutList, Blend } from "lucide-react";
import { PageShell, Stat, Badge } from "../shared";
import { CourseBuilderDrawer } from "./CourseBuilderDrawer";

type Delivery = "Online" | "Face-to-Face" | "Blended";
type Status   = "Active" | "Draft" | "Archived";

const COURSES = [
  { id: "COUR-001", title: "Working at Heights — Awareness",    category: "Safety",              delivery: "Face-to-Face" as Delivery, durationHrs: 8,  enrolled: 12, status: "Active" as Status },
  { id: "COUR-002", title: "Asbestos Awareness",                category: "Compliance",           delivery: "Online"       as Delivery, durationHrs: 2,  enrolled: 28, status: "Active" as Status },
  { id: "COUR-003", title: "Traffic Management — Level 1",      category: "Safety",              delivery: "Blended"      as Delivery, durationHrs: 6,  enrolled: 8,  status: "Active" as Status },
  { id: "COUR-004", title: "Manual Handling & Ergonomics",      category: "Health & Wellbeing",  delivery: "Online"       as Delivery, durationHrs: 1,  enrolled: 45, status: "Active" as Status },
  { id: "COUR-005", title: "Confined Space Entry & Rescue",     category: "Safety",              delivery: "Face-to-Face" as Delivery, durationHrs: 16, enrolled: 5,  status: "Draft"  as Status },
  { id: "COUR-006", title: "First Aid (HLTAID011)",             category: "Safety",              delivery: "Face-to-Face" as Delivery, durationHrs: 12, enrolled: 10, status: "Active" as Status },
  { id: "COUR-007", title: "Emergency Warden — Chief Warden",  category: "Emergency Response",  delivery: "Blended"      as Delivery, durationHrs: 4,  enrolled: 4,  status: "Active" as Status },
  { id: "COUR-008", title: "Psychosocial Risk Awareness",       category: "Health & Wellbeing",  delivery: "Online"       as Delivery, durationHrs: 1,  enrolled: 31, status: "Active" as Status },
];

const CAT_COLOR: Record<string, { bg: string; color: string }> = {
  "Safety":             { bg: "rgba(240,96,96,0.1)",    color: "#f06060" },
  "Compliance":         { bg: "var(--b-badge-blue-bg)", color: "var(--b-badge-blue-text)" },
  "Health & Wellbeing": { bg: "var(--b-badge-green-bg)",color: "var(--b-badge-green-text)" },
  "Operations":         { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Emergency Response": { bg: "rgba(180,80,200,0.1)",   color: "#b450c8" },
  "Leadership":         { bg: "var(--b-bg-active)",     color: "var(--b-text-tertiary)" },
};

const DELIVERY_ICON: Record<Delivery, React.FC<{ className?: string }>> = {
  "Online":       Monitor,
  "Face-to-Face": Users,
  "Blended":      Blend,
};

export function CourseBuilderPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <PageShell
        back={{ href: "/training", label: "Training" }}
        title="Course Builder"
        description="Build and manage training courses, learning objectives and assessment criteria."
        cta="Build Course"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Build Course
          </button>
        }
        stats={
          <>
            <Stat label="Active Courses"  value="7"  sub="across 5 categories"   highlight="green"  />
            <Stat label="Draft"           value="1"  sub="COUR-005 in progress"  highlight="yellow" />
            <Stat label="Total Enrolled"  value="143" sub="unique enrolments"                       />
            <Stat label="Avg. Pass Rate"  value="91%" sub="last 90 days"         highlight="green"  />
          </>
        }
        tabs={["All", "Active", "Draft", "Archived"]}
      >
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {COURSES.map(c => {
            const catStyle = CAT_COLOR[c.category] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-muted)" };
            const DeliveryIcon = DELIVERY_ICON[c.delivery];
            return (
              <div
                key={c.id}
                className="border flex flex-col cursor-pointer transition-colors"
                style={{ borderColor: "var(--b-border)", background: "var(--b-bg)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border-hover)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--b-border)"}
              >
                {/* Card header */}
                <div className="px-4 pt-4 pb-3 border-b flex items-start justify-between gap-2" style={{ borderColor: "var(--b-border)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[10.5px]" style={{ color: "var(--b-text-muted)" }}>{c.id}</span>
                      {c.status === "Draft" && (
                        <Badge label="Draft" bg="var(--b-bg-active)" color="var(--b-text-tertiary)" />
                      )}
                    </div>
                    <div className="text-[13.5px] font-semibold leading-snug" style={{ color: "var(--b-text)" }}>{c.title}</div>
                  </div>
                  <div className="w-9 h-9 flex items-center justify-center border flex-shrink-0" style={{ background: catStyle.bg, borderColor: "transparent" }}>
                    <BookOpen className="w-4 h-4" style={{ color: catStyle.color }} />
                  </div>
                </div>

                {/* Meta */}
                <div className="px-4 py-3 flex-1 space-y-2">
                  <Badge label={c.category} bg={catStyle.bg} color={catStyle.color} />

                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--b-text-muted)" }}>
                      <Clock className="w-3 h-3" />
                      {c.durationHrs}h
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--b-text-muted)" }}>
                      <DeliveryIcon className="w-3 h-3" />
                      {c.delivery}
                    </span>
                    <span className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--b-text-muted)" }}>
                      <LayoutList className="w-3 h-3" />
                      {c.enrolled} enrolled
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </PageShell>

      <CourseBuilderDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
