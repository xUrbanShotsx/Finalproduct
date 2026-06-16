"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { ToolboxDrawer } from "./ToolboxDrawer";
import { PageShell, Stat, Badge, TableHead, Th, Tr, Td } from "../shared";

const TOPIC_COLORS: Record<string, { bg: string; color: string }> = {
  "Silica Dust":         { bg: "rgba(240,96,96,0.1)",      color: "#f06060" },
  "Working at Heights":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
  "Manual Handling":     { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Emergency Procedures":{ bg: "rgba(240,96,96,0.15)",     color: "#f06060" },
  "Housekeeping":        { bg: "var(--b-bg-active)",        color: "var(--b-text-tertiary)" },
  "Electrical Safety":   { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Heat Stress":         { bg: "var(--b-badge-yellow-bg)", color: "var(--b-badge-yellow-text)" },
  "Traffic Management":  { bg: "var(--b-badge-blue-bg)",   color: "var(--b-badge-blue-text)" },
};

const RECORDS = [
  {
    ref: "TBX-240612-008",
    topic: "Silica Dust",
    presenter: "D. Wong",
    attendees: 14,
    site: "Site 01",
    date: "12 Jun 2024",
    signedOff: true,
  },
  {
    ref: "TBX-240610-007",
    topic: "Working at Heights",
    presenter: "S. Lee",
    attendees: 9,
    site: "Site 02",
    date: "10 Jun 2024",
    signedOff: true,
  },
  {
    ref: "TBX-240607-006",
    topic: "Manual Handling",
    presenter: "P. Nguyen",
    attendees: 11,
    site: "Site 01",
    date: "07 Jun 2024",
    signedOff: true,
  },
  {
    ref: "TBX-240605-005",
    topic: "Emergency Procedures",
    presenter: "S. Lee",
    attendees: 12,
    site: "Site 03",
    date: "05 Jun 2024",
    signedOff: false,
  },
  {
    ref: "TBX-240603-004",
    topic: "Housekeeping",
    presenter: "M. Jones",
    attendees: 7,
    site: "Site 02",
    date: "03 Jun 2024",
    signedOff: true,
  },
  {
    ref: "TBX-240531-003",
    topic: "Electrical Safety",
    presenter: "J. Smith",
    attendees: 8,
    site: "Site 01",
    date: "31 May 2024",
    signedOff: true,
  },
  {
    ref: "TBX-240529-002",
    topic: "Heat Stress",
    presenter: "K. Davis",
    attendees: 15,
    site: "Site 03",
    date: "29 May 2024",
    signedOff: true,
  },
  {
    ref: "TBX-240527-001",
    topic: "Traffic Management",
    presenter: "D. Wong",
    attendees: 10,
    site: "Site 02",
    date: "27 May 2024",
    signedOff: true,
  },
];

export function ToolboxPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const totalAttendees = RECORDS.reduce((s, r) => s + r.attendees, 0);

  return (
    <>
    <PageShell
      back={{ href: "/safety", label: "Safety" }}
      title="Toolbox"
      description="Toolbox talks, safety briefings and pre-start meeting records."
      cta="New Toolbox Talk"
        ctaSlot={
          <button onClick={() => setDrawerOpen(true)} className="b-btn-accent flex items-center gap-1.5 px-4 h-[34px] text-[12.5px] font-medium flex-shrink-0">
            <Plus className="w-3.5 h-3.5" style={{ color: "var(--b-accent-text)" }} />
            New Toolbox Talk
          </button>
        }
      stats={
        <>
          <Stat label="This Month" value={String(RECORDS.filter(r => r.date.includes("Jun")).length)} sub="8 talks recorded" />
          <Stat label="Total Attendees" value={String(totalAttendees)} sub="rolling 30 days" highlight="green" />
          <Stat label="Pending Sign-Off" value="1" sub="TBX-240605-005" highlight="yellow" />
          <Stat label="Topics Covered" value="8" sub="this month" />
        </>
      }
      tabs={["All", "This Month", "Pending Sign-Off", "Signed Off"]}
    >
      <table className="w-full">
        <TableHead>
          <Th>Reference</Th>
          <Th>Topic</Th>
          <Th>Presenter</Th>
          <Th right>Attendees</Th>
          <Th>Site</Th>
          <Th>Date</Th>
          <Th>Sign-Off</Th>
        </TableHead>
        <tbody>
          {RECORDS.map((r) => {
            const topicStyle = TOPIC_COLORS[r.topic] ?? {
              bg: "var(--b-bg-active)",
              color: "var(--b-text-tertiary)",
            };
            return (
              <Tr key={r.ref}>
                <Td>
                  <span className="font-mono text-[11px]" style={{ color: "var(--b-text)" }}>
                    {r.ref}
                  </span>
                </Td>
                <Td>
                  <Badge label={r.topic} bg={topicStyle.bg} color={topicStyle.color} />
                </Td>
                <Td muted>{r.presenter}</Td>
                <Td right>
                  <span style={{ color: "var(--b-text-secondary)", fontSize: "12.5px" }}>
                    {r.attendees}
                  </span>
                </Td>
                <Td muted>{r.site}</Td>
                <Td muted>{r.date}</Td>
                <Td>
                  {r.signedOff ? (
                    <Badge label="Signed Off" bg="var(--b-badge-green-bg)" color="var(--b-badge-green-text)" />
                  ) : (
                    <Badge label="Pending" bg="var(--b-badge-yellow-bg)" color="var(--b-badge-yellow-text)" />
                  )}
                </Td>
              </Tr>
            );
          })}
        </tbody>
      </table>
    </PageShell>
    <ToolboxDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}