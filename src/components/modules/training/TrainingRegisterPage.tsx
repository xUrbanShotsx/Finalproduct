"use client";

import { useState } from "react";
import { Plus, CheckCircle2, Clock, XCircle, User, CalendarDays } from "lucide-react";
import { PageShell, Stat, Badge, StatusBadge } from "../shared";
import { TrainingRegisterDrawer } from "./TrainingRegisterDrawer";

type Result = "Pass" | "Fail" | "In Progress" | "Withdrawn";

const RECORDS = [
  { id: "TRN-031", worker: "J. Smith",   role: "Rigger",              course: "Working at Heights",     date: "10 Jun 2024", result: "Pass"        as Result, provider: "Altura Training",       certNo: "CERT-0610", expiry: "10 Jun 2026", daysToExpiry: 359  },
  { id: "TRN-030", worker: "M. Jones",   role: "Site Supervisor",     course: "Asbestos Awareness",     date: "05 Jun 2024", result: "Pass"        as Result, provider: "Asbestos Aware Pty Ltd",certNo: "CERT-0605", expiry: "05 Jun 2025", daysToExpiry: -11  },
  { id: "TRN-029", worker: "K. Davis",   role: "First Aid Officer",   course: "First Aid (HLTAID011)",  date: "01 Mar 2024", result: "Pass"        as Result, provider: "St John Ambulance",     certNo: "CERT-0301", expiry: "01 Mar 2027", daysToExpiry: 624  },
  { id: "TRN-028", worker: "L. Brown",   role: "Traffic Controller",  course: "Traffic Management L1",  date: "22 May 2024", result: "Pass"        as Result, provider: "NRSPP Training",        certNo: "CERT-0522", expiry: "22 May 2026", daysToExpiry: 340  },
  { id: "TRN-027", worker: "T. Walsh",   role: "Formwork Carpenter",  course: "Working at Heights",     date: "15 Apr 2024", result: "Pass"        as Result, provider: "Altura Training",       certNo: "CERT-0415", expiry: "15 Apr 2026", daysToExpiry: 303  },
  { id: "TRN-026", worker: "A. Chen",    role: "Apprentice",          course: "Manual Handling",        date: "—",           result: "In Progress" as Result, provider: "—",                     certNo: "—",         expiry: "—",          daysToExpiry: null },
  { id: "TRN-025", worker: "R. Patel",   role: "Confined Space Tech", course: "Confined Space Entry",   date: "03 Jun 2024", result: "Fail"        as Result, provider: "Confined Space Pty Ltd",certNo: "—",         expiry: "—",          daysToExpiry: null },
  { id: "TRN-024", worker: "S. Nguyen",  role: "Emergency Warden",    course: "Emergency Warden",       date: "20 May 2024", result: "Pass"        as Result, provider: "Fire & Safety Aust.",   certNo: "CERT-0520", expiry: "20 May 2027", daysToExpiry: 703  },
];

function ResultIcon({ result }: { result: Result }) {
  if (result === "Pass")        return <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--b-badge-green-text)" }} />;
  if (result === "Fail")        return <XCircle      className="w-3.5 h-3.5" style={{ color: "#f06060" }} />;
  if (result === "In Progress") return <Clock        className="w-3.5 h-3.5" style={{ color: "var(--b-badge-yellow-text)" }} />;
  return <Clock className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />;
}

const RESULT_BADGE: Record<Result, React.ReactNode> = {
  "Pass":        <Badge label="Pass"        bg="var(--b-badge-green-bg)"   color="var(--b-badge-green-text)" dot />,
  "Fail":        <Badge label="Fail"        bg="rgba(240,96,96,0.1)"       color="#f06060" dot />,
  "In Progress": <Badge label="In Progress" bg="var(--b-badge-yellow-bg)"  color="var(--b-badge-yellow-text)" dot />,
  "Withdrawn":   <Badge label="Withdrawn"   bg="var(--b-bg-active)"        color="var(--b-text-muted)" dot />,
};

export function TrainingRegisterPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <PageShell
        back={{ href: "/training", label: "Training" }}
        title="Training Register"
        description="Record and track completed training for all workers, contractors and visitors."
        cta="Record Training"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Record Training
          </button>
        }
        stats={
          <>
            <Stat label="Records This Month" value="8"   sub="across 8 workers"    highlight="green"  />
            <Stat label="Expired Certificates" value="1" sub="TRN-030 · M. Jones"  highlight="red"    />
            <Stat label="In Progress"         value="1"  sub="TRN-026 · A. Chen"   highlight="yellow" />
            <Stat label="Pass Rate (YTD)"     value="91%" sub="target: >85%"        highlight="green"  />
          </>
        }
        tabs={["All", "Pass", "In Progress", "Fail", "Expired"]}
      >
        <div className="space-y-0">
          {RECORDS.map(r => {
            const expired = r.daysToExpiry !== null && r.daysToExpiry < 0;
            const expiring = r.daysToExpiry !== null && r.daysToExpiry >= 0 && r.daysToExpiry <= 30;
            return (
              <div
                key={r.id}
                className="flex items-center border-b px-6 py-3 cursor-pointer transition-colors"
                style={{ borderColor: "var(--b-border)", background: expired ? "rgba(240,96,96,0.03)" : "var(--b-bg)" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--b-bg-hover)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = expired ? "rgba(240,96,96,0.03)" : "var(--b-bg)"}
              >
                {/* Worker */}
                <div className="flex items-center gap-2 w-44 flex-shrink-0">
                  <div className="w-7 h-7 flex items-center justify-center border" style={{ background: "var(--b-bg-secondary)", borderColor: "var(--b-border)" }}>
                    <User className="w-3.5 h-3.5" style={{ color: "var(--b-text-muted)" }} />
                  </div>
                  <div>
                    <div className="text-[12.5px] font-semibold" style={{ color: "var(--b-text)" }}>{r.worker}</div>
                    <div className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.role}</div>
                  </div>
                </div>

                {/* Course + ref */}
                <div className="flex-1 min-w-0 px-4">
                  <div className="text-[12.5px] font-medium truncate" style={{ color: "var(--b-text)" }}>{r.course}</div>
                  <div className="text-[11px]" style={{ color: "var(--b-text-muted)" }}>{r.id} · {r.provider}</div>
                </div>

                {/* Date */}
                <div className="w-28 flex-shrink-0 flex items-center gap-1.5" style={{ color: "var(--b-text-muted)" }}>
                  <CalendarDays className="w-3 h-3" />
                  <span className="text-[11.5px]">{r.date}</span>
                </div>

                {/* Result */}
                <div className="w-28 flex-shrink-0">{RESULT_BADGE[r.result]}</div>

                {/* Expiry */}
                <div className="w-32 flex-shrink-0 text-right">
                  {r.expiry !== "—" ? (
                    <span
                      className="text-[11.5px] font-medium px-2 py-0.5"
                      style={{
                        background: expired ? "rgba(240,96,96,0.1)" : expiring ? "var(--b-badge-yellow-bg)" : "transparent",
                        color: expired ? "#f06060" : expiring ? "var(--b-badge-yellow-text)" : "var(--b-text-muted)",
                      }}
                    >
                      {expired ? "Expired" : expiring ? `${r.daysToExpiry}d left` : r.expiry}
                    </span>
                  ) : (
                    <span className="text-[11.5px]" style={{ color: "var(--b-text-muted)" }}>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </PageShell>

      <TrainingRegisterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
