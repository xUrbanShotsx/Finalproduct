"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { HealthWellbeingDrawer } from "./HealthWellbeingDrawer";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td } from "../shared";

type CheckType = "Wellness Check" | "EAP Referral" | "Mental Health" | "Fatigue Screen" | "Return to Work";
type Outcome   = "Well" | "Follow-up Required" | "Referred" | "Monitoring" | "Escalated";

const CHECK_TYPE_COLORS: Record<CheckType, { bg: string; color: string }> = {
  "Wellness Check":   { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "EAP Referral":     { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Mental Health":    { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Fatigue Screen":   { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Return to Work":   { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
};

const OUTCOME_COLORS: Record<Outcome, { bg: string; color: string }> = {
  "Well":                { bg: "var(--b-badge-green-bg)",  color: "var(--b-badge-green-text)" },
  "Follow-up Required":  { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Referred":            { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Monitoring":          { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Escalated":           { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
};

const RECORDS: Array<{
  ref: string; worker: string; date: string; type: CheckType;
  conductedBy: string; outcome: Outcome; followUp: boolean; nextReview: string;
}> = [
  { ref: "HW-028", worker: "Anonymous #1",   date: "12 Jun 2024", type: "Mental Health",  conductedBy: "EAP Provider", outcome: "Referred",           followUp: true,  nextReview: "26 Jun 2024" },
  { ref: "HW-027", worker: "Marcus Chen",    date: "11 Jun 2024", type: "Fatigue Screen", conductedBy: "S. Walsh",     outcome: "Monitoring",         followUp: true,  nextReview: "18 Jun 2024" },
  { ref: "HW-026", worker: "James Tran",     date: "10 Jun 2024", type: "Wellness Check", conductedBy: "S. Walsh",     outcome: "Well",               followUp: false, nextReview: "10 Jul 2024" },
  { ref: "HW-025", worker: "Natalie Kim",    date: "07 Jun 2024", type: "Wellness Check", conductedBy: "M. Jones",     outcome: "Well",               followUp: false, nextReview: "07 Jul 2024" },
  { ref: "HW-024", worker: "Ryan O'Brien",   date: "05 Jun 2024", type: "Fatigue Screen", conductedBy: "S. Walsh",     outcome: "Follow-up Required", followUp: true,  nextReview: "12 Jun 2024" },
  { ref: "HW-023", worker: "Anonymous #2",   date: "03 Jun 2024", type: "EAP Referral",   conductedBy: "EAP Provider", outcome: "Referred",           followUp: true,  nextReview: "17 Jun 2024" },
  { ref: "HW-022", worker: "Lisa Nguyen",    date: "31 May 2024", type: "Wellness Check", conductedBy: "M. Jones",     outcome: "Well",               followUp: false, nextReview: "28 Jun 2024" },
  { ref: "HW-021", worker: "David Huang",    date: "29 May 2024", type: "Return to Work", conductedBy: "S. Walsh",     outcome: "Monitoring",         followUp: true,  nextReview: "12 Jun 2024" },
];

export function HealthWellbeingPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [rows, setRows] = useState(RECORDS);
  return (
    <>
    <PageShell
      back={{ href: "/people", label: "People" }}
      title="Health & Wellbeing"
      description="Worker wellness checks, mental health support and EAP engagement records."
      cta="Log Check-in"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            Log Check-in
          </button>
        }
      stats={
        <>
          <Stat label="This Month"      value="28" sub="check-ins conducted"          />
          <Stat label="Follow-up Needed" value="3"  sub="active monitoring"   highlight="yellow" />
          <Stat label="EAP Referrals"   value="2"  sub="this quarter"                            />
          <Stat label="Confidential"    value="4"  sub="anonymised records"                      />
        </>
      }
      tabs={["All", "Follow-up Required", "EAP Referrals", "Wellness Checks", "Fatigue Screens"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Worker</Th>
          <Th>Date</Th>
          <Th>Type</Th>
          <Th>Conducted By</Th>
          <Th>Outcome</Th>
          <Th>Follow-up</Th>
          <Th>Next Review</Th>
        </TableHead>
        <tbody>
          {rows.map((r) => {
            const typeStyle = CHECK_TYPE_COLORS[r.type];
            const outcomeStyle = OUTCOME_COLORS[r.outcome];
            return (
              <Tr key={r.ref}>
                <Td><span className="font-mono text-[12px]" style={{ color: "var(--b-text)" }}>{r.ref}</span></Td>
                <Td><span style={{ color: "var(--b-text)" }}>{r.worker}</span></Td>
                <Td muted>{r.date}</Td>
                <Td><Badge label={r.type} bg={typeStyle.bg} color={typeStyle.color} /></Td>
                <Td muted>{r.conductedBy}</Td>
                <Td><Badge label={r.outcome} bg={outcomeStyle.bg} color={outcomeStyle.color} /></Td>
                <Td>
                  {r.followUp
                    ? <Badge label="Yes" bg="var(--b-badge-yellow-bg)" color="var(--b-badge-yellow-text)" />
                    : <span style={{ color: "var(--b-text-muted)", fontSize: "12px" }}>—</span>}
                </Td>
                <Td muted>{r.nextReview}</Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <HealthWellbeingDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} onAdd={(f) => setRows(prev => {
      const base = RECORDS[0];
      const overlay = Object.fromEntries(Object.entries(f).filter(([k, v]) => k in (base as object) && v !== "")) as Partial<typeof base>;
      const idKey = ("ref" in (base as object) ? "ref" : Object.keys(base as object)[0]) as keyof typeof base;
      const prefix = String(base[idKey]).replace(/[-\s].*$/, "");
      return [{ ...base, ...overlay, [idKey]: `${prefix}-${1000 + prev.length}` } as (typeof RECORDS)[number], ...prev];
    })} />
    </>
  );
}