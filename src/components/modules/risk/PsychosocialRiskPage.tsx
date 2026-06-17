"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PsychosocialRiskDrawer } from "./PsychosocialRiskDrawer";
import { PageShell, Stat, SeverityBadge, StatusBadge, Badge, TableHead, Th, Tr, Td } from "../shared";

const PSYCH_TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Job Demands":       { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Low Control":       { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Low Support":       { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Role Clarity":      { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Bullying":          { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Remote / Isolated": { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Trauma Exposure":   { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Fatigue":           { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
};

const RECORDS: Array<{
  ref: string; hazard: string; psType: string; group: string;
  riskLevel: "Critical" | "High" | "Medium" | "Low";
  controls: string; owner: string; lastReview: string;
  status: "Open" | "Active" | "Closed" | "Pending";
  anonymous: boolean; overdue: boolean;
}> = [
  { ref: "PSY-018", hazard: "High job demands — extended shift durations > 10h",        psType: "Fatigue",          group: "All workers",       riskLevel: "High",   controls: "Roster cap 10h, fatigue register, supervisor check", owner: "T. Walsh",  lastReview: "01 Jun 2024", status: "Active",  anonymous: false, overdue: false },
  { ref: "PSY-017", hazard: "Bullying complaint — 2 reports from crew (Site 01)",       psType: "Bullying",         group: "Site 01 crew",      riskLevel: "High",   controls: "Investigation open, interim work separation",        owner: "HR",        lastReview: "05 Jun 2024", status: "Open",    anonymous: true,  overdue: false },
  { ref: "PSY-016", hazard: "Post-incident trauma — INC-039 serious injury exposure",   psType: "Trauma Exposure",  group: "Incident witnesses",riskLevel: "High",   controls: "EAP referral, debrief session completed",            owner: "EAP",       lastReview: "10 Jun 2024", status: "Active",  anonymous: false, overdue: false },
  { ref: "PSY-015", hazard: "Low control — workers not consulted on schedule changes",  psType: "Low Control",      group: "Formwork crew",     riskLevel: "Medium", controls: "Consultation meeting scheduled",                    owner: "J. Smith",  lastReview: "15 May 2024", status: "Open",    anonymous: false, overdue: false },
  { ref: "PSY-014", hazard: "High demands — subcontractor under cost pressure",         psType: "Job Demands",      group: "Subcontractors",    riskLevel: "Medium", controls: "Meeting with subcontractor principal",               owner: "M. Jones",  lastReview: "10 May 2024", status: "Active",  anonymous: false, overdue: false },
  { ref: "PSY-013", hazard: "Low social support — FIFO workers on rotation",           psType: "Remote / Isolated",group: "FIFO workers",       riskLevel: "Medium", controls: "Check-in program, buddy system, EAP access",         owner: "T. Walsh",  lastReview: "05 May 2024", status: "Active",  anonymous: false, overdue: false },
  { ref: "PSY-012", hazard: "Role clarity — new workers not inducted to tasks",         psType: "Role Clarity",     group: "New starters",      riskLevel: "Low",    controls: "Induction review, buddy pairing",                   owner: "K. Davis",  lastReview: "01 May 2024", status: "Active",  anonymous: false, overdue: false },
  { ref: "PSY-011", hazard: "Low support — supervisor awareness gaps identified",       psType: "Low Support",      group: "All supervisors",   riskLevel: "Medium", controls: "Mental health first aid training scheduled",         owner: "HR",        lastReview: "01 Feb 2024", status: "Open",    anonymous: false, overdue: true  },
];

export function PsychosocialRiskPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  return (
    <>
    <PageShell
      back={{ href: "/risk", label: "Risk Management" }}
      title="Psychosocial Risk"
      description="Identify, assess and control psychosocial hazards affecting mental health at work."
      cta="Report Hazard"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Report Hazard
          </button>
        }
      stats={
        <>
          <Stat label="Active Hazards"    value="8"  sub="in register"                         />
          <Stat label="High Risk"         value="3"  sub="require priority action" highlight="red"    />
          <Stat label="Anonymous Reports" value="1"  sub="PSY-017"                highlight="yellow" />
          <Stat label="EAP Referrals"     value="2"  sub="this quarter"           highlight="green"  />
        </>
      }
      tabs={["All", "High Risk", "Open Investigation", "Closed"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Hazard</Th>
          <Th>Type</Th>
          <Th>Group Affected</Th>
          <Th>Risk Level</Th>
          <Th>Controls</Th>
          <Th>Owner</Th>
          <Th>Last Review</Th>
          <Th>Status</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => {
            const typeStyle = PSYCH_TYPE_COLORS[r.psType] ?? { bg: "var(--b-bg-active)", color: "var(--b-text-tertiary)" };
            return (
              <Tr key={r.ref}>
                <Td>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span>
                    {r.anonymous && <Badge label="Anon" bg="var(--b-badge-yellow-bg)" color="var(--b-badge-yellow-text)" />}
                  </div>
                </Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.hazard}</span></Td>
                <Td><Badge label={r.psType} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td muted>{r.group}</Td>
                <Td><SeverityBadge v={r.riskLevel} /></Td>
                <Td muted>{r.controls}</Td>
                <Td muted>{r.owner}</Td>
                <Td>
                  <span style={{ color: r.overdue ? "#f06060" : "var(--b-text-muted)", fontSize: "12.5px", fontWeight: r.overdue ? 600 : undefined }}>
                    {r.lastReview}{r.overdue ? " · overdue" : ""}
                  </span>
                </Td>
                <Td><StatusBadge v={r.status} /></Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <PsychosocialRiskDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}